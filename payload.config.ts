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
import { SkolyVPrirode } from './collections/globals/SkolyVPrirode'
import { GiveawayPopupGlobal } from './collections/globals/GiveawayPopup'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Camps, Strediska, GiveawayEntries],
  globals: [SkolyVPrirode, GiveawayPopupGlobal],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
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
