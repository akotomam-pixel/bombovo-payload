export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getAllReviews } from '@/lib/reviews-db'
import RecenzieLetneTaboryClient from './RecenzieLetneTaboryClient'

export const metadata: Metadata = {
  title: 'Recenzie | Bombovo Letné Tábory',
  description: 'Čo hovoria taborníci a rodičia o letných táboroch Bombovo.',
}

export default async function RecenziePage() {
  let reviews: Awaited<ReturnType<typeof getAllReviews>> = []
  try {
    reviews = await getAllReviews()
  } catch {
    // DB unavailable — show empty state
  }
  return <RecenzieLetneTaboryClient reviews={reviews} />
}
