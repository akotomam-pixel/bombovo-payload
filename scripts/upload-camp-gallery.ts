/**
 * Uploads a folder of web-sized JPEGs to Payload Media and makes them a camp's
 * hero gallery (in filename order — first file is the hero + card image).
 * Replaces the camp's existing heroGallery and cardImage.
 *
 * Re-runnable: uploaded media IDs are remembered in <photosDir>/uploaded.json.
 *
 * Usage:
 *   npx tsx scripts/upload-camp-gallery.ts <camp-slug> <photosDir> [altPrefix]
 */

import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

dotenv.config({ path: path.resolve(process.cwd(), '.env'), quiet: true } as any)

const PAYLOAD_URL = process.env.PAYLOAD_URL ?? 'http://localhost:3000'
const [slug, photosDir, altPrefix] = process.argv.slice(2)
if (!slug || !photosDir) {
  console.error('Usage: npx tsx scripts/upload-camp-gallery.ts <camp-slug> <photosDir> [altPrefix]')
  process.exit(1)
}

async function main() {
  const login = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.PAYLOAD_ADMIN_EMAIL, password: process.env.PAYLOAD_ADMIN_PASSWORD }),
  }).then((r) => r.json())
  if (!login.token) throw new Error('Payload login failed')
  const auth = { Authorization: `JWT ${login.token}` }

  const found = await fetch(`${PAYLOAD_URL}/api/camps?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=0`, { headers: auth }).then((r) => r.json())
  const camp = found.docs?.[0]
  if (!camp) throw new Error(`Camp ${slug} not found in Payload`)
  const alt = altPrefix ?? camp.name

  const progressFile = path.join(photosDir, 'uploaded.json')
  const uploaded: Record<string, number> = fs.existsSync(progressFile) ? JSON.parse(fs.readFileSync(progressFile, 'utf8')) : {}

  const files = fs.readdirSync(photosDir).filter((f) => /\.jpe?g$/i.test(f)).sort()
  const ids: number[] = []
  for (const [i, file] of files.entries()) {
    if (!uploaded[file]) {
      const form = new FormData()
      form.append('file', new Blob([fs.readFileSync(path.join(photosDir, file))], { type: 'image/jpeg' }), file)
      form.append('_payload', JSON.stringify({ alt: `${alt} – foto ${i + 1}` }))
      const res = await fetch(`${PAYLOAD_URL}/api/media`, { method: 'POST', headers: auth, body: form })
      const data = await res.json()
      if (!res.ok || !data?.doc?.id) throw new Error(`Upload failed for ${file}: ${res.status} ${JSON.stringify(data).slice(0, 300)}`)
      uploaded[file] = data.doc.id
      fs.writeFileSync(progressFile, JSON.stringify(uploaded, null, 2))
      console.log(`  uploaded ${file} → media ${uploaded[file]}`)
    }
    ids.push(uploaded[file])
  }

  const res = await fetch(`${PAYLOAD_URL}/api/camps/${camp.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...auth },
    body: JSON.stringify({ cardImage: ids[0], heroGallery: ids.map((photo) => ({ photo })) }),
  })
  const out = await res.json()
  if (!res.ok) throw new Error(`Updating camp failed: ${res.status} ${JSON.stringify(out).slice(0, 400)}`)
  console.log(`${slug}: gallery set to ${ids.length} photos, hero/card = media ${ids[0]}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
