'use client'

import Link from 'next/link'
import type { LomyProgram } from '@/data/lomy/types'

/**
 * "Overený animačný program".
 *
 * Deliberately short — the draft asks for a paragraph, not a presentation of the
 * programme, which is what the linked page is for. Section 4 already carries the
 * ratios, materials and prices; this one is about the team behind them.
 *
 * The gallery is the same across every stredisko rather than shot at this venue,
 * and the photos are still outstanding, so it renders marked slots until
 * `gallery` in the content file has entries.
 */

/** Sub-headings across the page are set in this face by explicit instruction. */
const SUBHEAD = '"Comic Sans MS", "Comic Sans", cursive'

/** Next.js image optimizer URL — same mechanism the rest of the page uses. */
const opt = (src: string, w: number) => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=80`

/** Marked slot standing in for a gallery photo that has not been supplied. */
function PhotoSlot({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-1.5 rounded-[10px] border-2 border-dashed border-[#C9CEC9] bg-[#EFF1EF] px-3 text-center ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-7 w-7 text-[#A2A8A2]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <rect x="3" y="4.5" width="18" height="15" rx="2" />
        <circle cx="8.6" cy="9.6" r="1.6" />
        <path d="m3.6 17.4 5-4.6 3.6 3.2 3.4-2.8 4.8 4.2" />
      </svg>
      <p className="text-[11.5px] font-semibold leading-tight text-[#6C726C]">Miesto pre fotku</p>
    </div>
  )
}

export default function ProgramSection({ content }: { content: LomyProgram }) {
  const { heading, paragraph, cta, gallery } = content
  const hasPhotos = gallery.length > 0

  return (
    <section className="bg-bombovo-gray">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
          {/*
            Gallery left. One tall frame beside two stacked ones, so the group
            reads as a set of programme moments rather than a uniform grid.
          */}
          <div className="lg:col-span-6">
            {hasPhotos ? (
              <div className="grid grid-cols-2 gap-3">
                <img
                  src={opt(gallery[0].src, 800)}
                  alt={gallery[0].alt}
                  className="h-full min-h-[260px] w-full rounded-[10px] object-cover md:min-h-[320px]"
                />
                <div className="flex flex-col gap-3">
                  {gallery.slice(1, 3).map((p) => (
                    <img
                      key={p.src}
                      src={opt(p.src, 500)}
                      alt={p.alt}
                      className="h-full min-h-[124px] w-full rounded-[10px] object-cover md:min-h-[154px]"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <PhotoSlot className="min-h-[260px] md:min-h-[320px]" />
                <div className="flex flex-col gap-3">
                  <PhotoSlot className="min-h-[124px] md:min-h-[154px]" />
                  <PhotoSlot className="min-h-[124px] md:min-h-[154px]" />
                </div>
              </div>
            )}
          </div>

          {/* Text right. */}
          <div className="lg:col-span-6">
            <h2
              className="text-[clamp(1.6rem,3vw,2.1rem)] leading-[1.1] text-bombovo-dark"
              style={{ fontFamily: SUBHEAD }}
            >
              {heading}
            </h2>

            <p className="mt-4 max-w-[62ch] text-[15px] leading-[1.7] text-[#3E443E] md:text-[15.5px]">
              {paragraph}
            </p>

            <Link
              href={cta.href}
              className="mt-6 inline-flex items-center gap-2 rounded-[9px] bg-bombovo-blue px-6 py-3.5 text-[13.5px] font-bold uppercase tracking-[0.045em] text-white shadow-[0_3px_0_0_#1E49B8,0_10px_22px_-10px_rgba(55,114,255,0.75)] transition-[background-color,box-shadow,transform] duration-150 ease-out hover:bg-[#2F66EE] active:translate-y-[3px] active:shadow-[0_0_0_0_#1E49B8,0_6px_14px_-10px_rgba(55,114,255,0.7)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bombovo-blue"
            >
              {cta.label}
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
