import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "teacher_reviews" ADD COLUMN IF NOT EXISTS "q1" varchar;
    ALTER TABLE "teacher_reviews" ADD COLUMN IF NOT EXISTS "q2" varchar;
    ALTER TABLE "teacher_reviews" ADD COLUMN IF NOT EXISTS "q3" varchar;
    ALTER TABLE "teacher_reviews" ADD COLUMN IF NOT EXISTS "q4" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "teacher_reviews" DROP COLUMN IF EXISTS "q1";
    ALTER TABLE "teacher_reviews" DROP COLUMN IF EXISTS "q2";
    ALTER TABLE "teacher_reviews" DROP COLUMN IF EXISTS "q3";
    ALTER TABLE "teacher_reviews" DROP COLUMN IF EXISTS "q4";
  `)
}
