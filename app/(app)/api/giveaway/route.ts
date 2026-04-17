import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const LIST_44 = '44'
const LIST_45 = '45'

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

async function checkSubscriberExists(apiKey: string, listId: string, email: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://api2.ecomailapp.cz/lists/${listId}/subscriber/${encodeURIComponent(email)}`,
      { method: 'GET', headers: { key: apiKey } },
    )
    return res.ok
  } catch {
    return false
  }
}

async function getSubscriberTags(apiKey: string, listId: string, email: string): Promise<string[]> {
  try {
    const res = await fetch(
      `https://api2.ecomailapp.cz/lists/${listId}/subscriber/${encodeURIComponent(email)}`,
      { method: 'GET', headers: { key: apiKey } },
    )
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data?.tags) ? data.tags : []
  } catch {
    return []
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
    const campName = selectedCamp || 'Akýkoľvek Tábor'
    const campTag = slugifyCampName(campName)

    const payload = await getPayloadClient()

    // Save to Payload
    await payload.create({
      collection: 'giveaway-entries',
      data: {
        email: cleanEmail,
        name: cleanName,
        selectedCamp: campName,
        source: source || 'popup',
        syncedToEcomail: false,
      },
    })

    // Ecomail sync — failure does NOT block the response
    try {
      const apiKey = process.env.ECOMAIL_API_KEY
      const listId = process.env.ECOMAIL_LIST_ID ?? '43'

      if (apiKey) {
        const alreadyExists = await checkSubscriberExists(apiKey, listId, cleanEmail)

        if (!alreadyExists) {
          // NEW contact: add to list 43 (no autoresponder) + list 45 (triggers welcome sequence)
          await fetch(`https://api2.ecomailapp.cz/lists/${listId}/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', key: apiKey },
            body: JSON.stringify({
              subscriber_data: {
                email: cleanEmail,
                name: cleanName,
                tags: [campTag],
                custom_fields: { CAMP_NAME: campName },
              },
              trigger_autoresponders: false,
              update_existing: true,
            }),
          })

          await fetch(`https://api2.ecomailapp.cz/lists/${LIST_45}/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', key: apiKey },
            body: JSON.stringify({
              subscriber_data: { email: cleanEmail, name: cleanName },
              trigger_autoresponders: true,
              update_existing: true,
            }),
          })
        } else {
          // EXISTING contact: fetch existing tags, merge new camp tag, update list 43 + subscribe to list 44
          const existingTags = await getSubscriberTags(apiKey, listId, cleanEmail)
          const mergedTags = Array.from(new Set([...existingTags, campTag]))

          await fetch(`https://api2.ecomailapp.cz/lists/${listId}/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', key: apiKey },
            body: JSON.stringify({
              subscriber_data: {
                email: cleanEmail,
                name: cleanName,
                tags: mergedTags,
                custom_fields: { CAMP_NAME: campName },
              },
              trigger_autoresponders: false,
              update_existing: true,
            }),
          })

          await fetch(`https://api2.ecomailapp.cz/lists/${LIST_44}/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', key: apiKey },
            body: JSON.stringify({
              subscriber_data: { email: cleanEmail, name: cleanName },
              trigger_autoresponders: true,
              update_existing: true,
            }),
          })
        }

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
      console.error('[giveaway] Ecomail error (non-blocking):', ecomailErr)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[giveaway] Error:', err)
    return NextResponse.json({ error: 'Interná chyba servera.' }, { status: 500 })
  }
}
