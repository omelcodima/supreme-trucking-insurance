# Private owner workspace

## Current delivery status

Published at `https://supremetruckinginsurance.com/admin`; the Traffic extension
was deployed from commit `c9218bbf8390dc132f96e6dcd3c9568c764fdfca` on September 10,
2026 (Pacific time). Vercel deployment `dpl_Dr7Mm482t4NUrRsuSYg66f7SSXRN` reached
READY and was verified as the production-domain deployment. `OWNER_EMAILS`,
`OWNER_DATABASE_URL`, `OWNER_AUTH_SECRET` and `OWNER_AUTH_URL` are saved as sensitive
Vercel Production settings. The approved owner address is not stored in source code.

The Neon resource `supreme-owner-dashboard` is Available in the Supreme Vercel team
(resource `store_7V7MCOMKM8vSgEFM`, Neon project
`summer-haze-90973961`). The CLI checkout was opened with `free_v3`, but the
subsequent Vercel resource page displays **Launch**. The owner subsequently
approved retaining Launch ("It's okay."). Do not change installation billing.
No paid subscription was purchased by the agent. Neon Auth was also enabled in
the completed setup; it is not used by the prepared dashboard.

The database is `supreme_owner`, separate from the integration's original `neondb`
and its unused `neon_auth` schema. The restricted runtime role is `sti_owner_app`.
Migrations and grants are applied. TLS certificate verification was checked on the
actual Node connection; schema/database creation, temporary objects, privileged
roles and evidence/audit mutation are denied. A synthetic cloud request/evidence
transaction was verified and rolled back, leaving no test lead. The durable intake
guard was also exercised against Neon.

The default integration-to-project link was disconnected because it injected
administrator credentials into the application runtime. Only the restricted
`OWNER_DATABASE_URL` is deployed manually; the Neon resource and approved plan
remain intact. Do not reconnect the default link or deploy migration credentials.
Private `.env.owner-neon.local` and `.env.owner-runtime.local` hold local provisioning
settings, are gitignored and mode 0600. The migration URL stays local. No secret
values belong in source control or chat.

GA reporting Viewer access and the server credential are configured. The Data API
is enabled and live aggregate reports were verified on September 10, 2026.
The reporting extension is deployed. The final authenticated production Traffic
screen check awaits a fresh owner sign-in code because the old session expired.
The existing consent-gated GA4 website tag does not itself
confer reporting access. Airtable and email notifications remain separate;
their recipient is unchanged. Automated SMS sending and provider STOP sync are not
enabled. Independent backups, restore testing and retention procedures remain
operational follow-up work, not a completed legal archive.

The dashboard is `/admin`, with email-code sign-in at `/admin/login`. It uses
Pages Router pages deliberately: the public App Router layout contains advertising
and analytics scripts that must never wrap private records. The public website's
design/navigation is unchanged. Every data request authenticates the session and
rechecks the exact owner-email allowlist. Admin pages and APIs are private/no-store,
noindex, non-frameable and restrict browser requests to the same origin.

## What is included

- Requests from quick quote, full application and Instant Indication, with search,
  source/status/date filters and pagination. Date filters cover a rolling 7/28/90
  days. Export is explicitly the current page, up to 50 rows; CSV cells are escaped
  against spreadsheet formula injection. Older records are not silently imported.
- A separate SMS number and exact disclosure snapshot for each submitted choice.
  Server receipt time, source, reference, submission reference, disclosure version,
  method and a stable SHA-256 digest are retained. Evidence downloads include the
  request and relevant opt-outs. Identity/number ownership remains self-attested.
- Append-only agency-recorded SMS/call opt-outs and an owner access/export log.
  Website opt-ins and unchecked forms cannot remove a suppression. There is no
  manual "mark consent yes" button, bulk campaign enrollment or sending endpoint.
- GA4 adapter for property `553019966`: users, sessions, views, key events, landing
  pages, approximate country/state, devices and click/form event counts. It reads
  aggregate reports only. Query strings/fragments are removed from displayed
  labels. Missing/failed reporting access is an explicit state, not fabricated zero
  traffic. Top 25 rows per report, complete days through yesterday in property
  timezone. Counts are events, not a person-level attribution or abandonment model.

Contact/COI forms, provider delivery status, provider STOP synchronization, call
marketing consent, OTP verification of lead phones, and historical evidence import
are **not** part of this initial workspace. The list is not a list of all visitors.

## Production setup

1. Create a **dedicated** PostgreSQL database (Neon is supported) under the owner's
   account. Choose/approve the plan and backup/retention settings before enabling
   storage. Do not reuse a different project's database or its credentials.
2. Create a separate migration owner and restricted login role for the application.
   Use TLS with certificate verification, for example `sslmode=verify-full` for
   a Neon connection. Use the pooler URL for runtime if appropriate. Do not expose
   the migration credential to Vercel functions.
3. Supply the variables below through secure environment settings, not chat or
   source code. Run the versioned migration against the dedicated database using
   `npm run owner:migrate`, with environment variables loaded in that process.
   The migration generates the installed Better Auth schema and applies the
   `db/owner-dashboard.sql` schema plus least-privilege table grants. Review the
   migration before running it on an existing installation.
4. Verify that the runtime role cannot create/alter/drop objects, inherit an owner
   role, update/delete/truncate evidence or truncate audit tables. Do not grant
   CREATE on the database or public schema. The writer also refuses roles with
   evidence modification privileges, superuser or role-creation powers.
5. Confirm a personal owner email, test sign-in, capture, export, suppression,
   backups and restore using a staging database, then deploy. Do not enable the
   store until migration and access tests have passed.
   The three public intake routes share atomic PostgreSQL limits of 30 requests per
   client and 300 total per 15-minute bucket. Vercel's `x-real-ip` is HMAC-hashed with
   a rotating time bucket; raw IPs are not added to the lead ledger. Expired counters
   are removed. Request bodies are byte-bounded. These application limits do not
   replace an edge WAF or cap function invocation charges. No custom Vercel firewall
   rule was published; edge-level bot controls are a separate hardening step. Auth
   OTP throttling is separate from public intake limits.
6. For reporting, enable the Google Analytics Data API in an owner-controlled
   Google Cloud project, create a service account and give it Viewer access to
   **only** GA4 property `553019966`. Store its JSON credential server-side. The
   website's measurement ID does not confer reporting access. Key rotation and
   API-access review remain operational responsibilities.

### Traffic reporting extension (2026-09-10)

Traffic includes daily sessions (with an accessible daily-data table), traffic
channels, landing pages, countries/states, devices and selected click/form events
for 7, 28 or 90 complete days. Dates use the GA4 property timezone and exclude today.
Breakdowns are capped at 25 rows; the daily series includes every day in the period.
Privacy thresholds and reporting limits remain visible. GA4 processing delays and
analytics-consent coverage mean these are not complete counts of all site visitors.

The adapter uses only standard dimensions, so an unregistered `form_id` custom
dimension cannot break the batch. Seven reports are split into batches of five and
two. Credentials stay server-only and the OAuth scope is `analytics.readonly`.
Unavailable/incomplete reports are not displayed as successful zero-traffic reports.

Connection preparation: an unbilled Google Cloud project named
`Supreme Website Reports` (`named-foundry-508203-j7`, project number `41100975146`)
was created in the owner's account. With the owner's approval, service account
`supreme-ga-reporter@named-foundry-508203-j7.iam.gserviceaccount.com` received Viewer
access to property `553019966` only, with cost and revenue metrics restricted.
No Cloud IAM role, Gmail access or account-wide Analytics access was granted.
Its JSON credential is saved as sensitive `GA_REPORTING_CREDENTIALS` in Vercel
Production. The local copy is mode 0600 inside gitignored `output/private/` (0700);
never commit it or expose it in browser code, logs or chat. Existing Google and
email credentials were not changed.

The owner approved continuing after the Google APIs Terms of Service prompt.
On September 10, 2026, the Google Cloud console showed the Data API as Enabled.
The actual server adapter successfully returned connected reports for 7, 28 and
90 complete days, with the expected daily-series lengths and property timezone
`America/Los_Angeles`. These were read-only requests and did not create analytics
events, leads or messages. Vercel metadata confirms that the credential is
sensitive and Production-only. The subsequent deployment reached READY with the
new environment configuration. The actual adapter was verified directly against
Google; authenticated production Traffic verification is still pending a fresh
owner sign-in code and must not be reported as completed.

After incorporating the existing 48-state service-area update without changing
it, local verification passed: 138 unit tests, lint, TypeScript and production build.
The authenticated synthetic-data browser check covered the daily chart/table,
channels, 7/28/90-day filters and unavailable state at 320/390/768/1440px, with
no external trackers or real messages. Live GA4 verification subsequently passed
as described above. Post-deployment checks confirmed no-store/noindex private
pages, an unauthenticated `/api/admin` response of 401 and cross-origin rejection
of 403. The deployment-scoped error-log scan returned zero error records. These
checks created no leads or messages. One sign-in code was separately requested
through the normal owner login UI for final authenticated verification.

| Variable | Purpose |
| --- | --- |
| `OWNER_DATABASE_URL` | Restricted PostgreSQL runtime connection; activates capture |
| `OWNER_MIGRATION_DATABASE_URL` | Local migration only, never runtime deployment |
| `OWNER_EMAILS` | Exact approved owner emails, comma-separated; no domain wildcard |
| `OWNER_AUTH_SECRET` | Random secret, at least 32 characters |
| `OWNER_AUTH_URL` | Canonical HTTPS origin, e.g. `https://supremetruckinginsurance.com` |
| `RESEND_API_KEY`, `EMAIL_FROM` | Existing sender for owner login codes |
| `GA_REPORTING_CREDENTIALS` | Server-only Google service-account JSON with Viewer access |

Better Auth handles OTP generation, hashed verification records, five-minute
expiry, attempt limits, database-backed throttling and HTTP-only sessions. Sessions
expire after one hour. Production cookies are Secure. Each owner must secure their
mailbox with MFA; an email code alone is not an independent second authentication
factor. Only sign-in/OTP/sign-out routes are exposed, not account-management APIs.

## Capture and failure behavior

Without `OWNER_DATABASE_URL`, capture is intentionally inactive and the existing
email/Airtable flow is unchanged. With it configured, each validated submission
atomically inserts a minimal lead and its consent event **before** the existing
notification workflow. A database failure rolls back both and fails the request;
it does not silently accept an unrecorded opt-in. Instant Indication still displays
its estimate with an explicit request-not-sent error when notification fails.

Retries with the same client submission reference and normalized captured fields reuse the
ledger entry and its server time. A changed submission creates a new entry. This
deduplicates the ledger, not the existing quick/full notification workflows;
their email retries may still produce more than one email. Legacy clients without
a submission ID are not guaranteed retry deduplication. Indication notification
retains its existing provider idempotency key and stable email body; its ledger
also keeps that request reference. Database request capture is not proof that
Outlook received a notification. Keep the original provider/email/PDF archive.

The dashboard stores minimal contact/request details, not full driver/license,
VIN, financial or claims schedules. Full applications remain in the existing
agency email/PDF archive. Anonymous browsing is not joined to contact records,
draft keystrokes are not captured, and no IP fingerprint is added to the ledger.

## Evidence and marketing limits

Database permissions and triggers block ordinary application edits. The digest
detects a changed record but is not a digital signature, independent timestamp,
WORM archive or protection against a privileged database administrator. Establish
encrypted independent backups, restore tests, privileged-access auditing, retention
and legal-hold procedures before relying on the archive. The UI has no deletion
path. Handle validated privacy requests, corrections and expiry through an approved
retention procedure; do not destroy records subject to a hold or merely erase an
opt-out. Retention duration must be selected with agency/legal requirements, not
assumed to be the email provider's log window.

Recorded SMS consent does not authorize marketing calls, another company, an
unrelated service, or every later message. Verify the office provider, approved
brand/campaign, sender, current suppressions, reasonable revocation requests,
number ownership/reassignment controls and applicable federal/state rules before
any campaign. Provider STOP/HELP/webhooks are not connected, so an empty local
opt-out list is not evidence of no opt-outs. Nothing here promises immunity from
a complaint or lawsuit. Have the actual disclosures and workflow reviewed.

Primary references:
- https://www.twilio.com/en-us/legal/messaging-policy (provider guidance; Twilio is not assumed to be the office provider)
- https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart
- https://better-auth.com/docs/plugins/email-otp
- https://better-auth.com/docs/concepts/rate-limit

## Verification

Release checks passed: 126 unit tests, lint, production build, dependency audit
(zero reported production vulnerabilities), local PostgreSQL and browser end-to-end
checks, concurrent rate limits, and cloud rollback-only capture. Desktop/mobile
private pages at 320/390/768/1440px were exercised locally. Live-domain checks
confirmed configured sign-in, unauthenticated/cross-origin denial, no-store/noindex
headers, no third-party tracking requests on login, mobile layout, and rejection of
invalid/oversize public submissions. No production test leads were retained and no
customer messages were sent by these tests. Successful production owner sign-in
requires the owner's real email code; local OTP sign-in/logout was fully exercised
with mocked email. These checks do not establish Outlook delivery or live Google
reporting access.

`npm test`, `npm run lint`, `npm run build`. `scripts/verify-owner-store.mts`
requires an isolated localhost PostgreSQL database with `qa` in its name and refuses
remote hosts. Browser/API checks under gitignored `output/playwright/` exercise real
local PostgreSQL and the real auth library while mocking all email/DOT providers.
No test customer receives messages and no real marketing campaign is enabled.
