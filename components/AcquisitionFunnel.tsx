type Stage = { label: string; sublabel: string; value: number }

const STAGE_COLORS = ['#080708', '#3772FF', '#2557D6', '#FDCA40', '#DF2935']

export default function AcquisitionFunnel({
  sawAd,
  clickedThrough,
  viewedCamp,
  openedRegistration,
  completedRegistration,
}: {
  sawAd: number
  clickedThrough: number
  viewedCamp: number
  openedRegistration: number
  completedRegistration: number
}) {
  const stages: Stage[] = [
    { label: 'Videl reklamu', sublabel: 'unikátne návštevy advertoriálu', value: sawAd },
    { label: 'Klikol na web', sublabel: 'prešiel na bombovo.sk', value: clickedThrough },
    { label: 'Otvoril tábor', sublabel: 'pozrel si detail konkrétneho tábora', value: viewedCamp },
    { label: 'Otvoril prihlášku', sublabel: 'klikol "Mám záujem"', value: openedRegistration },
    { label: 'Dokončil prihlášku', sublabel: 'reálna rezervácia', value: completedRegistration },
  ]

  const base = stages[0].value || 1

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm mb-4">
      <div className="flex items-baseline justify-between mb-1">
        <h3
          className="text-base font-bold text-bombovo-dark"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          Akvizičný lievik
        </h3>
        <span
          className="text-xs text-gray-400"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          {stages[0].value > 0
            ? `${Math.round((stages[4].value / base) * 1000) / 10}% celková konverzia`
            : 'žiadne dáta'}
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-6">Od videnia reklamy až po reálnu rezerváciu tábora.</p>

      <div className="space-y-0">
        {stages.map((stage, i) => {
          const widthPct = Math.max(stage.value > 0 ? 6 : 2, Math.round((stage.value / base) * 100))
          const prev = i > 0 ? stages[i - 1].value : null
          const dropPct = prev && prev > 0 ? Math.round((stage.value / prev) * 1000) / 10 : null
          const isSevereDrop = dropPct !== null && dropPct < 20

          return (
            <div key={stage.label}>
              <div className="flex items-center gap-4 py-2">
                <div className="flex-1">
                  <div
                    className="h-12 rounded-xl flex items-center px-4 transition-all"
                    style={{
                      width: `${widthPct}%`,
                      minWidth: '120px',
                      backgroundColor: STAGE_COLORS[i],
                    }}
                  >
                    <span
                      className="text-white text-sm font-semibold truncate"
                      style={{ fontFamily: "'Sora', sans-serif" }}
                    >
                      {stage.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1.5 pl-1">{stage.sublabel}</p>
                </div>
                <div className="text-right shrink-0 w-20">
                  <span
                    className="text-2xl font-bold text-bombovo-dark block"
                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    {stage.value.toLocaleString('sk-SK')}
                  </span>
                </div>
              </div>

              {i < stages.length - 1 && dropPct !== null && (
                <div className="flex items-center gap-2 pl-1 py-1.5">
                  <span className="text-gray-300 text-xs">↓</span>
                  <span
                    className={`text-xs ${isSevereDrop ? 'text-bombovo-red font-semibold' : 'text-gray-400'}`}
                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    {dropPct}% prešlo do ďalšej fázy
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
