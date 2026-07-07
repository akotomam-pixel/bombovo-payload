import { NextRequest, NextResponse } from 'next/server'
import { insertReview } from '@/lib/reviews-db'

const VELKOSTI = ['S', 'M', 'L', 'XL']

const QUESTIONS = {
  odpoved1: 'Opíš, ako sa ti na tábore páčilo.',
  odpoved2: 'Aký jeden moment z tábora si budeš pamätať najdlhšie?',
  odpoved3: 'Čo by si povedal kamarátovi, ktorý na tábore ešte nebol?',
}

function buildReviewText(odpoved1: string, odpoved2: string, odpoved3: string): string {
  const pairs = [
    [QUESTIONS.odpoved1, odpoved1],
    [QUESTIONS.odpoved2, odpoved2],
    [QUESTIONS.odpoved3, odpoved3],
  ].filter(([, answer]) => answer.trim().length > 0)

  return pairs.map(([question, answer]) => `${question}\n${answer}`).join('\n\n')
}

function generateKod(): string {
  return Math.random().toString(36).slice(2, 10).toUpperCase()
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { meno, priezvisko, tabor, velkost, hodnotenie, odpoved1, odpoved2, odpoved3, suhlas } = body

    if (!meno || String(meno).trim().length === 0) {
      return NextResponse.json({ error: 'Meno je povinné.' }, { status: 400 })
    }
    if (!priezvisko || String(priezvisko).trim().length === 0) {
      return NextResponse.json({ error: 'Priezvisko je povinné.' }, { status: 400 })
    }
    if (!tabor || String(tabor).trim().length === 0) {
      return NextResponse.json({ error: 'Vyber prosím tábor.' }, { status: 400 })
    }
    if (!velkost || !VELKOSTI.includes(String(velkost))) {
      return NextResponse.json({ error: 'Vyber prosím veľkosť mikiny.' }, { status: 400 })
    }
    const hodnotenieNum = Number(hodnotenie)
    if (!Number.isInteger(hodnotenieNum) || hodnotenieNum < 1 || hodnotenieNum > 5) {
      return NextResponse.json({ error: 'Vyber prosím celkové hodnotenie.' }, { status: 400 })
    }
    if (!odpoved1 || String(odpoved1).trim().length === 0) {
      return NextResponse.json({ error: 'Prosím opíš, ako sa ti na tábore páčilo.' }, { status: 400 })
    }
    if (!odpoved2 || String(odpoved2).trim().length === 0) {
      return NextResponse.json({ error: 'Prosím napíš, aký moment si budeš pamätať.' }, { status: 400 })
    }
    if (suhlas !== true) {
      return NextResponse.json({ error: 'Musíš súhlasiť s použitím príbehu.' }, { status: 400 })
    }

    const payload = {
      kod: generateKod(),
      meno: String(meno).trim(),
      priezvisko: String(priezvisko).trim(),
      tabor: String(tabor).trim(),
      velkost: String(velkost),
      hodnotenie: hodnotenieNum,
      odpoved1: String(odpoved1).trim(),
      odpoved2: String(odpoved2).trim(),
      odpoved3: odpoved3 ? String(odpoved3).trim() : '',
      suhlas: true,
    }

    const webhookUrl = process.env.MIKINA_SHEETS_WEBHOOK_URL
    if (!webhookUrl) {
      console.error('[sutazmikinavsl] MIKINA_SHEETS_WEBHOOK_URL is not configured')
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
      console.error('[sutazmikinavsl] Sheets webhook request failed:', fetchErr)
      return NextResponse.json({ error: 'Nepodarilo sa uložiť príbeh. Skúste to prosím znova.' }, { status: 502 })
    }

    if (!sheetsRes.ok) {
      console.error('[sutazmikinavsl] Sheets webhook returned', sheetsRes.status, await sheetsRes.text().catch(() => ''))
      return NextResponse.json({ error: 'Nepodarilo sa uložiť príbeh. Skúste to prosím znova.' }, { status: 502 })
    }

    // Auto-publish to /recenzie — best-effort, does not block the response
    try {
      await insertReview({
        reviewerName: `${payload.meno} ${payload.priezvisko}`,
        reviewerType: 'tabornik',
        campName: payload.tabor,
        stars: payload.hodnotenie,
        reviewText: buildReviewText(payload.odpoved1, payload.odpoved2, payload.odpoved3),
      })
    } catch (reviewErr) {
      console.error('[sutazmikinavsl] insertReview error (non-blocking):', reviewErr)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[sutazmikinavsl] Error:', err)
    return NextResponse.json({ error: 'Interná chyba servera.' }, { status: 500 })
  }
}
