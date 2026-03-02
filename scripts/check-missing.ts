import { config as loadDotenv } from 'dotenv'
import path from 'path'

loadDotenv({ path: path.resolve(process.cwd(), '.env.local') })

const BASE_URL    = process.env.PAYLOAD_URL            ?? 'http://localhost:3000'
const ADMIN_EMAIL = process.env.PAYLOAD_ADMIN_EMAIL    ?? ''
const ADMIN_PASS  = process.env.PAYLOAD_ADMIN_PASSWORD ?? ''

async function main() {
  const loginRes = await fetch(`${BASE_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASS }),
  })
  const { token } = await loginRes.json() as { token: string }

  const mediaRes = await fetch(`${BASE_URL}/api/media?limit=300`, {
    headers: { Authorization: `JWT ${token}` },
  })
  const { docs } = await mediaRes.json() as { docs: Array<{ id: number; filename: string }> }

  const checks: Array<{ prefix: string; expectedNums: number[] }> = [
    { prefix: 'art',  expectedNums: [1, 6] },
    { prefix: 'tajb', expectedNums: [9] },
    { prefix: 'drak', expectedNums: [2, 6, 8] },
    { prefix: 'fest', expectedNums: [3, 4, 6, 13, 14, 17, 18] },
  ]

  for (const { prefix, expectedNums } of checks) {
    console.log(`\n── ${prefix} ──`)
    for (const num of expectedNums) {
      const found = docs.find((m) => new RegExp(`^${prefix}${num}\\.`, 'i').test(m.filename ?? ''))
      if (found) {
        console.log(`  ✓ ${prefix}${num} found → id:${found.id}  filename:${found.filename}`)
      } else {
        console.log(`  ✗ ${prefix}${num} NOT found in media`)
      }
    }
  }
}

main().catch((err) => { console.error(err); process.exit(1) }).then(() => process.exit(0))
