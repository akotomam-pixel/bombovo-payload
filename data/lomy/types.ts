/**
 * Content model for the rebuilt Horský hotel Lomy page (season 2027).
 *
 * This is deliberately separate from `data/strediska/types.ts`: the old
 * `StrediskoData` shape is driven by the Payload `strediska` collection and is
 * shared by the five strediská still using the original detail page. The Lomy
 * rebuild has a different section structure, so it gets its own model rather
 * than bending the old one. Sections are added here as they are built.
 */

/** A labelled point on a photo, used to key facilities to what's in the frame. */
export interface SiteMarker {
  /** Legend label, e.g. "Amfiteáter". */
  label: string
  /** Horizontal position as a percentage of the photo's width. */
  x: number
  /** Vertical position as a percentage of the photo's height. */
  y: number
}

export interface GalleryPhoto {
  src: string
  /** Describes what the photo shows — also used as the gallery caption. */
  alt: string
  /**
   * True while a stand-in is being used. Real venue photography is a known gap
   * (`lomy-page-draft.md`, "Čo ešte treba doriešiť" #3); flip to false as real
   * photos land.
   */
  isPlaceholder: boolean
  /** Only set on the photo the markers are keyed to — coordinates are frame-specific. */
  markers?: SiteMarker[]
}

/** A row in the always-visible info box. */
export interface HeroFact {
  label: string
  value: string
  /** Emoji shown beside the value on mobile, where facts render as chips. */
  icon?: string
}

export interface Discount {
  /** Headline figure on the sale star, e.g. "−30 €". */
  amount: string
  /** Who it applies to, e.g. "/ dieťa". */
  unit: string
  /** Small line under the amount, e.g. "do 31.10". */
  deadline: string
}

export interface HeroCta {
  label: string
  href: string
}

export interface LomyHero {
  /** Small line above the venue name inside the h1. */
  kicker: string
  name: string
  location: string
  rating: {
    /** Slovak decimal comma, e.g. "4,2". */
    value: string
    source: string
  }
  photos: GalleryPhoto[]
  price: {
    prefix: string
    amount: string
    unit: string
    /** Fine print, e.g. "bez animačného programu". */
    note: string
  }
  facts: HeroFact[]
  discount: Discount
  ctas: {
    primary: HeroCta
    secondary: HeroCta
  }
}

export interface LomyContent {
  slug: string
  hero: LomyHero
}
