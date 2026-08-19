'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import LightGallery from 'lightgallery/react'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgZoom from 'lightgallery/plugins/zoom'
import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-zoom.css'
import 'lightgallery/css/lg-thumbnail.css'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TerminyModal from './TerminyModal'
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

/** Brand yellow on the brand dark — the strongest contrast the palette allows. */
function FactIcon({ label }: { label: string }) {
  const glyph = FACT_ICONS[label]
  if (!glyph) return null
  return (
    <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-bombovo-dark">
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

/**
 * Proof-strip icon: the client's own artwork, already in brand blue and yellow.
 *
 * The files carry a wide white margin around the glyph, so the image is drawn
 * larger than its box and clipped — that trims the built-in padding and lets the
 * three glyphs sit at a consistent optical size without editing the assets.
 */
function ProofIcon({ src, label }: { src: string; label: string }) {
  return (
    <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center overflow-hidden">
      <img src={opt(src, 128)} alt="" aria-hidden className="h-[58px] w-[58px] max-w-none object-contain" />
      <span className="sr-only">{label}</span>
    </span>
  )
}

/** Five brand-yellow stars, used by the review. */
function Stars({ count, size = 12 }: { count: number; size?: number }) {
  return (
    <span className="flex items-center gap-[2px]" aria-label={`${count} z 5 hviezdičiek`}>
      {Array.from({ length: count }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24" style={{ width: size, height: size }} className="text-bombovo-yellow" fill="currentColor" aria-hidden>
          <path d="m12 2 2.9 6.26 6.85.72-5.1 4.6 1.43 6.72L12 16.9 5.92 20.3l1.43-6.72-5.1-4.6 6.85-.72L12 2Z" />
        </svg>
      ))}
    </span>
  )
}

export default function LomyClient({ content }: { content: LomyContent }) {
  const { hero } = content
  const { photos, price, facts, proof, discount, ctas, rating, review } = hero

  const lgRef = useRef<any>(null)
  const [mobileIndex, setMobileIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  // Both hero CTAs open the termíny dialog; neither scrolls to an anchor.
  const [terminyOpen, setTerminyOpen] = useState(false)
  const openTerminy = useCallback(() => setTerminyOpen(true), [])
  const closeTerminy = useCallback(() => setTerminyOpen(false), [])

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
            {/*
              A flex column so the review below can absorb the leftover height:
              the price card keeps its natural size and the review stretches, so
              this column bottoms out level with the photo + thumbnail strip.
            */}
            {/*
              The two columns are locked together by arithmetic, not by eye.

              The container is min(100vw,1280px) - 64px of padding. In this
              12-col grid with 32px gaps the left column spans 7 units plus 6
              gaps:
                leftW = (container - 352) * 7/12 + 192
              These use vw, not %: a percentage in a height context resolves
              against the parent's height, which silently broke the first
              attempt at this.
              The photo is 3:2, so it is leftW*2/3 tall. The thumbnail strip is
              4 columns at 4:3 with three 12px gaps, so each thumb is
              (leftW - 36)/4 wide and 3/4 of that tall. Verified at 1440px:
              leftW 696 -> photo 464, thumb 123.75, which is what the price card
              and the proof strip below are set to.
            */}
            <aside
              className="rise hidden lg:col-span-5 lg:flex lg:flex-col lg:self-start"
              style={
                {
                  animationDelay: '240ms',
                  '--container': 'calc(min(100vw, 1280px) - 64px)',
                  '--left-w': 'calc((var(--container) - 352px) * 7 / 12 + 192px)',
                  '--photo-h': 'calc(var(--left-w) * 2 / 3)',
                  '--thumb-h': 'calc((var(--left-w) - 36px) * 3 / 16)',
                } as React.CSSProperties
              }
            >
              {/*
                Built as a field card rather than a pricing card: a dark slab
                carrying the money, cut from the pale body by the Vtáčnik ridgeline
                the hotel sits under. The uppercase micro-labels are gone — the
                facts read as plain sentences with drawn icons, which suits a
                teacher scanning for facts more than a SaaS tier does.

                The discount lives on the photo seal only; the slab states the
                price and nothing else.
              */}
              <div className="relative flex flex-col overflow-hidden rounded-[16px] bg-[#FBFCFB] shadow-[0_1px_2px_rgba(8,7,8,0.04),0_24px_50px_-30px_rgba(8,7,8,0.3)] ring-1 ring-[#E1E4E1] lg:h-[var(--photo-h)]">
                {/* ── Price slab ── */}
                {/* Brand dark slab, white text on it. */}
                <div className="relative bg-bombovo-dark px-7 pb-8 pt-5">
                  <p className="text-[12px] font-medium text-[#E6E8E6]/65">Cena {price.prefix}</p>

                  {/*
                    Struck price first, then the price actually charged — the
                    reading order of the saving. Both are set at the same size so
                    the comparison is like-for-like; the discounted figure carries
                    the emphasis through weight and full-strength white instead.
                  */}
                  <p className="mt-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-[clamp(2.1rem,3.1vw,2.7rem)] font-medium leading-none tracking-[-0.035em] text-[#E6E8E6]/50 line-through decoration-bombovo-red decoration-[3px] tabular-nums">
                      {price.amount}
                    </span>
                    <span className="text-[clamp(2.1rem,3.1vw,2.7rem)] font-bold leading-none tracking-[-0.035em] text-white tabular-nums">
                      {price.discounted}
                    </span>
                    <span className="text-[15px] text-[#E6E8E6]/70">{price.unit}</span>
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
                <div className="flex flex-1 flex-col px-7 pb-5 pt-3">
                  <dl>
                    {facts.map((f, i) => (
                      <div
                        key={f.label}
                        className={`flex items-start gap-3 py-2.5 ${
                          i > 0 ? 'border-t border-[#EAECEA]' : ''
                        }`}
                      >
                        <span className="mt-[1px]">
                          <FactIcon label={f.label} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <dt className="text-[12px] font-semibold text-bombovo-blue">{f.label}</dt>
                          <dd className="mt-0.5 text-[15px] font-semibold leading-snug text-[#080708]">
                            {f.value}
                          </dd>
                        </div>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-auto flex flex-col gap-2 pt-4">
                    <button type="button" onClick={openTerminy} className={ctaPrimary}>
                      {ctas.primary.label}
                    </button>
                    <button type="button" onClick={openTerminy} className={ctaSecondary}>
                      {ctas.secondary.label}
                    </button>
                  </div>
                </div>
              </div>

              {/*
                Proof strip. Sized to its own content — it no longer stretches to
                match the left column, since three short claims do not need the
                height a lone review did. Stacks to one column on narrow screens,
                where three columns of wrapped text would be unreadable.
              */}
              <ul className="mt-3 grid grid-cols-1 gap-3 rounded-[10px] bg-[#EFF1EF] px-3 py-3 sm:grid-cols-3 sm:gap-0 lg:mt-[16px] lg:h-[var(--thumb-h)] lg:items-center lg:py-0">
                {proof.map((p, i) => (
                  <li
                    key={p.label}
                    className={`flex flex-col items-center gap-1.5 px-2.5 text-center ${
                      i > 0 ? 'sm:border-l sm:border-[#D7DBD6]' : ''
                    }`}
                  >
                    <ProofIcon src={p.icon} label={p.label} />
                    <span className="text-[11.5px] font-bold leading-[1.3] text-[#080708]">
                      {p.label}
                    </span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          {/*
            Review, directly beneath the whole hero row and inside the same
            container, so it spans the hero's width exactly. The 10px gap keeps
            it reading as part of the hero rather than as a section of its own,
            and it sits after the grid in normal flow — nothing overlaps the
            photography. Quote and attribution stack below md, where the row plus
            divider would be too cramped to scan.
          */}
          <figure className="mt-2.5 flex flex-col gap-4 rounded-[10px] bg-[#EFF1EF] px-5 py-4 md:flex-row md:items-center md:gap-5">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <span
                aria-hidden
                className="shrink-0 text-[30px] font-bold leading-[0.8] text-bombovo-blue"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                &ldquo;
              </span>
              <blockquote className="text-[13px] font-medium leading-[1.5] text-[#080708]">
                {review.quote}
              </blockquote>
            </div>

            <span aria-hidden className="hidden h-11 w-px shrink-0 bg-[#D7DBD6] md:block" />

            <figcaption className="flex shrink-0 items-center gap-3">
              {/* Initials, not a photo — we have no permission to use one. */}
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bombovo-blue text-[12px] font-bold text-white">
                {review.initials}
              </span>
              <div className="min-w-0">
                <p className="text-[12.5px] font-bold leading-tight text-[#080708]">{review.author}</p>
                <p className="mt-0.5 text-[11.5px] leading-tight text-[#6C726C]">
                  {review.school} · {review.groupSize}
                </p>
                <span className="mt-1 block">
                  <Stars count={review.stars} />
                </span>
              </div>
            </figcaption>
          </figure>
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
            <button
              type="button"
              onClick={openTerminy}
              className={`${ctaPrimary} shrink-0 px-4 py-3 text-[12px]`}
            >
              {ctas.primary.label}
            </button>
          </div>
        </div>
      </section>

      {/* Keeps the sticky bar from covering the end of the page on mobile */}
      <div aria-hidden className="h-[76px] lg:hidden" />

      <Footer />

      <TerminyModal content={content.terminy} open={terminyOpen} onClose={closeTerminy} />

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
