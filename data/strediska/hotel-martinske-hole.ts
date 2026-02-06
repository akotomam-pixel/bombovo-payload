import { StrediskoData } from './types'

export const hotelMartinskeHole: StrediskoData = {
  id: 'hotel-martinske-hole',
  name: 'Hotel Martinské Hole',
  headline: 'Škola v prírode - Hotel Martinské Hole',
  basePrice: 'od 200.00 €',
  iconBullets: [
    '80 lôžok',
    'trávnaté ihrisko',
    'vnútorný bazén',
    'bufet',
    'sauna (doplatok)'
  ],
  section3: {
    headline: 'V čom je stredisko hotel martinské hole tak výnimočné',
    bodyText: 'Naša tohtoročná novinka! Stredisko ktoré je vhodné pre stredne veľké skupiny. Nachádza sa 13 km od Martina v krásnom horskom prostredí so širokými možnosťami a priestorom pre rozvíjanie záujmu detí o pohyb a prírodu',
    nearbyAttractions: [
      '12,9 km kúpalisko Vrútky',
      '450 m Winter park Martinky',
      '27,2 km Sklabinský hrad',
      '22,3 km Múzeum slovenskej dediny'
    ]
  },
  programText: 'V Cestovnej kancelárii Bombovo vás čaká týždeň na ktorý vy ani vaši žiaci len tak neabudnú. Pripravili sme si pre vás unikátny program, ktorý spája mystiku, fyzickú aktivitu a cielené rozvíjanie kľúčových vlastností ako sú komunikácia, kreativita a kritické myslenie. Všetky školy v prírode sú vedené profesionálnym animačným tímom, ktorý sa postará o váš komfort a organizáciu celého týždňa.',
  detaily: {
    ubytovanie: [
      '2 až 4-lôžkové izby s WC a sprchou',
      'kapacita 80 osôb'
    ],
    vybavenieStrediska: [
      'spoločenská miestnosť',
      'veľká sála',
      'bufet, wifi',
      'ohnisko',
      'biliard',
      'trávnatá plocha',
      'premietacie plátno, dataprojektor',
      'vnútorný bazén, ktorý je možný využiť po dohode priamo na stredisku',
      'sauna za doplatok 35 eur / hodina'
    ],
    zaujimavostiVOkoli: [
      '12,9 km kúpalisko Vrútky',
      '27,2 km Sklabinský hrad',
      '450 m peši Winter park Martinky',
      '22,3 km Múzeum slovenskej dediny',
      '29 km Sklársky skanzen Valaská Belá',
      '23 km Rozhľadňa na Tankovke',
      '23,4 km Park – arborétum Turčianska Štiavnička'
    ]
  },
  dates: [
    { startDate: '13.04.2026', endDate: '17.04.2026', days: 5, price: '200.00 €', available: false },
    { startDate: '20.04.2026', endDate: '24.04.2026', days: 5, price: '200.00 €', available: false },
    { startDate: '27.04.2026', endDate: '01.05.2026', days: 5, price: '200.00 €', available: false },
    { startDate: '04.05.2026', endDate: '08.05.2026', days: 5, price: '200.00 €', available: false },
    { startDate: '11.05.2026', endDate: '15.05.2026', days: 5, price: '210.00 €', available: false },
    { startDate: '18.05.2026', endDate: '22.05.2026', days: 5, price: '210.00 €', available: false },
    { startDate: '25.05.2026', endDate: '29.05.2026', days: 5, price: '210.00 €', available: true },
    { startDate: '01.06.2026', endDate: '05.06.2026', days: 5, price: '210.00 €', available: true },
    { startDate: '08.06.2026', endDate: '12.06.2026', days: 5, price: '210.00 €', available: false },
    { startDate: '15.06.2026', endDate: '19.06.2026', days: 5, price: '210.00 €', available: false },
    { startDate: '22.06.2026', endDate: '26.06.2026', days: 5, price: '200.00 €', available: false }
  ]
}
