import { NextRequest, NextResponse } from 'next/server'
import { soapCall, escapeXml } from '@/lib/profis'

// Builds a Pair XML element for ExterniProcedura parameters
function param(name: string, value: string | number): string {
  return `<ns:Pair>
      <ns:Key>${name}</ns:Key>
      <ns:Value>${escapeXml(String(value))}</ns:Value>
    </ns:Pair>`
}

function externiContext(): string {
  return `<ns:Context>
      <ns:UzivatelHeslo>${process.env.PROFIS_HESLO}</ns:UzivatelHeslo>
      <ns:UzivatelLogin>${process.env.PROFIS_LOGIN}</ns:UzivatelLogin>
      <ns:VypsatNazvy>false</ns:VypsatNazvy>
      <ns:id_Jazyk>${process.env.PROFIS_ID_JAZYK}</ns:id_Jazyk>
      <ns:id_Republika>${process.env.PROFIS_ID_REPUBLIKA}</ns:id_Republika>
    </ns:Context>`
}

// KlientSouhlasAktivovat — WCF field order for KlientKlicContext:
//   Context (base):           UzivatelHeslo, UzivatelLogin, VypsatNazvy, id_Jazyk
//   KlientContextBase (own):  id_Klient
//   KlientKlicContext (own):  Email (E < K), Klic
// SouhlasInput field order: id_TypSouhlas, Poznamka
function klientSouhlasXml(id_Klient: number, id_TypSouhlas: number, email: string, souhlasKlic: string): string {
  return `
    <ns:Context i:type="ns:KlientKlicContext">
      <ns:UzivatelHeslo>${process.env.PROFIS_HESLO}</ns:UzivatelHeslo>
      <ns:UzivatelLogin>${process.env.PROFIS_LOGIN}</ns:UzivatelLogin>
      <ns:VypsatNazvy>false</ns:VypsatNazvy>
      <ns:id_Jazyk>${process.env.PROFIS_ID_JAZYK}</ns:id_Jazyk>
      <ns:id_Klient>${id_Klient}</ns:id_Klient>
      <ns:Email>${escapeXml(email)}</ns:Email>
      <ns:Klic>${souhlasKlic}</ns:Klic>
    </ns:Context>
    <ns:Data>
      <ns:id_TypSouhlas>${id_TypSouhlas}</ns:id_TypSouhlas>
      <ns:Poznamka i:nil="true"/>
    </ns:Data>`
}

export async function POST(req: NextRequest) {
  let input: {
    id_Klient?: number | null
    cestujici?: Array<{ id_Cestujici: number; id_VelikostTricka: number | null }>
    zdravotniOmezeni?: string    // intolerances
    gdprOmezeni?: string         // additional info / other notes
    newsletter?: boolean         // consent ID 1 (Newsletter) + ID 2 (Marketing)
    photoConsent?: string        // 'ano' → consent ID 3 (Fotka)
    klientEmail?: string         // needed for KlientKlicContext
    souhlasKlic?: string         // SouhlasKlic from ObjednavkaDetail — consent auth key
  }

  try {
    input = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  console.log('[order/extra] received:', JSON.stringify({
    id_Klient: input.id_Klient,
    cestujiciCount: input.cestujici?.length,
    zdravotniOmezeni: input.zdravotniOmezeni,
    gdprOmezeni: input.gdprOmezeni,
    newsletter: input.newsletter,
    photoConsent: input.photoConsent,
  }))

  const errors: string[] = []

  // ── CestujiciExtraUpd: set t-shirt size for each traveler ─────────────────
  if (input.cestujici?.length) {
    for (const c of input.cestujici) {
      if (!c.id_VelikostTricka) continue  // skip if no size chosen
      try {
        await soapCall('Ostatni', 'ExterniProcedura', `
          ${externiContext()}
          <ns:Data>
            <ns:Nazev>CestujiciExtraUpd</ns:Nazev>
            <ns:Parametry>
              ${param('ID', c.id_Cestujici)}
              ${param('id_VelikostTricka', c.id_VelikostTricka)}
            </ns:Parametry>
          </ns:Data>`)
        console.log(`[order/extra] CestujiciExtraUpd OK for id_Cestujici=${c.id_Cestujici}, id_VelikostTricka=${c.id_VelikostTricka}`)
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        console.error(`[order/extra] CestujiciExtraUpd failed for id_Cestujici=${c.id_Cestujici}:`, msg)
        errors.push(`CestujiciExtraUpd(${c.id_Cestujici}): ${msg}`)
      }
    }
  }

  // ── KlientExtraUpd: set intolerances + other info for the orderer (klient) ─
  if (input.id_Klient && (input.zdravotniOmezeni || input.gdprOmezeni)) {
    try {
      const res = await soapCall('Ostatni', 'ExterniProcedura', `
        ${externiContext()}
        <ns:Data>
          <ns:Nazev>KlientExtraUpd</ns:Nazev>
          <ns:Parametry>
            ${param('ID', input.id_Klient)}
            ${input.zdravotniOmezeni ? param('ZdravotniOmezeni', input.zdravotniOmezeni) : ''}
            ${input.gdprOmezeni ? param('GdprOmezeni', input.gdprOmezeni) : ''}
          </ns:Parametry>
        </ns:Data>`)
      console.log(`[order/extra] KlientExtraUpd raw response:`, (res._raw as string)?.slice(0, 500))
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      console.error(`[order/extra] KlientExtraUpd FAILED id_Klient=${input.id_Klient} zdravotni="${input.zdravotniOmezeni}" gdpr="${input.gdprOmezeni}" error:`, msg)
      errors.push(`KlientExtraUpd(${input.id_Klient}): ${msg}`)
    }
  }

  // ── KlientSouhlasAktivovat: newsletter + marketing + photo consent ────────────
  // Consent type IDs (from TypSouhlasList): 1=Newsletter, 2=Marketing, 3=Fotka
  if (input.id_Klient && input.klientEmail && input.souhlasKlic) {
    const consentIds = [
      ...(input.newsletter ? [1, 2] : []),
      ...(input.photoConsent === 'ano' ? [3] : []),
    ]
    for (const id_TypSouhlas of consentIds) {
      try {
        await soapCall('Klient', 'KlientSouhlasAktivovat', klientSouhlasXml(input.id_Klient, id_TypSouhlas, input.klientEmail, input.souhlasKlic))
        console.log(`[order/extra] KlientSouhlasAktivovat OK id_Klient=${input.id_Klient} id_TypSouhlas=${id_TypSouhlas}`)
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        console.error(`[order/extra] KlientSouhlasAktivovat FAILED id_Klient=${input.id_Klient} id_TypSouhlas=${id_TypSouhlas}:`, msg)
        errors.push(`KlientSouhlasAktivovat(${id_TypSouhlas}): ${msg}`)
      }
    }
  }

  // Non-blocking — always return success so the main order flow is not interrupted
  return NextResponse.json({ success: true, errors: errors.length ? errors : undefined })
}
