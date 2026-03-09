/**
 * POST /api/profitour/kalkulace
 *
 * Body: { id_Termin: number, id_ZajezdHotel: number, pocetOsob: number }
 *
 * Returns calculated price and id_SkupinaSlevaKombinace needed for order submission.
 */
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
    const raw = await soapCall(
      'Katalog',
      'Kalkulace',
      `<Context>
        <UzivatelLogin>${process.env.PROFIS_LOGIN}</UzivatelLogin>
        <UzivatelHeslo>${process.env.PROFIS_HESLO}</UzivatelHeslo>
        <id_Jazyk>${process.env.PROFIS_ID_JAZYK}</id_Jazyk>
        <id_Republika>${process.env.PROFIS_ID_REPUBLIKA}</id_Republika>
        <Rezim>${process.env.PROFIS_REZIM}</Rezim>
        <VypsatNazvy>true</VypsatNazvy>
      </Context>
      <Termin>
        <id_Termin>${id_Termin}</id_Termin>
        <HotelList>
          <id_ZajezdHotel>${id_ZajezdHotel}</id_ZajezdHotel>
        </HotelList>
        <Smery />
        <TypStravy />
        <TypUbytovani />
        <Pojisteni />
        <Skipas />
        <NepovinneCenyList />
        <PocetOsob>${pocetOsob}</PocetOsob>
        <PocetDeti>0</PocetDeti>
        <PocetDospelych>${pocetOsob}</PocetDospelych>
      </Termin>`,
    )

    const xml = raw._raw as string

    const result = {
      celkemCena: extractTag(xml, 'CelkemCena'),
      cenaOsoba: extractTag(xml, 'CenaOsoba'),
      id_SkupinaSlevaKombinace: extractTag(xml, 'id_SkupinaSlevaKombinace'),
      mena: extractTag(xml, 'Mena'),
    }

    return NextResponse.json({ kalkulace: result })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[profitour/kalkulace] Error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
