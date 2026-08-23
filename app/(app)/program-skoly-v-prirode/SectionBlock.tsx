'use client'

import type { ProgramSectionCopy } from './content'

/** Next.js image optimizer URL — same mechanism the stredisko pages use. */
const opt = (src: string, w: number) => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=80`

/** Sub-headings across the site are set in this face by explicit instruction. */
const SUBHEAD = 'var(--font-subhead), "Comic Sans MS", cursive'

/**
 * One full program section (materská škola, or 2. stupeň ZŠ), on the same
 * alternating text/photo pattern as VynimocnySection on the stredisko pages
 * — text on one side taking its height from the copy, the photo stretched to
 * match on the other. Adds a takeaways list and closing line, which
 * VynimocnySection doesn't need but this page's copy does.
 */
export default function SectionBlock({
  content,
  background = 'bg-white',
}: {
  content: ProgramSectionCopy
  background?: string
}) {
  const { id, eyebrow, heading, paragraphs, takeawaysHeading, takeaways, closing, photo, photoSide } = content
  const photoFirst = photoSide === 'left'

  return (
    <section id={id} className={`scroll-mt-24 ${background}`}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="grid items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
          <div className={`order-2 lg:col-span-7 ${photoFirst ? 'lg:order-2' : 'lg:order-1'}`}>
            {eyebrow && (
              <span
                className="block font-amatic text-[clamp(1.15rem,2.2vw,1.6rem)] leading-none text-[#3772FF]"
              >
                {eyebrow}
              </span>
            )}
            <h2
              className={`text-[clamp(1.6rem,3vw,2.2rem)] font-bold leading-[1.1] tracking-[-0.03em] text-bombovo-dark ${eyebrow ? 'mt-1.5' : ''}`}
              style={{ fontFamily: SUBHEAD }}
            >
              {heading}
            </h2>

            <div className="mt-4 space-y-3.5">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-[17px] leading-[1.7] text-[#1F2320] md:text-[18px]">
                  {p}
                </p>
              ))}
            </div>

            {takeawaysHeading && takeaways && (
              <>
                <h3
                  className="mt-7 text-[21px] leading-none text-bombovo-red md:text-[24px] font-bold"
                  style={{ fontFamily: SUBHEAD }}
                >
                  {takeawaysHeading}
                </h3>
                <ul className="mt-4 rounded-[10px] bg-bombovo-gray/45 px-4 py-1">
                  {takeaways.map((item, i) => (
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
              </>
            )}

            {closing && (
              <p className="mt-6 text-[17px] font-semibold leading-[1.6] text-bombovo-dark md:text-[18px]">
                {closing}
              </p>
            )}
          </div>

          <figure className={`order-1 lg:col-span-5 ${photoFirst ? 'lg:order-1' : 'lg:order-2'}`}>
            <img
              src={opt(photo.src, 1080)}
              alt={photo.alt}
              loading="lazy"
              decoding="async"
              className="h-full min-h-[320px] w-full rounded-[12px] object-cover shadow-[0_18px_40px_-24px_rgba(8,7,8,0.45)]"
            />
          </figure>
        </div>
      </div>
    </section>
  )
}
