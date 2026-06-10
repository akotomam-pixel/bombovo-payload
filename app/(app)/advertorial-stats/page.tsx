import { Pool } from 'pg'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'

export const metadata = { title: 'Advertorial štatistiky | Bombovo' }

async function fetchStats() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URI })
  try {
    const [viewsRes, clicksRes, uniqueViewsRes, uniqueClicksRes] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM ad_events WHERE type = 'view' AND advertorial = 'advertorial-3'`),
      pool.query(`SELECT COUNT(*) FROM ad_events WHERE type = 'click' AND advertorial = 'advertorial-3'`),
      pool.query(`SELECT COUNT(DISTINCT ip) FROM ad_events WHERE type = 'view' AND advertorial = 'advertorial-3' AND ip IS NOT NULL`),
      pool.query(`SELECT COUNT(DISTINCT ip) FROM ad_events WHERE type = 'click' AND advertorial = 'advertorial-3' AND ip IS NOT NULL`),
    ])
    const views        = parseInt(viewsRes.rows[0].count, 10)
    const clicks       = parseInt(clicksRes.rows[0].count, 10)
    const uniqueViews  = parseInt(uniqueViewsRes.rows[0].count, 10)
    const uniqueClicks = parseInt(uniqueClicksRes.rows[0].count, 10)
    const ctr          = uniqueViews === 0 ? 0 : Math.round((uniqueClicks / uniqueViews) * 1000) / 10
    const ctrTotal     = views === 0 ? 0 : Math.round((clicks / views) * 1000) / 10
    return { views, clicks, uniqueViews, uniqueClicks, ctr, ctrTotal }
  } finally {
    await pool.end()
  }
}

export default async function AdvertorialStatsPage() {
  const { views, clicks, uniqueViews, uniqueClicks, ctr, ctrTotal } = await fetchStats()

  const funnelWidth       = Math.max(4, Math.min(ctr, 100))
  const funnelWidthTotal  = Math.max(4, Math.min(ctrTotal, 100))

  return (
    <>
      <TopBar />
      <Header />

      <main className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-3xl mx-auto">

          <h1 className="text-3xl font-bold text-bombovo-dark mb-2">
            Advertorial-3 — výsledky
          </h1>
          <p className="text-gray-500 mb-10 text-sm">
            Dáta sa aktualizujú pri každom načítaní stránky.
          </p>

          {/* ── UNIQUE (real numbers) ── */}
          <div className="mb-2">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
              Unikátni návštevníci — reálne čísla
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-3xl p-6 text-center shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Unikátne návštevy
              </p>
              <p className="text-5xl font-bold text-bombovo-dark">
                {uniqueViews.toLocaleString('sk-SK')}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 text-center shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Unikátne kliknutia
              </p>
              <p className="text-5xl font-bold text-bombovo-dark">
                {uniqueClicks.toLocaleString('sk-SK')}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 text-center shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Click-through rate
              </p>
              <p className="text-5xl font-bold text-green-500">
                {ctr}%
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm mb-12">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">
              Lievik — unikátni
            </h2>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm font-medium text-bombovo-dark mb-2">
                  <span>Navštívili advertoriál</span>
                  <span>{uniqueViews.toLocaleString('sk-SK')}</span>
                </div>
                <div className="h-10 bg-bombovo-dark rounded-xl w-full" />
              </div>
              <div>
                <div className="flex justify-between text-sm font-medium text-bombovo-dark mb-2">
                  <span>Klikli na web</span>
                  <span>{uniqueClicks.toLocaleString('sk-SK')}</span>
                </div>
                <div className="h-10 bg-gray-100 rounded-xl w-full overflow-hidden">
                  <div className="h-full bg-bombovo-blue rounded-xl transition-all" style={{ width: `${funnelWidth}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* ── TOTAL (including duplicates) ── */}
          <div className="mb-2">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
              Všetky hity — vrátane duplicít
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-3xl p-6 text-center shadow-sm opacity-70">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Celkové návštevy
              </p>
              <p className="text-5xl font-bold text-gray-400">
                {views.toLocaleString('sk-SK')}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 text-center shadow-sm opacity-70">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Celkové kliknutia
              </p>
              <p className="text-5xl font-bold text-gray-400">
                {clicks.toLocaleString('sk-SK')}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 text-center shadow-sm opacity-70">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                CTR (s duplicitami)
              </p>
              <p className="text-5xl font-bold text-gray-400">
                {ctrTotal}%
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm opacity-70 mb-8">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">
              Lievik — všetky hity
            </h2>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm font-medium text-gray-400 mb-2">
                  <span>Navštívili advertoriál</span>
                  <span>{views.toLocaleString('sk-SK')}</span>
                </div>
                <div className="h-10 bg-gray-300 rounded-xl w-full" />
              </div>
              <div>
                <div className="flex justify-between text-sm font-medium text-gray-400 mb-2">
                  <span>Klikli na web</span>
                  <span>{clicks.toLocaleString('sk-SK')}</span>
                </div>
                <div className="h-10 bg-gray-100 rounded-xl w-full overflow-hidden">
                  <div className="h-full bg-gray-300 rounded-xl transition-all" style={{ width: `${funnelWidthTotal}%` }} />
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center leading-relaxed">
            Unikátni = každá IP adresa sa počíta iba raz za celú kampaň.
            Duplicity = rovnaká osoba otvorila stránku alebo klikla viackrát.
          </p>

        </div>
      </main>
    </>
  )
}
