import type { LomyContent } from '@/data/lomy/types'
import { PROGRAM_GALLERY_PHOTOS } from '@/data/programGallery'

/**
 * Content for the new Hotel Osrblie page (season 2027), on the same
 * architecture as `data/lomy/content.ts`. Group B of the six-stredisko
 * rebuild: this is a brand-new stredisko with no Payload row and no real
 * photography yet.
 *
 * TEMP PLACEHOLDER — every photo below (hero gallery + section-3 portrait)
 * reuses Lomy's own real hero photo (`/images/Skoly v Prirode/lomy.png`)
 * until real Osrblie photography is supplied. Swap for real photos once
 * available, same order of operations already proven on Lomy: page and
 * content first, real photos wired through Payload later.
 *
 * `ubytovanie.mapa.coordinates` is also a TEMP PLACEHOLDER (reuses Lomy's own
 * coordinates) — no GPS coordinates for Hotel Osrblie were given in the
 * rebuild brief, and this file does not invent one. Flagged back in the
 * delivery report; replace with the real coordinates once supplied.
 *
 * Every other fact here is exactly as given in the rebuild brief. Where a
 * fact was not given (Google rating), the field is left empty rather than
 * filled with a guess.
 */
export const hotelOsrblieContent: LomyContent = {
  slug: 'hotel-osrblie',

  hero: {
    kicker: 'Škola v prírode',
    name: 'Hotel Osrblie',
    location: 'Osrblie, Horehronie',
    rating: { value: '4,4', source: 'Google' },

    // TEMP PLACEHOLDER — Lomy's real hero photo, reused until real Osrblie
    // photography is supplied.
    photos: [
      {
        src: '/images/Skoly v Prirode/lomy.png',
        alt: 'Areál Hotela Osrblie',
        isPlaceholder: true,
      },
    ],

    // od 215 € (apríl – zač. mája, znížená cena) − 30 € zľava = 185 €.
    // Bežná cena od 17.05. je 235 €, viď `terminy.items`.
    price: {
      prefix: 'od',
      amount: '215 €',
      discounted: '185 €',
      unit: '/ 5 dní',
      note: 'bez animačného programu',
    },

    facts: [
      { label: 'Lokalita', value: 'Osrblie (Horehronie)', icon: '📍' },
      { label: 'Kapacita', value: '100 lôžok', icon: '🛏️' },
      { label: 'Dostupné termíny', value: 'apríl – jún', icon: '📅' },
    ],

    proof: [
      { label: 'Garancia vrátenia peňazí', icon: '/images/skoly-v-prirode-icon-1.png' },
      { label: 'Promptné jednanie a serióznosť', icon: '/images/skoly-v-prirode-icon-2.png.png' },
      { label: '50 000+ detí odanimovaných', icon: '/images/skoly-v-prirode-icon-3.png.png' },
    ],

    review: {
      quote:
        'Program bol výborne pripravený, aktivity boli pestré a deti si ich užívali. Komunikácia s animátormi je výborná, sú vždy ochotní a nápomocní.',
      author: 'PaedDr. Juhariová',
      school: 'ZŠ Beethovenova, Nitra',
      groupSize: '',
      stars: 5,
    },

    discount: {
      amount: '−30 €',
      unit: '/ dieťa',
      deadline: 'do 31.10',
    },

    ctas: {
      primary: { label: 'ZÍSKAŤ CENOVÚ PONUKU', href: '#terminy' },
      secondary: { label: 'ZOBRAZIŤ DOSTUPNÉ TERMÍNY', href: '#terminy' },
    },
  },

  vynimocny: {
    heading: 'V čom je Hotel Osrblie výnimočný',
    paragraph:
      'Hotel Osrblie leží v tichej obci pod Nízkymi Tatrami, priamo vedľa Národného biatlonového centra, jedného z najznámejších biatlonových areálov na Slovensku, kde sa pravidelne bežia aj preteky Svetového pohára. Deti tak môžu vidieť miesto, kde trénujú skutoční reprezentanti, a s Bombovým balíčkom si streľbu zo vzduchovky vyskúšajú aj na vlastnej koži. Stredisko k tomu ponúka domácu reštauráciu, bar, záhradu, detský klub a wellness, v ktorom majú pedagógovia hodinu zdarma.',
    okolie: {
      title: 'Zaujímavosti v okolí',
      items: [
        '4 km Predajnianske vodopády',
        '6 km Letné kúpalisko Podbrezová',
        '7 km farma Dolinka',
        '7 km Hutnícky skanzen',
        '10 km lesnícky skanzen Vydrovo',
      ],
    },
    // TEMP PLACEHOLDER — same reused Lomy photo as the hero gallery.
    photo: {
      src: '/images/Skoly v Prirode/lomy.png',
      alt: 'Areál Hotela Osrblie',
    },
  },

  cena: {
    heading: 'Čo je zahrnuté v cene a naše doplnkové služby',

    zakladna: {
      title: 'V základnej cene',
      intro: 'Keď si vyberiete školu v prírode s nami, v základnej cene máte už všetko, čo potrebujete.',
      items: [
        '4× ubytovanie, 4× plná penzia, strava 5× denne, pitný režim',
        '1 dospelý pedagóg zdarma na každých 10 platiacich detí',
        'Cena pevného lôžka je rovnaká ako cena prístelky',
        'Príplatok pre 2. stupeň ZŠ: 8 € / pobyt / osoba',
        'Pobytový poplatok zahrnutý',
      ],
      icon: '/images/section-4-icon-vsetko-v-cene.png',
    },

    animacny: {
      title: 'Animačný program',
      price: { amount: '+55 €', unit: '/ dieťa' },
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
            'Ak si k animačnému programu objednáte aj Bombový balíček, dostanete ako pedagógovia odmenu 100 € za každých 10 platiacich detí. Balíček navyše zahŕňa streľbu zo vzduchovej zbrane v Biatlonovom centre a darček na pamiatku pre každého účastníka.',
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
          description:
            'Komplexné cestovné poistenie kryje storno pobytu, prerušenie cesty, úraz aj zodpovednosť za škodu. Pripoistiť sa dá ku ktorémukoľvek termínu a vybavíme ho za vás spolu s prihláškou, takže rodičia nemusia riešiť nič navyše.',
        },
      ],
    },
  },

  ubytovanie: {
    heading: 'Ubytovanie a lokalita',
    ubytovanie: {
      title: 'Ubytovanie',
      rooms: [{ label: 'Izby', detail: '2–3 lôžkové izby s WC a sprchou' }],
      capacity: { label: 'Celková kapacita', value: '100 lôžok' },
    },
    vybavenie: {
      title: 'Vybavenie strediska',
      items: [
        'Banketová sála',
        'Konferenčná miestnosť',
        'Multifunkčná miestnosť',
        'Priestor vhodný na loptové hry',
        'Možnosť opekania',
        'Možnosť využiť bowling',
        'Wifi',
        'Wellness, 1× vstup grátis, 1 hod. počas pobytu, pre pedagógov',
      ],
    },
    mapa: {
      title: 'Zistite, ako ďaleko je Hotel Osrblie od vás',
      // Real coordinates, geocoded from the confirmed address (Anderlová 224,
      // 976 45 Osrblie) via OpenStreetMap Nominatim — matches a hotel-tagged
      // building at that exact address.
      coordinates: { lat: 48.7563606, lng: 19.5207151 },
    },
  },

  kontakt: {
    terminyHeading: 'Dostupné termíny',
    terminyCta: 'ZOBRAZIŤ DOSTUPNÉ TERMÍNY',
    formHeading: 'Získať cenovú ponuku',
    formIntro: 'Napíšte nám a pripravíme vám konkrétnu ponuku pre vašu školu. Nie je to záväzná rezervácia.',
    formCta: 'VYPLNIŤ NEZÁVÄZNÚ OBJEDNÁVKU',
    sticky: {
      label: 'Termíny',
      cta: 'ZOBRAZIŤ DOSTUPNÉ TERMÍNY',
    },
  },

  program: {
    heading: 'Overený animačný program',
    paragraph:
      'Animátori, ktorí robia deťom zábavný program? Sú ústretoví, starajú sa o ich šťastie a bezpečie, a hlavne robia svoju prácu srdcom? Presne to robí náš program výnimočným a obľúbeným medzi učiteľmi. Deti z neho odchádzajú so zážitkami, na ktoré budú spomínať celý život, a často s plačom, že nechcú odísť.\n\nNa školský rok 26/27 sme si pre materské a základné školy pripravili viacero programov. Dočítate sa o nich viac kliknutím na tlačidlo nižšie.',
    cta: { label: 'Zistiť viac o programe', href: '/program-skoly-v-prirode' },
    gallery: PROGRAM_GALLERY_PHOTOS,
  },

  terminy: {
    title: 'Vyberte si termín',
    subtitle: 'Hotel Osrblie · sezóna 2027',
    duration: '5 dní',
    deadline: 'do 31.10',
    bookLabel: 'REZERVOVAŤ',
    bookNote: 'čoskoro',
    items: [
      // Added at the client's reduced early-season price (215 € before the
      // standing −30 € discount, vs. the usual 235 €).
      { range: '05.04. – 09.04.2027', price: '215 €', discounted: '185 €', status: 'Voľné' },
      { range: '12.04. – 16.04.2027', price: '215 €', discounted: '185 €', status: 'Voľné' },
      { range: '19.04. – 23.04.2027', price: '215 €', discounted: '185 €', status: 'Voľné' },
      { range: '26.04. – 30.04.2027', price: '215 €', discounted: '185 €', status: 'Voľné' },
      { range: '03.05. – 07.05.2027', price: '215 €', discounted: '185 €', status: 'Voľné' },
      { range: '10.05. – 14.05.2027', price: '215 €', discounted: '185 €', status: 'Voľné' },
      { range: '17.05. – 21.05.2027', price: '235 €', discounted: '205 €', status: 'Voľné' },
      { range: '24.05. – 28.05.2027', price: '235 €', discounted: '205 €', status: 'Voľné' },
      { range: '31.05. – 04.06.2027', price: '235 €', discounted: '205 €', status: 'Voľné' },
      { range: '07.06. – 11.06.2027', price: '235 €', discounted: '205 €', status: 'Rezervované' },
      { range: '14.06. – 18.06.2027', price: '235 €', discounted: '205 €', status: 'Rezervované' },
      { range: '21.06. – 25.06.2027', price: '235 €', discounted: '205 €', status: 'Voľné' },
    ],
  },
}
