import { config as loadDotenv } from 'dotenv'
import path from 'path'

loadDotenv({ path: path.resolve(process.cwd(), '.env.local') })

const BASE_URL = process.env.PAYLOAD_URL ?? 'http://localhost:3000'
const ADMIN_EMAIL = process.env.PAYLOAD_ADMIN_EMAIL ?? ''
const ADMIN_PASS = process.env.PAYLOAD_ADMIN_PASSWORD ?? ''

const STREDISKO_SLUG = 'hotel-zuna'
const FROM = 1
const TO = 17

type MediaDoc = { id: number; filename: string; createdAt?: string }

async function login(): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASS }),
  })
  if (!res.ok) throw new Error(`Login failed (${res.status}): ${await res.text()}`)
  const data = (await res.json()) as { token?: string }
  if (!data.token) throw new Error('No token in login response')
  return data.token
}

async function getAllMedia(token: string): Promise<MediaDoc[]> {
  let all: MediaDoc[] = []
  let page = 1
  while (true) {
    const res = await fetch(`${BASE_URL}/api/media?limit=100&page=${page}&depth=0`, {
      headers: { Authorization: `JWT ${token}` },
    })
    if (!res.ok) throw new Error(`Media fetch failed (${res.status}): ${await res.text()}`)
    const data = (await res.json()) as { docs: MediaDoc[]; hasNextPage?: boolean }
    all = all.concat(data.docs)
    if (!data.hasNextPage) break
    page++
  }
  return all
}

async function getStredisko(
  token: string,
  slug: string,
): Promise<{ id: number; heroGallery?: Array<{ photo: { id: number; filename: string } }> }> {
  const res = await fetch(
    `${BASE_URL}/api/strediska?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=1`,
    { headers: { Authorization: `JWT ${token}` } },
  )
  if (!res.ok) throw new Error(`Stredisko fetch failed (${res.status}): ${await res.text()}`)
  const data = (await res.json()) as {
    docs: Array<{ id: number; heroGallery?: Array<{ photo: { id: number; filename: string } }> }>
  }
  if (!data.docs.length) throw new Error(`Stredisko not found: ${slug}`)
  return data.docs[0]
}

async function updateHeroGallery(token: string, strediskoId: number, heroGallery: Array<{ photo: number }>) {
  const res = await fetch(`${BASE_URL}/api/strediska/${strediskoId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify({ heroGallery }),
  })
  if (!res.ok) throw new Error(`Update failed for stredisko ${strediskoId}: ${await res.text()}`)
}

function numberFromFilename(filename: string): number | null {
  const match = filename.match(/^zuna[\s-_]*0*(\d+)(?:\D|$)/i)
  if (!match) return null
  return Number.parseInt(match[1], 10)
}

async function main() {
  const token = await login()
  console.log('✓ Logged in')

  const allMedia = await getAllMedia(token)
  console.log(`✓ Loaded media (${allMedia.length})`)

  // Pick best (highest id / newest) media for each number 1..17 based on filename like:
  //   zuna1.jpg, zuna 1.jpg, zuna-1.jpg, zuna17.jpg.jpeg, zuna14.jpg (1).jpg, ...
  const byNumber = new Map<number, MediaDoc>()

  for (const doc of allMedia) {
    const n = numberFromFilename(doc.filename ?? '')
    if (n === null) continue
    if (n < FROM || n > TO) continue

    const existing = byNumber.get(n)
    if (!existing || doc.id > existing.id) {
      byNumber.set(n, doc)
    }
  }

  const missing: number[] = []
  const picked: Array<{ n: number; doc: MediaDoc }> = []
  for (let n = FROM; n <= TO; n++) {
    const doc = byNumber.get(n)
    if (!doc) missing.push(n)
    else picked.push({ n, doc })
  }

  if (missing.length) {
    throw new Error(`Missing media for: ${missing.join(', ')} (filenames should start with these numbers)`)
  }

  console.log('✓ Picked files:')
  picked.forEach(({ n, doc }) => console.log(`  ${n}: ${doc.filename} → id:${doc.id}`))

  const stredisko = await getStredisko(token, STREDISKO_SLUG)
  console.log(`✓ Found stredisko "${STREDISKO_SLUG}" (id:${stredisko.id})`)

  const heroGallery = picked
    .sort((a, b) => a.n - b.n)
    .map(({ doc }) => ({ photo: doc.id }))

  await updateHeroGallery(token, stredisko.id, heroGallery)
  console.log(`✓ Updated heroGallery (${heroGallery.length} photos)`)

  // Verify order after update
  const updated = await getStredisko(token, STREDISKO_SLUG)
  const updatedNames = updated.heroGallery?.map((x) => x.photo?.filename).filter(Boolean) ?? []
  console.log('✓ Verified heroGallery order:')
  updatedNames.forEach((name, i) => console.log(`  [${i + 1}] ${name}`))
}

main()
  .catch((err) => {
    console.error('✗', err.message)
    process.exit(1)
  })
  .then(() => process.exit(0))
