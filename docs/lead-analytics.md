# Lead Measurement

## Configuration

The site reads `NEXT_PUBLIC_GA_ID` at build time. GA4 was configured and published on September 6, 2026, following owner approval. The Vercel production value is `G-0WXYPCFK89`.

| Resource | Name / ID |
| --- | --- |
| Account | Supreme Trucking Insurance / `407065532` |
| Property | Supreme Trucking Insurance - Website / `553019966` |
| Web stream | Supreme Trucking Insurance Website / `15730880521` |
| Site | `https://supremetruckinginsurance.com` |
| Reporting timezone | America/Los_Angeles |

The Search Console domain property `supremetruckinginsurance.com` was linked to this web stream; Google's confirmation showed that the link was created. Search Console can compare queries and landing-page performance, but cannot identify the search query behind each individual lead.

Do not insert an arbitrary ID or reuse another project's property. Do not put private API keys in `NEXT_PUBLIC_` variables.

## Events

| Event | When it fires | `form_id` |
| --- | --- | --- |
| `lead_form_start` | First input/change in a mounted form | `quick_quote`, `full_application`, `contact`, `coi_request`, `instant_indication` |
| `lead_form_attempt` | Client begins a validated submission request | Same |
| `lead_form_error` | Request fails or response does not explicitly accept it | Same |
| `generate_lead` | Quote API responds with HTTP success AND JSON `ok: true` | `quick_quote`, `full_application` |
| `contact_request_received` | Contact API explicitly accepts the request | `contact` |
| `coi_request_received` | COI API explicitly accepts the request | `coi_request` |
| `indication_request_received` | Indication API returns HTTP success, `ok: true`, and `notification: accepted` | `instant_indication` |

Instant Indication is a separate, lower-intent request. It never emits `generate_lead` and does not count as a completed quote application. Its operational email is sent only after the visitor presses the submit button; GA start events are consent-gated, contain no field contents, and do not trigger email.

Only `form_id` and `submission_result` accompany form events. No contact names, email addresses, telephone numbers, DOT numbers, VINs, or free-text answers are sent in these events. Link events contain a destination path or generic `phone`/`email` label, not raw mail or telephone addresses.

Acceptance is not a carrier quote, bound policy, or confirmed delivery to an Outlook inbox. The backend may accept a request through its storage/email fallback. Email delivery should be monitored separately through the existing provider delivery records.

## Google Admin Settings

- Enhanced Measurement is off to prevent automatic form interactions, duplicate history events, or uncontrolled URL parameters.
- `generate_lead` is a key event, counted once per event, without an invented monetary value. Submission attempts are not key events.
- **Form type** is an event-scoped custom dimension for `form_id`.
- **Supreme QA Debug Traffic** is an active Developer Traffic exclusion filter. The pre-existing Internal Traffic filter remains in Testing; no office IP was assumed.
- Optional account data-sharing settings are off. Unrelated Analytics and Search Console properties were not modified.

## Consent and Privacy

The Google script is not loaded until a visitor explicitly allows Google Analytics. Decline and allow are saved; the footer's **Analytics preferences** button allows changing the decision. Revocation stops subsequent collection and removes the site's GA cookies. Cross-tab changes and removal of the stored choice also revoke consent. Global Privacy Control and Do Not Track override a stored grant.

Only origin + pathname are used as the page location; query strings and fragments are removed. Referrers are reduced to a web origin. Ads personalization and Google signals are disabled. The analytics page-view handler sends one event per pathname, not every query-string change.

The privacy policy describes this Google Analytics behavior. This is not a legal compliance certification or a universal control for every unrelated third-party feature. Withheld consent, ad blockers, and failed scripts mean GA will not count every actual submission. Keep provider and application records as the operational source of truth.

## Verification

Local browser QA intercepts all submission endpoints and spies on `gtag` without contacting Google or sending test emails. It checks error/success separation, duplicate prevention, no-DOT fallback, lookup cancellation, iframe message origin/source, and payload privacy.

Publication checks passed 95 unit tests, lint, and the production build. Desktop/mobile browser tests at 320, 390, 768, 1440, and 1920 pixels covered initial refusal, grant, saved denial, revocation, cookie clearing, GPC/DNT, blocked storage, cross-tab revocation, and clean SPA page locations.

A separate production browser test loaded the real Google tag with `debug_mode: true`. Google's collector returned HTTP 204 for five requests containing page views and start/attempt/accepted events for both quote forms. Both quote POST endpoints were intercepted with explicit test responses; this analytics test did not send emails or create real leads. Query/fragment sentinels and test contact values were absent from collector payloads. This verifies collector acceptance, not a guarantee that every report is populated immediately.

Artifacts (local, gitignored): `output/playwright/ga4-local-report.json`, `ga4-production-report.json`, `ga4-live-report.json`, and their screenshots. Do not rerun email delivery tests just to check analytics.

The full application fetch wrapper reports only `/api/full-application` POSTs. Its response is cloned for measurement so the application still receives the original response body. Both submission buttons share the same application handler and deduplication behavior.
