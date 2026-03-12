import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      datumPrichodu,
      vedúciPobytu,
      nazovSkoly,
      adresa,
      psc,
      mesto,
      telefon,
      email,
      stredisko,
      alternativneStredisko,
      animacnyProgram,
      bombovyBalicek,
      pocetPedagogov,
      vekZiakov,
      pocetZiakov,
      zdravotnik,
      poznamka,
    } = body

    if (!vedúciPobytu || !nazovSkoly || !telefon || !email || !stredisko) {
      return NextResponse.json({ error: 'Chýbajú povinné polia' }, { status: 400 })
    }

    const relayUrl = 'https://bombovo.sk/mail-relay-svp.php'
    const secret = process.env.MAIL_RELAY_SECRET ?? 'BombovO2025relay'

    const relayResponse = await fetch(relayUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret,
        datumPrichodu,
        'vedúciPobytu': vedúciPobytu,
        nazovSkoly,
        adresa,
        psc,
        mesto,
        telefon,
        email,
        stredisko,
        alternativneStredisko,
        animacnyProgram,
        bombovyBalicek,
        pocetPedagogov,
        vekZiakov,
        pocetZiakov,
        zdravotnik,
        poznamka: poznamka ?? '',
      }),
    })

    if (!relayResponse.ok) {
      const relayError = await relayResponse.text()
      console.error('[contact-svp] Mail relay error:', relayResponse.status, relayError)
      return NextResponse.json({ error: 'Nastala chyba pri odosielaní' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[contact-svp] Error:', error)
    return NextResponse.json({ error: 'Nastala chyba pri spracovaní formulára' }, { status: 500 })
  }
}
