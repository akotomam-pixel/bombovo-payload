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

  // List all media NOT named art1–art31
  const mediaRes = await fetch(`${BASE_URL}/api/media?limit=200`, {
    headers: { Authorization: `JWT ${token}` },
  })
  const media = await mediaRes.json() as { docs: Array<{ id: string; filename: string; url: string }> }

  const nonArt = media.docs.filter((m) => !/^art\d+/i.test(m.filename ?? ''))
  console.log(`\nNon-art media files (${nonArt.length} total):`)
  nonArt.forEach((m) => console.log(`  id:${m.id}  filename:${m.filename}  url:${m.url}`))

  // Also show current artlantida heroGallery
  const campRes = await fetch(`${BASE_URL}/api/camps?where[slug][equals]=artlantida&limit=1&depth=1`, {
    headers: { Authorization: `JWT ${token}` },
  })
  const camp = await campRes.json() as { docs: Array<{ id: string; heroGallery: Array<{ photo: { id: string; filename: string } }> }> }
  console.log(`\nCurrent artlantida heroGallery (${camp.docs[0]?.heroGallery?.length ?? 0} items):`)
  camp.docs[0]?.heroGallery?.forEach((item, i) => {
    console.log(`  [${i}] id:${item.photo?.id}  filename:${item.photo?.filename}`)
  })
}

main().catch((err) => { console.error(err); process.exit(1) }).then(() => process.exit(0))
