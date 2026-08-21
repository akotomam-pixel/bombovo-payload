import type { LomyContent } from '@/data/lomy/types'
import { PROGRAM_GALLERY_PHOTOS } from '@/data/programGallery'

/**
 * Content for the new Penzión Palušák page (season 2027), on the same
 * architecture as `data/lomy/content.ts`. Group B of the six-stredisko
 * rebuild: this is a brand-new stredisko with no Payload row and no real
 * photography yet.
 *
 * TEMP PLACEHOLDER — every photo below (hero gallery + section-3 portrait)
 * reuses Lomy's own real hero photo (`/images/Skoly v Prirode/lomy.png`)
 * until real Palušák photography is supplied. Swap for real photos once
 * available, same order of operations already proven on Lomy: page and
 * content first, real photos wired through Payload later.
 *
 * `ubytovanie.mapa.coordinates` is also a TEMP PLACEHOLDER (reuses Lomy's own
 * coordinates) — no GPS coordinates for Penzión Palušák were given in the
 * rebuild brief, and this file does not invent one. Flagged back in the
 * delivery report; replace with the real coordinates once supplied.
 *
 * Every other fact here is exactly as given in the rebuild brief. Where a
 * fact was not given (Google rating), the field is left empty rather than
 * filled with a guess.
 */
export const penzionPalusakContent: LomyContent = {
  slug: 'penzion-palusak',

  hero: {
    kicker: 'Škola v prírode',
    name: 'Penzión Palušák',
    location: 'Stará Lesná, Vysoké Tatry',
    rating: { value: '4,4', source: 'Google' },

    // TEMP PLACEHOLDER — Lomy's real hero photo, reused until real Palušák
    // photography is supplied.
    photos: [
      {
        src: '/images/Skoly v Prirode/lomy.png',
        alt: 'Areál Penziónu Palušák',
        isPlaceholder: true,
      },
    ],

    // 220 € základná cena − 30 € zľava = 190 €.
    price: {
      prefix: 'od',
      amount: '220 €',
      discounted: '190 €',
      unit: '/ 5 dní',
      note: 'bez animačného programu',
    },

    facts: [
      { label: 'Lokalita', value: 'Stará Lesná (Vysoké Tatry)', icon: '📍' },
      { label: 'Kapacita', value: '50 lôžok', icon: '🛏️' },
      { label: 'Dostupné termíny', value: 'máj – jún', icon: '📅' },
    ],

    proof: [
      { label: 'Garancia vrátenia peňazí', icon: '/images/skoly-v-prirode-icon-1.png' },
      { label: 'Promptné jednanie a serióznosť', icon: '/images/skoly-v-prirode-icon-2.png.png' },
      { label: '50 000+ detí odanimovaných', icon: '/images/skoly-v-prirode-icon-3.png.png' },
    ],

    review: {
      quote:
        'Chodíme s Bombovom už viac ako 10 rokov, vždy výborní a ústretoví animátori, ktorí sa ukážkovo starajú o deti. Nikdy sa im nechce ísť domov. Máme s nimi krásne zážitky.',
      author: 'Mgr. Judita Ňukovičová',
      school: 'ZŠ Rajčianska 3, Bratislava',
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
    heading: 'V čom je Penzión Palušák výnimočný',
    paragraph:
      'Penzión Palušák sa nachádza v Starej Lesnej, obci priamo pod Vysokými Tatrami, len 4 km od Tatranskej Lomnice. Je to miesto, kde sídli aj slovenský astronomický ústav, takže okolie je späté s hviezdami rovnako ako s horami. Rodinná atmosféra penziónu, vlastné detské ihrisko a futbalové ihrisko na dosah ruky robia zo Starej Lesnej ideálnu základňu na výlety do vysokohorskej prírody, bez toho, aby ste museli bývať priamo v preplnenom stredisku.',
    okolie: {
      title: 'Zaujímavosti v okolí',
      items: [
        '4 km Galéria dobrá hračka',
        '2,5 km Observatórium Stará Lesná',
        '4 km Slnečné hodiny Stará Lesná',
        '10 km Belianska jaskyňa',
        '6 km Tricklandia',
      ],
    },
    // TEMP PLACEHOLDER — same reused Lomy photo as the hero gallery.
    photo: {
      src: '/images/Skoly v Prirode/lomy.png',
      alt: 'Areál Penziónu Palušák',
    },
  },

  cena: {
    heading: 'Čo je v nej zahrnuté v cene a doplnkové služby',

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
            'Ako poďakovanie za objednaný animačný program získa vaša škola odmenu 100 € za každých 10 platiacich detí. K tomu si môžete za príplatok 35 € na dieťa pripočítať vstup do Belianskej jaskyne a autobusovú dopravu, a darček na pamiatku pre každého účastníka.',
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
      rooms: [{ label: 'Izby', detail: '2–4 lôžkové izby s WC a sprchou' }],
      capacity: { label: 'Celková kapacita', value: '50 lôžok' },
    },
    vybavenie: {
      title: 'Vybavenie strediska',
      items: [
        'Detské ihrisko',
        'Altánok, ohnisko',
        'Trávnatá plocha',
        'Futbalové ihrisko 20 m od penziónu',
        'Wifi',
        'Kongresová miestnosť',
        'Asfaltová plocha',
        'Bar',
        'Terasa',
      ],
    },
    mapa: {
      title: 'Zistite, ako ďaleko je Penzión Palušák od vás',
      // Real coordinates, geocoded via OpenStreetMap Nominatim — a direct
      // name match ("Penzión Palušák", tourism=guest_house) at Hlavná, Stará
      // Lesná, matching the known region exactly.
      coordinates: { lat: 49.1354104, lng: 20.3102178 },
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
      cta: 'ZÍSKAŤ CENOVÚ PONUKU',
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
    subtitle: 'Penzión Palušák · sezóna 2027',
    duration: '5 dní',
    deadline: 'do 31.10',
    bookLabel: 'REZERVOVAŤ',
    bookNote: 'čoskoro',
    items: [
      { range: '17.05. – 21.05.2027', price: '220 €', discounted: '190 €', status: 'Voľné' },
      { range: '24.05. – 28.05.2027', price: '220 €', discounted: '190 €', status: 'Voľné' },
      { range: '31.05. – 04.06.2027', price: '220 €', discounted: '190 €', status: 'Voľné' },
      { range: '07.06. – 11.06.2027', price: '220 €', discounted: '190 €', status: 'Voľné' },
    ],
  },
}
