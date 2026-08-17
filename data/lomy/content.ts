import type { LomyContent } from './types'

/**
 * Copy and data for the rebuilt Horský hotel Lomy page.
 *
 * Source of truth: `lomy-page-draft.md` (section numbers referenced per block).
 * Nothing here is invented — where the draft marks a gap, the gap is noted in a
 * comment rather than filled with a guess.
 */

/** Stand-in photography until real venue shots arrive. */
const placeholder = (seed: string) => `https://picsum.photos/seed/${seed}/1600/1067`

export const lomyContent: LomyContent = {
  slug: 'horsky-hotel-lomy',

  // ─── Section 1: Hero ───────────────────────────────────────────────────────
  hero: {
    kicker: 'Škola v prírode',
    name: 'Horský hotel Lomy',
    location: 'Prievidza (Horná Ves)',
    rating: { value: '4,2', source: 'Google' },

    // Stredisko/areál photos only. Animačný program photography belongs to its
    // own gallery further down the page (draft section 6), not here.
    photos: [
      {
        // The one real asset we have. Low resolution (384×256) — flagged as a
        // gap; swap in the high-res original when it arrives.
        src: '/images/Skoly v Prirode/lomy.png',
        alt: 'Areál Horského hotela Lomy — amfiteáter s ohniskom, hlavná budova a zrubové chatky',
        isPlaceholder: false,
        // Coordinates are keyed to this exact frame. They must be re-checked
        // whenever this photo is replaced.
        markers: [
          { label: 'Amfiteáter', x: 46, y: 77 },
          { label: 'Hlavná budova', x: 76, y: 51 },
          { label: 'Zrubové chatky', x: 14, y: 46 },
        ],
      },
      { src: placeholder('lomy-chatky'), alt: 'Zrubové chatky', isPlaceholder: true },
      { src: placeholder('lomy-ihrisko'), alt: 'Multifunkčné ihrisko', isPlaceholder: true },
      { src: placeholder('lomy-travnate'), alt: 'Trávnaté ihrisko a altánky', isPlaceholder: true },
      { src: placeholder('lomy-izby'), alt: 'Izby v hlavnej budove', isPlaceholder: true },
      { src: placeholder('lomy-bazen'), alt: 'Vonkajší bazén', isPlaceholder: true },
    ],

    price: {
      prefix: 'od',
      amount: '205 €',
      unit: '/ 5 dní',
      note: 'bez animačného programu',
    },

    facts: [
      { label: 'Lokalita', value: 'Prievidza (Horná Ves)', icon: '📍' },
      { label: 'Kapacita', value: '200 lôžok', icon: '🛏️' },
      { label: 'Dostupné termíny', value: 'apríl – jún', icon: '📅' },
    ],

    discount: {
      amount: '−30 €',
      unit: '/ dieťa',
      // [CHÝBA] Draft open question #1: katalóg says 31.10.2026, but 31.10.2027
      // was also mentioned. Year deliberately omitted until confirmed.
      deadline: 'do 31.10',
    },

    // Both CTAs point at the termíny + kontakt block (draft section 7), which is
    // a later prompt. The anchor resolves once that section exists.
    ctas: {
      primary: { label: 'Vybrať termín', href: '#terminy' },
      secondary: { label: 'Kontaktujte nás', href: '#terminy' },
    },
  },
}
