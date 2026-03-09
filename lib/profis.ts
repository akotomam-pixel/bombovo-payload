/**
 * ProfisXML SOAP helper
 *
 * All calls are routed through the PHP proxy at bombovo.sk so requests
 * originate from a fixed IP that ProfisXML has whitelisted.
 *
 * Namespace: http://xml.profis.profitour.cz
 * Services:
 *   Katalog    → https://xml.bombovo.sk/API/v1/Katalog.svc/basics
 *   Objednavka → https://xml.bombovo.sk/API/v1/Objednavka.svc/basics
 *
 * IMPORTANT: ALL elements in the SOAP body must carry the ns: prefix because
 * the schema uses elementFormDefault="qualified". Without the prefix, WCF
 * DataContractSerializer fails to deserialize the request.
 */

const NS = 'http://xml.profis.profitour.cz'
const API_BASE = process.env.PROFIS_API_BASE ?? 'https://xml.bombovo.sk/API/v1'
const PROXY_URL = process.env.PROFIS_PROXY_URL ?? ''
const PROXY_SECRET = process.env.PROFIS_PROXY_SECRET ?? ''

// ─── Credentials context injected into every SOAP call ────────────────────────
// Field order matches WCF DataContractSerializer order (base class fields first):
//   Context        → UzivatelHeslo, UzivatelLogin, VypsatNazvy, id_Jazyk
//   RepublikaContext → id_Republika
//   ProduktContext → Rezim

function ctx(vypsatNazvy = false): string {
  return `<ns:Context>
      <ns:UzivatelHeslo>${process.env.PROFIS_HESLO}</ns:UzivatelHeslo>
      <ns:UzivatelLogin>${process.env.PROFIS_LOGIN}</ns:UzivatelLogin>
      <ns:VypsatNazvy>${vypsatNazvy}</ns:VypsatNazvy>
      <ns:id_Jazyk>${process.env.PROFIS_ID_JAZYK}</ns:id_Jazyk>
      <ns:id_Republika>${process.env.PROFIS_ID_REPUBLIKA}</ns:id_Republika>
      <ns:Rezim>${process.env.PROFIS_REZIM}</ns:Rezim>
    </ns:Context>`
}

// ─── Raw SOAP call via proxy ───────────────────────────────────────────────────

export async function soapCall(
  service: 'Katalog' | 'Objednavka',
  method: string,
  bodyXml: string,
): Promise<Record<string, unknown>> {
  if (!PROXY_URL) throw new Error('PROFIS_PROXY_URL env var is not set')
  if (!PROXY_SECRET) throw new Error('PROFIS_PROXY_SECRET env var is not set')

  const endpoint = `${API_BASE}/${service}.svc/basics`
  const soapAction = `${NS}/${service}/${method}`
  const proxyTarget = `${PROXY_URL}?target=${encodeURIComponent(endpoint)}`

  const envelope = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="${NS}">
  <soapenv:Body>
    <ns:${method}>
      ${bodyXml}
    </ns:${method}>
  </soapenv:Body>
</soapenv:Envelope>`

  const res = await fetch(proxyTarget, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction': soapAction,
      'X-Proxy-Secret': PROXY_SECRET,
    },
    body: envelope,
  })

  const text = await res.text()

  if (!res.ok) {
    throw new Error(`Proxy error ${res.status}: ${text.slice(0, 300)}`)
  }

  // Check for SOAP Fault
  if (text.includes('<s:Fault>') || text.includes('<faultcode>')) {
    const faultMsg =
      text.match(/<faultstring[^>]*>([^<]+)<\/faultstring>/)?.[1] ??
      text.match(/<Message[^>]*>([^<]+)<\/Message>/)?.[1] ??
      'SOAP Fault'
    throw new Error(`ProfisXML fault: ${faultMsg}`)
  }

  return parseXmlToObject(text)
}

// ─── XML helpers ──────────────────────────────────────────────────────────────

export function parseXmlToObject(xml: string): Record<string, unknown> {
  const result: Record<string, unknown> = { _raw: xml }
  const tagPattern = /<([a-zA-Z_][a-zA-Z0-9_]*)(?:\s[^>]*)?>([^<]*)<\/\1>/g
  let match: RegExpExecArray | null
  while ((match = tagPattern.exec(xml)) !== null) {
    const [, tag, value] = match
    if (value.trim()) result[tag] = value.trim()
  }
  return result
}

export function extractTag(xml: string, tag: string): string | null {
  const match = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i').exec(xml)
  return match ? match[1].trim() : null
}

export function escapeXml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// ─── Typed API helpers ────────────────────────────────────────────────────────

/** Get basic term info (dates, camp name, availability) */
export async function terminDetail(id_Termin: number) {
  return soapCall('Katalog', 'TerminDetail', `
    ${ctx(true)}
    <ns:ID>${id_Termin}</ns:ID>`)
}

/** Calculate price for a term */
export interface KalkulaceInput {
  id_Termin: number
  id_ZajezdHotel: number
  pocetOsob: number
}

export async function kalkulace(input: KalkulaceInput) {
  return soapCall('Katalog', 'Kalkulace', `
    ${ctx(true)}
    <ns:Termin>
      <ns:id_Termin>${input.id_Termin}</ns:id_Termin>
      <ns:HotelList>
        <ns:id_ZajezdHotel>${input.id_ZajezdHotel}</ns:id_ZajezdHotel>
      </ns:HotelList>
      <ns:Smery/>
      <ns:TypStravy/>
      <ns:TypUbytovani/>
      <ns:Pojisteni/>
      <ns:Skipas/>
      <ns:NepovinneCenyList/>
      <ns:PocetOsob>${input.pocetOsob}</ns:PocetOsob>
      <ns:PocetDeti>0</ns:PocetDeti>
      <ns:PocetDospelych>${input.pocetOsob}</ns:PocetDospelych>
    </ns:Termin>`)
}

/** Submit a new order */
export interface ObjednatInput {
  id_Termin: number
  id_ZajezdHotel: number
  id_SkupinaSlevaKombinace: number
  pocetOsob: number
  jmeno: string
  prijmeni: string
  email: string
  telefon: string
  ulice: string
  mesto: string
  psc: string
  cestujici: Array<{ jmeno: string; prijmeni: string; datumNarozeni: string }>
  poznamka?: string
  url: string
}

export async function objednat(input: ObjednatInput) {
  const ex = escapeXml
  const cestujiciXml = input.cestujici
    .map(
      (c, i) => `<ns:CestujiciInput>
        <ns:Poradi>${i + 1}</ns:Poradi>
        <ns:Jmeno>${ex(c.jmeno)}</ns:Jmeno>
        <ns:Prijmeni>${ex(c.prijmeni)}</ns:Prijmeni>
        <ns:DatumNarozeni>${c.datumNarozeni}</ns:DatumNarozeni>
      </ns:CestujiciInput>`,
    )
    .join('')

  return soapCall('Objednavka', 'Objednat', `
    ${ctx(true)}
    <ns:Data>
      <ns:id_Organizace>${process.env.PROFIS_ID_ORGANIZACE}</ns:id_Organizace>
      <ns:id_ObjednavkaZdroj>1</ns:id_ObjednavkaZdroj>
      <ns:id_Agentura>0</ns:id_Agentura>
      <ns:URL>${ex(input.url)}</ns:URL>
      <ns:PoznamkaKlient>${ex(input.poznamka ?? '')}</ns:PoznamkaKlient>
      <ns:Objednatel>
        <ns:KlientData>
          <ns:Jmeno>${ex(input.jmeno)}</ns:Jmeno>
          <ns:Prijmeni>${ex(input.prijmeni)}</ns:Prijmeni>
          <ns:Email>${ex(input.email)}</ns:Email>
          <ns:Telefon>${ex(input.telefon)}</ns:Telefon>
          <ns:Ulice>${ex(input.ulice)}</ns:Ulice>
          <ns:Mesto>${ex(input.mesto)}</ns:Mesto>
          <ns:PSC>${ex(input.psc)}</ns:PSC>
        </ns:KlientData>
      </ns:Objednatel>
      <ns:Produkt>
        <ns:VlastniProduktTermin>
          <ns:id_Termin>${input.id_Termin}</ns:id_Termin>
          <ns:HotelList>
            <ns:id_ZajezdHotel>${input.id_ZajezdHotel}</ns:id_ZajezdHotel>
          </ns:HotelList>
          <ns:id_SkupinaSlevaKombinace>${input.id_SkupinaSlevaKombinace}</ns:id_SkupinaSlevaKombinace>
          <ns:NepovinneCeny/>
        </ns:VlastniProduktTermin>
      </ns:Produkt>
      <ns:CestujiciList>
        ${cestujiciXml}
      </ns:CestujiciList>
    </ns:Data>`)
}

/** Finalize an order — REQUIRED after every successful Objednat call */
export async function objednavkaDokoncit(id_Objednavka: number, id_Klic: number) {
  return soapCall('Objednavka', 'ObjednavkaDokoncit', `
    ${ctx()}
    <ns:id_Objednavka>${id_Objednavka}</ns:id_Objednavka>
    <ns:id_Klic>${id_Klic}</ns:id_Klic>`)
}
