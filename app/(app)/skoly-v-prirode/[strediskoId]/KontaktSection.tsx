'use client'

import LomyEnquiryForm from '@/components/LomyEnquiryForm'
import type { LomyKontakt, LomyTerminy } from '@/data/lomy/types'

/**
 * Section 7, as two stacked full-width blocks: the dates teaser, then the
 * enquiry form.
 *
 * The teaser shows the first rows of the real table under a fade, so it reads as
 * a live list that continues rather than a picture of one; the button opens the
 * full dialog. The form is the shared LomyEnquiryForm, the same component the
 * hero popup and the /prihlaska-svp/horsky-hotel-lomy page render.
 */

const SUBHEAD = 'var(--font-subhead), "Comic Sans MS", cursive'

/** Rows shown in full before the fade takes over the next one. */
const TEASER_ROWS = 3

const COLS = 'grid grid-cols-[minmax(0,1.4fr)_minmax(0,0.7fr)_minmax(0,0.9fr)] items-center gap-4'

export default function KontaktSection({
  content,
  terminy,
  onOpenTerminy,
  strediskoName,
}: {
  content: LomyKontakt
  terminy: LomyTerminy
  onOpenTerminy: () => void
  strediskoName: string
}) {
  const preview = terminy.items.slice(0, TEASER_ROWS)
  const fading = terminy.items[TEASER_ROWS]
  const remaining = Math.max(terminy.items.length - TEASER_ROWS, 0)

  const row = (t: { range: string; price: string; discounted: string }) => (
    <div key={t.range} className={`${COLS} border-t border-[#EDEFED] px-5 py-3.5`}>
      <p className="text-center text-[17px] font-semibold text-bombovo-dark tabular-nums">
        {t.range}
      </p>
      <p className="text-center text-[17px] font-semibold text-bombovo-dark">{terminy.duration}</p>
      <p className="flex items-baseline justify-center gap-1.5">
        <span className="text-[15px] font-medium text-[#9AA09A] line-through tabular-nums">
          {t.price}
        </span>
        <span className="text-[19px] font-black text-bombovo-dark tabular-nums">
          {t.discounted}
        </span>
      </p>
    </div>
  )

  return (
    <section id="terminy" className="scroll-mt-20 bg-bombovo-gray">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        {/* ── Block 1: dates teaser ── */}
        <h2
          className="text-[clamp(1.5rem,3vw,2.1rem)] leading-[1.1] text-bombovo-dark font-bold"
          style={{ fontFamily: SUBHEAD }}
        >
          {content.terminyHeading}
        </h2>

        {/* No frame around the teaser — the yellow header bar carries it. */}
        <div className="relative mt-4 overflow-hidden rounded-[12px] bg-white">
          <div className={`${COLS} bg-bombovo-yellow px-5 py-3.5`}>
            {['Termín', 'Počet dní', 'Cena'].map((h) => (
              <p key={h} className="text-center text-[17px] font-black text-bombovo-dark">
                {h}
              </p>
            ))}
          </div>

          {preview.map(row)}
          {fading && row(fading)}

          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[92px] bg-gradient-to-t from-white via-white/85 to-transparent"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={onOpenTerminy}
            className="inline-flex items-center justify-center rounded-full border-2 border-bombovo-dark bg-white px-7 py-3.5 text-[17px] font-bold text-bombovo-dark transition-colors duration-200 hover:bg-bombovo-dark hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bombovo-blue"
          >
            {content.terminyCta}
          </button>
          <p className="text-[17px] text-[#3A403A]">a ďalších {remaining} termínov</p>
        </div>

        {/* ── Block 2: the form, stacked below ── */}
        <h2
          className="mt-12 text-[clamp(1.5rem,3vw,2.1rem)] leading-[1.1] text-bombovo-blue md:mt-16 font-bold"
          style={{ fontFamily: SUBHEAD }}
        >
          {content.formHeading}
        </h2>

        <LomyEnquiryForm className="mt-6" strediskoName={strediskoName} />
      </div>
    </section>
  )
}
