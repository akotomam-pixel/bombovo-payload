/**
 * Applies pending schema changes to the production Postgres DB.
 * Uses pg directly — no Payload config loading required.
 * Run via: tsx scripts/apply-migrations.ts
 */
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URI
if (!connectionString) {
  console.error('Missing DATABASE_URI env variable')
  process.exit(1)
}

const pool = new Pool({ connectionString })

async function run() {
  const client = await pool.connect()
  try {
    console.log('Applying migrations...')

    // Migration 20260402_000000 — add map coordinates to strediska
    await client.query(`
      ALTER TABLE "strediska" ADD COLUMN IF NOT EXISTS "map_lat" numeric;
      ALTER TABLE "strediska" ADD COLUMN IF NOT EXISTS "map_lng" numeric;
    `)
    console.log('✓ strediska.map_lat / map_lng')

    // Migration 20260415_000000 — add vypredane flag to camps_dates
    await client.query(`
      ALTER TABLE "camps_dates" ADD COLUMN IF NOT EXISTS "vypredane" boolean DEFAULT false;
    `)
    console.log('✓ camps_dates.vypredane')

    // Migration 20260418_000000 — add video fields to camps
    await client.query(`
      ALTER TABLE "camps" ADD COLUMN IF NOT EXISTS "video_url" varchar;
      ALTER TABLE "camps" ADD COLUMN IF NOT EXISTS "video_thumbnail_url" varchar;
    `)
    console.log('✓ camps.video_url / video_thumbnail_url')

    // Migration 20260516_000000 — add q1/q2/q3/q4 to teacher_reviews
    await client.query(`
      ALTER TABLE "teacher_reviews" ADD COLUMN IF NOT EXISTS "q1" varchar;
      ALTER TABLE "teacher_reviews" ADD COLUMN IF NOT EXISTS "q2" varchar;
      ALTER TABLE "teacher_reviews" ADD COLUMN IF NOT EXISTS "q3" varchar;
      ALTER TABLE "teacher_reviews" ADD COLUMN IF NOT EXISTS "q4" varchar;
    `)
    console.log('✓ teacher_reviews.q1 / q2 / q3 / q4')

    console.log('All migrations applied.')
  } finally {
    client.release()
    await pool.end()
  }
}

run().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
