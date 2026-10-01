import { CampDetailData } from './types'
import { lomyStrediskoGallery, photo } from './lomyPhotos'

export const halloweenNaLomochData: CampDetailData = {
  id: 'halloween-na-lomoch',
  name: 'Halloween na Lomoch',
  headline: 'Pre lovcov tajomstiev –',
  headlineHighlight: 'Halloween na Lomoch',
  location: 'Horský hotel Lomy',
  age: 'Pre deti vo veku 8-14 rokov',
  price: '269 €',

  // TEMP gallery: Trhlina hero first, then photos borrowed from other Lomy
  // camps. Swap for real Halloween photos once they exist.
  heroGallery: [
    photo('RRX2fWCU0K6iHTB0VfPxtUHA1uNlYEXZres8xo4qVhWiSfyI'), // Trhlina hero
    photo('RRX2fWCU0K6iqKpT3U0idIMDERPbns97pmCHSgFUaGKBcJNO'),
    photo('RRX2fWCU0K6iwwj4QqVfJpXGd2xoH1a6Q4q9BiEvA3nz5reY'), // Neverfort
    photo('RRX2fWCU0K6iycUJIr90UFGMVIQXCtPJfrsSj9HoK6uZbE72'), // Expecto
    photo('RRX2fWCU0K6ivNUmEp2z1EuUBW6Z3I0yMnVYH9mSwkaGxAPX'),
    photo('RRX2fWCU0K6i6BE5IEJuBZoapjeNuknwmr3tq68VyUXxRCQH'),
    photo('RRX2fWCU0K6i3dNgBeKsIOvujMAXC4Jhlp0Z6WD8RGQUFoyP'),
    photo('RRX2fWCU0K6iOzt9HEsd0JixV5DnuQLfca9WE71PG3RyzAoF'),
    photo('RRX2fWCU0K6iDuQetVOFKsYldxEA4jZ25OmaprGuv6tkJ3Qf'), // Woodkemp
    photo('RRX2fWCU0K6iwb6uA2VfJpXGd2xoH1a6Q4q9BiEvA3nz5reY'),
  ],

  bulletPoints: [
    'Jeseň v Bombove bude tentokrát trochu tajomnejšia! Čaká ťa dobrodružstvo plné jesennej atmosféry, Halloweenskych výziev, pohybových hier, tvorenia a záhad, ktoré budeme musieť spoločne rozlúštiť.',
  ],

  section2: {
    ratings: {
      kreativita: 7,
      mystika: 10,
      sebarozvoj: 4,
      pohyb: 7,
      kritickeMyslenie: 7,
    },
    headline: 'O čom je Halloween na Lomoch?',
    description: [
      'Jeseň v Bombove bude tentokrát trochu tajomnejšia! Čaká ťa dobrodružstvo plné jesennej atmosféry, Halloweenskych výziev, pohybových hier, tvorenia a záhad, ktoré budeme musieť spoločne rozlúštiť. Vyrobíme si vlastné tekvice a lampášiky, vydáme sa po stopách tajomstva, ktoré ukrývajú Lomy a užijeme si aj poriadnu dávku zábavy s kamarátmi.',
      'Budeš potrebovať odvahu, šikovnosť, tímového ducha a možno aj trochu fantázie. Čo sa vlastne na Lomoch deje? To zistíš až vtedy, keď sa k nám pridáš!',
    ],
    buttonText: 'Pozri Dostupné Termíny',
  },

  // TODO: "Ako to prežíva dieťa" text comes later (written separately).
  section3: {
    headline: 'Ako Halloween na Lomoch prežíva dieťa?',
    text: [],
    reviews: [
      {
        text: 'Náš syn je už 7x veľmi spokojný a kamarátstva, ktoré si v tábore našiel, trvajú aj po jeho skončení. Budúce leto už pôjdeme jedine s vami. Máme odskúšaných viacero táborov, ale vy ste jediní, čo nás ani raz nesklamali.',
        author: 'Andrea D. Mamička dieťaťa',
      },
      {
        text: 'Ďakujeme za zážitky. Deti boli nadšené. Bol to ich prvý tábor, čo som sa bála, ale dcérka povedala, že si tam našla druhú rodinu 😁😍',
        author: 'Alena G. Mamička dieťaťa',
      },
      {
        text: 'Dcérke sa v tábore veľmi páčilo. Aktivity, prístup animátorov bolo na jedničku, o rok sa chce vrátiť ku vám do tábora, už odpočítava dni. Ďakujeme.',
        author: 'Rodič dieťaťa',
      },
    ],
  },

  section4: {
    details: {
      vTomtoTaboreZazites: [
        '**Vyrezávanie tekvíc** – vytvoríš si vlastnú strašidelnú tekvicu, ktorá rozžiari náš Halloween na Lomoch',
        '**Halloween party** – poriadna halloweenska párty plná hudby, zábavy a tancovania. A nezabudni si z domu priniesť svoj najlepší Halloweensky kostým!',
        '**Čarodejnícky súd** – tajomná detektívna hra, v ktorej budeš musieť zapojiť svoju pozornosť, dedukciu a odhaliť, komu sa nedá veriť',
        '**Magický elixír** – vydáš sa na cestu plnú magických úloh, pri ktorých budeš postupne získavať všetko potrebné na vytvorenie vlastného čarovného elixíru',
        '**Premeň sa na monštrum** – preveríš svoju rýchlosť, pozornosť a schopnosť reagovať na nečakané halloweenske výzvy',
        '**Laboratórna výzva** – vytvoríš svoje vlastné monštrum a vdýchneš mu život, príbeh aj poriadne strašidelnú podobu',
        '**Kto je čarodejník?** – odhalíš tajného čarodejníka, ktorý nenápadne vedie ostatných svojimi pohybmi bez toho, aby ho prezradil',
        '**Halloween Escape Room** – na záver ťa čaká tajomná úniková hra plná hádaniek, indícií a halloweenskych úloh, v ktorej budeš musieť spolu s tímom zapojiť všetok svoj dôvtip a dostať sa von skôr, než vyprší čas!',
        'A mnoho ďalších ako: **Halloweenový Hot Seat, Netopierie štafetové kreslenie, Halloweenové Bingo, Nechaj sa zabaliť!**',
      ],
      vCene: [
        'Program podľa ponuky',
        'Odborná a zdravotná starostlivosť',
        '4 x ubytovanie',
        '4 x plná penzia 5 x denne, pitný režim',
        'Foto z tábora na facebooku',
        'Poistenie voči úpadku CK, DPH',
        'Táborové tričko',
      ],
      lokalita: 'Tábor sa nachádza v Horskom hoteli Lomy v Lomskej doline pri obci Horná Ves (okres Prievidza), v srdci pohoria Vtáčnik.',
      doprava: 'Individuálna',
      ubytovanie: [
        'Hotelové izby pre 4-5 detí s vlastným sociálnym zariadením',
        'Drevené chatky pre 7 detí s vlastným sociálnym zariadením',
      ],
      zaPriplatok: [
        'Komplexné cestovné poistenie ECP 4,50 €/pobyt (storno, prerušenie cesty, úraz, zodpovednosť za škodu)',
        'Dieťa si môže na tábore zakúpiť reklamné predmety Bombovo',
      ],
    },
    hasStredisko: true,
    strediskoName: 'Horský hotel Lomy',
    strediskoDescription: 'Horský hotel Lomy sa nachádza na západnom Slovensku pri Partizánskom. Je obklopený nádhernou prírodou a ponúka deťom skutočnú zábavu pod otvoreným nebom. Každé dieťa si Lomy zamiluje hneď po prvom dni.',
    strediskoGallery: lomyStrediskoGallery,
    mapCoordinates: {
      lat: 48.5806195783322,
      lng: 18.567247,
    },
  },

  section5: {
    dates: [
      {
        // Profis: "HALLOWEEN na Lomoch" (id_Zajezd 146), id_Termin 1125
        registrationId: 1125,
        profisTerminId: 1125,
        start: '28.10.2026',
        end: '01.11.2026',
        days: 5,
        originalPrice: '319.00 €',
        discountedPrice: '269.00 €',
      },
    ],
  },
}
