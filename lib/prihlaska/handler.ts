import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getPayloadClient } from '@/lib/payload'
import { captureServer } from '@/lib/posthogServer'
import {
  CONTACT_EMAIL,
  EMPTY_DATA,
  formatBirthDate,
  IBAN,
  PRIHLASKA,
  paymentNote,
  posthogPersonProps,
  validatePrihlaska,
  type PrihlaskaData,
  type PrihlaskaRole,
} from './config'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'Bombovo <info@bombovo.sk>'
const INTERNAL_TO = ['maja@bombovo.sk', 'bombovo@bombovo.sk']
/** Where the applicant's reply to the confirmation lands. CONTACT_EMAIL stays as shown on the site. */
const APPLICANT_REPLY_TO = 'maja@bombovo.sk'

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
//
// Order: validate → save to the DB → internal email → confirmation → record
// the email status. The applicant only sees an error when the application
// reached neither the DB nor Maja's inbox.

const errText = (err: unknown) =>
  err instanceof Error ? err.message : typeof err === 'string' ? err : JSON.stringify(err)

export async function handlePrihlaska(request: NextRequest, role: PrihlaskaRole) {
  const tag = `[prihlaska-${role}]`
  let body: unknown
  let data: PrihlaskaData
  try {
    body = await request.json()
    data = pick(body)
  } catch {
    return NextResponse.json({ error: 'Neplatná požiadavka.' }, { status: 400 })
  }

  const errors = validatePrihlaska(role, data)
  if (Object.keys(errors).length) {
    return NextResponse.json({ error: 'Skontroluj, prosím, povinné polia.', fields: errors }, { status: 400 })
  }

  // Tracking extras from the browser; not part of the application itself.
  const extra = body as Record<string, unknown>
  const clientDistinctId =
    typeof extra.posthog_distinct_id === 'string' ? extra.posthog_distinct_id.slice(0, 200) : undefined
  const isInternal = extra.is_internal === true

  const cfg = PRIHLASKA[role]
  const emailErrors: string[] = []

  // 1. Save first, so the application exists even if every email fails.
  let applicationId: number | null = null
  try {
    const payload = await getPayloadClient()
    const doc = await payload.create({
      collection: 'team-applications',
      overrideAccess: true,
      data: { ...data, role, email: data.email.toLowerCase() },
    })
    applicationId = doc.id
  } catch (err) {
    console.error(tag, 'DB save failed, still sending emails:', err)
  }

  // 2. Internal notification.
  let internalEmailSent = false
  try {
    const internal = await resend.emails.send({
      from: FROM,
      to: INTERNAL_TO,
      replyTo: data.email,
      subject: `Nová prihláška ${cfg.roleName} – ${data.meno} ${data.priezvisko} (${data.termin})`,
      html: internalHtml(role, data),
    })
    if (internal.error) {
      console.error(tag, 'internal email failed:', internal.error)
      emailErrors.push(`Interný email: ${errText(internal.error)}`)
    } else internalEmailSent = true
  } catch (err) {
    console.error(tag, 'internal email threw:', err)
    emailErrors.push(`Interný email: ${errText(err)}`)
  }

  // Lost entirely: tell the applicant so they can try again.
  if (applicationId === null && !internalEmailSent) {
    return NextResponse.json({ error: 'Nastala chyba pri odosielaní.' }, { status: 500 })
  }

  // 3. Confirmation to the applicant. A failure is logged, not shown to them.
  let confirmationEmailSent = false
  try {
    const text = confirmationText(role, data)
    const confirm = await resend.emails.send({
      from: FROM,
      to: [data.email],
      replyTo: APPLICANT_REPLY_TO,
      subject: `Tvoja prihláška do Bombova: školenie ${data.termin}`,
      text,
      html: confirmationHtml(text),
    })
    if (confirm.error) {
      console.error(tag, 'confirmation email failed:', confirm.error)
      emailErrors.push(`Potvrdenie: ${errText(confirm.error)}`)
    } else confirmationEmailSent = true
  } catch (err) {
    console.error(tag, 'confirmation email threw:', err)
    emailErrors.push(`Potvrdenie: ${errText(err)}`)
  }

  // 4. Record how the emails went.
  if (applicationId !== null) {
    try {
      const payload = await getPayloadClient()
      await payload.update({
        collection: 'team-applications',
        id: applicationId,
        overrideAccess: true,
        data: { internalEmailSent, confirmationEmailSent, emailError: emailErrors.join('\n') || null },
      })
    } catch (err) {
      console.error(tag, 'email status update failed:', err)
    }
  }

  // 5. Server-side backup of the conversion event.
  const person = posthogPersonProps(role, data)
  await captureServer({
    distinctId: person.email,
    aliasOf: clientDistinctId,
    event: 'team_application_submitted_server',
    properties: {
      role,
      termin: data.termin,
      application_id: applicationId,
      db_saved: applicationId !== null,
      internal_email_sent: internalEmailSent,
      confirmation_email_sent: confirmationEmailSent,
      ...(isInternal ? { is_internal: true } : {}),
      $set: person,
    },
  })

  return NextResponse.json({ success: true, applicationId })
}
