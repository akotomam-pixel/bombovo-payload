'use client'
/* eslint-disable @next/next/no-img-element */

import { useState } from 'react'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Mockup of the new FEST page (canvas Page 8). Copy is placeholder: every
// spot marked waits for the final text.

const UT = (key: string) => `https://utfs.io/f/${key}`

const gallery = [
  'RRX2fWCU0K6iQ0yQxXJg0kLrU3VqzYvm9PIOsjHh1ZWTAdfM',
  'RRX2fWCU0K6iREyAK7CU0K6iwSfNPA5pgtaHYv7MGOD4qFkb',
  'RRX2fWCU0K6igQlMfUy14v2IiJQ7MySfXUkWq98mbtudsrCe',
  'RRX2fWCU0K6iIIgzA4qKxpszVUtLvjyYobHcrfmZCaiwEWTI',
  'RRX2fWCU0K6iCxx6P4Qv8WQ3Tu5fdMUOHZ9yabrqilX1Jz4t',
].map(UT)

const lomyPhotos = [
  'RRX2fWCU0K6iUgts1acsWFAELMdQZw9rbYkoXu8mBnChzx4K',
  'RRX2fWCU0K6i8Dq7MuRKeTsloEiNHr6XcaYRdb9mnZj52gBF',
  'RRX2fWCU0K6iANo6nj267HlILQDJg1EVkhSeZGcNFy0jbaR8',
  'RRX2fWCU0K6i2U3Lsd8jJGzoflrBIPKnAYmq8xwF5HsLZ9hW',
  'RRX2fWCU0K6iSEDoJlb16BH3KPxD49VRUJarIW2EysXwqZGm',
  'RRX2fWCU0K6iljESChFHdXDQg3bofsjtrpi4Guyq9xT8zJRE',
].map(UT)

const terms = [
  { id: 1, label: '12. 7. – 18. 7.', days: 7, price: 369, sold: false },
  { id: 2, label: '19. 7. – 25. 7.', days: 7, price: 369, sold: false },
  { id: 3, label: '26. 7. – 1. 8.', days: 7, price: 369, sold: true },
  { id: 4, label: '9. 8. – 15. 8.', days: 7, price: 369, sold: false },
  { id: 5, label: '15. 8. – 23. 8.', days: 9, price: 449, sold: false },
]

// Hero info row (original Page 1 style: icon + text in one line)
const ico = { fill: 'none', stroke: '#080708', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
const heroInfo = [
  { key: 'vek', bold: true, text: '13 až 17 rokov', icon: <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" {...ico}><circle cx="9" cy="7" r="4" /><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /><path d="M21 21v-2a4 4 0 0 0-3-3.85" /></svg> },
  { key: 'dni', bold: false, text: '7 alebo 9 dní', icon: <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" {...ico}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg> },
  { key: 'miesto', bold: false, text: 'Horský hotel Lomy, Partizánske', icon: <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" {...ico}><path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></svg> },
  { key: 'hodnotenie', bold: false, text: '4,97 (152 recenzií)', icon: <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="#FDCA40" stroke="#080708" strokeWidth="1.5" strokeLinejoin="round"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" /></svg> },
  { key: 'komunita', bold: false, text: 'Komunita už 15+ rokov', icon: <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" {...ico}><path d="M20 12a8 8 0 1 1-3-6.2" /><path d="M20 4v5h-5" /></svg> },
]

const pov = [
  { title: 'Hra s pohármi pred chatkami', sub: 'POV animátora', tag: '0:19' },
  { title: '[Stredoveký deň]', sub: 'POV animátora', tag: '[0:00]' },
  { title: '[Paintball]', sub: 'POV animátora', tag: '[0:00]' },
  { title: '[Opekačka]', sub: 'POV animátora', tag: '[0:00]' },
  { title: '[Disko]', sub: 'POV animátora', tag: '[0:00]' },
]
const interviews = [
  { title: '„Prišla som sama.“', sub: '[Meno], 4. Fest', tag: 'Rozhovor' },
  { title: '„Prečo sa vraciam?“', sub: '[Meno], 3. Fest', tag: 'Rozhovor' },
  { title: '„Čo by som povedal nováčikovi“', sub: '[Meno], 2. Fest', tag: 'Rozhovor' },
  { title: '„Z fesťáka animátorom“', sub: '[Meno], animátor', tag: 'Rozhovor' },
  { title: '„Najlepší moment Festu“', sub: '[Meno], 5. Fest', tag: 'Rozhovor' },
]
const interviewBgs = ['#212121', '#3772FF', '#DF2935', '#212121', '#3772FF']

const days = [
  { n: 'Deň 1', short: 'Zoznamka', title: 'Prvý deň: nikto tu nie je cudzí', text: 'Vymyslíš si prezývku, pod ktorou ťa bude celý Fest poznať. Hry sú postavené tak, aby ste sa do večera poznali všetci.', games: ['Prezývky', 'Miro, tu som', 'Posúvanie papiera', 'Varuj', 'Stratégia'], evening: 'Disko', bg: '#FFF6DC' },
  { n: 'Deň 2', short: 'Tímy', title: 'Tímy, fanúšikovia a prvá Mission', text: 'Vzniknú tímy, ktoré spolu budú bojovať celý týždeň. Večer príde Mission, najbláznivejšia hra Festu.', games: ['Končatiny', 'Výchovná', 'Fanúšikovia', 'Vybíjaná', 'Topánka', 'Hututu'], evening: 'Mission', bg: '#E8EFFF' },
  { n: 'Deň 3', short: 'Stredovek', title: 'Turnaj Mekyho Žbirku', text: 'Celý deň v stredoveku. Tímy súťažia o titul a večer sa koná Stredoveký súd.', games: ['Rímska stena', 'Záprah', 'Preťahovanie lanom', 'Dobi svoje územie', 'Dvojičky', '5 proti 5'], evening: 'Stredoveký súd', bg: '#FDE7E9' },
  { n: 'Deň 4', short: 'Paintball', title: 'Výlet na paintball', text: 'Celodenný výlet. Tím proti tímu, farby všade. Večer sa vrátite na Trhy.', games: ['Paintball', 'Výlet'], evening: 'Trhy', bg: '#FFF6DC' },
  { n: 'Deň 5', short: 'Les', title: 'Hry v lese a opekačka', text: 'Vietkong, Bobor a hry, pri ktorých treba zapojiť mozog aj nohy. Večer oheň, gitara a rozhovory do noci.', games: ['Kde si?', 'Bobor', 'Vietkong', 'Kužeľ', 'Kvočky'], evening: 'Opekačka pod hviezdami', bg: '#E8EFFF' },
  { n: 'Deň 6', short: 'Finále', title: 'Posledný veľký deň', text: 'Najlepšie hry si nechávame na koniec. Večer posledné Disko.', games: ['Tam je metla', 'Umývarka', 'Divokej Bil', 'Dáždnik', 'Bozk smrti', 'Vtáky v tŕni'], evening: 'Disko', bg: '#FDE7E9' },
  { n: 'Deň 7', short: 'Lúčenie', title: 'Záverečná pošta a odchod', text: '[Záverečná pošta, lúčenie a odchod domov.]', games: ['Záverečná pošta'], evening: 'Cesta domov', bg: '#F4F4F4' },
]

const schedule = [
  ['7:15', 'Budíček a rozcvička'], ['8:00', 'Raňajky'], ['10:15', 'Prvé hry dňa'],
  ['12:00', 'Obed a oddych'], ['14:00', 'Hry a turnaje'], ['16:15', 'Ďalší blok hier'],
  ['18:00', 'Večera'], ['19:15', 'Snem a pošta'], ['20:30', 'Večerný program'], ['22:30', 'Večerníček'],
]

const wallRaw: [string, string, string, string][] = [
  ['Oliver B.', 'Išiel som sem sám a ', 'vrátil som sa so 17 kamarátmi', '.'],
  ['Laura V.', 'Je neuveriteľné, ako sa za jeden týždeň môžu ', 'úplne cudzí ľudia stať rodinou', '.'],
  ['Simona R.', 'Fest je ', 'najlepší tábor, na akom som kedy bola', '.'],
  ['Tamara P.', '', 'Nikto tam nikdy nesedí sám', ' s tým, že by medzi nás nezapadol a nemal sa s kým rozprávať.'],
  ['Ema P.', 'Super programy aj animátori, ', 'Fest je ako moja druhá rodina', '.'],
  ['Alan K.', 'Úžasný tábor, ', 'každý rok sa sem vraciam', ' a vždy je to výnimočné.'],
  ['Zuzana M.', 'Na Feste si ', 'každý nájde niekoho', ', s kým sa bude cítiť sám sebou.'],
  ['Oliver M.', 'Spoznal som mega chalanov, ktorí sú ', 'kamaráti na celý život', '.'],
  ['Katka L.', 'Hry sú tu úplne najlepšie a ', 'hrávame sa ich s kamarátmi aj mimo Festu', '.'],
  ['Nicole Š.', 'Môžem sa odviazať, ', 'byť sama sebou a nebyť za to súdená', '.'],
  ['Ester K.', 'Kolektív bol neskutočný, ', 'Lomy sa stali domovom a fesťáci rodinou', '.'],
  ['Karolína J.', 'Bol to môj prvý prespávací tábor v živote a ', 'jednoznačne najlepší', '.'],
  ['Sofia K.', 'Vďaka Festu som spoznala ', 'mojich najbližších ľudí', '.'],
  ['Liana', '', 'Najlepší tábor na svete', ', určite sa vrátim nabudúci rok.'],
  ['Lenka K.', 'Extrémna zábava, úžasný kolektív, ', 'nikdy som sa necítila sama', '.'],
  ['Nina Š.', 'Na Fest chodím už 4 roky a ', 'dalo mi to do života veľa kamarátov', '.'],
  ['Šimon Š.', 'Fest nie je obyčajný tábor, ', 'je to skôr ako chata s kamarátmi', '.'],
  ['Melanie K.', 'Či by som sa tam vrátila? ', 'Nemusela som ani dvakrát rozmýšľať', '.'],
  ['Sophie H.', 'Animátori sú strašne super a ', 'sú to moji kamaráti', '.'],
  ['Jakub B.', 'Raz som navštívil Fest a ', 'teraz sa sem vraciam zas a znova', '.'],
  ['Dominika I.', 'Spoznáš nových super ľudí, vždy sa niečo deje a ', 'stále sa smeješ', '.'],
  ['Alžbeta V.', 'Zbožňujem to miesto, ', 'je to niečo ako druhá rodina', '.'],
  ['Annika A.', 'Bez Festu by som sa sama od seba ', 'nikdy nespoznala s toľkými ľuďmi', '.'],
  ['Tal M.', 'Spoznala som neskutočných ľudí, ', 's ktorými sa bavím doteraz', '.'],
  ['Alena Š.', 'Na Feste som bola prvýkrát a ', 'bol to ten najlepší tábor na svete', '.'],
  ['Paula M.', 'Je to miesto, kde ', 'môžem byť naozaj sama sebou', ', lebo viem, že ma nikto nebude súdiť.'],
  ['Monika S.', 'Letná chata s kamarátmi, ', 'všetci sme tu veľká rodina', '.'],
  ['Sofia B.', 'Bol to ', 'týždeň plný smiechu a nových kamarátov', '.'],
  ['Lea G.', 'Mali sme ', 'veľa hier, ktoré som ani nepoznala', ' a veľmi sa mi páčili.'],
  ['Patrícia B.', 'Fest pre mňa nie je len tábor, ', 'je to moja rodina, ktorá mi zmenila život', '.'],
]
const avs = ['#FDCA40', '#E8EFFF', '#FDE7E9', '#FFF6DC', '#F4F4F4']
const tilts = [-1.2, 0.8, -0.4, 1.3, 0, -0.9]

const stories = [
  { title: 'Ray: „Ja sa s nikým neobjímam.“', text: 'Prišla ako 15-ročná a prvý večer odmietla objatie na dobrú noc. V stredu ho prijala. Dnes je animátorka.', time: '4 min', img: '[FOTO: Ray]', bg: '#FDE7E9' },
  { title: 'Lia a Biba: dve cudzie baby z trinástich', text: 'Stretli sa na Feste, keď mali 13. Dnes majú 20 a sú najlepšie kamarátky.', time: '3 min', img: '[FOTO: Lia a Biba]', bg: '#E8EFFF' },
  { title: 'Záverečná pošta: čo si fesťáci píšu posledný večer', text: '[Perex doplniť z e-mailu o záverečnej pošte.]', time: '5 min', img: '[FOTO: pošta]', bg: '#FFF6DC' },
]

const faqs = [
  { q: 'Prídem sám a nebudem poznať nikoho. Nebudem sám?', a: 'Väčšina fesťákov prišla prvýkrát sama. Animátori na začiatku spájajú ľudí cez hry, tímy a večery na chatkách.' },
  { q: 'Je na tábore zdravotník?', a: '[Kto, kedy je k dispozícii, ako to funguje.]' },
  { q: 'Môžem mať mobil?', a: '[Pravidlá používania mobilov na Feste.]' },
  { q: 'Nie je 13 rokov málo?', a: 'Fest je pre 13 až 17 ročných a 13-roční sú v každom turnuse. [Overiť.]' },
  { q: 'Čo ak bude smútok za domovom?', a: '[Ako s tým animátori pracujú a kedy kontaktujú rodičov.]' },
  { q: 'Ako sa dostanem na Lomy?', a: '[Vlastná doprava alebo autobus, časy príchodu a odchodu.]' },
  { q: '7 alebo 9 dní?', a: 'Na 9 dní je len jeden turnus v roku a vypredá sa ako prvý. [Overiť pre 2027.]' },
  { q: 'Je aj zimný Fest?', a: 'Áno. [Termín] v hoteli na Lomoch. Zaplní sa každý rok.' },
  { q: 'Dá sa platiť cez rekreačný príspevok?', a: '[Doplniť.]' },
]

const dist: [number, number][] = [[5, 148], [4, 4], [3, 0], [2, 0], [1, 0]]
const filterNames = ['Všetky', 'Prišiel som sám', 'Animátori', 'Rodina', 'Vraciam sa']
const revRaw = [
  { who: 'Linda K.', date: '15. septembra 2026', tags: [1, 3], text: 'Bol to môj 3. Fest, ale určite nie posledný. Ono povedať, že to je moja rodina, znie ako také klišé, čo počujete zakaždým, ale toto je niečo výnimočné. Bolo nás 64, ale všetci sme komunikovali, zabavili sa, pomáhali si a nikdy sme nenechali nikoho sedieť samého. Išla som prvýkrát sama a bolo to to najlepšie, čo som mohla spraviť. [skrátené]' },
  { who: 'Dominika B.', date: '[dátum]', tags: [1, 4], text: 'Prvý deň som sa neskutočne bála, ale stretla som osoby, s ktorými chodím na Festy doteraz. Fest je pre mňa jednoznačne najlepší tábor, aký som kedy zažila. [skrátené]' },
  { who: 'Daniel P.', date: '[dátum]', tags: [2], text: 'Tu vaše dieťa bude brať animátora ako staršieho brata, sestru, ku ktorému má kvôli tomuto prístupu rešpekt a počúva ho. [skrátené]' },
  { who: 'Laura E.', date: '[dátum]', tags: [3], text: 'Fest je pre mňa ako druhá rodina, kde nemusím byť niekto, kto vôbec nie som, kde nemusím nosiť masku a tváriť sa stále šťastne. [skrátené]' },
  { who: 'Alan K.', date: '[dátum]', tags: [4], text: 'Úžasný tábor, každý rok sa sem vraciam a vždy je to výnimočné a nezabudnuteľné.' },
  { who: 'Tamara M.', date: '[dátum]', tags: [1], text: 'Úprimne som sa najprv bála sem ísť, keďže nie som veľký extrovert, no spoznala som úžasných ľudí. Tento týždeň ma naučil, aké krásne je spoznávať nových ľudí. [skrátené]' },
  { who: 'Dominika B.', date: '[dátum]', tags: [2], text: 'Animátori nielen pripravujú aktivity, ale aj sa o nás starajú a dohliadajú na to, či nie sme smutní alebo či nás niečo netrápi.' },
  { who: 'Ema P.', date: '[dátum]', tags: [3, 2], text: 'Je to najlepší tábor, na ktorom som bola, super programy aj animátori, Fest je ako moja druhá rodina.' },
]

// Shared interactive-state classes (hover, focus-visible, active).
const press = 'transition-transform duration-150 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#3772FF]/40'
const h2 = 'm-0 text-[28px] md:text-[32px] font-extrabold leading-[1.15] tracking-[-0.02em]'

const css = `
@keyframes fmPop{0%{opacity:0;transform:translateY(18px) scale(.94)}70%{opacity:1;transform:translateY(-3px) scale(1.01)}100%{opacity:1;transform:none}}
@keyframes fmDraw{from{background-size:0% 42%}to{background-size:100% 42%}}
.fm-card{animation:fmPop .55s cubic-bezier(.2,.9,.3,1.2) both}
.fm-hl{background-image:linear-gradient(#FDCA40,#FDCA40);background-repeat:no-repeat;background-position:0 88%;background-size:0% 42%;animation:fmDraw .7s ease-out forwards;padding:0 2px}
@media (prefers-reduced-motion: reduce){.fm-card,.fm-hl{animation:none;opacity:1;background-size:100% 42%}}
`

function CheckIcon() {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3772FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M20 6L9 17l-5-5" /></svg>
  )
}

export default function FestMockupClient() {
  const [picked, setPicked] = useState(1)
  const [vidTab, setVidTab] = useState(0)
  const [day, setDay] = useState(2)
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [wallCount, setWallCount] = useState(15)
  const [openFaq, setOpenFaq] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [formSent, setFormSent] = useState(false)
  const [stars, setStars] = useState(5)
  const [filter, setFilter] = useState(0)
  const [revCount, setRevCount] = useState(5)

  const current = terms.find((t) => t.id === picked) ?? terms[0]
  const cur = days[day]
  const vids = vidTab === 0 ? pov : interviews
  const wall = wallRaw.slice(0, Math.min(wallCount, wallRaw.length))
  const filtered = revRaw.filter((r) => filter === 0 || r.tags.includes(filter))
  const reviews = filtered.slice(0, revCount)

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#080708]">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <TopBar />
      <Header />


      <div className="bg-bombovo-gray">
      <div className="w-full max-w-[1240px] mx-auto px-4 md:px-6 pt-6 pb-10">
        <p className="m-0 mb-5 text-[13px] text-[#4B5563]">Tábory › Tínedžerské tábory › Fest animátor fest</p>

        {/* S1. HERO */}
        <div className="flex flex-col gap-4 mb-6">
          <span className="font-handwritten text-[28px] leading-none text-bombovo-blue">Tínedžerský tábor</span>
          <h1 className="m-0 text-[34px] md:text-[56px] leading-[1.05] font-extrabold tracking-[-0.03em]">Fest animátor fest</h1>
          <p className="m-0 text-[18px] md:text-[21px] font-medium text-[#212121] max-w-[820px] leading-[1.5]">Letný tábor na Lomoch pre 13 až 17 ročných. Týždeň originálnych táborových hier, tematických dní, paintballu a večerov pri ohni. S animátormi, ktorí boli kedysi sami fesťákmi.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[16px] md:text-[17px] text-[#212121]">
            {heroInfo.map((h) => (
              <span key={h.key} className="inline-flex items-center gap-2">
                {h.icon}
                {h.bold ? <b>{h.text}</b> : h.text}
              </span>
            ))}
          </div>
        </div>

        {/* GALLERY */}
        <section aria-label="Fotogaléria" className="grid grid-cols-2 md:grid-cols-4 auto-rows-[140px] md:auto-rows-[200px] gap-[10px] rounded-[20px] overflow-hidden">
          <img src={gallery[0]} alt="Fest fotka 1" className="col-span-2 row-span-2 w-full h-full object-cover" />
          {gallery.slice(1).map((src, i) => (
            <img key={src} src={src} alt={`Fest fotka ${i + 2}`} className="w-full h-full object-cover" />
          ))}
        </section>
      </div>
      </div>

      <main className="w-full max-w-[1240px] mx-auto px-4 md:px-6 pt-12 pb-20">
        <div className="flex flex-wrap gap-12 items-start">
          <div className="flex-[999_1_560px] min-w-0 flex flex-col gap-20">

            {/* S2. BIG IDEA */}
            <section className="flex flex-col gap-4">
              <span className="font-handwritten text-[26px] leading-none text-bombovo-red">Prečo Fest</span>
              <h2 className="m-0 text-[30px] md:text-[42px] font-extrabold leading-[1.12] tracking-[-0.03em] max-w-[760px]">Tínedžerský tábor, kde si každý nájde svoju druhú rodinu.</h2>
              <p className="m-0 text-[18px] leading-[1.65] text-[#212121] max-w-[660px]">Väčšina fesťákov prišla prvýkrát sama. Animátori ťa hneď zapoja do hier a zvyšok spraví partia. Preto sa sem vracajú každé leto, kým im to vek dovolí.</p>
            </section>

            {/* S3. RODINA */}
            <section aria-label="Fest jedným slovom" className="-mt-10 bg-bombovo-gray rounded-3xl p-8 grid gap-7 items-center grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
              <div className="flex flex-col gap-3">
                <p className="m-0 text-[16px] leading-[1.6] text-[#212121]">Na poslednom Feste sme fesťákov poprosili, aby opísali tábor jedným slovom.</p>
                <div className="flex flex-wrap gap-2">
                  {['domov', 'zábava', 'spomienky', 'sebapoznanie'].map((w) => (
                    <span key={w} className="bg-white text-bombovo-blue font-semibold text-[14px] px-3 py-[6px] rounded-full shadow-[0_4px_12px_-6px_rgba(55,114,255,0.35)]">{w}</span>
                  ))}
                </div>
                <p className="m-0 text-[16px] text-[#212121]">Najčastejšie slovo však bolo jedno:</p>
                <p className="m-0 text-[48px] md:text-[72px] font-extrabold leading-none text-bombovo-red tracking-[-0.03em]">Rodina.</p>
              </div>
              <div className="aspect-[4/5] max-h-[340px] bg-white rounded-2xl flex items-center justify-center text-center p-4 text-[14px] text-[#4B5563] shadow-[0_10px_30px_-12px_rgba(8,7,8,0.2)]">[GIF: fesťáci hovoria svoje slovo do kamery]</div>
            </section>

            {/* S4. VIDEO + ROZHOVORY */}
            <section id="video" className="flex flex-col gap-[18px]">
              <div className="flex flex-wrap justify-between items-end gap-[14px]">
                <div className="flex flex-col gap-[6px]">
                  <h2 className={h2}>Pozri si Fest z prvej ruky</h2>
                  <p className="m-0 text-[17px] leading-[1.6] text-[#212121] max-w-[600px]">Natočené priamo na Feste. Žiadne reklamné zábery.</p>
                </div>
                <div role="tablist" className="inline-flex bg-[#F4F4F4] rounded-full p-1 gap-1">
                  {['POV videá', 'Rozhovory s fesťákmi'].map((label, i) => (
                    <button key={label} type="button" role="tab" aria-selected={vidTab === i} onClick={() => setVidTab(i)}
                      className={`rounded-full px-4 min-h-[40px] text-[14px] font-bold ${press} ${vidTab === i ? 'bg-bombovo-blue text-white' : 'bg-transparent hover:bg-white'}`}>{label}</button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {vids.map((v, i) => (
                  <a key={v.title} href="#video" className={`flex-[0_0_180px] aspect-[9/16] rounded-[18px] p-[14px] flex flex-col justify-between text-white no-underline ${press}`}
                    style={{ background: vidTab === 0 ? '#212121' : interviewBgs[i] }}>
                    <span className="self-start bg-white text-[#080708] text-[12px] font-bold px-[10px] py-1 rounded-full">{v.tag}</span>
                    <span aria-hidden className="self-center w-[52px] h-[52px] rounded-full bg-[#FDCA40] flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#080708"><path d="M7 4l13 8-13 8z" /></svg>
                    </span>
                    <span className="flex flex-col gap-[2px]">
                      <span className="text-[14px] font-bold leading-[1.35]">{v.title}</span>
                      <span className="text-[12px] text-[#E6E8E6]">{v.sub}</span>
                    </span>
                  </a>
                ))}
              </div>
            </section>

            {/* S5. ČO ZAŽIJEŠ */}
            <section className="flex flex-col gap-5">
              <div className="flex flex-col gap-[6px]">
                <h2 className={h2}>Čo zažiješ na najlepšom tínedžerskom tábore?</h2>
                <p className="m-0 text-[17px] text-[#212121]">Klikni na deň a pozri sa, čo sa v ten deň deje. Podľa programu 2027.</p>
              </div>
              <div role="tablist" className="flex gap-2 overflow-x-auto pb-1">
                {days.map((d, i) => (
                  <button key={d.n} type="button" role="tab" aria-selected={day === i} onClick={() => setDay(i)}
                    className={`flex-none flex flex-col items-start gap-[2px] min-h-[56px] px-4 py-2 rounded-[14px] text-left border-2 ${press} ${day === i ? 'bg-bombovo-blue text-white border-bombovo-blue' : 'bg-white border-[#E6E8E6] hover:border-bombovo-blue'}`}>
                    <span className="text-[12px] font-semibold opacity-75">{d.n}</span>
                    <span className="text-[15px] font-bold">{d.short}</span>
                  </button>
                ))}
              </div>
              <div className="bg-white rounded-[22px] overflow-hidden shadow-[0_12px_32px_-12px_rgba(55,114,255,0.3)] border border-[#E6E8E6] grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
                <div className="min-h-[260px] flex items-center justify-center p-5 text-center text-[14px] font-semibold text-[#4B5563]" style={{ background: cur.bg }}>[FOTO alebo krátke video: {cur.title}]</div>
                <div className="p-[26px] flex flex-col gap-[14px]">
                  <span className="self-start text-[12px] font-bold bg-bombovo-red text-white px-[10px] py-1 rounded-full">{cur.n}</span>
                  <h3 className="m-0 text-[26px] font-extrabold leading-[1.15]">{cur.title}</h3>
                  <p className="m-0 text-[16px] leading-[1.6] text-[#212121]">{cur.text}</p>
                  <div className="flex flex-wrap gap-[6px]">
                    {cur.games.map((g) => (
                      <span key={g} className="text-[13px] font-semibold bg-[#F4F4F4] px-3 py-[6px] rounded-full">{g}</span>
                    ))}
                  </div>
                  <div className="border-t border-[#E6E8E6] pt-3 flex gap-[10px] items-baseline">
                    <span className="text-[13px] font-bold text-[#4B5563] whitespace-nowrap">Večer</span>
                    <span className="text-[15px] font-semibold">{cur.evening}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-[10px]">
                <button type="button" onClick={() => setScheduleOpen(!scheduleOpen)} aria-expanded={scheduleOpen}
                  className="self-start py-[6px] text-[16px] font-bold text-[#3772FF] min-h-[44px] hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#3772FF]/40 rounded">
                  {scheduleOpen ? 'Skryť bežný deň ↑' : 'Ako vyzerá bežný deň na Feste ↓'}
                </button>
                {scheduleOpen && (
                  <div className="grid gap-2 grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
                    {schedule.map(([t, what]) => (
                      <div key={t} className="bg-[#F4F4F4] rounded-xl px-[14px] py-3 flex flex-col gap-[2px]">
                        <b className="text-[15px]">{t}</b>
                        <span className="text-[13px] text-[#212121] leading-[1.4]">{what}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* S6. REVIEW WALL */}
            <section className="flex flex-col gap-[22px]">
              <div className="flex flex-col gap-2">
                <h2 className="m-0 text-[30px] md:text-[40px] font-extrabold leading-[1.12] tracking-[-0.03em]">Najlepší tínedžerský tábor? <span className="text-[#4B5563]">Never nám.</span><br />Ver fesťákom, čo nám napísali.</h2>
                <p className="m-0 text-[16px] text-[#212121]"><b>4,97 z 5</b> zo 152 recenzií od fesťákov.</p>
              </div>
              <div className="[columns:3_220px] [column-gap:12px]">
                {wall.map(([who, pre, hl, post], i) => {
                  const local = i % 15
                  return (
                    <figure key={who + i} className="fm-card break-inside-avoid m-0 mb-3 bg-white border border-[#E6E8E6] rounded-2xl px-4 py-[14px] flex flex-col gap-[10px] shadow-[0_8px_24px_-10px_rgba(8,7,8,0.18)]"
                      style={{ transform: `rotate(${tilts[i % tilts.length]}deg)`, animationDelay: `${(local * 0.12).toFixed(2)}s` }}>
                      <div className="flex justify-between items-center gap-2">
                        <span className="flex items-center gap-2">
                          <span aria-hidden className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold" style={{ background: avs[i % avs.length] }}>{who.charAt(0)}</span>
                          <b className="text-[13px]">{who}</b>
                        </span>
                        <span aria-label="5 hviezd" className="text-[#E0A800] text-[12px] tracking-[1px]">★★★★★</span>
                      </div>
                      <blockquote className="m-0 text-[15px] leading-[1.55] font-medium">
                        „{pre}<span className="fm-hl" style={{ animationDelay: `${(local * 0.12 + 0.5).toFixed(2)}s` }}>{hl}</span>{post}“
                      </blockquote>
                    </figure>
                  )
                })}
              </div>
              {wallCount < wallRaw.length && (
                <button type="button" onClick={() => setWallCount(wallCount + 15)}
                  className={`self-center min-h-[48px] px-6 border-2 border-bombovo-blue text-bombovo-blue bg-white rounded-full text-[15px] font-bold hover:bg-[#EEF3FF] ${press}`}>
                  Ukáž ďalšie ({wallRaw.length - wall.length})
                </button>
              )}
            </section>

            {/* S7. PRÍBEHY */}
            <section className="flex flex-col gap-5">
              <div className="flex flex-wrap justify-between items-end gap-3">
                <div className="flex flex-col gap-[6px]">
                  <h2 className={h2}>Prečítaj si pravdivé príbehy, ktoré sa na Feste stali</h2>
                                  </div>
                <a href="#" target="_blank" rel="noopener" className="text-[15px] font-bold text-[#3772FF] hover:underline">Všetky príbehy ↗</a>
              </div>
              <div className="grid gap-[14px] grid-cols-[repeat(auto-fit,minmax(230px,1fr))]">
                {stories.map((s) => (
                  <a key={s.title} href="#" target="_blank" rel="noopener" className={`no-underline text-[#080708] border-[1.5px] border-[#E6E8E6] rounded-[18px] overflow-hidden flex flex-col bg-white hover:border-bombovo-blue ${press}`}>
                    <div className="h-[170px] flex items-center justify-center text-[13px] font-semibold text-[#4B5563] text-center p-3" style={{ background: s.bg }}>{s.img}</div>
                    <div className="p-[18px] flex flex-col gap-2 flex-1">
                      <span className="text-[12px] font-bold text-[#4B5563]">Príbeh · {s.time}</span>
                      <b className="text-[18px] leading-[1.3]">{s.title}</b>
                      <span className="text-[14px] leading-[1.55] text-[#212121]">{s.text}</span>
                      <span className="mt-auto pt-[6px] text-[14px] font-bold text-[#3772FF]">Čítať príbeh ↗</span>
                    </div>
                  </a>
                ))}
              </div>
            </section>

            {/* S8. KDE A ČO JE V CENE */}
            <section id="miesto" className="flex flex-col gap-[18px]">
              <h2 className={h2}>Kde to je a čo je v cene</h2>
              <div className="grid gap-5 items-start grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
                <div className="flex flex-col gap-3">
                  <b className="text-[18px]">Horský hotel Lomy pri Partizánskom</b>
                  <p className="m-0 text-[15px] leading-[1.65] text-[#212121]">Areál uprostred lesa s bazénom, telocvičňou, dvoma ihriskami, altánkami a amfiteátrom na večerný program.</p>
                  <ul className="m-0 p-0 list-none flex flex-col gap-[6px] text-[14px]">
                    <li><b>Izby:</b> [počet lôžok, kúpeľňa]</li>
                    <li><b>Strava:</b> [5× denne, pitný režim, diéty]</li>
                    <li><b>Doprava:</b> [vlastná alebo autobus]</li>
                  </ul>
                </div>
                <div className="grid grid-cols-3 gap-[6px]">
                  {lomyPhotos.map((src, i) => (
                    <img key={src} src={src} alt={`Lomy fotka ${i + 1}`} className="w-full aspect-square object-cover rounded-[10px]" />
                  ))}
                </div>
              </div>
              <div className="h-[180px] rounded-2xl flex items-center justify-center bg-[repeating-linear-gradient(45deg,#F4F4F4_0_14px,#ECEDEC_14px_28px)]">
                <span className="bg-white border-[1.5px] border-bombovo-blue rounded-full px-[18px] py-[10px] text-[14px] font-bold">📍 [Mapa] Lomy, Partizánske</span>
              </div>
              <div className="grid gap-[10px] grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
                <div className="bg-[#FFF6DC] rounded-2xl p-[18px] flex flex-col gap-1">
                  <span className="text-[13px] text-[#4B5563]">Cena</span>
                  <b className="text-[26px] leading-[1.1]">od 369 €</b>
                  <span className="text-[13px] text-[#212121]">7 dní · 9 dní za 449 € [overiť 2027]</span>
                </div>
                <div className="bg-[#F4F4F4] rounded-2xl p-[18px] flex flex-col gap-2">
                  <b className="text-[14px]">V cene</b>
                  <span className="text-[14px] leading-[1.6] text-[#212121]">Ubytovanie · [strava] · celý program · paintball · animátori · [zdravotník]</span>
                </div>
                <div className="bg-[#F4F4F4] rounded-2xl p-[18px] flex flex-col gap-2">
                  <b className="text-[14px]">Nie je v cene</b>
                  <span className="text-[14px] leading-[1.6] text-[#212121]">[Doprava] · poistenie (voliteľné) · vreckové</span>
                </div>
              </div>
            </section>

            {/* S9. FAQ */}
            <section className="flex flex-col gap-[18px]">
              <h2 className={h2}>Otázky o Feste</h2>
              <div className="flex flex-col border-t border-[#E6E8E6]">
                {faqs.map((f, i) => {
                  const open = openFaq === i
                  return (
                    <div key={f.q} className="border-b border-[#E6E8E6]">
                      <button type="button" onClick={() => setOpenFaq(open ? -1 : i)} aria-expanded={open}
                        className="w-full py-[18px] flex justify-between gap-4 items-center text-left text-[16px] font-semibold min-h-[44px] hover:text-[#3772FF] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#3772FF]/40 rounded">
                        <span>{f.q}</span>
                        <span aria-hidden className="text-[22px] font-medium">{open ? '−' : '+'}</span>
                      </button>
                      {open && <p className="m-0 mb-[18px] text-[15px] leading-[1.65] text-[#212121] max-w-[680px]">{f.a}</p>}
                    </div>
                  )
                })}
              </div>
            </section>

            {/* S10. ALL REVIEWS + WRITE */}
            <section id="recenzie" className="flex flex-col gap-[22px]">
              <div className="flex flex-wrap justify-between items-center gap-3">
                <h2 className={h2}>Všetky recenzie Festu</h2>
                <button type="button" onClick={() => { setFormOpen(!formOpen); setFormSent(false) }}
                  className={`min-h-[48px] px-[22px] bg-bombovo-blue text-white rounded-full text-[15px] font-bold ${press}`}>✍️ Napíš recenziu</button>
              </div>

              <div className="grid gap-5 items-center bg-[#F4F4F4] rounded-[20px] p-[22px] grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
                <div className="flex flex-col gap-1">
                  <span className="text-[52px] font-extrabold leading-none">4,97</span>
                  <span className="text-[#E0A800] text-[20px] tracking-[2px]">★★★★★</span>
                  <span className="text-[14px] text-[#4B5563]">152 recenzií od fesťákov</span>
                </div>
                <div className="flex flex-col gap-[6px]">
                  {dist.map(([s, c]) => (
                    <div key={s} className="grid grid-cols-[28px_minmax(0,1fr)_36px] gap-2 items-center text-[13px]">
                      <span>{s} ★</span>
                      <span className="h-2 bg-[#E6E8E6] rounded-full overflow-hidden"><span className="block h-full bg-[#FDCA40]" style={{ width: `${Math.round((c / 152) * 100)}%` }} /></span>
                      <span className="text-right text-[#4B5563]">{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {formOpen && (
                <div className="border-2 border-bombovo-blue rounded-[20px] p-[22px] flex flex-col gap-[14px]">
                  {formSent ? (
                    <p className="m-0 text-[17px] font-bold">Ďakujeme! Recenzia sa zobrazí po kontrole.</p>
                  ) : (
                    <>
                      <b className="text-[18px]">Ako sa ti páčilo na Feste?</b>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button key={n} type="button" aria-label={`${n} hviezd`} onClick={() => setStars(n)}
                            className={`text-[32px] px-[2px] min-w-[44px] min-h-[44px] ${press}`} style={{ color: n <= stars ? '#E0A800' : '#E6E8E6' }}>★</button>
                        ))}
                      </div>
                      <div className="grid gap-[10px] grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
                        <label className="flex flex-col gap-[6px] text-[13px] font-semibold">Meno
                          <input type="text" placeholder="Napr. Linda K." className="text-[15px] font-normal px-[14px] py-3 border-[1.5px] border-[#E6E8E6] rounded-xl focus-visible:outline-none focus-visible:border-[#3772FF]" />
                        </label>
                        <label className="flex flex-col gap-[6px] text-[13px] font-semibold">Turnus
                          <select className="text-[15px] font-normal px-[14px] py-3 border-[1.5px] border-[#E6E8E6] rounded-xl bg-white focus-visible:outline-none focus-visible:border-[#3772FF]">
                            <option>Letný Fest 2026</option><option>Zimný Fest 2026</option><option>Starší turnus</option>
                          </select>
                        </label>
                      </div>
                      <label className="flex flex-col gap-[6px] text-[13px] font-semibold">Tvoja recenzia
                        <textarea rows={4} placeholder="Čo si zažil? Čo by si povedal niekomu, kto váha?" className="text-[15px] font-normal px-[14px] py-3 border-[1.5px] border-[#E6E8E6] rounded-xl resize-y focus-visible:outline-none focus-visible:border-[#3772FF]" />
                      </label>
                      <button type="button" onClick={() => setFormSent(true)}
                        className={`self-start min-h-[48px] px-6 bg-bombovo-red text-white rounded-full text-[15px] font-bold ${press}`}>Odoslať recenziu</button>
                    </>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {filterNames.map((label, i) => (
                  <button key={label} type="button" aria-pressed={filter === i} onClick={() => { setFilter(i); setRevCount(5) }}
                    className={`min-h-[40px] px-4 rounded-full text-[14px] font-semibold border-[1.5px] ${press} ${filter === i ? 'bg-bombovo-blue text-white border-bombovo-blue' : 'bg-white border-[#E6E8E6] hover:border-bombovo-blue'}`}>{label}</button>
                ))}
              </div>

              <div className="flex flex-col border-t border-[#E6E8E6]">
                {reviews.map((r, i) => (
                  <article key={r.who + i} className="border-b border-[#E6E8E6] py-5 grid grid-cols-[44px_minmax(0,1fr)] gap-[14px]">
                    <span aria-hidden className="w-11 h-11 rounded-full flex items-center justify-center font-bold" style={{ background: avs[i % avs.length] }}>{r.who.charAt(0)}</span>
                    <div className="flex flex-col gap-[6px]">
                      <div className="flex flex-wrap gap-x-3 gap-y-[6px] items-baseline">
                        <b className="text-[15px]">{r.who}</b>
                        <span className="text-[#E0A800] text-[13px] tracking-[1px]">★★★★★</span>
                        <span className="text-[13px] text-[#4B5563]">{r.date}</span>
                      </div>
                      <p className="m-0 text-[15px] leading-[1.65] text-[#212121]">{r.text}</p>
                    </div>
                  </article>
                ))}
              </div>
              <button type="button" onClick={() => setRevCount(revCount + 5)}
                className={`self-center min-h-[48px] px-6 border-2 border-bombovo-blue text-bombovo-blue bg-white rounded-full text-[15px] font-bold hover:bg-[#EEF3FF] ${press}`}>Načítať ďalšie recenzie</button>
            </section>

            {/* CLOSING CTA */}
            <section className="bg-bombovo-blue text-white rounded-[28px] p-7 md:p-12 flex flex-col gap-[14px] items-start">
              <span className="text-[14px] font-semibold">Motto, ktoré fesťáci vedia naspamäť:</span>
              <p className="m-0 text-[22px] md:text-[30px] font-bold leading-[1.3]">„Rodinu si váž, rodinu si stráž, je to jediné, čo máš.“</p>
              <h2 className="mt-[6px] mb-0 text-[32px] md:text-[48px] font-extrabold tracking-[-0.03em]">Vidíme sa na Lomoch.</h2>
              <a href="#rezervacia" className={`inline-flex items-center justify-center min-h-[52px] px-7 bg-[#FDCA40] text-[#080708] rounded-full text-[17px] font-bold no-underline ${press}`}>Vybrať termín</a>
            </section>
          </div>

          {/* STICKY BOOKING CARD */}
          <aside id="rezervacia" aria-label="Rezervácia" className="flex-[1_1_320px] min-w-0 max-w-[400px] sticky top-[130px] rounded-[20px] overflow-hidden p-6 flex flex-col gap-4 bg-white border border-[#E6E8E6] shadow-[0_16px_40px_-14px_rgba(55,114,255,0.35)]">
            <div className="-mx-6 -mt-6 px-6 pt-6 pb-5 bg-bombovo-blue text-white flex flex-col gap-[2px]">
              <span className="text-[14px] text-white/80">Cena za turnus</span>
              <span className="text-[34px] font-extrabold leading-[1.1]">{current.price} €</span>
              <span className="text-[13px] text-white/80">Výlet a aktivity v cene, na tábore nič nedoplácate.</span>
            </div>
            <fieldset className="border-none m-0 p-0 flex flex-col gap-2">
              <legend className="text-[14px] font-semibold mb-2">Vyber termín</legend>
              {terms.map((t) => {
                const selected = picked === t.id
                return (
                  <button key={t.id} type="button" aria-pressed={selected} onClick={() => setPicked(t.id)}
                    className={`w-full flex justify-between items-center gap-3 min-h-[56px] px-[14px] py-[10px] rounded-[14px] text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#3772FF]/40 ${selected ? 'border-2 border-bombovo-blue bg-[#EEF3FF]' : 'border border-[#E6E8E6] bg-white hover:border-bombovo-blue'} ${t.sold ? 'opacity-60' : ''}`}>
                    <span className="flex flex-col items-start gap-[2px]">
                      <b className="text-[14px]">{t.label}</b>
                      <span className="text-[12px] text-[#4B5563]">{t.days} dní · {t.sold ? 'Vypredané' : 'Voľné miesta'}</span>
                    </span>
                    <b className="text-[15px]">{t.price} €</b>
                  </button>
                )
              })}
            </fieldset>
            <a href="#rezervacia" className={`flex items-center justify-center min-h-[52px] rounded-full text-[16px] font-bold no-underline ${press} ${current.sold ? 'bg-[#FDCA40] text-[#080708]' : 'bg-bombovo-red text-white'}`}>
              {current.sold ? 'Pridať sa na čakaciu listinu' : 'Rezervovať miesto'}
            </a>
            <p className="m-0 text-[13px] font-semibold text-[#A3141F]">9-dňový Fest býva vypredaný už v marci.</p>
            <ul className="m-0 p-0 list-none flex flex-col gap-2 text-[13px] text-[#212121]">
              <li className="flex gap-2 items-center"><CheckIcon />[Záloha len X €, zvyšok neskôr]</li>
              <li className="flex gap-2 items-center"><CheckIcon />[Dá sa platiť cez rekreačný príspevok]</li>
              <li className="flex gap-2 items-center"><CheckIcon />[Storno podmienky v jednej vete]</li>
            </ul>
            <div className="border-t border-[#E6E8E6] pt-4 flex gap-3 items-center">
              <div className="w-11 h-11 rounded-full bg-[#E8EFFF] shrink-0" />
              <div className="flex flex-col gap-[2px] text-[13px]">
                <b className="text-[14px]">Máte otázku? [Meno]</b>
                <span className="text-[#3772FF]">[+421 XXX XXX XXX]</span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
