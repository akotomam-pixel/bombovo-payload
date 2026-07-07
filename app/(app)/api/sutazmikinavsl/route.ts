import { NextRequest, NextResponse } from 'next/server'

function generateKod(): string {
  return Math.random().toString(36).slice(2, 10).toUpperCase()
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { meno, priezvisko, tabor, hodnotenie, odpoved1, odpoved2, odpoved3, suhlas } = body

    if (!meno || String(meno).trim().length === 0) {
      return NextResponse.json({ error: 'Meno je povinné.' }, { status: 400 })
    }
    if (!priezvisko || String(priezvisko).trim().length === 0) {
      return NextResponse.json({ error: 'Priezvisko je povinné.' }, { status: 400 })
    }
    if (!tabor || String(tabor).trim().length === 0) {
      return NextResponse.json({ error: 'Vyber prosím tábor.' }, { status: 400 })
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

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[sutazmikinavsl] Error:', err)
    return NextResponse.json({ error: 'Interná chyba servera.' }, { status: 500 })
  }
}
