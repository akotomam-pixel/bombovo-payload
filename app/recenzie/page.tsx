export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import RecenzieLetneTaboryClient, { type CampReview } from './RecenzieLetneTaboryClient'

export const metadata: Metadata = {
  title: 'Recenzie | Bombovo Letné Tábory',
  description: 'Čo hovoria taborníci a rodičia o letných táboroch Bombovo.',
}

export default async function RecenziePage() {
  let reviews: CampReview[] = []
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'letne-tabory-reviews',
      where: { status: { equals: 'approved' } },
      sort: '-createdAt',
      limit: 200,
    })
    reviews = result.docs.map((r: any) => ({
      id: r.id,
      reviewer_name: r.reviewerName,
      reviewer_type: r.reviewerType,
      camp_name: r.campName ?? null,
      stars: r.stars,
      review_text: r.reviewText,
      created_at: r.createdAt,
    }))
  } catch (err) {
    console.error('RecenziePage: failed to fetch reviews', err)
  }
  return <RecenzieLetneTaboryClient reviews={reviews} />
}
