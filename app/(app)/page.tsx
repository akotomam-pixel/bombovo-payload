import configPromise from '@payload-config'
import { getPayload } from 'payload'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import HomePageButtons from '@/components/HomePageButtons'
import HeroSection from '@/components/HeroSection'
import ReviewCarousel from '@/components/ReviewCarousel'
import TopCampsWithSearch from '@/components/TopCampsWithSearch'
import FourReasons from '@/components/FourReasons'
import SkolyVPrirode from '@/components/SkolyVPrirode'
import GiveawaySection from '@/components/GiveawaySection'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import WaveDivider from '@/components/WaveDivider'

async function getHomepage() {
  try {
    const payload = await getPayload({ config: configPromise })
    return await payload.findGlobal({ slug: 'homepage', depth: 2 })
  } catch {
    return null
  }
}


// Fetch strediska directly with depth:1 so cardImage + heroGallery photos
// are fully resolved — nested upload fields inside relationships are not
// reliably resolved when going through the homepage global query.
async function getStrediskaByIds(ids: string[]) {
  if (ids.length === 0) return []
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'strediska',
      where: { id: { in: ids } },
      limit: ids.length,
      depth: 1,
    })
    return result.docs as Record<string, any>[]
  } catch {
    return []
  }
}

export default async function Home() {
  const hp = await getHomepage()

  // Extract stredisko IDs from the homepage global (they may still be raw IDs
  // or partially-resolved objects depending on Payload depth behaviour).
  const rawSkoly: any[] = (hp as any)?.featuredSkoly ?? []
  const strediskoIds: string[] = rawSkoly
    .map((item: any) => {
      const s = item?.skola
      if (!s) return null
      return typeof s === 'object' ? String(s.id ?? '') : String(s)
    })
    .filter(Boolean) as string[]

  // Fetch the strediska directly — this guarantees photos are resolved.
  const strediskaByIdMap = new Map<string, Record<string, any>>()
  if (strediskoIds.length > 0) {
    const docs = await getStrediskaByIds(strediskoIds)
    for (const doc of docs) {
      strediskaByIdMap.set(String(doc.id), doc)
    }
  }

  // Build enriched featuredSkoly using the directly-fetched strediska.
  // Inject _imageUrl: cardImage first, then first heroGallery photo.
  const enrichedFeaturedSkoly = strediskoIds.map((id) => {
    const doc = strediskaByIdMap.get(id) ?? null
    if (!doc) return { skola: null }
    const cardUrl = (doc.cardImage as any)?.url as string | undefined
    const galleryUrl = Array.isArray(doc.heroGallery)
      ? ((doc.heroGallery[0]?.photo as any)?.url as string | undefined)
      : undefined
    return {
      skola: {
        ...doc,
        _imageUrl: cardUrl ?? galleryUrl ?? null,
      },
    }
  })

  return (
    <main className="min-h-screen">
      {/* Section 0: Top Bar */}
      <div className="bg-bombovo-gray">
        <TopBar />
      </div>

      {/* Section 1: Header */}
      <Header />

      {/* Mobile Home Page Buttons */}
      <HomePageButtons />

      {/* Section 2: Hero */}
      <div className="bg-bombovo-gray">
        <HeroSection
          subHeadline={hp?.subHeadline ?? 'BOMBOVO:'}
          headline={hp?.headline ?? 'Miesto kam sa vaše dieťa bude chcieť vrátiť'}
          stats={hp?.stats ?? []}
        />
      </div>

      {/* DIVIDER 1 */}
      <WaveDivider color="yellow" variant={1} />

      {/* Section 3: Review Carousel */}
      <div className="bg-white">
        <ReviewCarousel
          reviews={hp?.reviews ?? []}
          displaySeconds={hp?.reviewDisplaySeconds ?? 5}
        />
      </div>

      {/* DIVIDER 2 */}
      <WaveDivider color="red" variant={2} />

      {/* Section 4: Top Camps */}
      <div className="bg-bombovo-gray">
        <TopCampsWithSearch
          headline={hp?.featuredCampsHeadline ?? 'Naše Najpredávanejšie Tábory V Roku 2026'}
          featuredCamps={hp?.featuredCamps ?? []}
        />
      </div>

      {/* DIVIDER 3 */}
      <WaveDivider color="yellow" variant={3} />

      {/* Section 5: Four Reasons */}
      <div className="bg-white">
        <FourReasons
          headline={hp?.reasonsHeadline ?? '4 Dôvody Prečo ísť do Bombova'}
          reasons={hp?.reasons ?? []}
        />
      </div>

      {/* DIVIDER 4 */}
      <WaveDivider color="red" variant={1} />

      {/* Section 6: Školy v Prírode */}
      <div className="bg-bombovo-gray">
        <SkolyVPrirode
          headline={hp?.skolyHeadline ?? 'Pozri Si Naše Školy V Prírode'}
          featuredSkoly={enrichedFeaturedSkoly}
        />
        {/* DIVIDER 5 */}
        <WaveDivider color="blue" variant={2} />
      </div>

      {/* Section 6.1: Giveaway */}
      <div className="bg-white">
        <GiveawaySection
          headline={hp?.giveawayHeadline ?? 'Vyhraj tábor zadarmo!'}
          subHeadline={hp?.giveawaySubHeadline ?? 'Vyplň svoje meno, email a vyber si tábor, ktorý by si chcel vyhrať, a si zapojený do súťaže.'}
          giveawayCamps={hp?.giveawayCamps ?? []}
        />
      </div>

      {/* DIVIDER 5.1 */}
      <WaveDivider color="blue" variant={1} />

      {/* Section 7: FAQ */}
      <div className="bg-bombovo-gray">
        <FAQ
          headline={hp?.faqHeadline ?? 'Často Kladené Otázky'}
          items={hp?.faqItems ?? []}
        />
      </div>

      {/* DIVIDER 6 */}
      <WaveDivider color="red" variant={3} />

      {/* Section 8: Footer */}
      <div className="bg-white">
        <Footer />
      </div>
    </main>
  )
}
