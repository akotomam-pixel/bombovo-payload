import { NextRequest, NextResponse } from 'next/server'
import { soapCall, extractTag, escapeXml } from '@/lib/profis'

export async function POST(req: NextRequest) {
  let input: {
    id_Termin?: number
    id_ZajezdHotel?: number
    id_SkupinaSlevaKombinace?: number
    pocetOsob?: number
    jmeno?: string
    prijmeni?: string
    email?: string
    telefon?: string
    ulice?: string
    mesto?: string
    psc?: string
    cestujici?: Array<{ jmeno: string; prijmeni: string; datumNarozeni: string }>
    poznamka?: string
    url?: string
  }

  try {
    input = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const required = ['id_Termin', 'id_ZajezdHotel', 'id_SkupinaSlevaKombinace', 'jmeno', 'prijmeni', 'email', 'telefon'] as const
  for (const field of required) {
    if (!input[field]) return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
  }
  if (!input.cestujici?.length) {
    return NextResponse.json({ error: 'cestujici (travelers) array is required' }, { status: 400 })
  }

  const ex = escapeXml
  const cestujiciXml = input.cestujici!
    .map(
      (c, i) => `<ns:CestujiciInput>
        <ns:Poradi>${i + 1}</ns:Poradi>
        <ns:Jmeno>${ex(c.jmeno)}</ns:Jmeno>
        <ns:Prijmeni>${ex(c.prijmeni)}</ns:Prijmeni>
        <ns:DatumNarozeni>${c.datumNarozeni}</ns:DatumNarozeni>
      </ns:CestujiciInput>`,
    )
    .join('')

  try {
    const raw = await soapCall('Objednavka', 'Objednat', `
      <ns:Context>
        <ns:UzivatelHeslo>${process.env.PROFIS_HESLO}</ns:UzivatelHeslo>
        <ns:UzivatelLogin>${process.env.PROFIS_LOGIN}</ns:UzivatelLogin>
        <ns:VypsatNazvy>true</ns:VypsatNazvy>
        <ns:id_Jazyk>${process.env.PROFIS_ID_JAZYK}</ns:id_Jazyk>
        <ns:id_Republika>${process.env.PROFIS_ID_REPUBLIKA}</ns:id_Republika>
        <ns:Rezim>${process.env.PROFIS_REZIM}</ns:Rezim>
      </ns:Context>
      <ns:Data>
        <ns:id_Organizace>${process.env.PROFIS_ID_ORGANIZACE}</ns:id_Organizace>
        <ns:id_ObjednavkaZdroj>1</ns:id_ObjednavkaZdroj>
        <ns:id_Agentura>0</ns:id_Agentura>
        <ns:URL>${ex(input.url ?? 'https://bombovo.sk')}</ns:URL>
        <ns:PoznamkaKlient>${ex(input.poznamka ?? '')}</ns:PoznamkaKlient>
        <ns:Objednatel>
          <ns:KlientData>
            <ns:Jmeno>${ex(input.jmeno!)}</ns:Jmeno>
            <ns:Prijmeni>${ex(input.prijmeni!)}</ns:Prijmeni>
            <ns:Email>${ex(input.email!)}</ns:Email>
            <ns:Telefon>${ex(input.telefon!)}</ns:Telefon>
            <ns:Ulice>${ex(input.ulice ?? '')}</ns:Ulice>
            <ns:Mesto>${ex(input.mesto ?? '')}</ns:Mesto>
            <ns:PSC>${ex(input.psc ?? '')}</ns:PSC>
          </ns:KlientData>
        </ns:Objednatel>
        <ns:Produkt>
          <ns:VlastniProduktTermin>
            <ns:id_Termin>${input.id_Termin}</ns:id_Termin>
            <ns:HotelList>
              <ns:id_ZajezdHotel>${input.id_ZajezdHotel}</ns:id_ZajezdHotel>
            </ns:HotelList>
            <ns:id_SkupinaSlevaKombinace>${input.id_SkupinaSlevaKombinace}</ns:id_SkupinaSlevaKombinace>
            <ns:NepovinneCeny/>
          </ns:VlastniProduktTermin>
        </ns:Produkt>
        <ns:CestujiciList>
          ${cestujiciXml}
        </ns:CestujiciList>
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
