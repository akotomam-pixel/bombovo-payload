import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "enum_team_applications_role" AS ENUM ('animator', 'zdravotnik');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE TABLE IF NOT EXISTS "team_applications" (
      "id"                      serial PRIMARY KEY,
      "role"                    "enum_team_applications_role" NOT NULL,
      "termin"                  varchar NOT NULL,
      "titul"                   varchar,
      "meno"                    varchar NOT NULL,
      "priezvisko"              varchar NOT NULL,
      "datum_narodenia"         varchar,
      "adresa"                  varchar,
      "psc"                     varchar,
      "mesto"                   varchar,
      "telefon"                 varchar NOT NULL,
      "email"                   varchar NOT NULL,
      "vzdelanie"               varchar,
      "strava"                  varchar,
      "gdpr"                    boolean DEFAULT false,
      "internal_email_sent"     boolean DEFAULT false,
      "confirmation_email_sent" boolean DEFAULT false,
      "email_error"             varchar,
      "updated_at"              timestamp(3) with time zone NOT NULL DEFAULT now(),
      "created_at"              timestamp(3) with time zone NOT NULL DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS "team_applications_updated_at_idx" ON "team_applications" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "team_applications_created_at_idx" ON "team_applications" USING btree ("created_at");

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "team_applications_id" integer;
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
      ADD CONSTRAINT "payload_locked_documents_rels_team_applications_fk"
      FOREIGN KEY ("team_applications_id") REFERENCES "team_applications"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_team_applications_id_idx"
      ON "payload_locked_documents_rels" USING btree ("team_applications_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "team_applications_id";
    DROP TABLE IF EXISTS "team_applications";
    DROP TYPE IF EXISTS "enum_team_applications_role";
  `)
}
