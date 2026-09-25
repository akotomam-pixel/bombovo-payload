import { after } from 'next/server'
import { headers } from 'next/headers'
import { Pool } from 'pg'
import Image from 'next/image'
import type { Metadata } from 'next'
import AdvertorialTracking from './AdvertorialTracking'

const ADVERTORIAL = 'advertorialsvp-2'
const DESTINATION_PATH = '/skoly-v-prirode/penzion-lagan'
const DESTINATION_SLUG = 'penzion-lagan'

export const metadata: Metadata = {
  title: 'Najprestížnejšie stredisko pre školy v prírode na západnom Slovensku | Lepší Rodič',
  icons: { icon: '/advertorial-2/favicon.png' },
}

let pool: Pool | null = null
function getPool(): Pool {
  if (!pool) pool = new Pool({ connectionString: process.env.DATABASE_URI })
  return pool
}

const BOT_PATTERNS = ['bot','crawler','spider','facebookexternalhit','googlebot','bingbot','slurp','duckduckbot','baiduspider','yandexbot','ia_archiver']
function isBot(ua: string): boolean {
  return BOT_PATTERNS.some(p => ua.toLowerCase().includes(p))
}

function buildGoUrl(to: string, utm: Record<string, string>): string {
  const p = new URLSearchParams({ to, source: ADVERTORIAL })
  if (utm.utm_source) p.set('utm_source', utm.utm_source)
  if (utm.utm_medium) p.set('utm_medium', utm.utm_medium)
  if (utm.utm_campaign) p.set('utm_campaign', utm.utm_campaign)
  if (utm.utm_content) p.set('utm_content', utm.utm_content)
  if (utm.fbclid) p.set('fbclid', utm.fbclid)
  return `/api/go?${p.toString()}`
}

const CSS = `
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
    font-family: 'Poppins', Arial, sans-serif;
    font-size: 20px;
    color: #222;
    background: #fff;
    line-height: 1.85;
}

a { color: #1a73e8; text-decoration: none; }
a:hover { text-decoration: underline; }

.top-bar {
    background: #e8e8e8;
    text-align: center;
    padding: 5px 20px;
    font-size: 9px;
    color: #666;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    border-bottom: 1px solid #d0d0d0;
    font-family: Arial, sans-serif;
}

.site-header {
    border-bottom: 1px solid #ddd;
    padding: 14px 24px;
}
.header-inner { width: 100%; }
.site-header img.logo {
    height: 108px;
    width: auto;
    display: block;
    margin: 0;
}

.breadcrumb {
    padding: 7px 24px;
    font-size: 12px;
    color: #777;
    border-bottom: 1px solid #eee;
    max-width: 760px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
}
.breadcrumb a { color: #777; }
.breadcrumb span { color: #333; }

.page-wrap {
    max-width: 760px;
    margin: 0 auto;
    padding: 0 24px;
}

.main-col {
    width: 100%;
    padding: 24px 0 60px;
}

.article-headline {
    font-size: 44px;
    font-weight: 700;
    line-height: 1.2;
    color: #111;
    margin-bottom: 18px;
}

.article-byline {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;
    color: #777;
    margin-bottom: 20px;
    padding-bottom: 14px;
    border-bottom: 1px solid #eee;
}
.article-byline img {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
}
.article-byline-info { display: flex; flex-direction: column; gap: 2px; }
.article-byline-name { font-style: normal; font-weight: 600; color: #111; font-size: 14px; line-height: 1.3; }
.article-byline-meta { font-size: 13px; color: #777; line-height: 1.3; }

.hero-photo { margin: 0 0 6px; }
.body-photo { margin: 20px 0 6px; }
.photo-caption {
    font-size: 12px;
    color: #999;
    font-style: italic;
    margin-bottom: 18px;
}

.main-col p {
    margin-bottom: 36px;
    color: #333;
}
.main-col p strong { color: #111; }
.main-col p.lead-question { margin-bottom: 10px; }
.main-col h2 {
    font-size: 30px;
    font-weight: 700;
    margin: 32px 0 28px;
    color: #111;
    line-height: 1.3;
}
.main-col ul {
    margin: 12px 0 18px 0;
    padding: 0;
    list-style: none;
}
.main-col ul li {
    padding: 6px 0 6px 28px;
    position: relative;
    color: #333;
}
.main-col ul li::before {
    content: '✅';
    position: absolute;
    left: 0;
    top: 6px;
    font-size: 22px;
}
.main-col ul.checklist li {
    padding: 10px 0 10px 32px;
}

.offer-box {
    background: #F5C518;
    border: 2px solid #D4A800;
    padding: 28px 32px;
    margin: 28px 0;
    text-align: center;
}
.offer-box .offer-title {
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #000;
    margin-bottom: 14px;
}
.offer-box p { color: #000; font-size: 18px; margin-bottom: 12px; }
.offer-box .offer-note { font-size: 18px; color: #000; font-weight: 700; }

.cta-btn-wrap { text-align: center; margin: 20px 0; }
.cta-btn {
    display: inline-block;
    background: #2E9E4F;
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    padding: 14px 44px;
    border-radius: 4px;
    text-decoration: none;
    border: 2px solid #249040;
    transition: background 0.15s;
}
.cta-btn:hover { background: #249040; text-decoration: none; color: #fff; }

/* --- Reviews: editorial pull-quote layout (not a comments widget) --- */
.reviews-section {
    margin: 12px 0 8px;
}
.reviews-grid {
    display: flex;
    flex-direction: column;
    gap: 0;
    border-top: 1px solid #eee;
}
.review-card {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 20px;
    padding: 28px 0;
    border-bottom: 1px solid #eee;
}
.review-mark {
    font-family: 'Lora', Georgia, serif;
    font-size: 56px;
    line-height: 0.7;
    color: #F5C518;
    font-weight: 700;
    padding-top: 14px;
}
.review-body { min-width: 0; }
.review-stars {
    color: #D4A800;
    font-size: 15px;
    letter-spacing: 2px;
    margin-bottom: 10px;
}
.review-quote-text {
    font-family: 'Lora', Georgia, serif;
    font-style: italic;
    font-size: 18px;
    line-height: 1.65;
    color: #2a2a2a;
    margin-bottom: 14px;
}
.review-attribution {
    display: flex;
    align-items: baseline;
    gap: 8px;
    flex-wrap: wrap;
    font-family: Arial, sans-serif;
}
.review-name {
    font-weight: 700;
    color: #111;
    font-size: 14px;
}
.review-school {
    color: #777;
    font-size: 13px;
}
.review-school::before { content: '—'; margin-right: 8px; }

/* --- Mid-article discount CTA: visually distinct from the closing offer-box --- */
.mid-cta-box {
    background: #ffffff;
    border: 1px solid #F6D6D2;
    border-left: 6px solid #D93A2B;
    border-radius: 6px;
    box-shadow: 0 10px 30px rgba(217, 58, 43, 0.14);
    padding: 30px 32px;
    margin: 32px 0;
    display: flex;
    align-items: center;
    gap: 26px;
}
.mid-cta-badge {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background: #FBE7E4;
    border: 2px solid #D93A2B;
    color: #A9291B;
    font-weight: 700;
    line-height: 1.1;
}
.mid-cta-badge .amount { font-size: 26px; }
.mid-cta-badge .unit { font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase; }
.mid-cta-content { flex: 1; min-width: 0; }
.mid-cta-content p { color: #333; font-size: 17px; margin-bottom: 10px; }
.mid-cta-content p:last-of-type { margin-bottom: 20px; }
.mid-cta-content .cta-btn-wrap { text-align: left; margin: 0; }

@media (max-width: 760px) {
    .article-headline { font-size: 30px; }
    .site-header img.logo { height: 72px; }
    .review-card { grid-template-columns: 1fr; }
    .review-mark { display: none; }
    .mid-cta-box { flex-direction: column; text-align: center; padding: 26px 22px; }
    .mid-cta-content .cta-btn-wrap { text-align: center; }
}

@media (max-width: 480px) {
    .article-headline { font-size: 27px; line-height: 1.2; margin-bottom: 14px; }
    .lead-question { font-size: 18px; font-weight: 600; line-height: 1.45; }
    .lead-question strong { font-weight: 600; }
}

.sticky-cta {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #D93A2B;
    z-index: 9999;
    padding: 14px 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateY(100%);
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 -3px 20px rgba(0,0,0,0.18);
}
.sticky-cta.visible { transform: translateY(0); }
.sticky-cta a {
    color: #fff;
    font-weight: 700;
    font-size: 17px;
    text-decoration: none;
    font-family: 'Poppins', Arial, sans-serif;
    display: flex;
    align-items: center;
    gap: 8px;
}
.sticky-cta a:hover { text-decoration: none; color: #fff; }
@media (max-width: 600px) {
    .sticky-cta a { font-size: 15px; }
}
`

// Page-specific additions on top of the shared svp-1 CSS: subtitle (deck) under the H1 and grey sub-headings.
const EXTRA_CSS = `
.article-headline { margin-bottom: 10px; }
.article-deck {
    font-size: 22px;
    font-weight: 400;
    color: #666;
    line-height: 1.4;
    margin-bottom: 18px;
}
.main-col h3 {
    font-size: 24px;
    font-weight: 600;
    color: #444;
    line-height: 1.35;
    margin: 8px 0 20px;
}
/* Square photo would be as tall as the column is wide (760px) — taller than a laptop screen. */
.body-photo-square { max-width: 480px; margin-left: auto; margin-right: auto; }
@media (max-width: 480px) {
    .article-deck { font-size: 18px; }
    .main-col h3 { font-size: 21px; }
}
`

export default async function AdvertorialSvp2Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const g = (v: string | string[] | undefined) => Array.isArray(v) ? v[0] ?? '' : v ?? ''
  const utm = {
    utm_source: g(sp.utm_source),
    utm_medium: g(sp.utm_medium),
    utm_campaign: g(sp.utm_campaign),
    utm_content: g(sp.utm_content),
    fbclid: g(sp.fbclid),
  }
  const ctaUrl = buildGoUrl(DESTINATION_PATH, utm)

  const headersList = await headers()
  const userAgent = headersList.get('user-agent') ?? ''
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? ''
  const referrer = headersList.get('referer') ?? ''

  after(async () => {
    if (isBot(userAgent)) return
    if (!process.env.DATABASE_URI) return
    try {
      await getPool().query(
        `INSERT INTO ad_events (type, advertorial, destination, utm_source, utm_medium, utm_campaign, utm_content, fbclid, ip, user_agent, referrer, updated_at, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,now(),now())`,
        ['view', ADVERTORIAL, null, utm.utm_source||null, utm.utm_medium||null, utm.utm_campaign||null, utm.utm_content||null, utm.fbclid||null, ip||null, userAgent||null, referrer||null]
      )
    } catch (err) {
      console.error('[advertorialsvp-2] view tracking failed:', err)
    }
  })

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,600;0,700;1,400&family=Lora:ital,wght@1,500;1,600&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: CSS + EXTRA_CSS }} />

      <AdvertorialTracking
        advertorial={ADVERTORIAL}
        destination={DESTINATION_SLUG}
        utm_source={utm.utm_source}
        utm_medium={utm.utm_medium}
        utm_campaign={utm.utm_campaign}
        utm_content={utm.utm_content}
        fbclid={utm.fbclid}
      />

      <div className="top-bar">Propagačný článok</div>

      <header className="site-header">
        <div className="header-inner">
          <img className="logo" src="/advertorial-2/images/logo.png" alt="Lepší Rodič — Rodičovský Blog" />
        </div>
      </header>

      <div className="breadcrumb">
        <a href="#">Správy</a> &rsaquo; <a href="#">Školy v prírode</a> &rsaquo; <span>CK Bombovo</span>
      </div>

      <div className="page-wrap">
        <article className="main-col">

          <h1 className="article-headline">Najprestížnejšie stredisko pre školy v prírode na západnom Slovensku</h1>

          <p className="article-deck">Ľahko dostupné pre školy z Nitry, Trnavy, Bratislavy a ich okolia.</p>

          <p className="article-byline">
            <img src="/advertorial-2/images/photo-18.jpg" alt="Lucia Nováková" />
            <span className="article-byline-info">
              <span className="article-byline-name">Lucia Nováková – Blogerka, Lepší Rodič</span>
              <span className="article-byline-meta"><span id="byline-date"></span> &nbsp;·&nbsp; 8&nbsp;942 zhliadnutí 🔥</span>
            </span>
          </p>

          <div className="hero-photo">
            <Image
              src="/advertorialsvp-2/photo-1.webp"
              alt="Penzión Lagáň pri Podhájskej"
              width={850}
              height={567}
              priority
              sizes="(max-width: 780px) 100vw, 760px"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          <p className="lead-question"><strong>Hľadáte školu v prírode na západnom Slovensku?</strong></p>

          <p>Nenápadný penzión pri Podhájskej si za posledné roky získal dôveru organizátorov niektorých z najprestížnejších detských pobytov na západnom Slovensku.</p>

          <p>V školskom roku 2026/27 sa k nim môže pridať aj vaša škola.</p>

          <h2>Čo robí Penzión Lagáň najprestížnejším strediskom na západe Slovenska?</h2>

          <p>Hľadáte miesto, ku ktorému nemusíte s deťmi cestovať cez polovicu Slovenska, no svojím zázemím sa vyrovná veľkým strediskám v Tatrách?</p>

          <p>Penzión Lagáň vyniká práve touto kombináciou.</p>

          <h3>Pokoj medzi vinicami. Termálny raj Podhájskej len na skok.</h3>

          <div className="body-photo">
            <Image
              src="/advertorialsvp-2/photo-2.png"
              alt="Deti na lúke pri Penzióne Lagáň"
              width={1536}
              height={1024}
              loading="lazy"
              sizes="(max-width: 780px) 100vw, 760px"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          <p>Penzión Lagáň leží uprostred polí, lúk a viníc, ďaleko od rušných miest a každodenného mestského ruchu.</p>

          <p>Počas prechádzok popri poliach môžu deti spoznávať lúčne kvety, obilniny a okolité stromy.</p>

          <p>Môžu pozorovať zajace, počúvať zvieratá ukryté v tráve a večer sledovať, ako slnko zapadá za otvorený horizont.</p>

          <p>Len 6 kilometrov od strediska sa pritom nachádza známe termálne kúpalisko Podhájska.</p>

          <p>Pokojný pobyt medzi poliami a vinicami tak môžete jednoducho doplniť výletom, z ktorého si deti odnesú ďalší spoločný zážitok.</p>

          <p>Na Lagáni si nemusíte vyberať medzi tichým prostredím a možnosťami výletov v okolí.</p>

          <p>Získate oboje na jednom mieste.</p>

          <h3>Zázemie pre celú školu blízko každého mesta na západe</h3>

          <p>Vďaka polohe neďaleko Podhájskej je Penzión Lagáň ľahko dostupný pre školy z Nitry, Trnavy, Bratislavy a ich okolia.</p>

          <p>Po príchode pritom nájde celá škola zázemie na celý pobyt priamo v jednom areáli.</p>

          <p>Priamo pri penzióne sa nachádza trávnatá plocha s rozmermi približne 100 × 100 metrov.</p>

          <p>Deti tak majú dostatok priestoru na šport, súťaže, spoločné hry aj celodenný program.</p>

          <p>Ak sa počasie pokazí, škola má k dispozícii spoločenské priestory aj samostatnú športovú halu s približne 1&nbsp;000 m² vnútorného priestoru.</p>

          <p>Veľká škola sa pritom nemusí deliť medzi niekoľko rôznych ubytovaní.</p>

          <p>Penzión Lagáň dokáže v celom komplexe ubytovať až 150 osôb.</p>

          <p>Učiteľky, ktoré tu už absolvovali školu v prírode, si pochvaľovali aj čisté a priestranné izby, ochotný personál a veľmi chutné jedlo.</p>

          <p>To všetko vysvetľuje, prečo je Lagáň atraktívnym miestom pre školu v prírode.</p>

          <p>Samo osebe by to však nestačilo na to, aby sme ho nazvali najprestížnejším strediskom na západe Slovenska.</p>

          <h2>Stredisko overené najznámejšími hviezdami Slovenska</h2>

          <div className="body-photo body-photo-square">
            <Image
              src="/advertorialsvp-2/photo-3.png"
              alt="Talentárium Mira Jaroša v Penzióne Lagáň"
              width={1080}
              height={1080}
              loading="lazy"
              sizes="(max-width: 780px) 100vw, 760px"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          <p>Pri hodnotení strediska veľa napovie to, kto sa v ňom rozhodne zorganizovať vlastný pobyt.</p>

          <p>Najmä ak ide o ľudí a organizácie, ktoré so strediskom spájajú svoje meno a pred rodičmi zodpovedajú za program desiatok detí.</p>

          <p>Jedným z najlepších príkladov je Talentárium Mira Jaroša, ktoré sa do Penziónu Lagáň vracia už tretí rok.</p>

          <p>Takýto projekt potrebuje miesto, na ktoré sa môže spoľahnúť organizátor aj známe meno, akým je Miro Jaroš.</p>

          <p>Penzión Lagáň túto úlohu už tretí rok zvláda na výbornú.</p>

          <p>Dôvera známych slovenských tvárí v Penzión Lagáň sa tým však nekončí.</p>

          <p>Za organizáciou Talentária stojí aj Noro Grofčík, profesionálny tanečník, choreograf a zakladateľ tanečnej školy N Dance Company.</p>

          <p>Diváci ho môžu poznať ako finalistu šou Česko Slovensko má talent, v ktorej sa po získaní zlatého buzzera dostal priamo do finále.</p>

          <p>Ako choreograf spolupracoval s Mirom Jarošom aj s ďalšími známymi slovenskými interpretmi.</p>

          <p>Práve v Penzióne Lagáň organizuje N Dance Company v posledných rokoch svoje tanečné tábory a sústredenia.</p>

          <div className="body-photo">
            <Image
              src="/advertorialsvp-2/photo-4.jpg"
              alt="N Dance Company v Penzióne Lagáň"
              width={1440}
              height={1080}
              loading="lazy"
              sizes="(max-width: 780px) 100vw, 760px"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          <p>Pre učiteľky je však ešte dôležitejšie, že Penziónu Lagáň dôverujú aj samotné školy.</p>

          <p>Verejne dostupné záznamy zachytávajú školy v prírode na Lagáni v roku 2022 aj v roku 2026.</p>

          <p>V júni 2022 si ho pre svoju školu v prírode vybrala EduKey.</p>

          <p>Deti tu počas piatich dní využívali športovú halu, vonkajšie ihriská, bazén aj okolie strediska a z Lagáňa vyrážali na výlety podľa svojho veku.</p>

          <p>V máji 2026 sem prišli aj deti z troch tried ZŠ s MŠ Nenince.</p>

          <p>Škola opísala týždeň plný aktivít, výletov a tímových hier, na ktorý zostali pekné spomienky žiakom aj učiteľom.</p>

          <p>Svoju školu v prírode tu absolvovala aj škola z Dojča, ktorá na Lagáň priviedla 21 detí z druhého až štvrtého ročníka.</p>

          <p>Penzión Lagáň tak svoju povesť nestavia iba na známych menách.</p>

          <p>Stavia ju aj na skúsenostiach skutočných škôl, ktoré mu zverili svojich žiakov a celý pobyt.</p>

          <h2>Čo všetko bude mať vaša škola v Penzióne Lagáň k dispozícii?</h2>

          <div className="body-photo">
            <Image
              src="/advertorialsvp-2/photo-5.png"
              alt="Sála, športová hala, bazén a izby Penziónu Lagáň"
              width={1672}
              height={941}
              loading="lazy"
              sizes="(max-width: 780px) 100vw, 760px"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          <ul className="checklist">
            <li>Kapacitu až 150 osôb, vďaka ktorej môže v jednom komplexe zostať aj väčšia školská skupina.</li>
            <li>Dvoj- až štvorlôžkové izby s vlastnou sprchou a toaletou.</li>
            <li>Stravu päťkrát denne a celodenný pitný režim.</li>
            <li>Veľkú trávnatú plochu s rozmermi približne 100 × 100 metrov na športové hry, súťaže a animačný program.</li>
            <li>Samostatnú športovú halu s približne 1&nbsp;000 m² vnútorného priestoru, šatňami, sprchami a sociálnymi zariadeniami.</li>
            <li>Veľkú spoločenskú sálu s dataprojektorom a plátnom na vyučovanie, spoločné hry a večerný program.</li>
            <li>Ďalšie spoločenské a školiace miestnosti, vďaka ktorým sa deti môžu rozdeliť do menších skupín.</li>
            <li>Tanečný parket vhodný na diskotéky, tanečné aktivity a spoločný program.</li>
            <li>Vonkajší bazén priamo v areáli penziónu.</li>
            <li>Detskú lanovku a preliezky.</li>
            <li>Ohnisko na spoločnú opekačku a záverečný večer.</li>
            <li>Pokojné prostredie medzi poliami, lúkami a vinicami, ďaleko od rušných ciest.</li>
            <li>Jednoduché možnosti výletov do Podhájskej, Energolandu Mochovce, Arboréta Mlyňany, Topoľčianok a ďalších miest v okolí.</li>
            <li>Skúsenosti s veľkými detskými skupinami, školami v prírode, tábormi, športovými sústredeniami a celoslovenskými podujatiami.</li>
          </ul>

          <h2>Prečo sa Penzión Lagáň rozhodol neorganizovať školy v prírode sám?</h2>

          <p>Skúsenosti z minulých rokov ukázali, že väčší záujem škôl znamená aj omnoho viac organizačnej práce.</p>

          <p>Zabezpečiť pobyt totiž neznamená iba pripraviť izby a stravu.</p>

          <p>Pred príchodom treba s každou školou dohodnúť počet detí, rozdelenie izieb, stravovanie, alergie, fakturáciu, potrebné dokumenty, požiadavky učiteliek aj program pobytu.</p>

          <p>Pri viacerých školách počas jednej sezóny ide o množstvo telefonátov, e-mailov a organizačných úloh, ktoré musí niekto riešiť od prvého dopytu až po odchod detí.</p>

          <p>Ak chcel Lagáň v školskom roku 2026/27 sprístupniť svoje kapacity ďalším školám, potreboval skúseného partnera, ktorý túto časť organizácie prevezme.</p>

          <p>Partnera si pritom nevyberal náhodne.</p>

          <h2>Penzión Lagáň si pre školský rok 2026/27 vybral CK Bombovo</h2>

          <p>CK Bombovo organizuje detské pobyty už viac ako 26 rokov a jeho programami prešlo viac než 50&nbsp;000 detí.</p>

          <p>Tím CK Bombovo za ten čas spoznal nielen to, čo deti baví, ale aj to, čo učiteľky potrebujú pred pobytom, počas neho aj po návrate domov.</p>

          <p>Vedenie Penziónu Lagáň na spolupráci s Bombovom oceňuje najmä rýchlu a bezproblémovú komunikáciu, profesionálny prístup a skúsenosti so školskými skupinami.</p>

          <p>Lagáň tak získal partnera, ktorému môže zveriť organizáciu škôl v prírode.</p>

          <p>Učiteľky získali tím, ktorý ich pri príprave ani počas pobytu nenechá na všetko samé.</p>

          <h2>Čo táto spolupráca znamená pre učiteľky?</h2>

          <p>Každej škole sa venuje konkrétny zamestnanec CK Bombovo, s ktorým môže učiteľka komunikovať telefonicky aj e-mailom.</p>

          <p>S penziónom dohodne rozdelenie izieb, stravu, alergie aj praktické požiadavky školy.</p>

          <p>Pomôže s faktúrami, pripraví potrebné podklady a predvyplní dokumenty pre RÚVZ.</p>

          <p>K dispozícii zostáva pred pobytom, počas neho aj po návrate školy domov.</p>

          <p>Ak treba niečo vyriešiť priamo na mieste, do komunikácie s penziónom a kuchyňou sa zapojí tím Bombova.</p>

          <p>Učiteľka tak nemusí sama prepájať rodičov, školu, penzión a cestovnú kanceláriu.</p>

          <p>Namiesto desiatok telefonátov a e-mailov má jedného partnera, na ktorého sa môže obrátiť.</p>

          <h2>Program, ktorý nemusí zostať na pleciach učiteliek</h2>

          <div className="body-photo">
            <Image
              src="/advertorialsvp-2/photo-6.jpg"
              alt="Animátori CK Bombovo s deťmi v Penzióne Lagáň"
              width={5184}
              height={3456}
              loading="lazy"
              sizes="(max-width: 780px) 100vw, 760px"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          <p>Ak si škola vyberie animačný program, deti každý deň od 14:00 do 21:00 preberie tím vyškolených animátorov CK Bombovo.</p>

          <p>Počas päťdňového pobytu tak pripravia spolu 28 hodín hier, súťaží, kvízov, športových aktivít a večerného programu.</p>

          <p>Na každých 15 detí zo základnej školy pripadá jeden animátor a pri materských školách jeden animátor na 10 detí.</p>

          <p>Každá skupina má zároveň hlavného animátora, ktorý komunikuje s učiteľkami a dohliada na celý program.</p>

          <p>Bombovo zabezpečí aj všetky pomôcky a materiály potrebné na aktivity.</p>

          <p>Učiteľky tak majú program stále pod kontrolou, no nemusia ho celé popoludnia a večery pripravovať ani viesť samy.</p>

          <p>Škola si môže zvoliť aj celodenný animačný program, ak chce tímu Bombova zveriť ešte väčšiu časť pobytu.</p>

          <h2>Zážitok pripravený priamo pre Penzión Lagáň</h2>

          <p>Školy, ktoré chcú deťom dopriať ešte viac, si môžu k animačnému programu pridať aj Bombový balíček.</p>

          <p>Jeho súčasťou je lukostreľba priamo v areáli, takže škola nemusí organizovať ďalšiu dopravu ani opúšťať stredisko.</p>

          <p>Každé dieťa dostane aj malý darček na pamiatku.</p>

          <p>Za každých 10 platiacich detí získa učiteľka navyše odmenu 100 €.</p>

          <p>Celý zážitok tak zostáva na jednom mieste a zapadá do programu, ktorý už škola na Lagáni absolvuje.</p>

          <h2>Lagáň si vybral Bombovo. Učiteľky mu už roky dôverujú.</h2>

          <div className="body-photo">
            <Image
              src="/advertorialsvp-2/photo-7.png"
              alt="Animátori CK Bombovo s učiteľkami"
              width={1200}
              height={800}
              loading="lazy"
              sizes="(max-width: 780px) 100vw, 760px"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          <p>Rozhodnutie penziónu je dôležitým signálom, no najviac o spolupráci napovedia skúsenosti učiteliek, ktoré ju už zažili.</p>

          <section className="reviews-section" aria-label="Recenzie učiteliek">
            <div className="reviews-grid">
              <article className="review-card">
                <span className="review-mark" aria-hidden="true">„</span>
                <div className="review-body">
                  <div className="review-stars">★★★★★</div>
                  <p className="review-quote-text">Deti boli nadšené z animátorov a program bol plný zaujímavých aktivít. Izby boli pekné, priestranné, čisté, splnili všetky naše očakávania. Bolo nám naozaj bombovo.</p>
                  <div className="review-attribution">
                    <span className="review-name">Mgr. Emília Pischová</span>
                    <span className="review-school">ZŠ Horné Rakovce, Turčianske Teplice</span>
                  </div>
                </div>
              </article>

              <article className="review-card">
                <span className="review-mark" aria-hidden="true">„</span>
                <div className="review-body">
                  <div className="review-stars">★★★★★</div>
                  <p className="review-quote-text">Program bol výborne pripravený, aktivity boli pestré a deti si ich užívali. Komunikácia s animátormi je výborná.</p>
                  <div className="review-attribution">
                    <span className="review-name">PaedDr. Juhariová</span>
                    <span className="review-school">ZŠ Beethovenova, Nitra</span>
                  </div>
                </div>
              </article>

              <article className="review-card">
                <span className="review-mark" aria-hidden="true">„</span>
                <div className="review-body">
                  <div className="review-stars">★★★★★</div>
                  <p className="review-quote-text">Vedenie ZŠ Kostolné Kračany ocenilo, že Bombovo zohľadnilo všetky vopred dohodnuté požiadavky, venovalo pozornosť detailom a počas pobytu reagovalo profesionálne a flexibilne. „Komunikácia bola počas celej prípravy aj pobytu výborná.“</p>
                  <div className="review-attribution">
                    <span className="review-name">Riaditeľ</span>
                    <span className="review-school">ZŠ Kostolné Kračany</span>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <p>V recenziách sa opakujú rovnaké veci, ktoré pri výbere partnera ocenil aj Penzión Lagáň.</p>

          <p>Pripravený program, rýchla komunikácia, ochota a tím, ktorý vie reagovať aj na nečakané požiadavky školy.</p>

          <h2>Garancia vrátenia peňazí pre rodičov</h2>

          <p>CK Bombovo počíta aj so situáciami, ktoré rodičia ani škola nedokážu ovplyvniť.</p>

          <p>Ak dieťa pre chorobu na pobyt vôbec nenastúpi, rodičom sa vráti zaplatená suma.</p>

          <p>Ak musí z pobytu odísť skôr, dostanú späť pomernú časť za nevyužité dni.</p>

          <p>Rodičia tak neplatia za dni, ktoré dieťa pre zdravotné dôvody nemohlo na škole v prírode stráviť.</p>

          <p>Škola si navyše môže objednať komplexné cestovné poistenie, ktoré zahŕňa storno, prerušenie cesty, úraz aj zodpovednosť za škodu.</p>

          <div className="mid-cta-box" id="scroll-trigger">
            <div className="mid-cta-badge">
              <span className="amount">-30 €</span>
              <span className="unit">na dieťa</span>
            </div>
            <div className="mid-cta-content">
              <p>CK Bombovo aktuálne ponúka školám zľavu 30 € na každé dieťa pri rezervácii pobytu na školský rok 2026/27.</p>
              <p>Počet dostupných termínov je obmedzený. Vyberte si preto ten svoj skôr, než ho obsadí iná škola.</p>
              <div className="cta-btn-wrap">
                <a href={ctaUrl} data-advertorial-cta="mid" className="cta-btn">ZÍSKAŤ CENOVÚ PONUKU SO ZĽAVOU &rarr;</a>
              </div>
            </div>
          </div>

          <h2>Koľko stojí škola v prírode v Penzióne Lagáň?</h2>

          <p>Päťdňový pobyt je dostupný v termínoch od apríla do júna.</p>

          <p>V základnej cene je zahrnuté:</p>

          <ul>
            <li>ubytovanie na štyri noci v dvoj- až štvorlôžkových izbách s vlastnou sprchou a toaletou,</li>
            <li>plná penzia so stravou päťkrát denne a celodenným pitným režimom,</li>
            <li>jeden dospelý pedagogický dozor zdarma na každých 10 platiacich detí,</li>
            <li>rovnaká cena za pevné lôžko aj prístelku,</li>
            <li>miestny poplatok za ubytovanie.</li>
          </ul>

          <h2>Voliteľné služby</h2>

          <ul>
            <li>animačný program od 14:00 do 21:00 v celkovom rozsahu 28 hodín za príplatok 55 € na dieťa,</li>
            <li>celodenný animačný program za príplatok 65 € na dieťa,</li>
            <li>Bombový balíček s lukostreľbou, darčekom a odmenou pre učiteľku za príplatok 35 € na dieťa,</li>
            <li>zdravotník CK Bombovo s lekárničkou na celý pobyt za 590 € pre skupinu,</li>
            <li>komplexné cestovné poistenie ECP za 4,50 € na dieťa.</li>
          </ul>

          <h2>Zľava 30 € pri rezervácii školy v prírode</h2>

          <p>Štandardná cena päťdňového pobytu v Penzióne Lagáň je 225 € na dieťa.</p>

          <p>Aktuálne môže vaša škola získať zľavu 30 € a absolvovať celý pobyt za 195 € na dieťa.</p>

          <p>Počet dostupných termínov je obmedzený.</p>

          <div className="offer-box">
            <div className="offer-title">Cenová ponuka so zľavou 30 €</div>
            <p>Škola v prírode v Penzióne Lagáň za <strong>195 € na dieťa</strong> namiesto 225 €.</p>
            <p className="offer-note">Počet dostupných termínov je obmedzený.</p>
          </div>

          <h2>Ako získať cenovú ponuku?</h2>

          <p>Kliknite na tlačidlo nižšie a napíšte nám približný počet detí, počet učiteliek a preferovaný termín alebo mesiac.</p>

          <p>Uveďte aj to, či máte záujem o animačný program, Bombový balíček, zdravotníka alebo poistenie.</p>

          <p>Tím CK Bombovo podľa toho pripraví cenovú ponuku priamo pre vašu školu a ozve sa vám s dostupnými možnosťami.</p>

          <div className="cta-btn-wrap"><a href={ctaUrl} data-advertorial-cta="final" className="cta-btn">ZÍSKAŤ CENOVÚ PONUKU SO ZĽAVOU &rarr;</a></div>

        </article>
      </div>

      <div style={{ background: '#f2f2f2', borderTop: '1px solid #ddd', padding: '14px 24px', marginTop: '40px', fontFamily: 'Arial,sans-serif', fontSize: '11px', color: '#888', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <span>© 2026 Lepší Rodič. Všetky práva vyhradené.</span>
        <span style={{ textAlign: 'right' }}>Toto je propagovaný článok. Nie je to spravodajský článok, blogový príspevok ani nezávislá redakčná recenzia.</span>
      </div>

      <div className="sticky-cta" id="sticky-cta">
        <a href={ctaUrl} data-advertorial-cta="sticky" className="sticky-cta-link">👉 Získať ponuku so zľavou 30 €</a>
      </div>
    </>
  )
}
