import { NextRequest, NextResponse } from 'next/server'
import { soapCall, extractTag } from '@/lib/profis'

const ARR_NS = 'http://schemas.microsoft.com/2003/10/Serialization/Arrays'

function extractAll(xml: string, tag: string): string[] {
  const regex = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'g')
  const results: string[] = []
  let match: RegExpExecArray | null
  while ((match = regex.exec(xml)) !== null) {
    results.push(match[0])
  }
  return results
}

const toDateTime = (iso: string) => {
  if (!iso) return '2000-01-01T00:00:00'
  if (iso.includes('.')) {
    const [d, m, y] = iso.split('.')
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T00:00:00`
  }
  return `${iso}T00:00:00`
}

export async function POST(req: NextRequest) {
  let body: { id_Termin?: number; id_ZajezdHotel?: number; birthDates?: string[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { id_Termin, id_ZajezdHotel, birthDates } = body
  if (!id_Termin) {
    return NextResponse.json({ error: 'Missing required field: id_Termin' }, { status: 400 })
  }

  const ctx = `
      <ns:Context>
        <ns:UzivatelHeslo>${process.env.PROFIS_HESLO}</ns:UzivatelHeslo>
        <ns:UzivatelLogin>${process.env.PROFIS_LOGIN}</ns:UzivatelLogin>
        <ns:VypsatNazvy>true</ns:VypsatNazvy>
        <ns:id_Jazyk>${process.env.PROFIS_ID_JAZYK}</ns:id_Jazyk>
        <ns:id_Republika>${process.env.PROFIS_ID_REPUBLIKA}</ns:id_Republika>
        <ns:Rezim>${process.env.PROFIS_REZIM}</ns:Rezim>
      </ns:Context>`

  try {
    // ── Step 1: KalkulaceParametry — get default discount parameter IDs ───────
    // Field order (DataContractSerializer): Context (C) → id_Termin (i,T) → id_ZajezdHotel (i,Z)
    console.log('[kalkulace] Step 1: KalkulaceParametry for id_Termin:', id_Termin, 'id_ZajezdHotel:', id_ZajezdHotel)

    const hotelArrayXml = id_ZajezdHotel
      ? `<ns:id_ZajezdHotel><arr:int xmlns:arr="${ARR_NS}">${id_ZajezdHotel}</arr:int></ns:id_ZajezdHotel>`
      : ''

    const paramsRaw = await soapCall('Katalog', 'KalkulaceParametry', `${ctx}
      <ns:id_Termin>${id_Termin}</ns:id_Termin>
      ${hotelArrayXml}`)

    const paramsXml = paramsRaw._raw as string
    console.log('[kalkulace] KalkulaceParametry response:', paramsXml.slice(0, 1000))

    // Extract IDs of all Vychozi (default) discount parameter groups
    const skupinaBlocks = extractAll(paramsXml, 'SkupinaSlevaParametr')
    const defaultParamIds = skupinaBlocks
      .filter(b => extractTag(b, 'Vychozi') === 'true')
      .map(b => extractTag(b, 'id'))
      .filter(Boolean) as string[]
    console.log('[kalkulace] Default param IDs:', defaultParamIds)

    // ── Step 2: Kalkulace with RezervaceUbytovani + CestujiciNarozeniInput ────
    // VlastniProduktTerminInput field order:
    //   Base ProduktInputBase: Cestujici (C), RezervaceUbytovani (R,U)
    //   Own VlastniProduktTerminInput: id_SkupinaSlevaParametr (i,S), id_Termin (i,T)
    const dates = birthDates?.length ? birthDates : ['2010-01-01']
    const cestujiciXml = dates
      .map(
        (d, i) => `<ns:CestujiciInputBase i:type="ns:CestujiciNarozeniInput">
            <ns:ID>${-(i + 1)}</ns:ID>
            <ns:Narozeni>${toDateTime(d)}</ns:Narozeni>
          </ns:CestujiciInputBase>`,
      )
      .join('')

    // RezervaceUbytovaniKalkulaceInput field order:
    //   Base (Poznamka, RezervaceUbytovaniCestujici, id_TypStrava) — all skipped as optional
    //   Own: id_Ubytovani (i,U), id_ZajezdHotel (i,Z)
    const ubytovaniXml = id_ZajezdHotel
      ? `<ns:RezervaceUbytovani>
          <ns:RezervaceUbytovaniInputBase i:type="ns:RezervaceUbytovaniKalkulaceInput">
            <ns:id_Ubytovani>0</ns:id_Ubytovani>
            <ns:id_ZajezdHotel>${id_ZajezdHotel}</ns:id_ZajezdHotel>
          </ns:RezervaceUbytovaniInputBase>
        </ns:RezervaceUbytovani>`
      : ''

    const slevaParamXml = defaultParamIds.length
      ? `<ns:id_SkupinaSlevaParametr>${defaultParamIds.map(id => `<arr:int xmlns:arr="${ARR_NS}">${id}</arr:int>`).join('')}</ns:id_SkupinaSlevaParametr>`
      : ''

    console.log('[kalkulace] Step 2: Kalkulace with id_Termin:', id_Termin)
    const raw = await soapCall('Katalog', 'Kalkulace', `${ctx}
      <ns:Data>
        <ns:Cestujici>
          ${cestujiciXml}
        </ns:Cestujici>
        ${ubytovaniXml}
        ${slevaParamXml}
        <ns:id_Termin>${id_Termin}</ns:id_Termin>
      </ns:Data>`)

    const xml = raw._raw as string
    console.log('[kalkulace] Kalkulace response:', xml.slice(0, 800))

    const rawKombinace = extractTag(xml, 'id_SkupinaSlevaKombinace')

    return NextResponse.json({
      kalkulace: {
        celkemCena: extractTag(xml, 'CelkemCena'),
        cenaOsoba: extractTag(xml, 'CenaOsoba'),
        id_SkupinaSlevaKombinace: rawKombinace ? Number(rawKombinace) : 0,
        mena: extractTag(xml, 'Mena'),
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[profitour/kalkulace] Error:', message)
    return NextResponse.json({ error: 'Kalkulace failed: ' + message }, { status: 500 })
  }
}
