import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

let pool: Pool | null = null
function getPool(): Pool {
  if (!pool) pool = new Pool({ connectionString: process.env.DATABASE_URI })
  return pool
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const advertorial = searchParams.get('advertorial') ?? 'advertorial-3'
  const days = parseInt(searchParams.get('days') ?? '30', 10)

  const since = days > 0
    ? new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
    : null

  try {
    const db = getPool()

    const dateFilter = since ? `AND created_at > $2` : ''

    const [viewsRes, clicksRes] = await Promise.all([
      db.query(
        `SELECT COUNT(*) FROM ad_events WHERE type='view' AND advertorial=$1 ${dateFilter}`,
        since ? [advertorial, since] : [advertorial]
      ),
      db.query(
        `SELECT COUNT(*) FROM ad_events WHERE type='click' AND advertorial=$1 ${dateFilter}`,
        since ? [advertorial, since] : [advertorial]
      ),
    ])

    const views = parseInt(viewsRes.rows[0].count, 10)
    const clicks = parseInt(clicksRes.rows[0].count, 10)
    const ctr = views > 0 ? Math.round((clicks / views) * 1000) / 10 : 0

    return NextResponse.json({ views, clicks, ctr, advertorial, days })
  } catch (err) {
    console.error('[/api/ad-stats] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
