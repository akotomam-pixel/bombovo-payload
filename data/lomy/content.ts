import type { LomyContent } from './types'
import { PROGRAM_GALLERY_PHOTOS } from '@/data/programGallery'

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
        alt: 'Areál Horského hotela Lomy: amfiteáter s ohniskom, hlavná budova a zrubové chatky',
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

    // Icons are the client's own artwork, used in the file order they gave
    // (1→3, left to right). Note icons 2 and 3 are double-suffixed on disk.
    proof: [
      { label: 'Garancia vrátenia peňazí', icon: '/images/skoly-v-prirode-icon-1.png' },
      { label: 'Promptné jednanie a serióznosť', icon: '/images/skoly-v-prirode-icon-2.png.png' },
      { label: '50 000+ detí odanimovaných', icon: '/images/skoly-v-prirode-icon-3.png.png' },
    ],

    // Supplied by the client. Note this is not the review in the draft's proof
    // strip (section 2) — that one is from Mgr. Paločková and belongs to section
    // 2 when it gets built.
    review: {
      quote:
        'Veľmi oceňujeme vybudovanie strediska Lomy. Umožňuje veľa exteriérových aktivít. Zároveň bolo výborné aj ubytovanie a priestory jednak hotela i chatiek. Vybrali sme si celodenný animačný program, ktorý bol na výbornej úrovni.',
      author: 'Mgr. Pavol Halák',
      school: 'ZŠ Fatranská 14, Nitra',
      groupSize: '106 detí',
      stars: 5,
    },

    discount: {
      amount: '−30 €',
      unit: '/ dieťa',
      // The year is confirmed as 2026. It stays off the badge because the seal
      // is small and the pricing section states the full date; if the badge ever
      // needs it, change this to 'do 31.10.2026'.
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

  // ─── Section 3: V čom je výnimočný ─────────────────────────────────────────
  // Copy is the draft's section 3, verbatim. The distances that once sat beside
  // the okolie entries were removed there deliberately and stay out.
  vynimocny: {
    heading: 'V čom je Horský hotel Lomy výnimočný',
    paragraph:
      'Hotel Lomy sa nachádza v doline pohoria Vtáčnik neďaleko Partizánskeho, obklopený lesom a tichou prírodou, mimo hlavného ruchu. Stredisko je kompletne zrekonštruované, od izieb v hlavnej budove až po zrubové chatky. Vlastný amfiteáter s krytým pódiom priamo v areáli znamená, že sa skupina počas pobytu nemusí nikam presúvať. Večerné opekačky pri ohnisku (za priaznivého počasia) sú tu bežnou súčasťou programu, nie výnimkou.',
    okolie: {
      title: 'Zaujímavosti v okolí',
      items: [
        'Hvezdáreň v Partizánskom',
        'Termálne kúpele Malé Bielice',
        'Zveropark Žarnovica',
        'Zámok a ZOO Bojnice',
        'Baňa Cígeľ',
      ],
    },
    // A portrait 9:16 shot is being sourced. Left empty on purpose: the section
    // shows a marked placeholder rather than cropping the wide hero photo into
    // a tall frame it was never composed for. Set `src` when the real one lands.
    photo: {
      src: '',
      alt: 'Areál Horského hotela Lomy',
    },
  },

  // ─── Section 4: Čo je zahrnuté v cene a doplnkové služby ─────────────
  // The blocks are written as prose rather than the old spec list, but every
  // figure from the draft is still here and unchanged.
  //
  // Prices are the Lomy ones. The old shared constants in `page.tsx` still say
  // 30 €, Kremnica and 550 €; they never reach this page, so they are left for
  // whenever the other five strediská are rebuilt.
  //
  // Three services were dropped on instruction: pobytový deň naviac, pobyt
  // dospelej osoby naviac, and pobyt pedagogického dieťaťa.
  cena: {
    heading: 'Čo je zahrnuté v cene a naše doplnkové služby',

    zakladna: {
      title: 'V základnej cene',
      intro:
        'Keď si vyberiete školu v prírode s nami, v základnej cene máte už všetko, čo potrebujete.',
      items: [
        '4× ubytovanie, 4× plná penzia, strava 5× denne, pitný režim',
        '1 dospelý pedagóg zdarma na každých 10 detí',
        'Opekačka (pri priaznivom počasí, výmenou za olovrant)',
        'Divadelné predstavenie pre deti NA TRAKY (len pri objednanom animačnom programe)',
        'Cena pevného lôžka = cena prístelky',
        'Príplatok pre 2. stupeň ZŠ: 8 € / pobyt / osoba',
      ],
      // Green seal with a tick, matching this card's green treatment. Change the
      // path to swap which artwork this heading uses.
      icon: '/images/section-4-icon-vsetko-v-cene.png',
    },

    animacny: {
      title: 'Animačný program',
      price: { amount: '+55 €', unit: '/ dieťa' },
      // Blue star with a yellow sparkle — brand blue and yellow together.
      icon: '/images/section-4-icon-animacny-program.png',
      paragraph:
        'Vyberte si animačný program a vaša škola v prírode získa úplne iný rozmer, pre učiteľov aj žiakov. Naši skúsení a školení animátori sa postarajú o to, aby bol každý deň pre deti bezpečným dobrodružstvom, pri ktorom si vy môžete plne oddýchnuť od povinností.',
      items: [
        'od 14:00 do 21:00, spolu 28 h/pobyt',
        'ZŠ: 1 animátor na 15 detí. MŠ: 1 animátor na 10 detí',
        'Animačný a športový materiál, hry, kvízy, darček pre každého účastníka',
        'Možnosť celodenného programu za príplatok +65 € / dieťa',
        'Pripravené pre skupiny od 20 platiacich detí, pri nižšom počte vám radi pripravíme individuálnu ponuku',
      ],
    },

    doplnkove: {
      title: 'Doplnkové služby',
      items: [
        {
          label: 'Bombový balíček',
          price: { amount: '35 €', unit: '/ dieťa' },
          icon: '/images/section-4-icon-bombovo-balicek.png',
          description:
            'Ak si k animačnému programu objednáte aj Bombový balíček, dostanete ako pedagógovia odmenu 100 € za každých 10 platiacich detí. Balíček navyše zahŕňa autobusový výlet so vstupom do ZOO Bojnice alebo do sklární Valaská Belá (odporúčame pre skupiny do 50 detí) a darček na pamiatku pre každého účastníka.',
          note: 'Balíček je dostupný len pri objednanom animačnom programe.',
        },
        {
          label: 'Zdravotník CK Bombovo s lekárničkou',
          price: { amount: '590 €', unit: '/ pobyt' },
          icon: '/images/section-4-icon-zdravotnik.png',
          description:
            'Zabezpečiť kvalifikovaného zdravotníka na pobyt vie byť pre školu časovo aj organizačne náročné, my sa o to postaráme za vás. Na váš pobyt vám zabezpečíme zdravotníka priamo od CK Bombovo, vybaveného kompletnou lekárničkou, ktorý bude k dispozícii počas celého pobytu.',
        },
        {
          label: 'Komplexné cestovné poistenie ECP',
          price: { amount: '4,50 €', unit: '/ dieťa / pobyt' },
          icon: '/images/section-4-icon-poitenie.png',
          // Coverage is not invented: the same product is described across the
          // camp data files (e.g. data/camps/neverfort.ts) as covering storno,
          // prerušenie cesty, úraz and zodpovednosť za škodu.
          description:
            'Komplexné cestovné poistenie kryje storno pobytu, prerušenie cesty, úraz aj zodpovednosť za škodu. Pripoistiť sa dá ku ktorémukoľvek termínu a vybavíme ho za vás spolu s prihláškou, takže rodičia nemusia riešiť nič navyše.',
        },
      ],
    },
  },

  // ─── Section 5: Ubytovanie a lokalita ──────────────────────────────────────
  // The draft's own lines, verbatim. Its six-item vybavenie list keeps the
  // amfiteáter and both ihriská, which section 3 also names — that repetition is
  // intended: section 3 is the highlights, this is the full spec.
  //
  // The "Zistite, ako ďaleko…" line is the only copy in the map block; the rest
  // of that draft line describes where the module goes, not what it says.
  ubytovanie: {
    heading: 'Ubytovanie a lokalita',
    ubytovanie: {
      title: 'Ubytovanie',
      rooms: [
        { label: 'Hlavná budova', detail: '2–7 lôžkové izby s možnosťou prísteliek, WC, sprcha' },
        { label: 'Zrubové chatky', detail: '7-lôžkové, WC, sprcha' },
      ],
      capacity: { label: 'Celková kapacita', value: '200 lôžok' },
    },
    vybavenie: {
      title: 'Vybavenie strediska',
      items: [
        'Amfiteáter s krytým pódiom a ohniskom',
        'Multifunkčné ihrisko, trávnaté ihrisko',
        '2× altánok s posedením',
        'Spoločenské miestnosti, detské ihrisko',
        'Bufet, dataprojektor, TV',
        'Vonkajší bazén (nevyhrievaný)',
        // Added on instruction; not part of the draft's original six.
        'Široké materiálne vybavenie',
      ],
    },
    mapa: {
      title: 'Zistite, ako ďaleko je Horský hotel Lomy od vás',
      // Same coordinates the original stredisko data carries.
      coordinates: { lat: 48.58064084310827, lng: 18.56727918359109 },
    },
  },

  // ─── Section 7: Dostupné termíny + kontakt ─────────────────────────────────
  kontakt: {
    terminyHeading: 'Dostupné termíny',
    terminyCta: 'ZOBRAZIŤ DOSTUPNÉ TERMÍNY',
    formHeading: 'Získať cenovú ponuku',
    formIntro:
      'Napíšte nám a pripravíme vám konkrétnu ponuku pre vašu školu. Nie je to záväzná rezervácia.',
    formCta: 'VYPLNIŤ NEZÁVÄZNÚ OBJEDNÁVKU',
    sticky: {
      label: 'Termíny',
      // Matches the hero's primary CTA exactly, caps included.
      cta: 'ZÍSKAŤ CENOVÚ PONUKU',
    },
  },

  // ─── Section 6: Overený animačný program ───────────────────────────────────
  // The draft's copy, with its em dash replaced by a comma. Deliberately short:
  // the draft calls for a paragraph, not a full presentation of the programme —
  // that is what the linked page is for.
  //
  // The gallery is the same across every stredisko rather than shot at Lomy. The
  // photos have not been supplied, so it is empty and the section renders marked
  // placeholders. Add entries here when they arrive.
  program: {
    heading: 'Overený animačný program',
    paragraph:
      'Animátori, ktorí robia deťom zábavný program? Sú ústretoví, starajú sa o ich šťastie a bezpečie, a hlavne robia svoju prácu srdcom? Presne to robí náš program výnimočným a obľúbeným medzi učiteľmi. Deti z neho odchádzajú so zážitkami, na ktoré budú spomínať celý život, a často s plačom, že nechcú odísť.\n\nNa školský rok 26/27 sme si pre materské a základné školy pripravili viacero programov. Dočítate sa o nich viac kliknutím na tlačidlo nižšie.',
    // Verified: app/(app)/program-skoly-v-prirode/page.tsx is a real 289-line
    // page with no data dependencies, already linked from the strediská listing
    // and the original detail page.
    cta: { label: 'Zistiť viac o programe', href: '/program-skoly-v-prirode' },
    gallery: PROGRAM_GALLERY_PHOTOS,
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
