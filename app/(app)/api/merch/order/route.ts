import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { encode } from 'bysquare/pay'
import { PaymentOptions } from 'bysquare/pay'
import QRCode from 'qrcode'
import path from 'path'

const resend = new Resend(process.env.RESEND_API_KEY)
const IBAN = 'SK95 1100 0000 0029 4706 5113'

// ─── helpers ────────────────────────────────────────────────────────────────

function row(label: string, value: string) {
  return `<tr>
    <td style="padding:10px 12px;border:1px solid #e0e0e0;font-weight:bold;background:#f4f4f4;white-space:nowrap;color:#080708">${label}</td>
    <td style="padding:10px 12px;border:1px solid #e0e0e0;color:#080708">${value}</td>
  </tr>`
}

function formatDateSk(d: Date) {
  return d.toLocaleDateString('sk-SK', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// ─── customer email ──────────────────────────────────────────────────────────

function buildCustomerEmail(p: {
  orderId: string; vsNumber: string; firstName: string
  colorLabel: string; size: string; qty: number
  delivery: string; total: number; basePrice: number; shippingPrice: number
  deadlineStr: string
  turnus?: string; street?: string; city?: string; zip?: string
}) {
  const deliverySection = p.delivery === 'shipping'
    ? `<div style="padding:14px 16px;background:#f9f9f9;border-left:4px solid #3772FF;border-radius:4px;margin-top:4px">
        <p style="margin:0 0 4px;font-weight:bold;color:#080708;font-size:14px">Doručovacia adresa</p>
        <p style="margin:0;color:#444;font-size:14px">${p.firstName}, ${p.street}, ${p.zip} ${p.city}</p>
       </div>`
    : `<div style="padding:14px 16px;background:#f0f7ff;border-left:4px solid #3772FF;border-radius:4px;margin-top:4px">
        <p style="margin:0 0 4px;font-weight:bold;color:#080708;font-size:14px">Vyzdvihnutie na tábore</p>
        <p style="margin:0;color:#444;font-size:14px">FEST Animator Fest${p.turnus ? ` — ${p.turnus}` : ''}</p>
       </div>`

  return `<!DOCTYPE html>
<html lang="sk">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff">
<tr><td style="padding:32px 40px 0;max-width:700px">

    <p style="margin:0 0 16px;font-size:20px;font-weight:bold;color:#080708">Ahoj ${p.firstName}!</p>

    <p style="margin:0 0 14px;color:#444;line-height:1.7;font-size:15px">
      Práve mi prišlo info, že si si objednal našu limitovanú edíciu FEST mikiny.
    </p>

    <p style="margin:0 0 14px;color:#444;line-height:1.7;font-size:15px">
      Si jeden z 50 ľudí, ktorým sa mikina ušla. Tak si zagratuluj. 🎉
    </p>

    <p style="margin:0 0 24px;color:#444;line-height:1.7;font-size:15px">
      Predtým, ako ti pošleme mikinu na adresu alebo si ju prevezmeš na FESTe toto leto, musíš ju zaplatiť.
      Keďže ide o predpredaj a máme limitovaný čas na to, aby sme všetko dali dokopy, máš na zaplatenie
      <strong>72 hodín</strong>. Po uplynutí tejto lehoty bude tvoja objednávka automaticky stornovaná.
    </p>

    <!-- Ako zaplatiť -->
    <p style="margin:0 0 10px;font-size:17px;font-weight:bold;color:#080708">Ako zaplatiť?</p>

    <p style="margin:0 0 12px;color:#444;line-height:1.6;font-size:14px">
      Použi QR kód nižšie — otvor svoju bankovú appku, naskenuj ho a platba bude predvyplnená. Stačí potvrdiť.
    </p>

    <p style="margin:0 0 10px;color:#444;font-size:14px">Alebo pošli peniaze manuálne na:</p>

    <div style="background:#f4f4f4;border-radius:8px;padding:14px 16px;margin-bottom:24px">
      <table cellpadding="0" cellspacing="0" style="font-size:13px;color:#444">
        <tr><td style="padding:3px 12px 3px 0;font-weight:bold;color:#080708;white-space:nowrap">IBAN:</td><td style="padding:3px 0;font-family:monospace">${IBAN}</td></tr>
        <tr><td style="padding:3px 12px 3px 0;font-weight:bold;color:#080708;white-space:nowrap">Variabilný symbol:</td><td style="padding:3px 0;font-family:monospace">${p.vsNumber}</td></tr>
      </table>
    </div>

    <!-- QR code -->
    <div style="text-align:center;margin-bottom:24px">
      <img src="cid:qr-code@bombovo" width="200" height="200" alt="QR platba" style="display:block;margin:0 auto;border-radius:8px">
    </div>

    <!-- Order details box -->
    <div style="background:#f9f9f9;border:1px solid #e0e0e0;border-radius:8px;padding:16px 20px;margin-bottom:16px">
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px">
        ${row('Číslo objednávky', p.orderId)}
        ${row('Suma', `€${p.total.toFixed(2)}`)}
        ${row('Zaplatiť do', p.deadlineStr)}
      </table>
    </div>

    <!-- Red deadline box -->
    <div style="background:#DF2935;border-radius:8px;padding:14px 20px;margin-bottom:16px;text-align:center">
      <p style="margin:0;color:#ffffff;font-weight:bold;font-size:15px">⏰ Zaplaťte do: ${p.deadlineStr}</p>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px">Po uplynutí lehoty bude objednávka automaticky stornovaná.</p>
    </div>

    <!-- Yellow preorder warning -->
    <div style="background:#fffbea;border-left:4px solid #FDCA40;border-radius:4px;padding:14px 16px;margin-bottom:20px">
      <p style="margin:0;color:#080708;font-size:14px;line-height:1.6">
        ⚠️ <strong>Toto je predpredaj.</strong> Čas doručenia môže trvať 3 až 5 týždňov od potvrdenia platby.
      </p>
    </div>

    <!-- Delivery -->
    ${deliverySection}

    <p style="margin:20px 0 0;color:#888;font-size:13px;font-style:italic">
      Faktúra je priložená k tomuto emailu ako PDF príloha.
    </p>

  </td></tr>

  <!-- Footer -->
  <tr><td style="padding:24px 40px 32px;border-top:1px solid #e0e0e0;margin-top:20px;max-width:700px">
    <p style="margin:0;color:#666;font-size:13px;line-height:1.6">
      Ak máš akékoľvek otázky, napíš nám na
      <a href="mailto:merch@bombovo.sk" style="color:#3772FF;text-decoration:none">merch@bombovo.sk</a>
    </p>
    <p style="margin:8px 0 0;color:#080708;font-weight:bold;font-size:13px">Tím Bombovo</p>
  </td></tr>

</table>
</body></html>`
}

// ─── admin email ─────────────────────────────────────────────────────────────

function buildAdminEmail(p: {
  orderId: string; firstName: string; lastName: string; email: string; phone: string
  colorLabel: string; size: string; qty: number; delivery: string; total: number
  turnus?: string; street?: string; city?: string; zip?: string
}) {
  const addressRow = p.delivery === 'shipping'
    ? row('Adresa', `${p.street}, ${p.zip} ${p.city}`)
    : row('Adresa', '— vyzdvihnutie na tábore')

  return `<!DOCTYPE html>
<html lang="sk">
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;color:#080708;padding:20px;background:#f0f0f0">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden">
  <tr><td style="background:#080708;padding:20px 24px">
    <h2 style="margin:0;color:#FDCA40;font-size:18px">Nová objednávka – FEST Hoodie</h2>
  </td></tr>
  <tr><td style="padding:24px">
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px">
      ${row('Order ID', p.orderId)}
      ${row('Meno', p.firstName)}
      ${row('Priezvisko', p.lastName)}
      ${row('Email', p.email)}
      ${row('Telefón', p.phone)}
      ${row('Farba', p.colorLabel)}
      ${row('Veľkosť', p.size)}
      ${row('Množstvo', String(p.qty))}
      ${row('Doručenie', p.delivery === 'shipping' ? 'Doručenie na adresu (+€5.34)' : 'Vyzdvihnutie na tábore (zadarmo)')}
      ${addressRow}
      ${p.turnus ? row('Turnus', p.turnus) : ''}
      ${row('Celkom', `€${p.total.toFixed(2)}`)}
    </table>
    <p style="margin:20px 0 0;padding:12px;background:#fff8e1;border-left:4px solid #FDCA40;font-size:13px;color:#444">
      Skontroluj bankový účet a po platbe označ ako <strong>Zaplatené</strong> v Google Sheet.
    </p>
  </td></tr>
</table>
</body></html>`
}

// ─── PDF faktúra ─────────────────────────────────────────────────────────────

async function generateFaktura(p: {
  orderId: string; vsNumber: string
  firstName: string; lastName: string
  colorLabel: string; size: string; qty: number
  delivery: string; basePrice: number; shippingPrice: number; total: number
  street?: string; city?: string; zip?: string
  issuedAt: Date; dueDate: Date
}): Promise<Buffer> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfmake = require('pdfmake')
  pdfmake.setLocalAccessPolicy(() => true)
  pdfmake.setUrlAccessPolicy(() => false)
  pdfmake.addFonts({
    Roboto: {
      normal: path.join(process.cwd(), 'node_modules/pdfmake/build/fonts/Roboto/Roboto-Regular.ttf'),
      bold: path.join(process.cwd(), 'node_modules/pdfmake/build/fonts/Roboto/Roboto-Medium.ttf'),
      italics: path.join(process.cwd(), 'node_modules/pdfmake/build/fonts/Roboto/Roboto-Italic.ttf'),
      bolditalics: path.join(process.cwd(), 'node_modules/pdfmake/build/fonts/Roboto/Roboto-MediumItalic.ttf'),
    },
  })

  const itemTotal = parseFloat((p.basePrice * p.qty).toFixed(2))
  const itemBezDph = parseFloat((itemTotal / 1.23).toFixed(2))
  const itemDph = parseFloat((itemTotal - itemBezDph).toFixed(2))

  const tableBody: object[][] = [
    [
      { text: 'Popis', bold: true, fillColor: '#f4f4f4' },
      { text: 'Cena bez DPH', bold: true, fillColor: '#f4f4f4', alignment: 'right' },
      { text: 'DPH 23%', bold: true, fillColor: '#f4f4f4', alignment: 'right' },
      { text: 'Cena s DPH', bold: true, fillColor: '#f4f4f4', alignment: 'right' },
    ],
    [
      { text: `FEST Animator Hoodie 2026 · ${p.colorLabel} · ${p.size} · ${p.qty}ks` },
      { text: `€${itemBezDph.toFixed(2)}`, alignment: 'right' },
      { text: `€${itemDph.toFixed(2)}`, alignment: 'right' },
      { text: `€${itemTotal.toFixed(2)}`, alignment: 'right' },
    ],
  ]

  let sumBezDph = itemBezDph
  let sumDph = itemDph
  let sumTotal = itemTotal

  if (p.shippingPrice > 0) {
    tableBody.push([
      { text: 'Doprava Slovenská pošta' },
      { text: '€4.34', alignment: 'right' },
      { text: '€1.00', alignment: 'right' },
      { text: '€5.34', alignment: 'right' },
    ])
    sumBezDph = parseFloat((sumBezDph + 4.34).toFixed(2))
    sumDph = parseFloat((sumDph + 1.00).toFixed(2))
    sumTotal = parseFloat((sumTotal + 5.34).toFixed(2))
  }

  tableBody.push([
    { text: 'SPOLU', bold: true },
    { text: `€${sumBezDph.toFixed(2)}`, bold: true, alignment: 'right' },
    { text: `€${sumDph.toFixed(2)}`, bold: true, alignment: 'right' },
    { text: `€${sumTotal.toFixed(2)}`, bold: true, alignment: 'right' },
  ])

  const recipientStack: object[] = [
    { text: 'ODBERATEĽ', fontSize: 8, bold: true, color: '#888888', margin: [0, 0, 0, 4] },
    { text: `${p.firstName} ${p.lastName}`, bold: true, fontSize: 10 },
  ]
  if (p.delivery === 'shipping' && p.street && p.city && p.zip) {
    recipientStack.push({ text: p.street, fontSize: 10 } as object)
    recipientStack.push({ text: `${p.zip} ${p.city}`, fontSize: 10 } as object)
  }

  const docDef = {
    pageSize: 'A4',
    pageMargins: [40, 40, 40, 60],
    defaultStyle: { font: 'Roboto', fontSize: 10, color: '#080708' },
    content: [
      // ── Header ──────────────────────────────────────────────────────────
      {
        columns: [
          {
            stack: [
              { text: 'FAKTÚRA', fontSize: 24, bold: true },
              { text: `č. 2026-${p.orderId}`, fontSize: 11, color: '#666666', margin: [0, 2, 0, 0] },
            ],
          },
          {
            image: path.join(process.cwd(), 'public/images/hat1.jpg'),
            width: 70,
            alignment: 'right',
          },
        ],
        margin: [0, 0, 0, 16],
      },
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#e0e0e0' }], margin: [0, 0, 0, 16] },

      // ── Dodávateľ / Odberateľ ───────────────────────────────────────────
      {
        columns: [
          {
            stack: [
              { text: 'DODÁVATEĽ', fontSize: 8, bold: true, color: '#888888', margin: [0, 0, 0, 4] },
              { text: 'BOMBOVO cestovná kancelária s.r.o.', bold: true },
              { text: 'Široká 5049/24, 949 05 Nitra' },
              { text: ' ', fontSize: 5 },
              { text: 'IČO: 36539961', fontSize: 9, color: '#666' },
              { text: 'DIČ: 2020152937', fontSize: 9, color: '#666' },
              { text: 'IČ DPH: SK2020152937', fontSize: 9, color: '#666' },
              { text: `IBAN: ${IBAN}`, fontSize: 9, color: '#666' },
            ],
          },
          { stack: recipientStack, alignment: 'right' },
        ],
        margin: [0, 0, 0, 20],
      },
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#e0e0e0' }], margin: [0, 0, 0, 14] },

      // ── Invoice meta ─────────────────────────────────────────────────────
      {
        columns: [
          { stack: [{ text: 'Číslo faktúry', fontSize: 8, bold: true, color: '#888', margin: [0, 0, 0, 3] }, { text: `2026-${p.orderId}` }] },
          { stack: [{ text: 'Dátum vystavenia', fontSize: 8, bold: true, color: '#888', margin: [0, 0, 0, 3] }, { text: formatDateSk(p.issuedAt) }] },
          { stack: [{ text: 'Dátum splatnosti', fontSize: 8, bold: true, color: '#888', margin: [0, 0, 0, 3] }, { text: formatDateSk(p.dueDate) }] },
          { stack: [{ text: 'Spôsob platby', fontSize: 8, bold: true, color: '#888', margin: [0, 0, 0, 3] }, { text: 'Bankový prevod' }] },
        ],
        margin: [0, 0, 0, 20],
      },

      // ── Items table ──────────────────────────────────────────────────────
      {
        table: {
          headerRows: 1,
          widths: ['*', 'auto', 'auto', 'auto'],
          body: tableBody,
        },
        layout: {
          hLineWidth: (i: number, node: { table: { body: object[][] } }) =>
            i === 0 || i === 1 || i === node.table.body.length ? 1 : 0.5,
          vLineWidth: () => 0,
          hLineColor: () => '#e0e0e0',
          paddingLeft: () => 8,
          paddingRight: () => 8,
          paddingTop: () => 7,
          paddingBottom: () => 7,
        },
        margin: [0, 0, 0, 20],
      },

      // ── Payment details ──────────────────────────────────────────────────
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#e0e0e0' }], margin: [0, 0, 0, 12] },
      { text: 'Platobné údaje', fontSize: 8, bold: true, color: '#888888', margin: [0, 0, 0, 6] },
      { text: 'Platba: Bankový prevod' },
      { text: `IBAN: ${IBAN}` },
      { text: `Variabilný symbol: ${p.vsNumber}` },
      { text: ' ', fontSize: 5 },
      { text: 'Tovar bude doručený po prijatí platby.', fontSize: 9, color: '#666' },
      { text: 'Toto je predpredaj. Čas doručenia môže trvať 3 až 5 týždňov.', fontSize: 9, color: '#666' },
    ],
  }

  const doc = pdfmake.createPdf(docDef)
  return doc.getBuffer() as Promise<Buffer>
}

// ─── POST handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, color, colorLabel, size, qty, delivery, turnus, street, city, zip } = body

    if (!firstName || !lastName || !email || !phone || !color || !size || !qty || !delivery) {
      return NextResponse.json({ error: 'Chýbajú povinné polia' }, { status: 400 })
    }
    if (delivery === 'shipping' && (!street || !city || !zip)) {
      return NextResponse.json({ error: 'Chýba doručovacia adresa' }, { status: 400 })
    }

    const orderNum = Date.now().toString().slice(-6)
    const orderId = `FEST-${orderNum}`
    const vsNumber = orderNum

    const basePrice = 39.99
    const shippingPrice = delivery === 'shipping' ? 5.34 : 0
    const total = parseFloat((basePrice * Number(qty) + shippingPrice).toFixed(2))

    const issuedAt = new Date()
    const deadline = new Date(Date.now() + 72 * 60 * 60 * 1000)
    const deadlineStr = deadline.toLocaleString('sk-SK', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Bratislava',
    })

    const rawIban = IBAN.replace(/\s/g, '')
    const bysquareString = encode({
      payments: [{
        type: PaymentOptions.PaymentOrder,
        amount: total,
        currencyCode: 'EUR',
        variableSymbol: vsNumber,
        paymentNote: orderId,
        bankAccounts: [{ iban: rawIban }],
        beneficiary: { name: 'Bombovo' },
      }],
    })
    const qrBuffer: Buffer = await QRCode.toBuffer(bysquareString, {
      errorCorrectionLevel: 'M',
      width: 300,
      margin: 1,
    })

    if (process.env.MERCH_SHEETS_URL) {
      fetch(process.env.MERCH_SHEETS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId, firstName, lastName, email, phone,
          color, size, qty: Number(qty), delivery,
          turnus: turnus ?? '',
          street: street ?? '', city: city ?? '', zip: zip ?? '',
          total, timestamp: new Date().toISOString(),
          paid: 'NIE', shipped: 'NIE',
        }),
      }).catch(err => console.error('[merch/order] Sheets error:', err))
    }

    const pdfBuffer = await generateFaktura({
      orderId, vsNumber, firstName, lastName,
      colorLabel, size, qty: Number(qty),
      delivery, basePrice, shippingPrice, total,
      street, city, zip,
      issuedAt, dueDate: deadline,
    })

    const { error: customerError } = await resend.emails.send({
      from: 'Bombovo <info@bombovo.sk>',
      to: [email],
      subject: `Objednávka FEST Mikina – zaplaťte do 72 hodín ⏳`,
      html: buildCustomerEmail({
        orderId, vsNumber, firstName, colorLabel, size, qty: Number(qty),
        delivery, total, basePrice, shippingPrice,
        deadlineStr,
        turnus, street, city, zip,
      }),
      attachments: [
        {
          filename: `faktura-${orderId}.pdf`,
          content: pdfBuffer,
        },
        {
          filename: 'qr-platba.png',
          content: qrBuffer,
          contentId: 'qr-code@bombovo',
        },
      ],
    })

    if (customerError) {
      console.error('[merch/order] Customer email error:', customerError)
      return NextResponse.json({ error: 'Nastala chyba pri odosielaní emailu' }, { status: 500 })
    }

    await resend.emails.send({
      from: 'Bombovo <info@bombovo.sk>',
      to: [process.env.MERCH_ADMIN_EMAIL ?? 'merch@bombovo.sk'],
      subject: `Nová objednávka ${orderId} – ${firstName} ${lastName}`,
      html: buildAdminEmail({
        orderId, firstName, lastName, email, phone,
        colorLabel, size, qty: Number(qty), delivery, total,
        turnus, street, city, zip,
      }),
    })

    return NextResponse.json({ success: true, orderId })
  } catch (err) {
    console.error('[merch/order] Error:', err)
    return NextResponse.json({ error: 'Nastala chyba pri spracovaní objednávky' }, { status: 500 })
  }
}
