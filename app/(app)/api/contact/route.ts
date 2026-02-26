import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

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

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const emailText = `
Nová správa z kontaktného formulára - Bombovo.sk

Od: ${name}
E-mail: ${email}
Telefón: ${phone}

Správa:
${message}

---
Odoslaný zo stránky: bombovo.sk/kontakt
Súhlas so spracovaním osobných údajov: Áno
    `.trim()

    const emailHtml = `
<p><strong>Nová správa z kontaktného formulára – Bombovo.sk</strong></p>
<table cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
  <tr><td><strong>Meno:</strong></td><td>${name}</td></tr>
  <tr><td><strong>E-mail:</strong></td><td>${email}</td></tr>
  <tr><td><strong>Telefón:</strong></td><td>${phone}</td></tr>
</table>
<p><strong>Správa:</strong></p>
<p style="white-space:pre-wrap;">${message}</p>
<hr/>
<p style="color:#888;font-size:12px;">Odoslaný zo stránky: bombovo.sk/kontakt<br/>Súhlas so spracovaním osobných údajov: Áno</p>
    `.trim()

    await transporter.sendMail({
      from: '"Bombovo.sk" <info@bombovo.sk>',
      to: 'bombovo@bombovo.sk',
      replyTo: email,
      subject: `Nová správa od ${name}`,
      text: emailText,
      html: emailHtml,
    })

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
