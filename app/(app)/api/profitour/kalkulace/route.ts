import { NextRequest, NextResponse } from 'next/server'
import { soapCall, extractTag } from '@/lib/profis'

export async function POST(req: NextRequest) {
  let body: { id_Termin?: number }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { id_Termin } = body
  if (!id_Termin) {
    return NextResponse.json({ error: 'Missing required field: id_Termin' }, { status: 400 })
  }

  try {
    console.log('[kalkulace] Calling Profis with id_Termin:', id_Termin)
    // Kalkulace: Context + Data (VlastniProduktTerminInput)
    // VlastniProduktTerminInput extends ProduktInputBase.
    // Fields in DataContractSerializer order (base class first, then own fields):
    //   Base ProduktInputBase: Cestujici, Pojisteni, RezervaceDopravy, RezervaceUbytovani, Skipasy, id_TypStrava
    //   Own: id_SkupinaSlevaParametr, id_Termin
    const raw = await soapCall('Katalog', 'Kalkulace', `
      <ns:Context>
        <ns:UzivatelHeslo>${process.env.PROFIS_HESLO}</ns:UzivatelHeslo>
        <ns:UzivatelLogin>${process.env.PROFIS_LOGIN}</ns:UzivatelLogin>
        <ns:VypsatNazvy>true</ns:VypsatNazvy>
        <ns:id_Jazyk>${process.env.PROFIS_ID_JAZYK}</ns:id_Jazyk>
        <ns:id_Republika>${process.env.PROFIS_ID_REPUBLIKA}</ns:id_Republika>
        <ns:Rezim>${process.env.PROFIS_REZIM}</ns:Rezim>
      </ns:Context>
      <ns:Data>
        <ns:id_Termin>${id_Termin}</ns:id_Termin>
      </ns:Data>`)

    const xml = raw._raw as string
    console.log('[kalkulace] Response XML:', xml.slice(0, 800))
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
    return NextResponse.json({ error: 'Kalkulace failed: ' + message }, { status: 500 })
  }
}
