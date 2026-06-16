import { Pool } from 'pg'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import AdvertorialDateCalendar from '@/components/AdvertorialDateCalendar'

export const metadata = { title: 'Advertorial štatistiky | Bombovo' }

async function fetchStatsFor(pool: Pool, advertorial: string) {
  const [viewsRes, clicksRes, uniqueViewsRes, uniqueClicksRes, dailyRes, referrersRes, utmRes, suspiciousRes] = await Promise.all([
    pool.query(`SELECT COUNT(*) FROM ad_events WHERE type = 'view' AND advertorial = $1`, [advertorial]),
    pool.query(`SELECT COUNT(*) FROM ad_events WHERE type = 'click' AND advertorial = $1`, [advertorial]),
    pool.query(`SELECT COUNT(DISTINCT ip) FROM ad_events WHERE type = 'view' AND advertorial = $1 AND ip IS NOT NULL`, [advertorial]),
    pool.query(`SELECT COUNT(DISTINCT ip) FROM ad_events WHERE type = 'click' AND advertorial = $1 AND ip IS NOT NULL`, [advertorial]),
    pool.query(`SELECT TO_CHAR(DATE(created_at), 'YYYY-MM-DD') AS day, COUNT(*)::int AS views FROM ad_events WHERE type = 'view' AND advertorial = $1 AND created_at >= NOW() - INTERVAL '30 days' GROUP BY day ORDER BY day DESC`, [advertorial]),
    pool.query(`SELECT COALESCE(NULLIF(referrer,''), '(direct)') AS ref, COUNT(*)::int AS cnt FROM ad_events WHERE type = 'view' AND advertorial = $1 GROUP BY ref ORDER BY cnt DESC LIMIT 8`, [advertorial]),
    pool.query(`SELECT COALESCE(NULLIF(utm_source,''), '(none)') AS src, COUNT(*)::int AS cnt FROM ad_events WHERE type = 'view' AND advertorial = $1 GROUP BY src ORDER BY cnt DESC LIMIT 6`, [advertorial]),
    pool.query(`SELECT ip, COUNT(*)::int AS hits FROM ad_events WHERE type = 'view' AND advertorial = $1 AND ip IS NOT NULL GROUP BY ip HAVING COUNT(*) > 10 ORDER BY hits DESC LIMIT 10`, [advertorial]),
  ])
  const views        = parseInt(viewsRes.rows[0].count, 10)
  const clicks       = parseInt(clicksRes.rows[0].count, 10)
  const uniqueViews  = parseInt(uniqueViewsRes.rows[0].count, 10)
  const uniqueClicks = parseInt(uniqueClicksRes.rows[0].count, 10)
  const ctr          = uniqueViews === 0 ? 0 : Math.round((uniqueClicks / uniqueViews) * 1000) / 10
  const ctrTotal     = views === 0 ? 0 : Math.round((clicks / views) * 1000) / 10
  return {
    views, clicks, uniqueViews, uniqueClicks, ctr, ctrTotal,
    daily:         dailyRes.rows     as { day: string; views: number }[],
    referrers:     referrersRes.rows as { ref: string; cnt: number }[],
    utmSources:    utmRes.rows       as { src: string; cnt: number }[],
    suspiciousIps: suspiciousRes.rows as { ip: string; hits: number }[],
  }
}

async function fetchStats() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URI })
  try {
    const [adv2, adv3] = await Promise.all([
      fetchStatsFor(pool, 'advertorial-2'),
      fetchStatsFor(pool, 'advertorial-3'),
    ])
    return { adv2, adv3 }
  } finally {
    await pool.end()
  }
}

type Stats = Awaited<ReturnType<typeof fetchStatsFor>>

function AdvertorialBlock({ title, note, stats, slug }: { title: string; note?: string; stats: Stats; slug: string }) {
  const { views, clicks, uniqueViews, uniqueClicks, ctr, ctrTotal, daily, referrers, utmSources, suspiciousIps } = stats
  const funnelWidth      = Math.max(4, Math.min(ctr, 100))
  const funnelWidthTotal = Math.max(4, Math.min(ctrTotal, 100))
  const maxDaily = daily.reduce((m, d) => Math.max(m, d.views), 1)
  const maxRef   = referrers.reduce((m, r) => Math.max(m, r.cnt), 1)
  const maxUtm   = utmSources.reduce((m, u) => Math.max(m, u.cnt), 1)

  return (
    <section className="mb-16">
      <h1 className="text-3xl font-bold text-bombovo-dark mb-1">{title}</h1>
      {note && <p className="text-xs text-amber-600 mb-2">{note}</p>}
      <p className="text-gray-500 mb-8 text-sm">Dáta sa aktualizujú pri každom načítaní stránky.</p>

      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Unikátni návštevníci — reálne čísla</h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-3xl p-6 text-center shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Unikátne návštevy</p>
          <p className="text-5xl font-bold text-bombovo-dark">{uniqueViews.toLocaleString('sk-SK')}</p>
        </div>
        <div className="bg-white rounded-3xl p-6 text-center shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Unikátne kliknutia</p>
          <p className="text-5xl font-bold text-bombovo-dark">{uniqueClicks.toLocaleString('sk-SK')}</p>
        </div>
        <div className="bg-white rounded-3xl p-6 text-center shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Click-through rate</p>
          <p className="text-5xl font-bold text-green-500">{ctr}%</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm mb-10">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">Lievik — unikátni</h2>
        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-sm font-medium text-bombovo-dark mb-2">
              <span>Navštívili advertoriál</span><span>{uniqueViews.toLocaleString('sk-SK')}</span>
            </div>
            <div className="h-10 bg-bombovo-dark rounded-xl w-full" />
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium text-bombovo-dark mb-2">
              <span>Klikli na web</span><span>{uniqueClicks.toLocaleString('sk-SK')}</span>
            </div>
            <div className="h-10 bg-gray-100 rounded-xl w-full overflow-hidden">
              <div className="h-full bg-bombovo-blue rounded-xl" style={{ width: `${funnelWidth}%` }} />
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Všetky hity — vrátane duplicít</h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-3xl p-6 text-center shadow-sm opacity-70">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Celkové návštevy</p>
          <p className="text-5xl font-bold text-gray-400">{views.toLocaleString('sk-SK')}</p>
        </div>
        <div className="bg-white rounded-3xl p-6 text-center shadow-sm opacity-70">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Celkové kliknutia</p>
          <p className="text-5xl font-bold text-gray-400">{clicks.toLocaleString('sk-SK')}</p>
        </div>
        <div className="bg-white rounded-3xl p-6 text-center shadow-sm opacity-70">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">CTR (s duplicitami)</p>
          <p className="text-5xl font-bold text-gray-400">{ctrTotal}%</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm opacity-70 mb-8">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">Lievik — všetky hity</h2>
        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-400 mb-2">
              <span>Navštívili advertoriál</span><span>{views.toLocaleString('sk-SK')}</span>
            </div>
            <div className="h-10 bg-gray-300 rounded-xl w-full" />
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-400 mb-2">
              <span>Klikli na web</span><span>{clicks.toLocaleString('sk-SK')}</span>
            </div>
            <div className="h-10 bg-gray-100 rounded-xl w-full overflow-hidden">
              <div className="h-full bg-gray-300 rounded-xl" style={{ width: `${funnelWidthTotal}%` }} />
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center leading-relaxed mb-10">
        Unikátni = každá IP adresa sa počíta iba raz za celú kampaň.
        Duplicity = rovnaká osoba otvorila stránku alebo klikla viackrát.
      </p>

      {/* CALENDAR */}
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Štatistiky podľa dní (testovanie reklám)</h2>
      <AdvertorialDateCalendar advertorial={slug} />

      {/* AUDIT */}
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 mt-10">Audit — je tracking reálny?</h2>

      {daily.length > 0 && (
        <div className="bg-white rounded-3xl p-8 shadow-sm mb-4">
          <h3 className="text-sm font-semibold text-gray-500 mb-5">Návštevy po dňoch (posledných 30 dní)</h3>
          <div className="space-y-2">
            {daily.map(d => (
              <div key={d.day} className="flex items-center gap-3">
                <span className="text-gray-400 w-24 shrink-0 font-mono text-xs">{d.day}</span>
                <div className="flex-1 bg-gray-100 rounded h-6 overflow-hidden">
                  <div className="h-full bg-bombovo-dark rounded" style={{ width: `${Math.round((d.views / maxDaily) * 100)}%` }} />
                </div>
                <span className="text-gray-700 font-semibold w-10 text-right text-sm">{d.views.toLocaleString('sk-SK')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 mb-4">Odkiaľ prišli (referrer)</h3>
          <div className="space-y-3">
            {referrers.map(r => (
              <div key={r.ref} className="text-xs">
                <div className="flex justify-between text-gray-600 mb-1">
                  <span className="truncate max-w-[140px]" title={r.ref}>{r.ref}</span>
                  <span className="font-semibold ml-2">{r.cnt.toLocaleString('sk-SK')}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-bombovo-blue rounded-full" style={{ width: `${Math.round((r.cnt / maxRef) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 mb-4">UTM source</h3>
          <div className="space-y-3">
            {utmSources.map(u => (
              <div key={u.src} className="text-xs">
                <div className="flex justify-between text-gray-600 mb-1">
                  <span className="truncate max-w-[140px]" title={u.src}>{u.src}</span>
                  <span className="font-semibold ml-2">{u.cnt.toLocaleString('sk-SK')}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-400 rounded-full" style={{ width: `${Math.round((u.cnt / maxUtm) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {suspiciousIps.length > 0 ? (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-6 shadow-sm mb-4">
          <h3 className="text-sm font-semibold text-red-500 mb-3">⚠️ Podozrivé IP adresy (&gt;10 hitov)</h3>
          <div className="space-y-1">
            {suspiciousIps.map(s => (
              <div key={s.ip} className="flex justify-between text-xs text-red-700 font-mono">
                <span>{s.ip}</span>
                <span>{s.hits.toLocaleString('sk-SK')} hitov</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-red-400 mt-3">Tieto IP adresy môžu byť boti alebo crawleri, ktorí prešli filtrom.</p>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-3xl p-5 shadow-sm mb-4">
          <p className="text-sm text-green-600 font-semibold">✓ Žiadne podozrivé IP adresy</p>
          <p className="text-xs text-green-500 mt-1">Žiadna IP adresa nemá viac ako 10 hitov — tracking vyzerá čisto.</p>
        </div>
      )}
    </section>
  )
}

export default async function AdvertorialStatsPage() {
  const { adv2, adv3 } = await fetchStats()

  return (
    <>
      <TopBar />
      <Header />
      <main className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-3xl mx-auto">

          <AdvertorialBlock
            title="Advertorial-2 — Vojna sociálnym sieťam"
            note="Sledovanie návštev začalo 13. 6. 2026. Staršie dáta nie sú v databáze (stránka bola predtým statická)."
            stats={adv2}
            slug="advertorial-2"
          />

          <div className="border-t border-gray-200 mb-16" />

          <AdvertorialBlock
            title="Advertorial-3 — Tábor na poslednú chvíľu"
            stats={adv3}
            slug="advertorial-3"
          />

        </div>
      </main>
    </>
  )
}
