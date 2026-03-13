import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

function row(label: string, value: string) {
  return `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f9f9f9;white-space:nowrap">${label}</td><td style="padding:8px;border:1px solid #ddd">${value}</td></tr>`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.nazovFirmy || !body.sposobFinancovania) {
      return NextResponse.json({ error: 'Chýbajú povinné polia' }, { status: 400 })
    }

    const v = (val: string | undefined) => val ?? ''

    const extraRows = body.sposobFinancovania === 'cast-tabora'
      ? row('Veľkosť časti tábora', v(body.castTabora))
      : body.sposobFinancovania === 'poziadavka'
      ? row('Požiadavka na financovanie', v(body.poziadavka))
      : ''

    const { error } = await resend.emails.send({
      from: 'Bombovo <info@bombovo.sk>',
      to: ['pata@bombovo.sk'],
      subject: 'Nova prihlaska Pre firmy',
      html: `<!DOCTYPE html><html><body style="font-family:sans-serif;color:#222;padding:20px">
<h2 style="color:#1a1a2e">Nová prihláška – Letné tábory pre firmy</h2>
<table style="border-collapse:collapse;width:100%;max-width:600px">
  ${row('Názov firmy', v(body.nazovFirmy))}
  ${row('Počet zamestnancov', v(body.pocetZamestnancov))}
  ${row('Spôsob financovania', v(body.sposobFinancovania))}
  ${extraRows}
  ${row('Poznámky / Otázky', v(body.poznamky))}
</table>
</body></html>`,
    })

    if (error) {
      console.error('[contact-firmy] Resend error:', error)
      return NextResponse.json({ error: 'Nastala chyba pri odosielaní' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[contact-firmy] Error:', err)
    return NextResponse.json({ error: 'Nastala chyba pri spracovaní formulára' }, { status: 500 })
  }
}
