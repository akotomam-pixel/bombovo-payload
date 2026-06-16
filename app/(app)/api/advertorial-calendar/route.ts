import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

let pool: Pool | null = null
function getPool(): Pool {
  if (!pool) pool = new Pool({ connectionString: process.env.DATABASE_URI })
  return pool
}

const ADVERTORIALS = ['advertorial-2', 'advertorial-3']
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const advertorial = searchParams.get('advertorial') ?? ''
  const month = searchParams.get('month') ?? ''
  const datesParam = searchParams.get('dates') ?? ''

  if (!ADVERTORIALS.includes(advertorial)) {
    return NextResponse.json({ error: 'invalid advertorial' }, { status: 400 })
  }

  const db = getPool()

  try {
    if (month) {
      if (!/^\d{4}-\d{2}$/.test(month)) {
        return NextResponse.json({ error: 'invalid month' }, { status: 400 })
      }
      const res = await db.query(
        `SELECT TO_CHAR(DATE(created_at), 'YYYY-MM-DD') AS day,
                COUNT(*) FILTER (WHERE type = 'view')::int AS views,
                COUNT(*) FILTER (WHERE type = 'click')::int AS clicks
         FROM ad_events
         WHERE advertorial = $1 AND TO_CHAR(created_at, 'YYYY-MM') = $2
         GROUP BY day ORDER BY day`,
        [advertorial, month]
      )
      return NextResponse.json({ days: res.rows })
    }

    if (datesParam) {
      const dates = datesParam.split(',').map(d => d.trim()).filter(d => DATE_RE.test(d))
      if (dates.length === 0) {
        return NextResponse.json({ error: 'no valid dates' }, { status: 400 })
      }
      const [viewsRes, clicksRes, uniqueViewsRes, uniqueClicksRes, perDayRes] = await Promise.all([
        db.query(`SELECT COUNT(*)::int AS count FROM ad_events WHERE type='view' AND advertorial=$1 AND TO_CHAR(created_at,'YYYY-MM-DD') = ANY($2)`, [advertorial, dates]),
        db.query(`SELECT COUNT(*)::int AS count FROM ad_events WHERE type='click' AND advertorial=$1 AND TO_CHAR(created_at,'YYYY-MM-DD') = ANY($2)`, [advertorial, dates]),
        db.query(`SELECT COUNT(DISTINCT ip)::int AS count FROM ad_events WHERE type='view' AND advertorial=$1 AND ip IS NOT NULL AND TO_CHAR(created_at,'YYYY-MM-DD') = ANY($2)`, [advertorial, dates]),
        db.query(`SELECT COUNT(DISTINCT ip)::int AS count FROM ad_events WHERE type='click' AND advertorial=$1 AND ip IS NOT NULL AND TO_CHAR(created_at,'YYYY-MM-DD') = ANY($2)`, [advertorial, dates]),
        db.query(
          `SELECT TO_CHAR(DATE(created_at), 'YYYY-MM-DD') AS day,
                  COUNT(*) FILTER (WHERE type = 'view')::int AS views,
                  COUNT(*) FILTER (WHERE type = 'click')::int AS clicks
           FROM ad_events
           WHERE advertorial = $1 AND TO_CHAR(created_at,'YYYY-MM-DD') = ANY($2)
           GROUP BY day ORDER BY day`,
          [advertorial, dates]
        ),
      ])

      const views = viewsRes.rows[0].count
      const clicks = clicksRes.rows[0].count
      const uniqueViews = uniqueViewsRes.rows[0].count
      const uniqueClicks = uniqueClicksRes.rows[0].count
      const ctr = uniqueViews === 0 ? 0 : Math.round((uniqueClicks / uniqueViews) * 1000) / 10

      return NextResponse.json({
        views, clicks, uniqueViews, uniqueClicks, ctr,
        perDay: perDayRes.rows,
      })
    }

    return NextResponse.json({ error: 'month or dates is required' }, { status: 400 })
  } catch (err) {
    console.error('[/api/advertorial-calendar] Error:', err)
    return NextResponse.json({ error: 'internal server error' }, { status: 500 })
  }
}
