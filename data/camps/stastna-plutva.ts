import { CampDetailData } from './types'

export const stastnaPlutvaData: CampDetailData = {
  id: 'stastna-plutva',
  name: 'Šťastná plutva',
  headline: 'Podmorské dobrodružstvo pre najmenších –',
  headlineHighlight: 'Šťastná plutva',
  location: 'Hotel Martinské Hole',
  age: 'Pre deti vo veku 6-10 rokov',
  price: '349 €',
  
  bulletPoints: [
    'Podmorské dobrodružstvo pre najmenších, ktoré prináša prvé kroky k samostatnosti zabalené do veľkého príbehu. Deti vstúpia do sveta Nema a Dori, trávia veľa času v bazéne a pri vode a popri tom objavujú nové postavy a odhaľujú príbeh.',
  ],
  
  section2: {
    ratings: {
      kreativita: 8,
      mystika: 10,
      sebarozvoj: 6,
      pohyb: 6,
      kritickeMyslenie: 3,
    },
    headline: 'O čom je tábor Šťastná plutva?',
    description: [
      'Šťastná plutva nie je obyčajný tábor. Je to bezpečné a láskavé miesto, kde sa aj tie najmenšie deti cítia vypočuté, prijaté a šťastné. V prostredí plnom fantázie a hry sa prirodzene rozvíja ich kreativita, spolupráca a odvaha skúšať nové veci. Deti sa stávajú súčasťou príbehu Nema a Dory, v ktorom objavujú podmorský svet, tvoria, hrajú sa a postupne prekonávajú malé výzvy, ktoré im pomáhajú rásť.',
      'Počas týždňa sa učia zvládať strach z tmy, neznámeho či odlúčenia od rodičov citlivo, nenútene a s podporou animátorov. Každý deň lúštia zašifrované príbehy, preveria si zručnosti v kreatívnych dielničkách na ktorých si vytvoria krabičku, šperkovničku alebo akvárium a fotorámik.',
    ],
    buttonText: 'Pozri Dostupné Termíny',
  },
  
  section3: {
    headline: 'Ako Šťastnú plutvu prežíva dieťa?',
    text: [
      'Z pohľadu dieťaťa je Šťastná plutva veľkým podmorským dobrodružstvom plným hier, smiechu a objavovania. Má pocit, že je dôležitou súčasťou príbehu, kde sa môže tešiť z úspechov a zároveň vie, že pri menších nezdaroch má vždy podporu.',
      'Postupne si buduje sebavedomie, učí sa spolupracovať s ostatnými a odnáša si pocit, že niekam patrí. Domov odchádza s úsmevom, novými kamarátmi a spomienkami na týždeň, ktorý bol preňho výnimočný.',
    ],
    reviews: [
      {
        text: '[THE REVIEW WILL BE PLACED HERE. I WILL WRITE THIS LONGER JUST TO SEE HOW BIGGER IT WOULD LOOK ON THE DESIGN WHEN THE REVIEW WOULD BE LONGER SO PUT EXACTLY THIS TEXT INSIDE OF THERE]',
        author: 'Mamička Dieťaťa',
      },
      {
        text: '[THE REVIEW WILL BE PLACED HERE. I WILL WRITE THIS LONGER JUST TO SEE HOW BIGGER IT WOULD LOOK ON THE DESIGN WHEN THE REVIEW WOULD BE LONGER SO PUT EXACTLY THIS TEXT INSIDE OF THERE]',
        author: 'Mamička Dieťaťa',
      },
      {
        text: '[THE REVIEW WILL BE PLACED HERE. I WILL WRITE THIS LONGER JUST TO SEE HOW BIGGER IT WOULD LOOK ON THE DESIGN WHEN THE REVIEW WOULD BE LONGER SO PUT EXACTLY THIS TEXT INSIDE OF THERE]',
        author: 'Mamička Dieťaťa',
      },
    ],
  },
  
  section4: {
    details: {
      vTomtoTaboreZazites: [
        'Prežiješ mystický príbeh o Nemovi a Dory a ich kamarátoch',
        'Budeš lúštiť zašifrované príbehy',
        'Naučíš sa Desatoro šťastnej plutvy',
        'Zručnosť preveríš v kreatívnych dielničkách: namaľuješ si kameň, vytvoríš si krabičku alebo šprekovničku, akvárium a rybičky, ďalej vyrobíš vlajku aj fotorámik',
        'Zažiješ celotáborové hry, opekačku',
        'Vytancuješ sa na minidisco',
        'Pôjdeš na výlet do Tarzánie v Hrabove',
        'Všetko, čo vytvoríme si môžeme so sebou zobrať domov ako inšpiráciu alebo darček',
        'V prípade nepriaznivých okolností môže nastať zmena programu',
      ],
      vCene: [
        'Program podľa ponuky',
        'Odborná a zdravotná starostlivosť',
        '6 x ubytovanie',
        '6 x plná penzia 5 x denne, pitný režim',
        'Foto z tábora na facebooku',
        'Poistenie voči úpadku CK, DPH',
        'Táborové tričko',
        'Výlet',
        'Vstup do Bazéna',
      ],
      lokalita: 'Tábor sa nachádza v Hoteli Martinské Hole v rekreačnej oblasti Martinky pri meste Martin, v srdci Lúčanskej Malej Fatry.',
      doprava: 'Individuálna',
      ubytovanie: [
        'Hotelové izby pre 4-5 detí, väčšinou s vlastnou kúpeľňou',
        'Drevené chatky pre 7 detí s vlastným sociálnym zariadením',
      ],
      zaPriplatok: [
        'Komplexné cestovné poistenie ECP 4,50 €/pobyt (storno, prerušenie cesty, úraz, zodpovednosť za škodu)',
        'Dieťa si môže na tábore zakúpiť reklamné predmety Bombovo',
      ],
    },
    hasStredisko: true,
    strediskoName: 'Hotel Martinské Hole',
    strediskoDescription: 'Hotel Martinské Hole je obklopený čistým horským vzduchom a nádhernou prírodou s výhľadmi až na Tatry. Deti tu zažijú skutočné detstvo plné pohybu, hier a horských zážitkov pod otvoreným nebom.',
    mapCoordinates: {
      lat: 49.09176129713797,
      lng: 18.835262576217275,
    },
  },
  
  section5: {
    dates: [
      {
        registrationId: 22,
        start: '09.08.2026',
        end: '15.08.2026',
        days: 7,
        originalPrice: '379.00 €',
        discountedPrice: '349.00 €',
      },
    ],
  },
}
