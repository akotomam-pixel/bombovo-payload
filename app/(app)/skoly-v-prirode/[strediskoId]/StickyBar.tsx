'use client'

import { useEffect, useState } from 'react'

/**
 * Bar that follows the scroll once the hero's own price card is out of view.
 *
 * It carries no specific date on purpose — "Termíny" as a label, the standing
 * price, and one action — so it stays true whichever dates are still open. The
 * behaviour is borrowed (appear on scroll, stay fixed, compact horizontal row);
 * the styling is this page's own.
 *
 * It replaces the hero's mobile action bar rather than sitting beside it: two
 * fixed bars at the bottom of a phone screen would stack on each other.
 */
/** Month names in the order they appear in a date range like "05.04. – 09.04.2027". */
const MONTH_NAMES = [
  'január',
  'február',
  'marec',
  'apríl',
  'máj',
  'jún',
  'júl',
  'august',
  'september',
  'október',
  'november',
  'december',
]

/**
 * Which months still have dates, read off the terms themselves.
 *
 * A term counts as available unless its status says sold out, so this follows
 * the same field the table and its buttons use. A contiguous run collapses to
 * "apríl – jún"; gaps are listed instead. Returns '' when nothing is open, so
 * the bar simply omits the line rather than claiming a range that isn't there.
 */
export function availableMonths(items: { range: string; status: string }[]): string {
  const months = new Set<number>()

  for (const t of items) {
    if (/vypredan/i.test(t.status)) continue
    // "05.04. – 09.04.2027" — the month is the second pair of digits.
    const m = t.range.match(/^\d{2}\.(\d{2})\./)
    if (m) months.add(parseInt(m[1], 10) - 1)
  }

  const sorted = [...months].sort((a, b) => a - b)
  if (sorted.length === 0) return ''
  if (sorted.length === 1) return MONTH_NAMES[sorted[0]]

  const contiguous = sorted.every((m, i) => i === 0 || m === sorted[i - 1] + 1)
  return contiguous
    ? `${MONTH_NAMES[sorted[0]]} – ${MONTH_NAMES[sorted[sorted.length - 1]]}`
    : sorted.map((m) => MONTH_NAMES[m]).join(', ')
}

export default function StickyBar({
  label,
  cta,
  price,
  discounted,
  unit,
  months,
  onOpen,
}: {
  label: string
  cta: string
  price: string
  discounted: string
  unit: string
  /** Pre-computed by the caller from the real term list. */
  months: string
  onOpen: () => void
}) {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    // Appears once the page has scrolled past roughly the hero.
    const onScroll = () => setShown(window.scrollY > 620)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-[#E6E8E6] bg-white/95 backdrop-blur-md transition-transform duration-300 ease-out ${
        shown ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:gap-6 sm:px-6 sm:py-3.5 lg:px-8">
        <div className="flex min-w-0 items-center gap-4 sm:gap-6">
          {/* Label and the months that actually have dates. */}
          <div className="hidden min-w-0 shrink-0 sm:block">
            <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#5C625C]">
              {label}
            </p>
            {months && (
              <p className="mt-0.5 truncate text-[15px] font-semibold text-bombovo-dark">
                {months}
              </p>
            )}
          </div>

          <span aria-hidden className="hidden h-10 w-px shrink-0 bg-[#E6E8E6] sm:block" />

          {/* One tight price group: struck original, the figure charged, the unit. */}
          <p className="flex min-w-0 items-baseline gap-1.5">
            <span className="text-[15px] font-medium text-[#9AA09A] line-through decoration-bombovo-red tabular-nums sm:text-[16px]">
              {price}
            </span>
            <span className="text-[23px] font-black leading-none tracking-[-0.02em] text-bombovo-dark tabular-nums sm:text-[27px]">
              {discounted}
            </span>
            <span className="whitespace-nowrap text-[14px] font-medium text-[#3A403A]">{unit}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="shrink-0 rounded-full border-2 border-white bg-bombovo-red px-6 py-3 text-center text-[15px] font-bold text-white shadow-[0_4px_14px_-4px_rgba(223,41,53,0.5)] transition-transform duration-150 ease-out active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bombovo-blue sm:px-9 sm:py-4 sm:text-[17px]"
        >
          {cta}
        </button>
      </div>
    </div>
  )
}
