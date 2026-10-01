/**
 * One-off: creates the two autumn camps (Halloween na Lomoch, Fest Halloween
 * Fest) in Payload and uploads their photo galleries.
 *
 * Content comes from the hardcoded camp files in data/camps/, photos from a
 * folder of web-sized JPEGs (photo-1-hero.jpg, photo-2.jpg, …) uploaded in
 * numeric order — that order becomes the hero gallery order.
 *
 * Re-runnable: uploaded media IDs are remembered in <photosDir>/uploaded.json,
 * and a camp whose slug already exists is skipped.
 *
 * Usage:
 *   npx tsx scripts/create-halloween-camps.ts <photosDir>
 *   (<photosDir> contains Deti-hallowen/ and Fest-halloween/)
 */

import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { halloweenNaLomochData } from '../data/camps/halloween-na-lomoch'
import { festHalloweenFestData } from '../data/camps/fest-halloween-fest'
import type { CampDetailData } from '../data/camps/types'

dotenv.config({ path: path.resolve(process.cwd(), '.env'), quiet: true } as any)

const PAYLOAD_URL = process.env.PAYLOAD_URL ?? 'http://localhost:3000'
const photosDir = process.argv[2]
if (!photosDir) {
  console.error('Usage: npx tsx scripts/create-halloween-camps.ts <photosDir>')
  process.exit(1)
}

// Lomy stredisko photos already in Payload (same set Trhlina uses)
const LOMY_STREDISKO_MEDIA_IDS = [421, 422, 423, 424, 425, 426, 427, 428, 429, 430, 431]

const CAMPS: Array<{ data: CampDetailData; folder: string; campTypes: string[] }> = [
  // Kids camp types ("Dobrodružný", "Tvorivý") aren't all valid Payload options —
  // left empty so the card falls back to the hardcoded types in lib/campsData.ts.
  { data: halloweenNaLomochData, folder: 'Deti-hallowen', campTypes: [] },
  { data: festHalloweenFestData, folder: 'Fest-halloween', campTypes: ['Tínedžerský', 'Akčný'] },
]

async function login(): Promise<string> {
  const res = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.PAYLOAD_ADMIN_EMAIL, password: process.env.PAYLOAD_ADMIN_PASSWORD }),
  })
  const data = await res.json()
  if (!data.token) throw new Error(`Payload login failed: ${JSON.stringify(data).slice(0, 200)}`)
  return data.token
}

function photoNumber(file: string): number {
  return Number(file.match(/photo-(\d+)/)?.[1] ?? 9999)
}

async function uploadPhoto(token: string, filePath: string, alt: string): Promise<number> {
  const form = new FormData()
  const buf = fs.readFileSync(filePath)
  form.append('file', new Blob([buf], { type: 'image/jpeg' }), path.basename(filePath))
  form.append('_payload', JSON.stringify({ alt }))
  const res = await fetch(`${PAYLOAD_URL}/api/media`, {
    method: 'POST',
    headers: { Authorization: `JWT ${token}` },
    body: form,
  })
  const data = await res.json()
  const id = data?.doc?.id
  if (!res.ok || !id) throw new Error(`Upload failed for ${filePath}: ${res.status} ${JSON.stringify(data).slice(0, 300)}`)
  return id
}

async function slugExists(token: string, slug: string): Promise<boolean> {
  const res = await fetch(`${PAYLOAD_URL}/api/camps?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=0`, {
    headers: { Authorization: `JWT ${token}` },
  })
  const data = await res.json()
  return (data.totalDocs ?? 0) > 0
}

function toPayloadDoc(d: CampDetailData, campTypes: string[], galleryIds: number[]) {
  const items = (arr: string[]) => arr.map((item) => ({ item }))
  const paragraphs = (arr: string[]) => arr.map((paragraph) => ({ paragraph }))
  return {
    name: d.name,
    slug: d.id,
    order: 0,
    poSezone: false,
    cardImage: galleryIds[0],
    campTypes,
    headline: d.headline,
    headlineHighlight: d.headlineHighlight,
    bulletPoints: d.bulletPoints.map((text) => ({ text })),
    location: d.location,
    age: d.age,
    price: d.price,
    heroGallery: galleryIds.map((photo) => ({ photo })),
    section2_headline: d.section2.headline,
    section2_description: paragraphs(d.section2.description),
    ratings: d.section2.ratings,
    section3_headline: d.section3.headline,
    section3_text: paragraphs(d.section3.text),
    reviews: d.section3.reviews,
    vTomtoTaboreZazites: items(d.section4.details.vTomtoTaboreZazites),
    vCene: items(d.section4.details.vCene),
    lokalita: d.section4.details.lokalita,
    doprava: d.section4.details.doprava,
    ubytovanie: items(d.section4.details.ubytovanie),
    zaPriplatok: items(d.section4.details.zaPriplatok),
    hasStredisko: d.section4.hasStredisko ?? false,
    strediskoName: d.section4.strediskoName,
    strediskoDescription: d.section4.strediskoDescription,
    strediskoGallery: LOMY_STREDISKO_MEDIA_IDS.map((photo) => ({ photo })),
    mapLat: d.section4.mapCoordinates?.lat,
    mapLng: d.section4.mapCoordinates?.lng,
    dates: d.section5.dates.map((t) => ({
      start: t.start,
      end: t.end,
      days: t.days,
      originalPrice: t.originalPrice,
      discountedPrice: t.discountedPrice,
      registrationId: t.registrationId != null ? String(t.registrationId) : undefined,
      profisTerminId: t.profisTerminId,
      id_ZajezdHotel: t.id_ZajezdHotel,
      vypredane: false,
    })),
  }
}

async function main() {
  const token = await login()
  console.log(`Logged in to ${PAYLOAD_URL}`)

  const progressFile = path.join(photosDir, 'uploaded.json')
  const uploaded: Record<string, number> = fs.existsSync(progressFile)
    ? JSON.parse(fs.readFileSync(progressFile, 'utf8'))
    : {}

  for (const { data, folder, campTypes } of CAMPS) {
    console.log(`\n=== ${data.name} (${data.id})`)
    if (await slugExists(token, data.id)) {
      console.log('  already exists in Payload — skipping')
      continue
    }

    const dir = path.join(photosDir, folder)
    const files = fs.readdirSync(dir).filter((f) => /\.jpe?g$/i.test(f)).sort((a, b) => photoNumber(a) - photoNumber(b))
    const galleryIds: number[] = []
    for (const file of files) {
      const key = `${folder}/${file}`
      if (!uploaded[key]) {
        uploaded[key] = await uploadPhoto(token, path.join(dir, file), `${data.name} – foto ${photoNumber(file)}`)
        fs.writeFileSync(progressFile, JSON.stringify(uploaded, null, 2))
        console.log(`  uploaded ${file} → media ${uploaded[key]}`)
      } else {
        console.log(`  ${file} already uploaded → media ${uploaded[key]}`)
      }
      galleryIds.push(uploaded[key])
    }

    const res = await fetch(`${PAYLOAD_URL}/api/camps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
      body: JSON.stringify(toPayloadDoc(data, campTypes, galleryIds)),
    })
    const out = await res.json()
    if (!res.ok || !out?.doc?.id) throw new Error(`Creating ${data.id} failed: ${res.status} ${JSON.stringify(out).slice(0, 500)}`)
    console.log(`  created camp id ${out.doc.id} with ${galleryIds.length} photos`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
