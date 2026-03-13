import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.stredisko || !body.telefon || !body.email) {
      return NextResponse.json({ error: 'Chýbajú povinné polia' }, { status: 400 })
    }

    const { error } = await resend.emails.send({
      from: 'Bombovo <info@bombovo.sk>',
      to: ['sabina.b@bombovo.sk'],
      subject: 'Nova prihlaska SvP',
      text: [
        'Nova prihlaska Skola v prirode',
        '---',
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
