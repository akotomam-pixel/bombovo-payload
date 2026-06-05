'use client'

import { useState, useEffect } from 'react'

export const SALE_END_DATE = new Date('2026-06-12T23:59:59')

function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true }
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
      done: false,
    }
  }
  const [time, setTime] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

function Box({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center w-7">
      <span className="text-bombovo-yellow font-bold text-sm leading-none tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-white/50 text-[8px] uppercase tracking-wider mt-0.5">{label}</span>
    </div>
  )
}

export default function CountdownBanner() {
  const t = useCountdown(SALE_END_DATE)

  if (t.done) {
    return (
      <div className="bg-bombovo-dark py-2.5 text-center border-t border-white/10">
        <span className="text-white font-bold text-sm tracking-wide uppercase">Predaj ukončený</span>
      </div>
    )
  }

  return (
    <div className="bg-bombovo-dark border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5">
        <span className="text-white text-xs">Mikina sa dá kúpiť len do</span>
        <div className="flex items-center gap-1">
          <Box value={t.days} label="Dni" />
          <span className="text-white/30 text-xs pb-2.5">:</span>
          <Box value={t.hours} label="Hod" />
          <span className="text-white/30 text-xs pb-2.5">:</span>
          <Box value={t.minutes} label="Min" />
          <span className="text-white/30 text-xs pb-2.5">:</span>
          <Box value={t.seconds} label="Sek" />
        </div>
        <span className="text-white/60 text-xs">
          Táto ponuka platí už len <span className="text-bombovo-yellow font-semibold">{t.days} dní</span>.
        </span>
      </div>
    </div>
  )
}
