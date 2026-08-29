import type { LomyContent } from '@/data/lomy/types'
import { PROGRAM_GALLERY_PHOTOS } from '@/data/programGallery'

/**
 * Content for the rebuilt Hotel Martinské Hole page (season 2027), on the
 * same architecture as `data/lomy/content.ts`. Group A of the six-stredisko
 * rebuild: this slug already exists in Payload (real hero/section2 photos
 * are already uploaded there), so `hero.photos` and `vynimocny.photo` below
 * are just the static fallback used if Payload is unreachable, same pattern
 * Lomy's own file uses.
 *
 * Facts are exactly as given in the rebuild brief. Nothing here is invented:
 * where a fact was not given (Google rating, a portrait 9:16 shot), the field
 * is left empty/marked rather than filled with a guess.
 */
export const hotelMartinskeHoleContent: LomyContent = {
  slug: 'hotel-martinske-hole',

  hero: {
    kicker: 'Škola v prírode',
    name: 'Hotel Martinské Hole',
    location: 'Martinky, Lúčanská Malá Fatra',
    rating: { value: '4,5', source: 'Google' },

    photos: [
      {
        src: 'https://picsum.photos/seed/martinky-hero/1600/1067',
        alt: 'Areál Hotela Martinské Hole',
        isPlaceholder: true,
      },
      { src: 'https://picsum.photos/seed/martinky-2/1600/1067', alt: 'Hotel Martinské Hole', isPlaceholder: true },
      { src: 'https://picsum.photos/seed/martinky-3/1600/1067', alt: 'Hotel Martinské Hole', isPlaceholder: true },
      { src: 'https://picsum.photos/seed/martinky-4/1600/1067', alt: 'Hotel Martinské Hole', isPlaceholder: true },
    ],

    // 225 € základná cena − 30 € zľava = 195 €.
    price: {
      prefix: 'od',
      amount: '225 €',
      discounted: '195 €',
      unit: '/ 5 dní',
      note: 'bez animačného programu',
    },

    facts: [
      { label: 'Lokalita', value: 'Martinky (Lúčanská Malá Fatra)', icon: '📍' },
      { label: 'Kapacita', value: '80 lôžok', icon: '🛏️' },
      { label: 'Dostupné termíny', value: 'máj – jún', icon: '📅' },
    ],

    proof: [
      { label: 'Garancia vrátenia peňazí', icon: '/images/skoly-v-prirode-icon-1.png' },
      { label: 'Promptné jednanie a serióznosť', icon: '/images/skoly-v-prirode-icon-2.png.png' },
      { label: '50 000+ detí odanimovaných', icon: '/images/skoly-v-prirode-icon-3.png.png' },
    ],

    review: {
      quote:
        'Stredisko poskytovalo nepretržitý prísun čaju, strava bola výborná a ubytovanie čisté a pekne zariadené. Animátori sa deťom venovali naozaj dokonale, všetko prebiehalo bez problémov a program bol plný akcie, čo si žiaci užili naplno. Deti boli nadšené.',
      author: 'Mgr. Zuzana Svitková',
      school: 'ZŠ Mariánska, Prievidza',
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
    heading: 'V čom je Hotel Martinské Hole výnimočný',
    paragraph:
      'Hotel Martinské Hole stojí priamo v obľúbenom horskom stredisku Martinky, v hrebeňoch Lúčanskej Malej Fatry, ktoré patria medzi najkrajšie a zároveň najmenej preplnené časti pohoria. Deti majú vlastný vnútorný bazén a saunu priamo v hoteli, a keď sa chcú hýbať vonku, stačí pár krokov k lyžiarskemu a turistickému areálu Martiniek. Hory a čerstvý vzduch tu nie sú doplnok programu, sú jeho hlavnou náplňou.',
    okolie: {
      title: 'Zaujímavosti v okolí',
      items: [
        '12,9 km kúpalisko Vrútky',
        '27,2 km Sklabinský hrad',
        '450 m peši Winter park Martinky',
        '22,3 km Múzeum slovenskej dediny',
        '23 km Rozhľadňa na Tankovke',
        '23,4 km Park, arborétum Turčianska Štiavnička',
      ],
    },
    photo: {
      src: '',
      alt: 'Areál Hotela Martinské Hole',
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
            'Ak si k animačnému programu objednáte aj Bombový balíček, dostanete ako pedagógovia odmenu 100 € za každých 10 platiacich detí. Balíček navyše zahŕňa lukostreľbu priamo na stredisku a darček na pamiatku pre každého účastníka.',
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
      capacity: { label: 'Celková kapacita', value: '80 lôžok' },
    },
    vybavenie: {
      title: 'Vybavenie strediska',
      items: [
        'Spoločenská miestnosť',
        'Veľká sála',
        'Biliard',
        'Stolný tenis',
        'Trávnatá plocha',
        'Bufet',
        'Wifi',
        'Ohnisko',
        'Premietacie plátno + dataprojektor',
        'Vnútorný bazén, možné využiť po dohode priamo na stredisku',
        'Sauna za doplatok 35 €/hodina',
      ],
    },
    mapa: {
      title: 'Zistite, ako ďaleko je Hotel Martinské Hole od vás',
      // Same coordinates the original stredisko data (data/strediska/hotel-martinske-hole.ts) carries.
      coordinates: { lat: 49.09185965785857, lng: 18.83527330505309 },
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
    subtitle: 'Hotel Martinské Hole · sezóna 2027',
    duration: '5 dní',
    deadline: 'do 31.10',
    bookLabel: 'REZERVOVAŤ',
    bookNote: 'čoskoro',
    items: [
      { range: '17.05. – 21.05.2027', price: '225 €', discounted: '195 €', status: 'Voľné' },
      { range: '24.05. – 28.05.2027', price: '225 €', discounted: '195 €', status: 'Rezervované' },
      { range: '31.05. – 04.06.2027', price: '225 €', discounted: '195 €', status: 'Rezervované' },
      { range: '07.06. – 11.06.2027', price: '225 €', discounted: '195 €', status: 'Rezervované' },
      { range: '14.06. – 18.06.2027', price: '225 €', discounted: '195 €', status: 'Voľné' },
    ],
  },
}
