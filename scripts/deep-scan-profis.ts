/**
 * Deep scan of ProfisXML — tries every possible method to find ALL available data,
 * including summer camps (letné tábory) if they exist.
 *
 * Usage:
 *   npx tsx scripts/deep-scan-profis.ts
 */

import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const NS = 'http://xml.profis.profitour.cz'
const API_BASE = process.env.PROFIS_API_BASE!
const PROXY_URL = process.env.PROFIS_PROXY_URL!
const PROXY_SECRET = process.env.PROFIS_PROXY_SECRET!

async function soap(service: string, method: string, body: string): Promise<string> {
  const url = `${PROXY_URL}?target=${encodeURIComponent(`${API_BASE}/${service}.svc/basics`)}`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: `${NS}/${service}/${method}`,
      'X-Proxy-Secret': PROXY_SECRET,
    },
    body: `<?xml version="1.0"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="${NS}"><soapenv:Body><ns:${method}>${body}</ns:${method}></soapenv:Body></soapenv:Envelope>`,
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} from proxy`)
  return res.text()
}

function ctx(rezim: string, vypsatNazvy = true) {
  return `<ns:Context>
    <ns:UzivatelHeslo>${process.env.PROFIS_HESLO}</ns:UzivatelHeslo>
    <ns:UzivatelLogin>${process.env.PROFIS_LOGIN}</ns:UzivatelLogin>
    <ns:VypsatNazvy>${vypsatNazvy}</ns:VypsatNazvy>
    <ns:id_Jazyk>${process.env.PROFIS_ID_JAZYK}</ns:id_Jazyk>
    <ns:id_Republika>${process.env.PROFIS_ID_REPUBLIKA}</ns:id_Republika>
    <ns:Rezim>${rezim}</ns:Rezim>
  </ns:Context>`
}

function extractAll(xml: string, tag: string): string[] {
  return xml.match(new RegExp(`<${tag}[\\s>][\\s\\S]*?<\\/${tag}>`, 'g')) ?? []
}

function getTag(xml: string, tag: string): string {
  return new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`).exec(xml)?.[1]?.trim() ?? ''
}

function hasFault(xml: string): string | null {
  const fault = /<faultstring[^>]*>([^<]+)<\/faultstring>/.exec(xml)?.[1]
  return fault ?? null
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const MODES = ['Web', 'WebOnline', 'CAOnline', 'CA', 'Online', '']
  const ACTIVE_VALUES = [true, false]

  console.log('╔══════════════════════════════════════════════════════════════╗')
  console.log('║  DEEP SCAN — ZajezdList across all Rezim modes              ║')
  console.log('╚══════════════════════════════════════════════════════════════╝\n')

  let totalFound = 0

  for (const rezim of MODES) {
    for (const jenAktivni of ACTIVE_VALUES) {
      const label = `Rezim="${rezim || '(empty)'}" JenAktivni=${jenAktivni}`
      try {
        const xml = await soap('Katalog', 'ZajezdList', `
          ${ctx(rezim)}
          <ns:Criteria>
            <ns:JenAktivni>${jenAktivni}</ns:JenAktivni>
          </ns:Criteria>`)

        const fault = hasFault(xml)
        if (fault) {
          console.log(`[${label}] FAULT: ${fault}`)
          continue
        }

        const trips = extractAll(xml, 'Zajezd')
        if (trips.length === 0) {
          // Try alternate element name
          const altTrips = extractAll(xml, 'ZajezdInfo')
          console.log(`[${label}] → ${trips.length} Zajezd + ${altTrips.length} ZajezdInfo`)
        } else {
          console.log(`[${label}] → ${trips.length} trips FOUND:`)
          for (const t of trips) {
            const id = getTag(t, 'ID')
            const nazev = getTag(t, 'Nazev')
            const typ = getTag(t, 'TypZajezdu') || getTag(t, 'Typ') || getTag(t, 'KategorieName') || '?'
            console.log(`    ID=${id}  ${nazev}  [typ: ${typ}]`)
            totalFound++
          }
        }
      } catch (e: any) {
        console.log(`[${label}] ERROR: ${e.message}`)
      }
    }
  }

  console.log('\n╔══════════════════════════════════════════════════════════════╗')
  console.log('║  DEEP SCAN — HledaniTerminu (search all termins directly)   ║')
  console.log('╚══════════════════════════════════════════════════════════════╝\n')

  for (const rezim of ['Web', 'WebOnline', 'CAOnline']) {
    try {
      const xml = await soap('Katalog', 'HledaniTerminu', `
        ${ctx(rezim)}
        <ns:Filtr>
          <ns:JenAktivni>false</ns:JenAktivni>
        </ns:Filtr>`)

      const fault = hasFault(xml)
      if (fault) {
        console.log(`[HledaniTerminu Rezim="${rezim}"] FAULT: ${fault}`)
        continue
      }

      const termins = extractAll(xml, 'Termin')
      console.log(`[HledaniTerminu Rezim="${rezim}"] → ${termins.length} termins`)
      if (termins.length > 0) {
        // Group by ZajezdNazev
        const groups = new Map<string, number[]>()
        for (const t of termins) {
          const nazev = getTag(t, 'ZajezdNazev') || getTag(t, 'Nazev') || getTag(t, 'id_Zajezd') || '?'
          const id = Number(getTag(t, 'id_Termin') || getTag(t, 'ID'))
          const arr = groups.get(nazev) ?? []
          arr.push(id)
          groups.set(nazev, arr)
        }
        for (const [name, ids] of groups) {
          console.log(`    ${name}: ${ids.length} termins (IDs ${Math.min(...ids)}–${Math.max(...ids)})`)
        }
      }
    } catch (e: any) {
      console.log(`[HledaniTerminu Rezim="${rezim}"] ERROR: ${e.message}`)
    }
  }

  console.log('\n╔══════════════════════════════════════════════════════════════╗')
  console.log('║  DEEP SCAN — Raw XML sample (ZajezdList Web, first 3000ch) ║')
  console.log('╚══════════════════════════════════════════════════════════════╝\n')

  try {
    const xml = await soap('Katalog', 'ZajezdList', `
      ${ctx('Web')}
      <ns:Criteria>
        <ns:JenAktivni>false</ns:JenAktivni>
      </ns:Criteria>`)
    console.log(xml.slice(0, 4000))
  } catch (e: any) {
    console.log('ERROR:', e.message)
  }

  console.log('\n═══════════════════════════════════════')
  console.log(`Total trip entries seen across all modes: ${totalFound}`)
  console.log('═══════════════════════════════════════')
}

main().catch(e => { console.error('Script error:', e); process.exit(1) })
