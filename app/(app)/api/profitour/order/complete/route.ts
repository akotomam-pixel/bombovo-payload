import { NextRequest, NextResponse } from 'next/server'
import { soapCall } from '@/lib/profis'

export async function POST(req: NextRequest) {
  let body: { id_Objednavka?: number; klic?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { id_Objednavka, klic } = body
  if (!id_Objednavka || !klic) {
    return NextResponse.json({ error: 'Missing required fields: id_Objednavka, klic' }, { status: 400 })
  }

  try {
    // ObjednavkaDokoncit uses ObjednavkaContext (extends Context) which carries
    // the order ID and key. Field order: base Context fields first, then own fields
    // alphabetically: Klic (K=75) before id_Objednavka (i=105).
    // Data element (ObjednavkaDokoncitInput) contains MinimalniDelkaRezervace.
    await soapCall('Objednavka', 'ObjednavkaDokoncit', `
      <ns:Context>
        <ns:UzivatelHeslo>${process.env.PROFIS_HESLO}</ns:UzivatelHeslo>
        <ns:UzivatelLogin>${process.env.PROFIS_LOGIN}</ns:UzivatelLogin>
        <ns:VypsatNazvy>false</ns:VypsatNazvy>
        <ns:id_Jazyk>${process.env.PROFIS_ID_JAZYK}</ns:id_Jazyk>
        <ns:Klic>${klic}</ns:Klic>
        <ns:id_Objednavka>${id_Objednavka}</ns:id_Objednavka>
      </ns:Context>
      <ns:Data>
        <ns:MinimalniDelkaRezervace>0</ns:MinimalniDelkaRezervace>
      </ns:Data>`)

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[profitour/order/complete] Error:', message)
    // Return 200 even on error — the order already exists in Profis
    return NextResponse.json({ success: false, error: message })
  }
}
