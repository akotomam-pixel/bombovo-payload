import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { insertReview } from '@/lib/reviews-db'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { reviewerName, reviewerType, campName, stars, reviewText } = body

    if (!reviewerName?.trim()) return NextResponse.json({ error: 'Prosím zadajte meno.' }, { status: 400 })
    if (!['tabornik', 'rodic'].includes(reviewerType)) return NextResponse.json({ error: 'Prosím vyberte typ.' }, { status: 400 })
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) return NextResponse.json({ error: 'Prosím vyberte hodnotenie.' }, { status: 400 })
    if (!reviewText?.trim() || reviewText.trim().length < 10) return NextResponse.json({ error: 'Prosím napíšte recenziu (min. 10 znakov).' }, { status: 400 })

    // Save to DB (auto-published, no approval needed)
    await insertReview({ reviewerName: reviewerName.trim(), reviewerType, campName: campName?.trim(), stars, reviewText: reviewText.trim() })

    // Email notification
    const typeLabel = reviewerType === 'tabornik' ? 'Taborník' : 'Rodič taborníka'
    const starsDisplay = '★'.repeat(stars) + '☆'.repeat(5 - stars)
    await resend.emails.send({
      from: 'Bombovo <info@bombovo.sk>',
      to: ['info@bombovo.sk'],
      subject: `Nová recenzia letného tábora od ${reviewerName.trim()}`,
      html: `<!DOCTYPE html><html><body style="font-family:sans-serif;color:#222;padding:20px">
<h2>Nová recenzia – Letný tábor Bombovo</h2>
<table style="border-collapse:collapse;width:100%;max-width:600px">
  <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f9f9f9">Meno</td><td style="padding:8px;border:1px solid #ddd">${reviewerName.trim()}</td></tr>
  <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f9f9f9">Typ</td><td style="padding:8px;border:1px solid #ddd">${typeLabel}</td></tr>
  <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f9f9f9">Hodnotenie</td><td style="padding:8px;border:1px solid #ddd">${starsDisplay} (${stars}/5)</td></tr>
  <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f9f9f9">Recenzia</td><td style="padding:8px;border:1px solid #ddd">${reviewText.trim()}</td></tr>
</table>
<p style="color:#666;font-size:13px">Recenzia bola automaticky zverejnená na bombovo.sk/recenzie</p>
</body></html>`,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[letne-tabory-review] Error:', err)
    return NextResponse.json({ error: 'Interná chyba servera.' }, { status: 500 })
  }
}
