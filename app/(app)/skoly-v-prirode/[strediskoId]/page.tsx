import { getPayloadClient } from '@/lib/payload'
import { getStrediskoById } from '@/data/strediska'
import StrediskoDetailClient from './StrediskoDetailClient'
import type { StrediskoDetailData } from './StrediskoDetailClient'

// ─── Default hardcoded accordion content (shared across all strediska) ────────
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

// ─── Helper: extract URL from a Payload media object ─────────────────────────
function mediaUrl(field: unknown): string | undefined {
  if (typeof field === 'object' && field !== null && 'url' in field) {
    return (field as Record<string, any>).url as string
  }
  return undefined
}

// ─── Helper: map Payload doc to StrediskoDetailData ──────────────────────────
function mapPayloadToDetail(doc: Record<string, any>, strediskoId: string): StrediskoDetailData {
  const extractItems = (arr: any[]): string[] =>
    Array.isArray(arr) ? arr.map((i) => i.item ?? '').filter(Boolean) : []

  const heroGallery: StrediskoDetailData['heroGallery'] =
    Array.isArray(doc.heroGallery) && doc.heroGallery.length > 0
      ? doc.heroGallery.map((_: any, i: number) => {
          const url = mediaUrl(_.photo)
          return url
            ? { src: url, thumb: url }
            : { src: `https://picsum.photos/seed/${strediskoId}photo${i}/1200/800`, thumb: `https://picsum.photos/seed/${strediskoId}photo${i}/400/267` }
        })
      : Array.from({ length: 6 }, (_, i) => ({
          src: `https://picsum.photos/seed/${strediskoId}photo${i}/1200/800`,
          thumb: `https://picsum.photos/seed/${strediskoId}photo${i}/400/267`,
        }))

  return {
    id: doc.slug ?? strediskoId,
    name: doc.name ?? '',
    basePrice: doc.price ?? '',
    iconBullets: Array.isArray(doc.bulletPoints)
      ? doc.bulletPoints.map((b: any) => b.text ?? '').filter(Boolean)
      : [],
    heroGallery,
    section3: {
      headline: doc.section2Headline ?? '',
      bodyText: doc.section2Body ?? '',
      nearbyAttractions: extractItems(doc.zaujimavostiVOkoli),
    },
    programText:
      'V Cestovnej kancelárii Bombovo vás čaká týždeň na ktorý vy ani vaši žiaci len tak nezabudnú. Pripravili sme si pre vás unikátny program, ktorý spája mystiku, fyzickú aktivitu a cielené rozvíjanie kľúčových vlastností ako sú komunikácia, kreativita a kritické myslenie. Všetky školy v prírode sú vedené profesionálnym animačným tímom, ktorý sa postará o váš komfort a organizáciu celého týždňa.',
    detaily: {
      ubytovanie:              extractItems(doc.ubytovanie),
      vybavenieStrediska:      extractItems(doc.vybavenieStrediska),
      zaujimavostiVOkoli:      extractItems(doc.zaujimavostiVOkoli),
      zlava:                   doc.zlava && doc.zlava.length                ? extractItems(doc.zlava)                   : DEFAULT_ZLAVA,
      doplnkoveSluzby:         doc.doplnkoveSluzby && doc.doplnkoveSluzby.length ? extractItems(doc.doplnkoveSluzby)    : DEFAULT_DOPLNKOVE_SLUZBY,
      vZakladnejCene:          doc.vZakladnejCene && doc.vZakladnejCene.length   ? extractItems(doc.vZakladnejCene)     : DEFAULT_V_ZAKLADNEJ_CENE,
      vCeneZahrnute:           doc.vCeneZahrnute && doc.vCeneZahrnute.length     ? extractItems(doc.vCeneZahrnute)      : DEFAULT_V_CENE_ZAHRNUTE,
      vCeneAnimacnehoProgramu: doc.vCeneAnimacnehoProgramu && doc.vCeneAnimacnehoProgramu.length ? extractItems(doc.vCeneAnimacnehoProgramu) : DEFAULT_V_CENE_ANIMACNEHO_PROGRAMU,
      bombovyBalicek:          doc.bombovyBalicek && doc.bombovyBalicek.length   ? extractItems(doc.bombovyBalicek)     : DEFAULT_BOMBOVY_BALICEK,
    },
    dates: Array.isArray(doc.dates)
      ? doc.dates.map((d: any) => ({
          startDate: d.startDate ?? '',
          endDate:   d.endDate   ?? '',
          days:      typeof d.days === 'number' ? d.days : 5,
          price:     d.price     ?? '',
          available: typeof d.available === 'boolean' ? d.available : true,
        }))
      : [],
  }
}

// ─── Helper: map hardcoded StrediskoData to StrediskoDetailData ───────────────
function mapHardcodedToDetail(
  hc: ReturnType<typeof getStrediskoById>,
  strediskoId: string,
): StrediskoDetailData | null {
  if (!hc) return null
  return {
    id: hc.id,
    name: hc.name,
    basePrice: hc.basePrice,
    iconBullets: hc.iconBullets,
    heroGallery: Array.from({ length: 6 }, (_, i) => ({
      src: `https://picsum.photos/seed/${strediskoId}photo${i}/1200/800`,
      thumb: `https://picsum.photos/seed/${strediskoId}photo${i}/400/267`,
    })),
    section3: {
      headline: hc.section3.headline,
      bodyText: hc.section3.bodyText,
      nearbyAttractions: hc.section3.nearbyAttractions,
    },
    programText: hc.programText,
    detaily: {
      ubytovanie:              hc.detaily.ubytovanie,
      vybavenieStrediska:      hc.detaily.vybavenieStrediska,
      zaujimavostiVOkoli:      hc.detaily.zaujimavostiVOkoli,
      zlava:                   DEFAULT_ZLAVA,
      doplnkoveSluzby:         DEFAULT_DOPLNKOVE_SLUZBY,
      vZakladnejCene:          DEFAULT_V_ZAKLADNEJ_CENE,
      vCeneZahrnute:           DEFAULT_V_CENE_ZAHRNUTE,
      vCeneAnimacnehoProgramu: DEFAULT_V_CENE_ANIMACNEHO_PROGRAMU,
      bombovyBalicek:          DEFAULT_BOMBOVY_BALICEK,
    },
    dates: hc.dates.map((d) => ({
      startDate: d.startDate,
      endDate:   d.endDate,
      days:      d.days,
      price:     d.price,
      available: d.available,
    })),
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function StrediskoDetailPage({
  params,
}: {
  params: Promise<{ strediskoId: string }>
}) {
  const { strediskoId } = await params

  let detailData: StrediskoDetailData | null = null

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'strediska',
      where: { slug: { equals: strediskoId } },
      limit: 1,
      depth: 1,
    })
    if (result.docs.length > 0) {
      detailData = mapPayloadToDetail(result.docs[0] as Record<string, any>, strediskoId)
    }
  } catch {
    // Payload unavailable — fall through to hardcoded
  }

  if (!detailData) {
    detailData = mapHardcodedToDetail(getStrediskoById(strediskoId), strediskoId)
  }

  if (!detailData) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-bold">Stredisko nenájdené</p>
      </main>
    )
  }

  return <StrediskoDetailClient data={detailData} />
}
