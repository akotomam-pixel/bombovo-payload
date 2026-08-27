/**
 * Shared "is this termín still bookable" logic, read off the same
 * hand-maintained `status` string (data/lomy/types.ts) everywhere it
 * matters: the termíny dialog, the sticky bar's month summary, and the two
 * urgency seals on the card and hero photo. One regex and one wording table,
 * rather than four copies that could drift apart.
 */

/** A term is closed once its status says "vypredané" or "rezervované". */
export const CLOSED_TERMIN_STATUS_RE = /vypredan|rezervovan/i

export function openTerminyCount(items: { status: string }[]): number {
  return items.filter((t) => !CLOSED_TERMIN_STATUS_RE.test(t.status)).length
}

/**
 * The urgency banner's sentence. Slovak declines the adjective too, not just
 * the noun's ending, so this is a small table rather than one string with a
 * number spliced in: 1 termín, 2–4 termíny, 5+ termínov.
 */
export function urgencyText(n: number): string {
  if (n === 1) return 'Posledný voľný termín!'
  if (n <= 4) return `Posledné ${n} voľné termíny!`
  return `Posledných ${n} voľných termínov!`
}

/** Same agreement, split for the seal's three stacked lines (see UrgencySeal). */
export function urgencyWords(n: number): { top: string; bottom: string } {
  if (n === 1) return { top: 'POSLEDNÝ', bottom: 'TERMÍN' }
  if (n <= 4) return { top: 'POSLEDNÉ', bottom: 'TERMÍNY' }
  return { top: 'POSLEDNÝCH', bottom: 'TERMÍNOV' }
}
