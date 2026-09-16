/**
 * Shared Ecomail REST helpers. Every collection/route that talks to Ecomail
 * (waitlist signup, the internal reopen alert, giveaway/fest-last-minute
 * flows elsewhere) should reuse this rather than each hand-rolling its own
 * fetch() calls — this file is the one place that knows Ecomail's actual
 * request/response shape.
 */

const ECOMAIL_BASE = 'https://api2.ecomailapp.cz'

export interface EcomailContactData {
  email: string
  meno: string
  priezvisko: string
  telefon: string
  /**
   * Custom field values, keyed exactly as Ecomail's templates reference
   * them (lowercase, no diacritics — e.g. `stredisko`, `termin`,
   * `stredisko_url`, `pocet_pedagogov`). Always send every field a caller
   * cares about in one call rather than relying on a partial update to
   * merge with what's already on the contact.
   */
  customFields: Record<string, string | number>
}

/** Subscribes (or updates, if already present) a contact on one list. */
export async function ecomailSubscribe(apiKey: string, listId: string, data: EcomailContactData): Promise<void> {
  const res = await fetch(`${ECOMAIL_BASE}/lists/${listId}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', key: apiKey },
    body: JSON.stringify({
      subscriber_data: {
        email: data.email,
        name: data.meno,
        surname: data.priezvisko,
        phone: data.telefon,
        custom_fields: data.customFields,
      },
      trigger_autoresponders: false,
      update_existing: true,
    }),
  })
  if (!res.ok) {
    throw new Error(`Ecomail subscribe to list ${listId} failed: ${res.status} ${await res.text()}`)
  }
}

/**
 * Fires one Ecomail automation pipeline for one contact. The pipeline's
 * template pulls whatever merge tags it needs off that contact's existing
 * custom fields — set those via ecomailSubscribe() first, this call carries
 * no other data.
 */
export async function ecomailTriggerPipeline(apiKey: string, pipelineId: number, email: string): Promise<void> {
  const res = await fetch(`${ECOMAIL_BASE}/pipelines/${pipelineId}/trigger`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', key: apiKey },
    body: JSON.stringify({ email }),
  })
  if (!res.ok) {
    throw new Error(`Ecomail pipeline ${pipelineId} trigger for ${email} failed: ${res.status} ${await res.text()}`)
  }
}
