'use client'

import posthog from 'posthog-js'
import Link from 'next/link'
import Image from 'next/image'
import { FiUsers, FiZap, FiStar, FiSun, FiBook, FiTrendingUp } from 'react-icons/fi'
import { GiPalette, GiSoccerBall, GiMountains, GiSwordsPower } from 'react-icons/gi'
import { MdChildCare, MdSportsBasketball, MdDirectionsRun } from 'react-icons/md'
import DiscountSeal from '@/components/DiscountSeal'

const SUBHEAD = 'var(--font-subhead), "Comic Sans MS", cursive'

interface CampCardProps {
  id: string
  name: string
  age: string
  types: string[]
  displayTypes: string[]
  price: string
  /** Price before the discount, e.g. "319 €". When set, the card shows it
   *  struck through next to `price` and puts a "-X €" seal on the photo. */
  originalPrice?: string
  index: number
  description: string
  image: string
  /**
   * Whole camp is closed for the season — greys the card and drops the price
   * + CTA. Not the same as a single termín being `vypredané`.
   */
  poSezone?: boolean
}

function euros(value: string): number {
  return Number(value.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0
}

/**
 * Overview-grid card for a camp. Same visual system as StrediskoCard (school
 * in nature) — rounded white card, blue-tinted layered shadow, discount seal
 * on the photo, struck-through price, outlined yellow CTA — so both listings
 * read as one site. Camp-specific bits stay: age + camp types row and the
 * short description.
 */
export default function CampCard({ id, name, age, types, displayTypes, price, originalPrice, description, image, index, poSezone = false }: CampCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Akčný':
        return <FiZap className="w-5 h-5" />
      case 'Umelecký':
        return <GiPalette className="w-5 h-5" />
      case 'Oddychový':
        return <FiSun className="w-5 h-5" />
      case 'Športový':
        return <GiSoccerBall className="w-5 h-5" />
      case 'Unikátny':
        return <FiStar className="w-5 h-5" />
      case 'Tínedžerský':
        return <FiTrendingUp className="w-5 h-5" />
      case 'Náučný':
        return <FiBook className="w-5 h-5" />
      case 'Dobrodružný':
        return <GiMountains className="w-5 h-5" />
      case 'Pre najmenších':
        return <MdChildCare className="w-5 h-5" />
      case 'Fantasy':
        return <GiSwordsPower className="w-5 h-5" />
      case 'Basketbal':
        return <MdSportsBasketball className="w-5 h-5" />
      case 'Tanečný':
        return <MdDirectionsRun className="w-5 h-5" />
      case 'Tvorivý':
        return <GiPalette className="w-5 h-5" />
      default:
        return <FiStar className="w-5 h-5" />
    }
  }


  const href = `/letne-tabory/${id}`
  const track = () => posthog.capture('camp_viewed', { camp_name: name })
  const discount = originalPrice ? Math.round(euros(originalPrice) - euros(price)) : 0

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[28px] bg-white ring-1 ring-black/5 shadow-[0_2px_6px_-2px_rgba(8,7,8,0.10),0_20px_44px_-20px_rgba(55,114,255,0.35)]">
      {poSezone && (
        // Same red stamp band as a sold-out stredisko card. Sibling of the
        // greyscale wrapper so its red stays vivid.
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-64 items-center justify-center overflow-hidden">
          <div
            aria-hidden
            className="w-[130%] -rotate-6 border-y-[3px] border-white/90 bg-bombovo-red py-2.5 text-center shadow-[0_14px_30px_-8px_rgba(8,7,8,0.55)]"
          >
            <span className="text-[16px] font-black uppercase leading-none tracking-[0.3em] text-white">
              Vypredané
            </span>
          </div>
        </div>
      )}

      <div className={`flex flex-1 flex-col ${poSezone ? 'grayscale-[60%] opacity-90' : ''}`}>
        {/* Photo */}
        <Link
          href={href}
          className="relative block h-64 overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-bombovo-blue"
          aria-label={`Pozri letný tábor ${name}`}
          onClick={track}
        >
          <Image
            src={image}
            alt={`${name} – letný tábor pre deti | Bombovo`}
            fill
            className={`object-cover transition-transform duration-500 ease-out ${poSezone ? '' : 'group-hover:scale-[1.05]'}`}
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={index < 3}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-black/0" />

          {!poSezone && discount > 0 && (
            <DiscountSeal
              amount={`-${discount} €`}
              size={92}
              className="pointer-events-none absolute left-3 top-3 -rotate-[9deg]"
            />
          )}
        </Link>

        {/* Content */}
        <div className="flex flex-1 flex-col p-6">
          <h3
            style={{ fontFamily: SUBHEAD }}
            className="text-[26px] font-bold leading-[1.1] text-bombovo-dark"
          >
            {name}
          </h3>

          {/* Age + camp types */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-600">
            <div className="flex items-center gap-2">
              <FiUsers className="h-5 w-5 flex-shrink-0 text-bombovo-blue" />
              <span className="whitespace-nowrap text-sm font-medium">{age}</span>
            </div>
            {types.slice(0, 2).map((type, idx) => (
              <div key={idx} className="flex items-center gap-1.5 whitespace-nowrap text-bombovo-blue">
                {getTypeIcon(type)}
                <span className="text-sm font-medium">{displayTypes[idx]}</span>
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm leading-[1.7] text-gray-600">{description}</p>

          {/* Price + CTA pinned to the bottom so cards in a row line up */}
          <div className="mt-auto pt-6">
            {poSezone ? (
              <div className="flex w-full cursor-default items-center justify-center rounded-2xl border-[3px] border-gray-300 bg-gray-100 p-4 text-lg font-bold text-gray-400">
                Vypredané
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  {discount > 0 && (
                    <span className="text-[32px] font-black leading-none tabular-nums text-[#9AA09A] line-through decoration-2 decoration-[#9AA09A]">
                      {originalPrice}
                    </span>
                  )}
                  <span className="text-[32px] font-black leading-none tabular-nums text-bombovo-dark">
                    {price}
                  </span>
                </div>

                <Link
                  href={href}
                  aria-label={`Zistiť viac o tábore ${name}`}
                  onClick={track}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border-[3px] border-bombovo-dark bg-bombovo-yellow px-6 py-3.5 text-lg font-bold text-bombovo-dark shadow-[3px_3px_0_0_#080708] transition-transform duration-150 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_#080708] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bombovo-blue"
                >
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
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
