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
    // `source` is retained on the model but no longer rendered — the attribution
    // text was dropped from the hero badge.
    rating: { value: '4,8', source: 'Google' },

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

    // 205 € základná cena − 30 € zľava = 175 €. `discounted` is stored rather
    // than computed: both figures are copy, and the arithmetic must stay visible
    // to whoever edits the price so the two never drift apart.
    price: {
      prefix: 'od',
      amount: '205 €',
      discounted: '175 €',
      unit: '/ 5 dní',
      note: 'bez animačného programu',
    },

    facts: [
      { label: 'Lokalita', value: 'Prievidza (Horná Ves)', icon: '📍' },
      { label: 'Kapacita', value: '200 lôžok', icon: '🛏️' },
      { label: 'Dostupné termíny', value: 'apríl – jún', icon: '📅' },
    ],

    proof: [
      { label: 'Garancia vrátenia peňazí' },
      { label: 'Promptné jednanie a serióznosť' },
      { label: '50 000+ detí odanimovaných' },
    ],

    // Supplied by the client. Note this is not the review in the draft's proof
    // strip (section 2) — that one is from Mgr. Paločková and belongs to section
    // 2 when it gets built.
    review: {
      quote:
        'Veľmi oceňujeme vybudovanie strediska Lomy — umožňuje veľa exteriérových aktivít, ubytovanie aj animačný program boli na výbornej úrovni.',
      author: 'Mgr. Pavol Halák',
      school: 'ZŠ Fatranská 14, Nitra',
      groupSize: '106 detí',
      initials: 'PH',
      stars: 5,
    },

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
      // All caps is deliberate copy, not a CSS transform — confirmed with the client.
      // The quote request leads; browsing terms is the lighter second option.
      primary: { label: 'ZÍSKAŤ CENOVÚ PONUKU', href: '#terminy' },
      secondary: { label: 'ZOBRAZIŤ DOSTUPNÉ TERMÍNY', href: '#terminy' },
    },
  },

  // ─── Section 7 (partial): termíny modal ────────────────────────────────────
  // Dates and prices are transcribed exactly from the draft's section 7 table.
  // Every session is 205 €, so the hero's standing −30 € discount applies
  // uniformly: 205 € struck through, 175 € shown.
  //
  // `status` is maintained by hand: all 12 dates were confirmed open by the
  // client. No capacity system feeds this — `lib/campCapacity.ts` keys on Profis
  // termín IDs in `camps_dates` (summer camps only) and `strediska.vypredane` is
  // a single flag for a whole venue, so neither applies here. If one is wired up
  // later it should write this field rather than introduce a parallel one.
  //
  // The contact form the draft places under this list, and the "V cene" block,
  // are both out of scope until section 4 exists.
  terminy: {
    title: 'Vyberte si termín',
    subtitle: 'Horský hotel Lomy · sezóna 2027',
    duration: '5 dní',
    deadline: 'do 31.10',
    bookLabel: 'REZERVOVAŤ',
    bookNote: 'čoskoro',
    items: [
      { range: '05.04. – 09.04.2027', price: '205 €', discounted: '175 €', status: 'Voľné' },
      { range: '12.04. – 16.04.2027', price: '205 €', discounted: '175 €', status: 'Voľné' },
      { range: '19.04. – 23.04.2027', price: '205 €', discounted: '175 €', status: 'Voľné' },
      { range: '26.04. – 30.04.2027', price: '205 €', discounted: '175 €', status: 'Voľné' },
      { range: '03.05. – 07.05.2027', price: '205 €', discounted: '175 €', status: 'Voľné' },
      { range: '10.05. – 14.05.2027', price: '205 €', discounted: '175 €', status: 'Voľné' },
      { range: '17.05. – 21.05.2027', price: '205 €', discounted: '175 €', status: 'Voľné' },
      { range: '24.05. – 28.05.2027', price: '205 €', discounted: '175 €', status: 'Voľné' },
      { range: '31.05. – 04.06.2027', price: '205 €', discounted: '175 €', status: 'Voľné' },
      { range: '07.06. – 11.06.2027', price: '205 €', discounted: '175 €', status: 'Voľné' },
      { range: '14.06. – 18.06.2027', price: '205 €', discounted: '175 €', status: 'Voľné' },
      { range: '21.06. – 25.06.2027', price: '205 €', discounted: '175 €', status: 'Voľné' },
    ],
  },
}
