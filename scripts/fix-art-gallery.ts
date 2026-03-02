/**
 * Restores Art.JPG as the first photo in the artlantida heroGallery,
 * followed by art2–art31 in order.
 */
import { config as loadDotenv } from 'dotenv'
import path from 'path'

loadDotenv({ path: path.resolve(process.cwd(), '.env.local') })

const BASE_URL    = process.env.PAYLOAD_URL            ?? 'http://localhost:3000'
const ADMIN_EMAIL = process.env.PAYLOAD_ADMIN_EMAIL    ?? ''
const ADMIN_PASS  = process.env.PAYLOAD_ADMIN_PASSWORD ?? ''

async function main() {
  const loginRes = await fetch(`${BASE_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASS }),
  })
  const { token } = await loginRes.json() as { token: string }
  console.log('✓ Logged in')

  // Get artlantida camp
  const campRes = await fetch(
    `${BASE_URL}/api/camps?where[slug][equals]=artlantida&limit=1&depth=1`,
    { headers: { Authorization: `JWT ${token}` } },
  )
  const campData = await campRes.json() as { docs: Array<{ id: string; heroGallery: Array<{ photo: { id: string; filename: string } }> }> }
  const camp = campData.docs[0]
  console.log(`✓ Found camp id: ${camp.id}`)

  // Build new heroGallery: Art.JPG (id:70) first, then the existing art2–art31 entries
  const originalHeroId = 70 // Art.JPG
  const existingArtEntries = camp.heroGallery.map((item) => ({ photo: item.photo.id }))

  const heroGallery = [
    { photo: originalHeroId },
    ...existingArtEntries,
  ]

  const updateRes = await fetch(`${BASE_URL}/api/camps/${camp.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify({ heroGallery }),
  })

  if (!updateRes.ok) throw new Error(`Update failed (${updateRes.status}): ${await updateRes.text()}`)

  console.log(`✓ heroGallery updated — Art.JPG is now first, followed by ${existingArtEntries.length} art photos.`)
  console.log(`  Total: ${heroGallery.length} photos`)
}

main().catch((err) => { console.error('✗', err.message); process.exit(1) }).then(() => process.exit(0))
