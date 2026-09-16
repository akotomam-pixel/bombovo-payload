import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { checkAndAlertWaitlist } from '@/lib/waitlistAlert'

/**
 * Manual trigger for the waitlist reopen alert (Step 4), for the "rebuilt
 * architecture" strediská whose termín status is hand-typed in
 * data/{slug}/content.ts rather than written to Payload — see
 * scripts/waitlist-check.ts, which is how this actually gets called, and
 * data/rebuiltStrediska.ts for why no automatic hook can cover that path.
 *
 * Runs the same lib/waitlistAlert.ts logic the Payload afterChange hook
 * uses for the database-backed strediská, just triggered by hand instead of
 * by a write. Gated behind a shared secret since it sends a real email —
 * not for any frontend to call.
 */
export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get('x-waitlist-check-secret')
    if (!process.env.WAITLIST_CHECK_SECRET || secret !== process.env.WAITLIST_CHECK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { slug, termin } = body
    if (!slug || !termin) {
      return NextResponse.json({ error: 'slug a termin sú povinné.' }, { status: 400 })
    }

    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'strediska',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    const doc = result.docs[0]
    if (!doc) {
      return NextResponse.json({ error: `No stredisko found with slug "${slug}".` }, { status: 404 })
    }

    await checkAndAlertWaitlist(doc.id, termin)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[waitlist-check] Error:', err)
    return NextResponse.json({ error: 'Interná chyba servera.' }, { status: 500 })
  }
}
