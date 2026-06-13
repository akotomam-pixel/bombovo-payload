import { after } from 'next/server'
import { headers } from 'next/headers'
import { Pool } from 'pg'
import type { Metadata } from 'next'
import type { CSSProperties } from 'react'

export const metadata: Metadata = {
  title: 'Prihlásila som dcéru na letný tábor na poslednú chvíľu v júli a ľutovala som to celý rok | Lepší Rodič',
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
  const p = new URLSearchParams({ to, source: 'advertorial-3' })
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
    font-size: 18px;
    color: #222;
    background: #fff;
    line-height: 1.85;
    padding-bottom: 80px;
}

a { color: #1a73e8; text-decoration: none; }
a:hover { text-decoration: underline; }

.top-bar {
    background: #111;
    text-align: center;
    padding: 7px 20px;
    font-size: 10px;
    color: #aaa;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-family: Arial, sans-serif;
}

.site-header {
    border-bottom: 1px solid #ddd;
    padding: 14px 24px;
    background: #fff;
}
.site-header img.logo {
    height: 108px;
    width: auto;
    display: block;
    margin: 0;
}

.breadcrumb {
    padding: 8px 0;
    font-size: 12px;
    color: #777;
    border-bottom: 1px solid #eee;
    font-family: Arial, sans-serif;
}
.breadcrumb a { color: #777; }
.breadcrumb a:hover { color: #333; text-decoration: underline; }
.breadcrumb span { color: #333; }

.page-wrap {
    max-width: 1140px;
    margin: 0 auto;
    padding: 0 24px;
}

.content-grid {
    display: flex;
    gap: 44px;
    padding: 28px 0 80px;
}

.main-col {
    flex: 1;
    min-width: 0;
}

.article-headline {
    font-size: 40px;
    font-weight: 700;
    line-height: 1.18;
    color: #111;
    margin-bottom: 14px;
}

.article-subheadline {
    font-size: 20px;
    font-weight: 400;
    font-style: italic;
    color: #444;
    margin-bottom: 10px;
    line-height: 1.5;
}
.article-author-line {
    font-size: 14px;
    color: #555;
    margin-bottom: 20px;
    font-family: Arial, sans-serif;
}

.article-byline {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-bottom: 16px;
    margin-bottom: 22px;
    border-bottom: 1px solid #eee;
}
.byline-avatar {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    background: #C8C4BE;
    flex-shrink: 0;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    color: rgba(0,0,0,0.25);
    letter-spacing: 0.5px;
    text-transform: uppercase;
    font-family: Arial, sans-serif;
}
.byline-avatar img { width: 100%; height: 100%; object-fit: cover; }
.byline-info { display: flex; flex-direction: column; gap: 2px; }
.byline-name { font-weight: 600; color: #111; font-size: 14px; line-height: 1.3; }
.byline-meta { font-size: 13px; color: #777; line-height: 1.3; }

.photo-slot {
    width: 100%;
    background: #D4D0CB;
    display: block;
    margin: 22px 0 6px;
}
.photo-slot span {
    font-size: 11px;
    color: rgba(0,0,0,0.28);
    letter-spacing: 1.5px;
    text-transform: uppercase;
    font-family: Arial, sans-serif;
    display: block;
    text-align: center;
    padding: 80px 0;
}
.photo-slot img {
    width: 100%;
    height: auto;
    display: block;
}

.main-col h2 {
    font-size: 40px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    color: #111;
    margin: 42px 0 22px;
    line-height: 1.2;
}
@media (max-width: 620px) {
    .main-col h2 { font-size: 26px; }
}

.main-col p {
    margin-bottom: 24px;
    color: #333;
}
.main-col p strong { color: #111; }

.blockq {
    border-left: 4px solid #D4D0CB;
    padding: 8px 0 8px 22px;
    margin: 26px 0;
    color: #555;
    font-style: italic;
}
.blockq p { margin-bottom: 12px; }
.blockq p:last-child { margin-bottom: 0; }

.main-col ul {
    margin: 10px 0 26px 0;
    padding: 0;
    list-style: none;
}
.main-col ul li {
    padding: 8px 0 8px 44px;
    position: relative;
    color: #111;
    font-weight: 700;
}
.main-col ul li::before {
    content: '✅';
    position: absolute;
    left: 0;
    top: 4px;
    font-size: 26px;
}

.emoji-item {
    display: flex;
    gap: 14px;
    margin-bottom: 16px;
    align-items: flex-start;
    color: #111;
    font-weight: 700;
    font-size: 20px;
}
.emoji-item .emoji { font-size: 28px; flex-shrink: 0; margin-top: 0px; }

.separator {
    border: none;
    border-top: 2px solid #eee;
    margin: 36px 0;
}

.offer-box {
    background: #F5C518;
    border: 2px solid #D4A800;
    padding: 30px 34px;
    margin: 36px 0;
    text-align: center;
}
.offer-box .offer-title {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #000;
    margin-bottom: 14px;
}
.offer-box p { color: #000; font-size: 17px; margin-bottom: 12px; }
.offer-box .offer-code {
    font-size: 30px;
    font-weight: 700;
    letter-spacing: 5px;
    color: #000;
    margin: 18px 0;
}
.offer-box .offer-note { font-size: 15px; color: #000; font-weight: 700; }

.offer-box-peak {
    background: #FFFBDE;
    border: 1px solid #E0D06A;
    border-radius: 6px;
    overflow: hidden;
    margin: 36px 0;
}
.offer-box-peak-stripe {
    height: 20px;
    background: repeating-linear-gradient(
        -45deg,
        #4BBFBF 0px, #4BBFBF 10px,
        #3AADAD 10px, #3AADAD 20px
    );
}
.offer-box-peak-body {
    padding: 26px 30px 30px;
}
.offer-box-peak-title {
    font-size: 20px;
    font-weight: 700;
    color: #C03030;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 9px;
    line-height: 1.3;
}
.offer-box-peak-body > p {
    color: #222;
    font-size: 17px;
    margin-bottom: 14px;
}
.offer-box-peak ul {
    list-style: none;
    padding: 0;
    margin: 0 0 18px 0;
}
.offer-box-peak ul li {
    padding: 5px 0 5px 32px;
    position: relative;
    color: #222;
    font-size: 16px;
    line-height: 1.5;
}
.offer-box-peak ul li::before {
    content: '✅';
    position: absolute;
    left: 0;
    top: 5px;
    font-size: 16px;
}
.offer-box-peak-plus {
    font-weight: 700;
    font-size: 16px;
    color: #111;
    margin: 6px 0 10px;
}
.offer-box-peak-cta {
    display: block;
    background: #2E9E4F;
    color: #fff;
    text-align: center;
    font-weight: 700;
    font-size: 18px;
    padding: 18px 20px;
    border-radius: 8px;
    text-decoration: none;
    border: none;
    margin-top: 22px;
    transition: background 0.15s;
    font-family: 'Poppins', Arial, sans-serif;
}
.offer-box-peak-cta:hover { background: #249040; text-decoration: none; color: #fff; }

.cta-btn-wide {
    display: block;
    width: 100%;
    background: #2E9E4F;
    color: #fff;
    text-align: center;
    font-weight: 700;
    font-size: 18px;
    padding: 18px 24px;
    border-radius: 8px;
    text-decoration: none;
    border: none;
    transition: background 0.15s;
    font-family: 'Poppins', Arial, sans-serif;
    margin: 20px 0;
}
.cta-btn-wide:hover { background: #249040; text-decoration: none; color: #fff; }

.sticky-cta {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #2E9E4F;
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

.cta-btn-wrap { text-align: center; margin: 20px 0; }
.cta-btn {
    display: inline-block;
    background: #2E9E4F;
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    padding: 16px 48px;
    border-radius: 4px;
    text-decoration: none;
    border: 2px solid #249040;
    transition: background 0.15s;
    font-family: 'Poppins', Arial, sans-serif;
}
.cta-btn:hover { background: #249040; text-decoration: none; color: #fff; }

.review-quote {
    font-style: italic;
    margin: 4px 44px 26px;
    color: #444;
}

.comments-section {
    margin-top: 44px;
    border-top: 2px solid #eee;
    padding-top: 26px;
    font-family: Arial, sans-serif;
}
.comments-section h3 {
    font-size: 16px;
    font-weight: 700;
    color: #333;
    margin-bottom: 16px;
}
.comment-input {
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 20px;
    padding: 10px 18px;
    font-size: 14px;
    color: #999;
    margin-bottom: 26px;
    background: #f9f9f9;
    font-family: Arial, sans-serif;
    outline: none;
    cursor: default;
}
.comment-item {
    display: flex;
    gap: 12px;
    margin-bottom: 22px;
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
.comment-name { font-weight: 700; font-size: 14px; color: #1a73e8; margin-bottom: 3px; }
.comment-text { font-size: 14px; color: #333; line-height: 1.55; margin-bottom: 4px; }
.comment-meta { font-size: 12px; color: #999; }
.comment-meta span { margin-right: 12px; cursor: pointer; }
.comment-meta span:hover { color: #555; }
.comment-reply {
    margin-top: 14px;
    margin-left: 20px;
    padding-left: 14px;
    border-left: 2px solid #eee;
}

.sidebar {
    width: 296px;
    flex-shrink: 0;
}
.sidebar-sticky {
    position: sticky;
    top: 20px;
}
.sidebar-box {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    font-family: Arial, sans-serif;
    box-shadow: 0 2px 16px rgba(0,0,0,0.09);
}
.sidebar-label {
    font-size: 11px;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    padding: 12px 14px 0;
    font-family: Arial, sans-serif;
}
.sidebar-title-row {
    padding: 5px 14px 12px;
    border-bottom: 1px solid #eee;
}
.sidebar-title-row strong {
    font-size: 14px;
    color: #111;
    display: block;
    margin-bottom: 6px;
    line-height: 1.4;
}
.stars-row {
    display: flex;
    align-items: center;
    gap: 5px;
    flex-wrap: wrap;
}
.stars { color: #F5A623; font-size: 15px; letter-spacing: 1px; }
.stars-score { font-weight: 700; font-size: 13px; color: #111; }
.stars-count { color: #777; font-size: 12px; }

.sidebar-img {
    width: 100%;
    height: 185px;
    background: #C5C9CC;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(0,0,0,0.28);
    font-size: 11px;
    letter-spacing: 1px;
    text-transform: uppercase;
    overflow: hidden;
}
.sidebar-img img { width: 100%; height: 100%; object-fit: cover; }

.sidebar-body { padding: 14px; }

.sidebar-checks {
    list-style: none;
    padding: 0;
    margin: 0 0 14px 0;
}
.sidebar-checks li {
    display: flex;
    gap: 9px;
    align-items: flex-start;
    margin-bottom: 9px;
    font-size: 13px;
    color: #333;
    line-height: 1.45;
}
.sidebar-checks li .chk { color: #2E9E4F; font-size: 15px; flex-shrink: 0; margin-top: 0px; font-weight: 700; }

.sidebar-cta {
    display: block;
    background: #2E9E4F;
    color: #fff;
    text-align: center;
    font-weight: 700;
    font-size: 14px;
    padding: 13px 10px;
    border-radius: 4px;
    margin: 4px 0 10px;
    text-decoration: none;
    border: 2px solid #249040;
    transition: background 0.15s;
    line-height: 1.35;
    font-family: Arial, sans-serif;
}
.sidebar-cta:hover { background: #249040; text-decoration: none; color: #fff; }

.sidebar-discount {
    text-align: center;
    font-size: 12px;
    color: #555;
    padding: 4px 0 2px;
    font-family: Arial, sans-serif;
}
.sidebar-discount strong { color: #C03030; font-size: 13px; }

@media (max-width: 920px) {
    .content-grid { flex-direction: column; }
    .sidebar { width: 100%; max-width: 400px; }
    .sidebar-sticky { position: static; }
}
@media (max-width: 620px) {
    .article-headline { font-size: 28px; }
    .main-col h2 { font-size: 22px; }
    .site-header img.logo { height: 72px; }
    body { font-size: 19px; }
    .offer-box { padding: 22px 18px; }
    .cta-btn { padding: 14px 24px; font-size: 16px; }
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
    content_name: 'Advertorial 3 - Letne tabory - Story',
    currency: 'EUR',
    value: 360
});
`

const DATE_SCRIPT = `
(function() {
    var months = ['januára','februára','marca','apríla','mája','júna','júla','augusta','septembra','októbra','novembra','decembra'];
    var d = new Date();
    var el = document.getElementById('byline-date');
    if (el) el.textContent = d.getDate() + '. ' + months[d.getMonth()] + ' ' + d.getFullYear();
})();
`

const STICKY_SCRIPT = `
(function() {
    var trigger = document.getElementById('scroll-trigger');
    var bar = document.getElementById('sticky-cta');
    if (!trigger || !bar) return;
    var shown = false;
    window.addEventListener('scroll', function() {
        var rect = trigger.getBoundingClientRect();
        if (!shown && rect.top < 0) {
            bar.classList.add('visible');
            shown = true;
        } else if (shown && rect.top >= 0) {
            bar.classList.remove('visible');
            shown = false;
        }
    }, { passive: true });
})();
`

const CLICK_TRACKING_SCRIPT = `
(function() {
    document.querySelectorAll('a[href*="/api/go"]').forEach(function(link) {
        link.addEventListener('click', function() {
            if (window.posthog) posthog.capture('advertorial_clicked', { advertorial: 'advertorial-3' });
            if (typeof fbq !== 'undefined') fbq('trackCustom', 'CTAClick');
        });
    });
})();
`

const avatarImg: CSSProperties = { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }
const replyItem: CSSProperties = { marginBottom: 0 }
const replyAvatar: CSSProperties = { width: '36px', height: '36px' }

export default async function Advertorial3Page({
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
        ['view', 'advertorial-3', null, utm.utm_source||null, utm.utm_medium||null, utm.utm_campaign||null, utm.utm_content||null, utm.fbclid||null, ip||null, userAgent||null, referrer||null]
      )
    } catch (err) {
      console.error('[advertorial-3] view tracking failed:', err)
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
        <img className="logo" src="/advertorial-2/images/logo.png" alt="Lepší Rodič — Rodičovský Blog" />
      </header>

      <div className="page-wrap">
        <div className="breadcrumb">
          <a href="#">Správy</a> &rsaquo; <a href="#">Rodina</a> &rsaquo; <span>Tábory</span>
        </div>

        <div className="content-grid">

          <article className="main-col">

            <h1 className="article-headline">Prihlásila som dcéru na letný tábor na poslednú chvíľu v júli a ľutovala som to celý rok.</h1>

            <p className="article-subheadline">Prečítajte si môj príbeh, aby ste neurobili rovnakú chybu.</p>
            <p className="article-author-line">OD — Martina K.</p>

            <div className="photo-slot"><img src="/advertorial-3/images/photo-1.jpg" alt="" loading="eager" /></div>

            <div className="article-byline">
              <div className="byline-avatar"><img src="/advertorial-3/images/character-photo.jpg" alt="Martina K." /></div>
              <div className="byline-info">
                <span className="byline-name">Martina K. &nbsp;·&nbsp; blogerka</span>
                <span className="byline-meta"><span id="byline-date"></span> &nbsp;·&nbsp; 51&nbsp;347 zhliadnutí 🔥</span>
              </div>
            </div>
            <script dangerouslySetInnerHTML={{ __html: DATE_SCRIPT }} />

            <p>Ak práve panicky prezeráte internet a hľadáte, či ešte existuje nejaký tábor, kam by sa vaše dieťa zmestilo v júli... zastavte sa.</p>
            <p>Presne toto som pred pár rokmi robila aj ja.</p>
            <p>A spravila som jednu z najväčších chýb v živote.</p>
            <p>Urobila som totiž to, čo väčšina opatrných a zodpovedných rodičov robí na poslednú chvíľu. Čítala som recenzie. Porovnávala som ceny. Pozerala som si fotky na Instagrame. A povedala som si: „Hlavne nech je niekde a v bezpečí, veď tábor je tábor."</p>
            <p>A potom som prihlásila dcéru na ten nesprávny tábor.</p>
            <p>Na taký, ktorý jej zo života spravil peklo na niekoľko mesiacov. Aj keď sa na začiatku na tábor veľmi tešila.</p>

            <h2>Tábor, ktorý vyzeral dobre „na papieri"</h2>

            <div className="photo-slot"><img src="/advertorial-3/images/photo-2.jpg" alt="" loading="lazy" /></div>

            <p>Nebudem menovať konkrétnu cestovnú kanceláriu. Nejde tu totiž o jednu firmu. Ide o pravidelný podvod, ktorý sa každý rok odohráva.</p>
            <p>Našla som na internete vynikajúco vyzerajúci tábor, ktorý mal stále voľné miesta. Fotky vyzerali dobre. Deti vyzerali šťastne. A program znel v poriadku.</p>
            <p>Pamätám si, že cena bola okolo 200 eur. Mala som pocit, akoby som vyhrala jackpot. Že práve ja som dokázala nájsť taký lacný tábor. No teraz už viem, že som bola len naivná. Keď niekto predáva tábor za takú nízku cenu, niečo sa v tej cene jednoducho nedostalo.</p>
            <p>Moja dcéra stále nemala program na august a my sme museli niečo vymyslieť. Kúpila som teda tábor, ktorý som našla narýchlo. Aj keď to nikdy nerobím rada. Už vtedy som z toho nemala najlepší pocit.</p>

            <h2>Ľutovala som to skôr, ako dcéra prišla domov</h2>

            <p>Keď som dcéru zaviezla na tábor, všetko vyzeralo fajn.</p>
            <p>Dokonca sa aj do poslednej chvíle veľmi tešila. Hovorila o tom, že si nájde nových kamarátov, že sa zabavia vonku v prírode, že zažije niečo, čo doma nemá.</p>
            <p>No to sa zmenilo už hneď na druhý deň.</p>
            <p>Hneď na druhý deň mi volala s plačom: „Mami, tu je strašná nuda."</p>
            <p>Najprv som jej neverila. Je tam predsa len jeden deň a deti si musia na seba zvyknúť. Nemôže to byť až také zlé.</p>
            <p>No keď sa telefonát opakoval aj na tretí deň, začala som z toho mať zlý pocit.</p>
            <p>Na webe písali, že deti zažijú „nabitý program od rána do večera." Ale to, čo mi rozprávala dcéra, bolo o niečom úplne inom.</p>
            <p>Rozprávala o tom, ako animátori o nich nemajú žiadny záujem. Že väčšina detí trávi čas na telefóne namiesto programu.</p>
            <p>Program, ktorý mal byť „nabitý od rána do večera," pozostával prevažne z toho, že deti sedeli na tráve a nudili sa. Animátori si medzi sebou rozprávali a deti boli pri tom len ako kulisa.</p>
            <p>Vôbec ich nezaujímalo, čo sa s deťmi deje. Vraj tam ani nemali záujem byť. Prišli si iba pre peniaze.</p>
            <p>Jeden deň dokonca pršalo a celý „program vonku" sa zrušil. Nikto nič neorganizoval. Deti si hodiny hrali na telefónoch v izbe. Bez dohľadu, bez náhradného programu, bez ničoho.</p>

            <div className="photo-slot"><img src="/advertorial-3/images/photo-3.jpg" alt="" loading="lazy" /></div>

            <p>Ale to nebolo všetko. Na obed mali rozvarené cestoviny s kečupom a na večeru tie isté cestoviny so syrovou omáčkou.</p>
            <p>A keďže je moja dcéra bezlaktózová, jednoducho jej povedali, že ich má zjesť suché.</p>
            <p>Ovocie ani nevideli. Raňajky boli vopred pripravené na tanierikoch — žiadne švédske stoly, čo je, ako som sa neskôr dozvedela, štandard.</p>
            <p>Prvý deň dostali párok a pol rohlíka, druhý deň dve kolieska salámy, tri kolieska uhorky a jeden krajec chleba…</p>
            <p>Spali v izbe so šiestimi deťmi, kde si ani nemohla poriadne uložiť veci. Sprchovali sa v spoločných sprchách, kde bola voda raz teplá, raz studená. To bola tá „starostlivosť," za ktorú som zaplatila.</p>

            <h2>Štvrtý deň som si pre dcéru prišla predčasne a zistila som, že som jej pokazila celé leto.</h2>

            <div className="photo-slot"><img src="/advertorial-3/images/photo-4.jpg" alt="" loading="lazy" /></div>

            <p>Keď mi tretíkrát volala, že chce ísť domov… musela som niečo urobiť. Rozhodla som sa preto zavolať do kancelárie, že si pre dcéru chcem prísť predčasne.</p>
            <p>Na moje prekvapenie mi nikto nedokázal zdvihnúť telefón ani na tretí pokus. Bola som nahnevaná viac ako kedykoľvek predtým.</p>
            <p>„Čo také môžu robiť? Majú predsa na starosti cudzie deti a nevedia zdvihnúť telefón."</p>
            <p>Všetko, čo mi dcéra dovtedy rozprávala, muselo byť pravda. Vyzerá to tak, že v tej cestovnej kancelárii majú bordel a tábor nemôže vyzerať inak.</p>
            <p>Naštartovala som preto auto a rozhodla som sa pre dcéru prísť bez oznámenia.</p>
            <p>Keď som dorazila, animátori mi ju odovzdali s úsmevom, ako keby sa nič nestalo. No ja som hneď na dcére videla, že som jej pokazila celé leto. Najhoršie na tom ani nebolo to, že som vyhodila peniaze, za ktoré sme mohli ísť na dovolenku.</p>
            <p>Najhoršie bolo toto: išla na tábor šťastná. Tešila sa. Verila mi, že to bude niečo pekné. A odišla zhrozená. Vraj o tom tábore nechce ani počuť.</p>
            <p>Celý zvyšok leta sa nevedela odtrhnúť od tej témy. Opakovala mi, ako sa nudila. Ako jej bolo nepríjemne. Ako sa bála, že som o nej nevedela. A ja som sedela doma a premýšľala, ako som ju mohla nechať ísť na niečo také. To je tá vina, ktorá zostáva. Nie z vyhodených peňazí.</p>
            <p>Z toho, že dieťa mi dôverovalo a ja som to celé pokazila.</p>

            <h2>Pokazené leto môjho dieťaťa ma naučilo, čo presne robiť pri výbere tábora.</h2>

            <p>Toto je otázka, ktorú si väčšina rodičov ani nepoloží. Lebo netušia, aké zlé to môže byť.</p>
            <p>Predpokladala som, že renomovanejšia kancelária znamená lepší tábor. Že vyššia cena znamená vyššiu kvalitu. Že ak má pekný web a kladné recenzie, musí to byť dobré.</p>
            <p>Ale po mojej zlej skúsenosti som začala zisťovať, ako tento trh skutočne funguje. A ako by väčšina rodičov mala vyberať tábor pre svoje dieťa.</p>
            <p><strong>Po prvé: nikdy sa nepozerajte len na marketing.</strong> Hľadajte reálne výsledky. Recenzie na webe môžu byť vymyslené. Dnes veľa cestovných kancelárií si jednoducho objedná pozitívne hodnotenia, alebo ponúkne zľavu výmenou za pekný komentár. Zistite si, či sú recenzie od skutočných rodičov, alebo len zo stránky samotnej kancelárie.</p>
            <p><strong>Po druhé: zistite si, kto bude animovať vaše deti.</strong> Animátor je ten najdôležitejší človek na celom tábore. Má na starosti bezpečnosť vašich detí, ich náladu, ich zážitky. Nechcete, aby vaše deti animoval niekto, kto tam prišiel len zarobiť peniaze na leto. Najlepšie je, keď viete dopredu, kto bude animovať váš turnus a aké má skúsenosti s deťmi.</p>
            <p><strong>Po tretie: preverte si ubytovanie a stravu.</strong> Zistite, kde budú deti spať, aké sú hygienické podmienky a čo budú jesť. Dôležité je vedieť, či je stredisko overené, či spĺňa hygienické normy a či je strava vyvážená a dostatočná. Nechcete, aby vaše dieťa hladovalo alebo spalo v nevyhovujúcich podmienkach.</p>
            <p><strong>Po štvrté: lacný tábor nie je výhodný tábor.</strong> Tábor niečo stojí. Ubytovanie, strava, animátori, program, zdravotná starostlivosť. To všetko má svoju cenu. Keď niekto predáva tábor za 200 eur, tie peniaze niekde chýbajú. Buď v jedle. Buď v stredisku. Buď v ľuďoch, ktorých najali. Nikto tábor nerobí so stratou. Takže keď je cena príliš nízka, niekde sa to odrazí. A väčšinou sa to odrazí práve tam, kde to dieťa pocíti najviac.</p>

            <h2 id="scroll-trigger">Ako som našla cestovnú kanceláriu, ktorej môžem dôverovať.</h2>

            <div className="photo-slot"><img src="/advertorial-3/images/photo-5.jpg" alt="" loading="lazy" /></div>

            <p>Keď som hľadala tábor pre dcéru na ďalší rok, musela som si byť istá, že to bude ten najlepší tábor, na ktorom môže byť. O tábore nechcela ani počuť. Keby zažila ďalšiu zlú skúsenosť, vyčítala by som si to ako mama do konca života.</p>
            <p>Hľadala som preto tábor mesiace. Radila som sa so všetkými kamarátkami a rodičmi, na ktorých som mohla myslieť. Jedno meno sa však objavovalo viac ako všetky ostatné: <strong>Cestovná kancelária Bombovo.</strong></p>
            <p>Prvý raz mi o nej povedala kamarátka, ktorú som spoznala ešte na strednej. Vraj tam jej synovia chodia už 5 rokov po sebe a sú veľmi spokojní. Nevie si program vynachváliť. A posledné 3 roky chodia stále na ten istý tábor, pretože tam spoznali kamarátov, s ktorými sa stretávajú aj počas školského roka.</p>
            <p>Odvtedy mi meno Bombovo zostalo ležať v hlave, aj keď som sa stále rozhliadala po ďalších cestovných kanceláriách. Nedokázala som totiž uveriť niekomu len tak ľahko.</p>

            <h2>Keď som si našla čas spraviť výskum o Bombove, skutočne ma ohúrili.</h2>

            <p>Hneď na prvý pohľad bolo Bombovo to pravé, čo som hľadala. Hneď som si všimla ich hlavnú štatistiku: <strong>86 % návratnosť detí.</strong></p>
            <p>Čo mi povedalo, že 8 z 10 detí, ktoré na tábor prídu prvýkrát, sa chcú vrátiť späť. Toto mi napovedalo, že musia robiť veci inak ako ostatní. A hlavne inak ako tábor, na ktorom bola dcéra rok predtým.</p>
            <p>Zistila som, že majú už viac ako 26 rokov skúseností s organizovaním táborov a viac ako 50 000 detí im prešlo cez ruky.</p>

            <div className="photo-slot"><img src="/advertorial-3/images/photo-6.jpg" alt="" loading="lazy" /></div>

            <p>To znelo ako reálna skúsenosť so starostlivosťou o deti. A potom som si všimla ešte jednu vec.</p>
            <p>V Bombove je v cene výlet, zdravotná starostlivosť, plná penzia päťkrát denne, táborové tričko a fotodokumentácia každý deň. Žiadne príplatky za výlety, ktoré sa nakoniec neuskutočnia, lebo pršalo. Žiadne skryté poplatky, o ktorých sa dozviete až po zaplatení.</p>
            <p>To bol presný opak toho, čo som zažila rok predtým. A práve to mi dalo pocit, že Bombovu naozaj záleží na tom, aby boli deti šťastné.</p>
            <p>Samozrejme, nikto to nebude robiť zadarmo. Ale spôsob, akým to Bombovo robí, mi dal pocit, že tu nejde o to zarobiť na rodičoch. Tu ide o to spraviť to poriadne. A to je rozdiel, ktorý som po roku predtým vedela oceniť viac ako čokoľvek iné.</p>

            <h2>Zavolala som im do kancelárie, aby som zistila viac.</h2>

            <div className="photo-slot"><img src="/advertorial-3/images/photo-7.jpg" alt="" loading="lazy" /></div>

            <p>Stále som si však nebola istá. A po mojej poslednej skúsenosti som musela mať istotu, že o moju dcéru sa budú starať schopní ľudia. Rozhodla som sa im preto zavolať do kancelárie a spýtať sa na ďalšie detaily.</p>
            <p>Na rozdiel od minulej skúsenosti mi hneď zdvihla milá pani telefón a odpovedala na všetky otázky.</p>
            <p>Povedali mi, ako každý jeden z ich animátorov musí prejsť výberovým konaním a školením, kde sa rozhoduje, či bude schopný starať sa o deti. Nie jedným pohovorom. Skutočným výberovým konaním.</p>
            <p>Povedali mi, ako každý animátor musí mať skúsenosti s deťmi. Ako ich program vyvíjajú viac ako 20 rokov a každý rok pridávajú nové tematické tábory. Ale čo ma prekvapilo najviac, bolo, keď mi povedali:</p>

            <div className="blockq">
              <p>„Nechceme, aby ste boli sklamané. My vieme, že sa o vašu dcéru postaráme a dáme jej leto, na ktoré bude spomínať do konca života. No musíte si byť istá, že nám môžete dôverovať."</p>
            </div>

            <p>Toto bolo to, čo som chcela počuť. Nesnažili sa mi sľubovať všetko možné. Úprimne mi povedali, nech sa rozhodnem sama. Bez tlaku.</p>

            <h2>Na Facebooku mali stovky recenzií od skutočných ľudí.</h2>

            <p>Prešla som si ich Facebook stránku od začiatku do konca. Stovky recenzií. Z toho 98 % hodnotení na 5 hviezdičiek. Neboli to krátke jednoriadkové komentáre. Boli to dlhé správy od rodičov, ktorí opisovali presne to, čo ich deti zažili.</p>

            <div className="photo-slot"><img src="/advertorial-3/images/photo-8.jpg" alt="" loading="lazy" /></div>

            <p>Rodičia, ktorí písali o tom, ako dieťa prišlo domov a nechcelo prestať rozprávať. O animátoroch, ktorých si deti pamätajú ešte roky potom. O kamarátoch, ktorých si na tábore našli a s ktorými sa stretávajú dodnes.</p>

            <h2>Rozhodla som sa dať dcéru na tábor do Bombova a nikdy som to neľutovala.</h2>

            <p>Keď sa dcéra vrátila domov, skoro som ju nespoznala. Prvé, čo spravila, keď sme dorazili na stredisko, bolo, že sa ku mne rozbehla a rozplakala sa.</p>

            <div className="photo-slot"><img src="/advertorial-3/images/photo-9.jpg" alt="" loading="lazy" /></div>

            <p>Bála som sa, že sa jej niečo stalo. Ale jediné, čo mi povedala, bolo: „Mami, prečo si tu tak skoro, ja nechcem ísť domov."</p>
            <p>Celú cestu v aute mi rozprávala zážitky. Čo všetko na tábore robili. Animátori. Aktivity. Večerný program. Povedala, že ani jeden deň sa jej nezdal dlhý. Každý deň ubehol skôr, než si stihla uvedomiť, že sa končí.</p>
            <p>Hovorila mi o kamarátke, ktorú si našla hneď v prvý deň a s ktorou si píše dodnes.</p>

            <div className="emoji-item"><span className="emoji">✅</span><span>O nočnej hre, pri ktorej sa smiala tak silno, až ju bolel žalúdok.</span></div>
            <div className="emoji-item"><span className="emoji">✅</span><span>O momentoch, ktoré opisovala s rozžiarenými očami ešte niekoľko dní po návrate.</span></div>
            <div className="emoji-item"><span className="emoji">✅</span><span>O tej chvíli, keď sedeli pod hviezdami a rozprávali sa s animátormi o veciach, o ktorých sa doma nerozprávame.</span></div>

            <p style={{ marginTop: '20px' }}>Čo ma skutočne prekvapilo, bolo, ako sa po tábore začala správať. To hanblivé dieťa, ktoré sa predtým na rodinných oslavách schovávalo za mňa, bolo preč.</p>
            <p>Sama prišla k ľuďom a začala sa rozprávať bez toho, aby som ju musela postrkovať. Bola viac samostatná. Bola to stále ona. Ale akosi viac sama sebou.</p>
            <p>Sebavedomejšia. Plná života. Akoby jej tábor dal niečo, čo som jej ja doma nikdy dať nemohla.</p>
            <p>A vtedy som si pomyslela: <strong>Presne toto som chcela.</strong></p>

            <hr className="separator" />

            <div className="offer-box">
              <div className="offer-title">Špeciálna ponuka pre čitateľov</div>
              <p>Na moje osobné požiadanie Bombovo daruje všetkým čitateľom tohto blogu zľavový kód v hodnote <strong>20 EUR</strong> na letné tábory 2026.</p>
              <div className="offer-code">KÓD: BOMBOVO</div>
              <p>Použite ho pri registrácii na bombovo.sk</p>
              <p>Doprajte svojmu dieťaťu leto, na ktoré bude spomínať.</p>
              <div className="cta-btn-wrap" style={{ margin: '20px 0 0' }}>
                <a href={goUrl('/letne-tabory')} className="cta-btn">Využite zľavu 20 EUR &rarr; bombovo.sk</a>
              </div>
            </div>

            <h2>Ak práve hľadáte v júli, naučte sa z mojej chyby</h2>

            <p>Nekupujte tábor preto, že má voľné miesta. Kupujte tábor, ktorý je navrhnutý na to, aby sa v ňom skutočne žilo.</p>
            <p>Hľadajte:</p>
            <ul>
              <li>Konkrétny tematický program, nie vágne sľuby.</li>
              <li>Animátorov, ktorí prešli skutočným výberovým konaním.</li>
              <li>Transparentné ceny bez skrytých príplatkov za výlet či stravu.</li>
              <li>Overené strediská a jasné podmienky.</li>
              <li>Firmu, ktorá bude tu aj po tom, ako dostanú vaše peniaze.</li>
            </ul>

            <p>Bombovo bola prvá kancelária, ktorú som našla a ktorá vyzerala, ako keby bola postavená presne podľa tohto zoznamu. Nie preto, že je najznámejšia. Ale preto, že je správna voľba pre typ rodiča, ktorý číta takéto veci predtým, ako stlačí tlačidlo „Prihlásiť."</p>
            <p>Pozrite si, či sú ešte voľné miesta na júl: <a href={goUrl('/letne-tabory')}>bombovo.sk</a></p>
            <p>Bombovo má 17 rôznych táborov pre deti od 6 do 17 rokov. Niektoré turnusy v júli môžu mať ešte kapacitu. Ale v tomto období miesta ubúdajú rýchlo.</p>

            <h2>Tento rok som jej miesto na tábore Bombovo rezervovala už v januári. Pretože miesta sa míňajú rýchlo a nechcela som to premeškať.</h2>

            <p>Odvtedy, čo sa dcéra vrátila z tábora, mi hneď povedala, že musí ísť znova. Rozprávala o tom mesiace. Takže hneď potom, čo Bombovo dalo do predaja tábory na tento rok, sme sa rozhodli rezervovať rovno dva turnusy.</p>
            <p>Nechcela som čakať až do júna. Vedela som, že sme našli to pravé. Každé rezervované miesto je miesto, ktoré má moja dcéra isté. Žiadne stresovanie v máji. Žiadne „bohužiaľ, kapacita naplnená." Len istota, že leto je vyriešené.</p>
            <p>A ja som rada, že môžem dať dcére spomienky na celý život. Leto, ktoré pre ňu bude znamenať všetko. Nie preto, že leto znamená pauzu od školy. Ale preto, že tam na ňu čakajú kamaráti, ktorých si na tábore našla. A že každý jeden deň v Bombove jej dá príbeh, ktorý bude rozprávať do konca života.</p>
            <p>Ak aj vy chcete dať svojmu dieťaťu presne takéto leto... kliknite na odkaz nižšie a rezervujte si miesto na tábore v Bombove, kým sa všetky nevypredajú.</p>

            <div className="offer-box-peak">
              <div className="offer-box-peak-stripe"></div>
              <div className="offer-box-peak-body">
                <div className="offer-box-peak-title"><span>🔴</span> Špeciálna ponuka Bombovo (kým sú miesta)</div>
                <p>Práve teraz Bombovo ponúka čitateľom tohto blogu:</p>
                <ul>
                  <li><strong>Zľava 20 EUR s kódom BOMBOVO</strong></li>
                  <li><strong>17 táborov pre deti od 6 do 17 rokov</strong></li>
                  <li><strong>Všetko v cene:</strong> výlet, strava 5× denne, tričko, fotky každý deň</li>
                </ul>
                <p className="offer-box-peak-plus">NAVYŠE:</p>
                <ul>
                  <li>Žiadne skryté príplatky</li>
                  <li>Overené strediská a skúsení animátori</li>
                  <li>Možnosť platby na splátky</li>
                  <li>86 % návratnosť detí — najlepší dôkaz kvality</li>
                </ul>
                <a href={goUrl('/letne-tabory')} className="offer-box-peak-cta">👉 Rezervovať miesto v tábore Bombovo</a>
              </div>
            </div>

            <div className="comments-section">
              <h3>Komentáre (74)</h3>
              <input className="comment-input" type="text" placeholder="Napísať komentár..." readOnly />

              <div className="comment-item">
                <div className="comment-avatar"><img src="/advertorial-3/images/avatar-1.jpg" alt="" style={avatarImg} loading="lazy" /></div>
                <div className="comment-body">
                  <div className="comment-name">Marta Horáková</div>
                  <div className="comment-text">Presne toto sa stalo aj nám vlani! Syn plakal každý deň cez telefón a my sme ho museli tiež prísť predčasne zobrať. Tento rok sme dali syna do Bombova — a aký rozdiel. Vrátil sa úplne nadšený a vôbec nechcel ísť domov.</div>
                  <div className="comment-meta"><span>Páči sa mi 67</span><span>Odpovedať</span><span>8 min</span></div>
                </div>
              </div>

              <div className="comment-item">
                <div className="comment-avatar"><img src="/advertorial-3/images/avatar-2.jpg" alt="" style={avatarImg} loading="lazy" /></div>
                <div className="comment-body">
                  <div className="comment-name">Petra Šimková</div>
                  <div className="comment-text">Ďakujem za úprimný príbeh. Teraz sa cítim omnoho istejšia, že sme vybrali Bombovo. Práve som zaregistrovala dcéru s kódom BOMBOVO. Nepočkám s tým na jún — po prečítaní tohto to bolo jasné rozhodnutie.</div>
                  <div className="comment-meta"><span>Páči sa mi 43</span><span>Odpovedať</span><span>25 min</span></div>
                  <div className="comment-reply">
                    <div className="comment-item" style={replyItem}>
                      <div className="comment-avatar" style={replyAvatar}><img src="/advertorial-3/images/avatar-11.jpg" alt="" style={avatarImg} loading="lazy" /></div>
                      <div className="comment-body">
                        <div className="comment-name">Lucia Blahová</div>
                        <div className="comment-text">Rovnako! Naša dcéra tiež plakala keď sme ju prišli zobrať z Bombova. Nie preto, že by sa jej stalo niečo zlé — ale preto, že nechcela odísť od kamarátov. Takú reakciu som nečakala.</div>
                        <div className="comment-meta"><span>Páči sa mi 29</span><span>Odpovedať</span><span>18 min</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="comment-item">
                <div className="comment-avatar"><img src="/advertorial-3/images/avatar-3.jpg" alt="" style={avatarImg} loading="lazy" /></div>
                <div className="comment-body">
                  <div className="comment-name">Renáta Kováčiková</div>
                  <div className="comment-text">Môj syn chodí do Bombova 4 roky za sebou. Každý rok sa teší od januára. Priateľstvá, ktoré tam nadviazal, trvajú dodnes — niektorí kamaráti z tábora sú jeho najlepší priatelia v škole.</div>
                  <div className="comment-meta"><span>Páči sa mi 88</span><span>Odpovedať</span><span>1 hod</span></div>
                </div>
              </div>

              <div className="comment-item">
                <div className="comment-avatar"><img src="/advertorial-3/images/avatar-4.jpg" alt="" style={avatarImg} loading="lazy" /></div>
                <div className="comment-body">
                  <div className="comment-name">Zuzana Mrázová</div>
                  <div className="comment-text">Ten lacný tábor za 200 eur — to je bohužiaľ skúsenosť veľa rodičov. My sme tiež nenaleteli raz, ale dvakrát. Bombovo je iná liga. Cena zodpovedá tomu, čo dostanete.</div>
                  <div className="comment-meta"><span>Páči sa mi 51</span><span>Odpovedať</span><span>2 hod</span></div>
                  <div className="comment-reply">
                    <div className="comment-item" style={replyItem}>
                      <div className="comment-avatar" style={replyAvatar}><img src="/advertorial-3/images/avatar-17.jpg" alt="" style={avatarImg} loading="lazy" /></div>
                      <div className="comment-body">
                        <div className="comment-name">Veronika Horňáková</div>
                        <div className="comment-text">Súhlasím úplne. Minulý rok som zaplatila 190 EUR za tábor a dcéra prišla domov s voškami v hlave a cez celé léto mi rozprávala, aká tam bola nuda. Nikdy viac.</div>
                        <div className="comment-meta"><span>Páči sa mi 37</span><span>Odpovedať</span><span>1 hod</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="comment-item">
                <div className="comment-avatar"><img src="/advertorial-3/images/avatar-5.jpg" alt="" style={avatarImg} loading="lazy" /></div>
                <div className="comment-body">
                  <div className="comment-name">Jana Urbanová</div>
                  <div className="comment-text">Práve som skontrolovala voľné miesta — ešte sú nejaké na júl! Registrujem dcéru hneď. Ďakujem za tento článok, inak by som možno znovu skúšala niečo lacnejšie a oľutovala to.</div>
                  <div className="comment-meta"><span>Páči sa mi 34</span><span>Odpovedať</span><span>3 hod</span></div>
                </div>
              </div>

              <div className="comment-item">
                <div className="comment-avatar"><img src="/advertorial-3/images/avatar-12.jpg" alt="" style={avatarImg} loading="lazy" /></div>
                <div className="comment-body">
                  <div className="comment-name">Eva Kolárová</div>
                  <div className="comment-text">Naše deti chodia do Bombova každý rok — jedno má 9 a druhé 13. Obidve sa vždy nevedia dočkať júla. To 86 % číslo návratnosti sme aj my. Nikdy by sme nešli inam.</div>
                  <div className="comment-meta"><span>Páči sa mi 112</span><span>Odpovedať</span><span>3 hod</span></div>
                </div>
              </div>

              <div className="comment-item">
                <div className="comment-avatar"><img src="/advertorial-3/images/avatar-6.jpg" alt="" style={avatarImg} loading="lazy" /></div>
                <div className="comment-body">
                  <div className="comment-name">Roman Bielik</div>
                  <div className="comment-text">Ako otec som bol spočiatku skeptický — tábor za toľko peňazí. Ale keď som videl, ako sa syn vrátil domov... inak sa rozpráva, inak sa správa k ľuďom. Stálo to za každý cent. Budeme rezervovať aj na budúci rok.</div>
                  <div className="comment-meta"><span>Páči sa mi 78</span><span>Odpovedať</span><span>4 hod</span></div>
                </div>
              </div>

              <div className="comment-item">
                <div className="comment-avatar"><img src="/advertorial-3/images/avatar-9.jpg" alt="" style={avatarImg} loading="lazy" /></div>
                <div className="comment-body">
                  <div className="comment-name">Katarína Fialová</div>
                  <div className="comment-text">Porovnávala som Bombovo s inými tábormi v podobnej cenovej kategórii. Keď som si spočítala všetky príplatky u konkurencie (výlet, tričko, fotky...) vyšlo to na rovnako alebo viac ako Bombovo kde je všetko v cene. Voľba bola jasná.</div>
                  <div className="comment-meta"><span>Páči sa mi 55</span><span>Odpovedať</span><span>5 hod</span></div>
                  <div className="comment-reply">
                    <div className="comment-item" style={replyItem}>
                      <div className="comment-avatar" style={replyAvatar}><img src="/advertorial-3/images/avatar-13.jpg" alt="" style={avatarImg} loading="lazy" /></div>
                      <div className="comment-body">
                        <div className="comment-name">Monika Červenáková</div>
                        <div className="comment-text">Presne toto som zistila aj ja! Keď som porovnala ceny, Bombovo bolo nakoniec lacnejšie ako lacný tábor. Ešte k tomu kód BOMBOVO a to je 20 EUR späť.</div>
                        <div className="comment-meta"><span>Páči sa mi 22</span><span>Odpovedať</span><span>4 hod</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="comment-item">
                <div className="comment-avatar"><img src="/advertorial-3/images/avatar-7.jpg" alt="" style={avatarImg} loading="lazy" /></div>
                <div className="comment-body">
                  <div className="comment-name">Martin Horák</div>
                  <div className="comment-text">Syn išiel prvýkrát a bol veľmi hanblivý chlapec. Obávali sme sa ako to bude. Vrátil sa z tábora a prvú hodinu doma nás rozprával o kamarátoch, animátoroch, hrách... Nevedel prestať. Za päť dní sa zmenil viac ako za celý rok doma.</div>
                  <div className="comment-meta"><span>Páči sa mi 94</span><span>Odpovedať</span><span>6 hod</span></div>
                </div>
              </div>

              <div className="comment-item">
                <div className="comment-avatar"><img src="/advertorial-3/images/avatar-10.jpg" alt="" style={avatarImg} loading="lazy" /></div>
                <div className="comment-body">
                  <div className="comment-name">Alžbeta Ducká</div>
                  <div className="comment-text">Dcéra práve prišla domov včera. Plakala pri odchode — a to nie od smútku, ale preto, že nechcela odísť. Animátori jej dali na záver malý lístoček s prajením. Ešte ho má pod vankúšom. Bombovo ďakujeme! ❤️</div>
                  <div className="comment-meta"><span>Páči sa mi 143</span><span>Odpovedať</span><span>7 hod</span></div>
                </div>
              </div>

              <div className="comment-item">
                <div className="comment-avatar"><img src="/advertorial-3/images/avatar-15.jpg" alt="" style={avatarImg} loading="lazy" /></div>
                <div className="comment-body">
                  <div className="comment-name">Simona Nagyová</div>
                  <div className="comment-text">Zdieľam tento článok všetkým mamičkám v našej triede. Sme skupina rodičov kde väčšina ešte nevie kde dá deti cez leto. Toto je presne to, čo potrebujú čítať pred tým, ako kúpia prvý lacný tábor čo nájdu.</div>
                  <div className="comment-meta"><span>Páči sa mi 61</span><span>Odpovedať</span><span>8 hod</span></div>
                </div>
              </div>

              <div className="comment-item">
                <div className="comment-avatar"><img src="/advertorial-3/images/avatar-16.jpg" alt="" style={avatarImg} loading="lazy" /></div>
                <div className="comment-body">
                  <div className="comment-name">Daniela Blahová</div>
                  <div className="comment-text">Moja dcéra má sociálnu úzkosť a bála som sa poslať ju na tábor. Zavolala som do Bombova a hovorila som s nimi celú pol hodinu. Boli takí trpezliví a vysvetlili mi všetko do detailu. Nakoniec šla — a bola to najlepšia vec, čo som pre ňu spravila.</div>
                  <div className="comment-meta"><span>Páči sa mi 187</span><span>Odpovedať</span><span>9 hod</span></div>
                  <div className="comment-reply">
                    <div className="comment-item" style={replyItem}>
                      <div className="comment-avatar" style={replyAvatar}><img src="/advertorial-3/images/avatar-14.jpg" alt="" style={avatarImg} loading="lazy" /></div>
                      <div className="comment-body">
                        <div className="comment-name">Silvia Marková</div>
                        <div className="comment-text">Toto ma dojalo. Náš syn má tiež podobné problémy so začleňovaním. Idem im zavolať ešte dnes.</div>
                        <div className="comment-meta"><span>Páči sa mi 44</span><span>Odpovedať</span><span>8 hod</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="comment-item">
                <div className="comment-avatar"><img src="/advertorial-3/images/avatar-8.jpg" alt="" style={avatarImg} loading="lazy" /></div>
                <div className="comment-body">
                  <div className="comment-name">Ivana Kováčová</div>
                  <div className="comment-text">Tá 86 % návratnosť ma predala hneď. Keď 8 z 10 detí chce prísť znova, to nie je náhoda. To je výsledok rokov práce a starostlivosti. Práve som rezervovala miesto pre syna na júlový turnus.</div>
                  <div className="comment-meta"><span>Páči sa mi 73</span><span>Odpovedať</span><span>11 hod</span></div>
                </div>
              </div>

              <div className="comment-item">
                <div className="comment-avatar"><img src="/advertorial-3/images/avatar-18.jpg" alt="" style={avatarImg} loading="lazy" /></div>
                <div className="comment-body">
                  <div className="comment-name">Miroslava Benková</div>
                  <div className="comment-text">Syn sa z tábora vrátil a prvé čo spravil bolo, že sa šiel opýtať susedného chlapca, či chce ísť von hrať futbal. Predtým by to nikdy nespravil sám. Tábor mu dal sebavedomie, ktoré sme u neho roky hľadali.</div>
                  <div className="comment-meta"><span>Páči sa mi 209</span><span>Odpovedať</span><span>12 hod</span></div>
                </div>
              </div>

              <div className="comment-item">
                <div className="comment-avatar"><img src="/advertorial-3/images/avatar-19.jpg" alt="" style={avatarImg} loading="lazy" /></div>
                <div className="comment-body">
                  <div className="comment-name">Ľubica Hrušková</div>
                  <div className="comment-text">Registrácia cez web bola veľmi jednoduchá. Vybrala som tábor, vyplnila formulár, zadala kód BOMBOVO a hotovo. O pár minút mi prišiel potvrdzovací email. Žiadny stres, žiadne čakanie. Takto to má vyzerať.</div>
                  <div className="comment-meta"><span>Páči sa mi 38</span><span>Odpovedať</span><span>14 hod</span></div>
                </div>
              </div>

            </div>

          </article>

          <aside className="sidebar">
            <div className="sidebar-sticky">
              <div className="sidebar-box">
                <div className="sidebar-label">Odporúčame</div>
                <div className="sidebar-title-row">
                  <strong>CK Bombovo — Letné tábory 2026</strong>
                  <div className="stars-row">
                    <span className="stars">★★★★★</span>
                  </div>
                </div>
                <div className="sidebar-img"><img src="/advertorial-3/images/sidebanner.jpg" alt="CK Bombovo tábor" /></div>
                <div className="sidebar-body">
                  <ul className="sidebar-checks">
                    <li><span className="chk">✓</span><span>17 táborov pre deti od 6 do 17 rokov</span></li>
                    <li><span className="chk">✓</span><span>Všetko v cene: výlet, strava 5× denne, tričko, fotky</span></li>
                    <li><span className="chk">✓</span><span>86 % návratnosť — najlepší dôkaz kvality</span></li>
                    <li><span className="chk">✓</span><span>Animátori s výberovým konaním a školením</span></li>
                    <li><span className="chk">✓</span><span>Žiadne skryté príplatky</span></li>
                  </ul>
                  <a href={goUrl('/letne-tabory')} className="sidebar-cta">Rezervovať miesto na tábore &rarr;</a>
                  <div className="sidebar-discount">Kód <strong>BOMBOVO</strong> = zľava 20 EUR</div>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>

      <footer style={{ background: '#f2f2f2', borderTop: '1px solid #e0e0e0', padding: '18px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '13px', color: '#888', fontFamily: 'Arial,sans-serif' }}>
        <span>© 2026 Lepší Rodič. Všetky práva vyhradené.</span>
        <span>Toto je propagovaný článok. Nie je to spravodajský článok, blogový príspevok ani nezávislá redakčná recenzia.</span>
      </footer>

      <div className="sticky-cta" id="sticky-cta">
        <a href={goUrl('/letne-tabory')}>
          👉 Rezervovať miesto v tábore Bombovo
        </a>
      </div>

      <script dangerouslySetInnerHTML={{ __html: STICKY_SCRIPT }} />
      <script dangerouslySetInnerHTML={{ __html: CLICK_TRACKING_SCRIPT }} />
    </>
  )
}
