import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
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
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "ad_events";
  `)
}
