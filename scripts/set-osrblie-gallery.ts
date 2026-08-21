/**
 * One-off: writes the 26 real Hotel Osrblie photos Matej uploaded to Payload
 * into the hotel-osrblie stredisko's heroGallery field, in order.
 *
 * The upload batch mixes two filename styles ("p5.jpeg" vs bare "15.jpg"),
 * and is missing a "p10"/"10.jpg" while having an extra "27.jpg" beyond the
 * stated 1-26 range — exactly one gap and one excess file, so "27.jpg" is
 * treated as position 10 (same kind of off-by-one naming slip as Palušák's
 * p28 -> p29).
 *
 * Run from the project root (dev server must be running):
 *   npx tsx scripts/set-osrblie-gallery.ts
 */

import { config as loadDotenv } from 'dotenv'
import path from 'path'

loadDotenv({ path: path.resolve(process.cwd(), '.env.local') })
loadDotenv({ path: path.resolve(process.cwd(), '.env') })

const BASE_URL       = process.env.PAYLOAD_URL            ?? 'http://localhost:3000'
const ADMIN_EMAIL    = process.env.PAYLOAD_ADMIN_EMAIL    ?? ''
const ADMIN_PASSWORD = process.env.PAYLOAD_ADMIN_PASSWORD ?? ''

const PHOTO_IDS = [
  709, // 1  p1-uvodnaphoto.jpg
  702, // 2  p2.webp
  703, // 3  p3-2.jpg
  718, // 4  p4-2.jpg
  701, // 5  p5.jpeg
  704, // 6  p6-2.jpg
  722, // 7  p7-2.jpg
  706, // 8  p8-2.jpg
  710, // 9  p9-2.jpg
  719, // 10 27.jpg — treated as the missing p10 (see file header)
  715, // 11 p11-2.jpg
  716, // 12 p12-2.jpg
  714, // 13 p13-2.jpg
  717, // 14 p14-2.jpg
  711, // 15 15.jpg
  707, // 16 p16-2.jpg
  725, // 17 17.jpg
  713, // 18 p18-2.jpg
  708, // 19 p19-1.jpg
  705, // 20 p20-1.jpg
  721, // 21 p21-1.jpg
  712, // 22 p22-1.jpg
  726, // 23 p23-1.jpg
  720, // 24 p24-1.jpg
  723, // 25 p25-1.jpg
  724, // 26 26.jpg
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
    `${BASE_URL}/api/strediska?where[slug][equals]=hotel-osrblie&limit=1`,
    { headers: { Authorization: `JWT ${token}` } },
  )
  if (!findRes.ok) throw new Error(`Lookup failed (${findRes.status}): ${await findRes.text()}`)
  const findData = await findRes.json() as { docs?: Array<{ id: string | number }> }
  const doc = findData.docs?.[0]
  if (!doc) throw new Error('hotel-osrblie not found in strediska collection')

  const patchRes = await fetch(`${BASE_URL}/api/strediska/${doc.id}`, {
    method:  'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body:    JSON.stringify({
      heroGallery: PHOTO_IDS.map((photo) => ({ photo })),
    }),
  })
  if (!patchRes.ok) throw new Error(`Update failed (${patchRes.status}): ${await patchRes.text()}`)

  console.log(`✅ Set ${PHOTO_IDS.length} photos on hotel-osrblie (doc id ${doc.id})`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
