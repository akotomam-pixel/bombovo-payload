import { StrediskoData } from './types'

export const horskyHotelMinciar: StrediskoData = {
  id: 'horsky-hotel-minciar',
  name: 'Horský Hotel Minciar',
  headline: 'Škola v prírode - Horský Hotel Minciar',
  basePrice: 'od 195.00 €',
  iconBullets: [
    'spoločenská miestnosŤ',
    'Sauna',
    'Letná terasa',
    'trávnaté ihrisko',
    'In line dráha'
  ],
  section3: {
    headline: 'V čom je stredisko horský hotel minciar tak výnimočné',
    bodyText: 'Hotel Minciar je našou dlhoročnou overenou klasikou, ktorá patrí medzi obľúbené strediská. Nachádza sa v srdci Kremnických hôr 10 km od mesta Kremnica a 4 km od geografického stredu Európy. Stredisko je vhodné pre stredne veľké skupiny.',
    nearbyAttractions: [
      '350 m od Hotela In line dráha',
      '4 km geografický stred Európy',
      '5 km Vyhliadková veža',
      '10 km historické centrum Kremnice'
    ]
  },
  programText: 'V Cestovnej kancelárii Bombovo vás čaká týždeň na ktorý vy ani vaši žiaci len tak neabudnú. Pripravili sme si pre vás unikátny program, ktorý spája mystiku, fyzickú aktivitu a cielené rozvíjanie kľúčových vlastností ako sú komunikácia, kreativita a kritické myslenie. Všetky školy v prírode sú vedené profesionálnym animačným tímom, ktorý sa postará o váš komfort a organizáciu celého týždňa.',
  detaily: {
    ubytovanie: [
      'hlavná budova 2 až 3-lôžkové izby s WC a sprchou',
      'kapacita 80 lôžok'
    ],
    vybavenieStrediska: [
      'spoločenská miestnosť, detská izba',
      'sauna, letná terasa, ohnisko',
      'wifi',
      '350 m od hotela in-line dráha',
      'trávnaté ihrisko'
    ],
    zaujimavostiVOkoli: [
      '10 km historické centrum Kremnice: Mincovňa, Múzeum mincí a medailí, Mestký hrad s kostolom, Banské múzeum Andrej stôlňa',
      '4 km geografický stred Európy',
      '5 km Krahule – vyhliadková veža na Krahulskom štíte',
      '29 km SPA & AQUAPARK Turčianske Teplice'
    ]
  },
  dates: [
    { startDate: '13.04.2026', endDate: '17.04.2026', days: 5, price: '195.00 €', available: false },
    { startDate: '20.04.2026', endDate: '24.04.2026', days: 5, price: '195.00 €', available: false },
    { startDate: '27.04.2026', endDate: '01.05.2026', days: 5, price: '195.00 €', available: false },
    { startDate: '04.05.2026', endDate: '08.05.2026', days: 5, price: '195.00 €', available: false },
    { startDate: '11.05.2026', endDate: '15.05.2026', days: 5, price: '205.00 €', available: false },
    { startDate: '18.05.2026', endDate: '22.05.2026', days: 5, price: '205.00 €', available: true },
    { startDate: '25.05.2026', endDate: '29.05.2026', days: 5, price: '205.00 €', available: false },
    { startDate: '01.06.2026', endDate: '05.06.2026', days: 5, price: '205.00 €', available: false },
    { startDate: '08.06.2026', endDate: '12.06.2026', days: 5, price: '205.00 €', available: false },
    { startDate: '15.06.2026', endDate: '19.06.2026', days: 5, price: '205.00 €', available: false },
    { startDate: '22.06.2026', endDate: '26.06.2026', days: 5, price: '195.00 €', available: false }
  ]
}
