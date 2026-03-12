/**
 * Finds already-uploaded media files by filename and assigns them to the
 * correct fields in the Homepage global.
 *
 * Run: npx tsx scripts/assign-homepage-media.ts
 */

import { config as loadDotenv } from 'dotenv'
import path from 'path'

loadDotenv({ path: path.resolve(process.cwd(), '.env.local') })

const BASE_URL = process.env.PAYLOAD_URL || 'http://localhost:3000'
const EMAIL    = process.env.PAYLOAD_ADMIN_EMAIL!
const PASSWORD = process.env.PAYLOAD_ADMIN_PASSWORD!

async function login(): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  const data = await res.json() as any
  if (!data.token) throw new Error(`Login failed: ${JSON.stringify(data)}`)
  console.log('✅ Logged in.')
  return data.token
}

async function getAllMedia(token: string): Promise<any[]> {
  const res = await fetch(`${BASE_URL}/api/media?limit=200`, {
    headers: { Authorization: `JWT ${token}` },
  })
  const data = await res.json() as any
  return data.docs || []
}

function findByFilename(media: any[], filename: string): string | null {
  // case-insensitive match
  const found = media.find(
    (m) => m.filename?.toLowerCase() === filename.toLowerCase()
  )
  if (!found) {
    console.warn(`  ⚠️  Not found in media: ${filename}`)
    return null
  }
  console.log(`  ✅ Found: ${filename} → ${found.id}`)
  return found.id
}

async function assignMedia(token: string): Promise<void> {
  const media = await getAllMedia(token)
  console.log(`\nFound ${media.length} media files total.\n`)

  // ─── Resolve IDs ──────────────────────────────────────────────────────────
  const icon1  = findByFilename(media, 'hmmicon1.jpg')
  const icon2  = findByFilename(media, 'hmmicon2.jpg')
  const icon3  = findByFilename(media, 'hmmicon3.jpg')

  const review1 = findByFilename(media, 'Review1.JPG')
  const review2 = findByFilename(media, 'review2.JPG')
  const review3 = findByFilename(media, 'review3.JPG')

  const reason1 = findByFilename(media, 'Secio3.1.JPG')
  const reason2 = findByFilename(media, 'secion3.2.JPG')
  const reason3 = findByFilename(media, 'Secion3.3.JPG')
  const reason4 = findByFilename(media, 'Secion3.4.JPG')

  // ─── Fetch current homepage global to merge into it ───────────────────────
  const currentRes = await fetch(`${BASE_URL}/api/globals/homepage`, {
    headers: { Authorization: `JWT ${token}` },
  })
  const current = await currentRes.json() as any

  // ─── Build the update payload ──────────────────────────────────────────────
  const update: any = {}

  // Stats icons
  if (current.stats?.length === 3) {
    update.stats = [
      { ...current.stats[0], icon: icon1 },
      { ...current.stats[1], icon: icon2 },
      { ...current.stats[2], icon: icon3 },
    ]
  }

  // Review photos
  if (current.reviews?.length === 3) {
    update.reviews = [
      { ...current.reviews[0], photo: review1 },
      { ...current.reviews[1], photo: review2 },
      { ...current.reviews[2], photo: review3 },
    ]
  }

  // Reason photos
  if (current.reasons?.length === 4) {
    update.reasons = [
      { ...current.reasons[0], photo: reason1 },
      { ...current.reasons[1], photo: reason2 },
      { ...current.reasons[2], photo: reason3 },
      { ...current.reasons[3], photo: reason4 },
    ]
  }

  // ─── Send update ──────────────────────────────────────────────────────────
  const res = await fetch(`${BASE_URL}/api/globals/homepage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify(update),
  })
  const data = await res.json() as any
  if (data.errors) {
    console.error('\n❌ Failed:', JSON.stringify(data.errors, null, 2))
  } else {
    console.log('\n✅ All media assigned to Homepage global successfully!')
    console.log('\nStill needs manual assignment in admin:')
    console.log('  • Featured Camps  → Tanečná Planéta, Olymp Kemp, V Dračej Nore')
    console.log('  • Featured Školy  → Stred Európy Krahule, Penzión Roháčan, Penzión Sabina')
    console.log('  • Giveaway Camps  → pick from dropdown in admin')
  }
}

async function main() {
  const token = await login()
  await assignMedia(token)
  console.log('\nDone! Open /admin/globals/homepage to verify.')
}

main().catch((err: unknown) => {
  console.error('Error:', err)
  process.exit(1)
})
