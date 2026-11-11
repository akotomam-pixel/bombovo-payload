/**
 * Imports the Google reviews and the old camp-page quote reviews into
 * "Recenzie letných táborov" (letne-tabory-reviews).
 *
 * Source files (review text is copied exactly as written):
 *   data/reviews-import/google-recenzie.json
 *   data/reviews-import/stare-recenzie-z-boxov.json
 *
 * Safe to run twice: a review that is already there (same externalId) is skipped.
 *
 * Usage:
 *   npx tsx scripts/import-google-reviews.ts                    # dry run, writes nothing
 *   npx tsx scripts/import-google-reviews.ts --write            # saves as "Čaká na schválenie" (hidden)
 *   npx tsx scripts/import-google-reviews.ts --write --approved # saves as visible
 *   npx tsx scripts/import-google-reviews.ts --approve-imported # makes the hidden imported ones visible
 *
 * Needs PAYLOAD_URL, PAYLOAD_ADMIN_EMAIL and PAYLOAD_ADMIN_PASSWORD in .env
 * (PAYLOAD_URL defaults to http://localhost:3000). The site at PAYLOAD_URL must
 * already run the code with the new review fields.
 */

import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env'), quiet: true } as any)

const PAYLOAD_URL = (process.env.PAYLOAD_URL ?? 'http://localhost:3000').replace(/\/$/, '')
const WRITE = process.argv.includes('--write')
const APPROVE_IMPORTED = process.argv.includes('--approve-imported')
const STATUS = process.argv.includes('--approved') ? 'approved' : 'pending'

// Reviewers whose Google name does not say whether they are a kid or a parent.
const KID_NICKNAMES = new Set([30, 54])
// Old camp-page quotes written by kids; the rest are parents.
const KID_QUOTE_AUTHORS = new Set(['Branislav B.', 'Nina M.', 'Sofi Š.', 'Adéla T.', 'Liana S.'])

type GoogleRow = {
  i: number
  id: string
  name: string
  rating: number
  date: string
  text: string | null
  camps: string[]
  placement: Record<string, string>
  role: string
}
type QuoteRow = {
  camp: string | null
  author: string
  text: string
  stars: number
  same_as_google: number | null
  duplicate_on_same_camp: boolean
}

type ReviewDoc = {
  externalId: string
  reviewerName: string
  reviewerType: 'tabornik' | 'rodic'
  campName: string
  secondCampName?: string
  stars: number
  reviewText?: string
  source: 'google' | 'stranka'
  reviewDate?: string
  midList: boolean
  status: string
}

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'data/reviews-import', file), 'utf8'))
}

function textKey(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 40)
}

async function main() {
  const campsRes = await fetch(`${PAYLOAD_URL}/api/camps?limit=100&depth=0`).then((r) => r.json())
  const campNames = new Map<string, string>(campsRes.docs.map((c: any) => [c.slug, c.name]))
  const nameOf = (slug: string) => {
    const name = campNames.get(slug)
    if (!name) throw new Error(`Unknown camp slug: ${slug}`)
    return name
  }

  const docs: ReviewDoc[] = []

  for (const g of readJson<GoogleRow[]>('google-recenzie.json')) {
    if (g.camps.length === 0) throw new Error(`Google review #${g.i} has no camp`)
    const [first, second] = g.camps
    docs.push({
      externalId: `google:${g.id}`,
      reviewerName: g.name,
      reviewerType: g.role === 'dieta' || KID_NICKNAMES.has(g.i) ? 'tabornik' : 'rodic',
      campName: nameOf(first),
      ...(second ? { secondCampName: nameOf(second) } : {}),
      stars: g.rating,
      ...(g.text ? { reviewText: g.text } : {}),
      source: 'google',
      // Noon UTC keeps the same calendar day in Slovak time.
      reviewDate: `${g.date}T12:00:00.000Z`,
      midList: g.placement[first] === 'middle',
      status: STATUS,
    })
  }

  for (const q of readJson<QuoteRow[]>('stare-recenzie-z-boxov.json')) {
    if (!q.camp || q.same_as_google || q.duplicate_on_same_camp) continue
    docs.push({
      externalId: `stranka:${q.camp}:${textKey(q.text)}`,
      reviewerName: q.author,
      reviewerType: KID_QUOTE_AUTHORS.has(q.author) ? 'tabornik' : 'rodic',
      campName: nameOf(q.camp),
      stars: q.stars,
      reviewText: q.text,
      source: 'stranka',
      midList: false,
      status: STATUS,
    })
  }

  const perCamp = new Map<string, number>()
  for (const d of docs) {
    for (const c of [d.campName, d.secondCampName]) if (c) perCamp.set(c, (perCamp.get(c) ?? 0) + 1)
  }
  console.log(`${docs.length} reviews to import (${docs.filter((d) => d.source === 'google').length} Google, ${docs.filter((d) => d.source === 'stranka').length} old page quotes)`)
  console.log(`${docs.filter((d) => !d.reviewText).length} are stars only, ${docs.filter((d) => d.midList).length} mid-list, ${docs.filter((d) => d.secondCampName).length} on two camps`)
  for (const [camp, n] of [...perCamp].sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(3)}  ${camp}`)

  if (!WRITE && !APPROVE_IMPORTED) {
    console.log('\nDry run: nothing was written. Add --write to import.')
    return
  }

  const login = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.PAYLOAD_ADMIN_EMAIL, password: process.env.PAYLOAD_ADMIN_PASSWORD }),
  }).then((r) => r.json())
  if (!login.token) throw new Error('Payload login failed')
  const headers = { Authorization: `JWT ${login.token}`, 'Content-Type': 'application/json' }
  const api = `${PAYLOAD_URL}/api/letne-tabory-reviews`

  let created = 0
  let skipped = 0
  let approved = 0
  for (const d of docs) {
    const found = await fetch(
      `${api}?where[externalId][equals]=${encodeURIComponent(d.externalId)}&limit=1&depth=0`,
      { headers }
    ).then((r) => r.json())
    const existing = found.docs?.[0]

    if (APPROVE_IMPORTED) {
      if (existing && existing.status === 'pending') {
        const res = await fetch(`${api}/${existing.id}`, { method: 'PATCH', headers, body: JSON.stringify({ status: 'approved' }) })
        if (!res.ok) throw new Error(`Approve failed for ${d.externalId}: ${await res.text()}`)
        approved++
      }
      continue
    }

    if (existing) {
      skipped++
      continue
    }
    const res = await fetch(api, { method: 'POST', headers, body: JSON.stringify(d) })
    if (!res.ok) throw new Error(`Create failed for ${d.externalId}: ${await res.text()}`)
    created++
  }

  if (APPROVE_IMPORTED) console.log(`\nMade visible: ${approved}`)
  else console.log(`\nCreated: ${created} (status "${STATUS}"), already there: ${skipped}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
