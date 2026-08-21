import Link from 'next/link'
import { REBUILT_STREDISKA } from '@/data/rebuiltStrediska'
import DiscountSeal from '@/components/DiscountSeal'

const SUBHEAD = 'var(--font-subhead), "Comic Sans MS", cursive'

/**
 * Overview-grid card, rolled out from the Lomy-only redesign to every
 * rebuilt stredisko now that the design's been reviewed and approved.
 * Replaces the old inline card in SkolyVPrirodClient entirely — there is
 * only one card style now.
 *
 * Every size in this component (photo height, padding, text, the seal, the
 * button) is scaled to ~90% of the values it shipped with, on instruction —
 * the grid should read the way it does at 90% browser zoom, for every
 * visitor, not just ones who zoom out. Scale any future size change here by
 * the same ~0.9 factor rather than reaching for round numbers.
 *
 * Price and discount figures come from that stredisko's own content file in
 * `data/rebuiltStrediska.ts` (the same source its individual page already
 * uses), not the generic Payload `price` string, which is stale/inconsistent
 * for several of these. If a slug has no rebuilt content file yet, the card
 * falls back to the raw Payload price with no strikethrough/badge, rather
 * than crash.
 */
export default function StrediskoCard({
  slug,
  name,
  image,
  fallbackPrice,
  vypredane,
  ariaLabel,
}: {
  slug: string
  name: string
  image: string
  /** Raw Payload `price` string, used only if this slug has no content file. */
  fallbackPrice: string
  vypredane?: boolean
  ariaLabel?: string
}) {
  const content = REBUILT_STREDISKA[slug]
  const { price, discount } = content?.hero ?? {}

  return (
    <div
      className={`group relative overflow-hidden rounded-[25px] bg-white ring-1 ring-black/5 transition-shadow duration-300 ${
        vypredane
          ? 'cursor-default'
          : 'shadow-[0_2px_6px_-2px_rgba(8,7,8,0.10),0_20px_44px_-20px_rgba(55,114,255,0.35)] hover:shadow-[0_4px_10px_-2px_rgba(8,7,8,0.14),0_28px_60px_-18px_rgba(55,114,255,0.45)]'
      }`}
    >
      <div className={vypredane ? 'grayscale opacity-75' : ''}>
        {/* Photo */}
        <div className="relative h-[230px] overflow-hidden">
          <img
            src={image}
            alt={`${name} – rekreačné stredisko pre školy v prírode`}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-black/0" />

          {vypredane ? (
            <div className="absolute left-[11px] top-[11px] rounded-full bg-bombovo-dark px-[14px] py-[7px] shadow-[0_4px_14px_-2px_rgba(8,7,8,0.4)]">
              <span className="text-[11px] font-bold uppercase leading-none tracking-wider text-white">
                Vypredané
              </span>
            </div>
          ) : discount ? (
            <DiscountSeal
              amount={discount.amount}
              deadline={discount.deadline}
              size={83}
              className="pointer-events-none absolute left-[11px] top-[11px] -rotate-[9deg]"
            />
          ) : null}
        </div>

        {/* Content */}
        <div className="p-[22px]">
          <h3
            style={{ fontFamily: SUBHEAD }}
            className="text-[23px] font-bold leading-[1.1] text-bombovo-dark"
          >
            {name}
          </h3>

          {vypredane ? (
            <div className="mt-[18px] flex w-full cursor-not-allowed items-center justify-center rounded-[14px] border-[2.5px] border-gray-300 bg-gray-100 px-[22px] py-[13px] text-[16px] font-bold text-gray-400">
              Vypredané
            </div>
          ) : (
            <>
              <div className="mt-[14px] flex flex-wrap items-baseline gap-x-[9px] gap-y-1">
                {price ? (
                  <>
                    <span className="text-[13px] font-medium text-[#7A807A]">{price.prefix}</span>
                    <span className="text-[29px] font-black leading-none tabular-nums text-[#9AA09A] line-through decoration-2 decoration-[#9AA09A]">
                      {price.amount}
                    </span>
                    <span className="text-[29px] font-black leading-none tabular-nums text-bombovo-dark">
                      {price.discounted}
                    </span>
                    <span className="text-[13px] text-[#9AA09A]">{price.unit}</span>
                  </>
                ) : (
                  <span className="text-[23px] font-black leading-none tabular-nums text-bombovo-dark">
                    {fallbackPrice}
                  </span>
                )}
              </div>

              <Link
                href={`/skoly-v-prirode/${slug}`}
                aria-label={ariaLabel ?? `Škola v prírode na ${name}`}
                className="mt-[25px] block"
              >
                <button className="flex w-full items-center justify-center gap-[7px] rounded-[14px] border-[2.5px] border-bombovo-dark bg-bombovo-yellow px-[22px] py-[13px] text-[16px] font-bold text-bombovo-dark shadow-[3px_3px_0_0_#080708] transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_#080708] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bombovo-blue">
                  Zistiť viac
                  <svg
                    className="h-[14px] w-[14px] transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
