import { CampDetailData } from './types'
import { lomyStrediskoGallery, photo } from './lomyPhotos'

export const festHalloweenFestData: CampDetailData = {
  id: 'fest-halloween-fest',
  name: 'Fest Halloween Fest',
  headline: 'Tínedžerský Tábor –',
  headlineHighlight: 'Fest Halloween Fest',
  location: 'Horský hotel Lomy',
  age: 'Pre deti vo veku 13-17 rokov',
  price: '269 €',

  // TEMP gallery: borrowed from Fest animátor fest. Swap for real Halloween
  // photos once they exist.
  heroGallery: [
    photo('RRX2fWCU0K6iQ0yQxXJg0kLrU3VqzYvm9PIOsjHh1ZWTAdfM'), // Fest hero
    photo('RRX2fWCU0K6iREyAK7CU0K6iwSfNPA5pgtaHYv7MGOD4qFkb'),
    photo('RRX2fWCU0K6igQlMfUy14v2IiJQ7MySfXUkWq98mbtudsrCe'),
    photo('RRX2fWCU0K6iIIgzA4qKxpszVUtLvjyYobHcrfmZCaiwEWTI'),
    photo('RRX2fWCU0K6iCxx6P4Qv8WQ3Tu5fdMUOHZ9yabrqilX1Jz4t'),
    photo('RRX2fWCU0K6in8dxvbZHDjQ5z4bWv2wtBnGAIs9KMagNoX8J'),
    photo('RRX2fWCU0K6iznjkSHN7EYnGO3sKIbaUou7qMr0gJWNXxZeT'),
    photo('RRX2fWCU0K6iy4uxgQ0UFGMVIQXCtPJfrsSj9HoK6uZbE72v'),
    photo('RRX2fWCU0K6iCcOLdQv8WQ3Tu5fdMUOHZ9yabrqilX1Jz4tS'),
    photo('RRX2fWCU0K6iMkkFDYuSOqRaug4pPmMsEdVZlT3fDI68zWrn'),
  ],

  bulletPoints: [
    'Fest Halloween Fest prichádza do Bombova po prvýkrát v histórii! Priprav sa na nezabudnuteľné dni plné halloweenskej atmosféry, nečakaných zvratov a zážitkov, ktoré posunú klasický FEST na úplne inú úroveň.',
  ],

  section2: {
    // Fest animátor fest ratings, with mystika raised for the Halloween theme
    ratings: {
      kreativita: 6.5,
      mystika: 7,
      sebarozvoj: 10,
      pohyb: 7,
      kritickeMyslenie: 6,
    },
    headline: 'O čom je Fest Halloween Fest?',
    description: [
      'Fest Halloween Fest prichádza do Bombova po prvýkrát v histórii! Priprav sa na nezabudnuteľné dni plné halloweenskej atmosféry, nečakaných zvratov a zážitkov, ktoré posunú klasický FEST na úplne inú úroveň. Čo všetko sme si pre teba pripravili? To ti zatiaľ neprezradíme!',
      'Jedno je však isté – túto premiéru si rozhodne nechceš nechať ujsť. Príď a odhaľ všetky tajomstvá Fest Halloween Festu na vlastnej koži!',
    ],
    buttonText: 'Pozri Dostupné Termíny',
  },

  section3: {
    headline: 'Ako Fest prežíva dieťa?',
    text: [
      'Na Feste mám konečne priestor rozhodovať sa, zapojiť sa po svojom a nemať pocit, že sa musím na niečo hrať. Počas piatich dní od 28. októbra do 1. novembra v Horskom hoteli Lomy nie je každý krok naplánovaný za mňa. Program má tempo, ale stále zostáva dosť slobody vybrať si, do čoho sa pustím a kde budem užitočný. Pri vyrezávaní tekvíc, tímových súbojoch alebo hre Kto klame? sa rýchlo ukáže, kto premýšľa dopredu, kto vie strhnúť ostatných a kto drží skupinu pokope. Nemusím byť najhlasnejší, aby som do partie patril a aby môj názor niečo znamenal.',
      'Najviac si z Festu neodnášam konkrétnu hru, ale ľudí, s ktorými som ju zažil. Prvá halloweenska edícia nadväzuje na komunitu, ktorá okolo tínedžerského Festu rastie už viac ako 15 rokov, a dáva jej nový jesenný príbeh. Čaká nás halloweenska párty v kostýmoch, Casino: The Night of Risk, Horror Photo Challenge, The Impossible Quiz aj tajné misie v hre Nenechaj sa chytiť. Raz riskujeme, inokedy blafujeme, tvoríme alebo bojujeme za tím, takže sa prirodzene spoznáme aj mimo bežných rolí zo školy. Z náhodných spolubývajúcich a spoluhráčov sa počas piatich dní stane pevná partia. Kontakty nekončia odchodom domov, často pokračujú v správach, stretnutiach a ďalších spoločných Festoch.',
    ],
    reviews: [
      {
        text: 'Fest Animátor Fest je najlepší tábor na celom svete. Je to tábor kde sa ľudia spoznávajú, zabávajú a nepotrebujú k tomu žiadne moderné vecičky. Už som na Feste 2-krát a určite som ešte neskončil. Za týchto 9 dní som veľa toho pochopil a som za to vďačný všetkým ľuďom ktorý boli so mnou na Feste. A preto vám patrí veľké ĎAKUJEM!!!',
        author: 'Branislav B.',
      },
      {
        text: 'Fest animátorfest, syn neskutočne nadšený, super animátori, srandisti, vedeli sa baviť a zároveň mali u detí autoritu. Veľmi dobre jedlo, zábava, výber hier, veľa smiechu. Tak nadšený, že chce o rok ísť Znova. Odporúčame.',
        author: 'Martina Bienská Šimová',
      },
      {
        text: 'Fest je proste najlepší. Mojich najkrajší 9 dní v živote prežitých s najlepšími ľudmi. Určite tam prídeme nabudúci rok zas a dúfam zme sa všetci stretneme. A za týchto 9 dní chcem všetkým povedať OBROVSKÉ ĎAKUJEM buď animátorom alebo kamarátom. Najlepšie aktivity, super zábava.',
        author: 'Nina M.',
      },
    ],
  },

  section4: {
    details: {
      vTomtoTaboreZazites: [
        '**Vyrezávanie tekvíc** – vytvoríš si vlastnú strašidelnú tekvicu a ukážeš, čo sa v tebe skrýva.',
        '**Halloween Party** – poriadna halloweenová párty plná hudby, tanca, zábavy a bláznivej atmosféry. Nezabudni si priniesť svoj najlepší Halloween kostým, pretože tento večer bude patriť práve jemu!',
        '**Casino: The Night of Risk** – vstúp do sveta, kde nestačí mať šťastie. Budeš musieť riskovať, strategicky premýšľať a správne sa rozhodovať, aby si svoj tím dostal čo najďalej.',
        '**Kto klame?** – psychologická hra plná blafovania, pozornosti a poriadnej dávky nedôvery.',
        '**Horror Photo Challenge** – vezmi do rúk fotoaparát a splň sériu bláznivých, strašidelných aj úplne absurdných fotografických výziev.',
        '**The Impossible Quiz** – Halloweenový kvíz, ktorý poriadne potrápi tvoju hlavu. Nestačí vedieť správnu odpoveď – musíš dávať pozor, premýšľať a nenechať sa nachytať.',
        '**Nenechaj sa chytiť** – dostaneš tajnú misiu, ktorú musíš splniť nenápadne priamo medzi ostatnými. Dokážeš ju dokončiť bez toho, aby niekto odhalil, čo vlastne robíš?',
        '**A mnoho ďalších ako:** Halloweenové výzvy, tímové súboje, tajné misie, strategické hry a ďalšie aktivity, pri ktorých sa rozhodne nudiť nebudeš!',
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
        // Profis: "Fest HALLOWEEN fest" (id_Zajezd 145), id_Termin 1124
        registrationId: 1124,
        profisTerminId: 1124,
        id_ZajezdHotel: 46,
        start: '28.10.2026',
        end: '01.11.2026',
        days: 5,
        originalPrice: '319.00 €',
        discountedPrice: '269.00 €',
      },
    ],
  },
}
