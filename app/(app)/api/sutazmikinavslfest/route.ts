import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

const VELKOSTI = ['S', 'M', 'L', 'XL']
const TABOR = 'FEST Animátor Fest'

function generateKod(): string {
  return Math.random().toString(36).slice(2, 10).toUpperCase()
}

function buildReviewText(odpoved1: string, odpoved2: string, odpoved3: string, odpoved4: string): string {
  return [odpoved1, odpoved2, odpoved3, odpoved4].filter((a) => a.trim().length > 0).join('\n\n')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { meno, priezvisko, velkost, hodnotenie, odpoved1, odpoved2, odpoved3, odpoved4, suhlas } = body

    if (!meno || String(meno).trim().length === 0) {
      return NextResponse.json({ error: 'Meno je povinné.' }, { status: 400 })
    }
    if (!priezvisko || String(priezvisko).trim().length === 0) {
      return NextResponse.json({ error: 'Priezvisko je povinné.' }, { status: 400 })
    }
    if (!velkost || !VELKOSTI.includes(String(velkost))) {
      return NextResponse.json({ error: 'Vyber prosím veľkosť mikiny.' }, { status: 400 })
    }
    const hodnotenieNum = Number(hodnotenie)
    if (!Number.isInteger(hodnotenieNum) || hodnotenieNum < 1 || hodnotenieNum > 5) {
      return NextResponse.json({ error: 'Vyber prosím počet hviezdičiek.' }, { status: 400 })
    }
    if (!odpoved1 || String(odpoved1).trim().length === 0) {
      return NextResponse.json({ error: 'Prosím popíš svoj zážitok z FESTu.' }, { status: 400 })
    }
    if (!odpoved2 || String(odpoved2).trim().length === 0) {
      return NextResponse.json({ error: 'Prosím napíš, čo si najviac zapamätáš.' }, { status: 400 })
    }
    if (suhlas !== true) {
      return NextResponse.json({ error: 'Musíš súhlasiť so zverejnením odpovede.' }, { status: 400 })
    }

    const payload = {
      kod: generateKod(),
      meno: String(meno).trim(),
      priezvisko: String(priezvisko).trim(),
      tabor: TABOR,
      velkost: String(velkost),
      hodnotenie: hodnotenieNum,
      odpoved1: String(odpoved1).trim(),
      odpoved2: String(odpoved2).trim(),
      odpoved3: odpoved3 ? String(odpoved3).trim() : '',
      odpoved4: odpoved4 ? String(odpoved4).trim() : '',
      suhlas: true,
    }

    const webhookUrl = process.env.FEST_SHEETS_WEBHOOK_URL
    if (!webhookUrl) {
      console.error('[sutazmikinavslfest] FEST_SHEETS_WEBHOOK_URL is not configured')
      return NextResponse.json({ error: 'Interná chyba servera.' }, { status: 500 })
    }

    let sheetsRes: Response
    try {
      sheetsRes = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch (fetchErr) {
      console.error('[sutazmikinavslfest] Sheets webhook request failed:', fetchErr)
      return NextResponse.json({ error: 'Nepodarilo sa uložiť odpoveď. Skúste to prosím znova.' }, { status: 502 })
    }

    if (!sheetsRes.ok) {
      console.error(
        '[sutazmikinavslfest] Sheets webhook returned',
        sheetsRes.status,
        await sheetsRes.text().catch(() => ''),
      )
      return NextResponse.json({ error: 'Nepodarilo sa uložiť odpoveď. Skúste to prosím znova.' }, { status: 502 })
    }

    // Auto-publish to /recenzie — best-effort, does not block the response.
    // The letter and consent checkbox on this page both promise the answer is
    // recorded as a public review, matching how the kids' sutazmikinavsl flow works.
    try {
      const cms = await getPayloadClient()
      await cms.create({
        collection: 'letne-tabory-reviews',
        data: {
          reviewerName: `${payload.meno} ${payload.priezvisko}`,
          reviewerType: 'tabornik',
          campName: payload.tabor,
          stars: payload.hodnotenie,
          reviewText: buildReviewText(payload.odpoved1, payload.odpoved2, payload.odpoved3, payload.odpoved4),
        },
      })
    } catch (reviewErr) {
      console.error('[sutazmikinavslfest] insertReview error (non-blocking):', reviewErr)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[sutazmikinavslfest] Error:', err)
    return NextResponse.json({ error: 'Interná chyba servera.' }, { status: 500 })
  }
}
