import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

function row(label: string, value: string) {
  return `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f9f9f9;white-space:nowrap">${label}</td><td style="padding:8px;border:1px solid #ddd">${value}</td></tr>`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.meno || !body.priezvisko || !body.telefon || !body.email) {
      return NextResponse.json({ error: 'Chýbajú povinné polia' }, { status: 400 })
    }

    const v = (val: string | undefined) => val ?? ''
    const arr = (val: string[] | undefined) => Array.isArray(val) ? val.join(', ') : ''

    const { error } = await resend.emails.send({
      from: 'Bombovo <info@bombovo.sk>',
      to: ['pata@bombovo.sk'],
      subject: 'Nova prihlaska Animator',
      html: `<!DOCTYPE html><html><body style="font-family:sans-serif;color:#222;padding:20px">
<h2 style="color:#1a1a2e">Nová prihláška – Animátor</h2>
<table style="border-collapse:collapse;width:100%;max-width:600px">
  ${row('Titul', v(body.titul))}
  ${row('Meno', v(body.meno))}
  ${row('Priezvisko', v(body.priezvisko))}
  ${row('Dátum narodenia', `${v(body.denNarodenia)}.${v(body.mesiacNarodenia)}.${v(body.rokNarodenia)}`)}
  ${row('Adresa', v(body.adresa))}
  ${row('Telefón', v(body.telefon))}
  ${row('Email', v(body.email))}
  ${row('Štúdium / Zamestnanie', v(body.studium))}
  ${row('Animátor skúsenosti', v(body.animatorSkusenost))}
  ${row('Skúsenosti s deťmi', v(body.skusenostiDeti))}
  ${row('Preferovaný vek detí', arr(body.vekPreferencia))}
  ${row('Koníčky a zručnosti', v(body.konicky))}
  ${row('Programy a skúsenosti', arr(body.programySkusenosti))}
  ${row('Popis skúseností', v(body.opisSkusenosti))}
  ${row('Hlavný dôvod prihlášky', v(body.hlavnyDovod))}
  ${row('Špeciálna strava / Alergie', v(body.strava))}
  ${row('Termín školenia', v(body.termin))}
</table>
</body></html>`,
    })

    if (error) {
      console.error('[contact-animator] Resend error:', error)
      return NextResponse.json({ error: 'Nastala chyba pri odosielaní' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[contact-animator] Error:', err)
    return NextResponse.json({ error: 'Nastala chyba pri spracovaní formulára' }, { status: 500 })
  }
}
