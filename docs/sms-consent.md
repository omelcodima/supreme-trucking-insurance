# Website SMS consent

Implemented for quick quote, full application (Customer mode only), and Instant
Indication. Consent is optional, unchecked, and separate from callback requests,
analytics, marketing calls and email. A dedicated SMS number avoids accidentally
using an agent's number or a number copied from a public DOT record. Editing that
number clears the checkbox. No SMS choice is restored from a saved application.

## Evidence

The server checks the affirmative boolean, current disclosure version and phone
format. The canonical wording is in `src/lib/smsConsentDisclosure.json`; the
application build injects the same text into the standalone form. Bump its version
whenever the disclosure changes. Preserve earlier versions in git.

Agency notification emails contain the canonical disclosure, submitted number,
source, reference and choice. Quick/full requests include server UTC receipt time
and also store the record in Airtable Notes when that channel is available. Full
application emails include it in the attached PDF. Instant Indication retains its
stable request ID and deterministic email body for Resend idempotency: keep the
original email with its provider-stamped Date/Received headers as receipt-time
evidence, not the visitor-device timestamp.

The generic lead webhook intentionally receives no SMS consent record. No phone,
consent choice, or disclosure is sent as an analytics event. Unchecked requests
discard the dedicated SMS number. A missing choice from older clients is not
consent. An unchecked later form is NOT a global unsubscribe or permission to
override a prior STOP.

This is a self-attested website opt-in record, not verified number ownership or
an immutable consent ledger. Mailbox/PDF copies should not be forwarded to
carriers as permission for their marketing. Apply an agency retention policy
and retain access-controlled originals; provider log retention alone is not a
long-term consent archive.

## Before sending any marketing SMS

- Confirm the office SMS provider, registered brand, sending number, campaign
  approval, and acceptable insurance use case. No SMS provider is connected here.
- Have the actual disclosure, privacy terms and campaign reviewed for applicable
  federal/state and provider requirements. A checkbox alone is not a compliance
  guarantee.
- Establish a durable consent/suppression ledger. Import evidence only after
  checking current STOP and other opt-out records. Do not enroll historical leads
  or people who just typed a phone number.
- Configure and test STOP, HELP, reasonable phone/email opt-outs, frequency and
  quiet-hour controls, reassigned-number checks as appropriate, and accurate
  sender identification. Process opt-outs before any further promotional sends.
- Keep service-message permission distinct from this insurance-marketing opt-in.
  Do not treat it as permission for unrelated services, calls or partner marketing.

Tests use synthetic numbers and isolated email/DOT providers. This change does
not send, schedule or activate marketing SMS, and does not alter existing
transactional or quote-follow-up email flows.
