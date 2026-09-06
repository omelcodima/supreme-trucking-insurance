# Lead Measurement

## Configuration

The site reads `NEXT_PUBLIC_GA_ID` at build time. This variable was absent from both local configuration and Vercel production on September 6, 2026. Code instrumentation is ready, but live GA reporting is not connected until the owner supplies the site's GA4 web stream Measurement ID and a new build is deployed.

Do not insert an arbitrary ID or reuse another project's property. Do not put private API keys in `NEXT_PUBLIC_` variables.

## Events

| Event | When it fires | `form_id` |
| --- | --- | --- |
| `lead_form_start` | First input/change in a mounted form | `quick_quote`, `full_application`, `contact`, `coi_request` |
| `lead_form_attempt` | Client begins a validated submission request | Same |
| `lead_form_error` | Request fails or response does not explicitly accept it | Same |
| `generate_lead` | Quote API responds with HTTP success AND JSON `ok: true` | `quick_quote`, `full_application` |
| `contact_request_received` | Contact API explicitly accepts the request | `contact` |
| `coi_request_received` | COI API explicitly accepts the request | `coi_request` |

Only `form_id` and `submission_result` accompany form events. No contact names, email addresses, telephone numbers, DOT numbers, VINs, or free-text answers are sent in these events. Link events contain a destination path or generic `phone`/`email` label, not raw mail or telephone addresses.

Acceptance is not a carrier quote, bound policy, or confirmed delivery to an Outlook inbox. The backend may accept a request through its storage/email fallback. Email delivery should be monitored separately through the existing provider delivery records.

## GA4 Setup After the Owner Supplies the ID

1. Set `NEXT_PUBLIC_GA_ID` for the correct Vercel production project and redeploy.
2. Confirm the expected property and web stream receive events in DebugView using test traffic excluded from reporting.
3. Register `form_id` as an event-scoped custom dimension. Mark `generate_lead` as a key event; do not mark `lead_form_attempt` as a key event.
4. Compare quick and full quote funnels: start, attempt, accepted. Keep COI requests separate from sales leads.
5. Do not use GA Enhanced Measurement `form_submit` as a successful lead signal. It can count attempts, not backend acceptance. If enabling built-in form interactions, keep those events separate from this funnel.
6. Review the site's privacy disclosure and consent configuration before enabling new tracking. Blocked scripts, ad blockers, and withheld consent mean analytics will not represent every submitted request.

## Verification

Local browser QA intercepts all submission endpoints and spies on `gtag` without contacting Google or sending test emails. It checks error/success separation, duplicate prevention, no-DOT fallback, lookup cancellation, iframe message origin/source, and payload privacy.

The full application fetch wrapper reports only `/api/full-application` POSTs. Its response is cloned for measurement so the application still receives the original response body. Both submission buttons share the same application handler and deduplication behavior.
