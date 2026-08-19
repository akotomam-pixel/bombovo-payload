'use client'

import { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import type { DoplnkovaSluzba, LomyCena, PriceTag } from '@/data/lomy/types'

/**
 * "Čo je v nej zahrnuté v cene a doplnkové služby".
 *
 * Each block explains what a school actually gets in sentences rather than
 * listing specs, and every price is a bold figure over a smaller unit set at the
 * top right of its card, so the numbers can be compared down the column.
 *
 * The optional services expand one at a time. The collapse reuses the pattern
 * from components/FAQ.tsx — a header button carrying aria-expanded with a
 * chevron that rotates 180° — rather than adding a second interaction style.
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
 * The card's icon. The supplied artwork carries a wide white margin, so the
 * image is drawn larger than its circle and clipped — that trims the padding
 * without editing the files. Falls back to a marked empty slot if a card has no
 * artwork yet.
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

function SluzbaCard({ item }: { item: DoplnkovaSluzba }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="overflow-hidden rounded-[14px] bg-white shadow-[0_1px_2px_rgba(8,7,8,0.04),0_16px_36px_-26px_rgba(8,7,8,0.28)] ring-1 ring-[#DDE0DD]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors duration-200 hover:bg-[#FAFBFA] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-bombovo-blue sm:px-6 sm:py-5"
      >
        {/*
          Shown whether or not the card is open: now that the artwork is real,
          hiding it while collapsed removes the one cue that distinguishes the
          three rows at a glance.
        */}
        <IconSlot src={item.icon} label={item.label} />

        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold leading-snug text-bombovo-dark md:text-[16px]">
            {item.label}
          </span>
        </span>

        <Price price={item.price} />

        <FaChevronDown
          className={`ml-1 shrink-0 text-[14px] text-[#6C726C] transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>

      {open && (
        <div className="border-t border-[#EDEFED] px-5 py-4 sm:px-6 sm:py-5">
          <p className="max-w-[70ch] text-[14px] leading-[1.65] text-[#2B2E2B] md:text-[14.5px]">
            {item.description}
          </p>
          {item.note && (
            <p className="mt-3 inline-flex rounded-[6px] bg-[#EFF1EF] px-3 py-1.5 text-[12.5px] font-medium text-[#4A4F4A]">
              {item.note}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default function CenaSection({ content }: { content: LomyCena }) {
  const { heading, zakladna, animacny, doplnkove, discount } = content

  return (
    <section className="bg-bombovo-gray">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <h2 className="max-w-4xl text-[clamp(1.5rem,3vw,2.15rem)] font-bold leading-[1.12] tracking-[-0.03em] text-bombovo-dark">
          {heading}
        </h2>

        <div className="mt-7 grid gap-5 md:mt-9 lg:grid-cols-2 lg:gap-6">
          {/*
            Základná cena carries the brand dark, so the block describing what a
            school already pays for is the one that holds the eye.
          */}
          <div className="rounded-[14px] bg-bombovo-dark p-6 shadow-[0_18px_40px_-28px_rgba(8,7,8,0.55)] sm:p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-bombovo-yellow">
                <svg viewBox="0 0 24 24" className="h-[22px] w-[22px] text-bombovo-dark" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="m5 12.5 4.6 4.5L19 7.5" />
                </svg>
              </span>
              <h3 className="text-[24px] leading-none text-bombovo-yellow md:text-[27px]" style={{ fontFamily: SUBHEAD }}>
                {zakladna.title}
              </h3>
            </div>

            <p className="mt-4 text-[14px] leading-[1.7] text-[#E6E8E6] md:text-[14.5px]">
              {zakladna.paragraph}
            </p>
          </div>

          {/* Animačný program — an add-on, so it sits on white with its two prices. */}
          <div className="rounded-[14px] bg-white p-6 shadow-[0_1px_2px_rgba(8,7,8,0.04),0_16px_36px_-26px_rgba(8,7,8,0.28)] ring-1 ring-[#DDE0DD] sm:p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-bombovo-blue">
                <svg viewBox="0 0 24 24" className="h-[21px] w-[21px] text-white" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M4 19.5V8.2l4.4-3.4 4.4 3.4v11.3" />
                  <path d="m13.4 12.4 6.6-2.2v6.4l-6.6 2.2" />
                  <circle cx="8.4" cy="12.6" r="1.5" />
                </svg>
              </span>
              <h3 className="text-[24px] leading-none text-bombovo-blue md:text-[27px]" style={{ fontFamily: SUBHEAD }}>
                {animacny.title}
              </h3>
            </div>

            <p className="mt-4 text-[14px] leading-[1.7] text-[#2B2E2B] md:text-[14.5px]">
              {animacny.paragraph}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {animacny.options.map((o) => (
                <div key={o.label} className="rounded-[10px] bg-[#F4F6F4] px-4 py-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[13.5px] font-semibold leading-snug text-bombovo-dark">
                      {o.label}
                    </span>
                    <Price price={o} />
                  </div>
                  {o.note && (
                    <p className="mt-2 text-[11.5px] leading-[1.5] text-[#6C726C]">{o.note}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Optional services */}
        <h3
          className="mt-9 text-[24px] leading-none text-bombovo-dark md:mt-11 md:text-[27px]"
          style={{ fontFamily: SUBHEAD }}
        >
          {doplnkove.title}
        </h3>

        <div className="mt-4 flex flex-col gap-3">
          {doplnkove.items.map((item) => (
            <SluzbaCard key={item.label} item={item} />
          ))}
        </div>

        {/* The discount as figures; the sale star belongs to the hero photo. */}
        <p className="mt-6 flex flex-wrap items-baseline gap-x-2.5 gap-y-1 rounded-[12px] bg-white px-6 py-4 ring-1 ring-[#DDE0DD] sm:px-7">
          <span className="text-[19px] font-bold text-bombovo-red md:text-[21px]">
            {discount.amount}
          </span>
          <span className="text-[14px] font-semibold text-bombovo-dark">{discount.unit}</span>
          <span className="text-[13.5px] text-[#4A4F4A]">{discount.text}</span>
        </p>
      </div>
    </section>
  )
}
