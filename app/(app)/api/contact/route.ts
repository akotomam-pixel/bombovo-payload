import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message, consent } = body

    // Validate required fields
    if (!name || !email || !phone || !message || !consent) {
      return NextResponse.json(
        { error: 'Všetky polia sú povinné' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Neplatný formát e-mailu' },
        { status: 400 }
      )
    }

    // Phone validation
    const phoneRegex = /^(\+421|00421|0)?[0-9]{9}$/
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return NextResponse.json(
        { error: 'Neplatné telefónne číslo' },
        { status: 400 }
      )
    }

    // WebSupport SMTP blocks auth from external cloud IPs (e.g. Vercel/AWS).
    // We delegate sending to a PHP relay script hosted on WebSupport's own
    // servers, where their SMTP is fully accessible.
    const relayUrl = process.env.MAIL_RELAY_URL
    const relaySecret = process.env.MAIL_RELAY_SECRET

    if (!relayUrl || !relaySecret) {
      console.error('MAIL_RELAY_URL or MAIL_RELAY_SECRET env vars are not set')
      return NextResponse.json(
        { error: 'Nastala chyba pri odosielaní správy' },
        { status: 500 }
      )
    }

    const relayResponse = await fetch(relayUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: relaySecret, name, email, phone, message }),
    })

    if (!relayResponse.ok) {
      const relayError = await relayResponse.text()
      console.error('Mail relay error:', relayResponse.status, relayError)
      return NextResponse.json(
        { error: 'Nastala chyba pri odosielaní správy' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Správa bola úspešne odoslaná' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { error: 'Nastala chyba pri spracovaní formulára' },
      { status: 500 }
    )
  }
}
