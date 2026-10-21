import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import {
  CONTACT_EMAIL,
  EMPTY_DATA,
  formatBirthDate,
  IBAN,
  PRIHLASKA,
  paymentNote,
  validatePrihlaska,
  type PrihlaskaData,
  type PrihlaskaRole,
} from './config'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'Bombovo <info@bombovo.sk>'
const INTERNAL_TO = ['maja@bombovo.sk']

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

/** Takes only the known fields from the request body, coerced to the right types. */
function pick(body: unknown): PrihlaskaData {
  const src = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>
  const out = { ...EMPTY_DATA }
  for (const key of Object.keys(EMPTY_DATA) as (keyof PrihlaskaData)[]) {
    if (key === 'gdpr') out.gdpr = src.gdpr === true
    else out[key] = typeof src[key] === 'string' ? (src[key] as string).trim() : ''
  }
  return out
}

// ─── Internal notification ───────────────────────────────────────────────────

function row(label: string, value: string) {
  return `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f9f9f9;white-space:nowrap;vertical-align:top">${esc(label)}</td><td style="padding:8px;border:1px solid #ddd">${esc(value) || '–'}</td></tr>`
}

function internalHtml(role: PrihlaskaRole, d: PrihlaskaData) {
  const rows: [string, string][] = [
    ['Termín školenia', d.termin],
    ['Titul', d.titul],
    ['Meno', d.meno],
    ['Priezvisko', d.priezvisko],
    ['Dátum narodenia', formatBirthDate(d.datumNarodenia)],
    ['Adresa', d.adresa],
    ['PSČ', d.psc],
    ['Mesto', d.mesto],
    ['Telefón', d.telefon],
    ['Email', d.email],
    ...(role === 'zdravotnik' ? ([['Vzdelanie / odbornosť', d.vzdelanie]] as [string, string][]) : []),
    ['Intolerancie / alergie', d.strava],
    ['Súhlas GDPR', 'áno'],
  ]
  return `<!DOCTYPE html><html><body style="font-family:sans-serif;color:#222;padding:20px">
<h2 style="color:#1a1a2e">Nová prihláška – ${esc(PRIHLASKA[role].roleName)}</h2>
<table style="border-collapse:collapse;width:100%;max-width:600px">${rows.map(([l, v]) => row(l, v)).join('')}</table>
</body></html>`
}

// ─── Confirmation for the applicant ──────────────────────────────────────────
// Text is exactly as supplied; {termín}, {meno}, {priezvisko} are filled in.

function confirmationText(role: PrihlaskaRole, d: PrihlaskaData) {
  const note = paymentNote(d)
  const payment = `Poplatok za školenie ${PRIHLASKA[role].fee} eur uhraď do 14 dní od podania prihlášky:
IBAN: ${IBAN}
Do poznámky je nutné uviesť meno a priezvisko účastníka a termín školenia (${note}).`
  const vCene = `V cene je zahrnuté:
- odborné školenie
- ubytovanie a stravovanie`
  const outro =
    'Bližšie informácie o školení budú zasielané cca 2 týždne pred nástupom na školenie. Ak by si sa rozhodol neabsolvovať školenie, prosím ťa, daj včas vedieť.'
  const invite = `Srdečne ťa pozývame na naše školenie v termíne ${d.termin}, miesto konania je Horský hotel LOMY, Horná Ves okr. Prievidza.`

  if (role === 'animator') {
    return [
      `Ahoj z Bombova,
teší nás Tvoj záujem pracovať ako Animátor pre našu CK Bombovo.`,
      invite,
      payment,
      vCene,
      'Podmienky: viac ako 18 rokov, bezúhonnosť, účasť na školení animátorov.',
      outro,
    ].join('\n\n')
  }
  return [
    `Ahoj z Bombova,
teší nás Tvoj záujem pracovať ako Zdravotník pre našu CK Bombovo.`,
    invite,
    vCene,
    payment,
    `Podmienky: odborne spôsobilá osoba - lekár, sestra, pôrodná asistentka, zdravotnícky záchranár.
Za zdravotníka sa nepovažuje absolvent kurzu Slovenského Červeného kríža, kurz prvej pomoci, ani študent medicíny (medik).`,
    outro,
  ].join('\n\n')
}

/** Turns the plain text into simple, phone-friendly HTML: paragraphs, "- " lines become a list. */
function confirmationHtml(text: string) {
  const blocks = text.split('\n\n').map((block) => {
    const lines = block.split('\n')
    const items = lines.filter((l) => l.startsWith('- '))
    const plain = lines.filter((l) => !l.startsWith('- '))
    let html = plain.length
      ? `<p style="margin:0 0 16px">${plain.map((l) => esc(l)).join('<br>')}</p>`
      : ''
    if (items.length) {
      html += `<ul style="margin:-8px 0 16px;padding-left:22px">${items
        .map((l) => `<li style="margin:0 0 4px">${esc(l.slice(2))}</li>`)
        .join('')}</ul>`
    }
    return html
  })
  return `<!DOCTYPE html><html lang="sk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F3F4F3">
<div style="max-width:560px;margin:0 auto;padding:24px 16px">
<div style="background:#ffffff;border-radius:14px;padding:28px 22px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#1F2320">
${blocks.join('\n')}
</div>
<p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#8A908A;text-align:center;margin:16px 0 0">CK Bombovo · ${CONTACT_EMAIL}</p>
</div>
</body></html>`
}

// ─── Route handler ───────────────────────────────────────────────────────────

export async function handlePrihlaska(request: NextRequest, role: PrihlaskaRole) {
  const tag = `[prihlaska-${role}]`
  let data: PrihlaskaData
  try {
    data = pick(await request.json())
  } catch {
    return NextResponse.json({ error: 'Neplatná požiadavka.' }, { status: 400 })
  }

  const errors = validatePrihlaska(role, data)
  if (Object.keys(errors).length) {
    return NextResponse.json({ error: 'Skontroluj, prosím, povinné polia.', fields: errors }, { status: 400 })
  }

  try {
    const cfg = PRIHLASKA[role]
    const internal = await resend.emails.send({
      from: FROM,
      to: INTERNAL_TO,
      replyTo: data.email,
      subject: `Nová prihláška ${cfg.roleName} – ${data.meno} ${data.priezvisko} (${data.termin})`,
      html: internalHtml(role, data),
    })
    if (internal.error) {
      console.error(tag, 'internal email failed:', internal.error)
      return NextResponse.json({ error: 'Nastala chyba pri odosielaní.' }, { status: 500 })
    }

    // The application is in; a failed confirmation is logged, not shown to the applicant.
    try {
      const text = confirmationText(role, data)
      const confirm = await resend.emails.send({
        from: FROM,
        to: [data.email],
        replyTo: CONTACT_EMAIL,
        subject: `Tvoja prihláška do Bombova: školenie ${data.termin}`,
        text,
        html: confirmationHtml(text),
      })
      if (confirm.error) console.error(tag, 'confirmation email failed:', confirm.error)
    } catch (err) {
      console.error(tag, 'confirmation email threw:', err)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(tag, 'error:', err)
    return NextResponse.json({ error: 'Nastala chyba pri spracovaní formulára.' }, { status: 500 })
  }
}
