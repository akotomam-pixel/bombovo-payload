export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { camps as fallbackCamps } from '@/lib/campsData'
import RecenzieLetneTaboryClient, { type CampReview } from './RecenzieLetneTaboryClient'

export const metadata: Metadata = {
  title: 'Recenzie | Bombovo Letné Tábory',
  description: 'Čo hovoria taborníci a rodičia o letných táboroch Bombovo.',
}

export default async function RecenziePage() {
  let reviews: CampReview[] = []
  let camps: { id: string; name: string }[] = fallbackCamps.map((c) => ({ id: c.id, name: c.name }))

  try {
    const payload = await getPayload({ config })

    const [reviewsResult, campsResult] = await Promise.all([
      payload.find({
        collection: 'letne-tabory-reviews',
        where: { status: { equals: 'approved' } },
        sort: '-createdAt',
        limit: 200,
      }),
      payload.find({ collection: 'camps', limit: 100, sort: 'order' }),
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

    if (campsResult.docs.length > 0) {
      camps = campsResult.docs.map((c: any) => ({ id: String(c.id), name: c.name }))
    }
  } catch (err) {
    console.error('RecenziePage: failed to fetch data', err)
  }

  return <RecenzieLetneTaboryClient reviews={reviews} camps={camps} />
}
