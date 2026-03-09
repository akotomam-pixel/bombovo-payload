import { NextRequest, NextResponse } from 'next/server'
import { soapCall, extractTag } from '@/lib/profis'

export async function POST(req: NextRequest) {
  let body: { id_Termin?: number; id_ZajezdHotel?: number; pocetOsob?: number }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { id_Termin, id_ZajezdHotel, pocetOsob } = body
  if (!id_Termin || !id_ZajezdHotel || !pocetOsob) {
    return NextResponse.json(
      { error: 'Missing required fields: id_Termin, id_ZajezdHotel, pocetOsob' },
      { status: 400 },
    )
  }

  try {
    const raw = await soapCall('Katalog', 'Kalkulace', `
      <ns:Context>
        <ns:UzivatelHeslo>${process.env.PROFIS_HESLO}</ns:UzivatelHeslo>
        <ns:UzivatelLogin>${process.env.PROFIS_LOGIN}</ns:UzivatelLogin>
        <ns:VypsatNazvy>true</ns:VypsatNazvy>
        <ns:id_Jazyk>${process.env.PROFIS_ID_JAZYK}</ns:id_Jazyk>
        <ns:id_Republika>${process.env.PROFIS_ID_REPUBLIKA}</ns:id_Republika>
        <ns:Rezim>${process.env.PROFIS_REZIM}</ns:Rezim>
      </ns:Context>
      <ns:Termin>
        <ns:id_Termin>${id_Termin}</ns:id_Termin>
        <ns:HotelList>
          <ns:id_ZajezdHotel>${id_ZajezdHotel}</ns:id_ZajezdHotel>
        </ns:HotelList>
        <ns:Smery/>
        <ns:TypStravy/>
        <ns:TypUbytovani/>
        <ns:Pojisteni/>
        <ns:Skipas/>
        <ns:NepovinneCenyList/>
        <ns:PocetOsob>${pocetOsob}</ns:PocetOsob>
        <ns:PocetDeti>0</ns:PocetDeti>
        <ns:PocetDospelych>${pocetOsob}</ns:PocetDospelych>
      </ns:Termin>`)

    const xml = raw._raw as string
    return NextResponse.json({
      kalkulace: {
        celkemCena: extractTag(xml, 'CelkemCena'),
        cenaOsoba: extractTag(xml, 'CenaOsoba'),
        id_SkupinaSlevaKombinace: extractTag(xml, 'id_SkupinaSlevaKombinace'),
        mena: extractTag(xml, 'Mena'),
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[profitour/kalkulace] Error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
