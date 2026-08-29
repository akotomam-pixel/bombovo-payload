'use client'

import { CLOSED_TERMIN_STATUS_RE } from '@/lib/terminyStatus'

/**
 * Bar fixed to the bottom of the viewport for the entire time a stredisko
 * page is open — including the hero, on purpose. Opening the page is the
 * trigger, not scroll position; it does not hide, ease in, or wait for
 * anything. (An earlier version showed it only past a scroll threshold, then
 * a later edit reverted that by mistake reading unrelated layout feedback as
 * a request to bring the scroll-trigger back — it was not. Always visible.)
 *
 * It carries no specific date on purpose — "Termíny" as a label, the standing
 * price, and one action — so it stays true whichever dates are still open.
 *
 * It replaces the hero's own mobile action bar rather than sitting beside
 * it (see LomyClient) — that one was removed when this was introduced, so
 * there's still only one fixed bottom bar, not two stacking on each other.
 *
 * CookieYes' revisit-consent icon (a remote widget injected via a script in
 * app/layout.tsx, no props of ours to move it) sits fixed at the bottom-left
 * corner too, roughly the same height as this bar now that it's always on
 * screen. The content row below is justify-end (flush against the button)
 * rather than centred, precisely so nothing of ours renders under that
 * corner — tried a dead left-padding gutter there first, read as cramped.
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
 * A term counts as available unless its status says vypredané or rezervované,
 * so this follows the same field the table and its buttons use. A contiguous
 * run collapses to "apríl – jún"; gaps are listed instead. Returns '' when
 * nothing is open, so the bar simply omits the line rather than claiming a
 * range that isn't there.
 */
export function availableMonths(items: { range: string; status: string }[]): string {
  const months = new Set<number>()

  for (const t of items) {
    if (CLOSED_TERMIN_STATUS_RE.test(t.status)) continue
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
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E6E8E6] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:gap-6 sm:px-6 sm:py-3.5 lg:px-8">
        {/* `flex-1` takes the space left of the button; `justify-end` sits
            the price/dates block flush against the button rather than
            centred across the whole bar, so the left corner — where
            CookieYes' revisit icon lives, see StickyBar's top comment —
            stays naturally empty instead of fought over or padded away. */}
        <div className="flex min-w-0 flex-1 items-center justify-end gap-4 sm:gap-6">
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

          {/*
            The price group splits deliberately on mobile: both figures on one
            line, the unit beneath. That buys the width to keep the figures at
            full size rather than shrinking them, and each part carries nowrap so
            neither can break mid-value — the euro sign used to drop on its own.
            From sm up it is one line again.
          */}
          <p className="flex shrink-0 flex-col items-start gap-x-1.5 sm:flex-row sm:items-baseline">
            {/* The two figures stay together on their own line, never breaking. */}
            <span className="flex items-baseline gap-1.5 whitespace-nowrap">
              <span className="text-[15px] font-medium text-[#9AA09A] line-through decoration-bombovo-red tabular-nums sm:text-[16px]">
                {price}
              </span>
              <span className="text-[22px] font-black leading-none tracking-[-0.02em] text-bombovo-dark tabular-nums sm:text-[27px]">
                {discounted}
              </span>
            </span>

            {/* Drops below the prices on mobile; rejoins the line from sm up. */}
            <span className="whitespace-nowrap text-[13px] font-medium leading-tight text-[#3A403A] sm:text-[14px]">
              {unit}
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="shrink-0 whitespace-nowrap rounded-full border-2 border-white bg-bombovo-red px-3.5 py-3 text-center text-[11.5px] font-bold tracking-[0.02em] text-white shadow-[0_4px_14px_-4px_rgba(223,41,53,0.5)] transition-transform duration-150 ease-out active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bombovo-blue xs:px-5 xs:text-[13px] sm:px-8 sm:py-4 sm:text-[15px] lg:px-9 lg:text-[16px]"
        >
          {cta}
        </button>
      </div>
    </div>
  )
}
