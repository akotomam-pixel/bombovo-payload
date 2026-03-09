/**
 * GET /api/profitour/termin?id=<profisTerminId>
 *
 * Returns basic term info from ProfisXML: name, dates, price, availability.
 * Used by the prihlaska page to display live data.
 */
import { NextRequest, NextResponse } from 'next/server'
import { soapCall, extractTag } from '@/lib/profis'

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: 'Missing or invalid id parameter' }, { status: 400 })
  }

  try {
    const raw = await soapCall(
      'Katalog',
      'TerminDetail',
      `<Context>
        <UzivatelLogin>${process.env.PROFIS_LOGIN}</UzivatelLogin>
        <UzivatelHeslo>${process.env.PROFIS_HESLO}</UzivatelHeslo>
        <id_Jazyk>${process.env.PROFIS_ID_JAZYK}</id_Jazyk>
        <id_Republika>${process.env.PROFIS_ID_REPUBLIKA}</id_Republika>
        <Rezim>${process.env.PROFIS_REZIM}</Rezim>
        <VypsatNazvy>true</VypsatNazvy>
      </Context>
      <ID>${Number(id)}</ID>`,
    )

    const xml = raw._raw as string

    // Extract key fields from the SOAP response XML
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
