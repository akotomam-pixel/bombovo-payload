'use client'

import Link from 'next/link'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WaveDivider from '@/components/WaveDivider'
import StickySubNav from './StickySubNav'
import SectionBlock from './SectionBlock'
import PrvyStupenComparison from './PrvyStupenComparison'
import {
  hero,
  pickerCards,
  materskaSection,
  prvyStupenIntro,
  denníkCard,
  letomSvetomCard,
  druhyStupenSection,
  closingCta,
  type PickerCard,
} from './content'

/** Sub-headings across the site are set in this face by explicit instruction. */
const SUBHEAD = 'var(--font-subhead), "Comic Sans MS", cursive'

/**
 * Stamp badge for the picker's "Najviac vybraný program" card, drawn with the
 * same scalloped wavy-rim geometry as DiscountSeal (components/DiscountSeal.tsx)
 * so the two share a visual language, but built locally rather than reusing
 * that component directly — DiscountSeal's two-line "amount / deadline" layout
 * is tuned for a short price figure, not a three-word phrase, and it's used
 * live on production pricing seals elsewhere, so it's safer not to touch it
 * for a one-off badge with different content.
 */
const STAMP_PATH = (() => {
  const cx = 50
  const cy = 50
  const baseR = 42
  const amplitude = 3.4
  const waves = 14
  const points = 160
  let d = ''
  for (let i = 0; i <= points; i++) {
    const t = (i / points) * Math.PI * 2
    const r = baseR + amplitude * Math.sin(waves * t)
    const x = cx + r * Math.cos(t)
    const y = cy + r * Math.sin(t)
    d += i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : ` L ${x.toFixed(2)} ${y.toFixed(2)}`
  }
  return `${d} Z`
})()

function StampBadge() {
  return (
    <svg
      viewBox="0 0 100 100"
      width={72}
      height={72}
      role="img"
      aria-label="Najviac vybraný program"
      className="pointer-events-none absolute -right-3 -top-3 -rotate-[9deg]"
      style={{ filter: 'drop-shadow(0 8px 20px rgba(223,41,53,0.34))' }}
    >
      <path d={STAMP_PATH} fill="#DF2935" />
      <text x="50" y="41" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontWeight="700">
        NAJVIAC
      </text>
      <text x="50" y="53" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontWeight="700">
        VYBRANÝ
      </text>
      <text x="50" y="65" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontWeight="700">
        PROGRAM
      </text>
    </svg>
  )
}

function PickerCardEl({ card }: { card: PickerCard }) {
  return (
    <a
      href={`#${card.id}`}
      className="group relative flex flex-col overflow-hidden rounded-[24px] bg-white p-6 ring-1 ring-black/5 shadow-[0_2px_6px_-2px_rgba(8,7,8,0.10),0_20px_44px_-20px_rgba(55,114,255,0.35)] transition-shadow duration-300 hover:shadow-[0_4px_10px_-2px_rgba(8,7,8,0.14),0_28px_60px_-18px_rgba(55,114,255,0.45)]"
    >
      {card.badge && <StampBadge />}

      <h3 className="text-[24px] font-bold leading-[1.1] text-bombovo-dark" style={{ fontFamily: SUBHEAD }}>
        {card.label}
      </h3>

      <span className="mt-3 inline-flex w-fit items-center gap-2 rounded-[8px] border border-[#E6E8E6] bg-bombovo-gray/40 px-3 py-2">
        <span aria-hidden className="text-[17px] leading-none">
          {card.icon}
        </span>
        <span className="text-[15px] font-medium text-[#1F2320]">{card.ageRange}</span>
      </span>

      <p className="mt-4 flex-1 text-[16px] leading-[1.6] text-[#1F2320]">{card.teaser}</p>

      <span className="mt-5 inline-flex items-center gap-2 text-[15px] font-bold text-bombovo-blue">
        Prejsť na program
        <svg
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </a>
  )
}

export default function ProgramSkolyVPrirodePage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="bg-bombovo-gray">
        <TopBar />
      </div>
      <Header />

      <StickySubNav items={pickerCards.map((c) => ({ id: c.id, label: c.label }))} />

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <div className="bg-bombovo-gray">
        <section className="pt-9 pb-12 md:pt-14 md:pb-16">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h1
              className="text-[clamp(2rem,5vw,3.2rem)] font-bold leading-[1.05] tracking-[-0.03em] text-bombovo-dark"
              style={{ fontFamily: SUBHEAD }}
            >
              {hero.headline}
            </h1>
            <div className="mx-auto mt-6 max-w-[68ch] space-y-4 text-left">
              {hero.paragraphs.map((p, i) => (
                <p key={i} className="text-[17px] leading-[1.7] text-[#1F2320] md:text-[18px]">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PICKER ───────────────────────────────────────────────────── */}
        <section className="pb-14 md:pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {pickerCards.map((card) => (
                <PickerCardEl key={card.id} card={card} />
              ))}
            </div>
          </div>
        </section>

        <WaveDivider color="blue" variant={1} />
      </div>

      {/* ─── SECTION 1: MATERSKÁ ŠKOLA ────────────────────────────────────── */}
      <SectionBlock content={materskaSection} />
      <WaveDivider color="yellow" variant={2} />

      {/* ─── SECTION 2: 1. STUPEŇ ZŠ ──────────────────────────────────────── */}
      <div className="bg-bombovo-gray">
        <SectionBlock content={prvyStupenIntro} background="bg-bombovo-gray" />
        <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 md:pb-16 lg:px-8">
          <PrvyStupenComparison denník={denníkCard} letomSvetom={letomSvetomCard} />
        </div>
      </div>
      <WaveDivider color="red" variant={3} />

      {/* ─── SECTION 3: 2. STUPEŇ ZŠ ──────────────────────────────────────── */}
      <SectionBlock content={druhyStupenSection} />
      <WaveDivider color="blue" variant={2} />

      {/* ─── CLOSING CTA ──────────────────────────────────────────────────── */}
      <section className="bg-bombovo-dark">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8 md:py-20">
          <p className="text-[19px] leading-[1.65] text-white md:text-[21px]">{closingCta.text}</p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href={closingCta.primary.href}
              className="inline-flex w-full items-center justify-center rounded-[9px] bg-[#DF2935] px-7 py-3.5 text-center text-[17px] font-bold leading-tight tracking-[0.045em] text-white shadow-[0_3px_0_0_#A81B24,0_10px_22px_-10px_rgba(223,41,53,0.7)] transition-[background-color,box-shadow,transform] duration-150 ease-out hover:bg-[#CC2430] active:translate-y-[3px] active:shadow-[0_0_0_0_#A81B24,0_6px_14px_-10px_rgba(223,41,53,0.65)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3772FF] sm:w-auto"
            >
              {closingCta.primary.label}
            </Link>
            <Link
              href={closingCta.secondary.href}
              className="inline-flex w-full items-center justify-center rounded-[9px] border border-bombovo-dark bg-bombovo-yellow px-7 py-3.5 text-center text-[17px] font-bold leading-tight tracking-[0.045em] text-bombovo-dark transition-colors duration-150 ease-out hover:bg-[#F5BD1F] active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3772FF] sm:w-auto"
            >
              {closingCta.secondary.label}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
