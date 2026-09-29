# Build /advertorialsvp-2 (Penzión Lagáň advertorial) as a copy of /advertorialsvp-1

The finished copy is pasted below this prompt. Use its wording exactly: don't rewrite, shorten, "improve" or add bold that the copy doesn't have. Wherever this prompt and the copy disagree on text, the copy wins.

## What this is

`/advertorialsvp-1` is the Hotel Osrblie advertorial we already run on Facebook. `/advertorialsvp-2` must be the same page: same layout, CSS, header, byline, reviews block, red mid-article CTA box, yellow offer box, footer and sticky red bottom bar. Only three things change:

1. The content, which comes from the pasted copy.
2. Every link goes to the Penzión Lagáň landing page, `/skoly-v-prirode/penzion-lagan`.
3. Tracking identifies this page as `advertorialsvp-2`, so PostHog can show it as a separate funnel from Osrblie.

The photos are already in `public/advertorialsvp-2/` (photo-1.webp … photo-7.png). Don't rename, move or re-export them.

## Rules for this task

- svp-1 is the reference design. Reuse its `CSS` string exactly as it is. CLAUDE.md's "Anti-Generic Guardrails" are for new designs and do not apply here, because following them would change the look. Invoke the `frontend-design` skill as CLAUDE.md requires, but don't redesign anything.
- The only change allowed in `app/(advertorials)/advertorialsvp-1/` is the one-line addition in step 4. Don't refactor shared code.
- Don't change `/api/go`, `LomyEnquiryForm`, `/api/contact-svp`, `lib/metaCapi.ts`, GTM, or anything on the Lagáň landing page.
- No screenshots. If something blocks you twice, stop and tell me (see CLAUDE.md).
- CLAUDE.md says `/skoly-v-prirode` is behind a password gate in `middleware.ts`. That note is out of date. Today `middleware.ts` only suppresses the CookieYes banner for `/advertorialsvp-1`.

## What already exists (so you don't need to re-discover it)

- `app/(advertorials)/advertorialsvp-1/page.tsx`: a server component. It has the CSS string, `buildGoUrl()`, and a server-side `ad_events` "view" insert inside `after()`. All CTAs link to `/api/go?to=/skoly-v-prirode/hotel-osrblie&source=advertorialsvp-1&utm_*…`.
- `app/(advertorials)/advertorialsvp-1/AdvertorialTracking.tsx`: a client component that:
  - fires the PostHog events `advertorial_viewed` and `advertorial_clicked` (click listener on `a[data-advertorial-cta]`)
  - fills the byline date
  - shows the sticky bar once `#scroll-trigger` scrolls off the top
- `app/(app)/api/go/route.ts`: logs the click to `ad_events`, sets the first-touch cookie and redirects with the UTMs kept. It already accepts any `source`, so no change is needed.
- `components/PostHogProvider.tsx`: PostHog is initialised at module scope with `capture_pageview: true`, so `$pageview` fires on its own. Our PostHog dashboards count views as `$pageview` where `$pathname = /advertorialsvp-1`.
- On the Lagáň landing page, a sent inquiry already fires these PostHog events:
  - `svp_inquiry_submitted`
  - `svp_registration_submitted` with `stredisko_slug: 'penzion-lagan'`
  - the dataLayer event `prihlaska_svp_submitted`, which makes GTM fire the Meta Pixel `Lead` and `SvP_Inquiry` events, backed up by server-side CAPI

  Nothing needs adding there.
- Meta Pixel `PageView` fires on all pages through GTM. Don't add any `fbq` calls.

## Step 1: Create the files

Copy `app/(advertorials)/advertorialsvp-1/page.tsx` and `AdvertorialTracking.tsx` into a new folder, `app/(advertorials)/advertorialsvp-2/`.

At the top of the new `page.tsx`, add constants and use them everywhere, so the new folder has no hard-coded `advertorialsvp-1` or Osrblie values left:

```ts
const ADVERTORIAL = 'advertorialsvp-2'
const DESTINATION_PATH = '/skoly-v-prirode/penzion-lagan'
const DESTINATION_SLUG = 'penzion-lagan'
```

- `buildGoUrl(DESTINATION_PATH, utm)` must send `source: ADVERTORIAL`.
- The `ad_events` view insert must use `ADVERTORIAL`, and the `console.error` label must say `[advertorialsvp-2]`.
- Rename the component to `AdvertorialSvp2Page`.
- Metadata `title`: `Najprestížnejšie stredisko pre školy v prírode na západnom Slovensku | Lepší Rodič`. Keep the same favicon.
- Pass `advertorial={ADVERTORIAL}` and `destination={DESTINATION_SLUG}` to the new `AdvertorialTracking`, alongside the UTM props.

## Step 2: Page content, top to bottom

Keep these exactly as they are in svp-1: the top bar, the Lepší Rodič header and logo, the breadcrumb, and the byline (Lucia Nováková, date filled by JS, view count).

Every photo uses `next/image` exactly like svp-1: `width` and `height` set to the real pixel size listed below, `sizes="(max-width: 780px) 100vw, 760px"`, `style={{ width: '100%', height: 'auto', display: 'block' }}`. The hero gets `priority`; every other photo gets `loading="lazy"` inside `<div className="body-photo">`.

1. **H1**: the copy's title.
2. **Subtitle** ("Ľahko dostupné pre školy z Nitry, Trnavy, Bratislavy a ich okolia."): svp-1 has no element for this, so add one class. This is new style #1 of only two.
   - `.article-deck`: 22px, weight 400, color `#666`, line-height 1.4, margin-bottom 18px.
   - Reduce `.article-headline` margin-bottom to 10px on this page only.
   - At ≤480px, set it to 18px.
   - Render it as `<p className="article-deck">` directly under the H1, before the byline.
3. **Byline**: unchanged.
4. **Hero**: `/advertorialsvp-2/photo-1.webp` (850×567), `priority`. Alt text: "Penzión Lagáň pri Podhájskej".
5. "Hľadáte školu v prírode na západnom Slovensku?" goes in `<p className="lead-question"><strong>…</strong></p>`, the same treatment as svp-1's "Predstavte si toto:". The next two paragraphs are normal `<p>`.
6. **H2** "Čo robí Penzión Lagáň najprestížnejším strediskom na západe Slovenska?", followed by its two paragraphs.
7. **Sub-heading** "Pokoj medzi vinicami. Termálny raj Podhájskej len na skok.": it is smaller and grey in the copy, so make it an `<h3>`. This is new style #2 of two.
   - `.main-col h3`: 24px, weight 600, color `#444`, line-height 1.35, margin `8px 0 20px`.
   - At ≤480px, set it to 21px.

   Then add photo `/advertorialsvp-2/photo-2.png` (1536×1024, alt "Deti na lúke pri Penzióne Lagáň"), then the paragraphs through "Získate oboje na jednom mieste."
8. **`<h3>`** "Zázemie pre celú školu blízko každého mesta na západe", followed by its paragraphs through "…najprestížnejším strediskom na západe Slovenska." This section has no photo.
9. **H2** "Stredisko overené najznámejšími hviezdami Slovenska".
   - Photo `/advertorialsvp-2/photo-3.png` (1080×1080, alt "Talentárium Mira Jaroša v Penzióne Lagáň").
   - Paragraphs through "…organizuje N Dance Company v posledných rokoch svoje tanečné tábory a sústredenia."
   - Photo `/advertorialsvp-2/photo-4.jpg` (1440×1080, alt "N Dance Company v Penzióne Lagáň").
   - The remaining paragraphs through "…ktoré mu zverili svojich žiakov a celý pobyt."
10. **H2** "Čo všetko bude mať vaša škola v Penzióne Lagáň k dispozícii?".
    - Photo `/advertorialsvp-2/photo-5.png` (1672×941, alt "Sála, športová hala, bazén a izby Penziónu Lagáň").
    - Then `<ul className="checklist">` with all 14 bullets as plain text. Don't add bold.
11. **H2** "Prečo sa Penzión Lagáň rozhodol neorganizovať školy v prírode sám?", followed by its paragraphs.
12. **H2** "Penzión Lagáň si pre školský rok 2026/27 vybral CK Bombovo", followed by its paragraphs.
13. **H2** "Čo táto spolupráca znamená pre učiteľky?", followed by its paragraphs.
14. **H2** "Program, ktorý nemusí zostať na pleciach učiteliek".
    - Photo `/advertorialsvp-2/photo-6.jpg` (5184×3456, alt "Animátori CK Bombovo s deťmi v Penzióne Lagáň").
    - Then its paragraphs.
15. **H2** "Zážitok pripravený priamo pre Penzión Lagáň", followed by its paragraphs.
16. **H2** "Lagáň si vybral Bombovo. Učiteľky mu už roky dôverujú.".
    - Photo `/advertorialsvp-2/photo-7.png` (1200×800, alt "Animátori CK Bombovo s učiteľkami"). This is the same image svp-1 uses above its reviews.
    - The intro paragraph "Rozhodnutie penziónu je dôležitým signálom…".
    - The `reviews-section` with the same three-card markup as svp-1, including ★★★★★. Replace the text:
      - Card 1: the quote without its outer „ “ (the decorative `review-mark` already shows „). Name "Mgr. Emília Pischová", school "ZŠ Horné Rakovce, Turčianske Teplice".
      - Card 2: the quote without its outer „ “. Name "PaedDr. Juhariová", school "ZŠ Beethovenova, Nitra".
      - Card 3: `review-quote-text` holds the sentence "Vedenie ZŠ Kostolné Kračany ocenilo, že…" followed by „Komunikácia bola počas celej prípravy aj pobytu výborná.“, keeping those inner quote marks. Name "Riaditeľ", school "ZŠ Kostolné Kračany".
    - After the reviews, the two closing paragraphs ("V recenziách sa opakujú…" and "Pripravený program…").
17. **H2** "Garancia vrátenia peňazí pre rodičov", followed by its paragraphs.
18. **Mid-article CTA box**: `<div className="mid-cta-box" id="scroll-trigger">` goes here, directly before the price section, which is the same spot it has in svp-1. The id matters because it controls when the sticky bar appears.
    - If the pasted copy has no text for this box, reuse svp-1's box word for word: the −30 € badge, both paragraphs, and the button.
    - Its button gets `data-advertorial-cta="mid"`.
19. **H2** "Koľko stojí škola v prírode v Penzióne Lagáň?".
    - Its paragraphs, then "V základnej cene je zahrnuté:" as a `<p>`.
    - Then a plain `<ul>` (✅ bullets, like svp-1's price list).
20. **H2** "Voliteľné služby", then a plain `<ul>`.
21. **H2** "Zľava 30 € pri rezervácii školy v prírode", followed by its paragraphs.
22. **Offer box** (the copy's [PONUKOVÝ BOX]), using svp-1's `.offer-box` markup:
    - title "Cenová ponuka so zľavou 30 €"
    - `<p>Škola v prírode v Penzióne Lagáň za <strong>195 € na dieťa</strong> namiesto 225 €.</p>`
    - note "Počet dostupných termínov je obmedzený."
    - **No button inside the box.** In this copy, the button comes after the next section.
23. **H2** "Ako získať cenovú ponuku?", followed by its three paragraphs. Then the final CTA:

    ```tsx
    <div className="cta-btn-wrap"><a href={ctaUrl} data-advertorial-cta="final" className="cta-btn">ZÍSKAŤ CENOVÚ PONUKU SO ZĽAVOU &rarr;</a></div>
    ```
24. **Footer**: unchanged. **Sticky bar**: unchanged ("👉 Získať ponuku so zľavou 30 €"), except its link gets `data-advertorial-cta="sticky"`.

Every CTA uses the same `ctaUrl`. After the changes above, there are exactly 3: mid, final and sticky.

## Step 3: PostHog tracking in `advertorialsvp-2/AdvertorialTracking.tsx`

The goal is a separate funnel for Lagáň that is easy to filter in PostHog without joining anything. The event names stay the same as svp-1, so the funnel can be copied from Osrblie and only the filter values change.

1. Add two props, `advertorial: string` and `destination: string`.
2. In the first `useEffect`, before any capture, register a super property. PostHog then attaches it to every later event from this browser, including `stredisko_viewed` and `svp_registration_submitted` on the Lagáň page:

   ```ts
   posthog.register({ from_advertorial: advertorial })
   ```

   Then:

   ```ts
   posthog.capture('advertorial_viewed', { advertorial, destination, utm_source, utm_medium, utm_campaign, utm_content, fbclid })
   ```
3. Click handler: keep the listener on `a[data-advertorial-cta]`, but read the attribute value from the clicked link:

   ```ts
   const handleClick = (e: Event) => {
     const cta_position = (e.currentTarget as HTMLElement).dataset.advertorialCta || 'unknown'
     posthog.capture('advertorial_clicked', { advertorial, destination, cta_position })
   }
   ```
4. Keep the byline-date and sticky-bar effects exactly as they are.

## Step 4: One additive line in svp-1

In `app/(advertorials)/advertorialsvp-1/AdvertorialTracking.tsx`, add `posthog.register({ from_advertorial: 'advertorialsvp-1' })` as the first line of the existing `advertorial_viewed` effect. Change nothing else in svp-1.

The reason: if someone reads svp-2 and later svp-1, their later events must say svp-1, not stay stuck on svp-2. None of the existing svp-1 insights use this property, so they are unaffected.

## Step 5: CookieYes banner

This keeps svp-2 the same as svp-1.

- In `middleware.ts`, change the matcher to `['/advertorialsvp-1', '/advertorialsvp-2']`.
- Update the comments in `middleware.ts` and `app/layout.tsx` so they name both pages.

## Step 6: Checks

Before you start, confirm the `public/advertorialsvp-2/` photos are still untracked in git, and include them in your commit.

1. Run `npx tsc --noEmit`. It must pass.
2. Run `grep -rniE "advertorialsvp-1|osrbl|biatlon|185 €|215 €" "app/(advertorials)/advertorialsvp-2"`. It must return nothing.
3. If no dev server is running, start `npx next dev -p 3001`. The first compile is slow, so wait. Then run `curl -s localhost:3001/advertorialsvp-2` and confirm:
   - HTTP 200
   - the HTML contains `to=%2Fskoly-v-prirode%2Fpenzion-lagan&amp;source=advertorialsvp-2`, exactly 3 times
   - there is no `cookieyes` script tag
   - there are 7 `/advertorialsvp-2/photo-` image references

   Also check that `/advertorialsvp-1` still returns 200.
4. Don't call `/api/go` locally, because it writes a click row to the `ad_events` database.
5. Commit with the message `Add advertorialsvp-2 (Penzión Lagáň): copy, Lagáň CTAs, separate PostHog/ad_events tracking`. **Don't push.**

## When you finish, tell me

- the files you changed and created
- the exact CTA `href` you rendered
- the results of the checks in step 6
- anything in the copy you couldn't place cleanly

Then I'll look at the page in the browser myself.

---

[PASTE THE COPY HERE]
