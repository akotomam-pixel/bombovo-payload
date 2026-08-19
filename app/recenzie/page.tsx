export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { camps as fallbackCamps } from '@/lib/campsData'
import RecenzieLetneTaboryClient, {
  type CampReview,
  type ReviewStats,
} from './RecenzieLetneTaboryClient'

export const metadata: Metadata = {
  title: 'Recenzie | Bombovo Letné Tábory',
  description: 'Čo hovoria taborníci a rodičia o letných táboroch Bombovo.',
}

// How many review cards we actually render on the page. The headline count and
// the star breakdown come from the database totals, not from this slice.
const DISPLAY_LIMIT = 200

export default async function RecenziePage() {
  let reviews: CampReview[] = []
  let camps: { id: string; name: string }[] = fallbackCamps.map((c) => ({ id: c.id, name: c.name }))
  let stats: ReviewStats | null = null

  try {
    const payload = await getPayload({ config })

    const approved = { status: { equals: 'approved' } }

    const [reviewsResult, campsResult, ...starResults] = await Promise.all([
      payload.find({
        collection: 'letne-tabory-reviews',
        where: approved,
        sort: '-createdAt',
        limit: DISPLAY_LIMIT,
      }),
      payload.find({ collection: 'camps', limit: 100, sort: 'order' }),
      // Count-only queries: limit 0 returns totalDocs without loading the docs.
      ...[1, 2, 3, 4, 5].map((s) =>
        payload.find({
          collection: 'letne-tabory-reviews',
          where: { and: [approved, { stars: { equals: s } }] },
          limit: 0,
          depth: 0,
        })
      ),
    ])

    reviews = reviewsResult.docs.map((r: any) => ({
      id: r.id,
      reviewer_name: r.reviewerName,
      reviewer_type: r.reviewerType,
      camp_name: r.campName ?? null,
      stars: r.stars,
      review_text: r.reviewText,
      created_at: r.createdAt,
    }))

    const starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as ReviewStats['starCounts']
    starResults.forEach((res, i) => {
      starCounts[(i + 1) as 1 | 2 | 3 | 4 | 5] = res.totalDocs
    })

    const total = reviewsResult.totalDocs
    const starSum = [1, 2, 3, 4, 5].reduce((sum, s) => sum + s * starCounts[s as 1], 0)

    stats = {
      total,
      average: total > 0 ? starSum / total : 0,
      starCounts,
    }

    if (campsResult.docs.length > 0) {
      camps = campsResult.docs.map((c: any) => ({ id: String(c.id), name: c.name }))
    }
  } catch (err) {
    console.error('RecenziePage: failed to fetch data', err)
  }

  return <RecenzieLetneTaboryClient reviews={reviews} camps={camps} stats={stats} />
}
