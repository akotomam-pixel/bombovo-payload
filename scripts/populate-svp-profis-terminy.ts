/**
 * Populates profisTerminId and id_ZajezdHotel for all strediskás in Payload
 * by matching their dates against ProfisXML termins.
 *
 * Usage:
 *   npx tsx scripts/populate-svp-profis-terminy.ts
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

async function fetchAllStrediska(token: string): Promise<any[]> {
  const res = await fetch(`${PAYLOAD_URL}/api/strediska?limit=100&depth=0`, {
    headers: { Authorization: `JWT ${token}` },
  })
  const data = await res.json()
  return data.docs ?? []
}

async function updateStredisko(token: string, id: number, dates: any[]): Promise<void> {
  const res = await fetch(`${PAYLOAD_URL}/api/strediska/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify({ dates }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`PATCH failed for stredisko ${id}: ${text.slice(0, 200)}`)
  }
}

// ─── Matching logic ───────────────────────────────────────────────────────────

// Map ProfisXML hotel name → id_ZajezdHotel (from ZajezdList response)
const HOTEL_TO_ZAJEZD_HOTEL: Record<string, number> = {
  'Horský hotel LOMY': 16,
  'Hotel ZUNA': 17,
  'Penzión Stred Európy Krahule': 18,
  'Penzión Sabina': 19,
  'Penzión Roháčan': 20,
  'Hotel Martinské Hole': 21,
  'Hotel Minciar': 22,
}

// Payload stredisko name → ProfisXML hotel name (fuzzy match for name differences)
const NAME_MAP: Record<string, string> = {
  // Exact matches
  'Hotel Martinské Hole': 'Hotel Martinské Hole',
  'Hotel Minciar': 'Hotel Minciar',
  'Penzión Sabina': 'Penzión Sabina',
  'Penzión Roháčan': 'Penzión Roháčan',
  // Payload uses "Horský Hotel Lomy" / ProfisXML uses "Horský hotel LOMY"
  'Horský Hotel Lomy': 'Horský hotel LOMY',
  'Horský hotel Lomy': 'Horský hotel LOMY',
  'Horský hotel LOMY': 'Horský hotel LOMY',
  // Payload uses "Horský Hotel Minciar" / ProfisXML uses "Hotel Minciar"
  'Horský Hotel Minciar': 'Hotel Minciar',
  // Payload uses "Stred Európy Krahule" / ProfisXML uses "Penzión Stred Európy Krahule"
  'Stred Európy Krahule': 'Penzión Stred Európy Krahule',
  'Penzión Stred Európy Krahule': 'Penzión Stred Európy Krahule',
  'Penzión Stred Európy': 'Penzión Stred Európy Krahule',
  // Payload uses "Hotel Zuna" / ProfisXML uses "Hotel ZUNA"
  'Hotel Zuna': 'Hotel ZUNA',
  'Hotel ZUNA': 'Hotel ZUNA',
}

interface ProfisTermin {
  id_Termin: number
  id_ZajezdHotel: number
  datumOd: string
}

// Convert "13.04.2026" → "2026-04-13"
function payloadDateToISO(d: string): string {
  const [day, month, year] = d.split('.')
  return `${year}-${month}-${day}`
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Step 1: Fetching all termins from ProfisXML (per hotel)...')

  const zajezdXml = await soap(
    'Katalog', 'ZajezdList',
    `${ctx()}<ns:Criteria><ns:JenAktivni>false</ns:JenAktivni></ns:Criteria>`,
  )
  const trips = extractAll(zajezdXml, 'Zajezd')
  console.log(`  Found ${trips.length} trips in ProfisXML`)

  // Build: ProfisXML hotel name → Map<dateKey, ProfisTermin>
  const hotelTermins = new Map<string, Map<string, ProfisTermin>>()

  for (const z of trips) {
    const id_Zajezd = getTag(z, 'ID')
    // Hotel name is the trip name minus the "škola v prírode " prefix
    const nazev = getTag(z, 'Nazev')
    const hotelName = nazev.replace(/^škola v prírode\s+/i, '').trim()
    const id_ZajezdHotel = HOTEL_TO_ZAJEZD_HOTEL[hotelName] ?? 0

    console.log(`  Fetching termins for: ${hotelName} (id_ZajezdHotel: ${id_ZajezdHotel})`)

    const detailXml = await soap('Katalog', 'ZajezdDetail', `${ctx()}<ns:ID>${id_Zajezd}</ns:ID>`)
    const termins = extractAll(detailXml, 'Termin')

    const dateMap = new Map<string, ProfisTermin>()
    for (const t of termins) {
      const id_Termin = Number(getTag(t, 'id_Termin') || getTag(t, 'ID'))
      const datumOd = getTag(t, 'DatumOd')
      if (id_Termin && datumOd) {
        const dateKey = datumOd.split('T')[0]
        dateMap.set(dateKey, { id_Termin, id_ZajezdHotel, datumOd })
      }
    }
    hotelTermins.set(hotelName, dateMap)
    console.log(`    → ${dateMap.size} termins`)
  }

  console.log('\nStep 2: Fetching strediskás from Payload...')
  const token = await payloadLogin()
  const strediska = await fetchAllStrediska(token)
  console.log(`  Found ${strediska.length} strediskás in Payload`)

  const matched: string[] = []
  const missing: string[] = []

  console.log('\nStep 3: Matching and updating...\n')

  for (const s of strediska) {
    const payloadName: string = s.name ?? ''
    const profisName = NAME_MAP[payloadName] ?? payloadName
    const id_ZajezdHotel = HOTEL_TO_ZAJEZD_HOTEL[profisName] ?? 0
    const dateMap = hotelTermins.get(profisName)

    console.log(`--- ${payloadName} → ProfisXML: "${profisName}" (id_ZajezdHotel: ${id_ZajezdHotel || '?'}) ---`)

    if (!dateMap) {
      console.log(`  ✗ No ProfisXML hotel matched for this stredisko name!`)
      console.log(`    Available ProfisXML hotels: ${[...hotelTermins.keys()].join(', ')}`)
      missing.push(`${payloadName}: no matching ProfisXML hotel (tried "${profisName}")`)
      console.log()
      continue
    }

    const dates: any[] = s.dates ?? []
    if (dates.length === 0) {
      console.log('  (no dates in Payload)\n')
      missing.push(`${payloadName}: no dates in Payload`)
      continue
    }

    let changed = false
    const updatedDates = dates.map((d: any) => {
      const startIso = payloadDateToISO(d.startDate ?? '')
      const termin = dateMap.get(startIso)

      if (termin) {
        console.log(`  ✓ ${d.startDate} → id_Termin: ${termin.id_Termin}`)
        matched.push(`${payloadName}: ${d.startDate} → ${termin.id_Termin}`)
        changed = true
        return { ...d, profisTerminId: termin.id_Termin, id_ZajezdHotel: termin.id_ZajezdHotel || id_ZajezdHotel }
      } else {
        console.log(`  ✗ ${d.startDate} (${startIso}) → NOT FOUND in ProfisXML`)
        missing.push(`${payloadName}: ${d.startDate} not in ProfisXML`)
        return { ...d, id_ZajezdHotel: id_ZajezdHotel || d.id_ZajezdHotel }
      }
    })

    if (changed || id_ZajezdHotel) {
      await updateStredisko(token, s.id, updatedDates)
      console.log(`  → Saved to Payload\n`)
    } else {
      console.log(`  → No matches, skipping\n`)
    }
  }

  console.log('\n═══════════════════════════════════')
  console.log(`MATCHED (${matched.length}):`)
  matched.forEach(m => console.log(`  ✓ ${m}`))
  console.log(`\nMISSING (${missing.length}):`)
  missing.forEach(m => console.log(`  ✗ ${m}`))
  console.log('═══════════════════════════════════')
}

main().catch(e => { console.error('Script error:', e); process.exit(1) })
