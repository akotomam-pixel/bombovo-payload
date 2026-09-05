import { after } from 'next/server'
import { headers } from 'next/headers'
import { Pool } from 'pg'
import Image from 'next/image'
import type { Metadata } from 'next'
import AdvertorialTracking from './AdvertorialTracking'

export const metadata: Metadata = {
  title: 'Svetoznáme stredisko olympijských víťazov sa po rokoch vracia k organizovaniu škôl v prírode | Lepší Rodič',
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

const HOTEL_OSRBLIE_PATH = '/skoly-v-prirode/hotel-osrblie'

function buildGoUrl(to: string, utm: Record<string, string>): string {
  const p = new URLSearchParams({ to, source: 'advertorialsvp-1' })
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

export default async function AdvertorialSvp1Page({
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
  const ctaUrl = buildGoUrl(HOTEL_OSRBLIE_PATH, utm)

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
        ['view', 'advertorialsvp-1', null, utm.utm_source||null, utm.utm_medium||null, utm.utm_campaign||null, utm.utm_content||null, utm.fbclid||null, ip||null, userAgent||null, referrer||null]
      )
    } catch (err) {
      console.error('[advertorialsvp-1] view tracking failed:', err)
    }
  })

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,600;0,700;1,400&family=Lora:ital,wght@1,500;1,600&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <AdvertorialTracking
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

          <h1 className="article-headline">Svetoznáme stredisko olympijských víťazov sa po rokoch vracia k organizovaniu škôl v prírode</h1>

          <p className="article-byline">
            <img src="/advertorial-2/images/photo-18.jpg" alt="Lucia Nováková" />
            <span className="article-byline-info">
              <span className="article-byline-name">Lucia Nováková – Blogerka, Lepší Rodič</span>
              <span className="article-byline-meta"><span id="byline-date"></span> &nbsp;·&nbsp; 8&nbsp;942 zhliadnutí 🔥</span>
            </span>
          </p>

          <div className="hero-photo">
            <Image
              src="/advertorialsvp-1/hero.png"
              alt="Hotel Osrblie pri Národnom biatlonovom centre"
              width={1600}
              height={1000}
              priority
              sizes="(max-width: 780px) 100vw, 760px"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          <p className="lead-question"><strong>Predstavte si toto:</strong></p>

          <p>Prídete na školu v prírode do hotela s wellnessom, saunou, vírivkou a bowlingom.</p>

          <p>Hotela ktorý stojí uprostred nádhernej horehronskej prírody len pár krokov od zážitkovej streľby zo vzduchovky pre deti.</p>

          <p>Áno, znie to neuveriteľne.</p>

          <p>No presne túto kombináciu ponúka hotel, ktorý sa nachádza priamo pri Národnom biatlonovom centre.</p>

          <p>A hoci sa v tomto celosvetovo známom stredisku viac ako 10 rokov školy v prírode neorganizovali, mnohé učiteľky si ho dodnes pamätajú ako jedno z najkrajších stredísk na Slovensku.</p>

          <p>Veľkým prekvapením pre mnohé z nich preto bolo, keď sa tento slávny hotel po rokoch opäť objavil v ponuke CK Bombovo pre školský rok 2026/27.</p>

          <p>Pozreli sme sa preto bližšie na to, prečo si učiteľky Hotel Osrblie obľúbili už v minulosti.</p>

          <p>A tiež na to, čo tu dnes čaká ich aj ich žiakov.</p>

          <h2>Prečo si učiteľky Hotel Osrblie pamätajú aj po viac ako 10 rokoch?</h2>

          <p>Hotel Osrblie stojí v pokojnom prostredí Horehronia, obklopený prírodou Nízkych Tatier.</p>

          <p>Pred viac ako 10 rokmi sem učiteľky pravidelne prichádzali so svojimi triedami a mnohé sa na ďalšie pobyty rady vracali.</p>

          <p>Už vtedy totiž ponúkal niečo, čo je pri školách v prírode dodnes vzácne.</p>

          <div className="body-photo">
            <Image
              src="/advertorialsvp-1/photo-2.png"
              alt="Wellness centrum v Hoteli Osrblie"
              width={1200}
              height={800}
              loading="lazy"
              sizes="(max-width: 780px) 100vw, 760px"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          <p>V okolí hotela majú deti dostatok priestoru na pohyb, spoločné hry aj objavovanie prírody. Môžu sa vyšantiť na vonkajšom ihrisku, vyraziť na výlet po Horehroní alebo zakončiť deň spoločným posedením pri opekačke.</p>

          <p>To však stále nie je to najvýnimočnejšie, čo tu deti čaká.</p>

          <p><strong>Zážitkom, ktorý inde len tak nezažijú, je streľba zo vzduchovky v susednom Národnom biatlonovom centre.</strong> Priamo na mieste si tak môžu vyskúšať, aké je to trénovať na mieste olympijskí víťazov.</p>

          <p>Hotel však myslí aj na samotné učiteľky.</p>

          <p><strong>Všetci pedagógovia majú počas pobytu hodinový vstup do wellness centra zdarma.</strong> Po dni plnom detských otázok si tak môžu s kolegyňami sadnúť do teplej vírivky, zohriať sa v saune a konečne sa v pokoji porozprávať o spoločných zážitkoch.</p>

          <p>Vo voľnom čase môžu navyše využiť aj hotelový bowling. A ak si škola zvolí animačný program, animátori sa o deti postarajú počas celého popoludnia a večera.</p>

          <p>Učiteľky si tak namiesto ďalšieho vyčerpávajúceho pobytu môžu školu v prírode konečne užiť spolu so svojimi žiakmi.</p>

          <h2>Čo všetko budú mať deti a učiteľky v Hoteli Osrblie k dispozícii?</h2>

          <div className="body-photo">
            <Image
              src="/advertorialsvp-1/photo-3.png"
              alt="Interiér Hotela Osrblie"
              width={1200}
              height={800}
              loading="lazy"
              sizes="(max-width: 780px) 100vw, 760px"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          <ul className="checklist">
            <li><strong>Hodinový vstup do wellness centra zdarma</strong> pre všetkých pedagógov počas pobytu</li>
            <li><strong>Hotelový bowling</strong> na oddych a spoločné chvíle</li>
            <li><strong>Možnosť doobjednať zážitkovú streľbu zo vzduchovky</strong> v susednom Národnom biatlonovom centre</li>
            <li><strong>Banketovú sálu, konferenčnú miestnosť a multifunkčnú miestnosť</strong> na vyučovanie, hry a spoločný program</li>
            <li><strong>Vnútorný priestor vhodný na loptové hry</strong>, vďaka ktorému program nemusí zastaviť ani nepriaznivé počasie</li>
            <li><strong>Záhradu, detský klub a možnosť spoločného opekania</strong></li>
            <li><strong>Ubytovanie v dvoj- a trojlôžkových izbách</strong> s vlastnou sprchou a toaletou</li>
            <li><strong>Kapacitu až 100 lôžok</strong> aj pre väčšie školské skupiny</li>
            <li><strong>Stravu päťkrát denne a celodenný pitný režim</strong></li>
            <li><strong>Wi-Fi pripojenie</strong> v priestoroch hotela</li>
          </ul>

          <h2>Prečo si Hotel Osrblie pre návrat škôl v prírode vybral práve CK Bombovo?</h2>

          <p>Viac ako 10 rokov sa Hotel Osrblie sústreďoval predovšetkým na svojich pravidelných hostí a školy v prírode sa tu neorganizovali.</p>

          <p>Keď sa ich hotel rozhodol opäť privítať, potreboval partnera, ktorý školám neposkytne iba ubytovanie, ale pomôže učiteľkám aj s prípravou pobytu a zabezpečí deťom kvalitný program.</p>

          <p><strong>Organizovanie škôl v prírode preto Hotel Osrblie zveril práve CK Bombovo. Tá je dnes jedinou cestovnou kanceláriou, ktorá má tento hotel vo svojej ponuke škôl v prírode.</strong></p>

          <p>Za touto dôverou stoja skúsenosti CK Bombovo. Detské pobyty organizuje už viac ako 26 rokov a jej programami prešlo viac než 50 000 detí.</p>

          <p>Pre Hotel Osrblie bol však dôležitý aj promptný a profesionálny prístup, ktorý si CK Bombovo zachováva pri komunikácii s každou školou počas celej organizácie pobytu.</p>

          <p>Hotel Osrblie tak získal skúseného partnera pre svoj návrat medzi školy v prírode.</p>

          <p>Učiteľky zase získali profesionálneho partnera, na ktorého sa môžu s dôverou obrátiť.</p>

          <h2>Čo všetko však CK Bombovo učiteľkám skutočne pomôže zabezpečiť?</h2>

          <div className="body-photo">
            <Image
              src="/advertorialsvp-1/photo-4.jpg"
              alt="Deti počas programu CK Bombovo"
              width={1200}
              height={800}
              loading="lazy"
              sizes="(max-width: 780px) 100vw, 760px"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          <p>Vybrať vhodný hotel je iba prvým krokom. Pred odchodom ešte treba dohodnúť ubytovanie, rozdelenie izieb, stravu, alergie, faktúry, dokumenty a samotný program.</p>

          <p>CK Bombovo vie, že učiteľky to v dnešnej dobe nemajú s vybavovaním školy v prírode vôbec jednoduché. Často ho musia zabezpečiť bez akejkoľvek odmeny či voľna navyše.</p>

          <p>A práve preto sa im CK Bombovo snaží pomáhať všade, kde sa dá.</p>

          <p>Každej učiteľke je už počas vybavovania pridelený konkrétny zamestnanec, ktorý jej je počas celej prípravy k dispozícii telefonicky aj e-mailom, aby jej mohol kedykoľvek poradiť a pomôcť.</p>

          <p>CK Bombovo zároveň komunikuje so strediskom o rozdelení izieb, stravovaní aj praktických požiadavkách školy. Pripraví potrebné faktúry, predvyplní podklady pre regionálny úrad verejného zdravotníctva a zostáva učiteľkám k dispozícii pred školou v prírode, počas nej aj po jej skončení.</p>

          <p>Najväčšiu úľavu však učiteľky pocítia počas samotného pobytu. CK Bombovo je medzi učiteľkami známa najmä vďaka svojim ochotným a vyškoleným animátorom. Ak si škola vyberie animačný program, animátori sa deťom venujú každý deň od 14.00 do 21.00.</p>

          <p>Každý animačný tím vedie hlavný animátor, ktorého v Bombove nazývajú „boss". Ten každý deň komunikuje s učiteľkami a ich požiadavky následne odovzdáva celému animačnému tímu. Dokáže tak priebežne reagovať na pripomienky učiteliek a prispôsobiť program aktuálnym potrebám školy.</p>

          <p>Deti počas programu čakajú originálne, vopred pripravené hry, súťaže, kvízy a športové aktivity. Animátori sú zároveň plne vybavení športovým materiálom pre deti, takže si škola nemusí zbytočne nosiť vlastné vybavenie.</p>

          <p>K programu si môže škola objednať aj Bombový balíček so zážitkovou streľbou zo vzduchovky v Národnom biatlonovom centre a darčekom na pamiatku pre každého účastníka. Balíček navyše obsahuje odmenu 100 € pre pedagógov za každých 10 platiacich detí.</p>

          <p>Kým deti prežívajú popoludnie plné zážitkov, učiteľky si môžu oddýchnuť vo wellness centre, zahrať si bowling alebo si jednoducho na chvíľu vydýchnuť s vedomím, že deti si práve vytvárajú nezabudnuteľné spomienky, ktoré si odnesú domov.</p>

          <p>Pedagógovia tak majú školu v prírode stále pod kontrolou, ale na jej prípravu a priebeh už nemusia zostať samy.</p>

          <h2>Garancia vrátenia peňazí pre rodičov</h2>

          <p>CK Bombovo myslí aj na situácie, ktoré učiteľky ani rodičia nedokážu vopred naplánovať.</p>

          <p>Ak dieťa pre chorobu na pobyt nenastúpi, rodičom sa vráti zaplatená suma za jeho pobyt. Ak musí odísť skôr, dostanú späť pomernú časť peňazí za dni, ktoré už nevyužilo.</p>

          <p>Rodičia tak zaplatia iba za tú časť školy v prírode, ktorú dieťa skutočne absolvovalo.</p>

          <h2>CK Bombovo je medzi učiteľkami rokmi overenou voľbou</h2>

          <div className="body-photo">
            <Image
              src="/advertorialsvp-1/photo-5.png"
              alt="Animátori s učiteľkami"
              width={1200}
              height={800}
              loading="lazy"
              sizes="(max-width: 780px) 100vw, 760px"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          <section className="reviews-section" aria-label="Recenzie učiteliek">
            <div className="reviews-grid">
              <article className="review-card">
                <span className="review-mark" aria-hidden="true">„</span>
                <div className="review-body">
                  <div className="review-stars">★★★★★</div>
                  <p className="review-quote-text">Animačný tím bol úžasný, program bol výborne pripravený a deti sa počas celého pobytu nenudili. Aktivity boli pestré, zábavné a prispôsobené deťom. Veľmi oceňujeme prístup animátorov a celkovú organizáciu. Deti odchádzali plné zážitkov a krásnych spomienok. Ďakujeme za krásny pobyt a skvelý prístup celého tímu. Boli sme veľmi spokojní a budeme sa tešiť na ďalšiu spoluprácu.</p>
                  <div className="review-attribution">
                    <span className="review-name">Mgr. Lea Christovová</span>
                    <span className="review-school">ZŠ SNP, Galanta</span>
                  </div>
                </div>
              </article>

              <article className="review-card">
                <span className="review-mark" aria-hidden="true">„</span>
                <div className="review-body">
                  <div className="review-stars">★★★★★</div>
                  <p className="review-quote-text">Animátori aj ich program boli stopercentne pripravení. Deťom sa venovali, boli trpezliví a program bol bohatý a všestranne zameraný. S Bombovom chodíme už roky a deťom sa domov nechce ísť. Animátori sú empatickí a pracovití. K pedagógom sa správajú zdvorilo a spolupráca s nimi je vždy výborná. Patrí im veľké poďakovanie.</p>
                  <div className="review-attribution">
                    <span className="review-name">Mgr. Judita Ňukovičová</span>
                    <span className="review-school">ZŠ Rajčianska 3, Bratislava</span>
                  </div>
                </div>
              </article>

              <article className="review-card">
                <span className="review-mark" aria-hidden="true">„</span>
                <div className="review-body">
                  <div className="review-stars">★★★★★</div>
                  <p className="review-quote-text">S animačným tímom aj programom sme boli veľmi spokojní. Animátori sa deťom maximálne venovali, boli milí, trpezliví a dokázali vytvoriť výbornú atmosféru. Komunikácia bola počas celej prípravy aj pobytu výborná. Celý tím bol veľmi ochotný a nápomocný. Oceňujem profesionálny prístup, flexibilitu a snahu zabezpečiť, aby všetko prebehlo bez problémov. Určite odporúčam.</p>
                  <div className="review-attribution">
                    <span className="review-name">Riaditeľka školy</span>
                    <span className="review-school">ZŠ Kostolné Kračany</span>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <div className="mid-cta-box" id="scroll-trigger">
            <div className="mid-cta-badge">
              <span className="amount">-30 €</span>
              <span className="unit">na dieťa</span>
            </div>
            <div className="mid-cta-content">
              <p>CK Bombovo aktuálne ponúka školám zľavu 30 € na každé dieťa pri rezervácii pobytu na školský rok 2026/27.</p>
              <p>Počet dostupných termínov je obmedzený. Vyberte si preto ten svoj skôr, než ho obsadí iná škola.</p>
              <div className="cta-btn-wrap">
                <a href={ctaUrl} data-advertorial-cta className="cta-btn">ZÍSKAŤ CENOVÚ PONUKU SO ZĽAVOU &rarr;</a>
              </div>
            </div>
          </div>

          <h2>Koľko stojí škola v prírode v Hoteli Osrblie?</h2>

          <p>Napriek exkluzivite Hotela Osrblie sa CK Bombovo podarilo dohodnúť cenu, ktorá zostáva prijateľná pre školy.</p>

          <p>Počas piatich dní deti vymenia školské lavice za prírodu Horehronia. V plnej cene pritom získajú:</p>

          <ul>
            <li>štyri noci v dvoj- alebo trojlôžkovej izbe s vlastnou kúpeľňou,</li>
            <li>stravu päťkrát denne,</li>
            <li>celodenný pitný režim,</li>
            <li>množstvo priestoru na pohyb,</li>
            <li>vnútorné priestory hotela, ktoré má škola plne k dispozícii.</li>
          </ul>

          <p>Pedagógovia získajú:</p>

          <ul>
            <li>pobyt zdarma pre jedného pedagóga na každých 10 platiacich detí,</li>
            <li>hodinový vstup do wellness centra, kde si môžu po náročnom dni oddýchnuť v saune alebo teplej vírivke.</li>
          </ul>

          <p>Hotel Osrblie preto nie je iba ďalším miestom, kde deti počas školy v prírode prespia a najedia sa.</p>

          <p>Spája päť dní v prírode s dostatkom priestoru na hry, spoločné zážitky a program za každého počasia. Učiteľkám zároveň poskytuje podmienky na to, aby si pobyt mohli užiť spolu so svojimi žiakmi.</p>

          <p>Cena za celý päťdňový pobyt je 215 € za dieťa.</p>

          <h2>Zľava 30 € pri skorej rezervácii</h2>

          <p>Pri skorej rezervácii sa CK Bombovo rozhodla ponúknuť zľavu 30 €. Cena pobytu sa tak znižuje z 215 € na <strong>185 € za dieťa</strong>.</p>

          <p>Na získanie cenovej ponuky so zľavou stačí kliknúť na tlačidlo nižšie. To vás presmeruje na oficiálnu stránku CK Bombovo, kde si vyberiete termín a vyplníte základné údaje o škole.</p>

          <p>Ak presný termín ešte nepoznáte, môžete požiadať o cenovú ponuku aj bez jeho uvedenia. Vyplnenie formulára trvá približne dve minúty a tím CK Bombovo vám následne pripraví ponuku podľa potrieb vašej školy.</p>

          <div className="offer-box">
            <div className="offer-title">Cenová ponuka so zľavou 30 €</div>
            <p>Škola v prírode v Hoteli Osrblie za <strong>185 € na dieťa</strong> namiesto 215 €.</p>
            <p className="offer-note">Počet dostupných termínov je obmedzený.</p>
            <div className="cta-btn-wrap" style={{ margin: '18px 0 0' }}>
              <a href={ctaUrl} data-advertorial-cta className="cta-btn">ZÍSKAŤ CENOVÚ PONUKU SO ZĽAVOU &rarr;</a>
            </div>
          </div>

        </article>
      </div>

      <div style={{ background: '#f2f2f2', borderTop: '1px solid #ddd', padding: '14px 24px', marginTop: '40px', fontFamily: 'Arial,sans-serif', fontSize: '11px', color: '#888', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <span>© 2026 Lepší Rodič. Všetky práva vyhradené.</span>
        <span style={{ textAlign: 'right' }}>Toto je propagovaný článok. Nie je to spravodajský článok, blogový príspevok ani nezávislá redakčná recenzia.</span>
      </div>

      <div className="sticky-cta" id="sticky-cta">
        <a href={ctaUrl} data-advertorial-cta className="sticky-cta-link">👉 Získať ponuku so zľavou 30 €</a>
      </div>
    </>
  )
}
