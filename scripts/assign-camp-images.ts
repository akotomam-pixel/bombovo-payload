import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const BASE_URL = process.env.PAYLOAD_URL || 'http://localhost:3000'
const EMAIL = process.env.PAYLOAD_ADMIN_EMAIL!
const PASSWORD = process.env.PAYLOAD_ADMIN_PASSWORD!

// filename → camp slug (expecto already done, included for safety)
const MAPPINGS: Record<string, string> = {
  'olympcamp.JPG':              'olymp-kemp',
  'fest.JPG':                   'fest-animator-fest',
  'tanecnaplaneta.JPG':         'tanecna-planeta',
  'babinec.JPG':                'babinec',
  'tajomstvopohara.JPG':        'tajomstvo-basketbaloveho-pohara',
  'trhlina.JPG':                'trhlina',
  'readypleayer.JPG':           'ready-player-one',
  'V-dracej-nore.JPG':          'v-dracej-nore',
  'summeradvatnure.JPG':        'anglicke-leto',
  'neverfot.JPG':               'neverfort',
  'chlapinec.JPG':              'chlapinec',
  'Art.JPG':                    'artlantida',
  'plutva.JPG':                 'stastna-plutva',
  'kazdydennovyzazitok.JPG':    'kazdy-den-novy-zazitok',
  'zbombova-do-bombova.JPG':    'z-bodu-nula-do-bodu-sto',
  'woodcamp.JPG':               'woodkemp',
  'expcto.JPG':                 'expecto',
}

async function login(): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  const data = await res.json() as any
  if (!data.token) throw new Error(`Login failed: ${JSON.stringify(data)}`)
  console.log('Logged in.')
  return data.token
}

async function getAllMedia(token: string): Promise<Record<string, string>> {
  // Returns filename → media doc ID
  const res = await fetch(`${BASE_URL}/api/media?limit=200&depth=0`, {
    headers: { Authorization: `JWT ${token}` },
  })
  const data = await res.json() as any
  const map: Record<string, string> = {}
  for (const doc of data.docs ?? []) {
    if (doc.filename) map[doc.filename] = doc.id
  }
  console.log(`Found ${Object.keys(map).length} media files.`)
  return map
}

async function getCampIdBySlug(token: string, slug: string): Promise<string | null> {
  const res = await fetch(`${BASE_URL}/api/camps?where[slug][equals]=${slug}&limit=1&depth=0`, {
    headers: { Authorization: `JWT ${token}` },
  })
  const data = await res.json() as any
  return data.docs?.[0]?.id ?? null
}

async function updateCamp(token: string, campId: string, mediaId: string, slug: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/camps/${campId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify({
      cardImage: mediaId,
      heroGallery: [{ photo: mediaId }],
    }),
  })
  const data = await res.json() as any
  if (data.errors) {
    console.error(`  ❌ Failed to update ${slug}:`, JSON.stringify(data.errors))
  } else {
    console.log(`  ✅ Updated ${slug}`)
  }
}

async function main() {
  const token = await login()
  const mediaMap = await getAllMedia(token)

  for (const [filename, slug] of Object.entries(MAPPINGS)) {
    const mediaId = mediaMap[filename]
    if (!mediaId) {
      console.warn(`  ⚠️  Media not found for filename: ${filename} (${slug}) — skipping`)
      continue
    }

    const campId = await getCampIdBySlug(token, slug)
    if (!campId) {
      console.warn(`  ⚠️  Camp not found in Payload for slug: ${slug} — skipping`)
      continue
    }

    await updateCamp(token, campId, mediaId, slug)
  }

  console.log('\nDone!')
}

main().catch((err: unknown) => {
  console.error('Error:', err)
  process.exit(1)
})
