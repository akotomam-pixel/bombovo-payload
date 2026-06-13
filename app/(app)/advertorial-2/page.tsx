import { after } from 'next/server'
import { headers } from 'next/headers'
import { Pool } from 'pg'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Firma s detskými tábormi vyhlásila vojnu sociálnym sieťam | Lepší Rodič',
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
  const p = new URLSearchParams({ to, source: 'advertorial-2' })
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
    margin-bottom: 10px;
}
.article-subheadline {
    font-size: 22px;
    font-weight: 700;
    color: #111;
    margin-bottom: 14px;
    line-height: 1.7;
}
.article-subheadline .highlight {
    background: #F5C518;
    padding: 2px 5px;
    display: inline;
}
.article-byline {
    font-size: 13px;
    color: #777;
    margin-bottom: 20px;
    font-style: italic;
    padding-bottom: 14px;
    border-bottom: 1px solid #eee;
}

.photo-slot {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 20px 0 6px;
    background: #D4D0CB;
    position: relative;
}
.photo-slot-inner {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.photo-slot img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}
.photo-caption {
    font-size: 12px;
    color: #999;
    font-style: italic;
    margin-bottom: 18px;
    align-self: flex-start;
    margin-top: 5px;
}

.main-col p {
    margin-bottom: 28px;
    color: #333;
}
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
.blockq {
    border-left: 3px solid #ccc;
    padding: 6px 0 6px 18px;
    margin: 18px 0;
    color: #444;
    font-style: italic;
}
.blockq p { margin-bottom: 16px; }
.blockq p:last-child { margin-bottom: 0; }
.review-quote {
    font-style: italic;
    margin: 4px 48px 28px;
    color: #444;
    padding: 0;
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

.comments-section {
    margin-top: 40px;
    border-top: 2px solid #eee;
    padding-top: 24px;
    font-family: Arial, sans-serif;
}
.comments-section h3 {
    font-size: 16px;
    font-weight: 700;
    color: #333;
    margin-bottom: 16px;
    font-family: Arial, sans-serif;
}
.comment-input {
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 20px;
    padding: 10px 18px;
    font-size: 14px;
    color: #999;
    margin-bottom: 24px;
    background: #f9f9f9;
    font-family: Arial, sans-serif;
}
.comment-item {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    align-items: flex-start;
}
.comment-avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #C4C4C4;
    flex-shrink: 0;
    overflow: hidden;
}
.comment-avatar img { width: 100%; height: 100%; object-fit: cover; }
.comment-body { flex: 1; }
.comment-name {
    font-weight: 700;
    font-size: 14px;
    color: #1a73e8;
    margin-bottom: 3px;
}
.comment-text {
    font-size: 14px;
    color: #333;
    line-height: 1.5;
    margin-bottom: 4px;
}
.comment-meta {
    font-size: 12px;
    color: #999;
}
.comment-meta span { margin-right: 12px; cursor: pointer; }
.comment-meta span:hover { color: #555; }
.comment-reply {
    margin-top: 14px;
    margin-left: 20px;
    padding-left: 12px;
    border-left: 2px solid #eee;
}

@media (max-width: 760px) {
    .article-headline { font-size: 30px; }
    .site-header img.logo { height: 72px; }
}
`

const META_PIXEL_JS = `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1406524862988780');
fbq('track', 'PageView');
fbq('track', 'ViewContent', {
    content_name: 'Advertorial - Letne tabory',
    currency: 'EUR',
    value: 360
});
`

const POSTHOG_JS = `
!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString()+" (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys getNextSurveyStep onSessionId setPersonPropertiesForFlags".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
posthog.init('phc_rYQLAwQkFqPLRgBY64LopKaxHQeiZ6uBFNcN69NhoRq7', { api_host: 'https://eu.i.posthog.com' });
`

const DATE_SCRIPT = `
(function() {
    var months = ['januára','februára','marca','apríla','mája','júna','júla','augusta','septembra','októbra','novembra','decembra'];
    var d = new Date();
    var el = document.getElementById('byline-date');
    if (el) el.textContent = d.getDate() + '. ' + months[d.getMonth()] + ' ' + d.getFullYear();
})();
`

const CLICK_TRACKING_SCRIPT = `
(function() {
    document.querySelectorAll('a[href*="/api/go"]').forEach(function(link) {
        link.addEventListener('click', function() {
            if (window.posthog) posthog.capture('advertorial_clicked', { advertorial: 'advertorial-2' });
            if (typeof fbq !== 'undefined') fbq('trackCustom', 'CTAClick');
        });
    });
})();
`

export default async function Advertorial2Page({
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
  const goUrl = (to: string) => buildGoUrl(to, utm)

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
        ['view', 'advertorial-2', null, utm.utm_source||null, utm.utm_medium||null, utm.utm_campaign||null, utm.utm_content||null, utm.fbclid||null, ip||null, userAgent||null, referrer||null]
      )
    } catch (err) {
      console.error('[advertorial-2] view tracking failed:', err)
    }
  })

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <script dangerouslySetInnerHTML={{ __html: META_PIXEL_JS }} />
      <noscript>
        <img height={1} width={1} style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=1406524862988780&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>

      <div className="top-bar">Propagačný článok</div>

      <header className="site-header">
        <div className="header-inner">
          <img className="logo" src="/advertorial-2/images/logo.png" alt="Lepší Rodič — Rodičovský Blog" />
        </div>
      </header>

      <div className="breadcrumb">
        <a href="#">Správy</a> &rsaquo; <a href="#">Rodina</a> &rsaquo; <span>CK Bombovo</span>
      </div>

      <div className="page-wrap">
        <article className="main-col">

          <h1 className="article-headline">Firma s detskými tábormi vyhlásila vojnu sociálnym sieťam</h1>
          <p className="article-subheadline"><span className="highlight">„Kradnú deťom leto,"</span> hovorí riaditeľka Patrícia Mlyneková</p>
          <p className="article-byline" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'nowrap' }}>
            <img src="/advertorial-2/images/photo-18.jpg" alt="Doda Ullerová" style={{ width: '54px', height: '54px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontStyle: 'normal', fontWeight: 600, color: '#111', fontSize: '14px', lineHeight: '1.3' }}>Doda Ullerová – Blogerka, Lepší Rodič</span>
              <span style={{ fontSize: '13px', color: '#777', lineHeight: '1.3' }}><span id="byline-date"></span> &nbsp;·&nbsp; 67&nbsp;821 Videní 🔥</span>
            </span>
          </p>
          <script dangerouslySetInnerHTML={{ __html: DATE_SCRIPT }} />

          <img src="/advertorial-2/images/photo-1.jpg" alt="" style={{ width: '100%', display: 'block', margin: '20px 0 6px' }} />

          <p><strong>Keď pred rokmi prišli do našich životov telefóny, nikto netušil, aký veľký dopad to bude mať na naše deti.</strong></p>

          <p>Nikto nepredpokladal, že z novej generácie sa stanú deti, ktoré nevedia prežiť deň bez telefónu. Deti, ktoré trávia celé leto doma. Scrollovaním. Samé.</p>

          <p>Prekvapivo, práve jedna slovenská cestovná kancelária s detskými tábormi sa rozhodla postaviť proti tomuto trendu.</p>

          <p>Vyhlásila vojnu sociálnym sieťam za to, že kradnú deťom detstvo, budúcnosť a potenciál, ktorý v nich je.</p>

          <h2>„Pracujeme s deťmi už viac ako 26 rokov. Ale nikdy to nebolo také zlé ako dnes."</h2>

          <p>„Deti v dnešnej dobe trávia viac času sledovaním YouTube, Instagramu alebo TikToku, ako vonku s kamarátmi.</p>

          <p>Hovorí Patrícia Mlyneková — riaditeľka CK Bombovo.</p>

          <p>Keď sa pozriete von na ulicu, už to nie je také ako kedysi, keď sa deti hrali a šantili bez prestávky.</p>

          <p>Osobne si myslím, že deti týmto správaním prichádzajú o rozvoj svojich talentov a oberajú sa tak o šancu na lepšiu budúcnosť.</p>

          <p>Kvôli digitálnemu svetu nevedia nadviazať skutočné vzťahy s kamarátmi, nevedia sa hrať vonku v prírode. A čo je najhoršie, ani si to neuvedomujú.</p>

          <video autoPlay loop muted playsInline loading="lazy" style={{ width: '100%', display: 'block', margin: '20px 0 6px' }}>
            <source src="/advertorial-2/images/photo-2.mp4" type="video/mp4" />
          </video>

          <p>Keďže pracujem s deťmi už roky, vidím, ako sa tento trend zhoršuje každý jeden rok.</p>

          <p>Deti sú smutnejšie, majú viac úzkostí, depresií, a nevedia komunikovať s rovesníkmi. A navyše strácajú sebavedomie a sociálne zručnosti, ktoré sú kľúčové pre ich budúcnosť.</p>

          <p>Každý rok, ktorý strávia s telefónom, je rok, ktorý už nikdy nedostanú späť. Rok bez skutočných zážitkov. Bez skutočných priateľstiev. Bez momentov, na ktoré sa pamätá celý život.</p>

          <p>Chceme, aby sa deti vrátili k starým návykom, kedy čas netrávia cez leto na telefóne alebo počítači, ale trávia ho vonku v prírode s kamarátmi."</p>

          <img src="/advertorial-2/images/photo-3.jpg" loading="lazy" alt="" style={{ width: '100%', display: 'block', margin: '20px 0 6px' }} />

          <h2>Nie je to však vina rodičov</h2>

          <p>Väčšina ľudí by zničené detstvo dávala za vinu rodičom, no my si myslíme pravý opak.</p>

          <p>Aj keď je pravda, že rodičia nemôžu s deťmi tráviť toľko času ako v minulosti, nie je to ich chyba.</p>

          <p>Dnešná doba od rodiča vyžaduje viac hodín v práci, viac povinností a oveľa viac stresu ako kedysi.</p>

          <p>Rodičia nemajú možnosť zabezpečiť svojim deťom leto plné zážitkov na ktoré budú spomínať do konca života.</p>

          <p>Nie preto, že by nechceli. Ale preto, že jednoducho nemajú čas. A to ich bolí najviac.</p>

          <h2>Letné tábory sa tak stali jedným z mála spôsobov ako dať deťom leto plné zážitkov v prírode a vyhrať vojnu s technológiou.</h2>

          <img src="/advertorial-2/images/photo-4.jpg" loading="lazy" alt="" style={{ width: '100%', display: 'block', margin: '20px 0 6px' }} />

          <p>Väčšina rodičov sa snaží aj napriek pracovnej vyťaženosti vymyslieť ako dať deťom leto plné zážitkov. Vozia deti k starým rodičom, berú ich na rodinnú dovolenku, organizujú výlety cez víkend.</p>

          <p>Ale aj keď tieto riešenia čiastočne pomôžu, každé jedno dieťa si so sebou berie telefón alebo inú formu modernej technológie. Takže, aj keď sa rodič snaží dieťaťu spraviť v lete program a dať mu zážitok, tak dieťa z toho leta skoro nič nemá.</p>

          <p>Žiadnych nových kamarátov, žiadne dobrodružstvo, žiadne zážitky, ktoré by si pamätalo.</p>

          <p>A tak sa letné tábory stali jedným z mála miest, kde deti skutočne majú šancu zažiť leto, na ktoré nikdy nezabudnú.</p>

          <ul>
            <li>Deti sa vrátia domov s novými kamarátmi, ktorých by inak nikdy nespoznali.</li>
            <li>Zažijú dobrodružstvo v prírode, ktoré na žiadnej obrazovke nenájdu.</li>
            <li>Vybudujú si sebavedomie, ktoré im zostane na celý život.</li>
            <li>Naučia sa byť samostatné bez toho, aby potrebovali rodiča pri každom kroku.</li>
            <li>Naučia sa spolupracovať a komunikovať s ľuďmi, ktorých predtým nepoznali.</li>
            <li>A o desať rokov budú stále rozprávať o lete, ktoré zažili na tábore.</li>
          </ul>

          <p>A nie sú to len prázdne slová. Výskumy ukazujú, že až 92% detí uviedlo, že im tábor pomohol vybudovať sebavedomie a pozitívny vzťah k sebe samému. (Zdroj: <a href="https://www.acacamps.org/parents-families/benefits-camp/value-camp">American Camp Association</a>)</p>

          <p>A až 65% detí zaznamenalo výrazný rast v oblasti sociálnych vzťahov a začlenenia sa do kolektívu. (Zdroj: <a href="https://www.ccamping.org/s/CSCRP-Phase-3-Final-Report.pdf">University of Waterloo</a>)</p>

          <h2>Zážitky z tábora pretrvávajú ešte dlho po jeho skončení</h2>

          <img src="/advertorial-2/images/photo-5.jpg" loading="lazy" alt="" style={{ width: '100%', display: 'block', margin: '20px 0 6px' }} />

          <p>Deti si zo zážitkov z tábora odnášajú pozitívne spomienky na detstvo počas celého života, čo má pozitívny dopad na ich budúcnosť.</p>

          <p>Vybudované sebavedomie a zručnosti, ktoré sa na tábore naučili sa im vracajú do pamäti dlho po jeho skončení.</p>

          <p>A čo je najdôležitejšie, deti si odnášajú priateľstvá, ktoré trvajú ďaleko za hranice jedného týždňa.</p>

          <div className="blockq">
            <p>„Z našich táborov v Bombove si deti každoročne odnášajú kamarátstva ktoré trvajú celý rok. Prídu na tábor sami, jeden dva dni sa oťukávajú a potom už nevedia prestať rozprávať a behať.</p>
            <p>Veľa krát sa nám stalo, že sa vytvorila taká silná partia detí, že sa stretávali ešte dlho aj po skončení tábora.</p>
            <p>A čo nás teší najviac, vidíme ako deti ktoré k nám prichádzajú hanblivé a uzavreté, odchádzajú o týždeň neskôr ako sebavedomé a otvorené."</p>
          </div>

          <img src="/advertorial-2/images/photo-6.jpg" loading="lazy" alt="" style={{ width: '100%', display: 'block', margin: '20px 0 6px' }} />

          <h2>V redakcii sa však pýtame: „Oplatí sa pre rodičov kúpiť týždenný tábor?"</h2>

          <p>Týždeň letného tábora stojí u väčšiny cestovných kancelárií na Slovensku od 400€ do 500€ za týždeň. No to nie je vždy konečná cena, ktorú rodič zaplatí.</p>

          <p>U mnohých poskytovateľov si rodič musí priplatiť za veci, ktoré by mal tábor obsahovať automaticky. Výlety počas týždňa nie sú v cene. Tričko s logom tábora nie je v cene.</p>

          <p>Niektoré aktivity, ktoré sú súčasťou programu taktiež nie sú v cene. <strong>Rodič ktorý si myslel že zaplatil 450€ za tábor na konci zistí, že skutočná suma bola bližšie k 600€.</strong></p>

          <p>Riaditeľka cestovnej kancelárie Bombovo sa rozhodla povedať stop týmto nespravodlivým praktikám a ponúknuť rodičom tábor za oveľa nižšiu cenu ako by ho našli inde.</p>

          <div className="blockq">
            <p>„U nás v Bombove sa deťom snažíme dopriať leto, na ktoré nikdy nezabudnú a bojujeme tak proti technológiám, ktoré ničia deťom budúcnosť.</p>
            <p>Nechceme, aby cena tábora bola niečo, čo rodiča odradí od kúpy tábora pre svoje dieťa. Snažíme sa aby si každý vedel dovoliť kvalitný týždenný tábor bez toho aby museli platiť 600€."</p>
          </div>

          <p>Tábory CK Bombovo sú jedny z mála, ktoré stále stoja priemerne len <strong>360€ na dieťa</strong>. A čo je najlepšie, táto suma je konečná. Žiadne príplatky, žiadne skryté poplatky. Tričko aj všetky výlety sú v cene tábora, čo robí Bombovo oproti konkurencii často aj o <strong>160€ lacnejším</strong>.</p>

          <p>Takže aj keď tábory na Slovensku nie sú najlacnejšie, CK Bombovo ich robí dostupnými pre každého rodiča.</p>

          <img src="/advertorial-2/images/photo-7.jpg" loading="lazy" alt="" style={{ width: '100%', display: 'block', margin: '20px 0 6px' }} />

          <p>A tak sa úspešne už roky snaží bojovať proti tomu, aby deti trávili leto za telefónom, a ponúka im skutočné zážitky a nové priateľstvá vonku v prírode.</p>

          <h2>Čo nás v redakcii na CK Bombovo zaujalo najviac?</h2>

          <p>Najviac nás zaujal fakt, že CK Bombovo má neuveriteľnú návratnosť <strong>až 86% detí na letných táboroch</strong>. To znamená, že 8 z 10 detí sa vráti na tábor do Bombova minimálne ešte raz po tom, čo tam boli prvýkrát.</p>

          <p>Keď sa dieťa chce na tábor vrátiť, je to najlepší dôkaz toho, že sa tam cítilo dobre. A práve táto 86% návratnosť hovorí za Bombovo viac ako akákoľvek reklama.</p>

          <div className="offer-box">
            <div className="offer-title">ŠPECIÁLNA PONUKA PRE NAŠICH ČITATEĽOV</div>
            <p>CK Bombovo sa rozhodlo ponúknuť všetkým čitateľom nášho článku zľavový kód v hodnote <strong>20€</strong> na letný tábor v roku 2026. <strong style={{ color: '#D00000' }}>Čím ich robí ešte o niečo lacnejším ako konkurencia.</strong></p>
            <p style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '3px', color: '#000', margin: '14px 0' }}>KÓD: LT2026</p>
            <p>Ak chcete zľavu využiť, kliknite na tlačidlo nižšie, vyberte si jeden z voľných táborov a zadajte kód <span style={{ color: '#D00000', fontWeight: 700 }}>„LT2026"</span> pri vyplnení registračného formulára.</p>
            <p className="offer-note"><strong>P.S. Vzhľadom na vysoký dopyt po táboroch CK Bombovo v roku 2026 je táto zľava dostupná len pre prvých 100 zákazníkov. Odporúčame neváhať a využiť ju čím skôr.</strong></p>
            <div className="cta-btn-wrap" style={{ margin: '18px 0 0' }}>
              <a href={goUrl('/letne-tabory')} className="cta-btn">Využite zľavu 20€ &rarr;</a>
            </div>
          </div>

          <h2>Zo stoviek recenzií na Facebooku CK Bombovo sme vybrali tie, ktoré nás najviac oslovili</h2>

          <img src="/advertorial-2/images/photo-9.jpg" loading="lazy" alt="" style={{ width: '100%', display: 'block', margin: '20px 0 6px' }} />

          <p>Za 26 rokov úspešného pôsobenia dokázala CK Bombovo nadchnúť viac ako 50 000 detí. A stovky rodičov sa rozhodli napísať recenziu po tom, čo sa ich dieťa vrátilo domov spokojné.</p>

          <p>Napríklad mamina Emma Hudáková napísala:</p>

          <p className="review-quote">„Už druhý rok môžem Bombovo len odporučiť. Prvý rok tábor Harry Potter, tento rok Babinec. Dcéra prišla nadšená. Nádherné prostredie, super program, animátori, jedlo a čo je najdôležitejšie zážitky a spomienky." — Emma Hudáková</p>

          <p>Jej dcéra sa na tábory CK Bombovo vrátila dva roky za sebou. A podľa interných informácií má už tábor zaregistrovaný aj na tento rok. Skvelí animátori a prostredie jej pomohli vytvoriť spomienky na celý život, a preto sa tam rada vracia každý jeden rok.</p>

          <p>Andrea Danková napísala:</p>

          <p className="review-quote">„Tešíme sa o rok znova. Tentokrát pôjde syn k vám aj v júli, aj v auguste. Už neskúšame iné tábory, ste najlepší a určite odporúčame každému. Žiadna nuda a skvelý prístup k deťom." — Andrea Danková</p>

          <p>Kvalitné tábory nepotrebujú konkurenciu. Spokojné deti sa na ne vracajú každý jeden rok.</p>

          <p>Dcéra Alexandry Bielikovej bola na tábore prvýkrát a jej mama napísala toto:</p>

          <p className="review-quote">„Dcéra bola prvý raz v tábore a vrátila sa úplne nadšená. Všetko si chválila, ubytovanie, stravu, program, animátorov. O rok chce ísť určite znova." — Alexandra Bieliková</p>

          <p>Pre CK Bombovo je dôležité, aby aj deti ktoré prídu na tábor prvýkrát odchádzali spokojné. A z odpovedí rodičov je jasné, že sa im to darí.</p>

          <h2>Kroky ktoré musíte urobiť aby ste dali svoje dieťa na tábor</h2>

          <p>Napriek tomu, že kúpa tábora sa môže zdať zložitá, CK Bombovo robí tento proces úplne jednoduchým.</p>

          <p>Jediné, čo stačí spraviť je ísť na ich webstránku <a href={goUrl('/letne-tabory')}>www.bombovo.sk</a> a vybrať si jeden zo 17 táborov ktoré majú v ponuke.</p>

          <p>Každý tábor sa nesie v inej téme a je určený pre rôzne vekové kategórie. Či už je tábor akčný, náučný, umelecký, teenagerský alebo čisto strávený v lese v prírode, každý rodič si nájde ten správny pre povahu svojho dieťaťa.</p>

          <p>CK Bombovo tento proces robí ešte jednoduchším vďaka ich <strong>„Hľadáčiku táboru"</strong> na webe — rodič jednoducho zadá vek dieťaťa, termín ktorý mu vyhovuje a typ tábora ktorý hľadá a okamžite získa zoznam táborov ktoré presne zodpovedajú jeho požiadavkám.</p>

          <img src="/advertorial-2/images/photo-10.png" loading="lazy" alt="" style={{ width: '100%', display: 'block', margin: '20px 0 6px' }} />

          <p>Jediné čo stačí urobiť po vybratí tábora je rezervovať si termín, ktorý vám cez leto najviac vyhovuje a vyplniť rezervačný formulár.</p>

          <p>Ich tím sa už o všetko postará a zariadí, aby boli všetky dokumenty vybavené.</p>

          <h2>Dva tábory CK Bombovo sa podarilo vypredať už v apríli</h2>

          <p>Tábory sa zvyčajne vypredávajú v máji. No aj tak CK Bombovo dokázalo vypredať už dva z ich najpredávanejších táborov ešte v apríli.</p>

          <p>Aby sa deti na chatkách a izbách netlačili, museli výrazne obmedziť kapacitu táborov. Chcú totiž aby sa každé dieťa cítilo dobre a dostalo plnú pozornosť animátorov.</p>

          <p>To len dokazuje veľký záujem rodičov v dnešnej dobe dať deti na kvalitný tábor, ktorý deťom niečo do budúcnosti dá. Presne taký, aký robí CK Bombovo.</p>

          <img src="/advertorial-2/images/photo-11.jpg" loading="lazy" alt="" style={{ width: '100%', display: 'block', margin: '20px 0 6px' }} />

          <h2>Špeciálna ponuka pre našich čitateľov</h2>

          <p>V rámci ich boja proti sociálnym sieťam sa CK Bombovo rozhodlo darovať všetkým našim čitateľom zľavový kód v hodnote 20€ na ich letné tábory v roku 2026.</p>

          <p style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '3px', color: '#111' }}>KÓD: LT2026</p>

          <p>Ak chcete dať dieťa na letný tábor, my veríme, že neexistuje lepšia možnosť ako ísť v lete na tábor s CK Bombovo.</p>

          <p>Neváhajte a zaregistrujte svoje dieťa na letný tábor s kódom <strong style={{ color: '#D00000' }}>„LT2026"</strong>. Doprajte mu leto, na ktoré bude spomínať do konca života. Uistite sa, že to urobíte čím skôr, kým sa všetky tábory CK Bombovo nevypredajú.</p>

          <div className="cta-btn-wrap" style={{ marginBottom: '48px' }}>
            <a href={goUrl('/letne-tabory')} className="cta-btn">Využite zľavu 20€ &rarr;</a>
          </div>

          <div className="comments-section">
            <h3>Komentáre (47)</h3>
            <input className="comment-input" type="text" placeholder="Napísať komentár..." readOnly />

            <div className="comment-item">
              <div className="comment-avatar"><img src="/advertorial-2/images/photo-12.jpg" alt="" /></div>
              <div className="comment-body">
                <div className="comment-name">Mária Horváthová</div>
                <div className="comment-text">Práve som zaregistrovala dcéru na júlový tábor a použila kód LT2026. Celý proces bol veľmi jednoduchý. Dcéra sa nevie dočkať!</div>
                <div className="comment-meta"><span>Páči sa mi · 23</span><span>Odpovedať</span><span>14 min</span></div>
              </div>
            </div>

            <div className="comment-item">
              <div className="comment-avatar"><img src="/advertorial-2/images/photo-13.jpg" alt="" /></div>
              <div className="comment-body">
                <div className="comment-name">Tomáš Kováč</div>
                <div className="comment-text">Môj 14-ročný syn bol vlani na Bombove prvýkrát a vrátil sa sebavedomejší. Tento rok ide znova aj s mladším bratom, ktorý ide na tábor prvýkrát. Veľmi odporúčam.</div>
                <div className="comment-meta"><span>Páči sa mi · 41</span><span>Odpovedať</span><span>52 min</span></div>
                <div className="comment-reply">
                  <div className="comment-item" style={{ marginBottom: 0 }}>
                    <div className="comment-avatar" style={{ width: '32px', height: '32px' }}><img src="/advertorial-2/images/photo-14.jpg" alt="" /></div>
                    <div className="comment-body">
                      <div className="comment-name">Jana Mrázová</div>
                      <div className="comment-text">Náš syn bol tam 3 roky za sebou. Každý rok hovorí, že to bol najlepší tábor v živote.</div>
                      <div className="comment-meta"><span>Páči sa mi · 18</span><span>Odpovedať</span><span>38 min</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="comment-item">
              <div className="comment-avatar"><img src="/advertorial-2/images/photo-15.jpg" alt="" /></div>
              <div className="comment-body">
                <div className="comment-name">Katarína Blaho</div>
                <div className="comment-text">Toto je presne to, čo dnešné deti potrebujú. Bez telefónu, vonku v prírode, s kamarátmi. Krásne napísaný článok, ďakujem redakcii!</div>
                <div className="comment-meta"><span>Páči sa mi · 35</span><span>Odpovedať</span><span>1 hod</span></div>
              </div>
            </div>

            <div className="comment-item">
              <div className="comment-avatar"><img src="/advertorial-2/images/photo-16.jpg" alt="" /></div>
              <div className="comment-body">
                <div className="comment-name">Zuzana Šimková</div>
                <div className="comment-text">86% návratnosť je naozaj impozantné číslo. Väčšina firiem by sa za taký výsledok nehanbila. Evidentne sa tam deťom páči viac ako kdekoľvek inde.</div>
                <div className="comment-meta"><span>Páči sa mi · 29</span><span>Odpovedať</span><span>2 hod</span></div>
              </div>
            </div>

            <div className="comment-item">
              <div className="comment-avatar"><img src="/advertorial-2/images/photo-17.jpg" alt="" /></div>
              <div className="comment-body">
                <div className="comment-name">Lucia Benková</div>
                <div className="comment-text">Cena 360€ so všetkým v cene je naozaj férovejšia ako konkurencia. Iné tábory nás stáli nakoniec 580€ keď sme spočítali všetky príplatky. Ideme skúsiť Bombovo.</div>
                <div className="comment-meta"><span>Páči sa mi · 17</span><span>Odpovedať</span><span>3 hod</span></div>
              </div>
            </div>
          </div>

        </article>
      </div>

      <div style={{ background: '#f2f2f2', borderTop: '1px solid #ddd', padding: '14px 24px', marginTop: '40px', fontFamily: 'Arial,sans-serif', fontSize: '11px', color: '#888', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <span>© 2026 Lepší Rodič. Všetky práva vyhradené.</span>
        <span style={{ textAlign: 'right' }}>Toto je propagovaný článok. Nie je to spravodajský článok, blogový príspevok ani nezávislá redakčná recenzia.</span>
      </div>

      <script dangerouslySetInnerHTML={{ __html: POSTHOG_JS }} />
      <script dangerouslySetInnerHTML={{ __html: CLICK_TRACKING_SCRIPT }} />
    </>
  )
}
