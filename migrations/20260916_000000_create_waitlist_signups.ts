import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "enum_waitlist_signups_status" AS ENUM ('caka', 'upozornene');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE TABLE IF NOT EXISTS "waitlist_signups" (
      "id"           serial PRIMARY KEY,
      "meno"         varchar NOT NULL,
      "priezvisko"   varchar NOT NULL,
      "email"        varchar NOT NULL,
      "telefon"      varchar NOT NULL,
      "stredisko_id" integer,
      "termin"       varchar NOT NULL,
      "status"       "enum_waitlist_signups_status" NOT NULL DEFAULT 'caka',
      "updated_at"   timestamp(3) with time zone NOT NULL DEFAULT now(),
      "created_at"   timestamp(3) with time zone NOT NULL DEFAULT now()
    );

    DO $$ BEGIN
      ALTER TABLE "waitlist_signups"
      ADD CONSTRAINT "waitlist_signups_stredisko_id_strediska_id_fk"
      FOREIGN KEY ("stredisko_id") REFERENCES "strediska"("id") ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE INDEX IF NOT EXISTS "waitlist_signups_stredisko_idx" ON "waitlist_signups" USING btree ("stredisko_id");

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "waitlist_signups_id" integer;
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
      ADD CONSTRAINT "payload_locked_documents_rels_waitlist_signups_fk"
      FOREIGN KEY ("waitlist_signups_id") REFERENCES "waitlist_signups"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "waitlist_signups_id";
    DROP TABLE IF EXISTS "waitlist_signups";
    DROP TYPE IF EXISTS "enum_waitlist_signups_status";
  `)
}
