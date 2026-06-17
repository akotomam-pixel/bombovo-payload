import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
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
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "track_events";
  `)
}
