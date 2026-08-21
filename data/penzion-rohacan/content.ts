import type { LomyContent } from '@/data/lomy/types'

/**
 * Content for the rebuilt Penzión Roháčan page (season 2027), on the same
 * architecture as `data/lomy/content.ts`. Group A of the six-stredisko
 * rebuild: this slug already exists in Payload (real hero/section2 photos
 * are already uploaded there), so `hero.photos` and `vynimocny.photo` below
 * are just the static fallback used if Payload is unreachable, same pattern
 * Lomy's own file uses.
 *
 * Facts are exactly as given in the rebuild brief. Nothing here is invented:
 * where a fact was not given (Google rating, a portrait 9:16 shot), the field
 * is left empty/marked rather than filled with a guess.
 */
export const penzionRohacanContent: LomyContent = {
  slug: 'penzion-rohacan',

  hero: {
    kicker: 'Škola v prírode',
    name: 'Penzión Roháčan',
    location: 'Huty, Západné Tatry',
    rating: { value: '', source: '' },

    photos: [
      {
        src: 'https://picsum.photos/seed/rohacan-hero/1600/1067',
        alt: 'Areál Penziónu Roháčan',
        isPlaceholder: true,
      },
      { src: 'https://picsum.photos/seed/rohacan-2/1600/1067', alt: 'Penzión Roháčan', isPlaceholder: true },
      { src: 'https://picsum.photos/seed/rohacan-3/1600/1067', alt: 'Penzión Roháčan', isPlaceholder: true },
      { src: 'https://picsum.photos/seed/rohacan-4/1600/1067', alt: 'Penzión Roháčan', isPlaceholder: true },
    ],

    // 205 € základná cena − 30 € zľava = 175 €.
    price: {
      prefix: 'od',
      amount: '205 €',
      discounted: '175 €',
      unit: '/ 5 dní',
      note: 'bez animačného programu',
    },

    facts: [
      { label: 'Lokalita', value: 'Huty (Západné Tatry)', icon: '📍' },
      { label: 'Kapacita', value: '54 lôžok', icon: '🛏️' },
      { label: 'Dostupné termíny', value: 'máj – jún', icon: '📅' },
    ],

    proof: [
      { label: 'Garancia vrátenia peňazí', icon: '/images/skoly-v-prirode-icon-1.png' },
      { label: 'Promptné jednanie a serióznosť', icon: '/images/skoly-v-prirode-icon-2.png.png' },
      { label: '50 000+ detí odanimovaných', icon: '/images/skoly-v-prirode-icon-3.png.png' },
    ],

    review: {
      quote:
        'S vybavením, čistotou aj ubytovaním sme boli veľmi spokojní. Animačný tím bol úžasný, program bol výborne pripravený a deti sa počas celého pobytu nenudili.',
      author: 'Mgr. Lea Christovová',
      school: 'ZŠ SNP, Galanta',
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
    heading: 'V čom je Penzión Roháčan výnimočný',
    paragraph:
      'Penzión Roháčan leží na začiatku obce Huty, len 5 km od Zuberca, v tesnej blízkosti Roháčskej doliny a Západných Tatier, jednej z najkrajších a najmenej turisticky preplnených oblastí na Slovensku. Okolie penziónu je tiché a zároveň je ideálnym východiskovým bodom na výlety k roháčskym vodopádom a plesám. Kto chce, môže si po dohode priamo na stredisku vyskúšať aj lanový park.',
    okolie: {
      title: 'Zaujímavosti v okolí',
      items: [
        '3,1 km Ráztocká dolina, vodopád, Vodné Mlyny Oblazy',
        '8,2 km Brestovská jaskyňa',
        '4,6 km Kvačianska dolina',
        '7,1 km Polovníkov vodopád',
        '12,3 km Roháčske plesá',
        '12,7 km Liptovský hrad',
      ],
    },
    photo: {
      src: '',
      alt: 'Areál Penziónu Roháčan',
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
            'Ako poďakovanie za objednaný animačný program získa vaša škola odmenu 100 € za každých 10 platiacich detí. K tomu si môžete za príplatok 35 € na dieťa pripočítať autobusovú dopravu a vstup do Múzea oravskej dediny, a darček na pamiatku pre každého účastníka.',
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
      rooms: [{ label: 'Izby', detail: '2–5 lôžkové izby s WC a sprchou' }],
      capacity: { label: 'Celková kapacita', value: '54 lôžok' },
    },
    vybavenie: {
      title: 'Vybavenie strediska',
      items: [
        'Spoločenská miestnosť',
        'Vonkajšia hracia plocha',
        '2× altánok',
        'Vonkajšie ihrisko',
        'Bufet',
        'Lanový park, vstup po dohode na stredisku',
      ],
    },
    mapa: {
      title: 'Zistite, ako ďaleko je Penzión Roháčan od vás',
      // Same coordinates the original stredisko data (data/strediska/penzion-rohacan.ts) carries.
      coordinates: { lat: 49.224124562755684, lng: 19.580656997120233 },
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
    gallery: [],
  },

  terminy: {
    title: 'Vyberte si termín',
    subtitle: 'Penzión Roháčan · sezóna 2027',
    duration: '5 dní',
    deadline: 'do 31.10',
    bookLabel: 'REZERVOVAŤ',
    bookNote: 'čoskoro',
    items: [
      { range: '31.05. – 04.06.2027', price: '205 €', discounted: '175 €', status: 'Voľné' },
      { range: '07.06. – 11.06.2027', price: '205 €', discounted: '175 €', status: 'Voľné' },
    ],
  },
}
