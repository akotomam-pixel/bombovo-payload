'use client'

import Link from 'next/link'

interface Stredisko {
  id: string
  name: string
  slug: string
  price?: string
  cardImage?: { url: string } | null
}

interface FeaturedSkolaItem {
  skola?: Stredisko | null
}

interface SkolyVPrirodeProps {
  headline: string
  featuredSkoly: FeaturedSkolaItem[]
}

export default function SkolyVPrirode({ headline, featuredSkoly }: SkolyVPrirodeProps) {
  const strediska = featuredSkoly
    .map(item => item.skola)
    .filter((s): s is Stredisko => !!s && typeof s === 'object' && 'name' in s)

  if (strediska.length === 0) return null

  return (
    <section className="pt-20 pb-16 md:pt-28 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Headline */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-bombovo-dark text-center mb-12">
          {headline}
        </h2>

        {/* Strediska Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {strediska.map((stredisko) => (
            <div
              key={stredisko.id}
              className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image */}
              <div className="h-64 relative overflow-hidden">
                {stredisko.cardImage?.url && (
                  <img
                    src={stredisko.cardImage.url}
                    alt={stredisko.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-bombovo-dark mb-4">{stredisko.name}</h3>
                {stredisko.price && (
                  <div className="relative inline-block mb-6">
                    <p className="text-bombovo-red text-xl font-semibold">{stredisko.price}</p>
                    <svg className="absolute left-0 -bottom-1 w-full" viewBox="0 0 200 8" preserveAspectRatio="none" style={{ height: '8px' }}>
                      <path d="M 0 6 Q 25 2, 50 5 T 100 5 T 150 5 T 200 6" stroke="#3772FF" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    </svg>
                  </div>
                )}
                <Link href={`/skoly-v-prirode/${stredisko.slug}`}>
                  <button className="w-full py-4 px-8 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold text-base rounded-full hover:translate-y-0.5 transition-all duration-200">
                    Zistiť viac
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
