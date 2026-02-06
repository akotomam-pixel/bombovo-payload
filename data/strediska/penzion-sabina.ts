import { StrediskoData } from './types'

export const penzionSabina: StrediskoData = {
  id: 'penzion-sabina',
  name: 'Penzión Sabina',
  headline: 'Škola v prírode - Penzión Sabina',
  basePrice: 'od 200.00 €',
  iconBullets: [
    'kapacita 42 lôžok',
    'spoločenská miestnosť',
    'detská herňa',
    'veľká lúka',
    'asfaltová plocha, ihrisko'
  ],
  section3: {
    headline: 'V čom je stredisko penzión sabina tak výnimočné',
    bodyText: 'Penzión Sabina odporúčame pre menšie skupiny.Zariadenie je plne rekonštruované a nachádza sa v čarovnom prostredí Slovenského Raja v Prešovskom kraji.',
    nearbyAttractions: [
      '12,3 km Dobšinská ľadová jaskyňa',
      '12,5 km Chmarošský viadukt',
      '13,2 km Ski Telgárt',
      '10,7 km Ranč pod Ostrou skalou'
    ]
  },
  programText: 'V Cestovnej kancelárii Bombovo vás čaká týždeň na ktorý vy ani vaši žiaci len tak neabudnú. Pripravili sme si pre vás unikátny program, ktorý spája mystiku, fyzickú aktivitu a cielené rozvíjanie kľúčových vlastností ako sú komunikácia, kreativita a kritické myslenie. Všetky školy v prírode sú vedené profesionálnym animačným tímom, ktorý sa postará o váš komfort a organizáciu celého týždňa.',
  detaily: {
    ubytovanie: [
      '2 až̌ 3-lôžkové izby s WC a sprchou',
      'kapacita 42 lôžok'
    ],
    vybavenieStrediska: [
      'spoločenská miestnosť',
      'detská herňa',
      'asfaltová plocha, detské ihrisko',
      'veľká lúka oproti penziónu',
      'BONUS pre pedagógov – 1 x hodinový vstup počas pobytu do sauny a vírivky',
      'wi-fi'
    ],
    zaujimavostiVOkoli: [
      '12,3 km Dobšinská ľadová jaskyňa',
      '12,5 km Chmarošský viadukt',
      '13,2 km Ski Telgárt',
      '23 km Aquacity Poprad',
      '10,7 km Ranč pod Ostrou skalou'
    ]
  },
  dates: [
    { startDate: '13.04.2026', endDate: '17.04.2026', days: 5, price: '200.00 €', available: false },
    { startDate: '20.04.2026', endDate: '24.04.2026', days: 5, price: '200.00 €', available: false },
    { startDate: '27.04.2026', endDate: '01.05.2026', days: 5, price: '200.00 €', available: false },
    { startDate: '04.05.2026', endDate: '08.05.2026', days: 5, price: '200.00 €', available: false },
    { startDate: '11.05.2026', endDate: '15.05.2026', days: 5, price: '210.00 €', available: false },
    { startDate: '18.05.2026', endDate: '22.05.2026', days: 5, price: '210.00 €', available: true },
    { startDate: '25.05.2026', endDate: '29.05.2026', days: 5, price: '210.00 €', available: true },
    { startDate: '01.06.2026', endDate: '05.06.2026', days: 5, price: '210.00 €', available: true },
    { startDate: '08.06.2026', endDate: '12.06.2026', days: 5, price: '210.00 €', available: true },
    { startDate: '15.06.2026', endDate: '19.06.2026', days: 5, price: '210.00 €', available: false },
    { startDate: '22.06.2026', endDate: '26.06.2026', days: 5, price: '200.00 €', available: false }
  ]
}
