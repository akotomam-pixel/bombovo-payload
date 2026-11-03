import { PostHog } from 'posthog-node'

/**
 * Server-side PostHog capture, the backup to the browser events (ad blockers
 * can't stop it). Sends to the EU host and waits until the event is out, so a
 * serverless function can't end before it is sent.
 *
 * Never throws: a PostHog failure must not affect the response.
 */
export async function captureServer({
  distinctId,
  event,
  properties,
  aliasOf,
}: {
  distinctId: string
  event: string
  properties: Record<string, unknown>
  /** The browser's anonymous distinct_id, linked to `distinctId` so both are one person. */
  aliasOf?: string
}) {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!key) return
  try {
    const client = new PostHog(key, { host: 'https://eu.i.posthog.com', flushAt: 1, flushInterval: 0 })
    if (aliasOf && aliasOf !== distinctId) client.alias({ distinctId, alias: aliasOf })
    client.capture({ distinctId, event, properties })
    await client.shutdown()
  } catch (err) {
    console.error(`[posthog-server] ${event} failed:`, err)
  }
}
