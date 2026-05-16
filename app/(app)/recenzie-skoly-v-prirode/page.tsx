import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import RecenzieClient from './RecenzieClient'

export const metadata: Metadata = {
  title: 'Recenzie Školy v Prírode | Bombovo',
  robots: { index: false, follow: false },
}

export default async function RecenzieSkolvVPrirodePage() {
  let strediska: { id: string; name: string }[] = []
  let approvedReviews: {
    teacherName: string
    schoolName: string
    stars: number
    reviewText: string
    q1?: string
    q2?: string
    q3?: string
    q4?: string
    stredisko?: string
    kidCount?: number
    createdAt: string
  }[] = []

  try {
    const payload = await getPayloadClient()

    const [strediskaResult, reviewsResult] = await Promise.all([
      payload.find({ collection: 'strediska', limit: 50, depth: 0 }),
      payload.find({
        collection: 'teacher-reviews',
        where: { status: { equals: 'approved' } },
        limit: 100,
        depth: 0,
        sort: '-createdAt',
      }),
    ])

    strediska = strediskaResult.docs.map((doc: any) => ({
      id: doc.slug ?? String(doc.id),
      name: doc.name ?? '',
    }))

    approvedReviews = reviewsResult.docs.map((doc: any) => ({
      teacherName: doc.teacherName ?? '',
      schoolName: doc.schoolName ?? '',
      stars: doc.stars ?? 5,
      reviewText: doc.reviewText ?? '',
      q1: doc.q1 ?? undefined,
      q2: doc.q2 ?? undefined,
      q3: doc.q3 ?? undefined,
      q4: doc.q4 ?? undefined,
      stredisko: doc.stredisko ?? undefined,
      kidCount: doc.kidCount ?? undefined,
      createdAt: doc.createdAt ?? '',
    }))
  } catch {
    // Payload unavailable — fall back to empty arrays
  }

  return <RecenzieClient strediska={strediska} approvedReviews={approvedReviews} />
}
