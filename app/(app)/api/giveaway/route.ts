import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function slugifyCamp(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[áä]/g, 'a')
    .replace(/[čč]/g, 'c')
    .replace(/[ďď]/g, 'd')
    .replace(/[éě]/g, 'e')
    .replace(/[íï]/g, 'i')
    .replace(/[ľĺ]/g, 'l')
    .replace(/[ňň]/g, 'n')
    .replace(/[óô]/g, 'o')
    .replace(/[řŕ]/g, 'r')
    .replace(/[šš]/g, 's')
    .replace(/[ťť]/g, 't')
    .replace(/[úů]/g, 'u')
    .replace(/[ýý]/g, 'y')
    .replace(/[žž]/g, 'z')
    .replace(/[^a-z0-9-]/g, '')
}

async function checkSubscriberExists(apiKey: string, listId: string, email: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://api2.ecomailapp.cz/lists/${listId}/subscriber/${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: { key: apiKey },
      },
    )
    return res.ok
  } catch {
    // If we can't check, treat as new to be safe (autoresponder will still fire)
    return false
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, name, selectedCamp, source } = body

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Neplatný email.' }, { status: 400 })
    }
    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: 'Meno je povinné.' }, { status: 400 })
    }

    const cleanEmail = email.trim().toLowerCase()
    const cleanName = name.trim()

    const payload = await getPayloadClient()

    // Save to Payload
    await payload.create({
      collection: 'giveaway-entries',
      data: {
        email: cleanEmail,
        name: cleanName,
        selectedCamp: selectedCamp || 'Akýkoľvek Tábor',
        source: source || 'popup',
        syncedToEcomail: false,
      },
    })

    // Ecomail sync — failure does NOT block the response
    try {
      const apiKey = process.env.ECOMAIL_API_KEY
      const listId = process.env.ECOMAIL_LIST_ID

      if (apiKey && listId) {
        const campTag = slugifyCamp(selectedCamp || 'akykolvek-tabor')

        // Check if subscriber already exists in the list
        const alreadyExists = await checkSubscriberExists(apiKey, listId, cleanEmail)

        // New contacts get novy-kontakt tag to trigger the welcome sequence.
        // Existing contacts only get the new camp + sutaz tags — no welcome sequence.
        const tags = alreadyExists
          ? [campTag, 'sutaz-2026']
          : ['novy-kontakt', campTag, 'sutaz-2026']

        const ecomailRes = await fetch(
          `https://api2.ecomailapp.cz/lists/${listId}/subscribe`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              key: apiKey,
            },
            body: JSON.stringify({
              subscriber_data: {
                email: cleanEmail,
                name: cleanName,
                tags,
              },
              trigger_autoresponders: !alreadyExists,
              update_existing: true,
            }),
          },
        )

        if (ecomailRes.ok) {
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
        } else {
          const errText = await ecomailRes.text()
          console.error('[giveaway] Ecomail sync failed:', ecomailRes.status, errText)
        }
      }
    } catch (ecomailErr) {
      console.error('[giveaway] Ecomail error (non-blocking):', ecomailErr)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[giveaway] Error:', err)
    return NextResponse.json({ error: 'Interná chyba servera.' }, { status: 500 })
  }
}
