import { config as loadDotenv } from 'dotenv'
import path from 'path'

loadDotenv({ path: path.resolve(process.cwd(), '.env.local') })

const BASE_URL    = process.env.PAYLOAD_URL            ?? 'http://localhost:3000'
const ADMIN_EMAIL = process.env.PAYLOAD_ADMIN_EMAIL    ?? ''
const ADMIN_PASS  = process.env.PAYLOAD_ADMIN_PASSWORD ?? ''

// lomy1–lomy11 media IDs
const LOMY_IDS  = [421,422,423,424,425,426,427,428,429,430,431]
// min1–min9 media IDs
const MIN_IDS   = [412,413,414,415,416,417,418,419,420]

const LOMY_CAMPS = [
  'neverfort',
  'olymp-kemp',
  'babinec',
  'woodkemp',
  'tanecna-planeta',
  'v-dracej-nore',
  'trhlina',
  'tajomstvo-basketbaloveho-pohara',
  'artlantida',
  'ready-player-one',
  'expecto',
  'kazdy-den-novy-zazitok',
  'chlapinec',
  'fest-animator-fest',
]

const MIN_CAMPS = [
  'z-bodu-nula-do-bodu-sto',
  'anglicke-leto',
  'stastna-plutva',
]

async function login(): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASS }),
  })
  const data = await res.json() as { token?: string }
  if (!data.token) throw new Error('Login failed')
  return data.token
}

async function getCampId(token: string, slug: string): Promise<number> {
  const res = await fetch(`${BASE_URL}/api/camps?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`, {
    headers: { Authorization: `JWT ${token}` },
  })
  const data = await res.json() as { docs: Array<{ id: number }> }
  if (!data.docs.length) throw new Error(`Camp not found: ${slug}`)
  return data.docs[0].id
}

async function updateStrediskoGallery(token: string, campId: number, photoIds: number[]) {
  const strediskoGallery = photoIds.map((id) => ({ photo: id }))
  const res = await fetch(`${BASE_URL}/api/camps/${campId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify({ strediskoGallery }),
  })
  if (!res.ok) throw new Error(`Update failed for camp ${campId}: ${await res.text()}`)
}

async function main() {
  const token = await login()
  console.log('✓ Logged in\n')

  console.log('── Horský hotel Lomy camps (11 photos each) ──')
  for (const slug of LOMY_CAMPS) {
    const id = await getCampId(token, slug)
    await updateStrediskoGallery(token, id, LOMY_IDS)
    console.log(`  ✓ ${slug}`)
  }

  console.log('\n── Hotel Martinské Hole camps (9 photos each) ──')
  for (const slug of MIN_CAMPS) {
    const id = await getCampId(token, slug)
    await updateStrediskoGallery(token, id, MIN_IDS)
    console.log(`  ✓ ${slug}`)
  }

  console.log('\nAll done!')
}

main().catch((err) => { console.error('✗', err.message); process.exit(1) }).then(() => process.exit(0))
