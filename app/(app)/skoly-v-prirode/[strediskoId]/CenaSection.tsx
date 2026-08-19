'use client'

import { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import type { LomyCena } from '@/data/lomy/types'

/**
 * "Cena a čo je v nej zahrnuté".
 *
 * Teachers read this to find out exactly what the price covers and what costs
 * extra, so the two blocks that define the price stay open and the optional
 * extras collapse. Prices sit in their own column against the item they belong
 * to, so the figures line up and can be scanned without reading the prose.
 *
 * The collapse reuses the pattern from components/FAQ.tsx — a header button
 * carrying aria-expanded with a chevron that rotates 180° — rather than
 * introducing a second interaction style to the site.
 */
export default function CenaSection({ content }: { content: LomyCena }) {
  const { heading, blocks, doplnkove, discount } = content
  const [open, setOpen] = useState(false)

  return (
    <section className="bg-bombovo-gray">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <h2 className="text-[clamp(1.5rem,3vw,2.15rem)] font-bold leading-[1.12] tracking-[-0.03em] text-bombovo-dark">
          {heading}
        </h2>

        {/* The two blocks that make up the price. */}
        <div className="mt-7 grid gap-5 md:mt-9 md:grid-cols-2 md:gap-6">
          {blocks.map((block) => (
            <div
              key={block.title}
              className="rounded-[12px] bg-white p-6 shadow-[0_1px_2px_rgba(8,7,8,0.04),0_16px_36px_-26px_rgba(8,7,8,0.28)] ring-1 ring-[#DDE0DD] sm:p-7"
            >
              <h3 className="font-amatic text-[26px] leading-none text-bombovo-blue md:text-[30px]">
                {block.title}
              </h3>

              <ul className="mt-4">
                {block.items.map((item, i) => (
                  <li
                    key={item}
                    className={`flex items-start gap-3 py-2.5 text-[14px] leading-[1.55] text-[#2B2E2B] md:text-[14.5px] ${
                      i > 0 ? 'border-t border-[#EDEFED]' : ''
                    }`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="mt-[3px] h-[15px] w-[15px] shrink-0 text-bombovo-blue"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="m5 12.5 4.6 4.5L19 7.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Optional extras — collapsed, since none of it is part of the price. */}
        <div className="mt-5 overflow-hidden rounded-[12px] bg-white shadow-[0_1px_2px_rgba(8,7,8,0.04),0_16px_36px_-26px_rgba(8,7,8,0.28)] ring-1 ring-[#DDE0DD] md:mt-6">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-200 hover:bg-[#FAFBFA] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-bombovo-blue sm:px-7"
          >
            <span className="font-amatic text-[26px] leading-none text-bombovo-blue md:text-[30px]">
              {doplnkove.title}
            </span>
            <span className="flex items-center gap-3">
              <span className="hidden text-[12.5px] font-medium text-[#6C726C] sm:inline">
                {open ? 'Skryť' : `Zobraziť (${doplnkove.items.length})`}
              </span>
              <FaChevronDown
                className={`shrink-0 text-[15px] text-bombovo-dark transition-transform duration-200 ${
                  open ? 'rotate-180' : ''
                }`}
                aria-hidden
              />
            </span>
          </button>

          {open && (
            <ul className="border-t border-[#EDEFED] px-6 pb-5 sm:px-7">
              {doplnkove.items.map((item, i) => (
                <li
                  key={item.label}
                  className={`py-3.5 ${i > 0 ? 'border-t border-[#EDEFED]' : ''}`}
                >
                  <div className="flex items-baseline justify-between gap-5">
                    <span className="text-[14px] font-medium text-[#2B2E2B] md:text-[14.5px]">
                      {item.label}
                    </span>
                    <span className="shrink-0 whitespace-nowrap text-[14px] font-bold text-bombovo-dark tabular-nums md:text-[14.5px]">
                      {item.price}
                    </span>
                  </div>
                  {item.note && (
                    <p className="mt-1.5 max-w-[62ch] text-[12.5px] leading-[1.55] text-[#6C726C]">
                      {item.note}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/*
          The discount as plain figures. The sale star belongs to the hero photo
          and is deliberately not repeated here.
        */}
        <p className="mt-5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1 rounded-[12px] bg-bombovo-dark px-6 py-4 md:mt-6 sm:px-7">
          <span className="text-[19px] font-bold text-bombovo-red md:text-[21px]">
            {discount.amount}
          </span>
          <span className="text-[14px] font-semibold text-white">{discount.unit}</span>
          <span className="text-[13.5px] text-[#E6E8E6]/75">{discount.text}</span>
        </p>
      </div>
    </section>
  )
}
