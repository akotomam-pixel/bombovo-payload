import { CampDetailData } from './types'

export const expectoData: CampDetailData = {
  id: 'expecto',
  name: 'Expecto',
  headline: 'Fantastický tábor kúziel –',
  headlineHighlight: 'Expecto',
  location: 'Horský hotel Lomy',
  age: 'Pre deti vo veku 10-16 rokov',
  price: '349 €',
  
  bulletPoints: [
    'Ponor sa do fantastického sveta mágie a zaži tak príbeh čarodejníka na vlastnej koži. Staň sa majstrom v čarodejníckych dueloch, spoznávaj magické tvory a odhaľuj rôzne tajomstvá. Vstúp s nami do sveta kúziel a buď súčasťou dobrodružstva ktoré len tak nezažiješ!',
  ],
  
  section2: {
    ratings: {
      kreativita: 8,
      mystika: 10,
      sebarozvoj: 2,
      pohyb: 6,
      kritickeMyslenie: 6,
    },
    headline: 'O čom je tábor Expecto?',
    description: [
      'Fantastický tábor kúziel vtiahne deti do sveta mágie, fantázie a dobrodružstva inšpirovaného čarodejníckymi príbehmi. Deti sa nestávajú len pozorovateľmi deja, ale jeho aktívnymi tvorcami. Počas týždňa si vyrábajú vlastné čarovné prútiky, miešajú lektvary, riešia magické výzvy a objavujú zákutia fantastického sveta, v ktorom má každý svoju rolu.',
      'Program prirodzene rozvíja fantáziu, kreativitu a schopnosť spolupracovať. Na základe dotazníku budeš rozdelený do fakulty v čarodejníckej škole. Vyrobíš si lampióny, čarovné prútiky namiešaš si svoj vlastný lektvar a zahráš si Metlobalový meziškolský turnaj. Na tábore nebude chýbať ani netradičný výlet plavba na pltiach po Váhu.',
    ],
    buttonText: 'Pozri Dostupné Termíny',
  },
  
  section3: {
    headline: 'Ako Expecto prežíva dieťa?',
    text: [
      'Z pohľadu dieťaťa je tábor veľkým magickým dobrodružstvom. Má pocit, že patrí do sveta, kde je dôležité, odvážne a potrebné. Vžíva sa do role čarodejníka či čarodejnice, objavuje kúzla, mieša lektvary a spolu s kamarátmi prekonáva nástrahy fantastickej krajiny.',
      'Zažíva napätie, radosť z úspechu aj silu tímu, ktorý drží pokope. Odchádza s pocitom, že bolo súčasťou príbehu, v ktorom malo svoje miesto.',
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
        'Na základe dotazníku budeš zadelený do fakúlt v čarodejníckej škole',
        'Vyrobíš si lampióny, čarovné prútiky',
        'Namiešaš elixíry a lektvary',
        'Budeš mať hodiny Kúziel, Zaklínadiel a Lúštenia šifier',
        'Naučíš sa základy metlobalu a zahráš si Meltobalový medziškolský turnaj',
        'Vyveštíš si z kávy a napíšeš tajnú neviditeľnú správu',
        'Pôjdeš na netradičný výlet – budeme sa plaviť na pltiach po Váhu',
        'Opekačka, diskotéky',
        'Pohodička v bazéne',
        'Zúčastníš sa Čarodejníckeho turnaja',
        'Prejdeš Labyrintom aj Šikmou uličkou',
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
      lokalita: 'Tábor sa nachádza v Horskom hoteli Lomy v Lomskej doline pri obci Horná Ves (okres Prievidza), v srdci pohoria Vtáčnik.',
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
    strediskoName: 'Horský hotel Lomy',
    strediskoDescription: 'Horský hotel Lomy je obklopený nádhernou prírodou. Ponúka deťom skutočnú zábavu pod otvoreným nebom a každé dieťa si Lomy zamiluje hneď po prvom dni.',
    mapCoordinates: {
      lat: 48.5806195783322,
      lng: 18.567247,
    },
  },
  
  section5: {
    dates: [
      {
        registrationId: 10,
        start: '12.07.2026',
        end: '18.07.2026',
        days: 7,
        originalPrice: '379.00 €',
        discountedPrice: '349.00 €',
      },
    ],
  },
}
