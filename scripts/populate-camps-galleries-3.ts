import { config as loadDotenv } from 'dotenv'
import path from 'path'

loadDotenv({ path: path.resolve(process.cwd(), '.env.local') })

const BASE_URL    = process.env.PAYLOAD_URL            ?? 'http://localhost:3000'
const ADMIN_EMAIL = process.env.PAYLOAD_ADMIN_EMAIL    ?? ''
const ADMIN_PASS  = process.env.PAYLOAD_ADMIN_PASSWORD ?? ''

const CAMPS = [
  { slug: 'ready-player-one',       prefix: 'ready' },
  { slug: 'tanecna-planeta',        prefix: 'tanec' },
  { slug: 'trhlina',                prefix: 'tr'    },
  { slug: 'woodkemp',               prefix: 'ww'    },
  { slug: 'z-bodu-nula-do-bodu-sto', prefix: 'bom'  },
]

async function login(): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASS }),
  })
  if (!res.ok) throw new Error(`Login failed: ${await res.text()}`)
  const data = await res.json() as { token?: string }
  if (!data.token) throw new Error('No token in login response')
  return data.token
}

async function getAllMedia(token: string): Promise<Array<{ id: number; filename: string }>> {
  let all: Array<{ id: number; filename: string }> = []
  let page = 1
  while (true) {
    const res = await fetch(`${BASE_URL}/api/media?limit=100&page=${page}`, {
      headers: { Authorization: `JWT ${token}` },
    })
    const data = await res.json() as { docs: Array<{ id: number; filename: string }>; hasNextPage: boolean }
    all = all.concat(data.docs)
    if (!data.hasNextPage) break
    page++
  }
  return all
}

async function getCamp(token: string, slug: string): Promise<{ id: number; heroGallery: Array<{ photo: { id: number; filename: string } }> }> {
  const res = await fetch(
    `${BASE_URL}/api/camps?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=1`,
    { headers: { Authorization: `JWT ${token}` } },
  )
  const data = await res.json() as { docs: Array<{ id: number; heroGallery: Array<{ photo: { id: number; filename: string } }> }> }
  if (!data.docs.length) throw new Error(`Camp not found: ${slug}`)
  return data.docs[0]
}

async function updateHeroGallery(token: string, campId: number, heroGallery: Array<{ photo: number }>) {
  const res = await fetch(`${BASE_URL}/api/camps/${campId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify({ heroGallery }),
  })
  if (!res.ok) throw new Error(`Update failed for camp ${campId}: ${await res.text()}`)
}

async function main() {
  const token    = await login()
  console.log('✓ Logged in\n')
  const allMedia = await getAllMedia(token)
  console.log(`Total media in Payload: ${allMedia.length}\n`)

  for (const { slug, prefix } of CAMPS) {
    console.log(`── ${slug} (prefix: "${prefix}") ──`)

    const newPhotos = allMedia
      .filter((m) => new RegExp(`^${prefix}\\d+`, 'i').test(m.filename ?? ''))
      .sort((a, b) => {
        const numA = parseInt((a.filename ?? '').replace(/\D/g, ''), 10)
        const numB = parseInt((b.filename ?? '').replace(/\D/g, ''), 10)
        return numA - numB
      })

    if (newPhotos.length === 0) {
      console.log(`  ⚠ No media files found with prefix "${prefix}" — skipping\n`)
      continue
    }

    const nums = newPhotos.map((m) => parseInt((m.filename ?? '').replace(/\D/g, ''), 10))
    const max  = Math.max(...nums)
    const missing: number[] = []
    for (let i = 1; i <= max; i++) {
      if (!nums.includes(i)) missing.push(i)
    }

    console.log(`  Found ${newPhotos.length} photos:`)
    newPhotos.forEach((m) => console.log(`    ${m.filename} → id:${m.id}`))
    if (missing.length > 0) {
      console.log(`  ⚠ Missing: ${missing.map((n) => `${prefix}${n}`).join(', ')}`)
    } else {
      console.log(`  ✓ No gaps`)
    }

    const camp          = await getCamp(token, slug)
    const existingFirst = camp.heroGallery?.[0]?.photo

    if (existingFirst) {
      console.log(`  Keeping first photo: ${existingFirst.filename} (id:${existingFirst.id})`)
    }

    const heroGallery: Array<{ photo: number }> = [
      ...(existingFirst ? [{ photo: existingFirst.id }] : []),
      ...newPhotos.map((m) => ({ photo: m.id })),
    ]

    await updateHeroGallery(token, camp.id, heroGallery)
    console.log(`  ✓ Updated — total ${heroGallery.length} photos\n`)
  }

  console.log('All done!')
}

main().catch((err) => { console.error('✗', err.message); process.exit(1) }).then(() => process.exit(0))
