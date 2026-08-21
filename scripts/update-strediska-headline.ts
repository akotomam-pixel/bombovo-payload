/**
 * One-off: updates the live "Naše strediská na rok 2026" global field to
 * "Naše strediská na rok 2026/2027".
 *
 * Run from the project root (dev server must be running):
 *   npx tsx scripts/update-strediska-headline.ts
 */

import { config as loadDotenv } from 'dotenv'
import path from 'path'

loadDotenv({ path: path.resolve(process.cwd(), '.env.local') })
loadDotenv({ path: path.resolve(process.cwd(), '.env') })

const BASE_URL       = process.env.PAYLOAD_URL            ?? 'http://localhost:3000'
const ADMIN_EMAIL    = process.env.PAYLOAD_ADMIN_EMAIL    ?? ''
const ADMIN_PASSWORD = process.env.PAYLOAD_ADMIN_PASSWORD ?? ''

async function login(): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })
  if (!res.ok) throw new Error(`Login failed (${res.status}): ${await res.text()}`)
  const data = await res.json() as { token?: string }
  if (!data.token) throw new Error('Login response did not include a token.')
  return data.token
}

async function main() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Missing PAYLOAD_ADMIN_EMAIL / PAYLOAD_ADMIN_PASSWORD in .env.local')
    process.exit(1)
  }

  const token = await login()

  const res = await fetch(`${BASE_URL}/api/globals/skoly-v-prirode`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body:    JSON.stringify({ strediskaHeadline: 'Naše strediská na rok 2026/2027' }),
  })
  if (!res.ok) throw new Error(`Update failed (${res.status}): ${await res.text()}`)

  console.log('✅ Updated strediskaHeadline')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
