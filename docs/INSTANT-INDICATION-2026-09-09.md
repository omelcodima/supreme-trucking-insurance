# Instant Indication Update

## Submission Contract

- `/instant-indication` posts to `/api/instant-indication` only when the visitor presses the calculation button. Typing, blur and abandonment before submission do not email form values.
- The agency notification goes through the existing `sendInternalLeadNotification` and Resend configuration. Recipient: `LEAD_NOTIFICATION_EMAIL`, defaulting to `info@supremetruckinginsurance.com`. No new subscription or API key is needed.
- Contact fields are optional and conditional on an unchecked follow-up checkbox. A name plus phone or email is required when selected. Unchecking deletes contacts in both client state and server validation.
- The email contains entered DOT, public company match, cargo/radius, the illustrative estimate, visitor-provided contacts if requested, submission reference/time, notice version and coarse device/browser/OS. No raw user-agent, IP, public DOT phone or fingerprint is included. A DOT record is not proof of visitor identity or permission to call.
- The indication handler does not invoke customer auto-replies, SMS enrollment, scheduled follow-ups or marketing APIs. It is not a full application.
- Success requires a successful Resend response containing an email ID. Provider acceptance is not proof of Outlook inbox placement. Existing Resend delivery records remain the delivery source of truth.

## Reliability and Privacy

- Same-origin JSON POST, bounded payload, honeypot, strict inputs, fixed DOT API origin, sanitized failures and server-only provider credentials.
- Best-effort, process-local rate limit: eight attempts per ten minutes, bounded map. Addresses are HMAC-hashed with an ephemeral process key. This is not a distributed quota or a substitute for a platform firewall if abuse increases.
- Browser duplicate lock plus [Resend idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys). Identical retries reuse the submission reference and key; provider deduplication lasts 24 hours. If live DOT metadata changes between attempts, the provider can reject a changed payload for the same key; the UI reports failure rather than claiming success or silently sending another message.
- A small `keepalive` request can finish after navigation. No guarantee is possible when the device loses connection or the browser terminates before transmitting the request. Nothing is secretly captured before submission.
- A notification failure returns the available estimate with an explicit retry message. There is no new durable lead database or background retry queue in this change.
- Generic, consent-gated analytics events contain no form values. Indications emit `indication_request_received`, not the completed-quote event `generate_lead`.

## Visual Experience

- Responsive operation form, optional follow-up fields and result panel in the existing site design.
- At least 5.6 seconds of preparation feedback, a moving truck and indeterminate progress; system reduced-motion preference disables movement.
- Only a real public DOT census lookup is claimed. No animated carrier approval, invented matching results or fake live insurance prices.
- Annual and monthly-equivalent display. Monthly is annual divided by twelve, not a premium installment offer. Fleet totals appear only when a positive reported unit count is available.

## Pricing Calibration Still Required

The existing $7,200 base and cargo/radius/state/fleet adjustments are retained as an explicitly **uncalibrated illustrative model**, not represented as new accurate market rates. The previous inference that a recent DOT registration proves new operating authority was removed. Unknown fleet size no longer becomes a fabricated one-truck fleet.

The owner was asked for approved annual per-truck ranges for established and new-authority risks, with included coverage and limits. No response was available at implementation time. Before replacing the formula, obtain those ranges plus state/vehicle/driver/loss assumptions and a refresh date.

For context only, [Progressive's published cost page](https://www.progressivecommercial.com/commercial-auto-insurance/truck-insurance/commercial-truck-insurance-cost/) reports a 2025 for-hire transport average of $926/month per power unit. Its footnote describes new policies without violations, including liability and physical damage. This is not a Supreme quote, a complete coverage package, or a rate table to extrapolate across states. Checked September 9, 2026; no external average was inserted into the calculation.

## Verification

- Unit tests cover strict input validation, optional contacts, stripping withdrawn contacts, unknown fleet totals, estimate bounds, email labeling, DOT failures and rate-limit expiry.
- Provider-mocked API tests verify recipient, coarse device information, origin checks, payload size, honeypot, provider failure, retry and duplicate suppression.
- Browser checks at 320, 390, 768, 1440 and 1920 pixels verify assets, layout, loading duration, reduced motion, double submission, retained input on failure, false-success rejection, analytics privacy and processing after navigation.
- Local QA scripts/reports/screenshots are under gitignored `output/playwright/indication-*` and `verify-indication-*`. The isolated QA provider never sends customer email.
