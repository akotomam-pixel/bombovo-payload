import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Dedicated list for this feature (Step 2.5) — created once by
// scripts/create-waitlist-ecomail-list.ts, id recorded here.
const LIST_WAITLIST = process.env.ECOMAIL_WAITLIST_LIST_ID
// "kontakty švp 2025" — the general newsletter list every signup also joins.
const LIST_KONTAKTY_SVP = '11'

async function ecomailSubscribe(
  apiKey: string,
  listId: string,
  data: { email: string; meno: string; priezvisko: string; telefon: string; stredisko: string; termin: string },
) {
  const res = await fetch(`https://api2.ecomailapp.cz/lists/${listId}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', key: apiKey },
    body: JSON.stringify({
      subscriber_data: {
        email: data.email,
        name: data.meno,
        surname: data.priezvisko,
        phone: data.telefon,
        custom_fields: { STREDISKO: data.stredisko, TERMIN: data.termin },
      },
      trigger_autoresponders: false,
      update_existing: true,
    }),
  })
  if (!res.ok) {
    throw new Error(`Ecomail subscribe to list ${listId} failed: ${res.status} ${await res.text()}`)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { meno, priezvisko, email, telefon, strediskoId, termin } = body

    if (!meno || !String(meno).trim()) {
      return NextResponse.json({ error: 'Meno je povinné.' }, { status: 400 })
    }
    if (!priezvisko || !String(priezvisko).trim()) {
      return NextResponse.json({ error: 'Priezvisko je povinné.' }, { status: 400 })
    }
    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Neplatný email.' }, { status: 400 })
    }
    if (!telefon || !String(telefon).trim()) {
      return NextResponse.json({ error: 'Telefónne číslo je povinné.' }, { status: 400 })
    }
    if (!strediskoId) {
      return NextResponse.json({ error: 'Chýba stredisko.' }, { status: 400 })
    }
    if (!termin || !String(termin).trim()) {
      return NextResponse.json({ error: 'Chýba termín.' }, { status: 400 })
    }

    const cleanMeno = String(meno).trim()
    const cleanPriezvisko = String(priezvisko).trim()
    const cleanEmail = String(email).trim().toLowerCase()
    const cleanTelefon = String(telefon).trim()
    const cleanTermin = String(termin).trim()

    const payload = await getPayloadClient()

    // Save the signup first — this must succeed independently of Ecomail.
    const signup = await payload.create({
      collection: 'waitlist-signups',
      data: {
        meno: cleanMeno,
        priezvisko: cleanPriezvisko,
        email: cleanEmail,
        telefon: cleanTelefon,
        stredisko: strediskoId,
        termin: cleanTermin,
        status: 'caka',
      },
    })

    // Ecomail sync — failure does NOT block the response, the signup is
    // already captured above regardless of what happens here.
    try {
      const apiKey = process.env.ECOMAIL_API_KEY
      if (!apiKey) {
        console.error('[waitlist-signup] ECOMAIL_API_KEY not set — skipping Ecomail sync for signup', signup.id)
      } else if (!LIST_WAITLIST) {
        console.error('[waitlist-signup] ECOMAIL_WAITLIST_LIST_ID not set — skipping Ecomail sync for signup', signup.id)
      } else {
        const strediskoName = typeof signup.stredisko === 'object' && signup.stredisko ? signup.stredisko.name ?? '' : ''

        const contactData = {
          email: cleanEmail,
          meno: cleanMeno,
          priezvisko: cleanPriezvisko,
          telefon: cleanTelefon,
          stredisko: strediskoName,
          termin: cleanTermin,
        }

        // Dedicated waitlist list — so a future automation can fire only for
        // people who actually clicked this button, not the whole newsletter.
        await ecomailSubscribe(apiKey, LIST_WAITLIST, contactData)
        // Also join the general "kontakty švp 2025" list — silently, no
        // separate opt-in, per the brief.
        await ecomailSubscribe(apiKey, LIST_KONTAKTY_SVP, contactData)
      }
    } catch (ecomailErr) {
      console.error('[waitlist-signup] Ecomail error (non-blocking):', ecomailErr)
    }

    // TODO: teacher's own "thanks, we'll let you know" confirmation email
    // plugs in here. Not built yet — being designed separately (see prompt's
    // "What not to build yet").

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[waitlist-signup] Error:', err)
    return NextResponse.json({ error: 'Interná chyba servera.' }, { status: 500 })
  }
}
