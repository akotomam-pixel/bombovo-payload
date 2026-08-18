import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { uploadthingStorage } from '@payloadcms/storage-uploadthing'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Camps } from './collections/Camps'
import { Strediska } from './collections/Strediska'
import { GiveawayEntries } from './collections/GiveawayEntries'
import { TeacherReviews } from './collections/TeacherReviews'
import { LetneTaboryReviews } from './collections/LetneTaboryReviews'
import { SkolyVPrirode } from './collections/globals/SkolyVPrirode'
import { GiveawayPopupGlobal } from './collections/globals/GiveawayPopup'
import { FestLastMinutePopupGlobal } from './collections/globals/FestLastMinutePopup'
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
  collections: [Users, Media, Camps, Strediska, GiveawayEntries, TeacherReviews, LetneTaboryReviews],
  globals: [
    HomepageGlobal,
    LetneTaboryHlavna,
    SkolyVPrirode,
    GiveawayPopupGlobal,
    FestLastMinutePopupGlobal,
    FooterGlobal,
    NasaMisiaGlobal,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    // NEVER auto-sync the schema. DATABASE_URI points at the live production
    // database, so Payload's default dev-mode "push" would diff the code
    // against real data and interactively offer to alter/drop columns.
    // Schema changes go through migrations/ + scripts/apply-migrations.ts only.
    push: false,
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
