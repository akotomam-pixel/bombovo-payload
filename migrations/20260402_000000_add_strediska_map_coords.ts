import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "strediska" ADD COLUMN IF NOT EXISTS "map_lat" numeric;
    ALTER TABLE "strediska" ADD COLUMN IF NOT EXISTS "map_lng" numeric;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "strediska" DROP COLUMN IF EXISTS "map_lat";
    ALTER TABLE "strediska" DROP COLUMN IF EXISTS "map_lng";
  `)
}
