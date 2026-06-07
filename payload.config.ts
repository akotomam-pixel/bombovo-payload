import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { uploadthingStorage } from '@payloadcms/storage-uploadthing'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import * as m1 from './migrations/20260402_000000_add_strediska_map_coords'
import * as m2 from './migrations/20260516_000000_add_teacher_reviews_questions'
import * as m3 from './migrations/20260526_000000_add_strediska_vypredane'
import * as m4 from './migrations/20260607_000000_create_ad_events'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Camps } from './collections/Camps'
import { Strediska } from './collections/Strediska'
import { GiveawayEntries } from './collections/GiveawayEntries'
import { TeacherReviews } from './collections/TeacherReviews'
import { AdEvents } from './collections/AdEvents'
import { SkolyVPrirode } from './collections/globals/SkolyVPrirode'
import { GiveawayPopupGlobal } from './collections/globals/GiveawayPopup'
import { FooterGlobal } from './collections/globals/Footer'
import { HomepageGlobal } from './collections/globals/Homepage'
import { LetneTaboryHlavna } from './collections/globals/LetneTaboryHlavna'
import { NasaMisiaGlobal } from './collections/globals/NasaMisia'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Camps, Strediska, GiveawayEntries, TeacherReviews, AdEvents],
  globals: [HomepageGlobal, LetneTaboryHlavna, SkolyVPrirode, GiveawayPopupGlobal, FooterGlobal, NasaMisiaGlobal],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    prodMigrations: [
      { name: '20260402_000000_add_strediska_map_coords', up: m1.up, down: m1.down },
      { name: '20260516_000000_add_teacher_reviews_questions', up: m2.up, down: m2.down },
      { name: '20260526_000000_add_strediska_vypredane', up: m3.up, down: m3.down },
      { name: '20260607_000000_create_ad_events', up: m4.up, down: m4.down },
    ],
  }),
  plugins: [
    uploadthingStorage({
      collections: {
        media: {
          disablePayloadAccessControl: true,
        },
      },
      options: {
        token: process.env.UPLOADTHING_TOKEN || '',
        acl: 'public-read',
      },
    }),
  ],
})
