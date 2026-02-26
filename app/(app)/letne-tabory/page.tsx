export const dynamic = 'force-dynamic'

import { getPayloadClient } from '@/lib/payload'
import { camps as hardcodedCamps, type Camp } from '@/lib/campsData'
import CampsClient from './CampsClient'

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

  // Fetch from Payload — gracefully skip if DB is not connected
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'camps',
      limit: 200,
      depth: 1, // needed to populate cardImage and get its url
    })

    if (result.docs.length > 0) {
      // Track which slugs Payload returned so we can keep the rest from hardcoded
      const payloadSlugs = new Set<string>()

      const payloadCamps = result.docs.map((doc) => {
        const camp = payloadDocToCamp(doc as Record<string, any>, hardcodedBySlug)
        payloadSlugs.add(camp.id)
        return camp
      })

      // Payload camps first, then hardcoded camps that aren't in Payload yet
      const remainingHardcoded = hardcodedCamps.filter((c) => !payloadSlugs.has(c.id))
      mergedCamps = [...payloadCamps, ...remainingHardcoded]
    }
  } catch {
    // Payload unavailable — fall through and use all hardcoded camps
  }

  return <CampsClient camps={mergedCamps} />
}
