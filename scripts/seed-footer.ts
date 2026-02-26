/**
 * Seeds the Footer global in Payload CMS with all current hardcoded PDF documents.
 *
 * Prerequisites:
 *   1. Dev server must be running: npm run dev
 *   2. .env.local must contain PAYLOAD_ADMIN_EMAIL and PAYLOAD_ADMIN_PASSWORD
 *
 * Run from the project root:
 *   npx tsx scripts/seed-footer.ts
 */

import { config as loadDotenv } from 'dotenv'
import path from 'path'

loadDotenv({ path: path.resolve(process.cwd(), '.env.local') })

const BASE_URL = process.env.PAYLOAD_URL || 'http://localhost:3000'
const EMAIL    = process.env.PAYLOAD_ADMIN_EMAIL!
const PASSWORD = process.env.PAYLOAD_ADMIN_PASSWORD!

async function login(): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  const data = await res.json() as any
  if (!data.token) throw new Error(`Login failed: ${JSON.stringify(data)}`)
  console.log('✅ Logged in.')
  return data.token
}

async function seedFooter(token: string): Promise<void> {
  const payload = {
    section1Title: 'Dokumenty na stiahnutie',
    section1Docs: [
      { name: 'Všeobecné poistné podmienky pre prípad úpadku CK', url: '/documents/Vseobecne-poistne-podmienky-pre-pripad-upadku-CK.pdf' },
      { name: 'Všeobecné a záručné podmienky', url: '/documents/Vseobecne-a-zarucne-podmienky.pdf' },
      { name: 'Ochrana osobných údajov', url: '/documents/ochrana-osobnych-udajov.pdf' },
      { name: 'Certifikát pre prípad úpadku CK', url: '/documents/Certifikat-pre-pripad-upadku-CK.pdf' },
      { name: 'Čestné prehlásenie BOUNCE PARK', url: '/documents/cestne-prehlásenie-BOUNCE-PARK.pdf' },
      { name: 'Vyhlásenie rodiča o zdravotnej spôsobilosti dieťaťa', url: '/documents/vyhlasenie-rodica-o-zdravotnej-sposobilosti dietata.pdf' },
      { name: 'Pokyny k táborom Leto 2026', url: '/documents/Pokyny-k-taborom-Leto-2026.pdf' },
      { name: 'Splnomocnenie o odovzdaní/prebratí dieťaťa', url: '/documents/splnomocnenie.pdf' },
      { name: 'Dôležité informácie o ŠvP', url: '/documents/Dolezite-Informacie-o-SVP2026.pdf' },
      { name: 'Prehlásenie o zdravotnom stave', url: '/documents/Prehlasenie-o-zdravotnom-stave.pdf' },
      { name: 'Menný zoznam účastníkov ŠvP', url: '/documents/menny-zoznam-ucastnikov-svp-2026-excel.pdf' },
      { name: 'Darčekový poukaz', url: '/documents/darcekovy-poukaz.pdf' },
    ],
    section2Title: 'Poistenie účastníkov zájazdov',
    section2Docs: [
      { name: 'Všeobecné poistné podmienky', url: '/documents/Vseobecne-poistne-podmienky2.pdf' },
      { name: 'Informácie o spracúvaní údajov', url: '/documents/Informacie-o-spracuvani-osobnych-udajov-GDPR.pdf' },
      { name: 'Informačný dokument o poistnom produkte', url: '/documents/Informacny-dokument-o-poistnom-produkte.pdf' },
      { name: 'Informačný dokument o poistnom produkte-tábory', url: '/documents/Informacny-dokument-o-poistnom-produkte-tabory.pdf' },
    ],
  }

  const res = await fetch(`${BASE_URL}/api/globals/footer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify(payload),
  })
  const data = await res.json() as any
  if (data.errors) {
    console.error('❌ Failed to seed footer:', JSON.stringify(data.errors))
  } else {
    console.log('✅ Footer global seeded with', payload.section1Docs.length, '+', payload.section2Docs.length, 'documents.')
  }
}

async function main() {
  const token = await login()
  await seedFooter(token)
  console.log('\nDone! Open /admin/globals/footer to verify.')
}

main().catch((err: unknown) => {
  console.error('Error:', err)
  process.exit(1)
})
