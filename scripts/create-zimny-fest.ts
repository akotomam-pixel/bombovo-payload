/**
 * One-off: creates "Zimný Fest animátor fest" (2.–7.1.2027) in Payload.
 *
 * Content comes from data/camps/zimny-fest-animator-fest.ts. No new uploads —
 * the hero gallery reuses the Fest Halloween Fest photos already in Payload
 * Media, with its group photo (media 842) moved to the front as the hero.
 * Skips if the slug already exists.
 *
 * Usage:
 *   npx tsx scripts/create-zimny-fest.ts
 */

import dotenv from 'dotenv'
import path from 'path'
import { zimnyFestAnimatorFestData } from '../data/camps/zimny-fest-animator-fest'
import { toPayloadDoc } from './lib/campToPayloadDoc'

dotenv.config({ path: path.resolve(process.cwd(), '.env'), quiet: true } as any)

const PAYLOAD_URL = process.env.PAYLOAD_URL ?? 'http://localhost:3000'
const SOURCE_SLUG = 'fest-halloween-fest'
const HERO_MEDIA_ID = 842

async function main() {
  const login = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.PAYLOAD_ADMIN_EMAIL, password: process.env.PAYLOAD_ADMIN_PASSWORD }),
  }).then((r) => r.json())
  if (!login.token) throw new Error('Payload login failed')
  const auth = { Authorization: `JWT ${login.token}` }

  const d = zimnyFestAnimatorFestData
  const existing = await fetch(`${PAYLOAD_URL}/api/camps?where[slug][equals]=${d.id}&limit=1&depth=0`, { headers: auth }).then((r) => r.json())
  if (existing.totalDocs > 0) {
    console.log(`${d.id} already exists (id ${existing.docs[0].id}) — skipping`)
    return
  }

  const source = await fetch(`${PAYLOAD_URL}/api/camps?where[slug][equals]=${SOURCE_SLUG}&limit=1&depth=0`, { headers: auth }).then((r) => r.json())
  const sourceIds: number[] = (source.docs?.[0]?.heroGallery ?? []).map((g: { photo: number }) => g.photo)
  if (!sourceIds.includes(HERO_MEDIA_ID)) throw new Error(`Media ${HERO_MEDIA_ID} not in ${SOURCE_SLUG} gallery`)
  const galleryIds = [HERO_MEDIA_ID, ...sourceIds.filter((id) => id !== HERO_MEDIA_ID)]

  const res = await fetch(`${PAYLOAD_URL}/api/camps`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...auth },
    body: JSON.stringify(toPayloadDoc(d, ['Tínedžerský', 'Akčný'], galleryIds, 0)),
  })
  const out = await res.json()
  if (!res.ok || !out?.doc?.id) throw new Error(`Create failed: ${res.status} ${JSON.stringify(out).slice(0, 500)}`)
  console.log(`created ${d.id} as camp id ${out.doc.id} with ${galleryIds.length} photos (hero media ${galleryIds[0]})`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
