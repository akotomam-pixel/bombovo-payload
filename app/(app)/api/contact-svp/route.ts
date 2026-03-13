import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

function row(label: string, value: string) {
  return `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f9f9f9;white-space:nowrap">${label}</td><td style="padding:8px;border:1px solid #ddd">${value}</td></tr>`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.stredisko || !body.telefon || !body.email) {
      return NextResponse.json({ error: 'Chýbajú povinné polia' }, { status: 400 })
    }

    const v = (val: string | undefined) => val ?? ''

    const { error } = await resend.emails.send({
      from: 'Bombovo <info@bombovo.sk>',
      to: ['sabina@bombovo.sk'],
      subject: 'Nova prihlaska SvP',
      html: `<!DOCTYPE html><html><body style="font-family:sans-serif;color:#222;padding:20px">
<h2 style="color:#1a1a2e">Nová prihláška – Škola v prírode</h2>
<table style="border-collapse:collapse;width:100%;max-width:600px">
  ${row('Dátum príchodu', v(body.datumPrichodu))}
  ${row('Dátum odchodu', v(body.datumOdchodu))}
  ${row('Vedúci pobytu', v(body.veduciPobytu))}
  ${row('Názov školy', v(body.nazovSkoly))}
  ${row('Adresa', v(body.adresa))}
  ${row('PSČ', v(body.psc))}
  ${row('Mesto', v(body.mesto))}
  ${row('Telefón', v(body.telefon))}
  ${row('Email', v(body.email))}
  ${row('Stredisko', v(body.stredisko))}
  ${row('Alternatívne stredisko', v(body.alternativneStredisko))}
  ${row('Vek žiakov', v(body.vekZiakov))}
  ${row('Počet žiakov', v(body.pocetZiakov))}
  ${row('Počet pedagógov', v(body.pocetPedagogov))}
  ${row('Zdravotník', v(body.zdravotnik))}
  ${row('Animačný program', v(body.animacnyProgram))}
  ${row('Bombový balíček', v(body.bombovyBalicek))}
  ${row('Poznámka', v(body.poznamka))}
</table>
</body></html>`,
    })

    if (error) {
      console.error('[contact-svp] Resend error:', error)
      return NextResponse.json({ error: 'Nastala chyba pri odosielaní' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[contact-svp] Error:', err)
    return NextResponse.json({ error: 'Nastala chyba pri spracovaní formulára' }, { status: 500 })
  }
}
