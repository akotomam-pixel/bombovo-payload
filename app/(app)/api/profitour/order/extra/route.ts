import { NextRequest, NextResponse } from 'next/server'
import { runOrderExtras, type OrderExtrasInput } from '@/lib/profisOrderExtras'

// The booking form no longer calls this directly — it sends the extras along with
// /api/profitour/order/complete, which runs them in the background. Kept so the
// route still works if anything else calls it.
export async function POST(req: NextRequest) {
  let input: OrderExtrasInput
  try {
    input = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const errors = await runOrderExtras(input)

  // Non-blocking — always return success so the main order flow is not interrupted
  return NextResponse.json({ success: true, errors: errors.length ? errors : undefined })
}
