import * as dotenv from 'dotenv'
import path from 'path'
import { Client } from 'pg'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URI,
    ssl: { rejectUnauthorized: false },
  })

  await client.connect()
  console.log('Connected to database.')

  const galleries = await client.query('DELETE FROM camps_hero_gallery')
  console.log(`Cleared ${galleries.rowCount} rows from camps_hero_gallery.`)

  const result = await client.query('DELETE FROM media')
  console.log(`Deleted ${result.rowCount} records from media table.`)

  await client.end()
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
