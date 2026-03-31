import { NextRequest, NextResponse } from 'next/server'
import { soapCall, escapeXml } from '@/lib/profis'

// Builds an ExterniParametrInput XML element
function param(name: string, value: string | number): string {
  return `<ns:ExterniParametrInput>
      <ns:Nazev>${name}</ns:Nazev>
      <ns:Hodnota>${escapeXml(String(value))}</ns:Hodnota>
    </ns:ExterniParametrInput>`
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

export async function POST(req: NextRequest) {
  let input: {
    id_Klient?: number | null
    cestujici?: Array<{ id_Cestujici: number; id_VelikostTricka: number | null }>
    zdravotniOmezeni?: string    // intolerances
    gdprOmezeni?: string         // additional info / other notes
  }

  try {
    input = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

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
            ${param('id_Organizace', process.env.PROFIS_ID_ORGANIZACE ?? '')}
          </ns:Parametry>
        </ns:Data>`)
      console.log(`[order/extra] KlientExtraUpd OK for id_Klient=${input.id_Klient}`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      console.error(`[order/extra] KlientExtraUpd failed for id_Klient=${input.id_Klient}:`, msg)
      errors.push(`KlientExtraUpd(${input.id_Klient}): ${msg}`)
    }
  }

  // Non-blocking — always return success so the main order flow is not interrupted
  return NextResponse.json({ success: true, errors: errors.length ? errors : undefined })
}
