import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

function row(label: string, value: string) {
  return `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f9f9f9;white-space:nowrap">${label}</td><td style="padding:8px;border:1px solid #ddd">${value}</td></tr>`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.teacherName || !body.phone || !body.email) {
      return NextResponse.json({ error: 'Chýbajú povinné polia' }, { status: 400 })
    }

    const v = (val: string | undefined) => val ?? ''

    const { error } = await resend.emails.send({
      from: 'Bombovo <info@bombovo.sk>',
      to: ['sabina.b@bombovo.sk'],
      subject: 'Nova prihlaska Skolske vylety',
      html: `<!DOCTYPE html><html><body style="font-family:sans-serif;color:#222;padding:20px">
<h2 style="color:#1a1a2e">Nová prihláška – Školské výlety</h2>
<table style="border-collapse:collapse;width:100%;max-width:600px">
  ${row('Meno pedagóga', v(body.teacherName))}
  ${row('Adresa školy', v(body.schoolAddress))}
  ${row('Telefón', v(body.phone))}
  ${row('Email', v(body.email))}
  ${row('Počet osôb', v(body.numberOfPeople))}
  ${row('Poznámka', v(body.note))}
</table>
</body></html>`,
    })

    if (error) {
      console.error('[contact-vylety] Resend error:', error)
      return NextResponse.json({ error: 'Nastala chyba pri odosielaní' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[contact-vylety] Error:', err)
    return NextResponse.json({ error: 'Nastala chyba pri spracovaní formulára' }, { status: 500 })
  }
}
