'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const camps = [
  {
    id: 1,
    name: '[Názov Tábora 1]',
    description: '[Insert Text About The Camp]',
    color: 'from-bombovo-blue to-blue-400',
  },
  {
    id: 2,
    name: '[Názov Tábora 2]',
    description: '[Insert Text About The Camp]',
    color: 'from-bombovo-red to-red-400',
  },
  {
    id: 3,
    name: '[Názov Tábora 3]',
    description: '[Insert Text About The Camp]',
    color: 'from-bombovo-yellow to-yellow-400',
  },
]

export default function TopCamps() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headline */}
        <h2 
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-bombovo-dark text-center mb-4"
        >
          Naše Najpredávanejšie Tábory V Roku 2026
        </h2>

        {/* Camp Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {camps.map((camp, index) => (
            <div
              key={camp.id}
              className="bg-white rounded-3xl shadow-lg overflow-hidden"
            >
              {/* Image placeholder */}
              <div className="w-full aspect-[4/3] flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#90EE90' }}>
                <div className="text-center z-10">
                  <p className="text-lg font-bold text-bombovo-dark">[PICTURE WILL BE PLACED HERE]</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-bombovo-dark mb-3">
                  {camp.name}
                </h3>
                <p className="text-bombovo-dark leading-relaxed mb-4 line-clamp-3">
                  {camp.description}
                </p>
                <Link href="/letne-tabory">
                  <button
                    className="w-full py-3 bg-bombovo-blue text-white font-semibold rounded-2xl hover:translate-y-0.5 active:translate-y-1 transition-transform duration-150"
                  >
                    Zistiť viac
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div 
          className="text-center mt-12"
        >
          <Link href="/letne-tabory">
            <button
              className="px-10 py-4 bg-bombovo-yellow text-bombovo-dark font-bold text-lg rounded-3xl shadow-lg hover:translate-y-0.5 active:translate-y-1 hover:bg-bombovo-blue hover:text-white transition-all duration-150"
            >
              Všetky letné tábory
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}



