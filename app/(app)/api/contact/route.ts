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

    // Format email content
    const emailContent = `
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

    // Log the submission (in production, this would send an email)
    console.log('=== NOVÁ KONTAKTNÁ SPRÁVA ===')
    console.log(emailContent)
    console.log('=== KONIEC SPRÁVY ===')

    // TODO: Implement actual email sending
    // For now, we'll just log and return success
    // You can integrate Nodemailer, SendGrid, Resend, or similar service here
    
    // Example with Nodemailer (requires installation):
    /*
    import nodemailer from 'nodemailer'
    
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'web@bombovo.sk',
      to: 'bombovo@bombovo.sk',
      subject: `Nová správa od ${name}`,
      text: emailContent,
      replyTo: email,
    })
    */

    // For now, simulate successful email sending
    return NextResponse.json(
      { 
        success: true, 
        message: 'Správa bola úspešne odoslaná' 
      },
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
