import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { ecomailSubscribe, ecomailTriggerPipeline } from '@/lib/ecomail'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Dedicated list for this feature (Step 2.5) — created once by
// scripts/create-waitlist-ecomail-list.ts, id recorded here.
const LIST_WAITLIST = process.env.ECOMAIL_WAITLIST_LIST_ID
// "kontakty švp 2025" — the general newsletter list every signup also joins.
const LIST_KONTAKTY_SVP = '11'

const SITE_URL = 'https://bombovo.sk'

// "ŠVP Čakacia listina - Potvrdenie" — fires right after a signup is saved
// and synced, confirming to the teacher that they're on the list.
const PIPELINE_CONFIRMATION = 47097

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
        const strediskoDoc = typeof signup.stredisko === 'object' && signup.stredisko ? signup.stredisko : null
        const strediskoName = strediskoDoc?.name ?? ''
        const strediskoUrl = strediskoDoc?.slug ? `${SITE_URL}/skoly-v-prirode/${strediskoDoc.slug}` : ''

        const contactData = {
          email: cleanEmail,
          meno: cleanMeno,
          priezvisko: cleanPriezvisko,
          telefon: cleanTelefon,
          customFields: { stredisko: strediskoName, termin: cleanTermin, stredisko_url: strediskoUrl },
        }

        // Dedicated waitlist list — so the Ecomail automations (and any
        // future one) fire only for people who actually clicked this
        // button, not the whole newsletter.
        await ecomailSubscribe(apiKey, LIST_WAITLIST, contactData)
        // Also join the general "kontakty švp 2025" list — silently, no
        // separate opt-in, per the brief.
        await ecomailSubscribe(apiKey, LIST_KONTAKTY_SVP, contactData)

        // "ŠVP Čakacia listina - Potvrdenie" — confirms to the teacher
        // they're on the waitlist. Own try/catch so a trigger failure logs
        // distinctly from a subscribe failure above.
        try {
          await ecomailTriggerPipeline(apiKey, PIPELINE_CONFIRMATION, cleanEmail)
        } catch (triggerErr) {
          console.error('[waitlist-signup] Ecomail confirmation pipeline trigger failed (non-blocking):', triggerErr)
        }
      }
    } catch (ecomailErr) {
      console.error('[waitlist-signup] Ecomail error (non-blocking):', ecomailErr)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[waitlist-signup] Error:', err)
    return NextResponse.json({ error: 'Interná chyba servera.' }, { status: 500 })
  }
}
