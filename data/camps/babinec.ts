import { CampDetailData } from './types'

export const babinecData: CampDetailData = {
  id: 'babinec',
  name: 'Babinec',
  headline: 'Pre Malé Modelky –',
  headlineHighlight: 'Babinec',
  location: 'Horský hotel Lomy',
  age: 'Pre deti vo veku 10 – 16 rokov',
  price: '349 €',
  
  bulletPoints: [
    'Týždeň, počas ktorého môžeš byť presne taká aká si bláznivá, originálna a odvážna. Od workshopov zameraných na vizáž a sebarozvoj až po nekonečné večerné rozhovory pod hviezdami a záverečnú módnu prehliadku. Babinec je proste miesto na ktorom v lete žiadne dievča nesmie chýbať!',
  ],
  
  section2: {
    ratings: {
      kreativita: 9,
      mystika: 0,
      sebarozvoj: 10,
      pohyb: 4,
      kritickeMyslenie: 5,
    },
    headline: 'Prečo prihlásiť dcéru práve na Babinec?',
    description: [
      'Babinec nie je len tábor o kráse. Je predovšetkým o sebavedomí, zdravej sebaúcte a prirodzenej starostlivosti o seba bez tlaku na dokonalosť a bez porovnávania sa s ostatnými. Program je navrhnutý tak, aby podporoval ich jedinečnosť, vnútornú silu a radosť zo spoločného času.',
      'Dievčatá čakajú dni plné beauty a relax aktivít, tvorivých dielní a hravého objavovania módy, ktoré vyvrcholia módnou prehliadkou. Nechýbajú ani tiché momenty dôvery, tajné rozhovory pod hviezdami, smiech až do noci a pocit, že patria do partie, kde si navzájom rozumejú a podporujú sa. Babinec ponúka priestor na rozvoj samostatnosti, sebavedomia a zdravého vzťahu k sebe samej, pričom prirodzene vznikajú nové priateľstvá a silné zážitky.',
    ],
    buttonText: 'Pozri Dostupné Termíny',
  },
  
  section3: {
    headline: 'Ako náš tábor vnímajú dievčatá?',
    text: [
      'Z pohľadu dievčaťa je Babinec miestom, kde patrí do partie a môže byť sama sebou. Má priestor smiať sa, tvoriť, skúšať nové veci a objavovať, čo všetko v nej je. Cíti hrdosť na to, čo dokáže, a istotu, že je v poriadku presne taká, aká je. Z tábora si odnáša silné spomienky, nové kamarátstva a pocit, že tento týždeň bol naozaj len o nej.',
    ],
    reviews: [
      {
        text: 'Naša dcéra je už 7x veľmi spokojná a kamarátstva, ktoré si v tábore našla, trvajú aj po jeho skončení. Budúce leto už pôjdeme jedine s vami. Máme odskúšaných viacero táborov, ale vy ste jediní, čo nás ani raz nesklamali.',
        author: 'Andrea D. Mamička Dieťaťa',
      },
      {
        text: 'Ďakujeme za zážitky. Detská boli nadšené. Bol to ich prvý tábor, čo som sa bála, ale dcérka povedala, že si tam našla druhú rodinu 😁😍',
        author: 'Allena G. Mamička Dieťaťa',
      },
      {
        text: 'Dcérke sa v tábore veľmi páčilo. Aktivity, prístup animátorov bolo na jedničku, o rok sa chce vrátiť ku vám do tábora, už odpočítava dni. Ďakujeme.',
        author: 'Rodič Dieťaťa',
      },
    ],
  },
  
  section4: {
    details: {
      vTomtoTaboreZazites: [
        'WORKSHOP "VLASY" – starostlivosť o vlasy spojená s tipmi, trikmi ako vytvoriť jednoduchý účes',
        'WORKSHOP "SPA + MASÁŽE" – dôležitosť peelingov, druhy masáží a lifting tváre pomocov gua sha',
        'WORKSHOP "KOZMETIKA + VIZÁŽ" – starostlivosť o pleť, vizáž, večerný a denný make up',
        'WORKSHOP "FOTOGRAFICKÝ" – základy pózovania pred objektívom, fotoshooting',
        'WORKSHOP "MANIKÚRA" – starostlivosť o nechty spojená s tipmi a trikmi ako ich mať upravené',
        'Módna prehliadka, na ktorej dieťa ukáže, čo sa za celý týždeň naučila',
        'Kreatívne dielničky',
        'Opekačka, diskotéky',
        'Vyberieme sa na originálny výlet plťami po Váhu',
        'V prípade priaznivého počasia bazén',
      ],
      vCene: [
        'Program podľa ponuky',
        'Odborná a zdravotná starostlivosť',
        '6 x ubytovanie',
        '6 x plná penzia 5 x denne, pitný režim',
        'Foto z tábora na facebooku',
        'Poistenie voči úpadku CK, DPH',
        'Táborové tričko Bombovo',
        'Celodenný výlet',
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
    strediskoDescription: 'Horský hotel Lomy je obklopený nádhernou prírodou. Ponúka deťom skutočnú zábavu pod otvoreným nebom a každé dieťa si Lomy zamiluje hneď po prvom dni.',
    mapCoordinates: {
      lat: 48.5806195783322,
      lng: 18.567247,
    },
  },
  
  section5: {
    dates: [
      {
        registrationId: 14,
        start: '12.07.2026',
        end: '18.07.2026',
        days: 7,
        originalPrice: '359.00 €',
        discountedPrice: '349.00 €',
      },
      {
        registrationId: 15,
        start: '26.07.2026',
        end: '01.08.2026',
        days: 7,
        originalPrice: '359.00 €',
        discountedPrice: '349.00 €',
      },
    ],
  },
}
