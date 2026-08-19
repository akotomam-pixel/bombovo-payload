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
const SUBHEAD = '"Comic Sans MS", "Comic Sans", cursive'

export default function VynimocnySection({ content }: { content: LomyVynimocny }) {
  const { heading, paragraph, okolie, photo } = content

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        {/*
          Two columns across the whole section: the photo holds the left side
          top to bottom, everything written stacks on the right. Below lg the
          photo leads and the text follows — a 9:16 frame beside a narrow
          column would leave both too cramped to read.
        */}
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <figure className="lg:col-span-5">
            {photo.src ? (
              <img
                src={opt(photo.src, 900)}
                alt={photo.alt}
                className="h-full w-full rounded-[12px] object-cover shadow-[0_18px_40px_-24px_rgba(8,7,8,0.45)]"
                style={{ aspectRatio: '9 / 16' }}
              />
            ) : (
              /* Marked placeholder — the real portrait shot is being sourced. */
              <div
                className="mx-auto flex w-full max-w-[340px] flex-col items-center justify-center gap-2 rounded-[12px] border-2 border-dashed border-[#C9CEC9] bg-[#EFF1EF] px-6 text-center lg:h-full lg:max-w-none"
                style={{ aspectRatio: '9 / 16' }}
              >
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
                <p className="text-[13px] font-semibold text-[#6C726C]">Miesto pre fotku</p>
                <p className="text-[11.5px] leading-[1.45] text-[#8A908A]">Formát 9:16 (na výšku)</p>
              </div>
            )}
          </figure>

          {/* Right column — heading, paragraph, then the okolie list. */}
          <div className="lg:col-span-7">
            <h2 className="text-[clamp(1.5rem,3vw,2.15rem)] font-bold leading-[1.12] tracking-[-0.03em] text-bombovo-dark">
              {heading}
            </h2>

            <p className="mt-4 text-[15px] leading-[1.7] text-[#3E443E] md:text-[15.5px]">
              {paragraph}
            </p>

            <h3
              className="mt-8 text-[24px] leading-none text-bombovo-red md:text-[27px]"
              style={{ fontFamily: SUBHEAD }}
            >
              {okolie.title}
            </h3>

            <ul className="mt-4 rounded-[10px] bg-bombovo-gray/45 px-4 py-1">
              {okolie.items.map((item, i) => (
                <li
                  key={item}
                  className={`flex items-center gap-3 py-3 text-[14px] text-[#3E443E] ${
                    i > 0 ? 'border-t border-[#E6E8E6]' : ''
                  }`}
                >
                  <span aria-hidden className="h-[5px] w-[5px] shrink-0 rounded-full bg-bombovo-yellow" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
