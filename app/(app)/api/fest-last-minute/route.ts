import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const CAMP_NAME = 'Fest animátor fest'
const LIST_65 = '65'

function slugifyCampName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, name } = body

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Neplatný email.' }, { status: 400 })
    }
    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: 'Meno je povinné.' }, { status: 400 })
    }

    const cleanEmail = email.trim().toLowerCase()
    const cleanName = name.trim()
    const campTag = slugifyCampName(CAMP_NAME)

    const payload = await getPayloadClient()

    // Save to Payload
    await payload.create({
      collection: 'giveaway-entries',
      data: {
        email: cleanEmail,
        name: cleanName,
        selectedCamp: CAMP_NAME,
        source: 'fest-last-minute-popup',
        syncedToEcomail: false,
      },
    })

    // Ecomail sync — failure does NOT block the response
    try {
      const apiKey = process.env.ECOMAIL_API_KEY
      const listId = process.env.ECOMAIL_LIST_ID ?? '43'

      if (apiKey) {
        // Main list: no autoresponder
        await fetch(`https://api2.ecomailapp.cz/lists/${listId}/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', key: apiKey },
          body: JSON.stringify({
            subscriber_data: {
              email: cleanEmail,
              name: cleanName,
              tags: [campTag],
              custom_fields: { CAMP_NAME },
            },
            trigger_autoresponders: false,
            update_existing: true,
          }),
        })

        // List 65 "Fest Last Minute Zľava": triggers autoresponder
        await fetch(`https://api2.ecomailapp.cz/lists/${LIST_65}/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', key: apiKey },
          body: JSON.stringify({
            subscriber_data: { email: cleanEmail, name: cleanName },
            trigger_autoresponders: true,
            update_existing: true,
          }),
        })

        // Mark as synced in Payload
        const existing = await payload.find({
          collection: 'giveaway-entries',
          where: { email: { equals: cleanEmail } },
          limit: 1,
        })
        if (existing.docs.length > 0) {
          await payload.update({
            collection: 'giveaway-entries',
            id: existing.docs[0].id,
            data: { syncedToEcomail: true },
          })
        }
      }
    } catch (ecomailErr) {
      console.error('[fest-last-minute] Ecomail error (non-blocking):', ecomailErr)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[fest-last-minute] Error:', err)
    return NextResponse.json({ error: 'Interná chyba servera.' }, { status: 500 })
  }
}
