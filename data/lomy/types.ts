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

/**
 * The review shown directly under the hero.
 *
 * Supplied by the client rather than taken from the draft — the draft's proof
 * strip (section 2) carries a different review (Paločková), which section 2
 * will handle when it is built.
 */
export interface HeroReview {
  quote: string
  author: string
  school: string
  /** Group size, e.g. "106 detí". */
  groupSize: string
  /** Shown in the avatar; we have no photo and no permission to use one. */
  initials: string
  /** Whole stars, 1–5. */
  stars: number
}

/** One claim in the proof strip beneath the price card. */
export interface ProofPoint {
  label: string
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
    /** Undiscounted price, struck through beside the discounted figure, e.g. "205 €". */
    amount: string
    /** Price once the discount is applied, e.g. "175 €" — the figure the box leads with. */
    discounted: string
    unit: string
    /** Fine print, e.g. "bez animačného programu". */
    note: string
  }
  facts: HeroFact[]
  proof: ProofPoint[]
  review: HeroReview
  discount: Discount
  ctas: {
    primary: HeroCta
    secondary: HeroCta
  }
}

/** One bookable session. */
export interface Termin {
  /** Range as shown, e.g. "05.04. – 09.04.2027". */
  range: string
  /** Undiscounted price for this date, e.g. "205 €". */
  price: string
  /** Price after the standing discount, e.g. "175 €". */
  discounted: string
  /**
   * Booking status, e.g. "Voľné". Maintained by hand — confirmed directly by the
   * client. If a capacity system is wired up later it should write this field
   * rather than a new one.
   */
  status: string
}

export interface LomyTerminy {
  title: string
  /** Names the venue, so the dialog is unambiguous with several tabs open. */
  subtitle: string
  /** Trip length shared by every session in the list, e.g. "5 dní". */
  duration: string
  /** Repeated under each price, e.g. "do 31.10". */
  deadline: string
  /** Label on the per-row button. */
  bookLabel: string
  /** Why that button does nothing yet. */
  bookNote: string
  items: Termin[]
}

export interface LomyContent {
  slug: string
  hero: LomyHero
  terminy: LomyTerminy
}
