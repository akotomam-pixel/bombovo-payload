# Waitlist Phase 2: wire the two EcoMail email triggers into the code

## Context

Phase 1 already built: the `waitlist-signups` collection, the button/modal, saving a signup, and subscribing the contact to two EcoMail lists (the dedicated "ŠVP - Sledovať dostupnosť" list, id 86, and "kontakty švp 2025", id 11) with `stredisko` and `termin` set as custom fields. It also built the internal alert: when a termín flips back to available, `checkAndAlertWaitlist()` in `lib/waitlistAlert.ts` looks up every `čaká` signup for that exact stredisko + termín and emails bombovo@bombovo.sk one ranked list via Resend.

What Phase 1 deliberately did NOT build (left as TODO comments): actually triggering an email to the teacher, either the signup confirmation or the "termín is free" notice. Those two EcoMail automations are now built and live:

- Pipeline id **47097**, "ŠVP Čakacia listina - Potvrdenie" — the confirmation email, sent right after signup.
- Pipeline id **47098**, "ŠVP Čakacia listina - Termín voľný" — the "it's free again" email, sent to everyone still waiting on that exact stredisko + termín, at the same moment the internal team alert fires.

Both are API-triggered pipelines: firing one means calling EcoMail's real trigger endpoint for a specific contact email, after that contact's custom fields are already set correctly. `ECOMAIL_API_KEY` already exists and works in this codebase (used by Phase 1's subscribe calls) — reuse whatever EcoMail helper/client Phase 1 already added rather than writing a second one. Check EcoMail's current API docs for the exact trigger endpoint and request shape before hardcoding anything (it's a POST to trigger a pipeline for one email address, no other per-call data — personalization only works because the contact's custom fields are set beforehand).

Both pipelines are already started (live) in EcoMail, so once this is wired in, real emails will actually send. Test with your own or Matej's email address, not a real teacher's.

One EcoMail-side setting outside your control: both pipelines currently only let a contact enter once, ever. If a second test with the same email doesn't produce a second email, that's this setting, not a bug in your code — don't chase it, that's already flagged to Matej to fix on his end.

## Step 1: Confirmation trigger, right after signup

Right where Phase 1 left the confirmation-email TODO (after the two subscribe calls in the signup handler): once the contact is successfully subscribed to list 86 with `stredisko` and `termin` set, also set one more custom field, `stredisko_url` — the specific stredisko's own page URL, e.g. `https://www.bombovo.sk/skoly-v-prirode/{slug}`. Figure out the right slug/URL from whatever the codebase already uses to link to a stredisko's page (check `data/rebuiltStrediska.ts` and the Strediska collection). Then call EcoMail's trigger endpoint for pipeline **47097** with that contact's email.

Same resilience rule as Phase 1: if any of this fails, don't block the signup save itself, log the failure clearly.

## Step 2: "Termín free" trigger, right after the internal alert

In `checkAndAlertWaitlist()`, right after the internal Resend email to bombovo@bombovo.sk sends (or regardless of whether it succeeds, your call, just don't let one block the other): for **every** entry in `waiting.docs` (the same already-filtered list used for the internal alert — same stredisko, same termín, nothing broader):

1. Generate a fresh random integer between 3 and 12 for that specific person (not the same number reused across the batch, each waiting teacher gets their own independently random number — this is intentional per Matej, it's a display number, not a real count, he's already cleared this).
2. Set that number as a custom field `pocet_pedagogov` on that contact in EcoMail (same update-contact call pattern as Step 1). `stredisko_url` should already be set from signup time, but re-setting it here too is fine and safer.
3. Call EcoMail's trigger endpoint for pipeline **47098** for that contact's email.

Loop over all matching entries. One EcoMail failure for one person shouldn't stop the loop for the rest, and shouldn't block marking entries `upozornené` or block the internal Resend email. Log each failure clearly with which email it was for.

## Merge tag / field reference

The templates use these exact EcoMail custom field names (all lowercase, no diacritics, case-sensitive):

- `stredisko` — already set by Phase 1 (human-readable name, e.g. "Horský Hotel Lomy")
- `termin` — already set by Phase 1 (exact display string, e.g. "12.04. – 16.04.2027")
- `stredisko_url` — new, that stredisko's page URL
- `pocet_pedagogov` — new, random 3–12, only used by pipeline 47098

## Verify before reporting done

Real end-to-end test, not a code review:

1. Submit a real signup (your own email or one Matej gives you) on a sold-out termín. Confirm the confirmation email actually arrives, with the real stredisko name and termín filled in (not raw `*|stredisko|*` text), and confirm in EcoMail that the contact now has `stredisko_url` set correctly.
2. Flip that same termín back to available the way this stredisko's architecture actually requires (Payload field edit, or `npm run waitlist:check` for the rebuilt-architecture strediská). Confirm both emails arrive: the internal team alert (unchanged from Phase 1) and the new "termín free" email, with `stredisko`, `termin`, and some number between 3 and 12 all correctly filled in, and the button linking to that specific stredisko's real page.
3. Do this with at least two different test signups on the same termín, confirm each one's email shows a different počet-pedagógov number, not the same one repeated.
4. Confirm an EcoMail failure (e.g. temporarily break the API key) doesn't stop the signup from saving or the internal Resend alert from sending, only logs the failure.

## What to send back

Confirmation both triggers actually fired (not just that the code compiles), the real email content received for both (screenshot or pasted text), the actual `stredisko_url` value used for at least one real stredisko so it can be checked, and confirmation that an EcoMail failure doesn't block anything else.
