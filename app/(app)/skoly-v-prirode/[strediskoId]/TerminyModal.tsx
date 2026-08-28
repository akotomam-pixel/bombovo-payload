'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import Link from 'next/link'
import type { LomyTerminy } from '@/data/lomy/types'
import { CLOSED_TERMIN_STATUS_RE, openTerminyCount, urgencyText } from '@/lib/terminyStatus'

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

/**
 * The row's action: a link to the existing registration page.
 *
 * A term counts as closed when its `status` says "vypredané" or "rezervované"
 * (both hand-written in content.ts), which is the one field driving both the
 * Dostupnosť column and this control. The button's own label and tooltip
 * follow whichever word the status actually uses, rather than hardcoding one.
 *
 * The date travels as `?termin=` text rather than the `?d=` index that page
 * normally takes. Its index reads `data/strediska/horsky-hotel-lomy.ts`, which
 * still holds the 2026 season at 185 €, so an index from this 2027 list would
 * pre-fill the wrong date entirely.
 *
 * Closed rows render as a disabled button rather than a link.
 */
function BookButton({
  content,
  slug,
  status,
  range,
  className = '',
}: {
  content: LomyTerminy
  slug: string
  status: string
  range: string
  className?: string
}) {
  const closed = CLOSED_TERMIN_STATUS_RE.test(status)
  const shape = `shrink-0 rounded-full border-2 px-6 py-3 text-center text-[17px] font-bold ${className}`

  if (closed) {
    const adjective = /rezervovan/i.test(status) ? 'rezervovaný' : 'vypredaný'
    return (
      <button
        type="button"
        disabled
        aria-disabled="true"
        title={`Termín je ${adjective}`}
        className={`${shape} cursor-not-allowed border-gray-300 bg-bombovo-red/30 text-gray-600`}
      >
        {status.toUpperCase()}
      </button>
    )
  }

  return (
    <Link
      href={`/prihlaska-svp/${slug}?termin=${encodeURIComponent(range)}`}
      className={`${shape} border-white bg-bombovo-red text-white transition-transform duration-150 ease-out active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bombovo-blue`}
    >
      {content.bookLabel}
    </Link>
  )
}

export default function TerminyModal({
  content,
  slug,
  open,
  onClose,
}: {
  content: LomyTerminy
  slug: string
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

  // Separate trackers: the desktop table and the mobile list each walk the
  // items once, so one shared counter would suppress the mobile headings.
  let lastMonth = ''
  let lastMobileMonth = ''

  // Driven by `status`, not typed by hand — stays correct as dates get booked.
  const openCount = openTerminyCount(content.items)
  const showUrgency = content.upozornenie && openCount > 0

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-6 lg:p-10"
      role="dialog"
      aria-modal="true"
      aria-label={`${content.title}, ${content.subtitle}`}
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
        className={`relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[18px] bg-white shadow-[0_30px_80px_-24px_rgba(8,7,8,0.5)] transition-[opacity,transform] duration-200 ease-out sm:max-h-[88vh] sm:max-w-[560px] sm:rounded-[18px] md:h-[88vh] md:max-w-[1500px] ${
          open ? 'translate-y-0 opacity-100 sm:scale-100' : 'translate-y-3 opacity-0 sm:translate-y-0 sm:scale-[0.97]'
        }`}
      >
        {/* ── Header ── */}
        <div className="relative shrink-0 bg-bombovo-gray px-6 pb-8 pt-5 sm:px-7 md:px-9 md:pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              {/* Subtitle removed on instruction; `subtitle` still labels the dialog. */}
              <h2 className="text-[21px] font-bold leading-tight tracking-[-0.02em] text-bombovo-dark sm:text-[23px] md:text-[30px]">
                {content.title}
              </h2>
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

        {/*
          ── Urgency banner ──
          Hand-flipped on per stredisko (`upozornenie` in content.ts); the count
          and word ending are read off the same `status` field driving the rest
          of the dialog, so this can't say "posledné 2" once there's only one
          left, or keep shouting once they're all gone. Pinned above the
          scrollable list rather than inside it, so it stays visible.
        */}
        {showUrgency && (
          <div className="shrink-0 border-b-2 border-[#8f0f10] bg-bombovo-red px-6 py-3.5 sm:px-7 md:px-9">
            <p className="flex items-center justify-center gap-2.5 text-center text-[15px] font-bold uppercase tracking-[0.02em] text-white sm:text-[16px]">
              <svg
                viewBox="0 0 24 24"
                className="h-[18px] w-[18px] shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M12 9v4.5M12 17h.01" />
                <path d="M10.29 3.86 1.82 18a1.5 1.5 0 0 0 1.29 2.25h17.78A1.5 1.5 0 0 0 22.18 18L13.71 3.86a1.5 1.5 0 0 0-2.42 0Z" />
              </svg>
              {urgencyText(openCount)}
            </p>
          </div>
        )}

        {/* ── Dates ── */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {/*
            Desktop: the site's own table — a yellow header bar over centred
            columns, as on the original stredisko page.

            Each row says one thing per column and stops. The "do 31.10"
            deadline that used to repeat under all twelve prices is gone: fine
            print restated on every line is noise, and the deadline is already on
            the hero seal and in the pricing section. "5 dní" moves into the
            Počet dní column instead of trailing the date.
          */}
          <div className="hidden md:block px-8 pb-8 pt-3">
            <div className="overflow-hidden rounded-3xl border-4 border-bombovo-blue">
              <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,0.7fr)_minmax(0,0.8fr)_minmax(0,0.9fr)_190px] items-center gap-6 bg-bombovo-yellow px-9 py-6">
                {['Termín', 'Počet dní', 'Dostupnosť', 'Cena', ''].map((h, i) => (
                  <h3 key={h || i} className="text-center text-[19px] font-black text-bombovo-dark">
                    {h}
                  </h3>
                ))}
              </div>

              <div className="bg-white">
                {content.items.map((t) => {
                  const month = monthOf(t.range)
                  const showMonth = month !== lastMonth
                  lastMonth = month
                  const closed = CLOSED_TERMIN_STATUS_RE.test(t.status)

                  return (
                    <div key={t.range}>
                      {showMonth && (
                        <p className="bg-bombovo-gray/60 px-9 py-3 text-[17px] font-black uppercase tracking-[0.14em] text-bombovo-dark">
                          {month}
                        </p>
                      )}

                      <div
                        className={`grid grid-cols-[minmax(0,1.5fr)_minmax(0,0.7fr)_minmax(0,0.8fr)_minmax(0,0.9fr)_190px] items-center gap-6 border-t border-[#EDEFED] px-9 py-5 ${
                          closed ? 'opacity-50' : ''
                        }`}
                      >
                        <div className="text-center">
                          <p className="text-[19px] font-semibold text-bombovo-dark tabular-nums">{t.range}</p>
                          {t.chatky && (
                            <p className="mt-1 text-[12.5px] font-medium text-[#6B716B]">
                              + 7-miestne chatky <span className="text-[#9AA09A]">(100 osôb)</span>
                            </p>
                          )}
                        </div>

                        <p className="text-center text-[17px] font-semibold text-bombovo-dark">
                          {content.duration}
                        </p>

                        {/* Hand-maintained in content.ts — change the word to change the row. */}
                        <div className="text-center">
                          <p className="text-[17.5px] font-semibold text-bombovo-dark">{t.status}</p>
                          {t.volnychMiest !== undefined && (
                            <span className="mt-1.5 inline-flex items-center rounded-full bg-[#E8F3EA] px-2.5 py-1 text-[12px] font-bold text-[#2A7038]">
                              ešte {t.volnychMiest} miest
                            </span>
                          )}
                        </div>

                        {/* Price underlined in red, as on the original table. */}
                        <p className="text-center">
                          <span className="inline-block border-b-4 border-bombovo-red pb-1">
                            <span className="text-[17.5px] font-medium text-[#9AA09A] line-through tabular-nums">
                              {t.price}
                            </span>{' '}
                            <span className="text-[25px] font-black text-bombovo-dark tabular-nums">
                              {t.discounted}
                            </span>
                          </span>
                        </p>

                        <BookButton content={content} slug={slug} status={t.status} range={t.range} className="w-[190px]" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Mobile: the stacked cards stay — the right pattern on a narrow screen. */}
          <ul className="px-4 pb-5 pt-2 md:hidden">
            {content.items.map((t) => {
              const month = monthOf(t.range)
              const showMonth = month !== lastMobileMonth
              lastMobileMonth = month

              return (
                <li key={t.range}>
                  {showMonth && (
                    <p className="px-2 pb-1.5 pt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[#8A908A] first:pt-1">
                      {month}
                    </p>
                  )}

                  <div className="flex items-center gap-3 rounded-[12px] px-2 py-2.5">
                    <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-bombovo-dark">
                      <svg viewBox="0 0 24 24" className="h-[19px] w-[19px] text-bombovo-yellow" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <rect x="3.4" y="5.6" width="17.2" height="15" rx="2.2" />
                        <path d="M3.4 10.2h17.2" />
                        <path d="M8.2 3.4v3.6M15.8 3.4v3.6" />
                      </svg>
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="text-[17px] font-semibold leading-snug text-bombovo-dark tabular-nums">
                        {t.range}
                      </p>
                      {/* One line: length and status, no repeated fine print. */}
                      <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-[#8A908A]">
                        <span>{content.duration}</span>
                        <span aria-hidden className="h-[3px] w-[3px] rounded-full bg-[#C9CEC9]" />
                        <span className="font-semibold text-[#3A403A]">{t.status}</span>
                        {t.volnychMiest !== undefined && (
                          <span className="inline-flex items-center rounded-full bg-[#E8F3EA] px-2 py-0.5 text-[11px] font-bold text-[#2A7038]">
                            ešte {t.volnychMiest}
                          </span>
                        )}
                      </p>
                      {t.chatky && (
                        <p className="mt-1 text-[11.5px] font-medium text-[#8A908A]">
                          + 7-miestne chatky (100 osôb)
                        </p>
                      )}
                    </div>

                    <p className="flex shrink-0 items-baseline gap-1.5">
                      <span className="text-[12.5px] font-medium text-[#9AA09A] line-through decoration-bombovo-red tabular-nums">
                        {t.price}
                      </span>
                      <span className="text-[17px] font-black text-bombovo-dark tabular-nums">
                        {t.discounted}
                      </span>
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        {/*
          Mobile has no per-row button — twelve red buttons in a narrow sheet
          crowds the dates themselves — and on desktop the buttons no longer
          carry their own "čoskoro" line, so the message is given once here for
          both.
        */}
        <div className="shrink-0 border-t border-[#EAECEA] bg-[#FBFCFB] px-5 py-3.5 pb-[calc(0.875rem+env(safe-area-inset-bottom))]">
          <p className="text-center text-[12px] text-[#3A403A]">
            Rezervácia termínu bude dostupná čoskoro.
          </p>
        </div>
      </div>
    </div>,
    document.body,
  )
}
