'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'

type DayCount = { day: string; views: number; clicks: number }
type RangeStats = {
  views: number
  clicks: number
  uniqueViews: number
  uniqueClicks: number
  ctr: number
  perDay: DayCount[]
}

const WEEKDAYS = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne']
const MONTH_NAMES = [
  'Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún',
  'Júl', 'August', 'September', 'Október', 'November', 'December',
]

function toDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export default function AdvertorialDateCalendar({ advertorial }: { advertorial: string }) {
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date()
    d.setDate(1)
    return d
  })
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [monthData, setMonthData] = useState<Record<string, DayCount>>({})
  const [monthLoading, setMonthLoading] = useState(false)
  const [stats, setStats] = useState<RangeStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(false)

  const today = useMemo(() => new Date(), [])
  const todayStr = useMemo(() => toDateStr(today), [today])

  useEffect(() => {
    let cancelled = false
    setMonthLoading(true)
    fetch(`/api/advertorial-calendar?advertorial=${advertorial}&month=${monthKey(viewMonth)}`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return
        const map: Record<string, DayCount> = {}
        for (const row of data.days ?? []) map[row.day] = row
        setMonthData(map)
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setMonthLoading(false) })
    return () => { cancelled = true }
  }, [advertorial, viewMonth])

  useEffect(() => {
    if (selected.size === 0) {
      setStats(null)
      return
    }
    let cancelled = false
    setStatsLoading(true)
    const dates = Array.from(selected).join(',')
    fetch(`/api/advertorial-calendar?advertorial=${advertorial}&dates=${dates}`)
      .then(r => r.json())
      .then(data => { if (!cancelled) setStats(data) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setStatsLoading(false) })
    return () => { cancelled = true }
  }, [advertorial, selected])

  const toggleDay = useCallback((dateStr: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(dateStr)) next.delete(dateStr)
      else next.add(dateStr)
      return next
    })
  }, [])

  const selectQuickRange = useCallback((days: number) => {
    const set = new Set<string>()
    for (let i = 0; i < days; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      set.add(toDateStr(d))
    }
    setSelected(set)
    const d = new Date()
    d.setDate(1)
    setViewMonth(d)
  }, [])

  const clearSelection = useCallback(() => setSelected(new Set()), [])

  const goToMonth = useCallback((delta: number) => {
    setViewMonth(prev => {
      const d = new Date(prev)
      d.setMonth(d.getMonth() + delta)
      return d
    })
  }, [])

  const maxViewsInMonth = useMemo(() => {
    return Object.values(monthData).reduce((m, d) => Math.max(m, d.views), 1)
  }, [monthData])

  const calendarCells = useMemo(() => {
    const year = viewMonth.getFullYear()
    const month = viewMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const startOffset = (firstDay.getDay() + 6) % 7 // Monday = 0
    const cells: ({ dateStr: string; day: number } | null)[] = []
    for (let i = 0; i < startOffset; i++) cells.push(null)
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day)
      cells.push({ dateStr: toDateStr(d), day })
    }
    return cells
  }, [viewMonth])

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-500">Vyber konkrétne dni v kalendári</h3>
        <div className="flex gap-2">
          <button
            onClick={() => selectQuickRange(7)}
            className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Posledných 7 dní
          </button>
          <button
            onClick={() => selectQuickRange(30)}
            className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Posledných 30 dní
          </button>
          {selected.size > 0 && (
            <button
              onClick={clearSelection}
              className="text-xs px-3 py-1.5 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
            >
              Vymazať výber
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => goToMonth(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          aria-label="Predchádzajúci mesiac"
        >
          ←
        </button>
        <span className="text-sm font-semibold text-bombovo-dark">
          {MONTH_NAMES[viewMonth.getMonth()]} {viewMonth.getFullYear()}
        </span>
        <button
          onClick={() => goToMonth(1)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          aria-label="Nasledujúci mesiac"
        >
          →
        </button>
      </div>

      <div className={`grid grid-cols-7 gap-1.5 mb-2 ${monthLoading ? 'opacity-50' : ''}`}>
        {WEEKDAYS.map(w => (
          <div key={w} className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wide py-1">
            {w}
          </div>
        ))}
        {calendarCells.map((cell, i) => {
          if (!cell) return <div key={`empty-${i}`} />
          const data = monthData[cell.dateStr]
          const isSelected = selected.has(cell.dateStr)
          const isToday = cell.dateStr === todayStr
          const isFuture = cell.dateStr > todayStr
          const intensity = data ? Math.min(1, 0.15 + (data.views / maxViewsInMonth) * 0.85) : 0

          return (
            <button
              key={cell.dateStr}
              disabled={isFuture}
              onClick={() => toggleDay(cell.dateStr)}
              title={data ? `${data.views} návštev, ${data.clicks} kliknutí` : 'Žiadne dáta'}
              className={`relative aspect-square rounded-lg text-xs font-medium flex items-center justify-center transition-all
                ${isFuture ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
                ${isSelected ? 'ring-2 ring-bombovo-blue ring-offset-1' : ''}
                ${isToday ? 'font-bold' : ''}
              `}
              style={{
                backgroundColor: isSelected
                  ? '#3772FF'
                  : data
                    ? `rgba(8, 7, 8, ${intensity})`
                    : '#F3F4F6',
                color: isSelected ? '#fff' : data && intensity > 0.4 ? '#fff' : isFuture ? undefined : '#374151',
              }}
            >
              {cell.day}
            </button>
          )
        })}
      </div>

      <p className="text-[11px] text-gray-400 mb-6">
        Tmavšia farba = viac návštev v ten deň. Klikni na deň pre výber, klikaním vyberieš viac dní naraz.
      </p>

      {selected.size === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-6 text-center">
          <p className="text-sm text-gray-400">Vyber jeden alebo viac dní v kalendári vyššie pre zobrazenie štatistík.</p>
        </div>
      ) : (
        <div>
          <p className="text-xs text-gray-500 mb-3">
            Vybraných dní: <strong className="text-bombovo-dark">{selected.size}</strong>
            {' — '}
            {Array.from(selected).sort().join(', ')}
          </p>

          {statsLoading || !stats ? (
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map(i => (
                <div key={i} className="bg-gray-50 rounded-2xl p-5 h-24 animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gray-50 rounded-2xl p-5 text-center">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Unikátne návštevy</p>
                  <p className="text-3xl font-bold text-bombovo-dark">{stats.uniqueViews.toLocaleString('sk-SK')}</p>
                  <p className="text-[11px] text-gray-400 mt-1">{stats.views.toLocaleString('sk-SK')} celkom</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-5 text-center">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Unikátne kliknutia</p>
                  <p className="text-3xl font-bold text-bombovo-dark">{stats.uniqueClicks.toLocaleString('sk-SK')}</p>
                  <p className="text-[11px] text-gray-400 mt-1">{stats.clicks.toLocaleString('sk-SK')} celkom</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-5 text-center">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">CTR</p>
                  <p className="text-3xl font-bold text-green-500">{stats.ctr}%</p>
                </div>
              </div>

              {stats.perDay.length > 1 && (
                <div className="space-y-1.5">
                  {stats.perDay.map(d => (
                    <div key={d.day} className="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-3 py-2">
                      <span className="font-mono text-gray-500">{d.day}</span>
                      <span className="text-gray-700">{d.views.toLocaleString('sk-SK')} návštev · {d.clicks.toLocaleString('sk-SK')} kliknutí</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
