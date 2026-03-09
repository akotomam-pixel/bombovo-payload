/**
 * One-time lookup script: list all camps (ZajezdList) from ProfisXML
 * and print each termin with its id_Termin, name, and dates.
 *
 * Usage:
 *   npx tsx scripts/list-profis-terminy.ts
 *
 * This output lets you fill in "Profis Term ID" for each date in Payload admin.
 */

import 'dotenv/config'

const NS = 'http://xml.profis.profitour.cz'
const API_BASE = process.env.PROFIS_API_BASE ?? 'https://xml.bombovo.sk/API/v1'
const PROXY_URL = process.env.PROFIS_PROXY_URL ?? ''
const PROXY_SECRET = process.env.PROFIS_PROXY_SECRET ?? ''

async function soapCall(service: string, method: string, bodyXml: string): Promise<string> {
  const endpoint = `${API_BASE}/${service}.svc`
  const soapAction = `${NS}/${service}/${method}`

  const envelope = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="${NS}">
  <soapenv:Body>
    <ns:${method}>
      ${bodyXml}
    </ns:${method}>
  </soapenv:Body>
</soapenv:Envelope>`

  const res = await fetch(`${PROXY_URL}?target=${encodeURIComponent(endpoint)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: soapAction,
      'X-Proxy-Secret': PROXY_SECRET,
    },
    body: envelope,
  })

  const text = await res.text()
  if (!res.ok) throw new Error(`Proxy error ${res.status}: ${text.slice(0, 300)}`)
  return text
}

function context(): string {
  return `
    <Context>
      <UzivatelLogin>${process.env.PROFIS_LOGIN}</UzivatelLogin>
      <UzivatelHeslo>${process.env.PROFIS_HESLO}</UzivatelHeslo>
      <id_Jazyk>${process.env.PROFIS_ID_JAZYK}</id_Jazyk>
      <id_Republika>${process.env.PROFIS_ID_REPUBLIKA}</id_Republika>
      <Rezim>${process.env.PROFIS_REZIM}</Rezim>
      <VypsatNazvy>true</VypsatNazvy>
    </Context>`
}

function extractAll(xml: string, tag: string): string[] {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'g')
  const results: string[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(xml)) !== null) results.push(m[1].trim())
  return results
}

function extractTag(xml: string, tag: string): string {
  return new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i').exec(xml)?.[1]?.trim() ?? ''
}

async function main() {
  console.log('Fetching ZajezdList from ProfisXML...\n')

  const xml = await soapCall(
    'Katalog',
    'ZajezdList',
    `${context()}
    <Filtr>
      <VseNezavisleNaStavu>false</VseNezavisleNaStavu>
    </Filtr>`,
  )

  if (xml.includes('<faultcode>') || xml.includes('<s:Fault>')) {
    const msg = xml.match(/<faultstring[^>]*>([^<]+)<\/faultstring>/)?.[1] ?? 'SOAP Fault'
    console.error('ProfisXML error:', msg)
    process.exit(1)
  }

  // Each <ZajezdInfo> block contains the trip and its termins
  const zajezdBlocks = extractAll(xml, 'ZajezdInfo')

  if (zajezdBlocks.length === 0) {
    console.log('No trips found. Raw response:\n', xml.slice(0, 1000))
    process.exit(0)
  }

  console.log(`Found ${zajezdBlocks.length} trips:\n`)

  for (const z of zajezdBlocks) {
    const nazev = extractTag(z, 'Nazev')
    console.log(`=== ${nazev} ===`)

    const terminBlocks = extractAll(z, 'TerminInfo')
    if (terminBlocks.length === 0) {
      console.log('  (no termins)\n')
      continue
    }

    for (const t of terminBlocks) {
      const id = extractTag(t, 'id_Termin')
      const od = extractTag(t, 'DatumOd')
      const do_ = extractTag(t, 'DatumDo')
      const stav = extractTag(t, 'StavNazev')
      const volnych = extractTag(t, 'VolnychMist')
      console.log(`  id_Termin: ${id.padEnd(6)} | ${od} – ${do_} | ${stav} | volných: ${volnych}`)
    }
    console.log('')
  }
}

main().catch((e) => {
  console.error('Script error:', e)
  process.exit(1)
})
