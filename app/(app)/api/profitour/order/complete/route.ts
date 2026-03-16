import { NextRequest, NextResponse } from 'next/server'
import { soapCall } from '@/lib/profis'

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
      { method: 'GET', headers: { key: apiKey } },
    )
    return res.ok
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  let body: { id_Objednavka?: number; klic?: string; email?: string; name?: string; campName?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { id_Objednavka, klic, email, name, campName } = body
  if (!id_Objednavka || !klic) {
    return NextResponse.json({ error: 'Missing required fields: id_Objednavka, klic' }, { status: 400 })
  }

  try {
    // ObjednavkaDokoncit uses ObjednavkaContext (extends Context) which carries
    // the order ID and key. Field order: base Context fields first, then own fields
    // alphabetically: Klic (K=75) before id_Objednavka (i=105).
    // Data element (ObjednavkaDokoncitInput) contains MinimalniDelkaRezervace.
    await soapCall('Objednavka', 'ObjednavkaDokoncit', `
      <ns:Context>
        <ns:UzivatelHeslo>${process.env.PROFIS_HESLO}</ns:UzivatelHeslo>
        <ns:UzivatelLogin>${process.env.PROFIS_LOGIN}</ns:UzivatelLogin>
        <ns:VypsatNazvy>false</ns:VypsatNazvy>
        <ns:id_Jazyk>${process.env.PROFIS_ID_JAZYK}</ns:id_Jazyk>
        <ns:Klic>${klic}</ns:Klic>
        <ns:id_Objednavka>${id_Objednavka}</ns:id_Objednavka>
      </ns:Context>
      <ns:Data>
        <ns:MinimalniDelkaRezervace>0</ns:MinimalniDelkaRezervace>
      </ns:Data>`)

    // ── Ecomail sync (Hlavný zoznam tábory) ─────────────────────────────────────
    // Runs after Profis is fully finalized. Failure is silent — purchase is never blocked.
    if (email && name) {
      try {
        const apiKey = process.env.ECOMAIL_API_KEY
        const listId = process.env.ECOMAIL_BUYERS_LIST_ID ?? '43'

        if (apiKey) {
          const cleanEmail = email.trim().toLowerCase()
          const campSlug = campName ? slugifyCamp(campName) : 'letny-tabor'
          const alreadyExists = await checkSubscriberExists(apiKey, listId, cleanEmail)

          await fetch(`https://api2.ecomailapp.cz/lists/${listId}/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', key: apiKey },
            body: JSON.stringify({
              subscriber_data: {
                email: cleanEmail,
                name: name.trim(),
                tags: ['purchase', `purchase-${campSlug}`],
              },
              trigger_autoresponders: !alreadyExists,
              update_existing: true,
            }),
          })
        }
      } catch (ecomailErr) {
        console.error('[order/complete] Ecomail sync error (non-blocking):', ecomailErr)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[profitour/order/complete] Error:', message)
    // Return 200 even on error — the order already exists in Profis
    return NextResponse.json({ success: false, error: message })
  }
}
