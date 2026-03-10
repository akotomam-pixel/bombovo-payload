import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const NS = 'http://xml.profis.profitour.cz'
const API_BASE = process.env.PROFIS_API_BASE!
const PROXY_URL = process.env.PROFIS_PROXY_URL!
const PROXY_SECRET = process.env.PROFIS_PROXY_SECRET!

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

function ctx(rezim = 'Web') {
  return `<ns:Context>
    <ns:UzivatelHeslo>${process.env.PROFIS_HESLO}</ns:UzivatelHeslo>
    <ns:UzivatelLogin>${process.env.PROFIS_LOGIN}</ns:UzivatelLogin>
    <ns:VypsatNazvy>false</ns:VypsatNazvy>
    <ns:id_Jazyk>${process.env.PROFIS_ID_JAZYK}</ns:id_Jazyk>
    <ns:id_Republika>${process.env.PROFIS_ID_REPUBLIKA}</ns:id_Republika>
    <ns:Rezim>${rezim}</ns:Rezim>
  </ns:Context>`
}

function extractAll(xml: string, tag: string) {
  return xml.match(new RegExp(`<${tag}[\\s>][\\s\\S]*?<\\/${tag}>`, 'g')) ?? []
}

function getTag(xml: string, tag: string) {
  return new RegExp(`<${tag}[^>]*>([^<]+)<\\/${tag}>`).exec(xml)?.[1]?.trim() ?? ''
}

async function main() {
  // Try ZajezdList with different Rezim modes
  for (const rezim of ['Web', 'WebOnline', 'CAOnline']) {
    console.log(`\n=== Rezim: ${rezim} ===`)
    try {
      const xml = await soap(
        'Katalog',
        'ZajezdList',
        `${ctx(rezim)}<ns:Criteria><ns:JenAktivni>false</ns:JenAktivni></ns:Criteria>`,
      )

      if (xml.includes('<faultstring>') || xml.includes('<faultcode>')) {
        const msg = /<faultstring[^>]*>([^<]+)/.exec(xml)?.[1]
        console.log(`  FAULT: ${msg}`)
        continue
      }

      const trips = extractAll(xml, 'Zajezd')
      console.log(`  ${trips.length} trips found`)
      trips.forEach((t) => {
        const id = getTag(t, 'ID')
        const name = getTag(t, 'Nazev')
        const katMatch = /<Katalog>[\s\S]*?<ID>(\d+)<\/ID>/.exec(t)
        console.log(`  [id=${id}] ${name} (katalog=${katMatch?.[1] ?? '?'})`)
      })
    } catch (e) {
      console.log(`  ERROR: ${e}`)
    }
  }

  // Try HledaniTerminu with empty filter to get ALL termins
  console.log('\n=== HledaniTerminu (all termins, no filter) ===')
  try {
    const xml = await soap('Katalog', 'HledaniTerminu', `${ctx()}<ns:Termin/>`)

    if (xml.includes('<faultstring>')) {
      console.log('FAULT:', /<faultstring[^>]*>([^<]+)/.exec(xml)?.[1])
    } else {
      const termins = extractAll(xml, 'TerminInfo')
      console.log(`${termins.length} termins found`)
      termins.forEach((t) => {
        const id = getTag(t, 'id_Termin') || getTag(t, 'ID')
        const name = getTag(t, 'Nazev')
        const od = getTag(t, 'DatumOd')
        const doo = getTag(t, 'DatumDo')
        console.log(`  id_Termin:${id} | ${od} – ${doo} | ${name}`)
      })
    }
  } catch (e) {
    console.log(`ERROR: ${e}`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
