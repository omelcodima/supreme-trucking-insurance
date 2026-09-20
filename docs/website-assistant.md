# Website assistant

The public site has a manually opened Ask Supreme dialog. It does not appear on
the private owner dashboard. Instant Indication remains available inside the
dialog and in site navigation. The mobile quote/call bar is preserved.

## AI questions

- Visitor must agree to AI processing before a question is sent.
- POST `/api/assistant` calls the existing Vercel AI Gateway using the server-only
  `AI_GATEWAY_API_KEY`, model `openai/gpt-4.1-mini`. Verified with the current
  account on September 20, 2026. The previous GPT-5.4 mini request was rejected
  because it required purchased Gateway credits; no billing settings were changed.
- Requires same-origin JSON, bounded alternating user/assistant messages, the
  existing owner database and `OWNER_AUTH_SECRET`. No new database migration.
- `WEBSITE_CHAT_ENABLED=false` disables model calls without disabling forms.
- Persistent limits in `sti_intake_limits`, under a separate `chat:` namespace:
  100 attempts/day, 40/15 minutes globally, 12/15 minutes per hashed client IP.
  Attempts include provider failures. This is a call limit, not a dollar guarantee.
- Maximum 1,400 output tokens and a 20-second provider timeout. The browser
  sends at most four prior exchanges, dropping whole oldest turns to stay within
  8,000 characters. No model tools, browsing, CRM or email access.
- Common email/phone/VIN/SSN patterns are removed before model transmission.
  This is best-effort, not guaranteed anonymization. The UI requests that visitors
  not include personal identifiers or sensitive documents.
- Conversations exist only in browser component memory, not local storage,
  analytics or the owner database. Provider handling/retention can differ; see
  the published privacy disclosure. Clear chat resets the conversation and consent.
- Answers are displayed as text, never model-generated HTML. Navigation targets
  come from a fixed local allowlist. Answers are informational, not a quote,
  coverage determination or assurance of eligibility.
- Quote guidance asks one missing operational question at a time (business state,
  power units, cargo) and invites the full application when ready. The latest quote
  answer has direct Full application and Request a call actions. Chat is optional;
  neither answering a question nor opening the application submits a lead.

## Confirmed contact requests

Start a quote and Request a call use a separate form, not the AI conversation.
DOT lookup proposes public company details and requires confirmation. It does
not establish identity or grant access to existing customer records.

The form requires contact confirmation and submits to `/api/quote`, including
`entryPoint=website_assistant` and `contactMode`. The existing server recipient
defaults to `info@supremetruckinginsurance.com`. The owner dashboard and intake
email receive the request. Intake email includes a readable PDF, not JSON.
Success requires email-provider acceptance;
that is not proof of inbox delivery or Grakbot processing.

No marketing SMS permission is inferred. Callback requests receive a transactional
receipt but do not enter the quote follow-up sequence. Quote requests retain the
existing quote receipt/follow-up behavior. Neither sends the AI conversation.

## Still separate

Grakbot mailbox processing, RenewRig writes, private document upload and customer
continuation invitations require their own verified integration. The assistant
must never claim these actions have happened. See `grakbot-email-handoff.md`.

## Verification

`websiteAssistant.test.ts` covers validation, redaction, model request boundaries,
response validation and budget key separation. `leadHandoffRoutes.test.ts` runs
the actual route handlers with model, email and persistence mocked, including
consent gates, rate-limit gates and callbacks without quote follow-up sequences.
Browser checks must cover desktop/mobile, consent, clear/close, DOT confirmation,
error retention and exactly one explicit contact submission. Production model
smoke tests must use non-personal questions, not submit synthetic customer leads.
