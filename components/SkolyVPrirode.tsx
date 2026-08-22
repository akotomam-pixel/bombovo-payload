'use client'

import StrediskoCard from '@/components/StrediskoCard'

interface Stredisko {
  id: string
  name: string
  slug: string
  price?: string
  vypredane?: boolean
  _imageUrl?: string | null
}

interface FeaturedSkolaItem {
  skola?: Stredisko | null
}

interface SkolyVPrirodeProps {
  headline: string
  featuredSkoly: FeaturedSkolaItem[]
}

/**
 * Homepage teaser for /skoly-v-prirode. Used to render its own older card
 * design; now reuses the same StrediskoCard component the overview grid
 * uses, so a featured stredisko looks identical in both places — real
 * price/discount from its content file, the wavy discount seal, sold-out
 * handling, all of it, rather than a second card to keep in sync by hand.
 */
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
            <StrediskoCard
              key={stredisko.id}
              slug={stredisko.slug}
              name={stredisko.name}
              image={stredisko._imageUrl ?? ''}
              fallbackPrice={stredisko.price ?? ''}
              vypredane={stredisko.vypredane}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
