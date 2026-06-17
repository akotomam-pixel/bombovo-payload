import { NextRequest, NextResponse } from 'next/server'
import { TRACK_COOKIE, parseTrackCookie, logTrackEvent } from '@/lib/trackEvents'

const ALLOWED_EVENTS = new Set(['registration_completed'])

export async function POST(req: NextRequest) {
  const track = parseTrackCookie(req.cookies.get(TRACK_COOKIE)?.value)

  // No wristband — this visitor has no ad/advertorial attribution to log against.
  if (!track) {
    return NextResponse.json({ ok: true, skipped: true })
  }

  let body: { event?: string; registrationId?: string; campId?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 })
  }

  const eventName = body.event ?? ''
  if (!ALLOWED_EVENTS.has(eventName)) {
    return NextResponse.json({ ok: false, error: 'unknown event' }, { status: 400 })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? ''
  const userAgent = req.headers.get('user-agent') ?? ''
  const referrer = req.headers.get('referer') ?? ''

  await logTrackEvent(track, eventName, {
    registrationId: body.registrationId,
    campId: body.campId,
    ip,
    userAgent,
    referrer,
  })

  return NextResponse.json({ ok: true })
}
