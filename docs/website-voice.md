# Website voice assistant

The existing website assistant has an optional **Talk to AI** tab. It connects to
the user-supplied xAI agent `agent_px8EI79XcPVV2ial` using a short-lived client
secret. The main API key never reaches the browser. No `ws` dependency or
long-running WebSocket server is needed on Vercel.

## Activation

- Configure server-only `XAI_API_KEY` in the Supreme Vercel project.
- Existing `OWNER_AUTH_SECRET`, `OWNER_DATABASE_URL` and lead email credentials
  must remain configured. The existing `sti_intake_limits` table is reused.
- Set `WEBSITE_VOICE_ENABLED=true` and redeploy only after the xAI account has
  voice access and available credits. Otherwise the tab stays hidden and token
  requests fail closed. Use a local environment for pre-activation testing.
- Set an appropriate budget in the xAI account. Token issuance is limited to
  3 per client and 10 overall per 15 minutes, and 40 overall per UTC day. The
  five-minute browser timer is a UX limit, **not a tamper-proof billing cap**.
  Ephemeral credentials can still be copied by their recipient. Expiry limits
  authentication time, not necessarily an already-established call's duration.
- Confirm the agent's configured voice is preserved and its website-specific
  instruction/tool update is accepted before opening the feature publicly.
  The supplied `agent_id` URL is retained; no fallback silently substitutes a
  different agent. Official public WebSocket docs do not currently describe
  this saved-agent query parameter, so live validation is required.

## Privacy and lead flow

Start talking is an explicit, disclosed AI-audio action, separate from analytics
consent. Opening the assistant already stops Clarity. Audio goes directly to
xAI; the website does not save recordings/full transcripts. No calls, customer
emails or marketing SMS are triggered by a model tool.

The only tool, `prepare_callback_request`, validates a local draft and ends the
voice connection. A visitor reviews/edits it and chooses **Send request**. Only
name plus phone OR email is required. The signed session ticket expires after
one hour. The confirmed summary is saved to the owner inbox as `quick_quote`
with `entryPoint=website_voice`, then delivered through the existing email/PDF
handoff. This does not assert that RenewRig has created a record. Identical
retries use the existing durable deduplication and email idempotency mechanism.

Closing, changing tabs, leaving the page, hiding the browser tab, microphone
loss, network failure or the duration limit stops tracks/audio/socket. Voice
data is not written to browser storage. Provider retention is governed by xAI's
terms; do not promise zero retention by xAI.

## Verification

Run `npm test`, `npx tsc --noEmit`, `npm run lint`, `npm run build`.
Use mock provider/microphone tests without sending real lead notifications.
Before activation, make one short authorized call with synthetic details:
check mic permission, configured voice, bidirectional audio, interruption,
mute, draft preparation, and cancellation. Check phone-only/email-only
confirmation separately against mocked persistence/email edges.

Official references:
- https://docs.x.ai/developers/model-capabilities/audio/speech-to-speech
- https://docs.x.ai/developers/rest-api-reference/inference/voice

Setup check on 2026-10-15: xAI client-secret creation returned HTTP 403 stating
the account had exhausted credits or reached its monthly spending limit.
Live audio and saved-agent compatibility have not yet been verified. Keep
`WEBSITE_VOICE_ENABLED` disabled until that check succeeds. No billing changes
were made. Rotate the credential shared during setup and update the server secret.
