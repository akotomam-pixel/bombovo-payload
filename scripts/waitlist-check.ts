/**
 * Manually fires the waitlist reopen alert for a "rebuilt architecture"
 * stredisko (Lomy, Minciar, Martinské Hole, Roháčan, Osrblie, Palušák,
 * Lagáň) — the ones whose termín status lives as hand-typed text in
 * data/{slug}/content.ts (see data/rebuiltStrediska.ts), not in the
 * database. Flipping a termín's status there is a code edit + git deploy,
 * not a write Payload can hook into, so this has to be run by hand as part
 * of making that edit — there's no automatic trigger for this path.
 *
 * (The Payload-backed strediská — anything NOT in REBUILT_STREDISKA — don't
 * need this: flipping `dates[].available` in the Payload admin fires the
 * afterChange hook on the `strediska` collection automatically.)
 *
 * Whoever changes a termín's status from "Rezervované"/"Vypredané" to
 * "Voľné" in a content.ts file — Matej directly, or a Claude Code session
 * making the edit for him — should run this right after, with the same
 * slug and the exact `range` string from that termín's row, e.g.:
 *
 *   npm run waitlist:check -- horsky-hotel-lomy "26.04. – 30.04.2027"
 *
 * Hits POST /api/waitlist-check rather than the Payload local API directly
 * — the local API's env loader (payload/dist/bin/loadEnv.js) doesn't work
 * under a standalone tsx process on this project's Node version, only
 * inside the Next.js server itself, so this goes through that server's own
 * endpoint instead. Needs the target server actually running (dev: `npx
 * next dev -p 3001`; prod: set PAYLOAD_URL).
 *
 * Looks up matching `waitlist-signups`, emails bombovo@bombovo.sk one
 * ranked list if there are any, and marks them upozornené. Safe to run even
 * if nobody was waiting — it's a no-op in that case.
 */
import { config as loadDotenv } from 'dotenv'
import path from 'path'

loadDotenv({ path: path.resolve(process.cwd(), '.env.local') })
loadDotenv({ path: path.resolve(process.cwd(), '.env') })

const BASE_URL = process.env.PAYLOAD_URL ?? 'http://localhost:3001'

async function run() {
  const [slug, terminLabel] = process.argv.slice(2)
  if (!slug || !terminLabel) {
    console.error('Usage: npm run waitlist:check -- <stredisko-slug> "<termín range>"')
    process.exit(1)
  }

  const secret = process.env.WAITLIST_CHECK_SECRET
  if (!secret) {
    console.error('WAITLIST_CHECK_SECRET not set in .env.')
    process.exit(1)
  }

  const res = await fetch(`${BASE_URL}/api/waitlist-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-waitlist-check-secret': secret },
    body: JSON.stringify({ slug, termin: terminLabel }),
  })

  if (!res.ok) {
    console.error(`Failed: ${res.status} ${await res.text()}`)
    process.exit(1)
  }

  console.log(`Checked waitlist for ${slug} / "${terminLabel}". (No-op if nobody was waiting.)`)
}

run().catch((err) => {
  console.error('Failed:', err)
  process.exit(1)
})
