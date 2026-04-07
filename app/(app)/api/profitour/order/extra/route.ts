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

// KlientSouhlasAktivovat — WCF field order for KlientHesloContext:
//   Context (base):           UzivatelHeslo, UzivatelLogin, VypsatNazvy, id_Jazyk
//   KlientContextBase (own):  id_Klient
//   KlientHesloContext (own): KlientHeslo (empty — admin call on behalf of client)
// SouhlasInput field order: id_TypSouhlas, Poznamka
function klientSouhlasXml(id_Klient: number, id_TypSouhlas: number): string {
  return `
    <ns:Context i:type="ns:KlientHesloContext">
      <ns:UzivatelHeslo>${process.env.PROFIS_HESLO}</ns:UzivatelHeslo>
      <ns:UzivatelLogin>${process.env.PROFIS_LOGIN}</ns:UzivatelLogin>
      <ns:VypsatNazvy>false</ns:VypsatNazvy>
      <ns:id_Jazyk>${process.env.PROFIS_ID_JAZYK}</ns:id_Jazyk>
      <ns:id_Klient>${id_Klient}</ns:id_Klient>
      <ns:KlientHeslo></ns:KlientHeslo>
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
      await soapCall('Ostatni', 'ExterniProcedura', `
        ${externiContext()}
        <ns:Data>
          <ns:Nazev>KlientExtraUpd</ns:Nazev>
          <ns:Parametry>
            ${param('ID', input.id_Klient)}
            ${input.zdravotniOmezeni ? param('ZdravotniOmezeni', input.zdravotniOmezeni) : ''}
            ${input.gdprOmezeni ? param('GdprOmezeni', input.gdprOmezeni) : ''}
          </ns:Parametry>
        </ns:Data>`)
      console.log(`[order/extra] KlientExtraUpd OK for id_Klient=${input.id_Klient}`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      console.error(`[order/extra] KlientExtraUpd FAILED id_Klient=${input.id_Klient} zdravotni="${input.zdravotniOmezeni}" gdpr="${input.gdprOmezeni}" error:`, msg)
      errors.push(`KlientExtraUpd(${input.id_Klient}): ${msg}`)
    }
  }

  // ── KlientSouhlasAktivovat: newsletter + marketing + photo consent ────────────
  // Consent type IDs (from TypSouhlasList): 1=Newsletter, 2=Marketing, 3=Fotka
  if (input.id_Klient) {
    if (input.newsletter) {
      for (const id_TypSouhlas of [1, 2]) {
        try {
          await soapCall('Klient', 'KlientSouhlasAktivovat', klientSouhlasXml(input.id_Klient, id_TypSouhlas))
          console.log(`[order/extra] KlientSouhlasAktivovat OK id_Klient=${input.id_Klient} id_TypSouhlas=${id_TypSouhlas}`)
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e)
          console.error(`[order/extra] KlientSouhlasAktivovat FAILED id_Klient=${input.id_Klient} id_TypSouhlas=${id_TypSouhlas}:`, msg)
          errors.push(`KlientSouhlasAktivovat(${id_TypSouhlas}): ${msg}`)
        }
      }
    }
    if (input.photoConsent === 'ano') {
      try {
        await soapCall('Klient', 'KlientSouhlasAktivovat', klientSouhlasXml(input.id_Klient, 3))
        console.log(`[order/extra] KlientSouhlasAktivovat OK id_Klient=${input.id_Klient} id_TypSouhlas=3 (Fotka)`)
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        console.error(`[order/extra] KlientSouhlasAktivovat FAILED id_Klient=${input.id_Klient} id_TypSouhlas=3:`, msg)
        errors.push(`KlientSouhlasAktivovat(3): ${msg}`)
      }
    }
  }

  // Non-blocking — always return success so the main order flow is not interrupted
  return NextResponse.json({ success: true, errors: errors.length ? errors : undefined })
}
