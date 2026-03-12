/**
 * Seeds the Homepage global in Payload CMS with all current hardcoded text content.
 *
 * What this seeds:
 *   - All text / textarea / number fields (hero, reviews, reasons, giveaway, FAQ, etc.)
 *
 * What this does NOT seed (assign these manually or run seed-homepage-media.ts):
 *   - heroVideo (upload)
 *   - stats[].icon (upload)
 *   - reviews[].photo (upload)
 *   - reasons[].photo (upload)
 *   - featuredCamps (relationship — pick in admin after seeding)
 *   - featuredSkoly (relationship — pick in admin after seeding)
 *   - giveawayCamps (relationship — pick in admin after seeding)
 *
 * Prerequisites:
 *   1. Dev server must be running: npm run dev
 *   2. .env.local must contain PAYLOAD_ADMIN_EMAIL and PAYLOAD_ADMIN_PASSWORD
 *
 * Run from the project root:
 *   npx tsx scripts/seed-homepage.ts
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

async function seedHomepage(token: string): Promise<void> {
  const payload = {
    // ─── Section 1: Hero ──────────────────────────────────────────────────────
    // heroVideo: assigned manually in admin (media already uploaded)
    subHeadline: 'BOMBOVO:',
    headline: 'Miesto kam sa vaše dieťa bude chcieť vrátiť',
    stats: [
      // icon: assigned manually in admin (hmmicon1.png, hmmicon2.png, hmmicon3.png)
      { number: '86%',     label: 'Návratnosť Detí' },
      { number: '50,000+', label: 'Detí Odanimovaných' },
      { number: '20+',     label: 'Rokov Skúseností' },
    ],

    // ─── Section 2: Reviews ───────────────────────────────────────────────────
    // photo: assigned manually in admin (Review1.JPG, review2.JPG, review3.JPG)
    reviews: [
      {
        badgeText: 'Letné Tábory 2025',
        reviewText:
          'Náš syn je už 7x veľmi spokojný a kamarátstva, ktoré si v tábore našiel, trvajú aj po jeho skončení. Budúce leto už pôjdeme jedine s vami. Máme odskúšaných viacero táborov, ale vy ste jediní, čo nás ani raz nesklamali.',
        reviewAuthor: 'Rodič Andrea D.',
      },
      {
        badgeText: 'Letné Tábory 2025',
        reviewText:
          'Ďakujeme za našu dcéru Lauru, za kopec zážitkov a starostlivosť. Bol to pre ňu úžasný týždeň prázdnin.',
        reviewAuthor: 'Dovičáková Martina',
      },
      {
        badgeText: 'Letné Tábory 2025',
        reviewText:
          'Dcérke sa v tábore veľmi páčilo. Aktivity, prístup animátorov bolo na jedničku, o rok sa chce vrátiť ku vám do tábora, už odpočítava dni. Ďakujeme.',
        reviewAuthor: 'Magdaléna R.',
      },
    ],
    reviewDisplaySeconds: 5,

    // ─── Section 3: Najpredávanejšie Tábory ───────────────────────────────────
    featuredCampsHeadline: 'Naše Najpredávanejšie Tábory V Roku 2026',
    // featuredCamps: pick Tanečná Planéta, Olymp Kemp, V Dračej Nore in admin

    // ─── Section 4: 4 Dôvody ──────────────────────────────────────────────────
    reasonsHeadline: '4 Dôvody Prečo ísť do Bombova',
    reasonsIntroHeadline: '86% Návratnosť Detí',
    reasonsIntroText:
      '„Môžem ísť znova?" To je najčastejšia veta, ktorú počujeme po tom, čo deti strávia len jeden týždeň v Bombove. Či už ide o školu v prírode alebo letný tábor…\n\nNaše strediská a animátori ponúkajú niečo, čo inde nenájdete. Deti, rodičia, ale aj učiteľky odchádzajú z našich stredísk očarení.',
    reasons: [
      // photo: assigned manually in admin (Secio3.1.JPG)
      {
        headline: '86% Návratnosť Detí',
        text: '„Môžem ísť znova?" To je najčastejšia veta, ktorú počujeme po tom, čo deti strávia len jeden týždeň v Bombove. Či už ide o školu v prírode alebo letný tábor…\n\nNaše strediská a animátori ponúkajú niečo, čo inde nenájdete. Deti, rodičia, ale aj učiteľky odchádzajú z našich stredísk očarení.',
      },
      // photo: assigned manually in admin (secion3.2.JPG)
      {
        headline: 'Žiadne Skryté Platby',
        text: 'Väčšina cestovných kancelárií vám ponúka základnú cenu za tábor bez pridaného výletu počas týždňa. Ak nechcete aby sa vaše dieťa nudilo, musíte si za tento výlet priplatiť.\n\nV Bombove platíte za celý tábor hneď a často lacnejšie ako inde. U nás sa ani bez príplatku nikto nudiť nebude!',
      },
      // photo: assigned manually in admin (Secion3.3.JPG)
      {
        headline: 'Školený a Skúsený Personál',
        text: 'Nám nie je jedno, kto sa bude starať o vaše deti. Od animátorov až po kuchárov zabezpečujeme, že náš personál prešiel výberovým konaním a školením.\n\nPráve preto máte istotu, že sú vaše deti v bezpečných a zodpovedných rukách.',
      },
      // photo: assigned manually in admin (Secion3.4.JPG)
      {
        headline: 'U Nás Záleží Na Kvalite!',
        text: 'Bombovo nie je veľká firma. Sme malá, kvalitou orientovaná firma, ktorej záleží hlavne na kvalite. Chceme, aby každé dieťa, ktoré k nám príde, dostalo lásku, zábavu a starostlivosť, ktorú si zaslúži.\n\nA robíme všetko preto, aby sa nám to podarilo.',
      },
    ],

    // ─── Section 5: Školy v Prírode ───────────────────────────────────────────
    skolyHeadline: 'Pozri Si Naše Školy V Prírode',
    // featuredSkoly: pick Stred Európy Krahule, Penzión Roháčan, Penzión Sabina in admin

    // ─── Section 6: Giveaway ──────────────────────────────────────────────────
    giveawayHeadline: 'Vyhraj tábor zadarmo!',
    giveawaySubHeadline:
      'Vyplň svoje meno, email a vyber si tábor, ktorý by si chcel vyhrať, a si zapojený do súťaže.',
    // giveawayCamps: pick camps in admin

    // ─── Section 7: FAQ ───────────────────────────────────────────────────────
    faqHeadline: 'Často Kladené Otázky',
    faqItems: [
      {
        question: 'Ako vám môžem veriť, keď sa môjmu dieťaťu inde v tábore nepáčilo?',
        answer:
          'Nie sme ako ostatné cestovné agentúry. Nám nejde len o čísla, ide nám hlavne o to, aby sa vaše dieťa bavilo a vrátilo sa domov šťastné. Preto sme na trhu už celých 20 rokov a ponúkame tábor v cene, ktorá zahŕňa skutočne všetko. Nechceme, aby sa vaše dieťa nudilo alebo cítilo sklamané. Od jedinečného programu plného aktivít až po každého člena nášho tímu – všetci sa snažíme, aby si vaše dieťa užilo celý pobyt u nás. Keď nám rodičia povedia "inde sa mu to nepáčilo," berieme to vážne a ukážeme im rozdiel.',
      },
      {
        question: 'Doplácam si výlety k táboru?',
        answer:
          'Nie. Cena každého tábora je konečná a zahŕňa všetko. Žiadne skryté poplatky, žiadne doplatky za aktivity či výlety. Ak chcete svojmu dieťaťu dopriať tábor, kde sa nebude nudiť a všetko je už zahrnuté v cene, Bombovo je tá správna voľba.',
      },
      {
        question: 'Dá sa strava prispôsobiť potrebám môjho dieťaťa?',
        answer:
          'Samozrejme. Či už ide o celiakiu, intoleranciu laktózy, vegetariánsku alebo vegánsku stravu, náš skúsený kuchársky tím vie pripraviť plnohodnotné jedlá pre každé dieťa. Stačí nám to uviesť do prihlášky a postaráme sa o to, aby vaše dieťa jedlo rovnako dobre ako všetci ostatní.',
      },
      {
        question: 'Je môj syn/dcéra dosť starý/á na týždenný tábor bez rodičov?',
        answer:
          'Každý náš tábor je vytvorený pre konkrétnu vekovú skupinu. Ak vaše dieťa patrí do danej vekovej kategórie, môžete si byť istí, že je dosť staré. Videli sme tisíce detí v tomto veku a vieme, že to zvládnu. Najčastejší problém nie je, či je dieťa pripravené, ale ako mu pomôcť prekonať počiatočný smútok po domove. Preto máme špeciálne pripravený program, ktorý deti tak zaujme, že na smútok rýchlo zabudnú. Už po prvom dni plnom hier, nových kamarátov a dobrodružstiev vaše dieťa zistí, že to zvládne úplne samo.',
      },
    ],
  }

  const res = await fetch(`${BASE_URL}/api/globals/homepage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify(payload),
  })
  const data = await res.json() as any
  if (data.errors) {
    console.error('❌ Failed to seed homepage:', JSON.stringify(data.errors, null, 2))
  } else {
    console.log('✅ Homepage global seeded successfully.')
    console.log('\nNext steps — assign these in the admin dashboard (/admin/globals/homepage):')
    console.log('  • Hero Video         → homepage2.2.mp4')
    console.log('  • Stats icons        → hmmicon1.png, hmmicon2.png, hmmicon3.png')
    console.log('  • Review photos      → Review1.JPG, review2.JPG, review3.JPG')
    console.log('  • Reason photos      → Secio3.1.JPG, secion3.2.JPG, Secion3.3.JPG, Secion3.4.JPG')
    console.log('  • Featured Camps     → Tanečná Planéta, Olymp Kemp, V Dračej Nore')
    console.log('  • Featured Školy     → Stred Európy Krahule, Penzión Roháčan, Penzión Sabina')
    console.log('  • Giveaway Camps     → pick all camps you want in the giveaway dropdown')
  }
}

async function main() {
  const token = await login()
  await seedHomepage(token)
  console.log('\nDone! Open /admin/globals/homepage to verify.')
}

main().catch((err: unknown) => {
  console.error('Error:', err)
  process.exit(1)
})
