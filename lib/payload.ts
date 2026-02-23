/**
 * Cached Payload instance.
 *
 * `getPayload({ config })` is expensive — it opens a DB connection, loads all
 * collections/globals, and validates the schema.  Calling it once per request
 * in dev mode causes the ~1–2 s lag you feel on every page navigation.
 *
 * This module caches the instance in the Node.js module scope so the
 * initialisation only happens once per server process (or once per hot-reload
 * in dev).  Every server component should import `getPayloadClient` from here
 * instead of calling `getPayload({ config })` directly.
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import type { Payload } from 'payload'

let cached: Payload | null = null

export async function getPayloadClient(): Promise<Payload> {
  if (cached) return cached
  cached = await getPayload({ config })
  return cached
}
