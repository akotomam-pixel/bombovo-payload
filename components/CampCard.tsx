'use client'

import posthog from 'posthog-js'
import Link from 'next/link'
import Image from 'next/image'
import { FiUsers, FiZap, FiStar, FiSun, FiBook, FiTrendingUp, FiGlobe } from 'react-icons/fi'
import { GiPalette, GiSoccerBall, GiMountains, GiSwordsPower } from 'react-icons/gi'
import { MdChildCare, MdSportsBasketball, MdDirectionsRun } from 'react-icons/md'

interface CampCardProps {
  id: string
  name: string
  age: string
  types: string[]
  displayTypes: string[]
  price: string
  index: number
  description: string
  image: string
  /**
   * Whole camp is closed for the season — greys the card and drops the price
   * + CTA. Not the same as a single termín being `vypredané`.
   */
  poSezone?: boolean
}

export default function CampCard({ id, name, age, types, displayTypes, price, description, image, index, poSezone = false }: CampCardProps) {
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

  return (
    <div
      className={`bg-white rounded-3xl overflow-hidden transition-shadow duration-300 ${
        poSezone
          ? 'shadow-none ring-1 ring-black/5'
          : 'shadow-lg hover:shadow-xl'
      }`}
    >
      {/* Camp Photo */}
      <Link href={`/letne-tabory/${id}`} className="block h-64 relative overflow-hidden" aria-label={`Pozri letný tábor ${name}`} onClick={() => posthog.capture('camp_viewed', { camp_name: name })}>
        <Image
          src={image}
          alt={`${name} – letný tábor pre deti | Bombovo`}
          fill
          className={`object-cover transition-transform duration-300 ${poSezone ? 'grayscale' : 'hover:scale-105'}`}
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={index < 3}
        />
        {poSezone && (
          <>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-black/0" />
            <div className="absolute left-4 top-4 rounded-full bg-bombovo-dark px-4 py-2 shadow-[0_4px_14px_-2px_rgba(8,7,8,0.4)]">
              <span className="text-[12px] font-bold uppercase leading-none tracking-wider text-white">
                Po sezóne
              </span>
            </div>
          </>
        )}
      </Link>

      {/* Content */}
      <div className={`p-6 space-y-4 ${poSezone ? 'opacity-75 grayscale' : ''}`}>
        {/* Camp Name */}
        <h3 className="text-2xl font-bold text-bombovo-dark leading-tight text-center">{name}</h3>

        {/* Icon Information Row */}
        <div className="flex items-center gap-4 text-gray-600">
          {/* Age Group */}
          <div className="flex items-center gap-2">
            <FiUsers className="w-5 h-5 text-bombovo-blue flex-shrink-0" />
            <span className="text-sm font-medium whitespace-nowrap">{age}</span>
          </div>

          {/* Camp Types */}
          <div className="flex items-center gap-3">
            {types.slice(0, 2).map((type, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-bombovo-blue whitespace-nowrap">
                {getTypeIcon(type)}
                <span className="text-sm font-medium">{displayTypes[idx]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Short Description */}
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>

        {poSezone ? (
          /* Off-season — no price, no booking. Mirrors the sold-out stredisko
             card's dead box so the two listings read as one system. */
          <div className="mt-6 flex w-full cursor-default items-center justify-center rounded-2xl border-[3px] border-gray-300 bg-gray-100 p-4 text-lg font-bold text-gray-400">
            Po sezóne
          </div>
        ) : (
          /* Price and CTA Row */
          <div className="flex gap-3 mt-6">
            {/* Price */}
            <Link href={`/letne-tabory/${id}`} className="flex-1" aria-label={`Prihlásiť sa na tábor ${name}`} onClick={() => posthog.capture('camp_viewed', { camp_name: name })}>
              <div className="bg-[#DF2935] rounded-2xl p-4 flex items-center justify-center">
                <span className="text-white text-3xl font-bold">{price}</span>
              </div>
            </Link>

            {/* CTA Button */}
            <Link href={`/letne-tabory/${id}`} className="flex-1" aria-label={`Zistiť viac o letnom tábore ${name}`} onClick={() => posthog.capture('camp_viewed', { camp_name: name })}>
              <button className="w-full h-full bg-[#FDCA40] text-bombovo-dark text-lg font-bold rounded-2xl p-4 active:translate-y-1 transition-transform duration-150">
                Zistiť viac
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

