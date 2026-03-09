/**
 * POST /api/profitour/order/complete
 *
 * MUST be called after every successful /api/profitour/order call.
 * Finalizes the order in ProfisXML (ObjednavkaDokoncit).
 *
 * Body: { id_Objednavka: number, id_Klic: number }
 */
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
    return NextResponse.json(
      { error: 'Missing required fields: id_Objednavka, id_Klic' },
      { status: 400 },
    )
  }

  try {
    await soapCall(
      'Objednavka',
      'ObjednavkaDokoncit',
      `<Context>
        <UzivatelLogin>${process.env.PROFIS_LOGIN}</UzivatelLogin>
        <UzivatelHeslo>${process.env.PROFIS_HESLO}</UzivatelHeslo>
        <id_Jazyk>${process.env.PROFIS_ID_JAZYK}</id_Jazyk>
      </Context>
      <id_Objednavka>${id_Objednavka}</id_Objednavka>
      <id_Klic>${id_Klic}</id_Klic>`,
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[profitour/order/complete] Error:', message)
    // Even on error we return 200 — the order was already created in Profis.
    // Log the error but don't block the user's success screen.
    return NextResponse.json({ success: false, error: message }, { status: 200 })
  }
}
