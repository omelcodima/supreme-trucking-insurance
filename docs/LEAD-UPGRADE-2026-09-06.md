# Quote and Services Release

## Production

- URL: https://supremetruckinginsurance.com
- Status: READY, verified September 6, 2026.
- Source commit: `facec75af4431603a2995adab734cbbcd1525cb7`.
- Deployment: `dpl_2cibtMJVpqrPGVstxxRDXRfgz4r4`.
- Deployment URL: https://supreme-trucking-insurance-qi97gvo0o-supreme-insurance-agency.vercel.app
- Build time: approximately 27 seconds from building to ready; Next.js 16.3.3.

Before publishing, production was checked against GitHub main. Both pointed to source commit `9e42b2043134411a6b3cefdda85140fcfa3507b6`, which was the local branch's parent. No newer source changes were overwritten. This release was deployed from the local branch using the existing Vercel CLI workflow; it was not pushed to GitHub in this run. Synchronize this source before a future deployment from main.

## Changes

- Quick quote requests can look up a USDOT record through the existing live U.S. DOT Company Census API. Users explicitly confirm the company; client contact fields are not replaced by public registry contacts.
- Manual/no-DOT entry remains available. Changed DOT values cancel stale lookups and clear only previously confirmed autofill. Lookup errors preserve entered details.
- Quote and full application conversions require both HTTP success and explicit JSON acceptance. Contact and COI responses use their own event names, not quote conversions.
- Duplicate in-flight submission protection, strict full-application message source checks, and privacy-limited measurement parameters.
- Services includes three example situations synchronized with its tabs, truck hotspots, and coverage-prefilled quote links.
- An original quote-comparison article and editorial checklist are in `docs/content/compare-trucking-insurance-quotes-draft.md`. It is not public and has not been attributed to a human reviewer.

## Verification

- Lint and production build passed.
- 83 unit tests passed, including malformed response handling and preservation of the full application response body during measurement.
- Local and production browser checks passed at 320, 390, 768, 894, 1440, and 1920 pixels: layout overflow, stable coverage panel height, scenario synchronization, keyboard tabs, mobile navigation, reduced motion, canonical URL, and sitemap.
- Browser form checks covered quick DOT confirmation, timeout/network/no-record paths, stale result cancellation, manual corrections, double clicks, and both full application submission buttons.
- All quote/contact/COI/full-application POST requests were intercepted in QA. No real test emails or applications were sent. Outlook inbox delivery was not tested in this release.
- A separate, unmocked production GET for USDOT 95050 returned HAGAN MFG CO from the U.S. DOT Company Census File, status I. The inactive-record note and explicit confirmation worked. No application was submitted for this company.
- Production error-log query for this deployment returned no error logs in the 15-minute window checked. This is a point-in-time check, not ongoing monitoring or proof of inbox delivery.
- Local screenshot and browser reports: ignored `output/playwright/` directory.
- Local preview: http://localhost:3108/quote

## Owner Inputs Still Needed

- Correct GA4 Measurement ID (`G-...`). `NEXT_PUBLIC_GA_ID` was not configured at release time; live GA reporting is therefore not active. See `docs/lead-analytics.md`.
- Permissioned real reviews, a short owner video, and a documented client case. No substitute testimonials or unsupported results were published.
- Factual approval of the original article before publication, with an actual reviewer and review date only after review occurs.

No new paid service or recurring task was configured. Existing blog/social schedules, email provider configuration, and production secrets were unchanged.
