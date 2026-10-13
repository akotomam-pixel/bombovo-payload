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

export function trackSvp(
  event: string,
  properties: Record<string, string | number | undefined>,
  options?: { beacon?: boolean },
) {
  try {
    posthog.capture(event, properties, options?.beacon ? { transport: 'sendBeacon' } : undefined)
  } catch {
    console.error(`[svp-tracking] ${event} failed`)
  }
}
