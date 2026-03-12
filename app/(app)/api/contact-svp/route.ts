import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.stredisko || !body.telefon || !body.email) {
      return NextResponse.json({ error: 'Chýbajú povinné polia' }, { status: 400 })
    }

    const relayUrl = 'https://bombovo.sk/mail-relay-svp.php'
    const secret = process.env.MAIL_RELAY_SECRET ?? 'BombovO2025relay'

    // Pass the entire form body through to the relay, just adding the secret
    const relayResponse = await fetch(relayUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, secret }),
    })

    const relayText = await relayResponse.text()
    console.log('[contact-svp] Relay status:', relayResponse.status, 'Response:', relayText)

    if (!relayResponse.ok) {
      return NextResponse.json({ error: 'Nastala chyba pri odosielaní' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[contact-svp] Error:', error)
    return NextResponse.json({ error: 'Nastala chyba pri spracovaní formulára' }, { status: 500 })
  }
}
