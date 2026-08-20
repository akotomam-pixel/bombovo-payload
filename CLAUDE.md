# CLAUDE.md — Frontend Website Rules

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Speak Up Early — Do Not Get Stuck
- **The code change is the deliverable. Finish it, then report it.** Do not hold a finished change back because a screenshot, server, or tool is misbehaving.
- **When something blocks you, stop and tell me within about two attempts.** Say what broke, why, and what you suggest. Do not silently keep trying — I am not a coder and I cannot see that you are stuck. From the outside, "working" and "stuck in a loop" look identical, and that is what makes it costly.
- **Never spend more time on tooling than on the actual work I asked for.** Tooling exists to serve the change, not the other way round.
- **A rule in this file is not a reason to keep hammering something that is not working.** If following a rule here is burning time, stop, tell me it is not working, and suggest changing the rule.
- If you notice yourself on a third attempt at the same thing: stop and ask.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Keep going while the screenshots are still finding real mismatches — but see the time limits in Screenshot Workflow. Once it looks right, stop and report; do not keep re-screenshotting to admire it.

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- **Which server depends on what you are building:**
  - Standalone `index.html` mockups → `node serve.mjs` (serves the project root at `http://localhost:3001`)
  - Pages inside the Next.js app (anything under `app/`, e.g. `/skoly-v-prirode/...`) → `npx next dev -p 3001`. `serve.mjs` cannot render these — it is a static file server.
- Note: port 3001 is used because the Next.js dev server occupies 3000.
- If a server is already running, do not start a second instance.
- **The Next dev server is slow on first compile** — a heavy route can take 2–3 minutes the first time, then it is cached. Budget for this before deciding to screenshot at all, and never sit and wait on it more than once.
- **Pages under `/skoly-v-prirode` are behind a password gate** (`middleware.ts`, cookie `svp_prezradene=1`). Plain `screenshot.mjs` will be redirected to the gate. Set that cookie in the Puppeteer script, or the screenshot is worthless.

## Screenshot Workflow

**Screenshots serve the design. They are not the deliverable — the code change is.**

### Time limits — these override everything else in this file
- **Two failed attempts and you stop.** If the screenshot has not worked after two tries, stop trying. Do not write a third script, do not debug the tooling, do not "just fix one more thing."
- **Roughly 5 minutes total on screenshots. If you pass that, stop.**
- When you stop: **report the code change, say plainly that the screenshot did not work and why, and ask me to look at the browser or Vercel preview instead.** I have both open. Me glancing at the page is faster than any workaround you can build.
- **Never let a screenshot problem delay reporting a finished code change.** The change is done when the code is written and typechecks. Tell me that first, then deal with the picture.
- **Never spend longer on the screenshot than on the design change itself.** If you notice that happening, you have already gone too far — stop and report.
- A screenshot that is merely awkward to get is not a reason to keep pushing. Ask.

### When to screenshot at all
- **Worth it:** new layout or section built from scratch, matching a reference image, anything where I asked "how does it look."
- **Usually skip it:** colour/text/copy swaps, renaming a button, changing a font size — changes where you already know exactly what will render. Just make the change and tell me.
- **Once it looks right, stop.** Confirming a good result twice adds nothing.

### Known traps in this project — do not rediscover these
- **Never wait on `networkidle2`.** Pages here load placeholder images from `picsum.photos` and never go network-idle, so it hangs for the full timeout. Use `domcontentloaded` plus a short fixed delay.
- Puppeteer scripts must live in the **project root** to resolve `puppeteer` — a script in a temp/scratch directory fails with `ERR_MODULE_NOT_FOUND`.
- Python is not available in this environment. Use Node, the Edit tool, or `sed` for file edits.

### Mechanics
- Puppeteer and Chrome are installed in the project. Chrome cache is at `~/.cache/puppeteer/`.
- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:3001`
- Screenshots are saved automatically to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten).
- Optional label suffix: `node screenshot.mjs http://localhost:3001 label` → saves as `screenshot-N-label.png`
- `screenshot.mjs` lives in the project root. Use it as-is.
- After screenshotting, read the PNG from `temporary screenshots/` with the Read tool — Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Output Defaults
- Single `index.html` file, all styles inline, unless user says otherwise
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Brand Assets
- Always check the `brand_assets/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color
