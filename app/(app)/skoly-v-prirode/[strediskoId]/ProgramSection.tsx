'use client'

import { useMemo, useRef } from 'react'
import Link from 'next/link'
import LightGallery from 'lightgallery/react'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgZoom from 'lightgallery/plugins/zoom'
import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-zoom.css'
import 'lightgallery/css/lg-thumbnail.css'
import type { LomyProgram } from '@/data/lomy/types'

/**
 * "Overený animačný program".
 *
 * Deliberately short — the draft asks for a paragraph, not a presentation of the
 * programme, which is what the linked page is for. Section 4 already carries the
 * ratios, materials and prices; this one is about the team behind them.
 *
 * The gallery is the same across every stredisko rather than shot at this venue
 * (see data/programGallery.ts) — a real, hand-curated photo library, not a set
 * of placeholders. Its thumbnails are four equal squares in a 2x2 grid; the
 * rest of the library (any count) is reachable through the LightGallery
 * lightbox the last square opens, same mechanism the hero uses. Renders
 * marked slots only if `gallery` is ever empty.
 */

/** Sub-headings across the page are set in this face by explicit instruction. */
const SUBHEAD = 'var(--font-subhead), "Comic Sans MS", cursive'

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
      <p className="text-[11.5px] font-semibold leading-tight text-[#3A403A]">Miesto pre fotku</p>
    </div>
  )
}

export default function ProgramSection({ content }: { content: LomyProgram }) {
  const { heading, paragraph, cta, gallery } = content
  const hasPhotos = gallery.length > 0

  // Lightbox, driven the same way as the hero's: a hidden instance opened by
  // index, so the visible thumbnails stay ordinary buttons.
  const lgRef = useRef<any>(null)
  const galleryDynamicEl = useMemo(
    () => gallery.map((p) => ({ src: p.src, thumb: opt(p.src, 384), subHtml: `<h4>${p.alt}</h4>` })),
    [gallery],
  )
  const openGallery = (i: number) => lgRef.current?.openGallery(i)

  return (
    <section className="bg-bombovo-gray">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        {/*
          Direct grid children, so the mobile stack can differ from the
          desktop two-column layout. Mobile DOM order is heading → gallery →
          copy → button. On lg the gallery moves to a left column spanning
          both text rows (col-start-1), while the heading and copy sit in the
          right column (col-start-6), heading above copy.
        */}
        <div className="grid items-start gap-x-8 gap-y-6 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-4">
          <h2
            className="text-[clamp(1.6rem,3vw,2.1rem)] leading-[1.1] text-bombovo-dark font-bold lg:col-span-7 lg:col-start-6 lg:row-start-1"
            style={{ fontFamily: SUBHEAD }}
          >
            {heading}
          </h2>

          {/*
            Gallery: four equal squares in a 2x2 grid, top-aligned against the
            text column rather than stretched or centred — the copy runs to
            two paragraphs now, taller than a 2x2 square grid naturally is,
            and forcing the squares to stretch to match would break their
            aspect ratio. A shorter block sitting flush with the top of taller
            copy beside it is an ordinary editorial pattern, not a gap to fix.
          */}
          <div className="lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:row-span-2">
            <div className="grid grid-cols-2 gap-3">
              {(hasPhotos ? gallery.slice(0, 4) : [null, null, null, null]).map((p, i) =>
                p ? (
                  <button
                    key={p.src}
                    type="button"
                    onClick={() => openGallery(i)}
                    aria-label={`Otvoriť galériu — ${p.alt}`}
                    className="group relative block aspect-square overflow-hidden rounded-[10px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bombovo-blue"
                  >
                    <img
                      src={opt(p.src, 640)}
                      alt={p.alt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />
                    {/* Count badge on the last square, so the set reads as a
                        library rather than four loose photos. */}
                    {i === 3 && gallery.length > 4 && (
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#080708]/55 text-center text-[13px] font-bold leading-tight text-white backdrop-blur-[1px]">
                        Zobraziť všetkých
                        <br />
                        {gallery.length} fotiek
                      </span>
                    )}
                  </button>
                ) : (
                  <PhotoSlot key={i} className="aspect-square" />
                ),
              )}
            </div>
          </div>

          {/* Copy + button — after the photos on mobile, below the heading on desktop. */}
          <div className="lg:col-span-7 lg:col-start-6 lg:row-start-2">
            <div className="max-w-[68ch] space-y-3.5">
              {paragraph.split('\n\n').map((para, i) => (
                <p key={i} className="text-[17px] leading-[1.7] text-[#1F2320] md:text-[18px]">
                  {para}
                </p>
              ))}
            </div>

            <Link
              href={cta.href}
              className="mt-6 inline-flex items-center gap-2 rounded-[9px] bg-bombovo-blue px-6 py-3.5 text-[17px] font-bold uppercase tracking-[0.045em] text-white shadow-[0_3px_0_0_#1E49B8,0_10px_22px_-10px_rgba(55,114,255,0.75)] transition-[background-color,box-shadow,transform] duration-150 ease-out hover:bg-[#2F66EE] active:translate-y-[3px] active:shadow-[0_0_0_0_#1E49B8,0_6px_14px_-10px_rgba(55,114,255,0.7)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bombovo-blue"
            >
              {cta.label}
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Hidden instance the thumbnails open; mounted only once photos exist. */}
      {hasPhotos && (
        <LightGallery
          onInit={(detail) => {
            lgRef.current = detail.instance
          }}
          plugins={[lgThumbnail, lgZoom]}
          dynamic
          dynamicEl={galleryDynamicEl}
          speed={500}
          download={false}
          swipeToClose={false}
          closeOnTap={false}
          mobileSettings={{ swipeToClose: false, closeOnTap: false }}
        >
          <span />
        </LightGallery>
      )}
    </section>
  )
}
