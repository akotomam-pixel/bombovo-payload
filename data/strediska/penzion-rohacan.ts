import { StrediskoData } from './types'

export const penzionRohacan: StrediskoData = {
  id: 'penzion-rohacan',
  name: 'Penzión Roháčan',
  headline: 'Škola v prírode - Penzión Roháčan',
  basePrice: 'od 185.00 €',
  iconBullets: [
    'kapacita 54 lôžok',
    'vonkajšie ihrisko',
    'lanový park',
    '2x altánok',
    'bufet'
  ],
  section3: {
    headline: 'V čom je stredisko penzión roháčan tak výnimočné?',
    bodyText: 'Penzión Roháčan sa nachádza v lone prekrásnej podroháčskej prírody na začiatku obce Huty. Okolie sa vyznačuje najmä tichým prostredím skvelou polohou na rôzne turistické výlety počas celého roka.',
    nearbyAttractions: [
      '3,1 km Ráztocká dolina, vodopád, Vodné Mlyny Oblazy',
      '4,6 km Kvačianska dolina',
      '7,1 km Poľovníkov vodopád',
      '5 km Zuberec'
    ]
  },
  programText: 'V Cestovnej kancelárii Bombovo vás čaká týždeň na ktorý vy ani vaši žiaci len tak neabudnú. Pripravili sme si pre vás unikátny program, ktorý spája mystiku, fyzickú aktivitu a cielené rozvíjanie kľúčových vlastností ako sú komunikácia, kreativita a kritické myslenie. Všetky školy v prírode sú vedené profesionálnym animačným tímom, ktorý sa postará o váš komfort a organizáciu celého týždňa.',
  detaily: {
    ubytovanie: [
      '2 až 5-lôžkové izby s WC a sprchou',
      'kapacita 54 lôžok'
    ],
    vybavenieStrediska: [
      'spoločenská miestnosť',
      'vonkajšia hracia plocha',
      '2x altánok',
      'vonkajšie ihrisko',
      'bufet',
      'lanový park /vstup po dohode na stredisku'
    ],
    zaujimavostiVOkoli: [
      '3,1 km Ráztocká dolina , vodopád, Vodné Mlyny Oblazy',
      '8,2 km Brestovská Jaskyňa',
      '4,6 km Kvačianska dolina',
      '7,1 km Polovníkov vodopád',
      '12,3 km Roháčske plesá',
      '12,7 km Liptovský hrad'
    ]
  },
  dates: [
    { startDate: '13.04.2026', endDate: '17.04.2026', days: 5, price: '185.00 €', available: false },
    { startDate: '20.04.2026', endDate: '24.04.2026', days: 5, price: '185.00 €', available: false },
    { startDate: '27.04.2026', endDate: '01.05.2026', days: 5, price: '185.00 €', available: false },
    { startDate: '04.05.2026', endDate: '08.05.2026', days: 5, price: '185.00 €', available: false },
    { startDate: '11.05.2026', endDate: '15.05.2026', days: 5, price: '195.00 €', available: false },
    { startDate: '18.05.2026', endDate: '22.05.2026', days: 5, price: '195.00 €', available: false },
    { startDate: '25.05.2026', endDate: '29.05.2026', days: 5, price: '195.00 €', available: false },
    { startDate: '01.06.2026', endDate: '05.06.2026', days: 5, price: '195.00 €', available: true },
    { startDate: '08.06.2026', endDate: '12.06.2026', days: 5, price: '195.00 €', available: false },
    { startDate: '15.06.2026', endDate: '19.06.2026', days: 5, price: '195.00 €', available: true },
    { startDate: '22.06.2026', endDate: '26.06.2026', days: 5, price: '185.00 €', available: false }
  ]
}
