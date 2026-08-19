'use client'

import type { LomyVynimocny } from '@/data/lomy/types'

/**
 * "V čom je Horský hotel Lomy výnimočný" — the section directly under the hero.
 *
 * Written for teachers deciding whether to bring a class here, so the two lists
 * are the point: what is on the site, and what is near it. They are given
 * different weight on purpose. "Výhody lokality" argues the practical case for
 * the venue and gets drawn icons and card rows; "Zaujímavosti v okolí" is a
 * reference list of places and stays a plain, scannable column.
 */

/** Glyphs for the Výhody rows, in the same hand as the hero's fact icons. */
const VYHODY_ICONS: Record<string, JSX.Element> = {
  // Tiered seating around a fire — the amphitheatre, as on the discount seal.
  amfiteater: (
    <>
      <path d="M12 17.4c1.9 0 3.4-.6 3.4-1.4S13.9 14.6 12 14.6s-3.4.6-3.4 1.4 1.5 1.4 3.4 1.4Z" />
      <path d="M5.6 15.4a6.4 6.4 0 0 1 12.8 0" />
      <path d="M2.8 15.4a9.2 9.2 0 0 1 18.4 0" />
      <path d="M12 11.6V6.4M9.9 8.2 12 6.1l2.1 2.1" />
    </>
  ),
  // A pitch with a centre line and circle — the multifunkčné ihrisko.
  ihrisko: (
    <>
      <rect x="2.8" y="5.6" width="18.4" height="12.8" rx="1.8" />
      <path d="M12 5.6v12.8" />
      <circle cx="12" cy="12" r="2.4" />
      <path d="M2.8 9.4h2.6v5.2H2.8M21.2 9.4h-2.6v5.2h2.6" />
    </>
  ),
  // A chalet roof over a main block — the two kinds of accommodation.
  ubytovanie: (
    <>
      <path d="M3.2 19.4V11l5.2-4.2 5.2 4.2v8.4" />
      <path d="M13.6 19.4V13h7.2v6.4" />
      <path d="M6.6 19.4v-3.6h3.6v3.6" />
      <path d="M16.2 16h2.2" />
    </>
  ),
}

export default function VynimocnySection({ content }: { content: LomyVynimocny }) {
  const { heading, paragraph, okolie, vyhody } = content

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
          {/* Výhody — the practical case, so it leads and carries the weight. */}
          <div className="lg:col-span-7">
            <h3 className="font-amatic text-[26px] leading-none text-bombovo-blue md:text-[30px]">
              {vyhody.title}
            </h3>

            <ul className="mt-4 flex flex-col gap-3">
              {vyhody.items.map((item) => (
                <li
                  key={item.text}
                  className="flex items-start gap-3.5 rounded-[10px] bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(8,7,8,0.04),0_10px_24px_-18px_rgba(8,7,8,0.22)] ring-1 ring-[#E6E8E6]"
                >
                  <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-bombovo-dark">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-[18px] w-[18px] text-bombovo-yellow"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      {VYHODY_ICONS[item.icon]}
                    </svg>
                  </span>
                  <span className="text-[14px] font-medium leading-[1.5] text-bombovo-dark md:text-[14.5px]">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Okolie — reference material, deliberately quieter. */}
          <div className="lg:col-span-5">
            <h3 className="font-amatic text-[26px] leading-none text-bombovo-blue md:text-[30px]">
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
