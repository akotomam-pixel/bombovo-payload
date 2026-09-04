import { createHash } from 'crypto'

const PIXEL_ID = '1406524862988780'
const CAPI_URL = `https://graph.facebook.com/v21.0/${PIXEL_ID}/events`

function sha256Hex(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

function hashEmail(email: string): string {
  return sha256Hex(email.trim().toLowerCase())
}

// Meta expects digits only (country code + number, no symbols/whitespace).
function hashPhone(phone: string): string {
  return sha256Hex(phone.trim().toLowerCase().replace(/[^0-9]/g, ''))
}

type UserData = {
  email?: string
  phone?: string
  clientIpAddress: string
  clientUserAgent: string
  fbc?: string
  fbp?: string
}

type SendMetaCapiEventArgs = {
  eventName: string
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
export async function sendMetaCapiEvent({
  eventName,
  eventId,
  eventSourceUrl,
  userData,
  customData,
}: SendMetaCapiEventArgs): Promise<void> {
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN
  if (!accessToken) {
    console.error(`[metaCapi] META_CAPI_ACCESS_TOKEN is not set — skipping "${eventName}" event`)
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
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: eventSourceUrl,
        action_source: 'website',
        user_data: hashedUserData,
        ...(customData ? { custom_data: customData } : {}),
      },
    ],
  }

  try {
    const res = await fetch(`${CAPI_URL}?access_token=${encodeURIComponent(accessToken)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error(`[metaCapi] "${eventName}" request failed:`, res.status, text)
    }
  } catch (err) {
    console.error(`[metaCapi] "${eventName}" request error:`, err)
  }
}
