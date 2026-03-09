/**
 * POST /api/profitour/order
 *
 * Creates a new order in ProfisXML.
 * IMPORTANT: Every successful call to this endpoint MUST be followed by a call
 * to /api/profitour/order/complete — otherwise the order is left in a pending state.
 *
 * Body: ObjednatInput (see lib/profis.ts)
 * Returns: { id_Objednavka, id_Klic } — pass these to /order/complete
 */
import { NextRequest, NextResponse } from 'next/server'
import { soapCall, extractTag } from '@/lib/profis'

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

  const required = [
    'id_Termin', 'id_ZajezdHotel', 'id_SkupinaSlevaKombinace',
    'jmeno', 'prijmeni', 'email', 'telefon',
  ] as const

  for (const field of required) {
    if (!input[field]) {
      return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
    }
  }

  if (!input.cestujici || input.cestujici.length === 0) {
    return NextResponse.json({ error: 'cestujici (travelers) array is required' }, { status: 400 })
  }

  const ex = (s: string) => escapeXmlInternal(s)

  const cestujiciXml = input.cestujici!.map((c, i) => `
    <CestujiciInput>
      <Poradi>${i + 1}</Poradi>
      <Jmeno>${ex(c.jmeno)}</Jmeno>
      <Prijmeni>${ex(c.prijmeni)}</Prijmeni>
      <DatumNarozeni>${c.datumNarozeni}</DatumNarozeni>
    </CestujiciInput>`).join('')

  try {
    const raw = await soapCall(
      'Objednavka',
      'Objednat',
      `<Context>
        <UzivatelLogin>${process.env.PROFIS_LOGIN}</UzivatelLogin>
        <UzivatelHeslo>${process.env.PROFIS_HESLO}</UzivatelHeslo>
        <id_Jazyk>${process.env.PROFIS_ID_JAZYK}</id_Jazyk>
        <id_Republika>${process.env.PROFIS_ID_REPUBLIKA}</id_Republika>
        <Rezim>${process.env.PROFIS_REZIM}</Rezim>
        <VypsatNazvy>true</VypsatNazvy>
      </Context>
      <Data>
        <id_Organizace>${process.env.PROFIS_ID_ORGANIZACE}</id_Organizace>
        <id_ObjednavkaZdroj>1</id_ObjednavkaZdroj>
        <id_Agentura>0</id_Agentura>
        <URL>${ex(input.url ?? 'https://bombovo.sk')}</URL>
        <PoznamkaKlient>${ex(input.poznamka ?? '')}</PoznamkaKlient>
        <Objednatel>
          <KlientData>
            <Jmeno>${ex(input.jmeno!)}</Jmeno>
            <Prijmeni>${ex(input.prijmeni!)}</Prijmeni>
            <Email>${ex(input.email!)}</Email>
            <Telefon>${ex(input.telefon!)}</Telefon>
            <Ulice>${ex(input.ulice ?? '')}</Ulice>
            <Mesto>${ex(input.mesto ?? '')}</Mesto>
            <PSC>${ex(input.psc ?? '')}</PSC>
          </KlientData>
        </Objednatel>
        <Produkt>
          <VlastniProduktTermin>
            <id_Termin>${input.id_Termin}</id_Termin>
            <HotelList>
              <id_ZajezdHotel>${input.id_ZajezdHotel}</id_ZajezdHotel>
            </HotelList>
            <id_SkupinaSlevaKombinace>${input.id_SkupinaSlevaKombinace}</id_SkupinaSlevaKombinace>
            <NepovinneCeny />
          </VlastniProduktTermin>
        </Produkt>
        <CestujiciList>
          ${cestujiciXml}
        </CestujiciList>
      </Data>`,
    )

    const xml = raw._raw as string
    const id_Objednavka = extractTag(xml, 'id_Objednavka')
    const id_Klic = extractTag(xml, 'id_Klic')

    if (!id_Objednavka || !id_Klic) {
      console.error('[profitour/order] Unexpected response:', xml.slice(0, 500))
      return NextResponse.json(
        { error: 'Order created but could not extract id_Objednavka/id_Klic from response' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      id_Objednavka: Number(id_Objednavka),
      id_Klic: Number(id_Klic),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[profitour/order] Error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

function escapeXmlInternal(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
