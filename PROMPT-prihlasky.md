# Rebuild the two application pages: /prihlaska-animator and /prihlaska-zdravotnik

## Goal
The new `/pridaj-sa-do-timu` page already does the selling. These two pages have one job: **get people through the form without hesitating.** The visitor has already decided. Keep both pages short, clear and fast on a phone. Don't add selling sections, photos of kids or testimonials.

Both pages share **the same layout and components**; only the content differs. Build one shared set of components and feed each page its own config.

## Before you start
1. Invoke the `frontend-design` skill (CLAUDE.md requires it). The design is yours. Make it look good and modern, and give it **the same visual language as the new `/pridaj-sa-do-timu` page**: read `app/(app)/pridaj-sa-do-timu/page.tsx` and `PridajSaDoTimuClient.tsx` and reuse their fonts (Poppins plus the `SUBHEAD` font from `components/StrediskoCard.tsx` for headings), colors, button styles, radii and spacing. Animátor = bombovo red accent, zdravotník = bombovo yellow accent.
2. Read the current `app/(app)/prihlaska-animator/page.tsx` and `app/(app)/prihlaska-zdravotnik/page.tsx` and the API routes `app/(app)/api/contact-animator/route.ts` and `app/(app)/api/contact-zdravotnik/route.ts`, so you know what is being replaced. Do **not** reuse the old look or the old long forms.
3. Mobile first. Keep the usual wrapper: grey `TopBar`, `Header`, content, grey `Footer`.

## Page structure (both pages)

### 1. Short header
- A small back link above it: `← Späť na Pridaj sa do tímu` → `/pridaj-sa-do-timu`
- H1: `Prihláška animátor` / `Prihláška zdravotník`
- One sentence under it (see the content below).
- **3 small fact chips** in a row (they wrap on mobile), see the content below.

### 2. Two columns on desktop, stacked on mobile
- **Left (wider): the form**, in a clean card.
- **Right (narrower, sticky on desktop): "Čo sa stane po odoslaní"**, 3 numbered steps, plus the small "Dobré vedieť" block under it.
- On mobile the order is: header → form → "Čo sa stane po odoslaní" → "Dobré vedieť".

### 3. The form
**Step A, pick a training date.** Show the dates as **selectable cards** (radio-group semantics, keyboard accessible). Each card shows the date range and `Horský hotel Lomy`. Required. If there's only one date, preselect it. Put the dates in a config array at the top of the file so I can change them:
```ts
// TODO Matej: final 2027 dates
const TERMINY_ANIMATOR = ['05.03. – 07.03.2027', '[DOPLNIŤ termín 2]', '[DOPLNIŤ termín 3]']
const TERMINY_ZDRAVOTNIK = ['[DOPLNIŤ termín]']
```

**Step B, the fields.** Short labels, a real example as the placeholder, and inline validation messages in Slovak.

Animátor, required: `Meno`, `Priezvisko`, `Adresa` (ulica a číslo), `PSČ`, `Mesto`, `Telefón`, `Email`, `Intolerancie / alergie na jedlo` (textarea; tell them to write "žiadne" if none).
Animátor, optional: `Titul`. Add one more optional field: `Prihlasuješ sa s kamarátom? Napíš jeho meno` (the FAQ on the main page promises that friends who list each other share a room).

Zdravotník, required: `Meno`, `Priezvisko`, `Adresa`, `PSČ`, `Mesto`, `Telefón`, `Email`, `Vzdelanie / odbornosť` (a select: `Lekár/ka`, `Sestra`, `Pôrodná asistentka`, `Zdravotnícky záchranár/ka`), `Intolerancie / alergie na jedlo`.
Zdravotník, optional: `Titul`.

**GDPR consent checkbox (required)** with the same text as the current animator form:
`Označením súhlasím s administratívnym spracovaním mojich uvedených osobných údajov pre účely výberového konania. Tieto údaje poskytujú len pre Bombovo CK a nebudú poskytnuté iným osobám a subjektom.` Link to `/gdpr`.

**Price line right above the submit button** (this answers the main objection at the moment it comes up):
- Animátor: `Poplatok za školenie: 30 €`, and under it, small: `Zahŕňa odborné školenie, 2× ubytovanie a plnú penziu počas školenia. Uhrádzaš až po odoslaní prihlášky, do 14 dní.`
- Zdravotník: `Poplatok za školenie: 20 €`, and under it, small: `Zahŕňa odborné školenie, ubytovanie a stravu počas školenia. Uhrádzaš až po odoslaní prihlášky, do 14 dní.`

Submit button: `Odoslať prihlášku` (in the role's accent color). Show a loading state while sending. On error: `Prihlášku sa nepodarilo odoslať. Skús to znova alebo nám napíš na bombovo@bombovo.sk.`

### 4. "Čo sa stane po odoslaní" (right column)
3 numbered steps:
1. `Príde ti email s potvrdením a platobnými údajmi.`
2. `Do 14 dní uhradíš poplatok za školenie (30 € / 20 €).`
3. `Cca 2 týždne pred školením ti pošleme všetky informácie.`

### 5. "Dobré vedieť" (under the steps, max 3–4 short accordion items, all closed)
Animátor:
- `Prečo sa školenie platí?` → `Poplatok 30 € pokrýva odborné školenie, ubytovanie na dve noci a plnú penziu na Horskom hoteli Lomy. Na konci získaš certifikát.`
- `Čo ak nakoniec nebudem môcť prísť?` → `Daj nám čo najskôr vedieť na bombovo@bombovo.sk. [DOPLNIŤ: vrátenie poplatku / presun na iný termín]`
- `Dostanem po školení prácu?` → `Po úspešnom absolvovaní školenia ťa nominujeme na školy v prírode. Keď ťa pedagógovia a boss (šéf animátor) ohodnotia dobre, môžeš ísť aj na letné tábory.`
- `Podmienky` → `Viac ako 18 rokov k 1. 7. 2027, bezúhonnosť a účasť na školení.`

Zdravotník:
- `Kto sa môže prihlásiť?` → `Odborne spôsobilá osoba: lekár, sestra, pôrodná asistentka alebo zdravotnícky záchranár. Za zdravotníka sa nepovažuje absolvent kurzu Slovenského Červeného kríža, kurzu prvej pomoci ani študent medicíny.`
- `Prečo školenie, keď som zdravotník?` → `[DOPLNIŤ: čo sa na školení zdravotník naučí, napr. ako funguje škola v prírode a tábor, dokumentácia, spolupráca s animátormi]`
- `Koľko zarobím?` → `300 € za 5-dňovú školu v prírode alebo lyžiarsky výcvik, 300 – 350 € za 7-dňový letný tábor. Ubytovanie a stravu hradíme my.`
- `Čo ak nakoniec nebudem môcť prísť?` → same as the animátor answer.

Keep `[DOPLNIŤ]` visible on the page so I can see what's missing.

### 6. Success state (replaces the form in place after a successful submit, then scroll to it)
- A big friendly heading: `Si prihlásený/á! 🎉` (the emoji is OK here only), and under it `Poslali sme ti email so všetkými údajmi. Pozri aj priečinok Spam/Promo.`
- A payment card:
  - `Suma: 30 €` (or `20 €`)
  - `IBAN: SK92 5600 0000 0008 3462 3001`, with a copy button
  - `Poznámka k platbe: {Meno} {Priezvisko}, {termín}`, prefilled from the form, with a copy button
  - `Splatnosť: do 14 dní`
  - Copy buttons show `Skopírované ✓` for 2 seconds.
- Under it: `Tešíme sa na teba na Lomoch!`

## Emails (backend)
Update `app/(app)/api/contact-animator/route.ts` and `app/(app)/api/contact-zdravotnik/route.ts`:
1. **Keep the internal notification** to `maja@bombovo.sk`, but send only the new fields (including the chosen date and, for animators, the friend's name).
2. **Add a confirmation email to the applicant** (Resend, from `Bombovo <info@bombovo.sk>`, reply-to `bombovo@bombovo.sk`), with subject `Tvoja prihláška do Bombova: školenie {termín}`. Simple, clean HTML that reads well in Gmail on a phone. Use exactly this text, with the date and name filled in:

**Animátor:**
```
Ahoj z Bombova,
teší nás Tvoj záujem pracovať ako Animátor pre našu CK Bombovo.

Srdečne ťa pozývame na naše školenie v termíne {termín}, miesto konania je Horský hotel LOMY, Horná Ves okr. Prievidza.

Poplatok za školenie 30 eur uhraď do 14 dní od podania prihlášky:
IBAN: SK92 5600 0000 0008 3462 3001
Do poznámky je nutné uviesť meno a priezvisko účastníka a termín školenia ({meno} {priezvisko}, {termín}).

V cene je zahrnuté:
- odborné školenie
- ubytovanie a stravovanie

Podmienky: viac ako 18 rokov, bezúhonnosť, účasť na školení animátorov.

Bližšie informácie o školení budú zasielané cca 2 týždne pred nástupom na školenie. Ak by si sa rozhodol neabsolvovať školenie, prosím ťa, daj včas vedieť.
```

**Zdravotník:**
```
Ahoj z Bombova,
teší nás Tvoj záujem pracovať ako Zdravotník pre našu CK Bombovo.

Srdečne ťa pozývame na naše školenie v termíne {termín}, miesto konania je Horský hotel LOMY, Horná Ves okr. Prievidza.

V cene je zahrnuté:
- odborné školenie
- ubytovanie a stravovanie

Poplatok za školenie 20 eur uhraď do 14 dní od podania prihlášky:
IBAN: SK92 5600 0000 0008 3462 3001
Do poznámky je nutné uviesť meno a priezvisko účastníka a termín školenia ({meno} {priezvisko}, {termín}).

Podmienky: odborne spôsobilá osoba - lekár, sestra, pôrodná asistentka, zdravotnícky záchranár.
Za zdravotníka sa nepovažuje absolvent kurzu Slovenského Červeného kríža, kurz prvej pomoci, ani študent medicíny (medik).

Bližšie informácie o školení budú zasielané cca 2 týždne pred nástupom na školenie. Ak by si sa rozhodol neabsolvovať školenie, prosím ťa, daj včas vedieť.
```
3. Escape all user input before putting it into the email HTML.
4. Validate the required fields on the server too (return 400 with a Slovak message).
5. If the confirmation email fails but the internal one succeeded, still return success to the user (log the error); the application is what matters.

## Metadata
- `/prihlaska-animator`: title `Prihláška animátor | Bombovo`, description `Prihlás sa na školenie animátorov Bombovo na Horskom hoteli Lomy a staň sa animátorom na školách v prírode a letných táboroch.`
- `/prihlaska-zdravotnik`: title `Prihláška zdravotník | Bombovo`, description `Prihlás sa ako zdravotník na školy v prírode, lyžiarske výcviky a letné tábory Bombovo.`

## Also
- Remove the `Test Page` link (`/test-tabor`) from `components/Footer.tsx`. Don't delete the page itself.

## Do not touch
- `/pridaj-sa-do-timu` or any other page.

## When you're done
- Don't screenshot (CLAUDE.md). Make sure the dev server runs on port 3001 and tell me to open `http://localhost:3001/prihlaska-animator` and `http://localhost:3001/prihlaska-zdravotnik`.
- Tell me how to test the emails safely (e.g. send a test application to my own email).
- Give me a short list of changed and created files.
- If something blocks you for more than two attempts, stop and tell me (CLAUDE.md).
