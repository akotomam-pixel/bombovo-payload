import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bombovo.sk'

const BOT_PATTERNS = [
  'bot', 'crawler', 'spider', 'facebookexternalhit', 'googlebot',
  'bingbot', 'slurp', 'duckduckbot', 'baiduspider', 'yandexbot', 'ia_archiver',
]

function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase()
  return BOT_PATTERNS.some(p => ua.includes(p))
}

let pool: Pool | null = null
function getPool(): Pool {
  if (!pool) pool = new Pool({ connectionString: process.env.DATABASE_URI })
  return pool
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const to = searchParams.get('to') ?? ''
  const source = searchParams.get('source') ?? 'advertorial-3'
  const utmSource = searchParams.get('utm_source') ?? ''
  const utmMedium = searchParams.get('utm_medium') ?? ''
  const utmCampaign = searchParams.get('utm_campaign') ?? ''
  const utmContent = searchParams.get('utm_content') ?? ''
  const fbclid = searchParams.get('fbclid') ?? ''

  // Reject open redirects — only allow relative paths
  if (!to || to.includes('://')) {
    return NextResponse.redirect(SITE_URL, { status: 307 })
  }

  const destination = to.startsWith('/') ? to : `/${to}`

  // Build final destination URL with tracking params preserved
  const destUrl = new URL(`${SITE_URL}${destination}`)
  if (utmSource) destUrl.searchParams.set('utm_source', utmSource)
  if (utmMedium) destUrl.searchParams.set('utm_medium', utmMedium)
  if (utmCampaign) destUrl.searchParams.set('utm_campaign', utmCampaign)
  if (utmContent) destUrl.searchParams.set('utm_content', utmContent)
  if (fbclid) destUrl.searchParams.set('fbclid', fbclid)

  const finalUrl = destUrl.toString()
  const userAgent = req.headers.get('user-agent') ?? ''

  // Skip DB write for bots — just redirect
  if (isBot(userAgent)) {
    return NextResponse.redirect(finalUrl, { status: 307 })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? ''
  const referrer = req.headers.get('referer') ?? ''

  // Non-blocking DB write with 2500ms timeout
  const dbWrite = getPool().query(
    `INSERT INTO ad_events (type, advertorial, destination, utm_source, utm_medium, utm_campaign, utm_content, fbclid, ip, user_agent, referrer, updated_at, created_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,now(),now())`,
    ['click', source, destination, utmSource||null, utmMedium||null, utmCampaign||null, utmContent||null, fbclid||null, ip||null, userAgent||null, referrer||null]
  )

  const timeout = new Promise<void>((_, reject) =>
    setTimeout(() => reject(new Error('DB write timeout')), 2500),
  )

  Promise.race([dbWrite, timeout]).catch(err => {
    console.error('[/api/go] DB write failed:', err)
  })

  return NextResponse.redirect(finalUrl, { status: 307 })
}
