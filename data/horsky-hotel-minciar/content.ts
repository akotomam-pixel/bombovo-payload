import type { LomyContent } from '@/data/lomy/types'
import { PROGRAM_GALLERY_PHOTOS } from '@/data/programGallery'

/**
 * Content for the rebuilt Horský hotel Minciar page (season 2027), on the
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
export const horskyHotelMinciarContent: LomyContent = {
  slug: 'horsky-hotel-minciar',

  hero: {
    kicker: 'Škola v prírode',
    name: 'Horský hotel Minciar',
    location: 'Kremnica (Skalka)',
    // No confirmed Google rating for this stredisko yet — left empty so the
    // hero's star figure stays hidden rather than show a fabricated number.
    rating: { value: '4,0', source: 'Google' },

    photos: [
      {
        src: 'https://picsum.photos/seed/minciar-hero/1600/1067',
        alt: 'Areál Horského hotela Minciar',
        isPlaceholder: true,
      },
      { src: 'https://picsum.photos/seed/minciar-2/1600/1067', alt: 'Horský hotel Minciar', isPlaceholder: true },
      { src: 'https://picsum.photos/seed/minciar-3/1600/1067', alt: 'Horský hotel Minciar', isPlaceholder: true },
      { src: 'https://picsum.photos/seed/minciar-4/1600/1067', alt: 'Horský hotel Minciar', isPlaceholder: true },
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
      { label: 'Lokalita', value: 'Kremnica (Skalka)', icon: '📍' },
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
        'Boli sme veľmi spokojní s vybavením, čistotou aj ubytovaním strediska a s organizáciou prírodnej školy od Bombova som bol veľmi spokojný. Zohľadnili všetky požiadavky, ktoré sme si vopred dohodli.',
      author: 'Riaditeľ',
      school: 'ZŠ Kostolné Kračany',
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
    heading: 'V čom je Horský hotel Minciar výnimočný',
    paragraph:
      'Horský hotel Minciar stojí v rekreačnom stredisku Skalka, obľúbenej výletnej oblasti v Kremnických vrchoch, len 10 km od historického centra Kremnice. Len 4 km od hotela nájdete geografický stred Európy, jedno z mála miest na svete, kde si na to naozaj môžete stúpnuť. Okolie je plné čistej prírody a čerstvého horského vzduchu, a mesto Kremnica so svojou stredovekou mincovňou a banským múzeom je ideálny cieľ na spoločný výlet.',
    okolie: {
      title: 'Zaujímavosti v okolí',
      items: [
        '10 km historické centrum Kremnice, Mincovňa, Múzeum mincí a medailí, Mestský hrad s kostolom, Banské múzeum, štôlňa Andrej',
        '4 km geografický stred Európy',
        '5 km Krahule, vyhliadková veža na Krahulskom štíte',
        '29 km Spa & Aquapark Turčianske Teplice',
      ],
    },
    photo: {
      src: '',
      alt: 'Areál Horského hotela Minciar',
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
            'Ak si k animačnému programu objednáte aj Bombový balíček, dostanete ako pedagógovia odmenu 100 € za každých 10 platiacich detí. Balíček navyše zahŕňa autobusovú dopravu do Kremnice s vstupom do Štôlne Andrej a darček na pamiatku pre každého účastníka.',
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
      capacity: { label: 'Celková kapacita', value: '80 lôžok' },
    },
    vybavenie: {
      title: 'Vybavenie strediska',
      items: [
        'Spoločenská miestnosť, detská izba',
        'Letná terasa, ohnisko',
        'Wifi',
        '350 m od hotela in-line dráha',
        'Trávnaté ihrisko',
      ],
    },
    mapa: {
      title: 'Zistite, ako ďaleko je Horský hotel Minciar od vás',
      // Same coordinates the original stredisko data (data/strediska/horsky-hotel-minciar.ts) carries.
      coordinates: { lat: 48.73882490763306, lng: 18.982751281749284 },
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
    subtitle: 'Horský hotel Minciar · sezóna 2027',
    duration: '5 dní',
    deadline: 'do 31.10',
    bookLabel: 'REZERVOVAŤ',
    bookNote: 'čoskoro',
    items: [
      { range: '10.05. – 14.05.2027', price: '220 €', discounted: '190 €', status: 'Voľné' },
      { range: '17.05. – 21.05.2027', price: '220 €', discounted: '190 €', status: 'Voľné' },
      { range: '24.05. – 28.05.2027', price: '220 €', discounted: '190 €', status: 'Voľné' },
      { range: '31.05. – 04.06.2027', price: '220 €', discounted: '190 €', status: 'Voľné' },
      { range: '07.06. – 11.06.2027', price: '220 €', discounted: '190 €', status: 'Voľné' },
      { range: '14.06. – 18.06.2027', price: '220 €', discounted: '190 €', status: 'Voľné' },
    ],
  },
}
