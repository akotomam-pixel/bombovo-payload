/**
 * One-off: writes the 18 real Penzión Lagáň photos Matej uploaded to Payload
 * (media filenames p1-uvodnaphoto.webp through p18.jpg) into the
 * penzion-lagan stredisko's heroGallery field, in numeric order.
 *
 * Run from the project root (dev server must be running):
 *   npx tsx scripts/set-lagan-gallery.ts
 */

import { config as loadDotenv } from 'dotenv'
import path from 'path'

loadDotenv({ path: path.resolve(process.cwd(), '.env.local') })
loadDotenv({ path: path.resolve(process.cwd(), '.env') })

const BASE_URL       = process.env.PAYLOAD_URL            ?? 'http://localhost:3000'
const ADMIN_EMAIL    = process.env.PAYLOAD_ADMIN_EMAIL    ?? ''
const ADMIN_PASSWORD = process.env.PAYLOAD_ADMIN_PASSWORD ?? ''

// p1-uvodnaphoto.webp .. p18.jpg, in numeric order, resolved from filenames.
const PHOTO_IDS = [656, 671, 666, 672, 657, 661, 655, 665, 668, 667, 662, 664, 670, 669, 658, 659, 660, 663]

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

async function main() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Missing PAYLOAD_ADMIN_EMAIL / PAYLOAD_ADMIN_PASSWORD in .env.local')
    process.exit(1)
  }

  const token = await login()

  const findRes = await fetch(
    `${BASE_URL}/api/strediska?where[slug][equals]=penzion-lagan&limit=1`,
    { headers: { Authorization: `JWT ${token}` } },
  )
  if (!findRes.ok) throw new Error(`Lookup failed (${findRes.status}): ${await findRes.text()}`)
  const findData = await findRes.json() as { docs?: Array<{ id: string | number }> }
  const doc = findData.docs?.[0]
  if (!doc) throw new Error('penzion-lagan not found in strediska collection')

  const patchRes = await fetch(`${BASE_URL}/api/strediska/${doc.id}`, {
    method:  'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body:    JSON.stringify({
      heroGallery: PHOTO_IDS.map((photo) => ({ photo })),
    }),
  })
  if (!patchRes.ok) throw new Error(`Update failed (${patchRes.status}): ${await patchRes.text()}`)

  console.log(`✅ Set ${PHOTO_IDS.length} photos on penzion-lagan (doc id ${doc.id})`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
