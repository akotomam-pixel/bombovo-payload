/**
 * Adds 3 real reviews to each of the 17 camps via Payload REST API.
 *
 * Prerequisites:
 *   1. Dev server must be running: npm run dev
 *   2. .env.local must contain PAYLOAD_ADMIN_EMAIL and PAYLOAD_ADMIN_PASSWORD
 *
 * Run from the project root:
 *   npx tsx scripts/add-reviews.ts
 */

import { config as loadDotenv } from 'dotenv'
import path from 'path'

loadDotenv({ path: path.resolve(process.cwd(), '.env.local') })

const BASE_URL = process.env.PAYLOAD_URL || 'http://localhost:3000'
const EMAIL    = process.env.PAYLOAD_ADMIN_EMAIL!
const PASSWORD = process.env.PAYLOAD_ADMIN_PASSWORD!

interface Review {
  text: string
  author: string
}

const REVIEWS: Record<string, Review[]> = {
  'olymp-kemp': [
    {
      text: 'Tešíme sa o rok znova. Tentokrát pôjde syn k vám aj v júli, aj v auguste. Nejdeme už skúšať iné tábory, ste najlepší a určite odporúčame každému. Žiadna nuda a skvelý prístup k deťom.',
      author: 'Diana D.',
    },
    {
      text: 'Náš syn je už 7x veľmi spokojný a kamarátstva, ktoré si v tábore našiel, trvajú aj po jeho skončení. Budúce leto už pôjdeme jedine s vami. Máme odskúšaných viacero táborov, ale vy ste jediní, čo nás ani raz nesklamali.',
      author: 'Andrea D.',
    },
    {
      text: 'Dcérka bola prvý krat v tábore a vrátila sa úplne nadšená. Všetko si chválila ubytovanie, stravu, program, animátorov. O rok chce isť určite znova.',
      author: 'Alexandra B.',
    },
  ],

  'fest-animator-fest': [
    {
      text: 'Fest Animátor Fest je najlepší tábor na celom svete. Je to tábor kde sa ľudia spoznávajú, zabávajú a nepotrebujú k tomu žiadne moderné vecičky. Už som na Feste 2-krát a určite som ešte neskončil. Za týchto 9 dní som veľa toho pochopil a som za to vďačný všetkým ľuďom ktorý boli so mnou na Feste. A preto vám patrí veľké ĎAKUJEM!!!',
      author: 'Branislav B.',
    },
    {
      text: 'Fest animátorfest, syn neskutočne nadšený, super animátori, srandisti, vedeli sa baviť a zároveň mali u detí autoritu. Veľmi dobre jedlo, zábava, výber hier, veľa smiechu. Tak nadšený, že chce o rok ísť Znova. Odporúčame.',
      author: 'Martina Bienská Šimová',
    },
    {
      text: 'Fest je proste najlepší. Mojich najkrajší 9 dní v živote prežitých s najlepšími ľudmi. Určite tam prídeme nabudúci rok zas a dúfam zme sa všetci stretneme. A za týchto 9 dní chcem všetkým povedať OBROVSKÉ ĎAKUJEM buď animátorom alebo kamarátom. Najlepšie aktivity, super zábava.',
      author: 'Nina M.',
    },
  ],

  'tanecna-planeta': [
    {
      text: 'Dcérke sa v tábore veľmi páčilo. Aktivity, prístup animátorov bolo na jedničku, o rok sa chce vrátiť ku vám do tábora, už odpočítava dni. Ďakujeme.',
      author: 'Rodič dieťaťa',
    },
    {
      text: 'Dcéra bola maximálne spokojná vraj najlepši tábor na svete o rok ide znova ale na dlhší turnus.',
      author: 'Nina N.',
    },
    {
      text: 'Dieťa maximálne spokojné, čo viac si priať, budúci rok to bombovo ísť zas 👍 ďakujeme.',
      author: 'Alexandra S.',
    },
  ],

  'babinec': [
    {
      text: 'Dcérka sa vrátila z Babinca nielen plná zážitkov, ale aj sebavedomejšia. Veľmi sa jej páčili workshopy, kde si mohla vyskúšať nové veci, a veľmi sa jej páčil priateľský prístup animátoriek. Perfektný tábor pre dievčatá!',
      author: 'Rodič dieťaťa',
    },
    {
      text: 'Po vašich táboroch sú moje decká vždy tak nadšené, že im až závidím. Animátori sú perfektní, vieme porovnať nakoľko raz bol syn cez inú cestovku a nikdy viac. Ste pre nás zaručene každoročne jediná voľba.',
      author: 'Lucy H. J.',
    },
    {
      text: 'Dcéra bola v tábore prvý krát. Nevedeli sme čo ju čaká. Keď som po týždni prišla po ňu, zahlásila mi: "Mami bolo super o rok idem na dva týždne." Ďakujem animátorom, že prvý zážitok z tábora má taký skvelý.',
      author: 'Slavomíra B.',
    },
  ],

  'tajomstvo-basketbaloveho-pohara': [
    {
      text: 'Najlepšia cestovka deti sú vždy nad mieru spokojné a plné zážitkov.',
      author: 'Lukáš Ž.',
    },
    {
      text: 'Podľa vyjadrenia mojich detí tam bolo super. Veľmi dokonalý a profesionálny prístup animátorov. Zaujali deti počas celého trvania pobytu. (nechýbali im ani mobily) Rád využijem služby CK aj na budúci rok.',
      author: 'František A.',
    },
    {
      text: 'Moja dcéra bola tretí krát, o ničom inom nepočúvame, len ako bolo super, ako by sa vrátila, celý turnus na čele so všetkými animátormi majú 5*****. Pre ňu úžasný čas strávený v spoločnosti super ľudí, pre rodiča spokojnosť nadovšetko. Ďakujeme.',
      author: 'Martina S.',
    },
  ],

  'trhlina': [
    {
      text: 'Môj syn sa vrátil z tábora v sobotu a bez nálady, v momente som nevedela čo sa deje veď on chcel ísť, že sa mu páčilo aj minulý rok. Nakoniec mi povedal, "mamina, ten týždeň je veľmi krátka doba" na budúce idem na 2 týždne! — aha takže bol smutný kvôli tomu, že mu to rýchlo ubehlo, veľmi-veľmi sa mu páčilo!!! Ďakujeme pekne za krásne zážitky!!!',
      author: 'Mária J. M.',
    },
    {
      text: 'Organizácia a dobre zohratí kolektív animátorov. Chlapci prišli veľmi spokojný. Práca animátorov bola veľmi dobrá, stále mali zaujímavé činnosti.',
      author: 'František A.',
    },
    {
      text: 'Syn niekoľkokrát navštívil Váš detský tábor a vždy bol veľmi spokojný. Páčili sa mu tvorivé dielne, výlety, celkový program, prístup animátorov a v neposlednom rade aj strava. Uvítal by keby mohol byť aj dlhšie ako týždeň. Nevie sa dočkať kedy pôjde opäť. Nahovoril tiež aj svojich menších súrodencov, ktorí sú vychystaní na budúce leto ísť s ním. Ešte raz ďakujeme za prístup a pekné zážitky.',
      author: 'Daniela Š.',
    },
  ],

  'ready-player-one': [
    {
      text: 'Deti boli tento rok už 3-tí krát, vždy si pochvaľujú, je to výborný tábor, určite odporúčam.',
      author: 'Vierka G.',
    },
    {
      text: 'Syn chodí s Bombovom už 4 roky a vždy je veľmi spokojný, skvelí animátori, perfektný táborový program, kopa zaujímavých výletov... takže za nás TOPka a odporúčame 😀🤗😘',
      author: 'Alena S. B.',
    },
    {
      text: 'Perfektný tábor, odporúčam, o dieťa perfektne postarané po celý týždeň. A hlavne žiaden signál. :)',
      author: 'Lili B.',
    },
  ],

  'v-dracej-nore': [
    {
      text: 'Čím viac chalani rozprávajú o tábore, tým viac som vďačná za naše spoločné rozhodnutie dať ich práve sem. Asi najlepším zhodnotením ich pocitov je odpoveď na otázku: A keby ste mohli ísť opäť do tábora Bombovo, ešte tieto prázdniny, šli by ste? Jednoznačná odpoveď. ÁNO! Za mňa len samé plusy: bezprostrednosť animátorov, každý deň v prírode, výlety, nápady, atmosféra... spokojnosť. Ďakujeme!',
      author: 'Zuzka H.',
    },
    {
      text: 'Ďakujem veľmi pekne za nové super zážitky. Je to najlepší tábor na svete!!',
      author: 'Liana S.',
    },
    {
      text: 'Overená CK, deti vždy spokojné, perfektný personál, úžasné aktivity.',
      author: 'Melita N.',
    },
  ],

  'anglicke-leto': [
    {
      text: 'Každý rok sa teším na leto v Bombove pretože si tam viem super oddýchnuť, zabaviť sa na BOMBY a spoznať nových ľudí je to ako moja druhá rodina. Odporúčam vyskúšať tábory BOMBOVO lebo tam je vždy BOMBOVO.',
      author: 'Sofi Š.',
    },
    {
      text: 'Ďakujem za vrátenie zdravých a šťastných detí ktoré prvý krát absolvovali tábor Bombovo. Moja dcéra po prvý krát aj keď to bolo občas z plačom ale zvládla to na výbornú aj so sesterkou odkazujú že o rok sa k vám vrátia zase. Ešte raz vďaka, skvelý tábor.',
      author: 'Monika K. P.',
    },
    {
      text: 'Je to Najlepší Tábor! ❤',
      author: 'Adéla T.',
    },
  ],

  'neverfort': [
    {
      text: 'Ďakujem za svoje deti, ktoré boli prvýkrát v tábore. Skvele ste sa o nich postarali. Na animátorov som počula len samú chválu. Prišli s kopou nových zážitkov. Teodor (futbalista) a Silvia (Sisi) pôjdu určite aj budúci rok 🙂',
      author: 'Zuzana K.',
    },
    {
      text: 'Paráda, deti prvý krát v tábore, spokojné, vysmiate, plné zážitkov. Aj z fotiek vidieť že nuda nebola 🙂 Ďakujeme.',
      author: 'Zuzana S.',
    },
    {
      text: 'Tešíme sa o rok znova. Tentokrát pôjde syn k vám aj v júli, aj v auguste. Nejdeme už skúšať iné tábory, ste najlepší a určite odporúčame každému. Žiadna nuda a skvelý prístup k deťom.',
      author: 'Diana D.',
    },
  ],

  'chlapinec': [
    {
      text: 'Moji chalani boli u vás v tábore prvý krát, boli veľmi spokojný, určite pôjdu aj budúci rok.',
      author: 'Miroslava M.',
    },
    {
      text: 'Obrovská vďaka za skvelý tábor. Chlapci sa vrátili domov spokojní, šťastní, plní zážitkov. Boli ubytovaní v chatkách v Lomoch, maximálne spokojní, strava bola vraj skvelá, animátori tiež 👍. Robíte to výborne, robte to aj naďalej. Ďakujeme 😍',
      author: 'Antonia B.',
    },
    {
      text: 'Moji chalani boli u vás v tábore prvý krát, boli veľmi spokojný, určite pôjdu aj budúci rok.',
      author: 'Miroslava M.',
    },
  ],

  'artlantida': [
    {
      text: 'Naši synovia si zamilovali tábory Bombovo. Mladší tento rok trval na tom, že musí ísť na dva turnusy, má veľmi rád Artlantídu a ten starší zase nedá dopustiť na Fest Animator. Nadšení sú z programu, z prístupu animátorov k nim a z domácej stravy 👌 určite odporúčam.',
      author: 'Rodič dieťaťa',
    },
    {
      text: 'Jediný tábor v ktorom bol dva roky po sebe — veľká spokojnosť 👍🏻 animátori sú výborný 🤩',
      author: 'Zuzana Z.',
    },
    {
      text: 'Ďakujeme za zážitky, detská boli nadšené. Bol to ich prvý tábor, čo som sa bála. Ale dcérka povedala, že si tam našla druhú rodinu 😁🥰',
      author: 'Alena G.',
    },
  ],

  'stastna-plutva': [
    {
      text: 'Úprimne, mali sme obavy, keďže náš syn bol prvýkrát sám bez nás. Báli sme sa, ako to zvládne, ale hneď po príchode si našiel kamarátov a animátori sa oňho skvele postarali. Keď sme mu volali, mal plno zážitkov a domov prišiel šťastný. Sme radi, že sme ho prihlásili.',
      author: 'Katka T.',
    },
    {
      text: 'Ďakujeme za zážitky. Detská boli nadšené. Bol to ich prvý tábor, čo som sa bála, ale dcérka povedala, že si tam našla druhú rodinu 😁😍',
      author: 'Alena Gallová',
    },
    {
      text: 'Moja miska sa vrátila veľmi spokojná, chce ísť aj budúci rok. Má problém so spaním, každú noc k nám príde, preto som sa bála ako to zvládne v tábore — aj keď ona sa hotovala že to zvládne. Nezvládla to, budila sa každú noc a bála sa, ale animátor to zvládol a každú noc ju znovu uspal. Som za to veľmi vďačná :) Inak všetko ostatné super, kopec zážitkov, veľmi sa jej páčilo.',
      author: 'Lucik W.',
    },
  ],

  'kazdy-den-novy-zazitok': [
    {
      text: 'Naši chlapci prišli nadšení z táboru Každý deň nový zážitok. Názov táboru splnil ich očakávania a podľa ich slov naozaj každý deň zažili niečo nové. Najviac ich bavil pirátsky deň, kde mali rôzne súťaže a vyrábali si meče. Skvelý tábor, určite pôjdu znova!',
      author: 'Rodič dieťaťa',
    },
    {
      text: 'Dieťa maximálne spokojné, čo viac si priať, budúci rok to Bombovo ísť zas.',
      author: 'Alexandra S. K.',
    },
    {
      text: 'Môžem len odporúčať — dcéra bola prvý krát a páčilo sa jej a teší sa na ďalší rok 👍',
      author: 'Peter D.',
    },
  ],

  'z-bodu-nula-do-bodu-sto': [
    {
      text: 'Dnes prišiel môj syn domov, bol to jeho prvý tábor. Má kopec pekných zážitkov, je spokojný, dokonca by išiel aj o rok. Musím pochváliť zdravotníkov, lieky mu boli podávané pravidelne, za čo naozaj ďakujem! Animátorky si obľúbil, boli milé.',
      author: 'Katarína S.',
    },
    {
      text: 'Úprimne, mali sme obavy, keďže náš syn bol prvýkrát sám bez nás. Báli sme sa, ako to zvládne, ale hneď po príchode si našiel kamarátov a animátori sa oňho skvele postarali. Keď sme mu volali, mal plno zážitkov a domov prišiel šťastný. Sme radi, že sme ho prihlásili.',
      author: 'Rodič dieťaťa',
    },
    {
      text: 'Už 3. rok po sebe sme nadmieru spokojní, tábor so skvelými animátormi spĺňa naše očakávania, deti sa vždy vrátia s úžasnými zážitkami a so slovami aj o rok znova, ďakujeme.',
      author: 'Erika U.',
    },
  ],

  'woodkemp': [
    {
      text: 'Syn bol na 1. pobytovom tábore vo Wood kempe. Vrátil sa veľmi spokojný, plný zážitkov. Na stavbu bunkra, aktivity v peknom prostredí, výbornú stravu, vedúceho Jaja, nových kámošov bude rád spomínať. O rok sa určite do "bombového" tábora rád vráti.',
      author: 'Zuzana S.',
    },
    {
      text: 'Horský hotel Lomy, Woodkemp. Top animátori, o deti a mládež je výborne postarané. Spolupráca s agentúrou bez výhrad. O rok znova. Ďakujeme.',
      author: 'Nissis W.',
    },
    {
      text: 'Tábor "Woodcamp" sa veľmi páčil synovi. Trávili veľa času vonku a je presne preto, prečo som ho na tábor dala. Hry boli super, vraj na budúci rok musia vyraziť znova. Teším sa aj za neho.',
      author: 'Marika T.',
    },
  ],

  'expecto': [
    {
      text: 'Dcéra je veľký fanúšik Harryho Pottera, takže tento tábor bol pre ňu splnený sen. Hneď po návrate nám ukazovala „čarodejnícke" veci, ktoré si tam vyrobili, a plánuje ísť znova, no tentokrát aj s kamarátkou.',
      author: 'Rodič dieťaťa',
    },
    {
      text: 'Už druhý rok môžem Bombovo len odporučiť 😍 prvý rok tábor Harry Potter, tento rok Babinec. Dcéra prišla nadšená. Nádherné prostredie, super program, animátori, jedlo a čo je najdôležitejšie zážitky a spomienky 😍',
      author: 'Emma H.',
    },
    {
      text: 'Ďakujeme za krásny týždeň plný zážitkov, dnes sa syn vrátil z jeho 1. tábora v živote — Expecto — spokojný, už teraz mu chýbate a že o rok sa vidíte…',
      author: 'Janka B.',
    },
  ],
}

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

async function getCampBySlug(token: string, slug: string): Promise<{ id: string } | null> {
  const res = await fetch(`${BASE_URL}/api/camps?where[slug][equals]=${slug}&limit=1&depth=0`, {
    headers: { Authorization: `JWT ${token}` },
  })
  const data = await res.json() as any
  return data.docs?.[0] ?? null
}

async function updateReviews(token: string, campId: string, reviews: Review[], slug: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/camps/${campId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify({ reviews }),
  })
  const data = await res.json() as any
  if (data.errors) {
    console.error(`  ❌ Failed to update ${slug}:`, JSON.stringify(data.errors))
  } else {
    console.log(`  ✅ Reviews added to: ${slug}`)
  }
}

async function main() {
  const token = await login()

  for (const [slug, reviews] of Object.entries(REVIEWS)) {
    const camp = await getCampBySlug(token, slug)
    if (!camp) {
      console.warn(`  ⚠️  Camp not found in Payload for slug: ${slug} — skipping`)
      continue
    }
    await updateReviews(token, camp.id, reviews, slug)
  }

  console.log('\nDone! All reviews have been added.')
}

main().catch((err: unknown) => {
  console.error('Error:', err)
  process.exit(1)
})
