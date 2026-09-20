# Employee assessment

Employee entry: `/team-assessment`. Owner results: `/admin/assessments`, using the existing exact-email owner sign-in. The owner dashboard includes an Employee assessments link. The sign-in page accepts only the fixed `next=assessments` destination.

The assessment preserves version `3.4-everyday-20`: 18 situations (six per trait) and two written examples, with English, Russian and Spanish. Scoring is deterministic and matches the local Python assessment. Written examples are reviewed by a person and do not change scores. Clarification flags carry no score penalty and do not establish dishonesty. The pilot scores describe selected answers, not a validated measure of personality or readiness for promotion.

## Storage and access

The dedicated **private** Vercel Blob store `supreme-employee-assessments` is linked to this project in Production. `BLOB_READ_WRITE_TOKEN` is server-only. It holds immutable localized question-bank bundles and separate session JSON files under `employee-assessment/`. The public source repository does not contain the scoring key or employee records.

Install the bank once using `scripts/seed-assessment-bank.mts` with a private local bundle path. Never add that input file to Git, public assets or deployment source. The current input originates from the local assistant-hiring-interview app; no prior local responses are imported.

Each participant has a random HTTP-only, same-site cookie; production cookies require HTTPS. Only the token hash is stored. Participant access expires after seven days; saved records remain available to the owner. There is no automated employee-record deletion. A participant on a shared computer should use a separate browser profile; a new session replaces that browser's participant cookie.

Updates read uncached storage and use ETag conditional writes with retries, preventing concurrent answers or owner notes from silently overwriting one another. A transient conflict asks the participant to reload and retry. Completed answers are locked. The owner can add notes and export JSON/Markdown or print a report.

Owner data endpoints check the existing owner allowlist on every request and add access records to the existing audit log. New-attempt limits use a separate `assessment:` namespace in the existing `sti_intake_limits` table. The runtime's existing database grants are sufficient; no production database schema, credentials or billing plan were changed.

All assessment pages and endpoints are no-store/noindex, deny framing and omit the public advertising/analytics layout. Assessment HTML is served through route handlers. Only the illustrations and UI translation script are public assets. The ordinary share link is available to anyone receiving it; it is not an identity verification system or an employee directory.

## Verification

- `npm test`, `npm run build`, targeted ESLint.
- Private parity check: 150 result profiles match the original Python evaluation across all three languages.
- Disposable integration checks cover storage, owner authentication, cross-site rejection, token isolation, concurrent writes, question locking, written answers, results and private-file access.
- No actual employee answers or personal data are needed for verification. Synthetic cloud records must be removed by their exact test IDs after checking; never bulk-delete the store.
