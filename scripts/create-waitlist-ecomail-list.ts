/**
 * One-time setup (Step 2.5 of the waitlist feature): creates a dedicated
 * Ecomail list for "Sledovať dostupnosť" signups, separate from list 11
 * ("kontakty švp 2025"), so a future automation can target exactly the
 * people who clicked this button — not the whole newsletter.
 *
 * Run once:
 *   npx tsx scripts/create-waitlist-ecomail-list.ts
 *
 * Prints the created list's id — put it in .env as ECOMAIL_WAITLIST_LIST_ID.
 * Idempotent by name: if a list with this exact name already exists, it
 * reuses it rather than creating a duplicate.
 */
import { config as loadDotenv } from 'dotenv'
import path from 'path'

loadDotenv({ path: path.resolve(process.cwd(), '.env.local') })
loadDotenv({ path: path.resolve(process.cwd(), '.env') })

const LIST_NAME = 'ŠVP - Sledovať dostupnosť'

async function run() {
  const apiKey = process.env.ECOMAIL_API_KEY
  if (!apiKey) {
    console.error('ECOMAIL_API_KEY not set in .env — cannot create the list.')
    process.exit(1)
  }

  // Idempotency check — list the account's existing lists first.
  const listRes = await fetch('https://api2.ecomailapp.cz/lists', {
    method: 'GET',
    headers: { key: apiKey },
  })
  if (listRes.ok) {
    const existing = await listRes.json()
    const arr = Array.isArray(existing) ? existing : existing?.lists ?? []
    const match = arr.find((l: any) => (l.name ?? l.list?.name) === LIST_NAME)
    if (match) {
      const id = match.id ?? match.list?.id
      console.log(`List "${LIST_NAME}" already exists — id ${id}. Not creating a duplicate.`)
      console.log(`Set ECOMAIL_WAITLIST_LIST_ID=${id} in .env`)
      return
    }
  }

  const res = await fetch('https://api2.ecomailapp.cz/lists', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', key: apiKey },
    body: JSON.stringify({
      name: LIST_NAME,
      from_name: 'Bombovo',
      from_email: 'info@bombovo.sk',
      reply_to: 'bombovo@bombovo.sk',
    }),
  })

  if (!res.ok) {
    console.error(`Failed to create list: ${res.status} ${await res.text()}`)
    process.exit(1)
  }

  const created = await res.json()
  console.log(`Created list "${created.name}" — id ${created.id}`)
  console.log(`Set ECOMAIL_WAITLIST_LIST_ID=${created.id} in .env`)
}

run().catch((err) => {
  console.error('Failed:', err)
  process.exit(1)
})
