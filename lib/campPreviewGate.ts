// "Pripravujeme" password gate for camp detail pages that are built but not
// public yet. The card still shows on /letne-tabory; the detail page asks for
// the password and, once it's right, sets a cookie so the page opens normally.
//
// To make a camp public: remove its id from PREVIEW_CAMP_IDS.

export const PREVIEW_CAMP_IDS: readonly string[] = ['halloween-na-lomoch', 'fest-halloween-fest']

export const PREVIEW_COOKIE = 'camp_preview'
export const PREVIEW_PASSWORD = 'bombovo1235'

export function isPreviewCamp(campId: string): boolean {
  return PREVIEW_CAMP_IDS.includes(campId)
}
