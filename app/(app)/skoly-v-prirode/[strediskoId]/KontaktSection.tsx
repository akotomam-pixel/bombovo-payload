'use client'

import Link from 'next/link'
import type { LomyKontakt, LomyTerminy } from '@/data/lomy/types'

/**
 * Section 7: the dates teaser beside the route into the enquiry form.
 *
 * The teaser shows the first rows of the real table under a fade, so it reads as
 * a live list that continues rather than a picture of one; the button opens the
 * full dialog. The form is the existing /prihlaska-svp page, reached from here
 * and from the sticky bar, rather than a second form built for this page.
 *
 * Layout is two columns from lg and stacked below it — the teaser needs its full
 * table width to look like a table at all, and side by side under ~1024px leaves
 * both halves too narrow to read.
 */

const SUBHEAD = '"Comic Sans MS", "Comic Sans", cursive'

/** Rows shown before the fade takes over. */
const TEASER_ROWS = 3

export default function KontaktSection({
  content,
  terminy,
  onOpenTerminy,
  strediskoSlug,
}: {
  content: LomyKontakt
  terminy: LomyTerminy
  onOpenTerminy: () => void
  strediskoSlug: string
}) {
  const preview = terminy.items.slice(0, TEASER_ROWS)

  return (
    <section id="terminy" className="scroll-mt-20 bg-bombovo-gray">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          {/* ── Dates teaser ── */}
          <div>
            <h2
              className="text-[clamp(1.5rem,3vw,2.1rem)] leading-[1.1] text-bombovo-dark"
              style={{ fontFamily: SUBHEAD }}
            >
              {content.terminyHeading}
            </h2>

            <div className="relative mt-4 overflow-hidden rounded-[14px] border-4 border-bombovo-blue bg-white">
              <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,0.7fr)_minmax(0,0.9fr)] items-center gap-4 bg-bombovo-yellow px-5 py-3">
                {['Termín', 'Počet dní', 'Cena'].map((h) => (
                  <p key={h} className="text-center text-[14px] font-black text-bombovo-dark">
                    {h}
                  </p>
                ))}
              </div>

              {preview.map((t) => (
                <div
                  key={t.range}
                  className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,0.7fr)_minmax(0,0.9fr)] items-center gap-4 border-t border-[#EDEFED] px-5 py-3.5"
                >
                  <p className="text-center text-[14.5px] font-semibold text-bombovo-dark tabular-nums">
                    {t.range}
                  </p>
                  <p className="text-center text-[14.5px] font-semibold text-bombovo-dark">
                    {terminy.duration}
                  </p>
                  <p className="flex items-baseline justify-center gap-1.5">
                    <span className="text-[13px] font-medium text-[#9AA09A] line-through tabular-nums">
                      {t.price}
                    </span>
                    <span className="text-[17px] font-black text-bombovo-dark tabular-nums">
                      {t.discounted}
                    </span>
                  </p>
                </div>
              ))}

              {/* A fourth row, half-covered by the fade, so the list reads as cut off. */}
              {terminy.items[TEASER_ROWS] && (
                <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,0.7fr)_minmax(0,0.9fr)] items-center gap-4 border-t border-[#EDEFED] px-5 py-3.5">
                  <p className="text-center text-[14.5px] font-semibold text-bombovo-dark tabular-nums">
                    {terminy.items[TEASER_ROWS].range}
                  </p>
                  <p className="text-center text-[14.5px] font-semibold text-bombovo-dark">
                    {terminy.duration}
                  </p>
                  <p className="flex items-baseline justify-center gap-1.5">
                    <span className="text-[13px] font-medium text-[#9AA09A] line-through tabular-nums">
                      {terminy.items[TEASER_ROWS].price}
                    </span>
                    <span className="text-[17px] font-black text-bombovo-dark tabular-nums">
                      {terminy.items[TEASER_ROWS].discounted}
                    </span>
                  </p>
                </div>
              )}

              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[92px] bg-gradient-to-t from-white via-white/85 to-transparent"
              />
            </div>

            <p className="mt-3 text-[13px] text-[#5C625C]">
              a ďalších {Math.max(terminy.items.length - TEASER_ROWS, 0)} termínov
            </p>

            <button
              type="button"
              onClick={onOpenTerminy}
              className="mt-4 inline-flex items-center justify-center rounded-full border-2 border-bombovo-dark bg-white px-7 py-3.5 text-[14px] font-bold text-bombovo-dark transition-colors duration-200 hover:bg-bombovo-dark hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bombovo-blue"
            >
              {content.terminyCta}
            </button>
          </div>

          {/* ── Enquiry ── */}
          <div className="rounded-[14px] bg-white p-6 shadow-[0_1px_2px_rgba(8,7,8,0.04),0_16px_36px_-26px_rgba(8,7,8,0.28)] ring-1 ring-[#DDE0DD] sm:p-8">
            <h2
              className="text-[clamp(1.5rem,3vw,2.1rem)] leading-[1.1] text-bombovo-blue"
              style={{ fontFamily: SUBHEAD }}
            >
              {content.formHeading}
            </h2>

            <p className="mt-3 max-w-[52ch] text-[14.5px] leading-[1.65] text-[#2B2E2B]">
              {content.formIntro}
            </p>

            <ul className="mt-5 flex flex-col gap-2.5">
              {['Odpovieme do 24 hodín', 'Ponuka na mieru pre vašu školu', 'Nezáväzne a zadarmo'].map(
                (item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg
                      viewBox="0 0 24 24"
                      className="mt-[3px] h-[15px] w-[15px] shrink-0 text-bombovo-blue"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="m5 12.5 4.6 4.5L19 7.5" />
                    </svg>
                    <span className="text-[14px] text-[#2B2E2B]">{item}</span>
                  </li>
                ),
              )}
            </ul>

            <Link
              href={`/prihlaska-svp/${strediskoSlug}`}
              className="mt-6 inline-flex items-center justify-center rounded-full border-2 border-white bg-bombovo-red px-7 py-3.5 text-center text-[14px] font-bold text-white transition-transform duration-150 ease-out active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bombovo-blue"
            >
              {content.formCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
