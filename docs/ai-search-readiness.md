# AI search readiness

Implementation and checks: September 20, 2026.

## Published content in this change

- `/about`: states that Supreme Trucking Insurance is the brand of Supreme Insurance Agency LLC, distinguishes agency from insurer, and displays the confirmed public office, appointment-only visits, hours, languages, and service-area caveat.
- The existing InsuranceAgency entity uses the same shared facts and the approved square Supreme logo. No tax identifiers, private document address, invented license numbers, reviews, or ratings were added.
- `/quote-checklist`: a single preparation guide with business, driver, equipment, freight, coverage, loss-run, and conditional IFTA requirements. It is linked from About, coverage guides, the quote page, the footer, and the sitemap.
- `/new-venture`: explains the sequence from submission to dispatch, including the distinction between a number, a policy, filings, and active authority. Links to FMCSA are included.
- `/cargo`: adds quote comparison, trailer-versus-freight distinctions, and questions about stops and transfers without promising coverage.

## Crawler access

- Existing `robots.txt` permits public crawling and keeps admin paths disallowed. No changes to training-bot permissions were needed or made.
- Cloudflare DNS: apex is DNS-only, pointing to Vercel; `www` is proxied. Cloudflare AI Crawl Control showed Block Crawler off for OAI-SearchBot, ChatGPT-User, Claude-SearchBot, and Claude-User. No security rules were changed.
- Vercel custom domains are excluded from deployment login protection. The active custom firewall configuration endpoint returned Config not found; this is not proof that platform-level protection never challenges a request.
- Requests with crawler user-agent names are smoke tests only. They do not originate from verified provider IPs and cannot prove a real crawler visit or index inclusion.

## Measurement

The private owner dashboard's Traffic section adds ChatGPT and Claude referral sessions using GA4's standard `sessionSource` dimension and `sessions` metric. The source filter is applied by Google before the row limit, so these visits are not hidden merely because larger traffic sources fill the first 25 rows. It shares the existing date selection, timezone handling, authentication, and privacy behavior.

Included sources: chatgpt.com, chat.openai.com, claude.ai, and their subdomains. No form answers, prompt text, customer identities, or new browser identifiers are collected. This report does not count AI mentions or recommendations. Consent refusal, missing referrers, in-app browsers, copied URLs, reporting limits, and attribution behavior can undercount or obscure visits.

Local tests cover empty data, failures, source matching, dates, and malformed metrics. Production Google credentials are sensitive and not exportable through the CLI; a live authenticated dashboard check is needed to verify returned counts. An unavailable report must never be presented as zero visits.

## Boundaries and follow-up

- No paid placements, subscriptions, fabricated rankings, or mass-produced state pages.
- Apple and Yelp moderation and Bing postal verification remain separate workflows. Add their public profile URLs only after confirming the correct public listing is reachable.
- Genuine reviews and useful independent industry mentions remain ongoing work, not guaranteed ranking signals or something this deployment can manufacture.
- Compare the same reporting period before and after changes. Check citations using a small consistent set of relevant questions; do not label a one-off answer as a market-wide visibility score.
- No guarantee of crawling, indexing, citations, training inclusion, or recommendations by ChatGPT or Claude.

## Primary references

- [OpenAI crawler roles and controls](https://developers.openai.com/api/docs/bots)
- [Anthropic crawler roles and controls](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
- [Google: AI features and website eligibility](https://developers.google.com/search/docs/appearance/ai-features)
- [GA4 reporting dimensions and metrics](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema)
- [FMCSA insurance filing requirements](https://www.fmcsa.dot.gov/registration/insurance-filing-requirements)
- [FMCSA operating authority](https://www.fmcsa.dot.gov/registration/get-mc-number-authority-operate)
