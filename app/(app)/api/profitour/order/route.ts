import { NextRequest, NextResponse } from 'next/server'
import { soapCall, extractTag, escapeXml } from '@/lib/profis'

export async function POST(req: NextRequest) {
  let input: {
    id_Termin?: number
    id_SkupinaSlevaKombinace?: number
    jmeno?: string
    prijmeni?: string
    email?: string
    telefon?: string
    ulice?: string
    mesto?: string
    psc?: string
    // datumNarozeni is expected as YYYY-MM-DD (HTML date input format)
    cestujici?: Array<{ jmeno: string; prijmeni: string; datumNarozeni: string }>
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

  // Convert YYYY-MM-DD to xs:dateTime format required by WCF DataContractSerializer
  const toDateTime = (iso: string) => {
    if (!iso) return '2000-01-01T00:00:00'
    // Handle both YYYY-MM-DD and DD.MM.YYYY formats
    if (iso.includes('.')) {
      const [d, m, y] = iso.split('.')
      return `${y}-${m}-${d}T00:00:00`
    }
    return `${iso}T00:00:00`
  }

  // Build travelers XML using correct WCF types with i:type for polymorphism.
  // CestujiciInputBase.ID (base) → CestujiciKlientInput.Klient (own)
  // Klient is KlientDataInput with fields in ordinal order: Jmeno, Narozeni, Prijmeni
  const cestujiciXml = input.cestujici!
    .map(
      (c) => `<ns:CestujiciInputBase i:type="ns:CestujiciKlientInput">
          <ns:ID>0</ns:ID>
          <ns:Klient i:type="ns:KlientDataInput">
            <ns:Jmeno>${ex(c.jmeno)}</ns:Jmeno>
            <ns:Narozeni>${toDateTime(c.datumNarozeni)}</ns:Narozeni>
            <ns:Prijmeni>${ex(c.prijmeni)}</ns:Prijmeni>
          </ns:Klient>
        </ns:CestujiciInputBase>`,
    )
    .join('')

  try {
    // Objednat: Context + Data (ObjednavkaTerminInput)
    //
    // ObjednavkaTerminInput extends ObjednavkaInputBase.
    // DataContractSerializer field order (base class first, alphabetical within each level):
    //   Base ObjednavkaInputBase: Objednatel, PoznamkaKlient, PoznamkaObjednavka, Produkt, URL,
    //                             id_Agentura, id_AgenturaPobocka, id_ObjednavkaZdroj, id_Organizace
    //   Own ObjednavkaTerminInput: NepovinneCeny, id_SkupinaSlevaKombinace
    //
    // Produkt is VlastniProduktTerminInput (extends ProduktInputBase):
    //   Base ProduktInputBase: Cestujici, Pojisteni, RezervaceDopravy, RezervaceUbytovani, Skipasy, id_TypStrava
    //   Own VlastniProduktTerminInput: id_SkupinaSlevaParametr, id_Termin
    //
    // Polymorphic types use i:type (XSD instance type) per WCF DataContractSerializer convention.
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
        </ns:Objednatel>
        <ns:PoznamkaKlient>${ex(input.poznamka ?? '')}</ns:PoznamkaKlient>
        <ns:Produkt i:type="ns:VlastniProduktTerminInput">
          <ns:Cestujici>
            ${cestujiciXml}
          </ns:Cestujici>
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
    const id_Objednavka = extractTag(xml, 'id_Objednavka')
    const id_Klic = extractTag(xml, 'id_Klic')

    if (!id_Objednavka || !id_Klic) {
      console.error('[profitour/order] Unexpected response:', xml.slice(0, 500))
      return NextResponse.json(
        { error: 'Order created but could not extract id_Objednavka/id_Klic' },
        { status: 500 },
      )
    }

    return NextResponse.json({ id_Objednavka: Number(id_Objednavka), id_Klic: Number(id_Klic) })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[profitour/order] Error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
