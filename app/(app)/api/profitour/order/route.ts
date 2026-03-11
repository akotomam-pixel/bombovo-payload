import { NextRequest, NextResponse } from 'next/server'
import { soapCall, extractTag, escapeXml } from '@/lib/profis'

export async function POST(req: NextRequest) {
  let input: {
    id_Termin?: number
    id_ZajezdHotel?: number
    id_SkupinaSlevaKombinace?: number
    jmeno?: string
    prijmeni?: string
    email?: string
    telefon?: string
    ulice?: string
    mesto?: string
    psc?: string
    cestujici?: Array<{ datumNarozeni: string }>
    poznamka?: string
    url?: string
  }

  try {
    input = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const required = ['id_Termin', 'jmeno', 'prijmeni', 'email', 'telefon'] as const
  for (const field of required) {
    if (!input[field]) return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
  }
  if (!input.cestujici?.length) {
    return NextResponse.json({ error: 'cestujici (travelers) array is required' }, { status: 400 })
  }

  const ex = escapeXml

  const toDateTime = (iso: string) => {
    if (!iso) return '2000-01-01T00:00:00'
    if (iso.includes('.')) {
      const [d, m, y] = iso.split('.')
      return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T00:00:00`
    }
    return `${iso}T00:00:00`
  }

  // CestujiciNarozeniInput: only birth date, no gender needed.
  // Base CestujiciInputBase: ID (negative per docs)
  // Own CestujiciNarozeniInput: Narozeni
  const cestujiciXml = input.cestujici!
    .map(
      (c, i) => `<ns:CestujiciInputBase i:type="ns:CestujiciNarozeniInput">
          <ns:ID>${-(i + 1)}</ns:ID>
          <ns:Narozeni>${toDateTime(c.datumNarozeni)}</ns:Narozeni>
        </ns:CestujiciInputBase>`,
    )
    .join('')

  // RezervaceUbytovaniKalkulaceInput: base fields (optional, skipped), own: id_Ubytovani (i,U), id_ZajezdHotel (i,Z)
  const ubytovaniXml = input.id_ZajezdHotel
    ? `<ns:RezervaceUbytovani>
          <ns:RezervaceUbytovaniInputBase i:type="ns:RezervaceUbytovaniKalkulaceInput">
            <ns:id_Ubytovani>0</ns:id_Ubytovani>
            <ns:id_ZajezdHotel>${input.id_ZajezdHotel}</ns:id_ZajezdHotel>
          </ns:RezervaceUbytovaniInputBase>
        </ns:RezervaceUbytovani>`
    : ''

  try {
    console.log('[order] Calling Profis Objednat with id_Termin:', input.id_Termin, 'id_ZajezdHotel:', input.id_ZajezdHotel, 'id_SkupinaSlevaKombinace:', input.id_SkupinaSlevaKombinace)
    // Objednat: Context + Data (ObjednavkaTerminInput)
    //
    // ObjednavkaTerminInput extends ObjednavkaInputBase.
    // DataContractSerializer field order (base class first, alphabetical within each level):
    //   Base ObjednavkaInputBase: Objednatel (O), PoznamkaKlient (P,K), Produkt (P,r), URL (U),
    //                             id_Agentura (i,A), id_ObjednavkaZdroj (i,O), id_Organizace (i,Or)
    //   Own ObjednavkaTerminInput: NepovinneCeny (N), id_SkupinaSlevaKombinace (i,S)
    //
    // Produkt is VlastniProduktTerminInput (extends ProduktInputBase):
    //   Base ProduktInputBase field order: Cestujici (C), RezervaceDopravy (R,D), RezervaceUbytovani (R,U)
    //   Own VlastniProduktTerminInput: id_Termin (i,T)
    //
    // ObjednatResult returns: ID (int) and Klic (string)
    const raw = await soapCall('Objednavka', 'Objednat', `
      <ns:Context>
        <ns:UzivatelHeslo>${process.env.PROFIS_HESLO}</ns:UzivatelHeslo>
        <ns:UzivatelLogin>${process.env.PROFIS_LOGIN}</ns:UzivatelLogin>
        <ns:VypsatNazvy>true</ns:VypsatNazvy>
        <ns:id_Jazyk>${process.env.PROFIS_ID_JAZYK}</ns:id_Jazyk>
        <ns:id_Republika>${process.env.PROFIS_ID_REPUBLIKA}</ns:id_Republika>
        <ns:Rezim>${process.env.PROFIS_REZIM}</ns:Rezim>
      </ns:Context>
      <ns:Data i:type="ns:ObjednavkaTerminInput">
        <ns:Objednatel i:type="ns:KlientDataInput">
          <ns:Adresa i:type="ns:AdresaZahranicniInput">
            <ns:Ulice>${ex(input.ulice ?? '')}</ns:Ulice>
            <ns:Obec>${ex(input.mesto ?? '')}</ns:Obec>
            <ns:PSC>${ex(input.psc ?? '')}</ns:PSC>
          </ns:Adresa>
          <ns:Email>${ex(input.email!)}</ns:Email>
          <ns:Jmeno>${ex(input.jmeno!)}</ns:Jmeno>
          <ns:Prijmeni>${ex(input.prijmeni!)}</ns:Prijmeni>
          <ns:Telefon>${ex(input.telefon!)}</ns:Telefon>
          <ns:id_Pohlavi>F</ns:id_Pohlavi>
        </ns:Objednatel>
        <ns:PoznamkaKlient>${ex(input.poznamka ?? '')}</ns:PoznamkaKlient>
        <ns:Produkt i:type="ns:VlastniProduktTerminInput">
          <ns:Cestujici>
            ${cestujiciXml}
          </ns:Cestujici>
          <ns:RezervaceDopravy/>
          ${ubytovaniXml}
          <ns:id_Termin>${input.id_Termin}</ns:id_Termin>
        </ns:Produkt>
        <ns:URL>${ex(input.url ?? 'https://bombovo.sk')}</ns:URL>
        <ns:id_Agentura>0</ns:id_Agentura>
        <ns:id_ObjednavkaZdroj>1</ns:id_ObjednavkaZdroj>
        <ns:id_Organizace>${process.env.PROFIS_ID_ORGANIZACE}</ns:id_Organizace>
        <ns:NepovinneCeny/>
        <ns:id_SkupinaSlevaKombinace>${input.id_SkupinaSlevaKombinace ?? 0}</ns:id_SkupinaSlevaKombinace>
      </ns:Data>`)

    const xml = raw._raw as string
    console.log('[order] Response XML:', xml.slice(0, 800))

    // ObjednatResult fields are ID (int) and Klic (string) — confirmed from XSD schema
    const id = extractTag(xml, 'ID')
    const klic = extractTag(xml, 'Klic')

    if (!id || !klic) {
      console.error('[profitour/order] Unexpected response (missing ID or Klic):', xml.slice(0, 800))
      return NextResponse.json(
        { error: 'Order created but could not extract ID/Klic from response' },
        { status: 500 },
      )
    }

    return NextResponse.json({ id_Objednavka: Number(id), klic })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[profitour/order] Error:', message)
    return NextResponse.json({ error: 'Objednat failed: ' + message }, { status: 500 })
  }
}
