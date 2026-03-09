import { NextRequest, NextResponse } from 'next/server'
import { soapCall } from '@/lib/profis'

export async function POST(req: NextRequest) {
  let body: { id_Objednavka?: number; id_Klic?: number }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { id_Objednavka, id_Klic } = body
  if (!id_Objednavka || !id_Klic) {
    return NextResponse.json({ error: 'Missing required fields: id_Objednavka, id_Klic' }, { status: 400 })
  }

  try {
    await soapCall('Objednavka', 'ObjednavkaDokoncit', `
      <ns:Context>
        <ns:UzivatelHeslo>${process.env.PROFIS_HESLO}</ns:UzivatelHeslo>
        <ns:UzivatelLogin>${process.env.PROFIS_LOGIN}</ns:UzivatelLogin>
        <ns:VypsatNazvy>false</ns:VypsatNazvy>
        <ns:id_Jazyk>${process.env.PROFIS_ID_JAZYK}</ns:id_Jazyk>
      </ns:Context>
      <ns:id_Objednavka>${id_Objednavka}</ns:id_Objednavka>
      <ns:id_Klic>${id_Klic}</ns:id_Klic>`)

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[profitour/order/complete] Error:', message)
    // Return 200 even on error — the order already exists in Profis
    return NextResponse.json({ success: false, error: message })
  }
}
