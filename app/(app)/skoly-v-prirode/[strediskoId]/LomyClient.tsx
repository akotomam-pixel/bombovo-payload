'use client'

import { useMemo, useRef, useState } from 'react'
import LightGallery from 'lightgallery/react'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgZoom from 'lightgallery/plugins/zoom'
import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-zoom.css'
import 'lightgallery/css/lg-thumbnail.css'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { LomyContent } from '@/data/lomy/types'

/** Next.js image optimizer URL — same mechanism the original detail page uses. */
const opt = (src: string, w: number) => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=80`

/**
 * A consistent wave edge, generated rather than hand-plotted.
 *
 * Every crest is the same height and every wavelength the same width, joined by
 * smooth cubic curves whose control points sit at quarter-wavelengths — so the
 * curve leaves each peak and arrives at the next with matching tangents and the
 * seam never kinks. Earlier hand-written paths used arbitrary points and read as
 * a torn edge; this cannot, because the geometry is periodic by construction.
 */
const WAVE_PATH = (() => {
  const width = 400
  const halfWaves = 10 // 5 full waves across the card
  const amplitude = 4.5
  const mid = 9
  const half = width / halfWaves

  // Each half-wave is one cubic from crest to trough (or back). Placing both
  // control points at the horizontal midpoint of the segment — one level with
  // the start, one level with the end — makes the tangent flat at every turning
  // point, so consecutive segments meet smoothly.
  let d = `M0 ${mid - amplitude}`
  for (let i = 0; i < halfWaves; i++) {
    const from = i % 2 === 0 ? mid - amplitude : mid + amplitude
    const to = i % 2 === 0 ? mid + amplitude : mid - amplitude
    const x0 = half * i
    const x1 = half * (i + 1)
    const cx = x0 + half / 2
    d += ` C ${cx} ${from}, ${cx} ${to}, ${x1} ${to}`
  }
  return `${d} L ${width} 18 L 0 18 Z`
})()

/**
 * Discount badge, drawn as the venue's amphitheatre seen from above.
 *
 * The areál's defining structure is a ring of timber benches stepping down to a
 * stone fire pit (see `/images/Skoly v Prirode/lomy.png`), so the badge is built
 * from concentric arcs around a centre rather than the clip-art starburst it
 * replaces. The rings are broken by small gaps the way the real seating is
 * broken by its access steps, which keeps it reading as drawn rather than
 * generated.
 */
function DiscountSeal({
  amount,
  deadline,
  size,
  className = '',
}: {
  amount: string
  deadline: string
  size: number
  className?: string
}) {
  // Tiered seating: outer rings are the benches, each notched by a stepped aisle.
  const tiers = [
    { r: 47, gap: 7, rot: -14 },
    { r: 42, gap: 9, rot: 24 },
    { r: 37, gap: 8, rot: -62 },
  ]

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label={`Zľava ${amount}, ${deadline}`}
      className={className}
      style={{ fontFamily: 'inherit', filter: 'drop-shadow(0 8px 20px rgba(223,41,53,0.34))' }}
    >
      {/* Fire-pit centre — the solid ground the figure sits on. */}
      <circle cx="50" cy="50" r="33" fill="#DF2935" />

      {/* Bench tiers, each an arc left open at its aisle. */}
      {tiers.map((t) => {
        const circumference = 2 * Math.PI * t.r
        return (
          <circle
            key={t.r}
            cx="50"
            cy="50"
            r={t.r}
            fill="none"
            stroke="#DF2935"
            strokeWidth="3.1"
            strokeLinecap="round"
            strokeDasharray={`${circumference - t.gap} ${t.gap}`}
            transform={`rotate(${t.rot} 50 50)`}
            opacity={0.92}
          />
        )
      })}

      <text x="50" y="48" textAnchor="middle" fill="#FFFFFF" fontSize="20" fontWeight="700" letterSpacing="-1">
        {amount}
      </text>
      {/* Hairline rule under the figure, echoing the tier lines. */}
      <line x1="37" y1="54.5" x2="63" y2="54.5" stroke="#FFFFFF" strokeWidth="0.9" opacity="0.45" />
      <text x="50" y="65" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="600" opacity="0.92">
        {deadline}
      </text>
    </svg>
  )
}

/**
 * Icons for the info-box rows, drawn to this venue rather than pulled from a set.
 *
 * Each is built from the same vocabulary as the photo: the ridgeline behind the
 * hotel, the A-frame chalet roofs, the season the place is open. Consistent
 * 24-unit box, 1.7 stroke, round caps — so they read as one hand.
 */
const FACT_ICONS: Record<string, JSX.Element> = {
  // Map pin — a place on a map, distinct in silhouette from the other two.
  Lokalita: (
    <>
      <path d="M12 21c4.2-4.6 6.3-7.9 6.3-10.6a6.3 6.3 0 1 0-12.6 0C5.7 13.1 7.8 16.4 12 21Z" />
      <circle cx="12" cy="10.2" r="2.3" />
    </>
  ),
  // A bed, seen from the side — beds are literally what capacity counts here.
  Kapacita: (
    <>
      <path d="M3 18.5v-9" />
      <path d="M3 12.8h18v5.7" />
      <path d="M3 15.6h18" />
      <path d="M6.6 12.8v-2.4h4.2v2.4" />
    </>
  ),
  // Calendar — a range of dates, rectangular against the pin and the bed.
  'Dostupné termíny': (
    <>
      <rect x="3.4" y="5.6" width="17.2" height="15" rx="2.2" />
      <path d="M3.4 10.2h17.2" />
      <path d="M8.2 3.4v3.6M15.8 3.4v3.6" />
      <path d="M7.6 14h3M13.4 14h3" />
    </>
  ),
}

/**
 * Brand yellow on a grey disc. #FDCA40 needs a dark ground to stay legible on
 * the pale card, but full black read too heavy beside the rest of the box, so
 * the disc is the brand grey pushed dark enough to carry the yellow.
 */
function FactIcon({ label }: { label: string }) {
  const glyph = FACT_ICONS[label]
  if (!glyph) return null
  return (
    <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[#575E57]">
      <svg
        viewBox="0 0 24 24"
        className="h-[17px] w-[17px] text-[#FDCA40]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {glyph}
      </svg>
    </span>
  )
}

export default function LomyClient({ content }: { content: LomyContent }) {
  const { hero } = content
  const { photos, price, facts, discount, ctas, rating } = hero

  const lgRef = useRef<any>(null)
  const [mobileIndex, setMobileIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  const galleryDynamicEl = useMemo(
    () => photos.map((p) => ({ src: p.src, thumb: opt(p.src, 400), subHtml: `<h4>${p.alt}</h4>` })),
    [photos],
  )

  const openGallery = (i: number) => lgRef.current?.openGallery(i)

  const handleTouchStart = (e: React.TouchEvent) => setTouchStartX(e.targetTouches[0].clientX)
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return
    const dx = touchStartX - e.changedTouches[0].clientX
    if (Math.abs(dx) > 40) {
      setMobileIndex((i) =>
        dx > 0 ? Math.min(i + 1, photos.length - 1) : Math.max(i - 1, 0),
      )
    }
    setTouchStartX(null)
  }

  const main = photos[0]
  const strip = photos.slice(1, 5)
  const remaining = photos.length - 5

  // Focus rings switch from yellow to blue on the light ground: #FDCA40 has too
  // little contrast against white to read as a focus state.
  /*
    The primary sits on a physical base: a darker blue edge under the face gives
    it depth, and pressing it travels down onto that edge rather than just
    dimming. The secondary is deliberately quieter — an outline that fills in on
    hover — so the pair reads as one decision, not two competing buttons. Focus
    rings are blue: #FDCA40 has too little contrast against white to register.
  */
  /*
    The quote request leads in red — a deliberate exception to red-for-the-badge,
    made on instruction and confined to this button. It keeps the physical base
    edge: pressing travels down onto it rather than just dimming. The secondary
    stays an outline that fills to near-black, so the pair reads as one decision.
    Focus rings are blue — it carries against both white and red.
  */
  const ctaPrimary =
    'relative inline-flex items-center justify-center rounded-[9px] bg-[#DF2935] px-6 py-3.5 text-center text-[13.5px] font-bold leading-tight tracking-[0.045em] text-white ' +
    'shadow-[0_3px_0_0_#A81B24,0_10px_22px_-10px_rgba(223,41,53,0.7)] transition-[background-color,box-shadow,transform] duration-150 ease-out ' +
    'hover:bg-[#CC2430] hover:shadow-[0_3px_0_0_#A81B24,0_16px_28px_-12px_rgba(223,41,53,0.8)] ' +
    'active:translate-y-[3px] active:shadow-[0_0_0_0_#A81B24,0_6px_14px_-10px_rgba(223,41,53,0.65)] ' +
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3772FF]'

  const ctaSecondary =
    'inline-flex items-center justify-center rounded-[9px] border border-[#CFD4CF] bg-transparent px-6 py-3.5 text-center text-[13px] font-semibold uppercase leading-tight tracking-[0.045em] text-[#2B2E2B] ' +
    'transition-[background-color,border-color,color,transform] duration-150 ease-out hover:border-[#080708] hover:bg-[#080708] hover:text-white active:translate-y-px ' +
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3772FF]'

  return (
    <main className="min-h-screen bg-white">
      <div className="bg-bombovo-gray">
        <TopBar />
      </div>
      <Header />

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      {/*
        Clean light ground: a single faint tint (#F7F8F7, derived from the brand
        gray #E6E8E6) marks the hero as its own plane, with the info card in pure
        white lifted above it. Depth comes from tone and shadow only — the
        gradients, noise and tinted washes of the dark version are gone.
      */}
      <section className="relative overflow-hidden bg-[#F7F8F7]">
        {/* Hairline seam against the white page below. */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[#E6E8E6]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-9 sm:px-6 md:pt-12 lg:px-8 lg:pb-20">
          {/* Title block */}
          <div className="rise" style={{ animationDelay: '40ms' }}>
            <h1 className="max-w-3xl">
              {/*
                Sized up so it groups with the venue name as one title block
                rather than floating above it as a stray label. Blue, not red:
                with the primary CTA now red, a red eyebrow made the column read
                as mostly red. Red stays on the seal and that one button.
              */}
              <span className="block text-[clamp(0.95rem,1.9vw,1.35rem)] font-bold uppercase leading-none tracking-[0.06em] text-[#3772FF]">
                {hero.kicker}
              </span>
              <span className="mt-1.5 block text-[clamp(2.1rem,5.4vw,4rem)] font-bold leading-[1.02] tracking-[-0.035em] text-[#080708] md:mt-2">
                {hero.name}
              </span>
            </h1>

            {/* Location + understated Google rating */}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 md:mt-5">
              <span className="inline-flex items-center gap-2 text-[14px] text-[#4A4F4A]">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#8A908A]" fill="currentColor" aria-hidden>
                  <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
                </svg>
                {hero.location}
              </span>
              <span aria-hidden className="hidden h-3 w-px bg-[#D6DAD6] sm:block" />
              {/* One star, one figure — the attribution text is dropped. */}
              <span className="inline-flex items-center gap-1.5 text-[13px]">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#FDCA40]" fill="currentColor" aria-hidden>
                  <path d="m12 2 2.9 6.26 6.85.72-5.1 4.6 1.43 6.72L12 16.9 5.92 20.3l1.43-6.72-5.1-4.6 6.85-.72L12 2Z" />
                </svg>
                <span className="text-[14px] font-semibold tabular-nums text-[#080708]">{rating.value}</span>
              </span>
            </div>

            {/* Mobile-only fact chips — kapacita and termíny sit directly under the headline */}
            <div className="mt-5 flex flex-wrap gap-2 lg:hidden">
              {facts
                .filter((f) => f.label !== 'Lokalita')
                .map((f) => (
                  <span
                    key={f.label}
                    className="inline-flex items-center gap-2 rounded-[8px] border border-[#E6E8E6] bg-white px-3 py-2"
                  >
                    <span aria-hidden className="text-[13px] leading-none">
                      {f.icon}
                    </span>
                    <span className="text-[13px] font-medium text-[#2B2E2B]">{f.value}</span>
                    <span className="sr-only">{f.label}</span>
                  </span>
                ))}
            </div>
          </div>

          {/* Gallery + info box */}
          <div className="mt-7 grid gap-6 md:mt-9 lg:mt-11 lg:grid-cols-12 lg:gap-8">
            {/* ── Gallery ── */}
            <div className="rise lg:col-span-7" style={{ animationDelay: '140ms' }}>
              {/* Desktop: one confident frame + a thumbnail strip */}
              <div className="hidden lg:block">
                <figure className="relative">
                  <button
                    type="button"
                    onClick={() => openGallery(0)}
                    aria-label={`Otvoriť galériu — ${main.alt}`}
                    className="group relative block w-full overflow-hidden rounded-[12px] shadow-[0_18px_40px_-24px_rgba(8,7,8,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3772FF]"
                    style={{ aspectRatio: '3 / 2' }}
                  >
                    <img
                      src={opt(main.src, 1200)}
                      alt={main.alt}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-black/10"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 mix-blend-multiply"
                      style={{ background: 'linear-gradient(180deg, rgba(8,7,8,0) 40%, rgba(8,7,8,0.5) 100%)' }}
                    />

                    {/*
                      The numbered pins and their legend are gone: the facilities
                      are things you'd find in the areál, not steps in an order,
                      so numbering them implied a sequence that doesn't exist. The
                      captioned thumbnail strip below already names each one.
                    */}
                    <span className="pointer-events-none absolute bottom-3 left-3 rounded-[6px] bg-[#080708]/70 px-2.5 py-1.5 text-[11px] font-medium text-[#E6E8E6] backdrop-blur-[2px]">
                      Zobraziť všetkých {photos.length} fotiek
                    </span>
                  </button>

                  {/* Amphitheatre seal, placement 1 of 1: on the primary photo. */}
                  <DiscountSeal
                    amount={discount.amount}
                    deadline={discount.deadline}
                    size={118}
                    className="pointer-events-none absolute -right-3 -top-4 -rotate-[9deg]"
                  />
                </figure>

                <div className="mt-4 grid grid-cols-4 gap-3">
                  {strip.map((p, i) => {
                    const index = i + 1
                    const isLast = i === strip.length - 1 && remaining > 0
                    return (
                      <button
                        key={p.src}
                        type="button"
                        onClick={() => openGallery(index)}
                        aria-label={`Otvoriť galériu — ${p.alt}`}
                        className="group relative overflow-hidden rounded-[9px] shadow-[0_8px_20px_-14px_rgba(8,7,8,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3772FF]"
                        style={{ aspectRatio: '4 / 3' }}
                      >
                        <img
                          src={opt(p.src, 400)}
                          alt={p.alt}
                          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                        />
                        {isLast && (
                          <span className="absolute inset-0 flex items-center justify-center bg-[#080708]/72 text-[13px] font-semibold text-white">
                            +{remaining} fotiek
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Mobile: swipeable carousel */}
              <div className="lg:hidden">
                <div
                  className="relative w-full overflow-hidden rounded-[12px] shadow-[0_14px_32px_-20px_rgba(8,7,8,0.45)]"
                  style={{ aspectRatio: '4 / 3' }}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  onClick={() => openGallery(mobileIndex)}
                >
                  <img
                    src={opt(photos[mobileIndex].src, 828)}
                    alt={photos[mobileIndex].alt}
                    className="absolute inset-0 h-full w-full object-cover"
                    draggable={false}
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                  />

                  {/* Seal rides the primary photo, matching desktop */}
                  {mobileIndex === 0 && (
                    <DiscountSeal
                      amount={discount.amount}
                      deadline={discount.deadline}
                      size={86}
                      className="pointer-events-none absolute right-2.5 top-2.5 -rotate-[9deg]"
                    />
                  )}

                  <span className="pointer-events-none absolute bottom-3 left-3 text-[12px] font-medium text-white/90">
                    {photos[mobileIndex].alt}
                  </span>
                  <span className="pointer-events-none absolute bottom-3 right-3 rounded-[6px] bg-[#080708]/70 px-2 py-1 text-[11px] font-semibold text-white tabular-nums">
                    {mobileIndex + 1}/{photos.length}
                  </span>
                </div>

                <div className="mt-3 flex justify-center gap-1.5">
                  {photos.map((p, i) => (
                    <button
                      key={p.src}
                      type="button"
                      onClick={() => setMobileIndex(i)}
                      aria-label={`Fotka ${i + 1}`}
                      aria-current={i === mobileIndex}
                      className={`h-[3px] rounded-full transition-[width,background-color] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3772FF] ${
                        i === mobileIndex ? 'w-6 bg-[#3772FF]' : 'w-3 bg-[#C9CEC9]'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* ── Info box (desktop) ── */}
            <aside className="rise hidden lg:col-span-5 lg:block" style={{ animationDelay: '240ms' }}>
              {/*
                Built as a field card rather than a pricing card: a dark slab
                carrying the money, cut from the pale body by the Vtáčnik ridgeline
                the hotel sits under. The uppercase micro-labels are gone — the
                facts read as plain sentences with drawn icons, which suits a
                teacher scanning for facts more than a SaaS tier does.

                The discount lives on the photo seal only; the slab states the
                price and nothing else.
              */}
              <div className="relative overflow-hidden rounded-[16px] bg-[#FBFCFB] shadow-[0_1px_2px_rgba(8,7,8,0.04),0_24px_50px_-30px_rgba(8,7,8,0.3)] ring-1 ring-[#E1E4E1]">
                {/* ── Price slab ── */}
                {/* Brand grey #E6E8E6 — the same surface the site header uses, dark text on it. */}
                <div className="relative bg-bombovo-gray px-7 pb-10 pt-6">
                  <p className="text-[12px] font-medium text-[#5C625C]">Cena {price.prefix}</p>

                  {/* Discounted figure leads; the original sits beside it, struck through. */}
                  <p className="mt-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-[clamp(2.1rem,3.1vw,2.7rem)] font-bold leading-none tracking-[-0.035em] text-bombovo-dark tabular-nums">
                      {price.discounted}
                    </span>
                    <span className="text-[19px] font-medium text-[#8A908A] line-through decoration-bombovo-red decoration-2 tabular-nums">
                      {price.amount}
                    </span>
                    <span className="text-[15px] text-[#5C625C]">{price.unit}</span>
                  </p>

                  {/*
                    Nothing follows the figures here. The seal on the photo carries
                    the discount and its deadline, and the strikethrough already
                    shows the saving — so the chip, the deadline sentence and the
                    programme note are all removed rather than restating it.
                  */}

                  {/* Even wave edge, generated from WAVE_PATH — see its comment. */}
                  <svg
                    viewBox="0 0 400 18"
                    preserveAspectRatio="none"
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-[-1px] h-[16px] w-full"
                  >
                    <path d={WAVE_PATH} fill="#FBFCFB" />
                  </svg>
                </div>

                {/* ── Facts ── */}
                <div className="px-7 pb-7 pt-5">
                  <dl>
                    {facts.map((f, i) => (
                      <div
                        key={f.label}
                        className={`flex items-start gap-3 py-3 ${
                          i > 0 ? 'border-t border-[#EAECEA]' : ''
                        }`}
                      >
                        <span className="mt-[1px]">
                          <FactIcon label={f.label} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <dt className="text-[12px] font-medium text-[#8A908A]">{f.label}</dt>
                          <dd className="mt-0.5 text-[15px] font-semibold leading-snug text-[#080708]">
                            {f.value}
                          </dd>
                        </div>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-6 flex flex-col gap-2.5">
                    <a href={ctas.primary.href} className={ctaPrimary}>
                      {ctas.primary.label}
                    </a>
                    <a href={ctas.secondary.href} className={ctaSecondary}>
                      {ctas.secondary.label}
                    </a>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Mobile sticky action bar */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E6E8E6] bg-white/95 backdrop-blur-md lg:hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            <div className="min-w-0">
              {/* Same arithmetic as the desktop box, compressed to one line. */}
              <p className="flex items-baseline gap-1.5">
                <span className="text-[11px] text-[#8A908A]">{price.prefix}</span>
                <span className="text-[21px] font-bold leading-none tracking-[-0.02em] text-[#080708] tabular-nums">
                  {price.discounted}
                </span>
                <span className="text-[13px] font-medium text-[#9AA09A] line-through decoration-[#DF2935] tabular-nums">
                  {price.amount}
                </span>
                <span className="text-[12px] text-[#4A4F4A]">{price.unit}</span>
              </p>
              <p className="mt-1 text-[11.5px] text-[#4A4F4A]">
                <span className="font-semibold text-[#DF2935]">
                  {discount.amount} {discount.unit}
                </span>{' '}
                <span className="text-[#8A908A]">{discount.deadline}</span>
              </p>
            </div>
            <a href={ctas.primary.href} className={`${ctaPrimary} shrink-0 px-4 py-3 text-[12px]`}>
              {ctas.primary.label}
            </a>
          </div>
        </div>
      </section>

      {/* Keeps the sticky bar from covering the end of the page on mobile */}
      <div aria-hidden className="h-[76px] lg:hidden" />

      <Footer />

      <LightGallery
        onInit={(detail) => {
          lgRef.current = detail.instance
        }}
        plugins={[lgThumbnail, lgZoom]}
        dynamic
        dynamicEl={galleryDynamicEl}
        speed={500}
        download={false}
        swipeToClose={false}
        closeOnTap={false}
        mobileSettings={{ swipeToClose: false, closeOnTap: false }}
      >
        <span />
      </LightGallery>

      <style jsx>{`
        .rise {
          animation: lomy-rise 0.62s cubic-bezier(0.16, 0.84, 0.44, 1) both;
        }
        @keyframes lomy-rise {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .rise {
            animation: none;
          }
        }
      `}</style>
    </main>
  )
}
