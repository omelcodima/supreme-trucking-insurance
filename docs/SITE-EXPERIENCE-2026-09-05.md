# Site experience cleanup

Approved scope: simpler navigation, a shorter homepage, clear quick/full quote modes, a mobile-friendly full application, searchable articles, and a real agent profile. Dmitri Omelco explicitly approved his name and existing photo for About.

## Implementation boundaries

- Existing state, operation, coverage, and article URLs remain intact. The four local SEO commits and the latest published-blog snapshot from origin/main were preserved.
- Shared header/footer, service layout, buttons, typography, and contact actions use a consistent neutral/orange treatment.
- Quote pages do not show the floating indication shortcut or mobile quote bar while someone is applying.
- Quick requests keep the existing `/api/quote` payload. Service links can preselect coverage or pass operation context. Airtable's Quotes / Coverage Type field was checked read-only: it is singleLineText, so cargo-only is compatible.
- The full application keeps `/api/dot-lookup`, `/api/vin-decode`, and `/api/full-application`. Submission buttons share the same handler, reject incomplete contact details, suppress repeat identical submissions, and permit resubmission after changes.
- New applications have blank historical unit counts; existing saved drafts remain unchanged. Public Agent/Customer/Reset controls are hidden.
- No email credentials, provider settings, DNS, backend delivery logic, or publishing automations changed.
- Unsupported on-page testimonials were replaced with a direct Google Business profile link, not fabricated ratings or reviews.

## Full application source

Edit `src/application/template.html`, not the serialized template in `public/quote-application.html`. Run `npm run build:application` after edits for local development. `npm run build` runs this automatically and preserves the existing bundled runtime and fonts.

The iframe theme and same-origin sizing bridge live in `public/application-theme.css` and `public/application-bridge.js`. Parent messages validate both origin and source window. The full application mounts on demand, remains mounted across tab switches, and uses the outer page scroll.

## Asset provenance

- Agent photo: existing user-owned `dmitri-office-headshot.png`, published as `/images/dmitri-omelco.png` with permission.
- Compact logo: original site SVG with a tighter viewBox; artwork unchanged.
- Existing truck images and promotional HTML retained. The promo loads only when Watch Supreme is selected.
- Market logos are local copies from the companies' official sites; these markets were already listed on the website. Availability language remains qualified.

Official logo sources:

- Progressive Commercial: https://images.contentstack.io/v3/assets/blt182d5a8118fde242/bltef51a3d8780e8bdc/697743a03782ac5fda07c1f9/logo-progressivecommercial.svg
- Great West: https://orgreatwest.com/hubfs/2026%20Website/Global/OR-GreatWest-Horizontal-Blue-CROPPED.svg
- Northland: https://www.northlandins.com/ClientResources/tds-icons/assets/icons/logos/svg/northland-logo-large.svg
- Canal: https://www.canalinsurance.com/images/canal-logo.png

## Verification

- Production build and lint pass.
- 66 Node tests pass, including new article filters, quote context, template/bundle parity, validation, duplicate prevention, and retry tests.
- Existing timeout tests need a referenced timer on this Node runtime because AbortSignal.timeout alone does not keep the test process alive. The verified full-suite command was:

```sh
node --experimental-strip-types --import 'data:text/javascript,import {after} from "node:test";const t=setInterval(()=>{},1000);after(()=>clearInterval(t));' --test src/lib/*.test.ts
```

- Isolated Playwright/Chrome checks covered desktop keyboard menus and Escape, mobile menu closure, service preselection, quick-request error retention/success, all eight application steps, DOT/VIN prefill UI, custom ELD/dashcam/garage/history values, draft persistence, direct submit, duplicate clicks, and edited resubmission.
- Blog pagination, search, empty state, guide filtering, state selection, promo open/close, and iframe cleanup pass.
- Home, cargo, quote, blog, About, and reviews have no horizontal overflow at 320, 390, 768, and 1440 pixels. Desktop/mobile screenshots inspected.
- Local SEO route audit: 121 sitemap URLs, 40 articles, no broken internal links, redirects, or missing snapshot sentinel.
- Safe lead-route checks return the expected HTTP 400 validation response on all four endpoints.

All browser submission tests intercepted network requests. No real quote emails were sent, and inbox delivery was not asserted by this change.

## Production handoff

- Code commit: `e9bf645` on `codex/site-experience-cleanup`.
- Vercel deployment: `dpl_5zvkZWE7LSKaEwFBHgGaE2vJhDNr`, built with production configuration, checked while staged, then promoted on September 5, 2026.
- Main domain: https://supremetruckinginsurance.com/ . Local development server: http://localhost:3105 .
- Repeated the isolated browser suite on the main domain successfully. The live SEO audit has 121 sitemap URLs, 40 articles, 105 unique internal links, zero broken links, and no missing article sentinel. Live safe validation checks pass on all four lead routes.
- GitHub synchronization is still blocked: the local `gh` token for `omelcodima` is invalid and SSH authentication also fails. `git push origin HEAD:main` did not change the remote. Local code is committed and the Vercel deployment is live, but origin/main still has the prior version.
- Required follow-up: reauthenticate GitHub with `gh auth login -h github.com`, then fetch and reconcile any new origin/main commits before a normal fast-forward push. Do not force-push. Until this is done, a later deployment from the old remote branch could replace this version.
