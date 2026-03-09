import { NextRequest, NextResponse } from 'next/server'
import { soapCall, extractTag } from '@/lib/profis'

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: 'Missing or invalid id parameter' }, { status: 400 })
  }

  try {
    const raw = await soapCall('Katalog', 'TerminDetail', `
      <ns:Context>
        <ns:UzivatelHeslo>${process.env.PROFIS_HESLO}</ns:UzivatelHeslo>
        <ns:UzivatelLogin>${process.env.PROFIS_LOGIN}</ns:UzivatelLogin>
        <ns:VypsatNazvy>true</ns:VypsatNazvy>
        <ns:id_Jazyk>${process.env.PROFIS_ID_JAZYK}</ns:id_Jazyk>
        <ns:id_Republika>${process.env.PROFIS_ID_REPUBLIKA}</ns:id_Republika>
        <ns:Rezim>${process.env.PROFIS_REZIM}</ns:Rezim>
      </ns:Context>
      <ns:ID>${Number(id)}</ns:ID>`)

    const xml = raw._raw as string
    const termin = {
      id_Termin: Number(id),
      nazev: extractTag(xml, 'Nazev'),
      datumOd: extractTag(xml, 'DatumOd'),
      datumDo: extractTag(xml, 'DatumDo'),
      cenaZaklad: extractTag(xml, 'CenaZaklad'),
      cenaAkce: extractTag(xml, 'CenaAkce'),
      volnychMist: extractTag(xml, 'VolnychMist'),
      stavNazev: extractTag(xml, 'StavNazev'),
      hotel: extractTag(xml, 'HotelNazev'),
      id_ZajezdHotel: extractTag(xml, 'id_ZajezdHotel'),
    }
    return NextResponse.json({ termin })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[profitour/termin] Error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
