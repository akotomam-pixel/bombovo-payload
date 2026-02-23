import { getPayload } from 'payload'
import config from '@payload-config'
import type { Payload } from 'payload'

const globalForPayload = global as typeof global & { payload?: Payload }

export async function getPayloadClient(): Promise<Payload> {
  if (globalForPayload.payload) return globalForPayload.payload
  globalForPayload.payload = await getPayload({ config })
  return globalForPayload.payload
}
