import { getPayloadClient } from '@/lib/payload'
import Link from 'next/link'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getCampDetails } from '@/data/camps'
import type { CampDetailData } from '@/data/camps/types'
import CampDetailClient from './CampDetailClient'

// Maps a Payload Camps document to the CampDetailData shape used by the template
function mapPayloadToCampDetails(doc: Record<string, any>): CampDetailData {
  return {
    id: doc.slug ?? '',
    name: doc.name ?? '',
    headline: doc.headline ?? '',
    headlineHighlight: doc.headlineHighlight ?? '',
    location: doc.location ?? '',
    age: doc.age ?? '',
    price: doc.price ?? '',
    bulletPoints: (doc.bulletPoints ?? []).map((b: { text: string }) => b.text),

    section2: {
      ratings: {
        kreativita: doc.ratings?.kreativita ?? 5,
        mystika: doc.ratings?.mystika ?? 5,
        sebarozvoj: doc.ratings?.sebarozvoj ?? 5,
        pohyb: doc.ratings?.pohyb ?? 5,
        kritickeMyslenie: doc.ratings?.kritickeMyslenie ?? 5,
      },
      headline: doc.section2_headline ?? '',
      description: (doc.section2_description ?? []).map((p: { paragraph: string }) => p.paragraph),
      buttonText: 'Pozri Dostupné Termíny',
    },

    section3: {
      headline: doc.section3_headline ?? '',
      text: (doc.section3_text ?? []).map((p: { paragraph: string }) => p.paragraph),
      reviews: (doc.reviews ?? []).map((r: { text: string; author: string }) => ({
        text: r.text,
        author: r.author,
      })),
    },

    section4: {
      details: {
        vTomtoTaboreZazites: (doc.vTomtoTaboreZazites ?? []).map((i: { item: string }) => i.item),
        vCene: (doc.vCene ?? []).map((i: { item: string }) => i.item),
        lokalita: doc.lokalita ?? '',
        doprava: doc.doprava ?? '',
        ubytovanie: (doc.ubytovanie ?? []).map((i: { item: string }) => i.item),
        zaPriplatok: (doc.zaPriplatok ?? []).map((i: { item: string }) => i.item),
      },
      hasStredisko: doc.hasStredisko ?? false,
      strediskoName: doc.strediskoName,
      strediskoDescription: doc.strediskoDescription,
      mapCoordinates:
        doc.mapLat != null && doc.mapLng != null
          ? { lat: doc.mapLat, lng: doc.mapLng }
          : undefined,
    },

    section5: {
      dates: (doc.dates ?? []).map((d: {
        start: string
        end: string
        days: number
        originalPrice?: string
        discountedPrice?: string
        registrationId?: string
      }) => ({
        start: d.start,
        end: d.end,
        days: d.days,
        originalPrice: d.originalPrice ?? '',
        discountedPrice: d.discountedPrice ?? d.originalPrice ?? '',
        registrationId: d.registrationId ? Number(d.registrationId) : undefined,
      })),
    },
  }
}

export default async function CampDetailPage({
  params,
}: {
  params: Promise<{ campId: string }>
}) {
  const { campId } = await params

  let campDetails: CampDetailData | null = null

  // 1. Try Payload CMS first
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'camps',
      where: { slug: { equals: campId } },
      limit: 1,
    })
    if (result.docs.length > 0) {
      campDetails = mapPayloadToCampDetails(result.docs[0] as Record<string, any>)
    }
  } catch {
    // Payload unavailable (e.g. no DB connection) — fall through to hardcoded data
  }

  // 2. Fall back to hardcoded data files
  if (!campDetails) {
    campDetails = getCampDetails(campId)
  }

  // 3. 404
  if (!campDetails) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <TopBar />
        <Header />
        <main className="flex-grow flex items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-bombovo-dark mb-6">
              Táto stránka neexistuje
            </h1>
            <Link href="/letne-tabory">
              <button className="px-8 py-4 bg-bombovo-yellow text-bombovo-dark font-bold text-lg rounded-3xl hover:translate-y-0.5 transition-transform duration-150">
                Späť na letné tábory
              </button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return <CampDetailClient campDetails={campDetails} campId={campId} />
}
