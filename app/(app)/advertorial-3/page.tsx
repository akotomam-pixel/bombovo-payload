import { after } from 'next/server'
import { headers } from 'next/headers'
import { Pool } from 'pg'
import Header from '@/components/Header'
import TopBar from '@/components/TopBar'
import Footer from '@/components/Footer'

const BOT_PATTERNS = ['bot', 'crawler', 'spider', 'facebookexternalhit', 'googlebot']

export const metadata = {
  title: 'Prihlásila som dcéru na letný tábor na poslednú chvíľu v júli a ľutovala som to celý rok | Bombovo',
  description: 'Prečítajte si príbeh mamy, ktorá urobila chybu pri výbere tábora – a ako potom našla Bombovo, kam dcéra chodí dodnes.',
}

export default async function Advertorial3Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const fbclid     = typeof sp.fbclid       === 'string' ? sp.fbclid       : ''
  const utmSource  = typeof sp.utm_source   === 'string' ? sp.utm_source   : ''
  const utmMedium  = typeof sp.utm_medium   === 'string' ? sp.utm_medium   : ''
  const utmCampaign= typeof sp.utm_campaign === 'string' ? sp.utm_campaign : ''
  const utmContent = typeof sp.utm_content  === 'string' ? sp.utm_content  : ''

  function buildGoLink(destination: string): string {
    let url = `/api/go?to=${encodeURIComponent(destination)}&source=advertorial-3`
    if (utmSource)   url += `&utm_source=${encodeURIComponent(utmSource)}`
    if (utmMedium)   url += `&utm_medium=${encodeURIComponent(utmMedium)}`
    if (utmCampaign) url += `&utm_campaign=${encodeURIComponent(utmCampaign)}`
    if (utmContent)  url += `&utm_content=${encodeURIComponent(utmContent)}`
    if (fbclid)      url += `&fbclid=${encodeURIComponent(fbclid)}`
    return url
  }

  // View tracking — non-blocking
  after(async () => {
    try {
      const h = await headers()
      const userAgent = h.get('user-agent') || ''
      if (BOT_PATTERNS.some(p => userAgent.toLowerCase().includes(p))) return
      const ip       = h.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
      const referrer = h.get('referer') || ''
      const pool = new Pool({ connectionString: process.env.DATABASE_URI })
      await pool.query(
        `INSERT INTO ad_events (type, advertorial, utm_source, utm_medium, utm_campaign, utm_content, fbclid, ip, user_agent, referrer, updated_at, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,now(),now())`,
        ['view', 'advertorial-3', utmSource||null, utmMedium||null, utmCampaign||null, utmContent||null, fbclid||null, ip, userAgent||null, referrer||null]
      )
      await pool.end()
    } catch (err) {
      console.error('[advertorial-3] view tracking failed:', err)
    }
  })

  const ctaLetneTabory = buildGoLink('/letne-tabory')
  const ctaPrihlaska   = buildGoLink('/prihlaska')

  return (
    <>
      <TopBar />
      <Header />

      <main>
        {/* ── HERO ── */}
        <section className="bg-bombovo-dark text-white py-16 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block bg-bombovo-red text-white text-xs font-bold tracking-widest uppercase px-4 py-1 rounded-full mb-6">
              Propagovaný článok · Lepší Rodič
            </div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
              Prihlásila som dcéru na letný tábor na poslednú chvíľu v júli a ľutovala som to celý rok.
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-8">
              Prečítajte si môj príbeh, aby ste neurobili rovnakú chybu.
            </p>
            <div className="flex items-center justify-center gap-3 text-sm text-white/50">
              <img src="/advertorial-3/images/character-photo.jpg" alt="Martina K." className="w-10 h-10 rounded-full object-cover" />
              <span>Martina K. · blogerka · 51 347 zhliadnutí 🔥</span>
            </div>
          </div>
        </section>

        {/* ── ARTICLE ── */}
        <article className="max-w-2xl mx-auto px-6 py-12 text-[17px] leading-relaxed text-gray-800">

          <img src="/advertorial-3/images/photo-1.jpg" alt="" className="w-full rounded-2xl mb-8 object-cover" />

          <p className="mb-5">Ak práve panicky prezeráte internet a hľadáte, či ešte existuje nejaký tábor, kam by sa vaše dieťa zmestilo v júli... zastavte sa.</p>
          <p className="mb-5">Presne toto som pred pár rokmi robila aj ja. A spravila som jednu z najväčších chýb v živote.</p>
          <p className="mb-5">Urobila som to, čo väčšina opatrných rodičov robí na poslednú chvíľu: čítala som recenzie, porovnávala ceny, pozerala fotky na Instagrame. A povedala som si: „Hlavne nech je niekde a v bezpečí, veď tábor je tábor."</p>
          <p className="mb-8">A potom som prihlásila dcéru na ten nesprávny tábor.</p>

          <h2 className="text-2xl md:text-3xl font-bold text-bombovo-dark mt-10 mb-4">Tábor, ktorý vyzeral dobre „na papieri"</h2>
          <img src="/advertorial-3/images/photo-2.jpg" alt="" className="w-full rounded-2xl mb-6 object-cover" />
          <p className="mb-5">Fotky vyzerali dobre, deti vyzerali šťastne. Cena bola okolo 200 eur — mala som pocit, akoby som vyhrala jackpot. No teraz už viem, že som bola len naivná.</p>
          <p className="mb-5">Keď niekto predáva tábor za takú nízku cenu, niečo sa v tej cene jednoducho nedostalo. Buď v jedle. Buď v stredisku. Buď v ľuďoch, ktorých najali.</p>

          <h2 className="text-2xl md:text-3xl font-bold text-bombovo-dark mt-10 mb-4">Ľutovala som to skôr, ako dcéra prišla domov</h2>
          <p className="mb-5">Hneď na druhý deň mi volala s plačom: „Mami, tu je strašná nuda." Animátori o nich nemali žiadny záujem. Program, ktorý mal byť „nabitý od rána do večera," pozostával z toho, že deti sedeli na tráve a nudili sa.</p>
          <img src="/advertorial-3/images/photo-3.jpg" alt="" className="w-full rounded-2xl mb-6 object-cover" />
          <p className="mb-5">Na obed mali rozvarené cestoviny s kečupom a na večeru tie isté cestoviny so syrovou omáčkou. Keďže je moja dcéra bezlaktózová, jednoducho jej povedali, že ich má zjesť suché.</p>
          <p className="mb-8">Na štvrtý deň som si pre ňu prišla predčasne. Animátori mi ju odovzdali s úsmevom, ako keby sa nič nestalo. No ja som hneď videla, že som jej pokazila celé leto.</p>

          {/* CTA 1 */}
          <div className="bg-bombovo-yellow rounded-3xl p-8 my-10 text-center">
            <p className="text-xl font-bold text-bombovo-dark mb-2">Nechcete urobiť tú istú chybu?</p>
            <p className="text-gray-700 mb-5">Bombovo — 26 rokov skúseností, 86 % návratnosť detí, všetko v cene.</p>
            <a href={ctaLetneTabory} className="inline-block bg-bombovo-dark text-white font-bold text-lg px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity">
              Pozrieť letné tábory →
            </a>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-bombovo-dark mt-10 mb-4">Ako som našla cestovnú kanceláriu, ktorej môžem dôverovať</h2>
          <img src="/advertorial-3/images/photo-5.jpg" alt="" className="w-full rounded-2xl mb-6 object-cover" />
          <p className="mb-5">Hľadala som tábor mesiace. Jedno meno sa však objavovalo viac ako všetky ostatné: <strong>Cestovná kancelária Bombovo.</strong></p>
          <p className="mb-5">Kamarátka mi povedala, že tam jej synovia chodia už 5 rokov po sebe. Nevie si program vynachváliť. A posledné 3 roky chodia stále na ten istý tábor, pretože tam spoznali kamarátov, s ktorými sa stretávajú aj počas školského roka.</p>

          <h2 className="text-2xl md:text-3xl font-bold text-bombovo-dark mt-10 mb-4">Keď som si spravila výskum o Bombove, skutočne ma ohúrili</h2>
          <img src="/advertorial-3/images/photo-6.jpg" alt="" className="w-full rounded-2xl mb-6 object-cover" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
            {[
              { stat: '86 %', label: 'návratnosť detí — 8 z 10 detí sa chce vrátiť' },
              { stat: '26+', label: 'rokov skúseností s organizovaním táborov' },
              { stat: '50 000+', label: 'detí im prešlo cez ruky' },
            ].map(({ stat, label }) => (
              <div key={stat} className="bg-bombovo-blue/10 rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-bombovo-blue mb-2">{stat}</div>
                <div className="text-sm text-gray-600">{label}</div>
              </div>
            ))}
          </div>

          <p className="mb-5">V Bombove je v cene výlet, zdravotná starostlivosť, plná penzia päťkrát denne, táborové tričko a fotodokumentácia každý deň. <strong>Žiadne skryté príplatky.</strong></p>

          <h2 className="text-2xl md:text-3xl font-bold text-bombovo-dark mt-10 mb-4">Zavolala som im do kancelárie, aby som zistila viac</h2>
          <img src="/advertorial-3/images/photo-7.jpg" alt="" className="w-full rounded-2xl mb-6 object-cover" />
          <p className="mb-5">Na rozdiel od minulej skúsenosti mi hneď zdvihla milá pani telefón a odpovedala na všetky otázky.</p>
          <blockquote className="border-l-4 border-bombovo-blue pl-6 my-8 italic text-gray-600 text-lg">
            „Nechceme, aby ste boli sklamané. My vieme, že sa o vašu dcéru postaráme a dáme jej leto, na ktoré bude spomínať do konca života."
          </blockquote>
          <p className="mb-5">Nesnažili sa mi sľubovať všetko možné. Úprimne mi povedali, nech sa rozhodnem sama. Bez tlaku.</p>

          <h2 className="text-2xl md:text-3xl font-bold text-bombovo-dark mt-10 mb-4">Rozhodla som sa dať dcéru na tábor do Bombova a nikdy som to neľutovala</h2>
          <img src="/advertorial-3/images/photo-9.jpg" alt="" className="w-full rounded-2xl mb-6 object-cover" />
          <p className="mb-5">Keď som prišla po dcéru, rozbehla sa ku mne a rozplakala sa. Bála som sa, že sa jej niečo stalo. Ale jediné, čo mi povedala, bolo: <strong>„Mami, prečo si tu tak skoro, ja nechcem ísť domov."</strong></p>

          <div className="space-y-4 my-8">
            {[
              'O nočnej hre, pri ktorej sa smiala tak silno, až ju bolel žalúdok.',
              'O momentoch, ktoré opisovala s rozžiarenými očami ešte niekoľko dní po návrate.',
              'O tej chvíli, keď sedeli pod hviezdami a rozprávali sa s animátormi o veciach, o ktorých sa doma nerozprávame.',
            ].map((text) => (
              <div key={text} className="flex gap-3 items-start">
                <span className="text-2xl">✅</span>
                <p className="font-semibold text-bombovo-dark">{text}</p>
              </div>
            ))}
          </div>

          <p className="mb-8 text-lg font-semibold text-bombovo-dark">A vtedy som si pomyslela: Presne toto som chcela.</p>

          {/* CTA 2 — offer box */}
          <div className="bg-bombovo-yellow rounded-3xl p-8 my-10">
            <div className="text-xs font-bold tracking-widest uppercase text-bombovo-dark mb-4">Špeciálna ponuka pre čitateľov</div>
            <p className="text-lg mb-3 text-bombovo-dark">Na moje osobné požiadanie Bombovo daruje všetkým čitateľom tohto blogu zľavový kód v hodnote <strong>20 EUR</strong> na letné tábory 2026.</p>
            <div className="text-3xl font-bold tracking-widest text-bombovo-dark my-4">KÓD: BOMBOVO</div>
            <p className="text-bombovo-dark mb-6">Použite ho pri registrácii na bombovo.sk</p>
            <a href={ctaLetneTabory} className="inline-block bg-bombovo-dark text-white font-bold text-lg px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity w-full text-center">
              Využite zľavu 20 EUR → bombovo.sk
            </a>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-bombovo-dark mt-10 mb-4">Ak práve hľadáte v júli, naučte sa z mojej chyby</h2>
          <p className="mb-4">Nekupujte tábor preto, že má voľné miesta. Hľadajte:</p>
          <ul className="space-y-3 mb-8">
            {[
              'Konkrétny tematický program, nie vágne sľuby.',
              'Animátorov, ktorí prešli skutočným výberovým konaním.',
              'Transparentné ceny bez skrytých príplatkov.',
              'Overené strediská a jasné podmienky.',
            ].map((item) => (
              <li key={item} className="flex gap-3 items-start font-semibold text-bombovo-dark">
                <span className="text-xl mt-0.5">✅</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mb-8">Bombovo bola prvá kancelária, ktorú som našla a ktorá vyzerala, ako keby bola postavená presne podľa tohto zoznamu.</p>

          {/* CTA 3 — final */}
          <div className="bg-bombovo-dark rounded-3xl p-8 my-10 text-white text-center">
            <div className="text-bombovo-red font-bold text-sm tracking-widest uppercase mb-4">🔴 Špeciálna ponuka Bombovo (kým sú miesta)</div>
            <ul className="text-left space-y-2 mb-6 text-white/90">
              <li>✓ <strong>Zľava 20 EUR s kódom BOMBOVO</strong></li>
              <li>✓ <strong>17 táborov</strong> pre deti od 6 do 17 rokov</li>
              <li>✓ <strong>Všetko v cene:</strong> výlet, strava 5× denne, tričko, fotky každý deň</li>
              <li>✓ Žiadne skryté príplatky</li>
              <li>✓ Overené strediská a skúsení animátori</li>
            </ul>
            <a href={ctaLetneTabory} className="inline-block bg-bombovo-yellow text-bombovo-dark font-bold text-xl px-10 py-5 rounded-2xl hover:opacity-90 transition-opacity w-full text-center mb-3">
              Rezervovať miesto na tábore →
            </a>
            <a href={ctaPrihlaska} className="inline-block text-white/60 text-sm hover:text-white transition-colors">
              Alebo priamo na prihlášku →
            </a>
          </div>

          {/* Legal footer */}
          <div className="border-t border-gray-200 mt-12 pt-6 flex flex-col md:flex-row justify-between gap-2 text-xs text-gray-400">
            <span>© 2026 Lepší Rodič. Všetky práva vyhradené.</span>
            <span>Toto je propagovaný článok. Obsah bol vytvorený v spolupráci s Bombovo.</span>
          </div>
        </article>
      </main>

      <Footer />
    </>
  )
}
