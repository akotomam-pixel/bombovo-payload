/**
 * ProfisXML SOAP helper
 *
 * All calls are routed through the PHP proxy at bombovo.sk so requests
 * originate from a fixed IP that ProfisXML has whitelisted.
 *
 * Namespace: http://xml.profis.profitour.cz
 * Services:
 *   Katalog  → https://xml.bombovo.sk/API/v1/Katalog.svc
 *   Objednavka → https://xml.bombovo.sk/API/v1/Objednavka.svc
 */

const NS = 'http://xml.profis.profitour.cz'
const API_BASE = process.env.PROFIS_API_BASE ?? 'https://xml.bombovo.sk/API/v1'
const PROXY_URL = process.env.PROFIS_PROXY_URL ?? ''
const PROXY_SECRET = process.env.PROFIS_PROXY_SECRET ?? ''

// ─── Credentials context injected into every SOAP call ────────────────────────

function context(vypsatNazvy = true): string {
  return `
    <Context>
      <UzivatelLogin>${process.env.PROFIS_LOGIN}</UzivatelLogin>
      <UzivatelHeslo>${process.env.PROFIS_HESLO}</UzivatelHeslo>
      <id_Jazyk>${process.env.PROFIS_ID_JAZYK}</id_Jazyk>
      <id_Republika>${process.env.PROFIS_ID_REPUBLIKA}</id_Republika>
      <Rezim>${process.env.PROFIS_REZIM}</Rezim>
      <VypsatNazvy>${vypsatNazvy}</VypsatNazvy>
    </Context>`
}

// ─── Raw SOAP call via proxy ───────────────────────────────────────────────────

export async function soapCall(
  service: 'Katalog' | 'Objednavka',
  method: string,
  bodyXml: string,
): Promise<Record<string, unknown>> {
  if (!PROXY_URL || !PROXY_SECRET) {
    throw new Error('PROFIS_PROXY_URL or PROFIS_PROXY_SECRET env vars are not set')
  }

  const endpoint = `${API_BASE}/${service}.svc`
  const soapAction = `${NS}/${service}/${method}`

  const envelope = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:ns="${NS}">
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
    const faultMsg = text.match(/<faultstring[^>]*>([^<]+)<\/faultstring>/)?.[1]
      ?? text.match(/<Message[^>]*>([^<]+)<\/Message>/)?.[1]
      ?? 'SOAP Fault'
    throw new Error(`ProfisXML fault: ${faultMsg}`)
  }

  return parseXmlToObject(text)
}

// ─── Minimal XML → JS object parser ───────────────────────────────────────────
// Extracts text content of named tags. Sufficient for our use cases.

export function parseXmlToObject(xml: string): Record<string, unknown> {
  const result: Record<string, unknown> = { _raw: xml }

  // Extract all tag values as a flat map
  const tagPattern = /<([a-zA-Z_][a-zA-Z0-9_]*)(?:\s[^>]*)?>([^<]*)<\/\1>/g
  let match: RegExpExecArray | null
  while ((match = tagPattern.exec(xml)) !== null) {
    const [, tag, value] = match
    if (value.trim()) {
      result[tag] = value.trim()
    }
  }

  return result
}

// ─── Extract value from raw XML by tag name ───────────────────────────────────

export function extractTag(xml: string, tag: string): string | null {
  const match = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i').exec(xml)
  return match ? match[1].trim() : null
}

// ─── Typed helpers ─────────────────────────────────────────────────────────────

/** Get basic term info (dates, camp name, location, price range) */
export async function terminDetail(id_Termin: number) {
  const body = `
    ${context(true)}
    <ID>${id_Termin}</ID>`

  const raw = await soapCall('Katalog', 'TerminDetail', body)
  return raw
}

/** Get the parameters needed to call Kalkulace (including id_ZajezdHotel) */
export async function kalkulaceParametry(id_Termin: number, id_ZajezdHotel?: number) {
  const hotelEl = id_ZajezdHotel
    ? `<ns:id_ZajezdHotel><ns:int>${id_ZajezdHotel}</ns:int></ns:id_ZajezdHotel>`
    : `<ns:id_ZajezdHotel />`

  const body = `
    ${context(true)}
    <id_Termin>${id_Termin}</id_Termin>
    ${hotelEl}`

  return soapCall('Katalog', 'KalkulaceParametry', body)
}

/** Calculate price for a term */
export interface KalkulaceInput {
  id_Termin: number
  id_ZajezdHotel: number
  pocetOsob: number          // number of people (children)
  id_SkupinaSlevaKombinace?: number
}

export async function kalkulace(input: KalkulaceInput) {
  const body = `
    ${context(true)}
    <Termin>
      <id_Termin>${input.id_Termin}</id_Termin>
      <HotelList>
        <id_ZajezdHotel>${input.id_ZajezdHotel}</id_ZajezdHotel>
      </HotelList>
      <Smery />
      <TypStravy />
      <TypUbytovani />
      <Pojisteni />
      <Skipas />
      <NepovinneCenyList />
      <PocetOsob>${input.pocetOsob}</PocetOsob>
      <PocetDeti>0</PocetDeti>
      <PocetDospelych>${input.pocetOsob}</PocetDospelych>
    </Termin>`

  return soapCall('Katalog', 'Kalkulace', body)
}

/** Submit a new order */
export interface ObjednatInput {
  id_Termin: number
  id_ZajezdHotel: number
  id_SkupinaSlevaKombinace: number
  pocetOsob: number
  // Billing person (zákonný zástupca)
  jmeno: string
  prijmeni: string
  email: string
  telefon: string
  ulice: string
  mesto: string
  psc: string
  // Children (travelers)
  cestujici: Array<{
    jmeno: string
    prijmeni: string
    datumNarozeni: string  // DD.MM.YYYY
  }>
  poznamka?: string
  url: string
}

export async function objednat(input: ObjednatInput) {
  const cestujiciXml = input.cestujici.map((c, i) => `
    <CestujiciInput>
      <Poradi>${i + 1}</Poradi>
      <Jmeno>${escapeXml(c.jmeno)}</Jmeno>
      <Prijmeni>${escapeXml(c.prijmeni)}</Prijmeni>
      <DatumNarozeni>${c.datumNarozeni}</DatumNarozeni>
    </CestujiciInput>`).join('')

  const body = `
    ${context(true)}
    <Data>
      <id_Organizace>${process.env.PROFIS_ID_ORGANIZACE}</id_Organizace>
      <id_ObjednavkaZdroj>1</id_ObjednavkaZdroj>
      <id_Agentura>0</id_Agentura>
      <URL>${escapeXml(input.url)}</URL>
      <PoznamkaKlient>${escapeXml(input.poznamka ?? '')}</PoznamkaKlient>
      <Objednatel>
        <KlientData>
          <Jmeno>${escapeXml(input.jmeno)}</Jmeno>
          <Prijmeni>${escapeXml(input.prijmeni)}</Prijmeni>
          <Email>${escapeXml(input.email)}</Email>
          <Telefon>${escapeXml(input.telefon)}</Telefon>
          <Ulice>${escapeXml(input.ulice)}</Ulice>
          <Mesto>${escapeXml(input.mesto)}</Mesto>
          <PSC>${escapeXml(input.psc)}</PSC>
        </KlientData>
      </Objednatel>
      <Produkt>
        <VlastniProduktTermin>
          <id_Termin>${input.id_Termin}</id_Termin>
          <HotelList>
            <id_ZajezdHotel>${input.id_ZajezdHotel}</id_ZajezdHotel>
          </HotelList>
          <id_SkupinaSlevaKombinace>${input.id_SkupinaSlevaKombinace}</id_SkupinaSlevaKombinace>
          <NepovinneCeny />
        </VlastniProduktTermin>
      </Produkt>
      <CestujiciList>
        ${cestujiciXml}
      </CestujiciList>
    </Data>`

  return soapCall('Objednavka', 'Objednat', body)
}

/** Finalize (dokončit) an order — REQUIRED after every Objednat call */
export async function objednavkaDokoncit(id_Objednavka: number, id_Klic: number) {
  const body = `
    <Context>
      <UzivatelLogin>${process.env.PROFIS_LOGIN}</UzivatelLogin>
      <UzivatelHeslo>${process.env.PROFIS_HESLO}</UzivatelHeslo>
      <id_Jazyk>${process.env.PROFIS_ID_JAZYK}</id_Jazyk>
    </Context>
    <id_Objednavka>${id_Objednavka}</id_Objednavka>
    <id_Klic>${id_Klic}</id_Klic>`

  return soapCall('Objednavka', 'ObjednavkaDokoncit', body)
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
