/**
 * Migration script — creates all 17 Bombovo camps via Payload REST API.
 *
 * Prerequisites:
 *   1. Dev server must be running: npm run dev
 *   2. .env.local must contain:
 *        PAYLOAD_ADMIN_EMAIL=...
 *        PAYLOAD_ADMIN_PASSWORD=...
 *
 * Run from the project root:
 *   npx tsx scripts/migrate-camps.ts
 *
 * Idempotent — any camp whose slug already exists in Payload is skipped.
 */

import { config as loadDotenv } from 'dotenv'
import path from 'path'

// Pure data imports — no Payload/Next.js involved
import { festAnimatorFestData }               from '../data/camps/fest-animator-fest'
import { olympKempData }                       from '../data/camps/olymp-kemp'
import { tanecnaPlanetaData }                  from '../data/camps/tanecna-planeta'
import { babinecData }                         from '../data/camps/babinec'
import { tajomstvoBasketbalovehoPoharaData }   from '../data/camps/tajomstvo-basketbaloveho-pohara'
import { trhlinaData }                         from '../data/camps/trhlina'
import { readyPlayerOneData }                  from '../data/camps/ready-player-one'
import { vDracejNoreData }                     from '../data/camps/v-dracej-nore'
import { anglickeLetoData }                    from '../data/camps/anglicke-leto'
import { neverfortData }                       from '../data/camps/neverfort'
import { chlapinecData }                       from '../data/camps/chlapinec'
import { artlantidaData }                      from '../data/camps/artlantida'
import { stastnaPlutvaData }                   from '../data/camps/stastna-plutva'
import { kazdyDenNovyZazitokData }             from '../data/camps/kazdy-den-novy-zazitok'
import { zBoduNulaDoBoduStoData }              from '../data/camps/z-bodu-nula-do-bodu-sto'
import { woodkempData }                        from '../data/camps/woodkemp'
import { expectoData }                         from '../data/camps/expecto'
import type { CampDetailData }                 from '../data/camps/types'

loadDotenv({ path: path.resolve(process.cwd(), '.env.local') })
loadDotenv({ path: path.resolve(process.cwd(), '.env') })

const BASE_URL       = process.env.PAYLOAD_URL            ?? 'http://localhost:3000'
const ADMIN_EMAIL    = process.env.PAYLOAD_ADMIN_EMAIL    ?? ''
const ADMIN_PASSWORD = process.env.PAYLOAD_ADMIN_PASSWORD ?? ''

// ── Camp roster — order here = display order (1-indexed) ────────────────────

interface CampEntry {
  slug:      string
  order:     number
  campTypes: string[]
  data:      CampDetailData
}

const CAMPS: CampEntry[] = [
  { order: 1,  slug: 'fest-animator-fest',              campTypes: ['Tínedžerský', 'Akčný'],        data: festAnimatorFestData },
  { order: 2,  slug: 'olymp-kemp',                      campTypes: ['Náučný', 'Dobrodružný'],        data: olympKempData },
  { order: 3,  slug: 'tanecna-planeta',                  campTypes: ['Športový', 'Umelecký'],         data: tanecnaPlanetaData },
  { order: 4,  slug: 'babinec',                          campTypes: ['Unikátny', 'Oddychový'],        data: babinecData },
  { order: 5,  slug: 'tajomstvo-basketbaloveho-pohara',  campTypes: ['Športový', 'Akčný'],            data: tajomstvoBasketbalovehoPoharaData },
  { order: 6,  slug: 'trhlina',                          campTypes: ['Akčný', 'Dobrodružný'],         data: trhlinaData },
  { order: 7,  slug: 'ready-player-one',                 campTypes: ['Akčný', 'Unikátny'],            data: readyPlayerOneData },
  { order: 8,  slug: 'v-dracej-nore',                    campTypes: ['Fantasy', 'Dobrodružný'],       data: vDracejNoreData },
  { order: 9,  slug: 'anglicke-leto',                    campTypes: ['Oddychový', 'Náučný'],          data: anglickeLetoData },
  { order: 10, slug: 'neverfort',                        campTypes: ['Akčný', 'Fantasy'],             data: neverfortData },
  { order: 11, slug: 'chlapinec',                        campTypes: ['Akčný', 'Náučný'],              data: chlapinecData },
  { order: 12, slug: 'artlantida',                       campTypes: ['Umelecký', 'Oddychový'],        data: artlantidaData },
  { order: 13, slug: 'stastna-plutva',                   campTypes: ['Oddychový'],                    data: stastnaPlutvaData },
  { order: 14, slug: 'kazdy-den-novy-zazitok',           campTypes: ['Dobrodružný', 'Umelecký'],      data: kazdyDenNovyZazitokData },
  { order: 15, slug: 'z-bodu-nula-do-bodu-sto',         campTypes: ['Oddychový', 'Unikátny'],        data: zBoduNulaDoBoduStoData },
  { order: 16, slug: 'woodkemp',                         campTypes: ['Akčný', 'Náučný'],              data: woodkempData },
  { order: 17, slug: 'expecto',                          campTypes: ['Dobrodružný', 'Fantasy'],       data: expectoData },
]

// ── REST helpers ─────────────────────────────────────────────────────────────

async function login(): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })
  if (!res.ok) throw new Error(`Login failed (${res.status}): ${await res.text()}`)
  const data = await res.json() as { token?: string }
  if (!data.token) throw new Error('Login response did not include a token.')
  return data.token
}

async function slugExists(token: string, slug: string): Promise<boolean> {
  const url = `${BASE_URL}/api/camps?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`
  const res = await fetch(url, { headers: { Authorization: `JWT ${token}` } })
  if (!res.ok) throw new Error(`Existence check failed (${res.status}): ${await res.text()}`)
  const data = await res.json() as { totalDocs?: number }
  return (data.totalDocs ?? 0) > 0
}

async function createCamp(token: string, body: Record<string, unknown>): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/camps`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body:    JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Create failed (${res.status}): ${await res.text()}`)
  const data = await res.json() as { doc?: { id?: string } }
  return data.doc?.id ?? '(unknown)'
}

// ── Document builder ─────────────────────────────────────────────────────────

function buildDoc(entry: CampEntry): Record<string, unknown> {
  const d = entry.data
  return {
    // Basic
    name:      d.name,
    slug:      entry.slug,
    order:     entry.order,
    campTypes: entry.campTypes,

    // Hero
    headline:          d.headline,
    headlineHighlight: d.headlineHighlight,
    bulletPoints:      d.bulletPoints.map((text) => ({ text })),
    location:          d.location,
    age:               d.age,
    price:             d.price,

    // Section 2
    section2_headline:    d.section2.headline,
    section2_description: d.section2.description.map((p) => ({ paragraph: p })),
    ratings: {
      kreativita:       d.section2.ratings.kreativita,
      mystika:          d.section2.ratings.mystika,
      sebarozvoj:       d.section2.ratings.sebarozvoj,
      pohyb:            d.section2.ratings.pohyb,
      kritickeMyslenie: d.section2.ratings.kritickeMyslenie,
    },

    // Section 3
    section3_headline: d.section3.headline,
    section3_text:     d.section3.text.map((p) => ({ paragraph: p })),
    reviews:           d.section3.reviews.map((r) => ({ text: r.text, author: r.author })),

    // Section 4 — accordion
    vTomtoTaboreZazites: d.section4.details.vTomtoTaboreZazites.map((i) => ({ item: i })),
    vCene:               d.section4.details.vCene.map((i) => ({ item: i })),
    lokalita:            d.section4.details.lokalita,
    doprava:             d.section4.details.doprava,
    ubytovanie:          d.section4.details.ubytovanie.map((i) => ({ item: i })),
    zaPriplatok:         d.section4.details.zaPriplatok.map((i) => ({ item: i })),

    // Section 4b — stredisko
    hasStredisko:         d.section4.hasStredisko ?? false,
    strediskoName:        d.section4.strediskoName,
    strediskoDescription: d.section4.strediskoDescription,
    mapLat:               d.section4.mapCoordinates?.lat,
    mapLng:               d.section4.mapCoordinates?.lng,

    // Section 5 — dates
    dates: d.section5.dates.map((date) => ({
      start:           date.start,
      end:             date.end,
      days:            date.days,
      originalPrice:   date.originalPrice,
      discountedPrice: date.discountedPrice,
      registrationId:  String(date.registrationId ?? ''),
    })),
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error(
      '❌  Missing credentials.\n' +
      '    Set PAYLOAD_ADMIN_EMAIL and PAYLOAD_ADMIN_PASSWORD in .env.local',
    )
    process.exit(1)
  }

  console.log(`Connecting to Payload at ${BASE_URL}…`)
  const token = await login()
  console.log('✅  Authenticated.\n')

  let created = 0
  let skipped = 0

  for (const entry of CAMPS) {
    process.stdout.write(`[${entry.order}/17] ${entry.data.name} (${entry.slug})… `)

    if (await slugExists(token, entry.slug)) {
      console.log('⚠️  already exists — skipped.')
      skipped++
      continue
    }

    const id = await createCamp(token, buildDoc(entry))
    console.log(`✅  created (ID: ${id})`)
    created++
  }

  console.log(`\nDone. Created: ${created}  Skipped: ${skipped}  Total: ${CAMPS.length}`)
}

main().catch((err: unknown) => {
  console.error('\n❌  Migration failed:', err instanceof Error ? err.message : err)
  process.exit(1)
})
