/**
 * Applies pending schema changes to the production Postgres DB.
 * Uses pg directly — no Payload config loading required.
 * Run via: tsx scripts/apply-migrations.ts
 */
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URI
if (!connectionString) {
  console.warn('DATABASE_URI not set — skipping SQL migrations (prodMigrations will handle this at runtime)')
  process.exit(0)
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

    // Migration 20260526_000000 — add vypredane toggle to strediska
    await client.query(`
      ALTER TABLE "strediska" ADD COLUMN IF NOT EXISTS "vypredane" boolean DEFAULT false;
    `)
    console.log('✓ strediska.vypredane')

    // Migration 20260526_000001 — add photo_label to skoly_v_prirode_reviews
    await client.query(`
      ALTER TABLE "skoly_v_prirode_reviews" ADD COLUMN IF NOT EXISTS "photo_label" varchar;
    `)
    console.log('✓ skoly_v_prirode_reviews.photo_label')

    // Migration 20260607_000000 — create ad_events table for click/view tracking
    await client.query(`
      CREATE TABLE IF NOT EXISTS "ad_events" (
        "id"           serial PRIMARY KEY,
        "type"         varchar NOT NULL,
        "advertorial"  varchar,
        "destination"  varchar,
        "utm_source"   varchar,
        "utm_medium"   varchar,
        "utm_campaign" varchar,
        "utm_content"  varchar,
        "fbclid"       varchar,
        "ip"           varchar,
        "user_agent"   text,
        "referrer"     varchar,
        "updated_at"   timestamp(3) with time zone NOT NULL DEFAULT now(),
        "created_at"   timestamp(3) with time zone NOT NULL DEFAULT now()
      );
    `)
    console.log('✓ ad_events table created')

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
