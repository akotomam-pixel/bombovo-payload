import { Pool } from 'pg'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'

export const metadata = { title: 'Advertorial štatistiky | Bombovo' }

async function fetchStats() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URI })
  try {
    const [viewsRes, clicksRes] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM ad_events WHERE type = 'view' AND advertorial = 'advertorial-3'`),
      pool.query(`SELECT COUNT(*) FROM ad_events WHERE type = 'click' AND advertorial = 'advertorial-3'`),
    ])
    const views  = parseInt(viewsRes.rows[0].count, 10)
    const clicks = parseInt(clicksRes.rows[0].count, 10)
    const ctr    = views === 0 ? 0 : Math.round((clicks / views) * 1000) / 10
    return { views, clicks, ctr }
  } finally {
    await pool.end()
  }
}

export default async function AdvertorialStatsPage() {
  const { views, clicks, ctr } = await fetchStats()

  const funnelWidth = Math.max(4, Math.min(ctr, 100))

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

          {/* Metric cards */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="bg-white rounded-3xl p-6 text-center shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Návštevy stránky
              </p>
              <p className="text-5xl font-bold text-bombovo-dark">
                {views.toLocaleString('sk-SK')}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 text-center shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Kliknutia na web
              </p>
              <p className="text-5xl font-bold text-bombovo-dark">
                {clicks.toLocaleString('sk-SK')}
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

          {/* Funnel */}
          <div className="bg-white rounded-3xl p-8 shadow-sm mb-8">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">
              Lievik
            </h2>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm font-medium text-bombovo-dark mb-2">
                  <span>Navštívili advertoriál</span>
                  <span>{views.toLocaleString('sk-SK')}</span>
                </div>
                <div className="h-10 bg-bombovo-dark rounded-xl w-full" />
              </div>

              <div>
                <div className="flex justify-between text-sm font-medium text-bombovo-dark mb-2">
                  <span>Klikli na web</span>
                  <span>{clicks.toLocaleString('sk-SK')}</span>
                </div>
                <div className="h-10 bg-gray-100 rounded-xl w-full overflow-hidden">
                  <div
                    className="h-full bg-bombovo-blue rounded-xl transition-all"
                    style={{ width: `${funnelWidth}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Note */}
          <p className="text-xs text-gray-400 text-center leading-relaxed">
            Každý záznam = jeden skutočný klik zaznamenaný na serveri.
            Reklamné blokátory ani iOS súkromie tento počet neovplyvňujú.
          </p>

        </div>
      </main>
    </>
  )
}
