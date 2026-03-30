export const revalidate = 60

import { getPayloadClient } from '@/lib/payload'
import { camps as hardcodedCamps, type Camp } from '@/lib/campsData'
import CampsClient from './CampsClient'

interface HeroData {
  headline: string
  body: string
  photos: { url: string }[]
}

const DEFAULT_HERO: HeroData = {
  headline: 'Letné tábory pre deti 2026',
  body: 'Viac ako 26 rokov organizujeme detské letné tábory pre deti od 6 do 17 rokov. Naše letné tábory sa každoročne nesú v duchu zábavy, bezpečia a programu, ktorý nikde inde deti nezažijú. V ponuke máme rôzne tábory, z ktorých sa každý nesie v inej téme. Fantasy, dobrodružné, športové ale aj umelecké tábory. Každý si nájde to svoje.\nMnohé deti, ktoré k nám prídu na tábor ako malé, odchádzajú z ich posledného tábora ako 17-roční len preto, že nechcú odísť. Aj preto máme návratnosť až 86 %. Vyber si letný tábor 2026 na Slovensku, ktorý je pre teba najlepší, a príď k nám zažiť nezabudnuteľné leto.',
  photos: [],
}

// Same age-parsing logic as campsData.ts
function parseAge(ageStr: string): { short: string; range: [number, number] } {
  const match = ageStr.match(/(\d+)\s*[-–]\s*(\d+)/)
  if (match) {
    return {
      short: `${match[1]}-${match[2]} r.`,
      range: [parseInt(match[1]), parseInt(match[2])],
    }
  }
  return { short: ageStr, range: [0, 99] }
}

// Map a single Payload Camps document to the Camp shape used by CampCard / filters
function payloadDocToCamp(doc: Record<string, any>, hardcodedBySlug: Map<string, Camp>): Camp {
  const slug: string = doc.slug ?? ''
  const hardcoded = hardcodedBySlug.get(slug)

  const parsedAge = parseAge(doc.age ?? hardcoded?.age ?? '')
  const campTypes: string[] = Array.isArray(doc.campTypes) ? doc.campTypes : []

  return {
    id: slug,
    name: doc.name ?? hardcoded?.name ?? '',

    // Age — Payload value takes priority; falls back to hardcoded
    age: doc.age ? parsedAge.short : (hardcoded?.age ?? ''),
    ageRange: doc.age ? parsedAge.range : (hardcoded?.ageRange ?? [0, 99]),

    // Types — Payload campTypes field takes priority
    types: campTypes.length > 0 ? campTypes : (hardcoded?.types ?? []),
    displayTypes: campTypes.length > 0 ? campTypes : (hardcoded?.displayTypes ?? []),

    // Price — Payload value takes priority
    price: doc.price ?? hardcoded?.price ?? '',

    // Short description — first bulletPoint, then hardcoded
    description:
      doc.bulletPoints?.[0]?.text ??
      hardcoded?.description ??
      '',

    // Image — Payload cardImage URL takes priority, falls back to hardcoded path
    image:
      (typeof doc.cardImage === 'object' && doc.cardImage !== null
        ? (doc.cardImage as Record<string, any>).url
        : undefined) ??
      hardcoded?.image ??
      '',

    // Date-filter keys — not stored in Payload, always from hardcoded
    dates: hardcoded?.dates ?? [],
  }
}

export default async function LetneTaborePage() {
  // Build a quick lookup map for hardcoded camps
  const hardcodedBySlug = new Map<string, Camp>(
    hardcodedCamps.map((c) => [c.id, c]),
  )

  let mergedCamps: Camp[] = [...hardcodedCamps]
  let heroData: HeroData = DEFAULT_HERO

  // Fetch from Payload — gracefully skip if DB is not connected
  try {
    const payload = await getPayloadClient()

    // Fetch camps and hero global in parallel
    const [result, hlavna] = await Promise.all([
      payload.find({
        collection: 'camps',
        limit: 200,
        depth: 1,
        sort: 'order',
      }),
      payload.findGlobal({ slug: 'letne-tabory-hlavna', depth: 1 }),
    ])

    if (result.docs.length > 0) {
      const payloadSlugs = new Set<string>()
      const payloadCamps = result.docs.map((doc) => {
        const camp = payloadDocToCamp(doc as Record<string, any>, hardcodedBySlug)
        payloadSlugs.add(camp.id)
        return camp
      })
      const remainingHardcoded = hardcodedCamps.filter((c) => !payloadSlugs.has(c.id))
      mergedCamps = [...payloadCamps, ...remainingHardcoded]
    }

    // Build hero data from the global
    const h = hlavna as Record<string, any>
    const photos: { url: string }[] = []
    for (const key of ['photo1', 'photo2', 'photo3', 'photo4', 'photo5', 'photo6']) {
      const p = h[key]
      if (p && typeof p === 'object' && p.url) photos.push({ url: p.url })
    }
    heroData = {
      headline: h.headline || DEFAULT_HERO.headline,
      body: h.body || DEFAULT_HERO.body,
      photos: photos.length > 0 ? photos : DEFAULT_HERO.photos,
    }
  } catch (e) {
    console.error('[letne-tabory] Payload fetch error:', e)
  }

  return <CampsClient camps={mergedCamps} heroData={heroData} />
}
