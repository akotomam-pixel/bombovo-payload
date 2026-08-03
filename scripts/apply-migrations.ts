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

    // Migration 20260617_000000 — create track_events table for full-funnel tracking
    await client.query(`
      CREATE TABLE IF NOT EXISTS "track_events" (
        "id"              serial PRIMARY KEY,
        "visitor_id"      varchar NOT NULL,
        "event_name"      varchar NOT NULL,
        "source"          varchar,
        "utm_source"      varchar,
        "utm_medium"      varchar,
        "utm_campaign"    varchar,
        "utm_content"     varchar,
        "fbclid"          varchar,
        "camp_id"         varchar,
        "registration_id" varchar,
        "ip"              varchar,
        "user_agent"      text,
        "referrer"        varchar,
        "created_at"      timestamp(3) with time zone NOT NULL DEFAULT now()
      );
    `)
    console.log('✓ track_events table created')

    // Migration 20260707_000000 — bring letne_tabory_reviews under Payload management
    await client.query(`
      ALTER TABLE "letne_tabory_reviews" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone NOT NULL DEFAULT now();
      ALTER TABLE "letne_tabory_reviews" ADD COLUMN IF NOT EXISTS "status" varchar NOT NULL DEFAULT 'approved';
      ALTER TABLE "letne_tabory_reviews" ADD COLUMN IF NOT EXISTS "photo_id" integer;
    `)
    console.log('✓ letne_tabory_reviews.updated_at / status / photo_id')

    // Migration 20260707_000001 — payload_locked_documents_rels needs a column per
    // registered collection; adding letne-tabory-reviews without this breaks /admin
    // (locked-documents queries reference the missing column and 500).
    await client.query(`
      ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "letne_tabory_reviews_id" integer;
      DO $$ BEGIN
        ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_letne_tabory_reviews_fk"
        FOREIGN KEY ("letne_tabory_reviews_id") REFERENCES "letne_tabory_reviews"("id") ON DELETE CASCADE;
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `)
    console.log('✓ payload_locked_documents_rels.letne_tabory_reviews_id')

    // Migration 20260719_000000 — per-term local capacity counter (independent of Profis),
    // used to auto-close a term after a fixed number of successful reservations.
    await client.query(`
      ALTER TABLE "camps_dates" ADD COLUMN IF NOT EXISTS "capacity_limit" numeric;
      ALTER TABLE "camps_dates" ADD COLUMN IF NOT EXISTS "reservations_count" numeric DEFAULT 0;
    `)
    console.log('✓ camps_dates.capacity_limit / reservations_count')

    // Migration 20260803_000000 — create fest_last_minute_popup table for the
    // new "Popup: Fest Last Minute" global (mirrors giveaway_popup's shape).
    await client.query(`
      CREATE TABLE IF NOT EXISTS "fest_last_minute_popup" (
        "id" serial PRIMARY KEY,
        "is_enabled" boolean DEFAULT false,
        "delay_seconds" numeric DEFAULT 5,
        "photo_id" integer,
        "discount_code" varchar DEFAULT 'BOMBOVO',
        "step0_headline" varchar,
        "step0_yes_label" varchar,
        "step0_no_label" varchar,
        "step1_headline" varchar,
        "step1_name_placeholder" varchar,
        "step1_next_label" varchar,
        "step2_headline" varchar,
        "step2_email_placeholder" varchar,
        "step2_submit_label" varchar,
        "step3_headline" varchar,
        "step3_body" varchar,
        "updated_at" timestamp(3) with time zone,
        "created_at" timestamp(3) with time zone
      );
      DO $$ BEGIN
        ALTER TABLE "fest_last_minute_popup"
        ADD CONSTRAINT "fest_last_minute_popup_photo_id_media_id_fk"
        FOREIGN KEY ("photo_id") REFERENCES "media"("id") ON DELETE SET NULL;
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `)
    console.log('✓ fest_last_minute_popup table created')

    // Migration 20260803_000001 — collapse fest_last_minute_popup's separate
    // name/email steps into a single combined step.
    await client.query(`
      ALTER TABLE "fest_last_minute_popup" ADD COLUMN IF NOT EXISTS "step0_sub_headline" varchar;
      ALTER TABLE "fest_last_minute_popup" ADD COLUMN IF NOT EXISTS "step1_email_placeholder" varchar;
      ALTER TABLE "fest_last_minute_popup" ADD COLUMN IF NOT EXISTS "step1_submit_label" varchar;
    `)
    console.log('✓ fest_last_minute_popup.step0_sub_headline / step1_email_placeholder / step1_submit_label')

    // Migration 20260803_000002 — giveaway_entries.source is a real Postgres
    // enum; adding the option to GiveawayEntries.ts alone doesn't add the DB
    // label, so /api/fest-last-minute's payload.create() 500ed on every
    // submit until this ran.
    await client.query(`
      ALTER TYPE "enum_giveaway_entries_source" ADD VALUE IF NOT EXISTS 'fest-last-minute-popup';
    `)
    console.log('✓ enum_giveaway_entries_source + fest-last-minute-popup')

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
