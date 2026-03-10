/**
 * One-time lookup script: list all camps and their termins from ProfisXML
 *
 * Usage:
 *   npx tsx scripts/list-profis-terminy.ts
 *
 * Output: for each camp, each termin with its id_Termin and dates.
 * Use this to fill in "Profis Term ID" for each date in Payload admin.
 */

import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const NS = 'http://xml.profis.profitour.cz'
const API_BASE = process.env.PROFIS_API_BASE ?? 'https://xml.bombovo.sk/API/v1'
const PROXY_URL = process.env.PROFIS_PROXY_URL ?? ''
const PROXY_SECRET = process.env.PROFIS_PROXY_SECRET ?? ''

if (!PROXY_URL) { console.error('ERROR: PROFIS_PROXY_URL not set'); process.exit(1) }
if (!PROXY_SECRET) { console.error('ERROR: PROFIS_PROXY_SECRET not set'); process.exit(1) }
if (!process.env.PROFIS_LOGIN) { console.error('ERROR: PROFIS_LOGIN not set'); process.exit(1) }

async function soapCall(service: string, method: string, bodyXml: string): Promise<string> {
  const endpoint = `${API_BASE}/${service}.svc/basics`
  const envelope = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="${NS}">
  <soapenv:Body><ns:${method}>${bodyXml}</ns:${method}></soapenv:Body>
</soapenv:Envelope>`

  const res = await fetch(`${PROXY_URL}?target=${encodeURIComponent(endpoint)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: `${NS}/${service}/${method}`,
      'X-Proxy-Secret': PROXY_SECRET,
    },
    body: envelope,
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`Proxy ${res.status}: ${text.slice(0, 200)}`)
  return text
}

function ctx(): string {
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
  const re = new RegExp(`<${tag}[\\s>][\\s\\S]*?<\\/${tag}>`, 'g')
  return xml.match(re) ?? []
}

function extractTag(xml: string, tag: string): string {
  return new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`).exec(xml)?.[1]?.trim() ?? ''
}

async function main() {
  console.log('Fetching all trips from ProfisXML...\n')

  // Step 1: get trip list
  const zajezdXml = await soapCall('Katalog', 'ZajezdList', `
    ${ctx()}
    <ns:Criteria><ns:JenAktivni>false</ns:JenAktivni></ns:Criteria>`)

  const trips = extractAll(zajezdXml, 'Zajezd')
  if (!trips.length) {
    console.log('No trips found.')
    process.exit(0)
  }

  console.log(`Found ${trips.length} trips. Fetching termins for each...\n`)

  for (const z of trips) {
    const id_Zajezd = extractTag(z, 'ID')
    // Strip nested <Hotely> block so extractTag('Nazev') gets the camp name, not the hotel name
    const zWithoutHotely = z.replace(/<Hotely[\s\S]*?<\/Hotely>/, '')
    const campName = extractTag(zWithoutHotely, 'Nazev') || `(id ${id_Zajezd})`
    const id_ZajezdHotel = extractTag(z, 'ZajezdHotel')
      ? (extractAll(z, 'ZajezdHotel')[0] ? extractTag(extractAll(z, 'ZajezdHotel')[0], 'ID') : '')
      : ''

    console.log(`=== ${campName} (id_Zajezd: ${id_Zajezd}) ===`)

    try {
      const detailXml = await soapCall('Katalog', 'ZajezdDetail', `
        ${ctx()}
        <ns:ID>${id_Zajezd}</ns:ID>`)

      const termins = extractAll(detailXml, 'Termin')

      if (!termins.length) {
        // Check if <Termin exists anywhere in full XML (might be beyond our truncation)
        const terminIdx = detailXml.indexOf('<Termin')
        if (terminIdx >= 0) {
          // Termins ARE in the XML but extractAll missed them — show context
          console.log(`  FOUND <Termin at pos ${terminIdx}: ${detailXml.slice(terminIdx, terminIdx + 400)}`)
        } else {
          console.log(`  NO <Termin tag found in response at all. Total XML length: ${detailXml.length}`)
          // Show last 400 chars to see what fields are at the end
          console.log(`  XML end: ...${detailXml.slice(-400)}`)
        }
      } else {
        for (const t of termins) {
          const id = extractTag(t, 'id_Termin') || extractTag(t, 'ID')
          const od = extractTag(t, 'DatumOd')
          const doo = extractTag(t, 'DatumDo')
          const stav = extractTag(t, 'Stav') || extractTag(t, 'StavNazev')
          const volnych = extractTag(t, 'VolnychMist')
          const hotely = extractAll(t, 'ZajezdHotel')
          const hotel = hotely.length ? extractTag(hotely[0], 'ID') : id_ZajezdHotel
          console.log(`  id_Termin: ${String(id).padEnd(6)} | ${od} – ${doo} | stav: ${stav} | volných: ${volnych} | id_ZajezdHotel: ${hotel}`)
        }
      }
    } catch (e) {
      console.log(`  ERROR fetching detail: ${e instanceof Error ? e.message : e}`)
    }
    console.log('')
  }
}

main().catch((e) => { console.error('Script error:', e); process.exit(1) })
