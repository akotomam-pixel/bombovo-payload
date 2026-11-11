export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { camps as fallbackCamps } from '@/lib/campsData'
import { getCampOptions, getReviewsPage, type CampOption, type ReviewsPage } from '@/lib/campReviews'
import RecenzieLetneTaboryClient from './RecenzieLetneTaboryClient'

export const metadata: Metadata = {
  title: 'Recenzie | Bombovo Letné Tábory',
  description: 'Čo hovoria taborníci a rodičia o letných táboroch Bombovo.',
}

const emptyPage: ReviewsPage = {
  reviews: [],
  totalCards: 0,
  stats: { total: 0, average: 0, starCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
}

export default async function RecenziePage() {
  // Only the first 15 cards are rendered here; the rest load on click, so the
  // page stays fast however many reviews there are.
  let firstPage = emptyPage
  let campOptions: CampOption[] = []
  let camps: { id: string; name: string }[] = fallbackCamps.map((c) => ({ id: c.id, name: c.name }))

  try {
    const payload = await getPayloadClient()
    const [page, options, campsResult] = await Promise.all([
      getReviewsPage({}),
      getCampOptions(),
      payload.find({ collection: 'camps', limit: 100, sort: 'order', depth: 0 }),
    ])
    firstPage = page
    campOptions = options
    if (campsResult.docs.length > 0) {
      camps = campsResult.docs.map((c: any) => ({ id: String(c.id), name: c.name }))
    }
  } catch (err) {
    console.error('RecenziePage: failed to fetch data', err)
  }

  return <RecenzieLetneTaboryClient firstPage={firstPage} campOptions={campOptions} camps={camps} />
}
