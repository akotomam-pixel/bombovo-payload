import posthog from 'posthog-js'

/**
 * PostHog capture for the rebuilt stredisko pages and their enquiry forms.
 *
 * Wrapped so a PostHog failure (blocked script, not yet initialised) can never
 * throw into a click handler and stop a button, the termíny table or the form.
 * Only ever pass labels, counts and slugs here — never what people typed.
 */

export type TerminyOpenedFrom = 'top_of_page' | 'sticky_bar' | 'above_form'
export type FormLocation = 'ziskat_ponuku' | 'bottom_of_page' | 'after_rezervovat'
export type AbandonReason = 'popup_closed' | 'left_page' | 'tab_closed' | 'tab_hidden'

/** One random id per form instance, so an abandoned-then-sent form can be matched. */
export function newFormId(): string {
  try {
    return crypto.randomUUID()
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  }
}

export function trackSvp(
  event: string,
  properties: Record<string, string | number | string[] | null | undefined>,
  options?: { beacon?: boolean },
) {
  try {
    posthog.capture(event, properties, options?.beacon ? { transport: 'sendBeacon' } : undefined)
  } catch {
    console.error(`[svp-tracking] ${event} failed`)
  }
}

/** posthog.identify, wrapped the same way as trackSvp. */
export function identifySafe(distinctId: string, properties: Record<string, unknown>) {
  try {
    posthog.identify(distinctId, properties)
  } catch {
    console.error('[svp-tracking] identify failed')
  }
}

/** The browser's PostHog id and internal flag, sent along with a form so the server event joins the same person. */
export function posthogContext(): { posthog_distinct_id?: string; is_internal?: boolean } {
  try {
    return {
      posthog_distinct_id: posthog.get_distinct_id() || undefined,
      is_internal: posthog.get_property('is_internal') === true || undefined,
    }
  } catch {
    return {}
  }
}
