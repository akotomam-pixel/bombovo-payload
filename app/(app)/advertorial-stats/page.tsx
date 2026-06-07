import { Pool } from 'pg'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

const ADVERTORIALS = ['advertorial-3', 'advertorial-2', 'advertorial-1']

async function getStats(advertorial: string, days: number) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URI })
  try {
    const since = days > 0
      ? new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
      : null

    const dateFilter = since ? `AND created_at > $2` : ''
    const params = (base: string[]) => since ? [...base, since] : base

    const [views, clicks, recent] = await Promise.all([
      pool.query(
        `SELECT COUNT(*) FROM ad_events WHERE type='view' AND advertorial=$1 ${dateFilter}`,
        params([advertorial])
      ),
      pool.query(
        `SELECT COUNT(*) FROM ad_events WHERE type='click' AND advertorial=$1 ${dateFilter}`,
        params([advertorial])
      ),
      pool.query(
        `SELECT type, destination, utm_source, utm_campaign, fbclid, created_at
         FROM ad_events WHERE advertorial=$1 ${dateFilter}
         ORDER BY created_at DESC LIMIT 20`,
        params([advertorial])
      ),
    ])

    const v = parseInt(views.rows[0].count, 10)
    const c = parseInt(clicks.rows[0].count, 10)
    return {
      views: v,
      clicks: c,
      ctr: v > 0 ? Math.round((c / v) * 1000) / 10 : 0,
      recent: recent.rows,
    }
  } finally {
    await pool.end()
  }
}

export default async function AdvertorialStatsPage({
  searchParams,
}: {
  searchParams: Promise<{ advertorial?: string; days?: string }>
}) {
  const sp = await searchParams
  const advertorial = sp.advertorial ?? 'advertorial-3'
  const days = parseInt(sp.days ?? '30', 10)

  let stats = { views: 0, clicks: 0, ctr: 0, recent: [] as any[] }
  let error = ''
  try {
    stats = await getStats(advertorial, days)
  } catch (e: any) {
    error = e.message
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 800, margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Advertorial Stats</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>Click tracking dashboard</p>

      {/* Filters */}
      <form method="GET" style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13 }}>
          Advertorial
          <select name="advertorial" defaultValue={advertorial} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ddd', fontSize: 14 }}>
            {ADVERTORIALS.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13 }}>
          Period
          <select name="days" defaultValue={String(days)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ddd', fontSize: 14 }}>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="0">All time</option>
          </select>
        </label>
        <button type="submit" style={{ alignSelf: 'flex-end', padding: '7px 18px', background: '#111', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 }}>
          Apply
        </button>
      </form>

      {error && (
        <div style={{ background: '#fee', border: '1px solid #fcc', borderRadius: 8, padding: 16, marginBottom: 24, color: '#c00' }}>
          Error: {error}
        </div>
      )}

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Views', value: stats.views.toLocaleString(), color: '#e8f4fd' },
          { label: 'Clicks', value: stats.clicks.toLocaleString(), color: '#e8fded' },
          { label: 'CTR', value: `${stats.ctr}%`, color: '#fdf6e8' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: color, borderRadius: 12, padding: '20px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: '#666', marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#111' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Recent events */}
      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Recent events (last 20)</h2>
      {stats.recent.length === 0 ? (
        <p style={{ color: '#888' }}>No events yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              {['Type', 'Destination', 'UTM Source', 'Campaign', 'fbclid', 'Time'].map(h => (
                <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, borderBottom: '2px solid #eee' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stats.recent.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '7px 12px' }}>
                  <span style={{
                    display: 'inline-block', padding: '2px 8px', borderRadius: 99,
                    background: row.type === 'click' ? '#d4edda' : '#d1ecf1',
                    color: row.type === 'click' ? '#155724' : '#0c5460',
                    fontSize: 11, fontWeight: 600,
                  }}>{row.type}</span>
                </td>
                <td style={{ padding: '7px 12px', color: '#444' }}>{row.destination || '—'}</td>
                <td style={{ padding: '7px 12px', color: '#444' }}>{row.utm_source || '—'}</td>
                <td style={{ padding: '7px 12px', color: '#444' }}>{row.utm_campaign || '—'}</td>
                <td style={{ padding: '7px 12px', color: '#444' }}>{row.fbclid ? row.fbclid.slice(0, 12) + '…' : '—'}</td>
                <td style={{ padding: '7px 12px', color: '#888' }}>
                  {new Date(row.created_at).toLocaleString('sk-SK', { timeZone: 'Europe/Bratislava' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
