// SEO helpers for camp detail pages.
// Every camp page gets its own <title>, description and Event schema built from
// its data, so a new camp added in Payload is SEO-ready without extra work.
// CAMP_KEYWORD says what kind of camp it is in the words parents type into
// Google (see SEO/keywords/KEYWORD-PAGE-MAP), WITHOUT the season word — the
// season ("letný", "jesenný"…) is added from the month of the camp's first date.
// Camps missing here fall back to "tábor pre deti".
import type { CampDetailData } from '@/data/camps/types'

export const SITE_URL = 'https://www.bombovo.sk'

const CAMP_KEYWORD: Record<string, string> = {
  'anglicke-leto': 'anglický tábor',
  artlantida: 'umelecký tábor',
  babinec: 'tábor pre dievčatá',
  chlapinec: 'tábor pre chlapcov',
  expecto: 'čarodejnícky tábor',
  'fest-animator-fest': 'tábor pre teenagerov',
  'fest-halloween-fest': 'halloweensky tábor pre teenagerov',
  'halloween-na-lomoch': 'halloweensky tábor',
  'kazdy-den-novy-zazitok': 'tábor pre najmenších',
  neverfort: 'dobrodružný tábor',
  'olymp-kemp': 'športový tábor',
  'ready-player-one': 'herný tábor',
  'stastna-plutva': 'plavecký tábor',
  'tajomstvo-basketbaloveho-pohara': 'basketbalový tábor',
  'tanecna-planeta': 'tanečný tábor',
  trhlina: 'fantasy tábor',
  'v-dracej-nore': 'fantasy tábor',
  woodkemp: 'tábor v prírode',
  'zimny-fest-animator-fest': 'tábor pre teenagerov',
  'z-bodu-nula-do-bodu-sto': 'zážitkový tábor',
}

// "12.07.2026" -> Date (UTC noon to avoid timezone shifts)
export function parseCampDate(s: string | undefined): Date | null {
  const m = s?.match(/(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})/)
  return m ? new Date(Date.UTC(+m[3], +m[2] - 1, +m[1], 12)) : null
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function firstDate(details: CampDetailData): Date | null {
  return parseCampDate(details.section5?.dates?.[0]?.start)
}

// Season year = year of the camp's first date, otherwise the current year.
export function campYear(details: CampDetailData): number {
  return firstDate(details)?.getUTCFullYear() ?? new Date().getFullYear()
}

// Jun–Aug letný, Sep–Nov jesenný, Dec–Feb zimný, Mar–May jarný; no date -> letný.
function campSeason(details: CampDetailData): string {
  const d = firstDate(details)
  if (!d) return 'letný'
  const month = d.getUTCMonth() + 1
  if (month >= 6 && month <= 8) return 'letný'
  if (month >= 9 && month <= 11) return 'jesenný'
  if (month >= 3 && month <= 5) return 'jarný'
  return 'zimný'
}

// e.g. "letný tanečný tábor", "letný tábor pre dievčatá"
export function campKeyword(details: CampDetailData, campId: string): string {
  return `${campSeason(details)} ${CAMP_KEYWORD[campId] ?? 'tábor pre deti'}`
}

// "Pre deti vo veku 10 – 16 rokov" -> "10–16"
function ageRange(age: string): string {
  const m = age.match(/(\d+)\s*[-–]\s*(\d+)/)
  return m ? `${m[1]}–${m[2]}` : ''
}

function formatPrice(price: string | undefined): string {
  return (price ?? '').replace(/\s*€\s*/, ' €').trim()
}

// e.g. "Tanečná planéta – letný tanečný tábor 11–16 r. 2027 | Bombovo"
export function campTitle(details: CampDetailData, campId: string): string {
  const kw = campKeyword(details, campId)
  const age = ageRange(details.age)
  const year = campYear(details)
  const options = [
    ...(age ? [`${details.name} – ${kw} ${age} r. ${year} | Bombovo`] : []),
    `${details.name} – ${kw} ${year} | Bombovo`,
    `${details.name} – ${kw} ${year}`,
  ]
  return options.find((t) => t.length <= 65) ?? options[options.length - 1]
}

// "Babinec 2027 – letný tábor pre dievčatá, vek 10–16 rokov. Horský hotel Lomy.
//  <first bullet point> Cena od 349 €." — max ~155 chars. When too long the
// bullet point is shortened at a word so the price always stays at the end.
const DESCRIPTION_MAX = 155

export function campDescription(details: CampDetailData, campId: string): string {
  const age = ageRange(details.age)
  let head = `${details.name} ${campYear(details)} – ${campKeyword(details, campId)}`
  head += age ? `, vek ${age} rokov.` : '.'
  if (details.location) head += ` ${details.location.trim().replace(/\.$/, '')}.`

  const price = formatPrice(details.price)
  const tail = price ? ` Cena od ${price}.` : ''

  let bullet = (details.bulletPoints?.[0] ?? '').replace(/\s+/g, ' ').trim()
  if (bullet && !/[.!?…]$/.test(bullet)) bullet += '.'

  const room = DESCRIPTION_MAX - head.length - tail.length - 1
  if (bullet.length > room) {
    bullet = room > 20 ? bullet.slice(0, room - 1).replace(/[\s,;:–-]+\S*$/, '') + '…' : ''
  }
  const text = [head, bullet].filter(Boolean).join(' ') + tail
  // Safety net for unusually long names/locations.
  return text.length > DESCRIPTION_MAX + 5
    ? text.slice(0, DESCRIPTION_MAX - 1).replace(/\s+\S*$/, '') + '…'
    : text
}

// One schema.org Event per date, so Google sees real start/end dates.
export function campEventsJsonLd(details: CampDetailData, campId: string) {
  const url = `${SITE_URL}/letne-tabory/${campId}`
  const image = details.heroGallery?.[0]?.src
  const base = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${details.name} – ${campKeyword(details, campId)}`,
    description: details.bulletPoints?.[0] ?? '',
    url,
    ...(image ? { image: [image.startsWith('http') ? image : SITE_URL + image] } : {}),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: { '@type': 'Place', name: details.location, address: { '@type': 'PostalAddress', addressCountry: 'SK' } },
    organizer: { '@type': 'Organization', name: 'CK Bombovo', url: SITE_URL },
    ...(ageRange(details.age) ? { typicalAgeRange: ageRange(details.age).replace('–', '-') } : {}),
  }
  return (details.section5?.dates ?? []).flatMap((d) => {
    const start = parseCampDate(d.start)
    if (!start) return []
    const end = parseCampDate(d.end)
    const price = (d.discountedPrice || d.originalPrice || details.price || '').replace(/[^\d,.]/g, '').replace(',', '.')
    return [
      {
        ...base,
        startDate: isoDate(start),
        ...(end ? { endDate: isoDate(end) } : {}),
        offers: {
          '@type': 'Offer',
          url,
          ...(price ? { price, priceCurrency: 'EUR' } : {}),
          availability: d.vypredane ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
        },
      },
    ]
  })
}
