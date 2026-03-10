/**
 * Auto-populates profisTerminId, id_ZajezdHotel and registrationId for all
 * camps in Payload by matching each date's start date against ProfisXML termins.
 *
 * - profisTerminId  : id_Termin from ProfisXML (used for Profis API calls)
 * - id_ZajezdHotel  : id of the ZajezdHotel for the camp (used for Profis API calls)
 * - registrationId  : set to String(profisTerminId) so /prihlaska/<id> URLs work
 *
 * Usage:
 *   npx tsx scripts/populate-camps-profis-terminy.ts
 */

import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const NS = 'http://xml.profis.profitour.cz'
const API_BASE = process.env.PROFIS_API_BASE!
const PROXY_URL = process.env.PROFIS_PROXY_URL!
const PROXY_SECRET = process.env.PROFIS_PROXY_SECRET!
const PAYLOAD_URL = 'http://localhost:3000'
const PAYLOAD_EMAIL = process.env.PAYLOAD_ADMIN_EMAIL!
const PAYLOAD_PASSWORD = process.env.PAYLOAD_ADMIN_PASSWORD!

// ─── ProfisXML helpers ────────────────────────────────────────────────────────

async function soap(service: string, method: string, body: string): Promise<string> {
  const res = await fetch(
    `${PROXY_URL}?target=${encodeURIComponent(`${API_BASE}/${service}.svc/basics`)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        SOAPAction: `${NS}/${service}/${method}`,
        'X-Proxy-Secret': PROXY_SECRET,
      },
      body: `<?xml version="1.0"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="${NS}"><soapenv:Body><ns:${method}>${body}</ns:${method}></soapenv:Body></soapenv:Envelope>`,
    },
  )
  return res.text()
}

function ctx() {
  return `<ns:Context>
    <ns:UzivatelHeslo>${process.env.PROFIS_HESLO}</ns:UzivatelHeslo>
    <ns:UzivatelLogin>${process.env.PROFIS_LOGIN}</ns:UzivatelLogin>
    <ns:VypsatNazvy>false</ns:VypsatNazvy>
    <ns:id_Jazyk>${process.env.PROFIS_ID_JAZYK}</ns:id_Jazyk>
    <ns:id_Republika>${process.env.PROFIS_ID_REPUBLIKA}</ns:id_Republika>
    <ns:Rezim>${process.env.PROFIS_REZIM}</ns:Rezim>
  </ns:Context>`
}

function extractAll(xml: string, tag: string): string[] {
  return xml.match(new RegExp(`<${tag}[\\s>][\\s\\S]*?<\\/${tag}>`, 'g')) ?? []
}

function getTag(xml: string, tag: string): string {
  return new RegExp(`<${tag}[^>]*>([^<]+)<\\/${tag}>`).exec(xml)?.[1]?.trim() ?? ''
}

// ─── Payload helpers ──────────────────────────────────────────────────────────

async function payloadLogin(): Promise<string> {
  const res = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: PAYLOAD_EMAIL, password: PAYLOAD_PASSWORD }),
  })
  const data = await res.json()
  if (!data.token) throw new Error(`Payload login failed: ${JSON.stringify(data)}`)
  return data.token
}

async function fetchAllCamps(token: string): Promise<any[]> {
  const res = await fetch(`${PAYLOAD_URL}/api/camps?limit=100&depth=0`, {
    headers: { Authorization: `JWT ${token}` },
  })
  const data = await res.json()
  return data.docs ?? []
}

async function updateCamp(token: string, id: number, dates: any[]): Promise<void> {
  const res = await fetch(`${PAYLOAD_URL}/api/camps/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify({ dates }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`PATCH failed for camp ${id}: ${text.slice(0, 200)}`)
  }
}

// ─── Name normalisation ───────────────────────────────────────────────────────

// Profis name → Payload name variants (lowercase, no punctuation)
// We normalise both sides to compare
function normName(s: string): string {
  return s
    .toLowerCase()
    .replace(/[!?.,]/g, '')       // remove punctuation
    .replace(/\s+/g, ' ')
    .trim()
}

// Known Profis name → canonical key (handles typos in Profis)
const PROFIS_NAME_OVERRIDES: Record<string, string> = {
  'fest anumátor fest': 'fest animátor fest',   // typo in Profis
  'summer': 'summer adventure',                  // Profis uses short name
}

// Known Payload name → Profis normalised name (for cases where they differ)
const PAYLOAD_NAME_MAP: Record<string, string> = {
  'expecto patronum': 'expecto patronum',
  'olymp kemp': 'olymp kemp',
  'ready player one': 'ready player one',
  'šťastná plutva': 'šťastná plutva',
  'summer adventure': 'summer adventure',
  'summer advanture': 'summer adventure',        // typo in Payload
  'tajomstvo': 'tajomstvo zlatého basketbalového pohára',
  'tajomstvo zlatého basketbalového pohára': 'tajomstvo zlatého basketbalového pohára',
  'tajomstvo basketbalového pohára': 'tajomstvo zlatého basketbalového pohára', // missing "zlatého"
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Step 1: Fetching all letné tábory termins from ProfisXML...\n')

  const zajezdXml = await soap(
    'Katalog', 'ZajezdList',
    `${ctx()}<ns:Criteria><ns:JenAktivni>false</ns:JenAktivni></ns:Criteria>`,
  )
  const trips = extractAll(zajezdXml, 'Zajezd')
  console.log(`  Found ${trips.length} trips total in ProfisXML`)

  // Build:
  //   campTermins:     normalisedCampName → Map<startDateISO, id_Termin>
  //   campZajezdHotel: normalisedCampName → id_ZajezdHotel
  const campTermins     = new Map<string, Map<string, number>>()
  const campZajezdHotel = new Map<string, number>()

  for (const z of trips) {
    const id_Zajezd = getTag(z, 'ID')
    // Get camp name (strip <Hotely> block first so we get the camp Nazev, not hotel Nazev)
    const hotelysBlock = /<Hotely[\s\S]*?<\/Hotely>/.exec(z)?.[0] ?? ''
    const zClean = z.replace(/<Hotely[\s\S]*?<\/Hotely>/, '')
    const rawName = getTag(zClean, 'Nazev')
    if (!rawName) continue

    // Skip škola v prírode entries (they are handled by populate-svp-profis-terminy.ts)
    if (rawName.toLowerCase().includes('škola v prírode')) continue

    // Extract id_ZajezdHotel from the <Hotely> block
    const zajezdHotelBlock = extractAll(hotelysBlock, 'ZajezdHotel')[0] ?? ''
    const id_ZajezdHotel = zajezdHotelBlock ? Number(getTag(zajezdHotelBlock, 'ID')) : 0

    const detailXml = await soap('Katalog', 'ZajezdDetail', `${ctx()}<ns:ID>${id_Zajezd}</ns:ID>`)
    const termins = extractAll(detailXml, 'Termin')
    if (!termins.length) continue

    let normKey = normName(rawName)
    // Apply Profis name overrides (fix typos)
    normKey = PROFIS_NAME_OVERRIDES[normKey] ?? normKey

    if (id_ZajezdHotel) campZajezdHotel.set(normKey, id_ZajezdHotel)

    const dateMap = campTermins.get(normKey) ?? new Map<string, number>()
    for (const t of termins) {
      const id_Termin = Number(getTag(t, 'id_Termin') || getTag(t, 'ID'))
      const datumOd = getTag(t, 'DatumOd')
      if (id_Termin && datumOd) {
        dateMap.set(datumOd.split('T')[0], id_Termin)
      }
    }
    campTermins.set(normKey, dateMap)
    console.log(`  ${rawName} → "${normKey}" (${dateMap.size} termins, id_ZajezdHotel: ${id_ZajezdHotel || '—'})`)
  }

  console.log(`\nStep 2: Fetching camps from Payload...`)
  const token = await payloadLogin()
  const camps = await fetchAllCamps(token)
  console.log(`  Found ${camps.length} camps in Payload\n`)

  const matched: string[] = []
  const missing: string[] = []

  console.log('Step 3: Matching and updating...\n')

  for (const camp of camps) {
    const payloadName: string = camp.name ?? ''
    let normKey = normName(payloadName)
    normKey = PAYLOAD_NAME_MAP[normKey] ?? normKey

    const dateMap        = campTermins.get(normKey)
    const id_ZajezdHotel = campZajezdHotel.get(normKey) ?? 0

    console.log(`--- ${payloadName} → key: "${normKey}" (id_ZajezdHotel: ${id_ZajezdHotel || '—'}) ---`)

    if (!dateMap) {
      console.log(`  ✗ No Profis match found`)
      console.log(`    Available keys: ${[...campTermins.keys()].slice(0, 5).join(', ')}...`)
      missing.push(`${payloadName}: no Profis match (tried "${normKey}")`)
      console.log()
      continue
    }

    const dates: any[] = camp.dates ?? []
    if (!dates.length) {
      console.log('  (no dates in Payload)\n')
      missing.push(`${payloadName}: no dates`)
      continue
    }

    let changed = false
    const updatedDates = dates.map((d: any) => {
      // Convert "12.07.2026" or "2.8.2026" → "2026-07-12"
      const parts = (d.start ?? '').split('.')
      const startISO = parts.length === 3
        ? `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
        : ''
      const id_Termin = startISO ? dateMap.get(startISO) : undefined

      if (id_Termin) {
        console.log(`  ✓ ${d.start} → id_Termin: ${id_Termin}, id_ZajezdHotel: ${id_ZajezdHotel}`)
        matched.push(`${payloadName}: ${d.start} → termin:${id_Termin} hotel:${id_ZajezdHotel}`)
        changed = true
        return {
          ...d,
          profisTerminId: id_Termin,
          id_ZajezdHotel: id_ZajezdHotel || undefined,
          // Use profisTerminId as the URL key for /prihlaska/<id>
          registrationId: String(id_Termin),
        }
      } else {
        console.log(`  ✗ ${d.start} (${startISO}) → NOT FOUND in Profis (available: ${[...dateMap.keys()].join(', ')})`)
        missing.push(`${payloadName}: ${d.start} not in Profis`)
        return d
      }
    })

    if (changed) {
      await updateCamp(token, camp.id, updatedDates)
      console.log(`  → Saved to Payload\n`)
    } else {
      console.log(`  → No matches found, skipping\n`)
    }
  }

  console.log('\n═══════════════════════════════════')
  console.log(`MATCHED (${matched.length}):`)
  matched.forEach(m => console.log(`  ✓ ${m}`))
  console.log(`\nMISSING/UNMATCHED (${missing.length}):`)
  missing.forEach(m => console.log(`  ✗ ${m}`))
  console.log('═══════════════════════════════════')
}

main().catch(e => { console.error('Script error:', e); process.exit(1) })
