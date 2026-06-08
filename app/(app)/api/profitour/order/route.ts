import { NextRequest, NextResponse } from 'next/server'
import { soapCall, extractTag, escapeXml } from '@/lib/profis'

export async function POST(req: NextRequest) {
  let input: {
    id_Termin?: number
    id_ZajezdHotel?: number
    id_Ubytovani?: number
    id_TypStrava?: number
    id_SkupinaSlevaKombinace?: number
    id_SkupinaSlevaParametr?: number
    svozTamId?: number | null
    svozZpetId?: number | null
    insurance?: boolean
    jmeno?: string
    prijmeni?: string
    email?: string
    telefon?: string
    ulice?: string
    mesto?: string
    psc?: string
    cestujici?: Array<{ datumNarozeni: string; jmeno?: string; prijmeni?: string; ulice?: string; psc?: string; roomWith?: string }>
    poznamka?: string
    additionalInfo?: string
    url?: string
  }

  try {
    input = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const required = ['id_Termin', 'jmeno', 'prijmeni', 'email', 'telefon'] as const
  for (const field of required) {
    if (!input[field]) return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
  }
  if (!input.cestujici?.length) {
    return NextResponse.json({ error: 'cestujici (travelers) array is required' }, { status: 400 })
  }

  const ex = escapeXml

  // Parse "Street 15" or "Street 15/A" into { ulice, cp }
  // AdresaInputBase requires CP (house number) as a separate field before Ulice
  const parseStreet = (street: string): { ulice: string; cp: string } => {
    const match = (street ?? '').trim().match(/^(.+?)\s+(\d[\w/\-]*)$/)
    if (match) return { ulice: match[1].trim(), cp: match[2].trim() }
    return { ulice: street ?? '', cp: '-' }
  }
  // Normalize phone to international format (+421XXXXXXXXX for Slovak numbers)
  const normalizePhone = (phone: string): string => {
    const digits = phone.replace(/[\s\-().]/g, '')
    if (digits.startsWith('+')) return digits
    if (digits.startsWith('00')) return '+' + digits.slice(2)
    if (digits.startsWith('0')) return '+421' + digits.slice(1)
    return digits
  }

  const toDateTime = (iso: string) => {
    if (!iso) return '2000-01-01T00:00:00'
    if (iso.includes('.')) {
      const [d, m, y] = iso.split('.')
      return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T00:00:00`
    }
    return `${iso}T00:00:00`
  }

  // Collect all unique PSČ values (orderer + all travelers) for a single ObecList lookup
  // Normalize by stripping spaces so "010 01" and "01001" both match Profis response
  const allPsc = [...new Set([
    input.psc?.replace(/\s/g, ''),
    ...input.cestujici!.map(c => c.psc?.replace(/\s/g, '')),
  ].filter(Boolean) as string[])]

  // Build PSČ → id_Obec map from a single ObecList API call
  const pscToObec: Record<string, number> = {}
  let obecListReturnedData = false
  if (allPsc.length > 0) {
    try {
      const obceRaw = await soapCall('Ciselnik', 'ObecList', `
        <ns:Context>
          <ns:UzivatelHeslo>${process.env.PROFIS_HESLO}</ns:UzivatelHeslo>
          <ns:UzivatelLogin>${process.env.PROFIS_LOGIN}</ns:UzivatelLogin>
          <ns:id_Jazyk>${process.env.PROFIS_ID_JAZYK}</ns:id_Jazyk>
          <ns:id_Republika>${process.env.PROFIS_ID_REPUBLIKA}</ns:id_Republika>
        </ns:Context>
        <ns:id_Jazyk>${process.env.PROFIS_ID_JAZYK}</ns:id_Jazyk>`)
      const obceXml = obceRaw._raw as string
      const obceBlocks = obceXml.match(/<Obec[\s\S]*?<\/Obec>/g) ?? []
      if (obceBlocks.length > 0) obecListReturnedData = true
      for (const block of obceBlocks) {
        const psc = extractTag(block, 'PSC')?.replace(/\s/g, '')
        if (psc && allPsc.includes(psc)) {
          const idStr = extractTag(block, 'ID')
          if (idStr) pscToObec[psc] = Number(idStr)
        }
      }
      console.log('[order] id_Obec map:', pscToObec)
    } catch (e) {
      console.warn('[order] ObecList lookup failed:', e)
    }
  }

  // PSČ not found in ObecList means a foreign or non-standard address — allow the order through
  // without a Profis address (AdresaDomaciInput requires id_Obec which only exists for SK municipalities).
  // buildAdresaXml returns '' for unknown PSČ and the SOAP call sends i:nil="true" in that case.

  // Build address XML for a given street+psc combination
  const buildAdresaXml = (ulice: string | undefined, psc: string | undefined): string => {
    if (!psc) return ''
    const id_Obec = pscToObec[psc.replace(/\s/g, '')]
    if (!id_Obec) return ''
    const { ulice: parsedU, cp: parsedC } = parseStreet(ulice ?? '')
    return `<ns:Adresa i:type="ns:AdresaDomaciInput">
        <ns:CP>${ex(parsedC)}</ns:CP>
        <ns:Ulice>${ex(parsedU)}</ns:Ulice>
        <ns:id_Obec>${id_Obec}</ns:id_Obec>
      </ns:Adresa>`
  }

  // Objednat uses CestujiciKlientInput — passes full child data (name, address, birthdate)
  // directly in Objednat so Profis creates proper Klient records for each Cestujici.
  // This is required for KlientExtraUpd (intolerance) to work, as it needs Cestujici.id_Klient.
  const cestujiciXml = input.cestujici!
    .map((c, i) => {
      const childAdresaXml = buildAdresaXml(c.ulice, c.psc)
      return `<ns:CestujiciInputBase i:type="ns:CestujiciKlientInput">
          <ns:ID>${-(i + 1)}</ns:ID>
          <ns:Klient i:type="ns:KlientDataInput">
            ${childAdresaXml || '<ns:Adresa i:nil="true"/>'}
            <ns:Jmeno>${ex(c.jmeno ?? '')}</ns:Jmeno>
            <ns:Narozeni>${toDateTime(c.datumNarozeni)}</ns:Narozeni>
            <ns:Prijmeni>${ex(c.prijmeni ?? '')}</ns:Prijmeni>
            <ns:id_Pohlavi>M</ns:id_Pohlavi>
          </ns:Klient>
        </ns:CestujiciInputBase>`
    })
    .join('')

  // Build RezervaceDopravy from svoz IDs passed through from Kalkulace.
  // Profis requires explicit Tam and Zpet entries even for camps with "vlastná doprava".
  // Each entry must list all travelers via RezervaceDopravaCestujici (negative IDs match Cestujici).
  // XSD field order:
  //   Base RezervaceDopravaInputBase: Poznamka (P), RezervaceDopravaCestujici (R), id_SvozMisto (i,S)
  //   Own  RezervaceDopravaKalkulaceInput: Smer (S), id_Letiste (i,L)
  const dopravaCestujiciXml = input.cestujici!
    .map((_, i) => `<ns:RezervaceDopravaCestujiciInput><ns:id_Cestujici>${-(i + 1)}</ns:id_Cestujici></ns:RezervaceDopravaCestujiciInput>`)
    .join('')

  const buildDopravyEntry = (smer: 'Tam' | 'Zpet', svozId: number | null | undefined) =>
    `<ns:RezervaceDopravaInputBase i:type="ns:RezervaceDopravaKalkulaceInput">
        <ns:RezervaceDopravaCestujici>${dopravaCestujiciXml}</ns:RezervaceDopravaCestujici>
        ${svozId != null ? `<ns:id_SvozMisto>${svozId}</ns:id_SvozMisto>` : ''}
        <ns:Smer>${smer}</ns:Smer>
      </ns:RezervaceDopravaInputBase>`

  const dopravyXml = `<ns:RezervaceDopravy>
      ${buildDopravyEntry('Tam', input.svozTamId)}
      ${buildDopravyEntry('Zpet', input.svozZpetId)}
    </ns:RezervaceDopravy>`

  // RezervaceUbytovaniKalkulaceInput: one entry per traveler (OsobMax=1 per camp spot).
  // Field order: Base: Poznamka (P), RezervaceUbytovaniCestujici (R), id_TypStrava (i,T,S)
  //              Own:  id_Ubytovani (i,U), id_ZajezdHotel (i,Z)
  const ubytovaniXml = input.id_ZajezdHotel
    ? `<ns:RezervaceUbytovani>
        ${input.cestujici!.map((c, i) => {
          const roomWithText = c.jmeno && c.roomWith ? `${c.jmeno}: ubytovať s ${c.roomWith}` : undefined
          const poznamkaText = [roomWithText, input.additionalInfo].filter(Boolean).join(', ')
          return `<ns:RezervaceUbytovaniInputBase i:type="ns:RezervaceUbytovaniKalkulaceInput">
            ${poznamkaText ? `<ns:Poznamka>${ex(poznamkaText)}</ns:Poznamka>` : ''}
            <ns:RezervaceUbytovaniCestujici><ns:RezervaceUbytovaniCestujiciInput><ns:id_Cestujici>${-(i + 1)}</ns:id_Cestujici></ns:RezervaceUbytovaniCestujiciInput></ns:RezervaceUbytovaniCestujici>
            <ns:id_TypStrava>${input.id_TypStrava ?? 0}</ns:id_TypStrava>
            <ns:id_Ubytovani>${input.id_Ubytovani ?? 0}</ns:id_Ubytovani>
            <ns:id_ZajezdHotel>${input.id_ZajezdHotel}</ns:id_ZajezdHotel>
          </ns:RezervaceUbytovaniInputBase>`
        }).join('')}
      </ns:RezervaceUbytovani>`
    : ''

  // Build Pojisteni XML: one PojisteniInputBase per traveler when insurance is checked.
  // id_TypPojisteni=1 = "Komplexné cestovné poistenie" (confirmed via TypPojisteniList codebook).
  // Field order (WCF alphabetical): PojisteniCestujici (P,C) → id_TypPojisteni (i,T)
  const pojisteniXml = input.insurance
    ? `<ns:Pojisteni>
        ${input.cestujici!.map((_, i) => `<ns:PojisteniInput>
            <ns:id_Cestujici>${-(i + 1)}</ns:id_Cestujici>
            <ns:id_TypPojisteni>1</ns:id_TypPojisteni>
          </ns:PojisteniInput>`).join('')}
      </ns:Pojisteni>`
    : `<ns:Pojisteni/>`

  // Build orderer address using the unified PSČ → id_Obec map
  const adresaXml = buildAdresaXml(input.ulice, input.psc)

  try {
    console.log('[order] Calling Profis Objednat with id_Termin:', input.id_Termin, 'id_ZajezdHotel:', input.id_ZajezdHotel, 'id_SkupinaSlevaKombinace:', input.id_SkupinaSlevaKombinace, 'svozTam:', input.svozTamId, 'svozZpet:', input.svozZpetId)
    // Objednat: Context + Data (ObjednavkaTerminInput)
    //
    // ObjednavkaTerminInput extends ObjednavkaInputBase.
    // DataContractSerializer field order (base class first, alphabetical within each level):
    //   Base ObjednavkaInputBase: Objednatel (O), PoznamkaKlient (P,K), Produkt (P,r), URL (U),
    //                             id_Agentura (i,A), id_ObjednavkaZdroj (i,O), id_Organizace (i,Or)
    //   Own ObjednavkaTerminInput: NepovinneCeny (N), id_SkupinaSlevaKombinace (i,S)
    //
    // Produkt is VlastniProduktTerminInput (extends ProduktInputBase):
    //   Base ProduktInputBase: Cestujici (C), Pojisteni (P), RezervaceDopravy (R,D), RezervaceUbytovani (R,U), Skipasy (S), id_TypStrava (i,T,S)
    //   Own VlastniProduktTerminInput: id_SkupinaSlevaParametr (i,S), id_Termin (i,T)
    //
    // ObjednatResult returns: ID (int) and Klic (string)
    const raw = await soapCall('Objednavka', 'Objednat', `
      <ns:Context>
        <ns:UzivatelHeslo>${process.env.PROFIS_HESLO}</ns:UzivatelHeslo>
        <ns:UzivatelLogin>${process.env.PROFIS_LOGIN}</ns:UzivatelLogin>
        <ns:VypsatNazvy>true</ns:VypsatNazvy>
        <ns:id_Jazyk>${process.env.PROFIS_ID_JAZYK}</ns:id_Jazyk>
        <ns:id_Republika>${process.env.PROFIS_ID_REPUBLIKA}</ns:id_Republika>
        <ns:Rezim>${process.env.PROFIS_REZIM}</ns:Rezim>
      </ns:Context>
      <ns:Data i:type="ns:ObjednavkaTerminInput">
        <ns:Objednatel i:type="ns:KlientDataInput">
          ${adresaXml || '<ns:Adresa i:nil="true"/>'}
          <ns:Email>${ex(input.email!)}</ns:Email>
          <ns:Jmeno>${ex(input.jmeno!)}</ns:Jmeno>
          <ns:Prijmeni>${ex(input.prijmeni!)}</ns:Prijmeni>
          <ns:Telefon>${ex(normalizePhone(input.telefon!))}</ns:Telefon>
          <ns:id_Pohlavi>F</ns:id_Pohlavi>
        </ns:Objednatel>
        <ns:PoznamkaKlient>${ex(input.poznamka ?? '')}</ns:PoznamkaKlient>
        <ns:Produkt i:type="ns:VlastniProduktTerminInput">
          <ns:Cestujici>
            ${cestujiciXml}
          </ns:Cestujici>
          ${pojisteniXml}
          ${dopravyXml}
          ${ubytovaniXml}
          <ns:Skipasy/>
          <ns:id_TypStrava>${input.id_TypStrava ?? 0}</ns:id_TypStrava>
          ${input.id_SkupinaSlevaParametr ? `<ns:id_SkupinaSlevaParametr><arr:int xmlns:arr="http://schemas.microsoft.com/2003/10/Serialization/Arrays">${input.id_SkupinaSlevaParametr}</arr:int></ns:id_SkupinaSlevaParametr>` : ''}
          <ns:id_Termin>${input.id_Termin}</ns:id_Termin>
        </ns:Produkt>
        <ns:URL>${ex(input.url ?? 'https://bombovo.sk')}</ns:URL>
        <ns:id_Agentura>0</ns:id_Agentura>
        <ns:id_ObjednavkaZdroj>1</ns:id_ObjednavkaZdroj>
        <ns:id_Organizace>${process.env.PROFIS_ID_ORGANIZACE}</ns:id_Organizace>
        <ns:NepovinneCeny/>
        <ns:id_SkupinaSlevaKombinace>${input.id_SkupinaSlevaKombinace ?? 0}</ns:id_SkupinaSlevaKombinace>
      </ns:Data>`)

    const xml = raw._raw as string
    console.log('[order] Response XML:', xml.slice(0, 800))

    // ObjednatResult fields are ID (int) and Klic (string) — confirmed from XSD schema
    const id = extractTag(xml, 'ID')
    const klic = extractTag(xml, 'Klic')

    if (!id || !klic) {
      console.error('[profitour/order] Unexpected response (missing ID or Klic):', xml.slice(0, 800))
      return NextResponse.json(
        { error: 'Order created but could not extract ID/Klic from response' },
        { status: 500 },
      )
    }

    const id_Objednavka = Number(id)

    // ── Fetch ObjednavkaDetail to get id_Klient and real cestujici IDs ──────────
    // These are needed for CestujiciExtraUpd (t-shirt) and KlientExtraUpd (intolerances)
    let id_Klient: number | null = null
    let cestujiciIds: number[] = []
    let cestujiciKlientIds: number[] = []
    let souhlasKlic: string | null = null
    let klientEmail: string | null = null

    try {
      const detailRaw = await soapCall('Objednavka', 'ObjednavkaDetail', `
        <ns:Context>
          <ns:UzivatelHeslo>${process.env.PROFIS_HESLO}</ns:UzivatelHeslo>
          <ns:UzivatelLogin>${process.env.PROFIS_LOGIN}</ns:UzivatelLogin>
          <ns:VypsatNazvy>false</ns:VypsatNazvy>
          <ns:id_Jazyk>${process.env.PROFIS_ID_JAZYK}</ns:id_Jazyk>
          <ns:id_Republika>${process.env.PROFIS_ID_REPUBLIKA}</ns:id_Republika>
          <ns:Klic>${klic}</ns:Klic>
          <ns:id_Objednavka>${id_Objednavka}</ns:id_Objednavka>
        </ns:Context>`)

      const detailXml = detailRaw._raw as string
      console.log('[order] Detail XML (first 2000):', detailXml.slice(0, 2000))

      // Extract klient ID using multiple strategies (same style as cestujiciIds below).
      // Strategy 1: <id_Klient>N</id_Klient> directly in the XML
      const directKlientMatch = detailXml.match(/<id_Klient>(\d+)<\/id_Klient>/)
      if (directKlientMatch) {
        id_Klient = Number(directKlientMatch[1]) || null
      } else {
        // Strategy 2: <Klient ...><ID>N</ID> — first occurrence
        const klientIdMatch = detailXml.match(/<Klient[^>]*>\s*<ID>(\d+)<\/ID>/)
        if (klientIdMatch) id_Klient = Number(klientIdMatch[1]) || null
      }

      // Extract individual traveler (cestujici) IDs.
      // The safest source is <id_Cestujici>N</id_Cestujici> inside RezervaceDopravaCestujici —
      // these are guaranteed to be the real Cestujici entity IDs (one per traveler per direction).
      // De-duplicating gives us exactly one ID per child.
      const idCestujiciTags = detailXml.match(/<id_Cestujici>(\d+)<\/id_Cestujici>/g) ?? []
      const seen = new Set<number>()
      for (const tag of idCestujiciTags) {
        const num = Number(tag.replace(/<[^>]+>/g, '').trim())
        if (num > 0 && !seen.has(num)) { seen.add(num); cestujiciIds.push(num) }
      }

      // Extract the Klient ID from each Cestujici (child traveler) — needed for KlientExtraUpd (intolerance)
      // Each inner <Cestujici><ID>N</ID>...<Klient><ID>M</ID> → M is the klient ID to use
      const innerCestujiciPattern = /<Cestujici><ID>\d+<\/ID>[\s\S]*?<Klient[^>]*><ID>(\d+)<\/ID>/g
      let cm: RegExpExecArray | null
      while ((cm = innerCestujiciPattern.exec(detailXml)) !== null) {
        const klId = Number(cm[1])
        if (klId > 0) cestujiciKlientIds.push(klId)
      }

      // Extract SouhlasKlic and Email from the Klient object — needed for KlientSouhlasAktivovat
      const souhlasKlicMatch = detailXml.match(/<SouhlasKlic>([^<]+)<\/SouhlasKlic>/)
      if (souhlasKlicMatch) souhlasKlic = souhlasKlicMatch[1].trim()
      const klientEmailMatch = detailXml.match(/<Klient[^>]*>[\s\S]*?<Email>([^<]+)<\/Email>/)
      if (klientEmailMatch) klientEmail = klientEmailMatch[1].trim()

      console.log('[order] id_Klient:', id_Klient, 'cestujiciIds:', cestujiciIds, 'cestujiciKlientIds:', cestujiciKlientIds, 'souhlasKlic:', souhlasKlic ? '(set)' : '(missing)')

      // ── CestujiciUlozit: save full personal data using real Cestujici IDs ────────
      // Must be called AFTER ObjednavkaDetail so we have the real IDs (not negative placeholders).
      // This is the correct Profis sequence: Objednat → ObjednavkaDetail → CestujiciUlozit.
      if (cestujiciIds.length > 0 && input.cestujici?.length) {
        try {
          const cestujiciUlozitXml = cestujiciIds
            .map((realId, i) => {
              const c = input.cestujici![i]
              if (!c) return ''
              const adresaXml = buildAdresaXml(c.ulice, c.psc)
              const adresaNode = adresaXml || '<ns:Adresa i:nil="true"/>'
              return `<ns:CestujiciKlientInput>
                  <ns:ID>${realId}</ns:ID>
                  <ns:Klient i:type="ns:KlientDataInput">
                    ${adresaNode}
                    <ns:Jmeno>${ex(c.jmeno ?? '')}</ns:Jmeno>
                    <ns:Narozeni>${toDateTime(c.datumNarozeni)}</ns:Narozeni>
                    <ns:Prijmeni>${ex(c.prijmeni ?? '')}</ns:Prijmeni>
                    <ns:id_Pohlavi>M</ns:id_Pohlavi>
                  </ns:Klient>
                </ns:CestujiciKlientInput>`
            })
            .filter(Boolean)
            .join('')

          await soapCall('Objednavka', 'CestujiciUlozit', `
            <ns:Context>
              <ns:UzivatelHeslo>${process.env.PROFIS_HESLO}</ns:UzivatelHeslo>
              <ns:UzivatelLogin>${process.env.PROFIS_LOGIN}</ns:UzivatelLogin>
              <ns:VypsatNazvy>false</ns:VypsatNazvy>
              <ns:id_Jazyk>${process.env.PROFIS_ID_JAZYK}</ns:id_Jazyk>
              <ns:Klic>${klic}</ns:Klic>
              <ns:id_Objednavka>${id_Objednavka}</ns:id_Objednavka>
            </ns:Context>
            <ns:Cestujici>
              ${cestujiciUlozitXml}
            </ns:Cestujici>`)
          console.log('[order] CestujiciUlozit OK for ids:', cestujiciIds)
        } catch (e) {
          console.error('[order] CestujiciUlozit FAILED:', e)
        }
      }
    } catch (e) {
      console.warn('[order] ObjednavkaDetail fetch failed (non-blocking):', e)
    }

    return NextResponse.json({ id_Objednavka, klic, id_Klient, cestujiciIds, cestujiciKlientIds, souhlasKlic, klientEmail })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[profitour/order] Error:', message)
    return NextResponse.json({ error: 'Objednat failed: ' + message }, { status: 500 })
  }
}
