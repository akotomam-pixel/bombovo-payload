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

// Extract the first SvozMisto ID from SvozyTam or SvozyZpet block in the response
function extractFirstSvozId(xml: string, svozTag: string): string | null {
  const svozBlock = extractTag(xml, svozTag)
  if (!svozBlock) return null
  const mistoBlock = extractTag(svozBlock, 'SvozMisto')
  if (!mistoBlock) return null
  return extractTag(mistoBlock, 'ID')
}

export async function POST(req: NextRequest) {
  let body: { id_Termin?: number; id_ZajezdHotel?: number; birthDates?: string[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { id_Termin, birthDates } = body
  let { id_ZajezdHotel } = body

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
    // ── Step 1: KalkulaceParametry — get transport options, hotel ID, discount params ──
    console.log('[kalkulace] Step 1: KalkulaceParametry for id_Termin:', id_Termin, 'id_ZajezdHotel:', id_ZajezdHotel)

    const hotelArrayXml = id_ZajezdHotel
      ? `<ns:id_ZajezdHotel><arr:int xmlns:arr="${ARR_NS}">${id_ZajezdHotel}</arr:int></ns:id_ZajezdHotel>`
      : ''

    const paramsRaw = await soapCall('Katalog', 'KalkulaceParametry', `${ctx}
      <ns:id_Termin>${id_Termin}</ns:id_Termin>
      ${hotelArrayXml}`)

    const paramsXml = paramsRaw._raw as string
    console.log('[kalkulace] KalkulaceParametry response:', paramsXml.slice(0, 3000))

    // Auto-extract id_ZajezdHotel from the response if not provided by client
    if (!id_ZajezdHotel) {
      const hotelId = extractTag(paramsXml, 'id_ZajezdHotel')
      if (hotelId) {
        id_ZajezdHotel = Number(hotelId)
        console.log('[kalkulace] Auto-extracted id_ZajezdHotel from KalkulaceParametry:', id_ZajezdHotel)
      }
    }

    // Extract svoz (shuttle/transport) options — the API requires at least one entry
    // when the camp has transport options configured
    const svozTamId = extractFirstSvozId(paramsXml, 'SvozyTam')
    const svozZpetId = extractFirstSvozId(paramsXml, 'SvozyZpet')
    console.log('[kalkulace] Svoz options - Tam:', svozTamId, 'Zpet:', svozZpetId)

    // Extract id_Ubytovani from KalkulaceParametry — Profis requires the real ID, not 0
    // The response has <Ubytovani><Ubytovani><ID>N</ID>...</Ubytovani></Ubytovani>
    const ubytovaniBlock = extractTag(paramsXml, 'Ubytovani')
    const id_Ubytovani = ubytovaniBlock ? Number(extractTag(ubytovaniBlock, 'ID') ?? '0') : 0
    console.log('[kalkulace] id_Ubytovani:', id_Ubytovani)

    // Extract id_TypStrava — required both inside RezervaceUbytovani and at ProduktInputBase level
    // The response has <Stravy><ZajezdStrava><TypStrava><ID>N</ID>...
    const typStravaBlock = extractTag(paramsXml, 'TypStrava')
    const id_TypStrava = typStravaBlock ? Number(extractTag(typStravaBlock, 'ID') ?? '0') : 0
    console.log('[kalkulace] id_TypStrava:', id_TypStrava)

    // Extract IDs of all Vychozi (default) discount parameter groups
    const skupinaBlocks = extractAll(paramsXml, 'SkupinaSlevaParametr')
    const defaultParamIds = skupinaBlocks
      .filter(b => extractTag(b, 'Vychozi') === 'true')
      .map(b => extractTag(b, 'id'))
      .filter(Boolean) as string[]
    console.log('[kalkulace] Default param IDs:', defaultParamIds)

    // ── Step 2: Kalkulace ─────────────────────────────────────────────────────
    // VlastniProduktTerminInput field order (base ProduktInputBase first):
    //   Base: Cestujici (C), Pojisteni (P), RezervaceDopravy (R,D), RezervaceUbytovani (R,U), Skipasy (S), id_TypStrava (i,T,S)
    //   Own:  id_SkupinaSlevaParametr (i,S), id_Termin (i,T)
    const dates = birthDates?.length ? birthDates : ['2010-01-01']
    const cestujiciXml = dates
      .map(
        (d, i) => `<ns:CestujiciInputBase i:type="ns:CestujiciNarozeniInput">
            <ns:ID>${-(i + 1)}</ns:ID>
            <ns:Narozeni>${toDateTime(d)}</ns:Narozeni>
          </ns:CestujiciInputBase>`,
      )
      .join('')

    // Build RezervaceDopravy entries. Profis requires explicit Tam and Zpet entries even for
    // camps with "vlastná doprava" (own transport, no shuttle). Each entry must list all
    // travelers via RezervaceDopravaCestujici (referencing their negative IDs from Cestujici).
    // XSD field order:
    //   Base RezervaceDopravaInputBase: Poznamka (P), RezervaceDopravaCestujici (R), id_SvozMisto (i,S)
    //   Own  RezervaceDopravaKalkulaceInput: Smer (S), id_Letiste (i,L)
    const cestujiciIds = dates.map((_, i) => -(i + 1))
    const dopravaCestujiciXml = cestujiciIds
      .map(id => `<ns:RezervaceDopravaCestujiciInput><ns:id_Cestujici>${id}</ns:id_Cestujici></ns:RezervaceDopravaCestujiciInput>`)
      .join('')

    const buildDopravyEntry = (smer: 'Tam' | 'Zpet', svozId: string | null) =>
      `<ns:RezervaceDopravaInputBase i:type="ns:RezervaceDopravaKalkulaceInput">
          <ns:RezervaceDopravaCestujici>${dopravaCestujiciXml}</ns:RezervaceDopravaCestujici>
          ${svozId ? `<ns:id_SvozMisto>${svozId}</ns:id_SvozMisto>` : ''}
          <ns:Smer>${smer}</ns:Smer>
        </ns:RezervaceDopravaInputBase>`

    const dopravyXml = `<ns:RezervaceDopravy>
        ${buildDopravyEntry('Tam', svozTamId)}
        ${buildDopravyEntry('Zpet', svozZpetId)}
      </ns:RezervaceDopravy>`

    // RezervaceUbytovaniKalkulaceInput field order:
    //   Base: Poznamka (P), RezervaceUbytovaniCestujici (R), id_TypStrava (i,T,S)
    //   Own:  id_Ubytovani (i,U), id_ZajezdHotel (i,Z)
    const ubytovaniCestujiciXml = cestujiciIds
      .map(id => `<ns:RezervaceUbytovaniCestujiciInput><ns:id_Cestujici>${id}</ns:id_Cestujici></ns:RezervaceUbytovaniCestujiciInput>`)
      .join('')

    const ubytovaniXml = id_ZajezdHotel
      ? `<ns:RezervaceUbytovani>
          <ns:RezervaceUbytovaniInputBase i:type="ns:RezervaceUbytovaniKalkulaceInput">
            <ns:RezervaceUbytovaniCestujici>${ubytovaniCestujiciXml}</ns:RezervaceUbytovaniCestujici>
            <ns:id_TypStrava>${id_TypStrava}</ns:id_TypStrava>
            <ns:id_Ubytovani>${id_Ubytovani}</ns:id_Ubytovani>
            <ns:id_ZajezdHotel>${id_ZajezdHotel}</ns:id_ZajezdHotel>
          </ns:RezervaceUbytovaniInputBase>
        </ns:RezervaceUbytovani>`
      : ''

    const slevaParamXml = defaultParamIds.length
      ? `<ns:id_SkupinaSlevaParametr>${defaultParamIds.map(id => `<arr:int xmlns:arr="${ARR_NS}">${id}</arr:int>`).join('')}</ns:id_SkupinaSlevaParametr>`
      : ''

    console.log('[kalkulace] Step 2: Kalkulace with id_Termin:', id_Termin, 'id_ZajezdHotel:', id_ZajezdHotel)
    console.log('[kalkulace] ubytovaniXml:', ubytovaniXml.slice(0, 500))
    console.log('[kalkulace] dopravyXml:', dopravyXml.slice(0, 500))
    const raw = await soapCall('Katalog', 'Kalkulace', `${ctx}
      <ns:Data>
        <ns:Cestujici>
          ${cestujiciXml}
        </ns:Cestujici>
        <ns:Pojisteni/>
        ${dopravyXml}
        ${ubytovaniXml}
        <ns:Skipasy/>
        <ns:id_TypStrava>${id_TypStrava}</ns:id_TypStrava>
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
      // Forward transport, hotel and accommodation IDs to the client for the order call
      svozTamId: svozTamId ? Number(svozTamId) : null,
      svozZpetId: svozZpetId ? Number(svozZpetId) : null,
      resolvedHotelId: id_ZajezdHotel ?? null,
      id_Ubytovani,
      id_TypStrava,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[profitour/kalkulace] Error:', message)
    return NextResponse.json({ error: 'Kalkulace failed: ' + message }, { status: 500 })
  }
}
