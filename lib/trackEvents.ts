import { Pool } from 'pg'

export const TRACK_COOKIE = 'bombovo_track'
export const TRACK_COOKIE_MAX_AGE = 90 * 24 * 60 * 60 // 90 days, in seconds

export type TrackData = {
  vid: string
  source: string
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  fbclid: string | null
}

export function parseTrackCookie(value: string | undefined | null): TrackData | null {
  if (!value) return null
  try {
    const data = JSON.parse(value)
    if (typeof data?.vid === 'string' && typeof data?.source === 'string') {
      return data as TrackData
    }
    return null
  } catch {
    return null
  }
}

let pool: Pool | null = null
function getPool(): Pool {
  if (!pool) pool = new Pool({ connectionString: process.env.DATABASE_URI })
  return pool
}

export async function logTrackEvent(
  track: TrackData,
  eventName: string,
  extra: { campId?: string; registrationId?: string; ip?: string; userAgent?: string; referrer?: string } = {},
): Promise<void> {
  if (!process.env.DATABASE_URI) return
  try {
    await getPool().query(
      `INSERT INTO track_events
        (visitor_id, event_name, source, utm_source, utm_medium, utm_campaign, utm_content, fbclid, camp_id, registration_id, ip, user_agent, referrer, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,now())`,
      [
        track.vid,
        eventName,
        track.source || null,
        track.utm_source || null,
        track.utm_medium || null,
        track.utm_campaign || null,
        track.utm_content || null,
        track.fbclid || null,
        extra.campId || null,
        extra.registrationId || null,
        extra.ip || null,
        extra.userAgent || null,
        extra.referrer || null,
      ],
    )
  } catch (err) {
    console.error(`[trackEvents] failed to log "${eventName}":`, err)
  }
}
