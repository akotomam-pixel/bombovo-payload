import { createHash } from 'crypto'

const GRAPH_API_VERSION = 'v21.0'

function sha256Hex(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

export function normalizeMetaEmail(email: string): string {
  return email.trim().toLowerCase()
}

// Meta expects digits only (country code + number, no symbols/whitespace).
export function normalizeMetaPhone(phone: string): string {
  let digits = phone.replace(/[^0-9]/g, '')
  if (digits.startsWith('00')) digits = digits.slice(2)
  if (digits.startsWith('0')) digits = `421${digits.slice(1)}`
  return digits
}

function hashEmail(email: string): string {
  return sha256Hex(normalizeMetaEmail(email))
}

function hashPhone(phone: string): string {
  return sha256Hex(normalizeMetaPhone(phone))
}

/** CookieYes stores category consent as comma-separated key:value pairs. */
export function hasMetaMarketingConsent(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false

  let decoded = cookieValue
  try {
    decoded = decodeURIComponent(cookieValue)
  } catch {
    // A malformed cookie is treated as no consent.
    return false
  }

  const categories = new Map<string, string>()
  for (const pair of decoded.split(',')) {
    const separator = pair.indexOf(':')
    if (separator === -1) continue
    const key = pair.slice(0, separator).trim().toLowerCase()
    const value = pair.slice(separator + 1).trim().toLowerCase()
    categories.set(key, value)
  }

  return categories.get('advertisement') === 'yes'
}

export function normalizeMetaEventId(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const normalized = value.trim()
  return /^[A-Za-z0-9._:-]{1,100}$/.test(normalized) ? normalized : null
}

type UserData = {
  email?: string
  phone?: string
  clientIpAddress: string
  clientUserAgent: string
  fbc?: string
  fbp?: string
}

type SendMetaCapiEventsArgs = {
  eventNames: string[]
  eventId: string
  eventSourceUrl: string
  userData: UserData
  customData?: Record<string, unknown>
}

/**
 * Server-side backup channel for the Meta Pixel. Never throws — a CAPI failure
 * (missing token, network error, Graph API rejection) is logged and swallowed
 * so it can never break the registration/enquiry flow it's attached to.
 */
export async function sendMetaCapiEvents({
  eventNames,
  eventId,
  eventSourceUrl,
  userData,
  customData,
}: SendMetaCapiEventsArgs): Promise<void> {
  const pixelId = process.env.META_PIXEL_ID
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN
  if (!pixelId || !/^\d+$/.test(pixelId) || !accessToken) {
    console.error('[metaCapi] Server credentials are incomplete — skipping event delivery')
    return
  }

  const hashedUserData: Record<string, unknown> = {}
  if (userData.email) hashedUserData.em = [hashEmail(userData.email)]
  if (userData.phone) hashedUserData.ph = [hashPhone(userData.phone)]
  if (userData.clientIpAddress) hashedUserData.client_ip_address = userData.clientIpAddress
  if (userData.clientUserAgent) hashedUserData.client_user_agent = userData.clientUserAgent
  if (userData.fbc) hashedUserData.fbc = userData.fbc
  if (userData.fbp) hashedUserData.fbp = userData.fbp

  const payload = {
    data: eventNames.map((eventName) => ({
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      event_source_url: eventSourceUrl,
      action_source: 'website',
      user_data: hashedUserData,
      ...(customData ? { custom_data: customData } : {}),
    })),
    ...(process.env.META_CAPI_TEST_EVENT_CODE
      ? { test_event_code: process.env.META_CAPI_TEST_EVENT_CODE }
      : {}),
  }

  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const responseBody = await res.json().catch(() => null) as {
        error?: { code?: number; type?: string; fbtrace_id?: string }
      } | null
      console.error('[metaCapi] Request failed', {
        eventNames,
        status: res.status,
        code: responseBody?.error?.code,
        type: responseBody?.error?.type,
        traceId: responseBody?.error?.fbtrace_id,
      })
    }
  } catch {
    console.error('[metaCapi] Request failed before Meta returned a response', { eventNames })
  }
}

export async function sendMetaCapiEvent(
  args: Omit<SendMetaCapiEventsArgs, 'eventNames'> & { eventName: string },
): Promise<void> {
  const { eventName, ...shared } = args
  await sendMetaCapiEvents({ ...shared, eventNames: [eventName] })
}
