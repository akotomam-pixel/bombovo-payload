// Server-side reading of the summer camp reviews for /recenzie:
// loads all approved reviews once a minute, then answers "which 15 cards come
// next" for a camp filter and sort order.

import { getPayloadClient } from '@/lib/payload'
import { orderReviews, type OrderableReview, type ReviewSort } from '@/lib/reviewOrder'

export type CampReview = OrderableReview & {
  reviewer_name: string
  source: string
}

export type ReviewStats = {
  total: number
  average: number
  starCounts: Record<1 | 2 | 3 | 4 | 5, number>
}

export type ReviewsPage = {
  reviews: CampReview[]
  /** Number of review cards (reviews with text) in this view. */
  totalCards: number
  stats: ReviewStats
}

export type CampOption = { name: string; count: number }

export const REVIEWS_PAGE_SIZE = 15
const CACHE_MS = 60 * 1000

type Cache = {
  at: number
  all: CampReview[]
  ordered: Map<string, CampReview[]>
}

const globalForReviews = global as typeof global & { campReviewsCache?: Cache }

async function loadAll(): Promise<Cache> {
  const cached = globalForReviews.campReviewsCache
  if (cached && Date.now() - cached.at < CACHE_MS) return cached

  const payload = await getPayloadClient()
  const [reviewsResult, campsResult] = await Promise.all([
    payload.find({
      collection: 'letne-tabory-reviews',
      where: { status: { equals: 'approved' } },
      sort: '-createdAt',
      limit: 5000,
      depth: 0,
    }),
    payload.find({ collection: 'camps', limit: 100, depth: 0 }),
  ])

  // The same camp was saved with different capital letters over the years
  // ("FEST Animátor Fest" / "Fest animátor fest"); show it under one name.
  const official = new Map<string, string>()
  for (const c of campsResult.docs as any[]) official.set(String(c.name).toLowerCase(), c.name)
  const campName = (name?: string | null) => {
    const trimmed = name?.trim()
    if (!trimmed) return null
    return official.get(trimmed.toLowerCase()) ?? trimmed
  }

  const all: CampReview[] = (reviewsResult.docs as any[]).map((r) => {
    const source = r.source || 'web'
    return {
      id: r.id,
      reviewer_name: r.reviewerName,
      reviewer_type: r.reviewerType,
      camp_name: campName(r.campName),
      second_camp_name: campName(r.secondCampName),
      stars: r.stars,
      review_text: r.reviewText ?? null,
      // Old reviews copied from the camp pages have no known date.
      date: r.reviewDate ?? (source === 'stranka' ? null : r.createdAt),
      mid_list: Boolean(r.midList),
      source,
    }
  })

  const cache: Cache = { at: Date.now(), all, ordered: new Map() }
  globalForReviews.campReviewsCache = cache
  return cache
}

function inCamp(r: CampReview, camp: string) {
  return r.camp_name === camp || r.second_camp_name === camp
}

function statsFor(reviews: CampReview[]): ReviewStats {
  const starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as ReviewStats['starCounts']
  let sum = 0
  for (const r of reviews) {
    if (r.stars >= 1 && r.stars <= 5) {
      starCounts[r.stars as 1 | 2 | 3 | 4 | 5] += 1
      sum += r.stars
    }
  }
  const total = reviews.length
  return { total, average: total > 0 ? sum / total : 0, starCounts }
}

export async function getReviewsPage(opts: {
  camp?: string
  sort?: ReviewSort
  offset?: number
  limit?: number
}): Promise<ReviewsPage> {
  const camp = opts.camp?.trim() || undefined
  const sort: ReviewSort = opts.sort === 'newest' ? 'newest' : 'recommended'
  const offset = Math.max(0, Math.floor(opts.offset ?? 0))
  const limit = Math.min(Math.max(1, Math.floor(opts.limit ?? REVIEWS_PAGE_SIZE)), 30)

  const cache = await loadAll()
  const inView = camp ? cache.all.filter((r) => inCamp(r, camp)) : cache.all

  const key = `${sort}|${camp ?? ''}`
  let ordered = cache.ordered.get(key)
  if (!ordered) {
    ordered = orderReviews(inView, sort, camp)
    cache.ordered.set(key, ordered)
  }

  return {
    reviews: ordered.slice(offset, offset + limit),
    totalCards: ordered.length,
    stats: statsFor(inView),
  }
}

/** Camps for the filter dropdown, with how many reviews each has. */
export async function getCampOptions(): Promise<CampOption[]> {
  const { all } = await loadAll()
  const counts = new Map<string, number>()
  for (const r of all) {
    for (const name of new Set([r.camp_name, r.second_camp_name])) {
      if (name) counts.set(name, (counts.get(name) ?? 0) + 1)
    }
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}
