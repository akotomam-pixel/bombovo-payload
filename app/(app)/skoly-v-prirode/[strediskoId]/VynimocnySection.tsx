'use client'

import type { LomyVynimocny } from '@/data/lomy/types'

/**
 * "V čom je Horský hotel Lomy výnimočný" — the section directly under the hero.
 *
 * The paragraph makes the case in prose; the photo of the areál shows it, which
 * is why the card list that used to restate those points in words is gone.
 * "Zaujímavosti v okolí" stays beside it as a quiet reference column.
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
        <h2 className="max-w-3xl text-[clamp(1.5rem,3vw,2.15rem)] font-bold leading-[1.12] tracking-[-0.03em] text-bombovo-dark">
          {heading}
        </h2>

        <p className="mt-4 max-w-3xl text-[15px] leading-[1.7] text-[#3E443E] md:text-[15.5px]">
          {paragraph}
        </p>

        <div className="mt-9 grid gap-6 lg:mt-11 lg:grid-cols-12 lg:gap-8">
          {/*
            The photo of the areál, in place of the Výhody cards that used to
            sit here. Everything they claimed — the amphitheatre, the buildings,
            the chalets — is visible in this frame, so the picture makes the case
            the cards were making in words, and the paragraph above already says
            it in prose.
          */}
          <figure className="lg:col-span-7">
            <img
              src={opt(photo.src, 1200)}
              alt={photo.alt}
              className="w-full rounded-[12px] object-cover shadow-[0_18px_40px_-24px_rgba(8,7,8,0.45)]"
              style={{ aspectRatio: '3 / 2' }}
            />
          </figure>

          {/* Okolie — reference material, deliberately quieter. */}
          <div className="lg:col-span-5">
            <h3 className="text-[24px] leading-none text-bombovo-red md:text-[27px]" style={{ fontFamily: SUBHEAD }}>
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
