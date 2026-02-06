'use client'

import Link from 'next/link'
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
}

export default function CampCard({ id, name, age, types, displayTypes, price, description, image }: CampCardProps) {
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
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Camp Photo */}
      <div className="h-64 relative overflow-hidden">
        <img 
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Camp Name */}
        <h3 className="text-2xl font-bold text-bombovo-dark leading-tight">{name}</h3>

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

        {/* Price and CTA Row */}
        <div className="flex gap-3 mt-6">
          {/* Price */}
          <div className="flex-1 bg-[#DF2935] rounded-2xl p-4 flex items-center justify-center">
            <span className="text-white text-3xl font-bold">{price}</span>
          </div>

          {/* CTA Button */}
          <Link href={`/letne-tabory/${id}`} className="flex-1">
            <button className="w-full h-full bg-[#FDCA40] text-bombovo-dark text-lg font-bold rounded-2xl p-4 hover:translate-y-0.5 active:translate-y-1 transition-transform duration-150">
              Zistiť viac
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

