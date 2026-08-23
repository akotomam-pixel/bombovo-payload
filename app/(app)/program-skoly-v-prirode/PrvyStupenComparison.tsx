'use client'

import type { ComparisonCard } from './content'

/** Sub-headings across the site are set in this face by explicit instruction. */
const SUBHEAD = 'var(--font-subhead), "Comic Sans MS", cursive'

/**
 * The two 1. stupeň programs side by side, on the same comparison-card
 * pattern CenaSection uses for "V základnej cene" / "Animačný program"
 * (icon + heading + paragraph + tick list, one light card each). No price
 * row: checked the codebase for a real price difference between Tajomstvá
 * denníka and Letom svetom and found none — both fall under the same
 * animačný program pricing every stredisko already shows — so forcing a
 * price line in here would either repeat that figure pointlessly or invent
 * one that doesn't exist. Icon replaces CenaSection's uploaded-artwork icon
 * slot with a small hand-drawn glyph, matching FactIcon's drawn-not-sourced
 * treatment on the stredisko hero, since no uploaded icon exists for either
 * program yet.
 */

function DiaryIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5.5 4.5h11a1.5 1.5 0 0 1 1.5 1.5v13.5H7a1.5 1.5 0 0 1-1.5-1.5V4.5Z" />
      <path d="M5.5 4.5H5a1.5 1.5 0 0 0-1.5 1.5v12A1.5 1.5 0 0 0 5 19.5h.5" />
      <path d="M9 9h6M9 12.5h6M9 16h3.5" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="8" />
      <path d="M4 12h16M12 4c2.4 2.3 3.6 5 3.6 8s-1.2 5.7-3.6 8c-2.4-2.3-3.6-5-3.6-8s1.2-5.7 3.6-8Z" />
    </svg>
  )
}

const ICONS = { diary: DiaryIcon, globe: GlobeIcon }

function Tick() {
  return (
    <svg viewBox="0 0 24 24" className="mt-[3px] h-[15px] w-[15px] shrink-0 text-bombovo-yellow" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 12.5 4.6 4.5L19 7.5" />
    </svg>
  )
}

function Card({ content, accent }: { content: ComparisonCard; accent: string }) {
  const Icon = ICONS[content.icon]
  return (
    <div className="rounded-[14px] bg-white p-6 shadow-[0_1px_2px_rgba(8,7,8,0.04),0_16px_36px_-26px_rgba(8,7,8,0.28)] ring-1 ring-[#DDE0DD] sm:p-7">
      <div className="flex items-center gap-3">
        <span
          className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-[#EFF1EF]"
          style={{ color: accent }}
        >
          <Icon />
        </span>
        <div>
          <h3 className="text-[22px] leading-none font-bold md:text-[25px]" style={{ fontFamily: SUBHEAD, color: accent }}>
            {content.title}
          </h3>
          <p className="mt-1 text-[13px] font-semibold uppercase tracking-[0.06em] text-[#8A908A]">
            {content.subtitle}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {content.paragraphs.map((p, i) => (
          <p key={i} className="text-[16px] leading-[1.65] text-[#1F2320] md:text-[16.5px]">
            {p}
          </p>
        ))}
      </div>

      <p className="mt-5 text-[13px] font-bold uppercase tracking-[0.06em] text-[#8A908A]">
        {content.takeawaysHeading}
      </p>
      <ul className="mt-2.5 flex flex-col gap-2.5">
        {content.takeaways.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <Tick />
            <span className="text-[16px] leading-[1.6] text-[#1F2320] md:text-[16.5px]">{item}</span>
          </li>
        ))}
      </ul>

      <p className="mt-5 text-[15.5px] font-semibold leading-[1.6] text-bombovo-dark">{content.closing}</p>
    </div>
  )
}

export default function PrvyStupenComparison({
  denník,
  letomSvetom,
}: {
  denník: ComparisonCard
  letomSvetom: ComparisonCard
}) {
  return (
    <div className="mt-8 grid gap-5 md:mt-10 lg:grid-cols-2 lg:gap-6">
      <Card content={denník} accent="#DF2935" />
      <Card content={letomSvetom} accent="#3772FF" />
    </div>
  )
}
