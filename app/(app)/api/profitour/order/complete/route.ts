import { NextRequest, NextResponse } from 'next/server'
import { soapCall } from '@/lib/profis'


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

    // ── FakturyVystavit: issue invoices so payment conditions are filled on the contract ──
    // Must run before SmlouvaPridat. id_FakturaRada left empty = system default.
    try {
      await soapCall('Objednavka', 'FakturyVystavit', `
        <ns:Context>
          <ns:UzivatelHeslo>${process.env.PROFIS_HESLO}</ns:UzivatelHeslo>
          <ns:UzivatelLogin>${process.env.PROFIS_LOGIN}</ns:UzivatelLogin>
          <ns:VypsatNazvy>false</ns:VypsatNazvy>
          <ns:id_Jazyk>${process.env.PROFIS_ID_JAZYK}</ns:id_Jazyk>
          <ns:Klic>${klic}</ns:Klic>
          <ns:id_Objednavka>${id_Objednavka}</ns:id_Objednavka>
        </ns:Context>
        <ns:id_FakturaRada i:nil="true"/>`)
      console.log('[order/complete] FakturyVystavit OK')
    } catch (fakturaErr) {
      console.error('[order/complete] FakturyVystavit error (non-blocking):', fakturaErr)
    }

    // ── SmlouvaPridat: generate the pre-filled contract PDF ──────────────────────
    // Must run before ObjednavkaEmailOdeslat so the PDF exists to attach.
    // id_SmlouvaVzor left empty = system picks default template.
    // StavSmlouvaOdeslana=true marks contract as sent to client.
    try {
      await soapCall('Objednavka', 'SmlouvaPridat', `
        <ns:Context>
          <ns:UzivatelHeslo>${process.env.PROFIS_HESLO}</ns:UzivatelHeslo>
          <ns:UzivatelLogin>${process.env.PROFIS_LOGIN}</ns:UzivatelLogin>
          <ns:VypsatNazvy>false</ns:VypsatNazvy>
          <ns:id_Jazyk>${process.env.PROFIS_ID_JAZYK}</ns:id_Jazyk>
          <ns:Klic>${klic}</ns:Klic>
          <ns:id_Objednavka>${id_Objednavka}</ns:id_Objednavka>
        </ns:Context>
        <ns:Data>
          <ns:Heslo i:nil="true"/>
          <ns:StavSmlouvaOdeslana>true</ns:StavSmlouvaOdeslana>
          <ns:id_SmlouvaVzor i:nil="true"/>
        </ns:Data>`)
      console.log('[order/complete] SmlouvaPridat OK')
    } catch (smlouvaErr) {
      console.error('[order/complete] SmlouvaPridat error (non-blocking):', smlouvaErr)
    }

    // ── ObjednavkaEmailOdeslat: send contract email (id_Pravidlo=11 → "Odoslanie zmluvy Tábory") ──
    // Non-blocking: the order is already saved; a mail failure must not break the response.
    try {
      await soapCall('Objednavka', 'ObjednavkaEmailOdeslat', `
        <ns:Context>
          <ns:UzivatelHeslo>${process.env.PROFIS_HESLO}</ns:UzivatelHeslo>
          <ns:UzivatelLogin>${process.env.PROFIS_LOGIN}</ns:UzivatelLogin>
          <ns:VypsatNazvy>false</ns:VypsatNazvy>
          <ns:id_Jazyk>${process.env.PROFIS_ID_JAZYK}</ns:id_Jazyk>
          <ns:Klic>${klic}</ns:Klic>
          <ns:id_Objednavka>${id_Objednavka}</ns:id_Objednavka>
        </ns:Context>
        <ns:id_Pravidlo>11</ns:id_Pravidlo>
        <ns:ID2>0</ns:ID2>`)
      console.log('[order/complete] ObjednavkaEmailOdeslat OK id_Pravidlo=11')
    } catch (emailErr) {
      console.error('[order/complete] ObjednavkaEmailOdeslat error (non-blocking):', emailErr)
    }

    // ── Ecomail sync ─────────────────────────────────────────────────────────────
    // Runs after Profis is fully finalized. Failure is silent — purchase is never blocked.
    if (email && name) {
      try {
        const apiKey = process.env.ECOMAIL_API_KEY
        const listId = process.env.ECOMAIL_BUYERS_LIST_ID ?? '43'

        if (apiKey) {
          const cleanEmail = email.trim().toLowerCase()
          const cleanName = name.trim()
          const resolvedCampName = campName || 'Letný tábor'

          // Fetch existing tags from list 43 so we don't overwrite them
          const existingTags = await getSubscriberTags(apiKey, listId, cleanEmail)

          // Subscribe to list 43 (main list) — keep existing tags, set CAMP_NAME, no autoresponder
          await fetch(`https://api2.ecomailapp.cz/lists/${listId}/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', key: apiKey },
            body: JSON.stringify({
              subscriber_data: {
                email: cleanEmail,
                name: cleanName,
                tags: existingTags,
                custom_fields: { CAMP_NAME: resolvedCampName },
              },
              trigger_autoresponders: false,
              update_existing: true,
            }),
          })

          // Subscribe to list 46 (PostPurchase Helper) — triggers post-purchase sequence
          // CAMP_NAME must be set here so *|CAMP_NAME|* merge tag works in the email
          await fetch(`https://api2.ecomailapp.cz/lists/46/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', key: apiKey },
            body: JSON.stringify({
              subscriber_data: {
                email: cleanEmail,
                name: cleanName,
                custom_fields: { CAMP_NAME: resolvedCampName },
              },
              trigger_autoresponders: true,
              update_existing: true,
            }),
          })

          // Delete from list 45 (NewSutaz Helper) — stops welcome sequence immediately on purchase
          fetch(
            `https://api2.ecomailapp.cz/lists/45/subscriber/${encodeURIComponent(cleanEmail)}`,
            { method: 'DELETE', headers: { key: apiKey } },
          ).catch(err => console.error('[order/complete] Ecomail list 45 delete error (non-blocking):', err))
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
