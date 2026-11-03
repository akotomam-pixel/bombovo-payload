# Build the new "Pridaj sa do tímu" page

## Goal
Replace the old `/pripravujeme` page with a new recruitment page at `/pridaj-sa-do-timu`. The page should convince young people (18–23, high school leavers and university students) to join Bombovo as an **animátor** or a **zdravotník** for školy v prírode and letné tábory. Right now I only want the **structure and design** so I can review it and choose photos. Every photo and video is a placeholder.

The two roles are **equally important**. Give them the same visual weight everywhere: the same button size, the same amount of content, and no "main" and "secondary" role.

## Before you start
1. Invoke the `frontend-design` skill (CLAUDE.md requires it).
2. Read the newer design on the strediská pages and follow that direction, not the old site design:
   - `app/(app)/skoly-v-prirode/[strediskoId]/StrediskoDetailClient.tsx`
   - `app/(app)/skoly-v-prirode/[strediskoId]/LomyClient.tsx` and the section components next to it
   Reuse their fonts, spacing, card styles, button styles and section rhythm.
3. Look at the current `app/(app)/pripravujeme/page.tsx` so you know what is being replaced. Do **not** copy its look.

## Design rules for this page
- **Do not use** the handwritten font (`font-handwritten` / `font-amatic` / The Girl Next Door), the hand-drawn blue SVG divider lines, or the yellow scribble underline from the old page. I don't want anything from the old design.
- Poppins stays as the main font. Use the subheading font from the strediská/Lomy pages (`--font-subhead`, Comic Neue) where it fits, the same way those pages use it.
- Use the existing brand colors from `tailwind.config.ts` (bombovo red, yellow, blue, dark). Animátor = red accent, zdravotník = yellow accent, kept consistent everywhere.
- Mobile first. Most visitors will come from Instagram on a phone.
- **Placeholders:** use plain solid-color blocks (a light brand tint is fine) with a short centered label naming what the photo should show, e.g. `FOTO: animátori s deťmi na tábore`. Give each one a fixed aspect ratio so the layout doesn't jump when real photos replace them. Don't use placehold.co.
- Follow the rest of CLAUDE.md (interactive states, no `transition-all`, and so on).

## Page structure (top to bottom)

Keep the usual page wrapper the other pages use: grey `TopBar`, `Header`, content, grey `Footer`.

### 1. Hero
Two columns on desktop (text left, media right); stacked on mobile.
- **H1:** `Zaži brigádu plnú zážitkov, dobrodružstva a nových kamarátov`
  (Put the hero texts in constants at the top of the file so I can swap them easily.)
- **Subheadline:** `Začni kariéru v Bombove`
- **Two equal buttons side by side** (stacked full width on mobile):
  - `Chcem byť animátor` (red) → links straight to `/prihlaska-animator`
  - `Chcem byť zdravotník` (yellow) → links straight to `/prihlaska-zdravotnik`
- **Media on the right:** placeholder `VIDEO / FOTO: animátori v akcii`. Later this will be a video, so build the slot so it can take an `<img>` now and a `<video>` later without layout changes. The slot is **16:9 landscape** (the video will be 1920×1080), the same as the video on the školy v prírode page (`SkolyVPrirodClient.tsx`). When it becomes a video it must be `autoPlay muted loop playsInline` with a poster image.

### 2. Koho práve hľadáme?
Rebuild the "A Number of Ways to Join" block from galileo-camps.com/job-overview as closely as possible, with our content and colors:

**Heading row**
- Section heading on the left: `Koho práve hľadáme?`
  - Font: the same font as the stredisko names on the stredisko cards (e.g. "Penzión Lagáň"). It's the `SUBHEAD` constant in `components/StrediskoCard.tsx` (`'var(--font-subhead), "Comic Sans MS", cursive'`, which is Comic Neue loaded in `app/layout.tsx`), bold. Make it large like Galileo's heading (around 40px on mobile, 56–64px on desktop), tight leading.
- **Tab pills on the right** of the heading row (they wrap below the heading on mobile): `Animátor` | `Zdravotník`.
  - Active pill: filled with the role's color, dark bold text.
  - Inactive pill: white, a 3px border in that role's color, dark regular text.
  - Fully rounded pills, generous padding, like Galileo.
  - Proper accessible tabs (`role="tablist"`, `role="tab"`, `aria-selected`, arrow-key navigation). Animátor is active by default.

**The panel** (below the heading row, full content width)
- A large rounded panel (around 32px radius) filled with the active role's color: animátor = a soft/light tint of bombovo red, zdravotník = bombovo yellow. Pick tints so dark text stays readable. The panel color switches with the tab.
- **Left column (about 55%)**: the role name as a big bold heading (`Animátor` / `Zdravotník`, Poppins, ~48px desktop), and under it the photo placeholder in a **white frame**: a white rounded card with ~12px white padding around the image, the image rounded too, landscape ratio (~3:2).
- **Right column (about 45%)**: a vertical accordion list, exactly like Galileo:
  - each item = a small illustrated icon on the left (use `react-icons`, already installed, sized ~36px, in dark color), the bold title in the middle, and a chevron on the right that flips when open
  - the open item shows its body text directly under the title, aligned with the title (not under the icon)
  - no borders or cards around items, just spacing
  - the first item is open by default, and only one is open at a time
  - smooth open/close (animate opacity/transform or grid-rows, never `transition-all`)
- **Under the accordions**: one CTA button in Galileo's style: white background, 2px dark border, fully rounded, bold dark text, and a hard offset dark shadow (no blur) below/right, which moves down/right with the shadow shrinking on hover and active.
- **Mobile**: the panel stacks: role name → framed photo → accordions → CTA (full width).

**Animátor tab**
- Photo placeholder: `FOTO: animátor s deťmi`
- Accordion `Čo budeš robiť` (icon: something playful, e.g. a whistle or game piece):
  `Pripravuješ a vedieš program pre deti na školách v prírode a letných táboroch. Hry, súťaže, šport, tvorivé dielne aj večerné programy. Si s deťmi celý deň a staráš sa o to, aby si pobyt užili.`
- Accordion `Čo ti to dá` (icon: e.g. a star or gift):
  bullet list: `Novú partiu ľudí, ktorí sú naladení ako ty` · `Brigádu, pri ktorej sa zabavíš` · `Certifikát zo školenia animátorov` · `Zážitky, na ktoré budeš spomínať` · `[DOPLNIŤ: odmena za turnus]`
- Accordion `Podmienky` (icon: e.g. a checklist or badge):
  bullet list: `Máš viac ako 18 rokov` · `Si bezúhonný/á` · `Absolvuješ 3-dňové školenie animátorov v Horskom hoteli Lomy`
- CTA button: `Chcem byť animátor` → links to `/prihlaska-animator`

**Zdravotník tab**
- Photo placeholder: `FOTO: zdravotník na tábore`
- Accordion `Čo budeš robiť`:
  `Staráš sa o zdravie detí na školách v prírode, lyžiarskych výcvikoch a letných táboroch. Si súčasťou tímu a celý pobyt prežiješ s nami.`
- Accordion `Čo ti to dá`:
  bullet list: `300 € za 5-dňovú školu v prírode alebo lyžiarsky výcvik` · `300 – 350 € za 7-dňový letný tábor` · `Ubytovanie a stravu hradíme my` · `Partiu ľudí, s ktorými je radosť pracovať`
- Accordion `Podmienky`:
  `Si odborne spôsobilá osoba: lekár, sestra, pôrodná asistentka alebo zdravotnícky záchranár.`
  Below it, in smaller muted text: `Za zdravotníka sa nepovažuje absolvent kurzu Slovenského Červeného kríža, kurzu prvej pomoci ani študent medicíny.`
- CTA button: `Chcem byť zdravotník` → links to `/prihlaska-zdravotnik`

Put the content of both tabs in one data array at the top of the component so I can edit the text without touching the layout.

### 3. FAQ
- Heading: `Časté otázky`
- Accordion list, one open at a time, all closed by default. Store it in a data array.
- Questions and draft answers (keep the `[DOPLNIŤ]` markers visible on the page so I can see what is missing):
  1. `Musím mať skúsenosti s animovaním?` → `[DOPLNIŤ]`
  2. `Ešte študujem. Môžem sa prihlásiť?` → `[DOPLNIŤ]`
  3. `Koľko si zarobím?` → `[DOPLNIŤ]`
  4. `Kde a kedy je školenie?` → `Školenie animátorov prebieha v Horskom hoteli Lomy (Horná Ves, okr. Prievidza). Termíny na rok 2027: [DOPLNIŤ].`
  5. `Prečo sa školenie platí?` → `Poplatok za školenie animátorov je 30 €. Zahŕňa odborné školenie, ubytovanie aj stravu počas celého školenia.`
  6. `Môžem sa prihlásiť spolu s kamarátom?` → `[DOPLNIŤ]`

### 4. Čo hovoria naši animátori a zdravotníci
- Heading: `Čo hovoria naši animátori a zdravotníci`
- 3 testimonial cards (horizontal scroll or stacked on mobile, a 3-column grid on desktop). Each has a round photo placeholder, a quote `[DOPLNIŤ: citát]`, a name `[Meno]` and a small role label (`Animátorka, 3 sezóny` style, placeholder). Store them in a data array.

### 5. Final CTA
- Short centered block: heading `Tak čo, ideš do toho?` plus the same two equal buttons as in the hero (`Chcem byť animátor` → `/prihlaska-animator`, `Chcem byť zdravotník` → `/prihlaska-zdravotnik`).

## Routing and links
1. Create the page at `app/(app)/pridaj-sa-do-timu/page.tsx`. Keep `page.tsx` a server component for metadata, and put the interactive parts (tabs, accordions) in a separate client component in the same folder.
2. Metadata:
   - title: `Pridaj sa do tímu | Brigáda animátor a zdravotník | Bombovo`
   - description: `Hľadáme animátorov a zdravotníkov na školy v prírode a letné tábory. Nová partia, zábava a leto plné zážitkov. Prihlás sa do tímu Bombova.`
3. Add a **permanent redirect** `/pripravujeme` → `/pridaj-sa-do-timu` in `next.config.js` (`redirects()`), then delete the old `app/(app)/pripravujeme` folder.
4. Update the links:
   - `components/Header.tsx`: both `/pripravujeme` links (desktop and mobile menu) → `/pridaj-sa-do-timu`
   - `components/Footer.tsx`: "Pridaj sa do tímu" currently points to `/prihlaska-animator` → change it to `/pridaj-sa-do-timu`
   - search the whole project for any other `/pripravujeme` references and update them
   - add `/pridaj-sa-do-timu` to `app/sitemap.ts` and remove `/pripravujeme` if it's there

## Do not touch
- `/prihlaska-animator`, `/prihlaska-zdravotnik` and their forms, and `app/(app)/api/contact-animator`. Those application pages will be redesigned in a later step.
- Any other page.

## When you're done
- Don't screenshot the page (CLAUDE.md). Run the Next dev server on port 3001 if it isn't already running, and tell me to open `http://localhost:3001/pridaj-sa-do-timu`.
- Give me a short list of the files you changed or created.
- If something blocks you for more than two attempts, stop and tell me (CLAUDE.md).
