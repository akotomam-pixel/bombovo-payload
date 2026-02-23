/**
 * Migration script — creates all 7 Školy v Prírode strediská and fills
 * the SkolyVPrirode Global via Payload REST API.
 *
 * Prerequisites:
 *   1. Dev server must be running: npm run dev
 *   2. .env.local must contain:
 *        PAYLOAD_ADMIN_EMAIL=...
 *        PAYLOAD_ADMIN_PASSWORD=...
 *
 * Run from the project root:
 *   npx tsx scripts/migrate-svp.ts
 *
 * Idempotent — any stredisko whose slug already exists in Payload is skipped.
 * The Global is always overwritten (PATCH is idempotent by design).
 *
 * NOTE: Payload REST uses POST /api/globals/:slug to update globals.
 */

import { config as loadDotenv } from 'dotenv'
import path from 'path'

// Pure data imports — no Payload/Next.js involved
import { stredEuropyKrahule }   from '../data/strediska/stred-europy-krahule'
import { penzionRohacan }       from '../data/strediska/penzion-rohacan'
import { penzionSabina }        from '../data/strediska/penzion-sabina'
import { hotelZuna }            from '../data/strediska/hotel-zuna'
import { hotelMartinskeHole }   from '../data/strediska/hotel-martinske-hole'
import { horskyHotelMinciar }   from '../data/strediska/horsky-hotel-minciar'
import { horskyHotelLomy }      from '../data/strediska/horsky-hotel-lomy'
import type { StrediskoData }   from '../data/strediska/types'

loadDotenv({ path: path.resolve(process.cwd(), '.env.local') })
loadDotenv({ path: path.resolve(process.cwd(), '.env') })

const BASE_URL       = process.env.PAYLOAD_URL            ?? 'http://localhost:3000'
const ADMIN_EMAIL    = process.env.PAYLOAD_ADMIN_EMAIL    ?? ''
const ADMIN_PASSWORD = process.env.PAYLOAD_ADMIN_PASSWORD ?? ''

// ── Stredisko roster ─────────────────────────────────────────────────────────

const STREDISKA: StrediskoData[] = [
  stredEuropyKrahule,
  penzionRohacan,
  penzionSabina,
  hotelZuna,
  hotelMartinskeHole,
  horskyHotelMinciar,
  horskyHotelLomy,
]

// ── Shared accordion content (same for all strediská) ────────────────────────

const DEFAULT_ZLAVA = [
  '30 € / dieťa zľava zo základnej ceny pobytu – platí len pre rezervácie jarných ŠvP s podpisom zmluvy do termínu 31.10.2025 – táto zľava nie je kombinovateľná s inými zľavami',
  '20 € / dieťa zľava z ceny animačného programu pre školy, ktoré boli s našou CK v škole v prírode aspoň raz od r. 2020 – táto zľava nie je kombinovateľná s inými zľavami, platí len v prípade ak ste si neuplatnili zľavu do 31.10.2025',
]

const DEFAULT_DOPLNKOVE_SLUZBY = [
  'Zdravotník z CK Bombovo aj s lekárničkou 550 €/pobyt (klasický 5-dňový pobyt)',
  'pobytový deň navyše 40 €/dieťa',
  'pobyt dospelej osoby navyše – 150€/pobyt',
  'pobyt pedagogického dieťaťa s animačným programom – 150 €/pobyt',
  'komplexné cestovné poistenie ECP (cena 4,50 € / dieťa / pobyt)',
  'obed navyše 8€ / osoba',
]

const DEFAULT_V_ZAKLADNEJ_CENE = [
  '4x ubytovanie, 4x plná penzia, strava 5x denne, pitný režim',
  'Cena pevného lôžka je rovnaká ako cena prístelky',
  'Príplatok k základnej cene školy v prírode pre 2.stupeň ZŠ je 8 € / pobyt',
]

const DEFAULT_V_CENE_ZAHRNUTE = [
  'Na 10 detí 1 dospelý pobyt zdarma',
  'Pobytový poplatok',
]

const DEFAULT_V_CENE_ANIMACNEHO_PROGRAMU = [
  '55 € / dieťa – animácia 7 hod denne okrem dňa odchodu (28 hodín spolu/pobyt)',
  'celodenná animácia 65 € / dieťa',
  'ZŠ na 15 detí 1 animátor',
  'MŠ na 10 detí 1 animátor',
  'animačný a športový materiál',
  'zábavné hry a kvízy, kamoš tanec',
  'darčeky pre každého účastníka ŠvP',
]

const DEFAULT_BOMBOVY_BALICEK = [
  'cena 30 €/dieťa',
  'možný len v prípade školy v prírode s animačným programom',
  'odmena 100 € na každých 10 platiacich detí',
  'autobusová doprava Kremnica + vstup do Štôlne Andrej',
  'výlet sa vždy organizuje v stredu, ak nie je dohodnuté inak',
]

// ── REST helpers ─────────────────────────────────────────────────────────────

async function login(): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })
  if (!res.ok) throw new Error(`Login failed (${res.status}): ${await res.text()}`)
  const data = await res.json() as { token?: string }
  if (!data.token) throw new Error('Login response did not include a token.')
  return data.token
}

async function slugExists(token: string, slug: string): Promise<boolean> {
  const url = `${BASE_URL}/api/strediska?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`
  const res = await fetch(url, { headers: { Authorization: `JWT ${token}` } })
  if (!res.ok) throw new Error(`Existence check failed (${res.status}): ${await res.text()}`)
  const data = await res.json() as { totalDocs?: number }
  return (data.totalDocs ?? 0) > 0
}

async function createStredisko(token: string, body: Record<string, unknown>): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/strediska`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body:    JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Create stredisko failed (${res.status}): ${await res.text()}`)
  const data = await res.json() as { doc?: { id?: string } }
  return data.doc?.id ?? '(unknown)'
}

async function updateGlobal(token: string, body: Record<string, unknown>): Promise<void> {
  // Payload REST uses POST (not PATCH) to update a global
  const res = await fetch(`${BASE_URL}/api/globals/skoly-v-prirode`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body:    JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Update global failed (${res.status}): ${await res.text()}`)
}

// ── Document builder ─────────────────────────────────────────────────────────

const items = (arr: string[]) => arr.map((item) => ({ item }))

function buildStrediskoDoc(s: StrediskoData): Record<string, unknown> {
  return {
    name:  s.name,
    slug:  s.id,
    price: s.basePrice,

    bulletPoints: s.iconBullets.map((text) => ({ text })),

    // Section 2 in Payload ↔ section3 in hardcoded data (naming quirk)
    section2Headline: s.section3.headline,
    section2Body:     s.section3.bodyText,

    // Accordion groups from hardcoded data
    ubytovanie:         items(s.detaily.ubytovanie),
    vybavenieStrediska: items(s.detaily.vybavenieStrediska),
    zaujimavostiVOkoli: items(s.detaily.zaujimavostiVOkoli),

    // Shared accordion defaults
    zlava:                   items(DEFAULT_ZLAVA),
    doplnkoveSluzby:         items(DEFAULT_DOPLNKOVE_SLUZBY),
    vZakladnejCene:          items(DEFAULT_V_ZAKLADNEJ_CENE),
    vCeneZahrnute:           items(DEFAULT_V_CENE_ZAHRNUTE),
    vCeneAnimacnehoProgramu: items(DEFAULT_V_CENE_ANIMACNEHO_PROGRAMU),
    bombovyBalicek:          items(DEFAULT_BOMBOVY_BALICEK),

    // Dates
    dates: s.dates.map((d) => ({
      startDate: d.startDate,
      endDate:   d.endDate,
      days:      d.days,
      price:     d.price,
      available: d.available,
    })),
  }
}

// ── Global content ────────────────────────────────────────────────────────────

function buildGlobalDoc(): Record<string, unknown> {
  return {
    headline:          'Školy v prírode',
    headlineHighlight: 'Ktoré učiteľky milujú',
    bodyText:
      'U nás v Cestovnej kancelárii Bombovo žiaci zažijú dni plné zmysluplných zážitkov a učitelia si doprajú zaslúžený oddych. Od ubytovania, stravy až po program a bezpečnosť deťom funguje všetko plynule.',

    reviews: [
      {
        content: 'Spokojnosť so všetkým, výborný program, ktorý bavil deti aj nás učiteľky, dobrá spolupráca, ochota, ústretovosť.',
        author:  'ZŠ Odborárska, Bratislava',
      },
      {
        content: 'Práca animátorov bola na vysokej úrovni, vyzdvihujeme empatiu voči našim deťom, nadmieru boli nápomocní pri každej aktivite aj bežných činnostiach.',
        author:  'MŠ SNP, Ivanka pri Dunaji',
      },
      {
        content: 'ŠvP sme si užili, animátori boli ochotní pomáhať nám aj mimo svojich animačných aktivít, čo nám uľahčovalo našu prácu. Hry pre deti boli neobvyklé, originálne a zábavné no super.',
        author:  'ZŠ Topoľová, Nitra',
      },
    ],

    section3Headline:
      'Overené strediská, ktoré spĺňajú všetky hygienické normy',
    section3Body:
      'V CK Bombovo spolupracujeme iba so strediskami, ktoré spĺňajú stanovené požiadavky na komfort, hygienu, vybavenie a sú dlhodobo overené školami a učiteľmi z celého Slovenska.\n\nNaši animátori komunikujú s vedením strediska a s kuchyňou a ak niečo nefunguje rieši to náš tím a nie učitelia. U nás je ubytovanie a strava istota, nie lotéria!',

    section3Block2Headline:
      'Profesionálny a zaškolený animačný tím',
    section3Block2Body:
      'V Bombove nenájdete žiadnych amatérov animátorov. Našich animátorov každoročne preškolujeme aby sme zariadili že váš turnus bude mať naozaj hladký priebeh. Program má pevný rytmus a náš tím presne vie ako reagovať v každej situácii.\n\nNaše školy v prírode nie sú o neustálom dozore, ale o tom, že učiteľ má svoj profesionálny tím, na ktorý sa môže vždy spoľahnúť.',

    section3Block3Headline:
      'Unikátny program, ktorý nikde inde nenájdete',
    section3Block3Body:
      'Najväčšou úľavou pre učiteľa je keď zistí, že na škole v prírode nemusí nič zachraňovať. Naše aktivity držia deti od prvého dňa pokope a každá časť dňa na seba prirodzene nadväzuje.\n\nNejde teda o sled náhodných hier ale o mystický príbeh, pomocou ktorého sa deti učia spolupracovať, dôverovať si a preberať zodpovednosť bez toho aby sa cítili byť pod tlakom.',

    strediskaHeadline: 'Naše strediská na rok 2026',
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error(
      '❌  Missing credentials.\n' +
      '    Set PAYLOAD_ADMIN_EMAIL and PAYLOAD_ADMIN_PASSWORD in .env.local',
    )
    process.exit(1)
  }

  console.log(`Connecting to Payload at ${BASE_URL}…`)
  const token = await login()
  console.log('✅  Authenticated.\n')

  // ── 1. Migrate Strediska ─────────────────────────────────────────────────
  console.log('── Strediská ────────────────────────────────────────')
  let created = 0
  let skipped = 0
  const total = STREDISKA.length

  for (let i = 0; i < STREDISKA.length; i++) {
    const s = STREDISKA[i]
    process.stdout.write(`[${i + 1}/${total}] ${s.name} (${s.id})… `)

    if (await slugExists(token, s.id)) {
      console.log('⚠️  already exists — skipped.')
      skipped++
      continue
    }

    const id = await createStredisko(token, buildStrediskoDoc(s))
    console.log(`✅  created (ID: ${id})`)
    created++
  }

  console.log(`\nStrediská done. Created: ${created}  Skipped: ${skipped}  Total: ${total}`)

  // ── 2. Update Global ──────────────────────────────────────────────────────
  console.log('\n── SkolyVPrirode Global ─────────────────────────────')
  process.stdout.write('Updating global skoly-v-prirode… ')
  await updateGlobal(token, buildGlobalDoc())
  console.log('✅  done.')

  console.log('\nMigration complete.')
}

main().catch((err: unknown) => {
  console.error('\n❌  Migration failed:', err instanceof Error ? err.message : err)
  process.exit(1)
})
