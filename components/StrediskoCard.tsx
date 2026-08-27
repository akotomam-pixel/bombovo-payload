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
 * Sizes here are the card's real, unscaled design. The "read like 90%
 * browser zoom" request is handled by wrapping the grid in
 * SkolyVPrirodClient with a real CSS `zoom`, not by hand-tuning sizes in
 * here — a manual ~10% trim of padding/text left card *width* untouched
 * (that comes from the grid track, not from anything in this file), so it
 * barely read as smaller. `zoom` scales the whole rendered card, width
 * included, exactly like the browser's own zoom does.
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
  const { price, discount, facts, rating } = content?.hero ?? {}
  const kapacita = facts?.find((f) => f.label === 'Kapacita')?.value

  return (
    <div
      className={`group relative overflow-hidden rounded-[28px] bg-white ring-1 ring-black/5 transition-shadow duration-300 ${
        vypredane
          ? 'cursor-default'
          : 'shadow-[0_2px_6px_-2px_rgba(8,7,8,0.10),0_20px_44px_-20px_rgba(55,114,255,0.35)] hover:shadow-[0_4px_10px_-2px_rgba(8,7,8,0.14),0_28px_60px_-18px_rgba(55,114,255,0.45)]'
      }`}
    >
      <div className={vypredane ? 'grayscale opacity-75' : ''}>
        {/* Photo */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={image}
            alt={`${name} – rekreačné stredisko pre školy v prírode`}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-black/0" />

          {vypredane ? (
            <div className="absolute left-3 top-3 rounded-full bg-bombovo-dark px-4 py-2 shadow-[0_4px_14px_-2px_rgba(8,7,8,0.4)]">
              <span className="text-[12px] font-bold uppercase leading-none tracking-wider text-white">
                Vypredané
              </span>
            </div>
          ) : discount ? (
            <DiscountSeal
              amount={discount.amount}
              deadline={discount.deadline}
              size={92}
              className="pointer-events-none absolute left-3 top-3 -rotate-[9deg]"
            />
          ) : null}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <h3
              style={{ fontFamily: SUBHEAD }}
              className="text-[26px] font-bold leading-[1.1] text-bombovo-dark"
            >
              {name}
            </h3>

            {/* Kapacita/Hodnotenie — known before clicking through, so a
                visitor can compare venues right from the listing grid.
                Hidden per line when a stredisko has no content file yet
                (falls outside REBUILT_STREDISKA) or is missing that fact. */}
            {(kapacita || rating?.value) && (
              <div className="shrink-0 pt-1 text-right">
                {kapacita && (
                  <p className="whitespace-nowrap text-[13px] font-semibold text-[#6B716B]">
                    Kapacita: <span className="text-bombovo-dark">{kapacita}</span>
                  </p>
                )}
                {rating?.value && (
                  <p className="whitespace-nowrap text-[13px] font-semibold text-[#6B716B]">
                    Hodnotenie:{' '}
                    <span className="text-bombovo-dark">
                      {rating.value} <span aria-hidden className="text-bombovo-yellow">★</span>
                    </span>
                  </p>
                )}
              </div>
            )}
          </div>

          {vypredane ? (
            <div className="mt-5 flex w-full cursor-not-allowed items-center justify-center rounded-2xl border-[3px] border-gray-300 bg-gray-100 px-6 py-3.5 text-lg font-bold text-gray-400">
              Vypredané
            </div>
          ) : (
            <>
              <div className="mt-4 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                {price ? (
                  <>
                    <span className="text-sm font-medium text-[#7A807A]">{price.prefix}</span>
                    <span className="text-[32px] font-black leading-none tabular-nums text-[#9AA09A] line-through decoration-2 decoration-[#9AA09A]">
                      {price.amount}
                    </span>
                    <span className="text-[32px] font-black leading-none tabular-nums text-bombovo-dark">
                      {price.discounted}
                    </span>
                    <span className="text-sm text-[#9AA09A]">{price.unit}</span>
                  </>
                ) : (
                  <span className="text-[26px] font-black leading-none tabular-nums text-bombovo-dark">
                    {fallbackPrice}
                  </span>
                )}
              </div>

              <Link
                href={`/skoly-v-prirode/${slug}`}
                aria-label={ariaLabel ?? `Škola v prírode na ${name}`}
                className="mt-7 block"
              >
                <button className="flex w-full items-center justify-center gap-2 rounded-2xl border-[3px] border-bombovo-dark bg-bombovo-yellow px-6 py-3.5 text-lg font-bold text-bombovo-dark shadow-[3px_3px_0_0_#080708] transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_#080708] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bombovo-blue">
                  Zistiť viac
                  <svg
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
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
