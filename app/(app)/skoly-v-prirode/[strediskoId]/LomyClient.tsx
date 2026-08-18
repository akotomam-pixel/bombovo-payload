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

/** Points for the sale-star burst, drawn in a 0–100 viewBox. */
const BURST = (() => {
  const spikes = 14
  const [outer, inner, c] = [50, 41.5, 50]
  return Array.from({ length: spikes * 2 }, (_, i) => {
    const r = i % 2 === 0 ? outer : inner
    const a = (Math.PI / spikes) * i - Math.PI / 2
    return `${(c + r * Math.cos(a)).toFixed(2)},${(c + r * Math.sin(a)).toFixed(2)}`
  }).join(' ')
})()

function DiscountStar({
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
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label={`Zľava ${amount} ${deadline}`}
      className={className}
      style={{ fontFamily: 'inherit', filter: 'drop-shadow(0 6px 16px rgba(223,41,53,0.32))' }}
    >
      <polygon points={BURST} fill="#DF2935" />
      <text x="50" y="49" textAnchor="middle" fill="#FFFFFF" fontSize="21" fontWeight="700" letterSpacing="-1">
        {amount}
      </text>
      <text x="50" y="64" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontWeight="600" opacity="0.9">
        {deadline}
      </text>
    </svg>
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
  const ctaPrimary =
    'inline-flex items-center justify-center rounded-[10px] bg-[#3772FF] px-6 py-3.5 text-center text-[13.5px] font-semibold leading-tight tracking-[0.02em] text-white ' +
    'shadow-[0_6px_18px_-6px_rgba(55,114,255,0.55)] transition-[background-color,box-shadow,transform] duration-200 ease-out ' +
    'hover:bg-[#2A5CE0] hover:shadow-[0_10px_24px_-8px_rgba(55,114,255,0.6)] active:translate-y-px ' +
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3772FF]'

  const ctaSecondary =
    'inline-flex items-center justify-center rounded-[10px] border border-[#D6DAD6] bg-white px-6 py-3.5 text-center text-[13.5px] font-semibold leading-tight tracking-[0.01em] text-[#2B2E2B] ' +
    'transition-[background-color,border-color,transform] duration-200 ease-out hover:border-[#B9BFB9] hover:bg-[#F4F6F4] active:translate-y-px ' +
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
              <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3772FF] md:text-[12px]">
                {hero.kicker}
              </span>
              <span className="mt-2.5 block text-[clamp(2.1rem,5.4vw,4rem)] font-bold leading-[1.02] tracking-[-0.035em] text-[#080708] md:mt-3">
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
              {/* One star only, then the figure and its source — kept deliberately quiet. */}
              <span className="inline-flex items-center gap-1.5 text-[13px] text-[#4A4F4A]">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-[#FDCA40]" fill="currentColor" aria-hidden>
                  <path d="m12 2 2.9 6.26 6.85.72-5.1 4.6 1.43 6.72L12 16.9 5.92 20.3l1.43-6.72-5.1-4.6 6.85-.72L12 2Z" />
                </svg>
                <span className="font-medium tabular-nums text-[#080708]">{rating.value}</span>
                <span className="text-[#8A908A]">({rating.source})</span>
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

                    {/* Site markers keyed to the legend below — they name what's in this frame */}
                    {main.markers?.map((m, i) => (
                      <span
                        key={m.label}
                        aria-hidden
                        className="pointer-events-none absolute flex h-[26px] w-[26px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#FDCA40]/80 bg-[#080708]/75 text-[11px] font-semibold text-[#FDCA40] backdrop-blur-[2px]"
                        style={{ left: `${m.x}%`, top: `${m.y}%` }}
                      >
                        {i + 1}
                      </span>
                    ))}

                    <span className="pointer-events-none absolute bottom-3 left-3 rounded-[6px] bg-[#080708]/70 px-2.5 py-1.5 text-[11px] font-medium text-[#E6E8E6] backdrop-blur-[2px]">
                      Zobraziť všetkých {photos.length} fotiek
                    </span>
                  </button>

                  {/* Discount star, placement 1 of 2: on the primary photo */}
                  <DiscountStar
                    amount={discount.amount}
                    deadline={discount.deadline}
                    size={118}
                    className="pointer-events-none absolute -right-3 -top-4 -rotate-[9deg]"
                  />

                  {main.markers && (
                    <figcaption className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-2">
                      {main.markers.map((m, i) => (
                        <span key={m.label} className="inline-flex items-center gap-2 text-[12.5px] text-[#4A4F4A]">
                          <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#080708] text-[10px] font-semibold text-[#FDCA40]">
                            {i + 1}
                          </span>
                          {m.label}
                        </span>
                      ))}
                    </figcaption>
                  )}
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

                  {/* Discount star rides the primary photo, matching desktop */}
                  {mobileIndex === 0 && (
                    <DiscountStar
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
                The second discount star is gone: the price box now states the
                discount as arithmetic (205 € struck through → 175 €, −30 € chip),
                which says the same thing more precisely than a badge repeating a
                figure already on the photo. The deadline moves into this block so
                the time limit stays attached to the price.
              */}
              <div className="relative rounded-[14px] bg-white p-7 shadow-[0_1px_2px_rgba(8,7,8,0.04),0_20px_44px_-28px_rgba(8,7,8,0.28)] ring-1 ring-[#E6E8E6]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8A908A]">
                  Cena {price.prefix}
                </p>

                {/* Discounted figure leads; the original sits beside it, struck through. */}
                <p className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-[clamp(2rem,3vw,2.6rem)] font-bold leading-none tracking-[-0.03em] text-[#080708] tabular-nums">
                    {price.discounted}
                  </span>
                  <span className="text-[19px] font-medium text-[#9AA09A] line-through decoration-[#DF2935] decoration-2 tabular-nums">
                    {price.amount}
                  </span>
                  <span className="text-[15px] text-[#4A4F4A]">{price.unit}</span>
                </p>

                <p className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                  <span className="inline-flex items-center rounded-[6px] bg-[#DF2935] px-2.5 py-1 text-[12.5px] font-bold text-white tabular-nums">
                    {discount.amount} {discount.unit}
                  </span>
                  <span className="text-[12.5px] font-medium text-[#4A4F4A]">
                    pri rezervácii {discount.deadline}
                  </span>
                </p>

                <p className="mt-2.5 text-[12.5px] text-[#8A908A]">({price.note})</p>

                <dl className="mt-6 border-y border-[#E6E8E6]">
                  {facts.map((f, i) => (
                    <div
                      key={f.label}
                      className={`flex items-baseline justify-between gap-4 py-3.5 ${
                        i > 0 ? 'border-t border-[#E6E8E6]' : ''
                      }`}
                    >
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A908A]">
                        {f.label}
                      </dt>
                      <dd className="text-right text-[15px] font-medium text-[#080708]">{f.value}</dd>
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
