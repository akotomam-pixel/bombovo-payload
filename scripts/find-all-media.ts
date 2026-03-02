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

  // Fetch all pages
  let allDocs: Array<{ id: number; filename: string }> = []
  let page = 1
  while (true) {
    const res = await fetch(`${BASE_URL}/api/media?limit=100&page=${page}&sort=-id`, {
      headers: { Authorization: `JWT ${token}` },
    })
    const data = await res.json() as { docs: Array<{ id: number; filename: string }>; hasNextPage: boolean }
    allDocs = allDocs.concat(data.docs)
    if (!data.hasNextPage) break
    page++
  }

  console.log(`Total media files: ${allDocs.length}\n`)

  // Show anything that looks like it could be the missing ones
  const prefixes = ['art', 'tajb', 'drak', 'fest']
  for (const prefix of prefixes) {
    const matches = allDocs
      .filter((m) => m.filename?.toLowerCase().startsWith(prefix))
      .sort((a, b) => {
        const numA = parseInt((a.filename ?? '').replace(/\D/g, ''), 10)
        const numB = parseInt((b.filename ?? '').replace(/\D/g, ''), 10)
        return numA - numB
      })
    console.log(`── ${prefix} files (${matches.length}) ──`)
    matches.forEach((m) => console.log(`  id:${m.id}  "${m.filename}"`))
    console.log()
  }
}

main().catch((err) => { console.error(err); process.exit(1) }).then(() => process.exit(0))
