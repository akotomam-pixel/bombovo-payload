/**
 * Seeds the "Naša Misia" global with all hardcoded content from the page.
 *
 * What this does:
 *   1. Uploads nasamissia1.JPG and nasamissia2.JPG to Media (skips if already present)
 *   2. Fills every text/textarea field in the nasa-misia global
 *   3. Assigns photo IDs to missionImage and summerImage
 *
 * Prerequisites:
 *   1. Dev server must be running: npm run dev
 *   2. .env.local must contain PAYLOAD_ADMIN_EMAIL and PAYLOAD_ADMIN_PASSWORD
 *
 * Run: npx tsx scripts/seed-nasa-misia.ts
 */

import { config as loadDotenv } from 'dotenv'
import fs from 'fs'
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

async function getAllMedia(token: string): Promise<any[]> {
  const res = await fetch(`${BASE_URL}/api/media?limit=300`, {
    headers: { Authorization: `JWT ${token}` },
  })
  const data = await res.json() as any
  return data.docs || []
}

async function uploadImage(token: string, filePath: string, filename: string): Promise<string> {
  const buffer = fs.readFileSync(filePath)
  const blob = new Blob([buffer], { type: 'image/jpeg' })
  const form = new FormData()
  form.append('file', blob, filename)
  form.append('alt', filename.replace(/\.[^.]+$/, ''))

  const res = await fetch(`${BASE_URL}/api/media`, {
    method: 'POST',
    headers: { Authorization: `JWT ${token}` },
    body: form,
  })
  const data = await res.json() as any
  if (!data.doc?.id) throw new Error(`Upload failed for ${filename}: ${JSON.stringify(data)}`)
  console.log(`  ✅ Uploaded: ${filename} → ID ${data.doc.id}`)
  return data.doc.id
}

async function ensureImage(token: string, media: any[], filename: string, localPath: string): Promise<string> {
  const existing = media.find((m) => m.filename?.toLowerCase() === filename.toLowerCase())
  if (existing) {
    console.log(`  ✓ Already in Media: ${filename} → ID ${existing.id}`)
    return existing.id
  }
  return uploadImage(token, localPath, filename)
}

async function seedNasaMisia(token: string, missionImageId: string, summerImageId: string): Promise<void> {
  const payload = {
    // Section 1: Mission
    missionHeadline: 'Prečo deti milujú Bombovo?',
    missionText1:
      'Už viac ako 20 rokov v Bombove máme od začiatku jednu misiu: robiť deťom šťastnými každý deň, ktorý u nás strávia. Výsledkom je, že namiesto toho, aby sme si plnili peňaženky, sme malá rodinná cestovná kancelária, ku ktorej sa až 86% detí vracia každý rok.',
    missionText2:
      'Originálny program vytvára nezabudnuteľné zážitky, pre ktoré deti prosia rodičov, aby sa mohli vrátiť späť.',
    missionImage: missionImageId,
    testimonialQuote:
      'Čo je viac ako to, že vaše dieťa žiari šťastím? Dcéra bola prvýkrát, ostala by aj o týždeň dlhšie. Úžasný prístup, ubytovanie a program geniálny. Ďakujeme a určite sa nezúčastnila naposledy.',
    testimonialAuthor: 'V. Marčeková',

    // Section B: Summer
    summerHeadline: 'Leto, Aké Ste Mali Vy',
    summerText1:
      'V dnešnej dobe viac ako 80% detí strávi leto pred telefónom alebo za počítačom. Keď dáte dieťa do Bombova, meníte jeho leto, ktoré by inak bolo strávené scrollovaním a bojmi o telefón, na leto plné dobrodružstiev vonku - také, aké ste mali vy.',
    summerText2:
      'Namiesto nudy a obrazoviek dostane vaše dieťa príbeh. Namiesto sociálnych médií dostane skutočných priateľov. Namiesto závislosti dostane dieťa slobodu byť dieťaťom.',
    summerImage: summerImageId,

    // Section 2: Kvalita
    kvalitaHeadline: 'Bombovo = Kvalita pred Kvantitou',
    kvalitaIntroText:
      'Aj keď toto pravidlo nie je pre väčšinu cestovných kancelárií populárne, u nás uprednostňujeme šťastie dieťaťa pred tým, aby sme sa stali najväčšia cestovná kancelária na Slovensku.',
    kvalitaPoints: [
      {
        pointHeadline: 'Nemáme žiadne skryté poplatky.',
        pointText:
          'Čo vidíte, to zaplatíte. Žiadne prekvapenia pri fakturácii. U nás sa vaše deti nebudú nudiť - všetky výlety a aktivity sú v cene.',
      },
      {
        pointHeadline: 'Naši animátori prechádzajú dôkladným školením.',
        pointText:
          'Nie sú to náhodní študenti, ktorí potrebujú prácu na leto. Sú to vyškolení profesionáli, ktorým záleží na deťoch viac ako na výplatnej páske.',
      },
      {
        pointHeadline: 'Naše programy sú originálne.',
        pointText:
          'Nezaložené na kópiách konkurencie, ale na 20+ rokoch skúseností s tým, čo skutočne funguje a čo baví deti natoľko, že zabudnú na telefóny.',
      },
    ],

    // Section 5: Team
    teamHeadline: 'Spoznaj Náš skúsený Animačný tím',
    teamMembers: [
      { name: 'Matej "Uli" Uller',         description: 'Garant Fest Family Fest a skúsený animátor' },
      { name: 'Matej "Baran" Majerčík',    description: 'Garant Fest Family Fest a skúsený animátor s dlhoročnými skúsenosťami' },
      { name: 'Sofia "Sofa" Pračková',     description: 'Garant tábora Babinec a animátorka s dlhoročnými skúsenosťami' },
      { name: 'Nicol "Stará" Kalinová',    description: 'Garant tábora Babinec a energická animátorka milovaná deťmi' },
      { name: 'Ivo "Laco" Ďurkovič',       description: 'Garant Fest Family Fest a skúsený animátor s pozitívnou energiou' },
    ],
  }

  const res = await fetch(`${BASE_URL}/api/globals/nasa-misia`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify(payload),
  })
  const data = await res.json() as any
  if (data.errors) {
    console.error('❌ Failed to seed nasa-misia:', JSON.stringify(data.errors, null, 2))
  } else {
    console.log('✅ Naša Misia global seeded successfully.')
  }
}

async function main() {
  const token = await login()

  console.log('\nChecking / uploading photos...')
  const media = await getAllMedia(token)

  const missionImageId = await ensureImage(
    token,
    media,
    'nasamissia1.JPG',
    path.resolve(process.cwd(), 'public/images/nasamissia1.JPG'),
  )
  const summerImageId = await ensureImage(
    token,
    media,
    'nasamissia2.JPG',
    path.resolve(process.cwd(), 'public/images/nasamissia2.JPG'),
  )

  console.log('\nSeeding text content...')
  await seedNasaMisia(token, missionImageId, summerImageId)

  console.log('\nDone! Open /admin/globals/nasa-misia to verify.')
}

main().catch((err: unknown) => {
  console.error('Error:', err)
  process.exit(1)
})
