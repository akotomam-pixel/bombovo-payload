// Order of the review cards on /recenzie. Pure functions, no database access.

export type ReviewSort = 'recommended' | 'newest'

export type OrderableReview = {
  id: number
  reviewer_type: 'tabornik' | 'rodic'
  camp_name: string | null
  second_camp_name?: string | null
  stars: number
  review_text: string | null
  /** Day the review was written; null when unknown. */
  date: string | null
  mid_list?: boolean
}

const LONG_TEXT = 400
const FIRST_SCREENS = 30
const DAY_MS = 24 * 60 * 60 * 1000

function textLength(r: OrderableReview) {
  return (r.review_text ?? '').trim().length
}

export function hasText(r: OrderableReview) {
  return textLength(r) > 0
}

/** Reviews that must never sit near the top: low stars, flagged ones, and a
 *  two-camp review when it is listed under its second camp. */
function isMidList(r: OrderableReview, camp?: string) {
  if (r.mid_list || r.stars < 5) return true
  return Boolean(camp && r.camp_name !== camp && r.second_camp_name === camp)
}

function newestTime(reviews: OrderableReview[]) {
  let max = 0
  for (const r of reviews) {
    const t = r.date ? Date.parse(r.date) : NaN
    if (!Number.isNaN(t) && t > max) max = t
  }
  return max
}

/**
 * "Odporúčané": detailed reviews first, parents and kids taking turns, camps
 * taking turns, long and short texts alternating. Low-star and flagged reviews
 * are spread through the middle of the list. The result is the same on every
 * call, so "load more" always continues from the same place.
 */
export function orderRecommended<T extends OrderableReview>(
  reviews: T[],
  opts: { camp?: string; firstType?: 'tabornik' | 'rodic' } = {}
): T[] {
  const { camp, firstType = 'rodic' } = opts
  const cards = reviews.filter(hasText)
  const newest = newestTime(cards)

  const quality = (r: T) => {
    const t = r.date ? Date.parse(r.date) : NaN
    const recent = !Number.isNaN(t) && newest - t <= 365 * DAY_MS
    return Math.min(textLength(r), 500) + (recent ? 150 : 0)
  }

  const pool = cards.filter((r) => !isMidList(r, camp)).map((r) => ({ r, q: quality(r) }))
  const top: T[] = []
  let prev: T | null = null

  while (pool.length > 0) {
    const wantedType = prev ? (prev.reviewer_type === 'rodic' ? 'tabornik' : 'rodic') : firstType
    let best = 0
    let bestScore = -Infinity
    for (let i = 0; i < pool.length; i++) {
      const { r, q } = pool[i]
      let score = q
      if (r.reviewer_type !== wantedType) score -= 250
      if (prev) {
        // On the all-camps list, never two of the same camp in a row early on.
        if (!camp && r.camp_name && r.camp_name === prev.camp_name) {
          score -= top.length < FIRST_SCREENS ? 10000 : 200
        }
        if (textLength(prev) > LONG_TEXT && textLength(r) > LONG_TEXT) score -= 200
      }
      if (score > bestScore || (score === bestScore && r.id < pool[best].r.id)) {
        best = i
        bestScore = score
      }
    }
    prev = pool[best].r
    top.push(prev)
    pool.splice(best, 1)
  }

  const mids = cards
    .filter((r) => isMidList(r, camp))
    .sort((a, b) => quality(b) - quality(a) || a.id - b.id)
  if (mids.length === 0) return top

  // Spread the mid-list reviews evenly between 40 % and 60 % of the way down.
  const n = top.length
  const start = Math.max(Math.floor(n * 0.4), Math.min(n, 3))
  const end = Math.max(start, Math.floor(n * 0.6))
  const span = end - start
  const result = top.slice()
  mids.forEach((m, k) => {
    const at = start + Math.round(((k + 0.5) * span) / mids.length) + k
    result.splice(Math.min(at, result.length), 0, m)
  })
  return result
}

/** "Najnovšie": newest first; reviews without a known date go last. */
export function orderNewest<T extends OrderableReview>(reviews: T[]): T[] {
  return reviews.filter(hasText).sort((a, b) => {
    const ta = a.date ? Date.parse(a.date) : -Infinity
    const tb = b.date ? Date.parse(b.date) : -Infinity
    return tb - ta || b.id - a.id
  })
}

export function orderReviews<T extends OrderableReview>(
  reviews: T[],
  sort: ReviewSort,
  camp?: string
): T[] {
  return sort === 'newest' ? orderNewest(reviews) : orderRecommended(reviews, { camp })
}
