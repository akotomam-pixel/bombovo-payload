/**
 * Populates the heroGallery of the "artlantida" camp with art1–art31 media files.
 *
 * Prerequisites:
 *   1. Dev server must be running: npm run dev
 *   2. .env.local must contain PAYLOAD_ADMIN_EMAIL and PAYLOAD_ADMIN_PASSWORD
 *
 * Run: npx tsx scripts/populate-art-gallery.ts
 */

import { config as loadDotenv } from 'dotenv'
import path from 'path'

loadDotenv({ path: path.resolve(process.cwd(), '.env.local') })

const BASE_URL       = process.env.PAYLOAD_URL            ?? 'http://localhost:3000'
const ADMIN_EMAIL    = process.env.PAYLOAD_ADMIN_EMAIL    ?? ''
const ADMIN_PASSWORD = process.env.PAYLOAD_ADMIN_PASSWORD ?? ''

async function login(): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })
  if (!res.ok) throw new Error(`Login failed (${res.status}): ${await res.text()}`)
  const data = await res.json() as { token?: string }
  if (!data.token) throw new Error('Login response did not include a token.')
  console.log('✓ Logged in')
  return data.token
}

async function getArtMedia(token: string): Promise<Array<{ id: string; filename: string }>> {
  // Fetch all media and filter by filename starting with "art" followed by a number
  const res = await fetch(`${BASE_URL}/api/media?limit=100`, {
    headers: { Authorization: `JWT ${token}` },
  })
  if (!res.ok) throw new Error(`Media fetch failed (${res.status}): ${await res.text()}`)
  const data = await res.json() as { docs: Array<{ id: string; filename: string }> }

  const artFiles = data.docs.filter((m) => /^art\d+\./i.test(m.filename ?? ''))

  if (artFiles.length === 0) throw new Error('No media files with names like art1.jpg, art2.jpg, etc. found.')

  // Sort by the number in the filename
  artFiles.sort((a, b) => {
    const numA = parseInt((a.filename ?? '').replace(/\D/g, ''), 10)
    const numB = parseInt((b.filename ?? '').replace(/\D/g, ''), 10)
    return numA - numB
  })

  return artFiles
}

async function getArtlantidaId(token: string): Promise<string> {
  const res = await fetch(
    `${BASE_URL}/api/camps?where[slug][equals]=artlantida&limit=1`,
    { headers: { Authorization: `JWT ${token}` } },
  )
  if (!res.ok) throw new Error(`Camp fetch failed (${res.status}): ${await res.text()}`)
  const data = await res.json() as { docs: Array<{ id: string; name: string }> }
  if (data.docs.length === 0) throw new Error('Camp "artlantida" not found in Payload.')
  console.log(`✓ Found camp: "${data.docs[0].name}" (id: ${data.docs[0].id})`)
  return data.docs[0].id
}

async function updateHeroGallery(token: string, campId: string, heroGallery: Array<{ photo: string }>) {
  const res = await fetch(`${BASE_URL}/api/camps/${campId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify({ heroGallery }),
  })
  if (!res.ok) throw new Error(`Update failed (${res.status}): ${await res.text()}`)
  console.log(`✓ heroGallery updated with ${heroGallery.length} photos.`)
}

async function main() {
  const token     = await login()
  const artFiles  = await getArtMedia(token)

  console.log(`\nFound ${artFiles.length} art media files:`)
  artFiles.forEach((m) => console.log(`  ${m.filename} → id: ${m.id}`))

  const campId    = await getArtlantidaId(token)
  const heroGallery = artFiles.map((m) => ({ photo: m.id }))

  await updateHeroGallery(token, campId, heroGallery)
  console.log('\nDone!')
  process.exit(0)
}

main().catch((err) => {
  console.error('\n✗ Error:', err.message)
  process.exit(1)
})
