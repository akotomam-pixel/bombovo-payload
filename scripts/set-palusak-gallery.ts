/**
 * One-off: writes the 28 real Penzión Palušák photos Matej uploaded to
 * Payload (media filenames p1uodnaphoto.jpg .. p27.jpg, then p29.jpg) into
 * the penzion-palusak stredisko's heroGallery field, in order.
 *
 * Note: the 28th and last file is named "p29.jpg" — there is no "p28.jpg" in
 * the upload, and this is the only file after p27, so it's treated as
 * position 28 (the count matches: exactly 28 files total, numbered 1-27
 * then a naming skip straight to 29).
 *
 * Run from the project root (dev server must be running):
 *   npx tsx scripts/set-palusak-gallery.ts
 */

import { config as loadDotenv } from 'dotenv'
import path from 'path'

loadDotenv({ path: path.resolve(process.cwd(), '.env.local') })
loadDotenv({ path: path.resolve(process.cwd(), '.env') })

const BASE_URL       = process.env.PAYLOAD_URL            ?? 'http://localhost:3000'
const ADMIN_EMAIL    = process.env.PAYLOAD_ADMIN_EMAIL    ?? ''
const ADMIN_PASSWORD = process.env.PAYLOAD_ADMIN_PASSWORD ?? ''

const PHOTO_IDS = [
  700, 673, 674, 675, 676, 677, 678, 679, 680, 681, 682, 683, 684, 685,
  686, 687, 688, 689, 690, 691, 692, 693, 694, 695, 696, 697, 698, 699,
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

async function main() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Missing PAYLOAD_ADMIN_EMAIL / PAYLOAD_ADMIN_PASSWORD in .env.local')
    process.exit(1)
  }

  const token = await login()

  const findRes = await fetch(
    `${BASE_URL}/api/strediska?where[slug][equals]=penzion-palusak&limit=1`,
    { headers: { Authorization: `JWT ${token}` } },
  )
  if (!findRes.ok) throw new Error(`Lookup failed (${findRes.status}): ${await findRes.text()}`)
  const findData = await findRes.json() as { docs?: Array<{ id: string | number }> }
  const doc = findData.docs?.[0]
  if (!doc) throw new Error('penzion-palusak not found in strediska collection')

  const patchRes = await fetch(`${BASE_URL}/api/strediska/${doc.id}`, {
    method:  'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body:    JSON.stringify({
      heroGallery: PHOTO_IDS.map((photo) => ({ photo })),
    }),
  })
  if (!patchRes.ok) throw new Error(`Update failed (${patchRes.status}): ${await patchRes.text()}`)

  console.log(`✅ Set ${PHOTO_IDS.length} photos on penzion-palusak (doc id ${doc.id})`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
