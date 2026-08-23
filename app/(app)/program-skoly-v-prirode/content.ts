/**
 * Copy and data for /program-skoly-v-prirode, the page that explains the
 * animačný program to teachers before they book, so it needs to build trust
 * and let them find their own age group fast rather than read everything.
 *
 * All copy here is final and approved — pasted as given, not rewritten or
 * trimmed. Photos are real animačný program photos already uploaded (the
 * same pool the stredisko pages' "Overený animačný program" section draws
 * from), picked after actually viewing them for a real thematic fit, not
 * assigned by filename.
 */

export const hero = {
  headline: 'Animačný program, ktorému môžete dôverovať',
  paragraphs: [
    'Vieme, že pre vás to nie je len o programe pre deti. Je to aj o vás, o vašej triede a o piatich dňoch, počas ktorých za ňu zodpovedáte mimo domova.',
    'Preto naši animátori nie sú tam len na to, aby deti zabávali. Každý deň si s vami sadnú, porozprávajú sa o tom, ako program prebieha, čo deťom sedí a čo nie, a podľa toho ho priebežne prispôsobia. Vy poznáte svoju triedu najlepšie, my sa prispôsobíme vám.',
    'A pretože každá trieda a každý vek je iný, pripravili sme pre školy v prírode viac programov. Nižšie nájdete ten, ktorý sedí presne vášmu ročníku.',
  ],
}

export interface PickerCard {
  id: string
  label: string
  ageRange: string
  icon: string
  teaser: string
  badge?: string
}

// Order matches the page's section order below: 1. stupeň (the main
// product) first, 2. stupeň second, materská škola last.
export const pickerCards: PickerCard[] = [
  {
    id: 'prvy-stupen-zs',
    label: '1. stupeň ZŠ',
    ageRange: 'Približne 7 až 11 rokov',
    icon: '🎒',
    teaser: 'Vyberte si medzi Tajomstvami denníka a Letom svetom, dvomi rovnako overenými programami.',
    badge: 'Najviac vybraný program',
  },
  {
    id: 'druhy-stupen-zs',
    label: '2. stupeň ZŠ',
    ageRange: 'Približne 11 až 15 rokov',
    icon: '📚',
    teaser: 'Teenagerská škola v prírode, postavená na tom, čo tento vek baví.',
  },
  {
    id: 'materska-skola',
    label: 'Materská škola',
    ageRange: 'Deti do 6 rokov',
    icon: '🧸',
    teaser: 'Vlastná, jemne upravená verzia Tajomstiev denníka, presne pre ich vek a tempo.',
  },
]

export interface ProgramSectionCopy {
  id: string
  eyebrow?: string
  heading: string
  paragraphs: string[]
  /** Omitted for the 1. stupeň intro block, which has no takeaways of its own — those live on its two comparison cards instead. */
  takeawaysHeading?: string
  takeaways?: string[]
  closing?: string
  photo: { src: string; alt: string }
  /** Which side the photo sits on at desktop width. */
  photoSide: 'left' | 'right'
}

// Photo picks, each viewed and matched to its section on purpose:
// - 736: the whole class in the amphitheatre for a group activity around the
//   fire pit, a calm, communal, storytelling-circle moment, fits materská
//   škola's gentler pace.
// - 748: the full group with the Bombovo mascot in front of the chalets,
//   ties directly into the "denník" mascot story world 1. stupeň's programs
//   are built on.
// - 756: older-looking kids (not toddlers) in branded Bombovo shirts running
//   a team strategy game, fits 2. stupeň's "dobrá partia, výzvy, súťaženie"
//   framing better than a younger-skewing photo would.
const PHOTO_MATERSKA = {
  src: 'https://utfs.io/f/RRX2fWCU0K6ig8CY8zy14v2IiJQ7MySfXUkWq98mbtudsrCe',
  alt: 'Trieda pri spoločnej aktivite v amfiteátri počas školy v prírode',
}
const PHOTO_PRVY_STUPEN = {
  src: 'https://utfs.io/f/RRX2fWCU0K6iIInrdCqKxpszVUtLvjyYobHcrfmZCaiwEWTI',
  alt: 'Celá skupina detí s maskotom Bombovo pred chatkami strediska',
}
const PHOTO_DRUHY_STUPEN = {
  src: 'https://utfs.io/f/RRX2fWCU0K6iqRmgQOidIMDERPbns97pmCHSgFUaGKBcJNOA',
  alt: 'Skupina starších žiakov pri tímovej hre v animátorských tričkách Bombovo',
}

export const materskaSection: ProgramSectionCopy = {
  id: 'materska-skola',
  heading: 'Materská škola',
  photoSide: 'right',
  photo: PHOTO_MATERSKA,
  paragraphs: [
    'Naša škola v prírode nie je len zmena prostredia ani oddych od vyučovania. Je to premyslený, príbehový program, ktorý pracuje s celou triedou naraz a cielene rozvíja to, čo je pre fungovanie kolektívu kľúčové, spoluprácu, komunikáciu, dôveru, kreativitu a zdravé sebavedomie.',
    'Deti sa to učia nenápadne, cez hru, spoločný príbeh a vlastný zážitok. Každý deň sa nesie v duchu jednej vlastnosti, ktorú si deti prostredníctvom aktivít rozvíjajú, napríklad hravosti, spolupráce, kreativity alebo zvedavosti. Tieto témy sa premietajú do všetkých hier a spoločných momentov dňa a vždy vyvrcholia príbehovým odhalením časti denníka.',
    'Deti si počas týždňa navzájom viac dôverujú, zapájajú sa, neboja sa prejaviť vlastný názor a učia sa rešpektovať rozdielnosti medzi sebou.',
    'Veľkou pridanou hodnotou je, že si deti denník po škole v prírode berú so sebou domov. Počas týždňa doň vpisujú aj vlastné stránky, svoje myšlienky a zážitky. Trieda tak získava hmatateľnú spoločnú spomienku, ku ktorej sa môže vracať aj počas školského roka.',
    'Pre materské školy je program citlivo prerobený na rovnakom základe, len v tempe a s aktivitami, ktoré zvládnu aj najmenšie deti.',
  ],
  takeawaysHeading: 'Čo si trieda odnesie',
  takeaways: [
    'Lepšie komunikačné a tímové zručnosti',
    'Schopnosť spolupracovať namiesto súperenia',
    'Väčšiu odvahu vyjadriť vlastný názor',
    'Spoločný príbeh, ktorý posilňuje triedne vzťahy aj po návrate do školy',
  ],
  closing:
    'Pre učiteľa to v praxi znamená triedu, v ktorej sa lepšie pracuje, deti sa navzájom viac rešpektujú a atmosféra je otvorenejšia než predtým.',
}

export const prvyStupenIntroText =
  'Na výber sú dva programy, Tajomstvá denníka a Letom svetom. Oba sú rovnako overené, líšia sa len tým, aký príbeh deti počas týždňa prežívajú. Vyberáte si podľa toho, čo si myslíte, že vašej triede sadne viac.'

export const prvyStupenIntro: ProgramSectionCopy = {
  id: 'prvy-stupen-zs',
  heading: '1. stupeň ZŠ',
  photoSide: 'right',
  photo: PHOTO_PRVY_STUPEN,
  paragraphs: [prvyStupenIntroText],
}

export interface ComparisonCard {
  title: string
  subtitle: string
  paragraphs: string[]
  takeawaysHeading: string
  takeaways: string[]
  closing: string
  /** Which hand-drawn glyph to show, matching this page's own icon set below. */
  icon: 'diary' | 'globe'
}

export const denníkCard: ComparisonCard = {
  title: 'Tajomstvá denníka',
  subtitle: 'Príbehová škola v prírode',
  icon: 'diary',
  paragraphs: [
    'Naša škola v prírode nie je len zmena prostredia ani oddych od vyučovania. Je to premyslený, príbehový program, ktorý pracuje s celou triedou naraz a cielene rozvíja to, čo je pre fungovanie kolektívu kľúčové, spoluprácu, komunikáciu, dôveru, kreativitu a zdravé sebavedomie.',
    'Deti sa to učia nenápadne, cez hru, spoločný príbeh a vlastný zážitok. Každý deň sa nesie v duchu jednej vlastnosti, ktorú si deti prostredníctvom aktivít rozvíjajú, napríklad hravosti, spolupráce, kreativity alebo zvedavosti. Tieto témy sa premietajú do všetkých hier a spoločných momentov dňa a vždy vyvrcholia príbehovým odhalením časti denníka.',
    'Deti si počas týždňa navzájom viac dôverujú, zapájajú sa, neboja sa prejaviť vlastný názor a učia sa rešpektovať rozdielnosti medzi sebou. Program je vždy prispôsobený konkrétnej triede, či už ide o kolektív, ktorý sa práve spoznáva, alebo o triedu, ktorá sa pozná dlho a len potrebuje zlepšiť vzťahy.',
    'Veľkou pridanou hodnotou je, že si deti denník po škole v prírode berú so sebou domov. Počas týždňa doň vpisujú aj vlastné stránky, svoje myšlienky a zážitky. Trieda tak získava hmatateľnú spoločnú spomienku, ku ktorej sa môže vracať aj počas školského roka.',
  ],
  takeawaysHeading: 'Čo si trieda odnesie',
  takeaways: [
    'Lepšie komunikačné a tímové zručnosti',
    'Schopnosť spolupracovať namiesto súperenia',
    'Väčšiu odvahu vyjadriť vlastný názor',
    'Spoločný príbeh, ktorý posilňuje triedne vzťahy aj po návrate do školy',
  ],
  closing:
    'Pre učiteľa to v praxi znamená triedu, v ktorej sa lepšie pracuje, deti sa navzájom viac rešpektujú a atmosféra je otvorenejšia než predtým.',
}

export const letomSvetomCard: ComparisonCard = {
  title: 'Letom svetom',
  subtitle: 'Dobrodružná škola v prírode',
  icon: 'globe',
  paragraphs: [
    'Čo keby sa škola v prírode na jeden týždeň zmenila na cestu okolo sveta? Letom svetom spája pohyb, zážitok, tímovú spoluprácu a tvorivosť do jedného veľkého dobrodružstva. Deti sa počas týždňa vydajú naprieč svetadielmi a cez hry a výzvy spoznajú ich atmosféru trochu inak, než sú zvyknuté.',
    'Hneď na začiatku sa každé dieťa stane súčasťou tímu, ktorý si vytvorí vlastnú vlajku, pokrik a spoločnú identitu. Výpravu odštartujeme slávnostným ceremoniálom, na ktorom sa tímy predstavia, a počas týždňa potom zbierajú body za tematické aktivity. Deti tak raz objavujú nové krajiny, inokedy zachraňujú vzácne suroviny, prekonávajú zábavné prekážky alebo sa ponoria do sveta zvierat, každý deň s novou atmosférou a novým zážitkom.',
    'Objavovanie sveta pritom nie je len o pohybe, priestor dostáva aj kreativita a fantázia. Deti si počas týždňa vytvárajú vlastné spomienky, ktoré si zo školy v prírode odnesú aj domov.',
  ],
  takeawaysHeading: 'Čo si trieda odnesie',
  takeaways: [
    'Medaile pre víťazný tím',
    'Kreatívne dielničky, ktoré si spoločne vytvoria počas týždňa',
    'Tímového ducha, podporu spoluhráčov a schopnosť zvládnuť aj prehru',
    'Nové priateľstvá, ktoré vznikajú aj medzi deťmi, ktoré sa bežne až tak nerozprávajú',
  ],
  closing:
    'Trieda sa po návrate nevracia len ako skupina jednotlivcov, ale ako kolektív, ktorý spolu niečo naozaj zažil.',
}

export const druhyStupenSection: ProgramSectionCopy = {
  id: 'druhy-stupen-zs',
  heading: '2. stupeň ZŠ',
  eyebrow: 'Škola v prírode, ktorá baví aj teenagerov',
  photoSide: 'left',
  photo: PHOTO_DRUHY_STUPEN,
  paragraphs: [
    'Keď deti vyrastú z rozprávkových príbehov, neznamená to, že vyrástli z hier, len už potrebujú niečo iné. Preto sme postavili Teenagerskú školu v prírode presne na tom, čo starších žiakov naozaj baví, dobrá partia, výzvy, súťaženie, kreativita, humor a spoločné zážitky. Program vychádza z aktivít overených na našich teenagerských táboroch a teambuildingoch.',
    'Čakajú ich hry, pri ktorých nestačí byť najrýchlejší alebo najšikovnejší jednotlivec. Treba sa dohodnúť, komunikovať, vymyslieť stratégiu a fungovať ako tím. Kreatívne dielne sme prispôsobili staršiemu veku, deti si pri nich môžu naozaj niečo vytvoriť alebo naučiť sa novú zručnosť. A keďže teenageri už nepotrebujú mať naplánovanú každú minútu dňa, dávame im aj priestor byť jednoducho sami sebou, viac času s kamarátmi a možnosť vybrať si, ako ho strávia. Práve v týchto chvíľach prirodzene vznikajú nové priateľstvá a upevňuje sa kolektív.',
    'Výsledkom je škola v prírode, ktorá nie je detinská, ale zároveň nie je nudná, dynamická, spoločenská a postavená presne na veku, pre ktorý je určená.',
  ],
  takeawaysHeading: 'Čo si trieda odnesie',
  takeaways: [
    'Silnejší kolektív a lepšie vzťahy medzi spolužiakmi',
    'Lepšiu komunikáciu, keď zistia, že bez nej sa niektoré výzvy jednoducho nedajú zvládnuť',
    'Schopnosť rozdeliť si úlohy, počúvať ostatných a rešpektovať rôzne názory',
    'Sebapoznanie, priestor zistiť, v čom je každý z nich dobrý a čo dokáže ponúknuť tímu',
  ],
}

export const closingCta = {
  text: 'Nech si vyberiete ktorýkoľvek program, platí to isté, čo sme spomenuli na začiatku. Animátori sa každý deň porozprávajú s vami aj s deťmi a program priebežne prispôsobia presne vašej triede.',
  primary: { label: 'Kontaktujte nás', href: '/kontakt' },
  secondary: { label: 'Pozri strediská', href: '/skoly-v-prirode#strediska' },
}
