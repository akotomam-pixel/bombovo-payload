import { getPayloadClient } from '@/lib/payload'
import SkolyVPrirodClient from './SkolyVPrirodClient'
import type { SkolyVPrirodPageData, ReviewData, CenterData, Section3Block } from './SkolyVPrirodClient'

// ─── Hardcoded fallbacks ──────────────────────────────────────────────────────

const HARDCODED_REVIEWS: ReviewData[] = [
  {
    content: 'Spokojnosť so všetkým, výborný program, ktorý bavil deti aj nás učiteľky, dobrá spolupráca, ochota, ústretovosť.',
    author: 'ZŠ Odborárska, Bratislava',
  },
  {
    content: 'Práca animátorov bola na vysokej úrovni, vyzdvihujeme empatiu voči našim deťom, nadmieru boli nápomocní pri každej aktivite aj bežných činnostiach.',
    author: 'MŠ SNP, Ivanka pri Dunaji',
  },
  {
    content: 'ŠvP sme si užili, animátori boli ochotní pomáhať nám aj mimo svojich animačných aktivít, čo nám uľahčovalo našu prácu. Hry pre deti boli neobvyklé, originálne a zábavné no super.',
    author: 'ZŠ Topoľová, Nitra',
  },
]

const HARDCODED_SECTION3: [Section3Block, Section3Block, Section3Block] = [
  {
    headline: 'Overené strediská, ktoré spĺňajú všetky hygienické normy',
    body: 'V CK Bombovo spolupracujeme iba so strediskami, ktoré spĺňajú stanovené požiadavky na komfort, hygienu, vybavenie a sú dlhodobo overené školami a učiteľmi z celého Slovenska.\n\nNaši animátori komunikujú s vedením strediska a s kuchyňou a ak niečo nefunguje rieši to náš tím a nie učitelia. U nás je ubytovanie a strava istota, nie lotéria!',
    photo: '',
  },
  {
    headline: 'Profesionálny a zaškolený animačný tím',
    body: 'V Bombove nenájdete žiadnych amatérskych animátorov. Našich animátorov každoročne preškoľujeme, aby sme zariadili, že váš turnus bude mať naozaj hladký priebeh. Program má pevný rytmus a náš tím presne vie ako reagovať v každej situácii.\n\nNaše školy v prírode nie sú o neustálom dozore, ale o tom, že učiteľ má svoj profesionálny tím, na ktorý sa môže vždy spoľahnúť.',
    photo: '',
  },
  {
    headline: 'Unikátny program, ktorý nikde inde nenájdete',
    body: 'Najväčšou úľavou pre učiteľa je keď zistí, že na škole v prírode nemusí nič zachraňovať. Naše aktivity držia deti od prvého dňa pokope a každá časť dňa na seba prirodzene nadväzuje.\n\nNejde teda o sled náhodných hier, ale o mystický príbeh, pomocou ktorého sa deti učia spolupracovať, dôverovať si a preberať zodpovednosť bez toho, aby sa cítili byť pod tlakom. Naše školy v prírode tak nekončia príchodom do školy, ale zanechajú v deťoch cenné skúsenosti a spoločné zážitky, ktoré v nich zostanú navždy.',
    photo: '',
  },
]


// ─── Helper: pull URL from a Payload media relation ──────────────────────────
function mediaUrl(field: unknown): string | undefined {
  if (typeof field === 'object' && field !== null && 'url' in field) {
    return (field as Record<string, any>).url as string
  }
  return undefined
}

export default async function SkolyVPrirodePage() {
  let data: SkolyVPrirodPageData = {
    headline: 'Školy v prírode',
    headlineHighlight: 'Ktoré učiteľky milujú',
    bodyText:
      'U nás v Cestovnej kancelárii Bombovo žiaci zažijú dni plné zmysluplných zážitkov a učitelia si doprajú zaslúžený oddych. Od ubytovania, stravy až po program a bezpečnosť detí funguje všetko plynule.',
    reviews: HARDCODED_REVIEWS,
    section3: HARDCODED_SECTION3,
    strediskaHeadline: 'Naše strediská na rok 2026',
    centers: [],
  }

  try {
    const payload = await getPayloadClient()

    // ── Fetch global ──────────────────────────────────────────────────────────
    const global = await payload.findGlobal({ slug: 'skoly-v-prirode', depth: 1 }) as Record<string, any>

    if (global.headline)          data.headline          = global.headline
    if (global.headlineHighlight) data.headlineHighlight = global.headlineHighlight
    if (global.bodyText)          data.bodyText          = global.bodyText
    if (global.strediskaHeadline) data.strediskaHeadline = global.strediskaHeadline

    if (Array.isArray(global.reviews) && global.reviews.length > 0) {
      data.reviews = global.reviews.map((r: any) => ({
        content: r.content ?? '',
        author:  r.author  ?? '',
        photo:   mediaUrl(r.photo),
      }))
    }

    const blocks: Array<{ headlineKey: string; bodyKey: string; photoKey: string }> = [
      { headlineKey: 'section3Headline',       bodyKey: 'section3Body',       photoKey: 'section3Photo'       },
      { headlineKey: 'section3Block2Headline', bodyKey: 'section3Block2Body', photoKey: 'section3Block2Photo' },
      { headlineKey: 'section3Block3Headline', bodyKey: 'section3Block3Body', photoKey: 'section3Block3Photo' },
    ]
    const payloadSection3 = blocks.map(({ headlineKey, bodyKey, photoKey }, i) => ({
      headline: global[headlineKey] ?? HARDCODED_SECTION3[i].headline,
      body:     global[bodyKey]     ?? HARDCODED_SECTION3[i].body,
      photo:    mediaUrl(global[photoKey]) ?? '',
    })) as [Section3Block, Section3Block, Section3Block]
    data.section3 = payloadSection3

    // ── Fetch strediska from Strediska collection ─────────────────────────────
    const strediskaResult = await payload.find({ collection: 'strediska', limit: 50, depth: 1 })
    if (strediskaResult.docs.length > 0) {
      data.centers = strediskaResult.docs.map((doc: any) => {
        const galleryUrl = Array.isArray(doc.heroGallery)
          ? mediaUrl(doc.heroGallery[0]?.photo)
          : undefined
        return {
          id:    doc.slug  ?? '',
          name:  doc.name  ?? '',
          price: doc.price ?? '',
          image: mediaUrl(doc.cardImage) ?? galleryUrl ?? '',
        }
      })
    }
  } catch {
    // Payload unavailable — use full hardcoded fallback (already set above)
  }

  return <SkolyVPrirodClient data={data} />
}
