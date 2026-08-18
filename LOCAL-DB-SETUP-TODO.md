# TODO: Give local development its own database

Not urgent. Do this in its own focused session when not blocked on other work.

---

## Prompt to paste into a new chat

> I want to stop my local dev server from using the production database.
>
> Right now `DATABASE_URI` in my `.env` points at the live Postgres behind
> www.bombovo.sk, so when I run `npm run dev` on my computer I'm working
> against real customer data — registrations, reviews, bookings.
>
> I want a local copy of that database on my own machine instead, so I can
> develop and experiment without any chance of touching real data.
>
> Read `payload.config.ts`, `.env`, `migrations/`, and
> `scripts/apply-migrations.ts` first so you understand the current setup.
>
> Important: the production database must not be modified in any way. Copying
> data out of it is read-only and fine; changing it is not.
>
> I am not a developer — explain what you're doing in plain terms and ask me
> before anything that affects the live site.

---

## Background — why this is wanted

**Current state (as of 2026-08-18):** one database. The live site uses it, and
so does local development. Anything deleted or edited locally through the admin
panel is deleted or edited for real.

**Already fixed, separately:** Payload's automatic schema sync (`push`) used to
run on every dev server start, comparing the code's schema against the real
database and interactively prompting to alter or drop columns. Answering wrong
would have destroyed live data, and it also blocked AI-assisted work — the
server would hang waiting for a human to answer. Fixed in commit `14c9c17` by
setting `push: false` in `payload.config.ts`. Verified: dev server starts in
~1s and serves `/`, `/admin`, `/letne-tabory`, `/recenzie` with no prompts.

**What this TODO covers is a different, smaller risk:** a person or an AI
deliberately deleting or editing something real through the local admin panel.
That takes an intentional action rather than happening by accident on startup,
which is why it is lower priority.

---

## Rough shape of the work

1. Install Postgres locally (or run it in Docker).
2. Create an empty local database.
3. Dump production **read-only** (`pg_dump`) and restore into the local one.
   Reading does not alter production.
4. Point local development at the local database — `.env.local` overriding
   `DATABASE_URI` is the natural fit, since Next.js already loads it ahead of
   `.env` and it is git-ignored. Production keeps using Vercel's own env vars
   and is unaffected.
5. Verify: dev server runs against local, and confirm production is untouched.
6. Note how to refresh the copy later (repeat the dump/restore).

Estimated an hour or two, with room for the usual Windows friction.

---

## Known tradeoff

The copy is a **snapshot**, not a live mirror. New registrations on the real
site will not appear locally until the copy is refreshed. That is fine for
design and code work.

---

## Also outstanding (unrelated, pre-existing)

- **React version mismatch in the admin panel** — Payload wants React >= 19,
  project has 18.3.1. `/admin` returns HTTP 200 and works in practice, but the
  log shows an unhandled rejection, so parts of the admin UI may misbehave or
  silently fail to save. Fixing means upgrading React across the whole site —
  a deliberate project with testing, not a quick change. Pre-existing, not
  caused by the 2026-08-18 machine rebuild.

## Resolved

- ~~**`sharp` not installed**~~ — misdiagnosed. sharp was installed and loading
  fine; `payload.config.ts` simply never passed it to `buildConfig`, so the
  imageSizes in `collections/Media.ts` were ignored and uploads were stored at
  full size. Fixed in commit `4afc58d`. Existing media is unchanged; only new
  uploads are resized.
