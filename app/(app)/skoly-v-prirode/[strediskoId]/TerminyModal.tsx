'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import type { LomyTerminy } from '@/data/lomy/types'

/**
 * Termíny dialog for the rebuilt Lomy page.
 *
 * Mounting follows the pattern the site's existing popups use (portal to
 * document.body, backdrop click closes, z-[200]); this adds what a dialog opened
 * from a button also needs — Escape, a focus trap, scroll lock, and an exit
 * animation, none of which the auto-opening popups had to handle.
 *
 * Visual language is carried over from the hero: the brand-grey slab cut by the
 * same generated wave, a drawn glyph rather than an icon-pack calendar, yellow
 * as the accent, and red reserved for the one booking action per row.
 */

/** Wave edge under the header, generated the same way as the hero's price slab. */
const WAVE_PATH = (() => {
  const width = 400
  const halfWaves = 10
  const amplitude = 4.5
  const mid = 9
  const half = width / halfWaves
  let d = `M0 ${mid - amplitude}`
  for (let i = 0; i < halfWaves; i++) {
    const from = i % 2 === 0 ? mid - amplitude : mid + amplitude
    const to = i % 2 === 0 ? mid + amplitude : mid - amplitude
    const cx = half * i + half / 2
    d += ` C ${cx} ${from}, ${cx} ${to}, ${half * (i + 1)} ${to}`
  }
  return `${d} L ${width} 18 L 0 18 Z`
})()

/** Month label pulled off the range, so the list can be grouped by it. */
const MONTHS: Record<string, string> = {
  '04': 'Apríl 2027',
  '05': 'Máj 2027',
  '06': 'Jún 2027',
}
const monthOf = (range: string) => MONTHS[range.slice(3, 5)] ?? ''

export default function TerminyModal({
  content,
  open,
  onClose,
}: {
  content: LomyTerminy
  open: boolean
  onClose: () => void
}) {
  const [mounted, setMounted] = useState(false)
  // Kept mounted through the exit animation, then removed.
  const [visible, setVisible] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (open) {
      setVisible(true)
      return
    }
    // Matches the exit transition below; the node stays until it finishes.
    const t = setTimeout(() => setVisible(false), 200)
    return () => clearTimeout(t)
  }, [open])

  // Escape closes, and Tab is kept inside the dialog while it is open.
  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Scroll lock. The scrollbar's width is replaced with padding so the page
  // behind doesn't shift sideways as it disappears.
  useEffect(() => {
    if (!open) return
    const { overflow, paddingRight } = document.body.style
    const gap = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (gap > 0) document.body.style.paddingRight = `${gap}px`
    return () => {
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
    }
  }, [open])

  // Move focus to the close control when the dialog opens.
  useEffect(() => {
    if (open) requestAnimationFrame(() => closeRef.current?.focus())
  }, [open])

  const stop = useCallback((e: React.MouseEvent) => e.stopPropagation(), [])

  if (!mounted || (!open && !visible)) return null

  let lastMonth = ''

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${content.title} — ${content.subtitle}`}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden
        className={`absolute inset-0 bg-[#080708]/65 backdrop-blur-[3px] transition-opacity duration-200 ease-out ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Panel — full-height sheet on mobile, centred dialog from sm up. */}
      <div
        ref={panelRef}
        onClick={stop}
        className={`relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[18px] bg-white shadow-[0_30px_80px_-24px_rgba(8,7,8,0.5)] transition-[opacity,transform] duration-200 ease-out sm:max-h-[86vh] sm:max-w-[560px] sm:rounded-[18px] ${
          open ? 'translate-y-0 opacity-100 sm:scale-100' : 'translate-y-3 opacity-0 sm:translate-y-0 sm:scale-[0.97]'
        }`}
      >
        {/* ── Header ── */}
        <div className="relative shrink-0 bg-bombovo-gray px-6 pb-9 pt-6 sm:px-7">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-[21px] font-bold leading-tight tracking-[-0.02em] text-bombovo-dark sm:text-[23px]">
                {content.title}
              </h2>
              <p className="mt-1 text-[13px] font-medium text-[#5C625C]">{content.subtitle}</p>
            </div>

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Zavrieť"
              className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/70 text-bombovo-dark transition-[background-color,transform] duration-150 ease-out hover:bg-white active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bombovo-blue"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden>
                <path d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <svg
            viewBox="0 0 400 18"
            preserveAspectRatio="none"
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-[-1px] h-[16px] w-full"
          >
            <path d={WAVE_PATH} fill="#FFFFFF" />
          </svg>
        </div>

        {/* ── Dates ── */}
        <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-5 pt-2 sm:px-5">
          {content.items.map((t) => {
            const month = monthOf(t.range)
            const showMonth = month !== lastMonth
            lastMonth = month

            return (
              <li key={t.range}>
                {showMonth && (
                  <p className="px-2 pb-1.5 pt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[#8A908A] first:pt-1">
                    {month}
                  </p>
                )}

                <div className="flex items-center gap-3 rounded-[12px] px-2 py-2.5 transition-colors duration-150 hover:bg-[#F7F8F7] sm:gap-4 sm:px-3">
                  {/* Drawn calendar-leaf glyph, yellow on the brand dark. */}
                  <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-bombovo-dark">
                    <svg viewBox="0 0 24 24" className="h-[19px] w-[19px] text-bombovo-yellow" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <rect x="3.4" y="5.6" width="17.2" height="15" rx="2.2" />
                      <path d="M3.4 10.2h17.2" />
                      <path d="M8.2 3.4v3.6M15.8 3.4v3.6" />
                    </svg>
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold leading-snug text-bombovo-dark tabular-nums sm:text-[15px]">
                      {t.range}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-[12px] text-[#8A908A]">
                      <span>{content.duration}</span>
                      <span aria-hidden className="h-[3px] w-[3px] rounded-full bg-[#C9CEC9]" />
                      {/*
                        Status is hand-maintained content, not derived state. The
                        marker is brand yellow rather than the usual green — the
                        palette has no green, and inventing one for a single dot
                        would break it.
                      */}
                      <span className="inline-flex items-center gap-1.5 font-semibold text-[#5C625C]">
                        <span aria-hidden className="h-[6px] w-[6px] rounded-full bg-bombovo-yellow" />
                        {t.status}
                      </span>
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="flex items-baseline justify-end gap-1.5">
                      <span className="text-[12.5px] font-medium text-[#9AA09A] line-through decoration-bombovo-red tabular-nums">
                        {t.price}
                      </span>
                      <span className="text-[17px] font-bold leading-none tracking-[-0.02em] text-bombovo-dark tabular-nums">
                        {t.discounted}
                      </span>
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#8A908A]">{content.deadline}</p>
                  </div>

                  {/*
                    Inert by design: the enquiry form is a later piece. It is
                    styled as a real control and announces itself as not yet
                    active rather than looking broken or failing on click.
                  */}
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    title={`${content.bookLabel} — ${content.bookNote}`}
                    className="hidden shrink-0 cursor-not-allowed flex-col items-center rounded-[8px] bg-bombovo-red/90 px-3.5 py-2 text-white sm:flex"
                  >
                    <span className="text-[11px] font-bold leading-none tracking-[0.04em]">
                      {content.bookLabel}
                    </span>
                    <span className="mt-1 text-[9.5px] font-semibold uppercase leading-none tracking-[0.08em] text-white/75">
                      {content.bookNote}
                    </span>
                  </button>
                </div>
              </li>
            )
          })}
        </ul>

        {/*
          On mobile the per-row button is dropped — twelve red buttons in a
          narrow sheet crowds the dates themselves — and the same message is
          given once at the foot instead.
        */}
        <div className="shrink-0 border-t border-[#EAECEA] bg-[#FBFCFB] px-5 py-3.5 pb-[calc(0.875rem+env(safe-area-inset-bottom))] sm:hidden">
          <p className="text-center text-[12px] text-[#5C625C]">
            Rezervácia termínu bude dostupná čoskoro.
          </p>
        </div>
      </div>
    </div>,
    document.body,
  )
}
