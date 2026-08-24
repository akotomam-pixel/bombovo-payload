'use client'

import type { LomyVynimocny } from '@/data/lomy/types'

/**
 * "V čom je Horský hotel Lomy výnimočný" — the section directly under the hero.
 *
 * A tall photo holds the left side for the section's full height, with the
 * heading, the paragraph and the okolie list stacked beside it on the right.
 */

/** Next.js image optimizer URL — same mechanism the rest of the page uses. */
const opt = (src: string, w: number) => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=80`

/** Sub-headings across the page are set in this face by explicit instruction. */
const SUBHEAD = 'var(--font-subhead), "Comic Sans MS", cursive'

export default function VynimocnySection({ content }: { content: LomyVynimocny }) {
  const { heading, paragraph, okolie, photo } = content

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        {/*
          Text left, photo right. The photo takes its height from the text
          column rather than a fixed ratio — a 9:16 box ran far past where the
          text ended and left a long empty tail. It is still a portrait frame,
          just one that finishes level with the copy beside it.

          Below lg the photo moves above the text (order-first) so the tall
          frame is not squeezed into half a phone screen.
        */}
        <div className="grid items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left column — heading, paragraph, then the okolie list. */}
          <div className="order-1 lg:col-span-7">
            <h2 className="text-[clamp(1.5rem,3vw,2.15rem)] font-bold leading-[1.12] tracking-[-0.03em] text-bombovo-dark">
              {heading}
            </h2>

            <p className="mt-4 text-[17px] leading-[1.7] text-[#1F2320] md:text-[18px]">
              {paragraph}
            </p>

            <h3
              className="mt-8 text-[24px] leading-none text-bombovo-red md:text-[27px] font-bold"
              style={{ fontFamily: SUBHEAD }}
            >
              {okolie.title}
            </h3>

            <ul className="mt-4 rounded-[10px] bg-bombovo-gray/45 px-4 py-1">
              {okolie.items.map((item, i) => (
                <li
                  key={item}
                  className={`flex items-center gap-3 py-3 text-[17px] text-[#1F2320] ${
                    i > 0 ? 'border-t border-[#E6E8E6]' : ''
                  }`}
                >
                  <span aria-hidden className="h-[5px] w-[5px] shrink-0 rounded-full bg-bombovo-yellow" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right column — the photo, cropped to exactly match the text
              column's height. No min-height here: a floor taller than a
              given stredisko's text would pull the grid row up to that
              floor, leaving invisible blank space under the (shorter, real)
              text while the photo — filled edge-to-edge with real pixels —
              visibly ran past where the text ended. */}
          <figure className="order-2 overflow-hidden rounded-[12px] lg:col-span-5">
            {photo.src ? (
              <img
                src={opt(photo.src, 1080)}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                className="h-full min-h-[280px] w-full rounded-[12px] object-cover object-bottom shadow-[0_18px_40px_-24px_rgba(8,7,8,0.45)]"
              />
            ) : (
              /* Marked placeholder — the real portrait shot is being sourced. */
              <div className="flex h-full min-h-[420px] w-full flex-col items-center justify-center gap-2 rounded-[12px] border-2 border-dashed border-[#C9CEC9] bg-[#EFF1EF] px-6 text-center">
                <svg
                  viewBox="0 0 24 24"
                  className="h-9 w-9 text-[#A2A8A2]"
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
                <p className="text-[17px] font-semibold text-[#3A403A]">Miesto pre fotku</p>
                <p className="text-[11.5px] leading-[1.6] text-[#8A908A]">Fotka na výšku</p>
              </div>
            )}
          </figure>
        </div>
      </div>
    </section>
  )
}
