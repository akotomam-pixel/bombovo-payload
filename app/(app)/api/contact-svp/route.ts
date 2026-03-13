import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

function esc(val: string | undefined): string {
  return (val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/[^\x00-\x7F]/g, (c) => `&#${c.charCodeAt(0)};`)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.stredisko || !body.telefon || !body.email) {
      return NextResponse.json({ error: 'Chýbajú povinné polia' }, { status: 400 })
    }

    const { error } = await resend.emails.send({
      from: 'Bombovo <info@bombovo.sk>',
      to: ['sabina@bombovo.sk'],
      subject: 'Nova prihlaska SvP',
      text: [
        'Nova prihlaska Skola v prirode',
        `Datum prichodu: ${body.datumPrichodu ?? ''}`,
        `Datum odchodu: ${body.datumOdchodu ?? ''}`,
        `Veduci pobytu: ${body.veduciPobytu ?? ''}`,
        `Nazov skoly: ${body.nazovSkoly ?? ''}`,
        `Adresa: ${body.adresa ?? ''}`,
        `PSC: ${body.psc ?? ''}`,
        `Mesto: ${body.mesto ?? ''}`,
        `Telefon: ${body.telefon ?? ''}`,
        `Email: ${body.email ?? ''}`,
        `Stredisko: ${body.stredisko ?? ''}`,
        `Alternativne stredisko: ${body.alternativneStredisko ?? ''}`,
        `Vek ziakov: ${body.vekZiakov ?? ''}`,
        `Pocet ziakov: ${body.pocetZiakov ?? ''}`,
        `Pocet pedagogov: ${body.pocetPedagogov ?? ''}`,
        `Zdravotnik: ${body.zdravotnik ?? ''}`,
        `Animacny program: ${body.animacnyProgram ?? ''}`,
        `Bombovy balicek: ${body.bombovyBalicek ?? ''}`,
        `Poznamka: ${body.poznamka ?? ''}`,
      ].join('\n'),
      html: `<html><body>
<h2>Nova prihlaska Skola v prirode</h2>
<table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse;font-family:sans-serif;">
  <tr><td><b>Datum prichodu</b></td><td>${esc(body.datumPrichodu)}</td></tr>
  <tr><td><b>Datum odchodu</b></td><td>${esc(body.datumOdchodu)}</td></tr>
  <tr><td><b>Veduci pobytu</b></td><td>${esc(body.veduciPobytu)}</td></tr>
  <tr><td><b>Nazov skoly</b></td><td>${esc(body.nazovSkoly)}</td></tr>
  <tr><td><b>Adresa</b></td><td>${esc(body.adresa)}</td></tr>
  <tr><td><b>PSC</b></td><td>${esc(body.psc)}</td></tr>
  <tr><td><b>Mesto</b></td><td>${esc(body.mesto)}</td></tr>
  <tr><td><b>Telefon</b></td><td>${esc(body.telefon)}</td></tr>
  <tr><td><b>Email</b></td><td>${esc(body.email)}</td></tr>
  <tr><td><b>Stredisko</b></td><td>${esc(body.stredisko)}</td></tr>
  <tr><td><b>Alternativne stredisko</b></td><td>${esc(body.alternativneStredisko)}</td></tr>
  <tr><td><b>Vek ziakov</b></td><td>${esc(body.vekZiakov)}</td></tr>
  <tr><td><b>Pocet ziakov</b></td><td>${esc(body.pocetZiakov)}</td></tr>
  <tr><td><b>Pocet pedagogov</b></td><td>${esc(body.pocetPedagogov)}</td></tr>
  <tr><td><b>Zdravotnik</b></td><td>${esc(body.zdravotnik)}</td></tr>
  <tr><td><b>Animacny program</b></td><td>${esc(body.animacnyProgram)}</td></tr>
  <tr><td><b>Bombovy balicek</b></td><td>${esc(body.bombovyBalicek)}</td></tr>
  <tr><td><b>Poznamka</b></td><td>${esc(body.poznamka)}</td></tr>
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
