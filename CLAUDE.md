# CLAUDE.md — Frontend Website Rules

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Speak Up Early — Do Not Get Stuck
- **The code change is the deliverable. Finish it, then report it.** Do not hold a finished change back because a server or tool is misbehaving.
- **When something blocks you, stop and tell me within about two attempts.** Say what broke, why, and what you suggest. Do not silently keep trying — I am not a coder and I cannot see that you are stuck. From the outside, "working" and "stuck in a loop" look identical, and that is what makes it costly.
- **Never spend more time on tooling than on the actual work I asked for.** Tooling exists to serve the change, not the other way round.
- **A rule in this file is not a reason to keep hammering something that is not working.** If following a rule here is burning time, stop, tell me it is not working, and suggest changing the rule.
- If you notice yourself on a third attempt at the same thing: stop and ask.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Do not screenshot the result to check it — screenshots in this project don't work reliably and have wasted time in the past. Make the change, then ask me to look at the browser or Vercel preview instead.

## Local Server
- **Which server depends on what you are building:**
  - Standalone `index.html` mockups → `node serve.mjs` (serves the project root at `http://localhost:3001`)
  - Pages inside the Next.js app (anything under `app/`, e.g. `/skoly-v-prirode/...`) → `npx next dev -p 3001`. `serve.mjs` cannot render these — it is a static file server.
- Note: port 3001 is used because the Next.js dev server occupies 3000.
- If a server is already running, do not start a second instance.
- **The Next dev server is slow on first compile** — a heavy route can take 2–3 minutes the first time, then it is cached.
- **Pages under `/skoly-v-prirode` are behind a password gate** (`middleware.ts`, cookie `svp_prezradene=1`).
- Python is not available in this environment. Use Node, the Edit tool, or `sed` for file edits.

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
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color
