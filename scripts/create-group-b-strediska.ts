/**
 * Creates the 3 new Group B strediská rows in Payload (Hotel Osrblie, Penzión
 * Palušák, Penzión Lagáň) — brand-new strediská with no existing Payload row.
 *
 * Same REST-login pattern as scripts/migrate-svp.ts. Idempotent — any slug
 * that already exists is skipped, not overwritten.
 *
 * `cardImage` reuses Lomy's own real, already-uploaded media doc (id 466,
 * its cardImage) as a placeholder — no real photography exists yet for these
 * three. Swap for a real photo per stredisko once available.
 *
 * Run from the project root (dev server must be running):
 *   npx tsx scripts/create-group-b-strediska.ts
 */

import { config as loadDotenv } from 'dotenv'
import path from 'path'

loadDotenv({ path: path.resolve(process.cwd(), '.env.local') })
loadDotenv({ path: path.resolve(process.cwd(), '.env') })

const BASE_URL       = process.env.PAYLOAD_URL            ?? 'http://localhost:3000'
const ADMIN_EMAIL    = process.env.PAYLOAD_ADMIN_EMAIL    ?? ''
const ADMIN_PASSWORD = process.env.PAYLOAD_ADMIN_PASSWORD ?? ''

// Lomy's own cardImage media doc — reused as a placeholder for these 3 new
// rows, so the grid card has a real, already-uploaded photo rather than a
// broken or empty image slot.
const PLACEHOLDER_MEDIA_ID = 466

const ROWS: Array<{ slug: string; name: string; price: string }> = [
  { slug: 'hotel-osrblie',   name: 'Hotel Osrblie',    price: '205 €' },
  { slug: 'penzion-palusak', name: 'Penzión Palušák',  price: '190 €' },
  { slug: 'penzion-lagan',   name: 'Penzión Lagáň',    price: '195 €' },
]

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
  const url = `${BASE_URL}/api/strediska?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`
  const res = await fetch(url, { headers: { Authorization: `JWT ${token}` } })
  if (!res.ok) throw new Error(`Existence check failed (${res.status}): ${await res.text()}`)
  const data = await res.json() as { totalDocs?: number }
  return (data.totalDocs ?? 0) > 0
}

async function createStredisko(token: string, body: Record<string, unknown>): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/strediska`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body:    JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Create stredisko failed (${res.status}): ${await res.text()}`)
  const data = await res.json() as { doc?: { id?: string } }
  return data.doc?.id ?? '(unknown)'
}

async function main() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Missing PAYLOAD_ADMIN_EMAIL / PAYLOAD_ADMIN_PASSWORD in .env.local')
    process.exit(1)
  }

  console.log(`Connecting to Payload at ${BASE_URL}…`)
  const token = await login()

  for (const row of ROWS) {
    if (await slugExists(token, row.slug)) {
      console.log(`⏭  ${row.slug} already exists — skipping`)
      continue
    }

    const id = await createStredisko(token, {
      name:      row.name,
      slug:      row.slug,
      price:     row.price,
      vypredane: false,
      cardImage: PLACEHOLDER_MEDIA_ID,
    })
    console.log(`✅ Created ${row.slug} (id ${id})`)
  }

  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
