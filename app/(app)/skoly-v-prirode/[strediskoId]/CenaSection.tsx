'use client'

import type { DoplnkovaSluzba, LomyCena, PriceTag } from '@/data/lomy/types'

/**
 * "Čo je v nej zahrnuté v cene a doplnkové služby".
 *
 * Every price is a bold figure over a smaller unit at the top right of its card,
 * so the numbers can be compared down the column. Nothing here collapses: a
 * teacher comparing venues should be able to read the whole cost picture without
 * clicking anything.
 */

/** Sub-headings across the page are set in this face by explicit instruction. */
const SUBHEAD = '"Comic Sans MS", "Comic Sans", cursive'

/** Bold figure over its unit — the price treatment used throughout the section. */
function Price({ price, tone = 'dark' }: { price: PriceTag; tone?: 'dark' | 'light' }) {
  return (
    <span className="shrink-0 text-right">
      <span
        className={`block text-[22px] font-bold leading-none tracking-[-0.02em] tabular-nums md:text-[25px] ${
          tone === 'light' ? 'text-white' : 'text-bombovo-dark'
        }`}
      >
        {price.amount}
      </span>
      <span
        className={`mt-1 block whitespace-nowrap text-[11.5px] font-medium ${
          tone === 'light' ? 'text-[#E6E8E6]/70' : 'text-[#6C726C]'
        }`}
      >
        {price.unit}
      </span>
    </span>
  )
}

/**
 * The card's icon. Supplied artwork carries a wide white margin, so the image is
 * drawn larger than its circle and clipped, which trims that padding without
 * editing the files. Renders a marked empty slot while artwork is outstanding.
 */
function IconSlot({ src, label }: { src?: string; label: string }) {
  if (!src) {
    return (
      <span
        aria-hidden
        title="Miesto pre ikonu"
        className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full border border-dashed border-[#C9CEC9] bg-[#EFF1EF]"
      />
    )
  }
  return (
    <span className="flex h-[46px] w-[46px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#EFF1EF]">
      <img src={src} alt="" aria-hidden className="h-[70px] w-[70px] max-w-none object-contain" />
      <span className="sr-only">{label}</span>
    </span>
  )
}

/** Yellow tick used by the animačný program list. */
function Tick() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="mt-[3px] h-[15px] w-[15px] shrink-0 text-bombovo-yellow"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m5 12.5 4.6 4.5L19 7.5" />
    </svg>
  )
}

/** One optional service. Always open — nothing here is hidden behind a click. */
function SluzbaCard({ item }: { item: DoplnkovaSluzba }) {
  return (
    <div className="rounded-[14px] bg-white p-5 shadow-[0_1px_2px_rgba(8,7,8,0.04),0_16px_36px_-26px_rgba(8,7,8,0.28)] ring-1 ring-[#DDE0DD] sm:p-6">
      <div className="flex items-start gap-4">
        <IconSlot src={item.icon} label={item.label} />

        <span className="min-w-0 flex-1 pt-1 text-[15px] font-semibold leading-snug text-bombovo-dark md:text-[16px]">
          {item.label}
        </span>

        <Price price={item.price} />
      </div>

      <p className="mt-3.5 max-w-[74ch] text-[14px] leading-[1.65] text-[#2B2E2B] md:text-[14.5px]">
        {item.description}
      </p>

      {item.note && (
        <p className="mt-3 inline-flex rounded-[6px] bg-[#EFF1EF] px-3 py-1.5 text-[12.5px] font-medium text-[#4A4F4A]">
          {item.note}
        </p>
      )}
    </div>
  )
}

export default function CenaSection({ content }: { content: LomyCena }) {
  const { heading, zakladna, animacny, doplnkove } = content

  return (
    <section className="bg-bombovo-gray">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <h2 className="max-w-4xl text-[clamp(1.5rem,3vw,2.15rem)] font-bold leading-[1.12] tracking-[-0.03em] text-bombovo-dark">
          {heading}
        </h2>

        <div className="mt-7 grid gap-5 md:mt-9 lg:grid-cols-2 lg:gap-6">
          {/*
            A light card, like the one beside it and like the way this kind of
            "what's included" block is conventionally handled. The dark version
            fought the section: it was the heaviest thing on a grey ground and
            pulled attention away from the prices, which are the actual decision.
            It carries a green tick per line — the one place a colour outside the
            palette earns its keep, because "included" is what a tick means, and
            a "+0 €" tag stating what each line costs.
          */}
          <div className="rounded-[14px] bg-white p-6 shadow-[0_1px_2px_rgba(8,7,8,0.04),0_16px_36px_-26px_rgba(8,7,8,0.28)] ring-1 ring-[#DDE0DD] sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <IconSlot src={zakladna.icon} label={zakladna.title} />
                <h3
                  className="text-[24px] leading-none text-[#2A7038] md:text-[27px]"
                  style={{ fontFamily: SUBHEAD }}
                >
                  {zakladna.title}
                </h3>
              </div>
              {/*
                Set exactly like the +55 € opposite — same figure-over-unit
                shape — so the two cards read as one comparison and the zero is
                unmistakably a price.
              */}
              <span className="shrink-0 text-right">
                <span className="block text-[22px] font-bold leading-none tracking-[-0.02em] text-[#2A7038] tabular-nums md:text-[25px]">
                  +0 €
                </span>
                <span className="mt-1 block whitespace-nowrap text-[11.5px] font-medium text-[#6C726C]">
                  / dieťa
                </span>
              </span>
            </div>

            <p className="mt-4 text-[14px] leading-[1.7] text-[#2B2E2B] md:text-[14.5px]">
              {zakladna.intro}
            </p>

            <ol className="mt-4 flex flex-col gap-2.5">
              {zakladna.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <svg
                    viewBox="0 0 24 24"
                    className="mt-[3px] h-[15px] w-[15px] shrink-0 text-[#2F7D42]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="m5 12.5 4.6 4.5L19 7.5" />
                  </svg>
                  <span className="text-[13.5px] leading-[1.55] text-[#2B2E2B] md:text-[14px]">
                    {item}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Animačný program — an add-on, so it sits on white with its price inline. */}
          <div className="rounded-[14px] bg-white p-6 shadow-[0_1px_2px_rgba(8,7,8,0.04),0_16px_36px_-26px_rgba(8,7,8,0.28)] ring-1 ring-[#DDE0DD] sm:p-7">
            {/* Heading and price share one row. */}
            <div className="flex items-start justify-between gap-4">
              <h3
                className="text-[24px] leading-none text-bombovo-blue md:text-[27px]"
                style={{ fontFamily: SUBHEAD }}
              >
                {animacny.title}
              </h3>
              <Price price={animacny.price} />
            </div>

            <p className="mt-4 text-[14px] leading-[1.7] text-[#2B2E2B] md:text-[14.5px]">
              {animacny.paragraph}
            </p>

            <ul className="mt-4 flex flex-col gap-2.5">
              {animacny.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Tick />
                  <span className="text-[13.5px] leading-[1.55] text-[#2B2E2B] md:text-[14px]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Optional services — all open. */}
        <h3
          className="mt-9 text-[24px] leading-none text-bombovo-dark md:mt-11 md:text-[27px]"
          style={{ fontFamily: SUBHEAD }}
        >
          {doplnkove.title}
        </h3>

        <div className="mt-4 flex flex-col gap-4">
          {doplnkove.items.map((item) => (
            <SluzbaCard key={item.label} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
