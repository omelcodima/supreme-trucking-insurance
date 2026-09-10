# Switchable homepage design

Owner control: https://supremetruckinginsurance.com/admin/design

Sign in to the owner workspace, select **Website design**, then **Use Classic**
or **Use Cinematic**. This changes the public homepage for all visitors, not a
browser-only preference. Reload an already-open homepage after switching.
Classic retains the original photo, Three.js motion and its pause control.
Cinematic uses a static, text-free Higgsfield background with accessible HTML
headings, links, phone number, service-area text and the existing video player.
There is no new autoplay video and no additional analytics or ad campaign.

## Persistence and rollback

- `sti_homepage_design` is a separate singleton table. Initial installation selects
  Cinematic; re-running its migration does not reset an existing owner choice.
- Runtime role has only SELECT/UPDATE on this table. No permission changes to
  customer leads, consent evidence, owner authentication or existing audit records.
- Owner session and same-origin checks protect `/api/admin/design`; a 1 KB body
  limit and strict variant/version validation reject malformed changes.
- Setting and append-only audit entry commit atomically. Stale versions return
  409 and require a reload instead of overwriting another window's choice.
- The homepage uses server-rendered ISR HTML, with a 60-second fallback
  revalidation interval. Successful saves invalidate `/` immediately. Existing
  open pages must be reloaded. Database read failure falls back to Classic.
- A full deployment rollback remains possible independently of the design choice.

Only apply the additive migration with distinct migration/runtime credentials
for the same dedicated `supreme_owner` database:

```sh
node --env-file=/absolute/private/runtime-env-file --experimental-strip-types scripts/migrate-homepage-design.mts
```

Do not run the broader owner-store provisioning script for this feature. No new
environment variables, Neon billing changes or elevated runtime grants are needed.

## Asset provenance

- Approved mockup: Higgsfield job `d222fb78-4ca8-48ba-831b-9ab034b4bb6d`.
- Background-only edit: `f862e938-0a99-4c28-a42b-fc7d19b7fd4a`, GPT Image 2,
  high quality, 2k, 16:9. Removed the mockup's header, lettering and controls,
  preserving the graphite semi, highway and sunset.
- Mechanical WebP conversion in Higgsfield sandbox: 2400 x 1357, quality 84,
  160,766 bytes. Uploaded media `880c7c09-691b-4101-94a6-57e658bdffa0`.
- Project asset: `public/images/hero-cinematic.webp`. Original
  `public/images/hero-premium.jpg` and motion assets remain unchanged.
- This is illustrative AI imagery, not a photograph of an insured's vehicle.

## Verification (September 10, 2026)

- 144 unit tests; lint; TypeScript and production-mode Next.js build passed.
- Local PostgreSQL test: both variants persist, stale saves fail, audit failure
  rolls back the setting, restricted grants hold, lead/consent counts unchanged.
- Browser test used the isolated local QA database and a synthetic email owner.
  No real sign-in email, lead, application or customer message was sent.
- Authenticated owner UI changed Cinematic → Classic → Cinematic. Separate
  public page loads showed each selected version; Classic motion became ready.
- Logged-out design route redirects to sign-in; same-origin unauthenticated API
  returns 401; cross-origin API returns 403. Private/no-store and noindex headers
  verified. Existing video dialog opens and closes.
- Responsive desktop, tablet and mobile visual checks performed, including 320,
  390, 768 and 1440-pixel widths. Follow-up release checks are recorded separately.
- Local 48-state/service-area regression passed. Local route audit: 119 sitemap
  routes, 39 blog articles and zero broken links. Local uses the existing blog
  snapshot fallback because its synthetic Airtable source returns 404; production
  counts are verified separately against the real published source.

To repeat database integration tests, use the isolated localhost QA environment:

```sh
node --env-file=/absolute/private/qa-env-file --experimental-strip-types scripts/verify-homepage-design.mts
```

`scripts/homepage-qa-mail.mjs` is a **test-only** Node preload. It refuses any
non-local QA database or non-synthetic owner and intercepts only test OTP email.
It is never imported by application code and must not be loaded in production.
