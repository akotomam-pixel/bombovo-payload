import { Resend } from 'resend'
import { getPayloadClient } from '@/lib/payload'
import { ecomailSubscribe, ecomailTriggerPipeline } from '@/lib/ecomail'

const resend = new Resend(process.env.RESEND_API_KEY)

const INTERNAL_ALERT_TO = 'bombovo@bombovo.sk'

const SITE_URL = 'https://bombovo.sk'

// "ŠVP Čakacia listina - Termín voľný" — fires for every teacher still
// waiting on this exact stredisko + termín, at the same moment as the
// internal team alert below.
const PIPELINE_TERMIN_VOLNY = 47098

/** Random display number 3–12 inclusive — a merge-tag flourish, not a real count. Independently rolled per teacher, per Matej. */
function randomPocetPedagogov(): number {
  return 3 + Math.floor(Math.random() * 10)
}

/**
 * Called whenever a termín that was sold out becomes available again —
 * from the Payload `strediska.dates[].available` afterChange hook for
 * strediská still on the original Payload-backed detail page, and from
 * `scripts/waitlist-check.ts` for the "rebuilt architecture" strediská
 * (Lomy, Minciar, Martinské Hole, Roháčan, Osrblie, Palušák, Lagáň), whose
 * termín status lives as hand-typed text in data/{slug}/content.ts and has
 * no database write to hook into — see that script's docstring for why this
 * has to be triggered manually there.
 *
 * Looks up every `čaká` signup for this exact stredisko + termín, emails
 * bombovo@bombovo.sk one ranked list (oldest signup first), and marks those
 * entries `upozornené` so they aren't picked up by a later reopen of the
 * same termín.
 *
 * TODO: this is also where the teacher's own "your termín is free" email
 * would be triggered — intentionally not built yet, see the waitlist prompt's
 * "What not to build yet" section. The EcoMail automation for that is being
 * designed separately.
 */
export async function checkAndAlertWaitlist(strediskoId: string | number, terminLabel: string): Promise<void> {
  const payload = await getPayloadClient()

  const waiting = await payload.find({
    collection: 'waitlist-signups',
    where: {
      and: [
        { stredisko: { equals: strediskoId } },
        { termin: { equals: terminLabel } },
        { status: { equals: 'caka' } },
      ],
    },
    sort: 'createdAt',
    limit: 1000,
    depth: 1,
  })

  if (waiting.docs.length === 0) return

  const strediskoDoc = waiting.docs[0].stredisko as unknown as { name?: string; slug?: string } | number | null
  const strediskoName = strediskoDoc && typeof strediskoDoc === 'object' ? strediskoDoc.name ?? strediskoId : strediskoId
  const strediskoUrl =
    strediskoDoc && typeof strediskoDoc === 'object' && strediskoDoc.slug
      ? `${SITE_URL}/skoly-v-prirode/${strediskoDoc.slug}`
      : ''

  const rows = waiting.docs
    .map((doc, i) => {
      const n = i + 1
      return `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">${n}</td><td style="padding:8px;border:1px solid #ddd">${doc.meno} ${doc.priezvisko}</td><td style="padding:8px;border:1px solid #ddd">${doc.email}</td><td style="padding:8px;border:1px solid #ddd">${doc.telefon}</td></tr>`
    })
    .join('')

  const { data, error } = await resend.emails.send({
    from: 'Bombovo <info@bombovo.sk>',
    to: [INTERNAL_ALERT_TO],
    subject: `Waitlist: ${strediskoName} / ${terminLabel} je opäť dostupný`,
    html: `<!DOCTYPE html><html><body style="font-family:sans-serif;color:#222;padding:20px">
<h2 style="color:#1a1a2e">Termín sa uvoľnil — waitlist pre ${strediskoName} / ${terminLabel}</h2>
<p>Zavolajte prvému v poradí. Ak nedvíha alebo už nemá záujem, pokračujte ďalším v poradí.</p>
<table style="border-collapse:collapse;width:100%;max-width:700px">
  <tr><th style="padding:8px;border:1px solid #ddd;text-align:left">#</th><th style="padding:8px;border:1px solid #ddd;text-align:left">Meno</th><th style="padding:8px;border:1px solid #ddd;text-align:left">Email</th><th style="padding:8px;border:1px solid #ddd;text-align:left">Telefón</th></tr>
  ${rows}
</table>
</body></html>`,
  })

  if (error) {
    console.error('[waitlistAlert] Resend error:', error)
    throw new Error('Failed to send waitlist alert email')
  }
  console.log('[waitlistAlert] Sent, Resend id:', data?.id)

  // "ŠVP Čakacia listina - Termín voľný" — one Ecomail trigger per waiting
  // teacher. Each gets an independently random pocet_pedagogov (3–12); a
  // failure for one person is logged and skipped, never stops the loop or
  // blocks marking entries upozornené below.
  const apiKey = process.env.ECOMAIL_API_KEY
  const listId = process.env.ECOMAIL_WAITLIST_LIST_ID
  if (!apiKey || !listId) {
    console.error('[waitlistAlert] ECOMAIL_API_KEY/ECOMAIL_WAITLIST_LIST_ID not set — skipping termín-free Ecomail triggers')
  } else {
    for (const doc of waiting.docs) {
      try {
        await ecomailSubscribe(apiKey, listId, {
          email: doc.email,
          meno: doc.meno,
          priezvisko: doc.priezvisko,
          telefon: doc.telefon,
          customFields: {
            stredisko: strediskoName,
            termin: terminLabel,
            stredisko_url: strediskoUrl,
            pocet_pedagogov: randomPocetPedagogov(),
          },
        })
        await ecomailTriggerPipeline(apiKey, PIPELINE_TERMIN_VOLNY, doc.email)
      } catch (ecomailErr) {
        console.error(`[waitlistAlert] Ecomail "termín voľný" trigger failed for ${doc.email}:`, ecomailErr)
      }
    }
  }

  await Promise.all(
    waiting.docs.map((doc) =>
      payload.update({
        collection: 'waitlist-signups',
        id: doc.id,
        data: { status: 'upozornene' },
      }),
    ),
  )
}
