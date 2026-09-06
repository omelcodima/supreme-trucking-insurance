# Site Quality and Email Verification

## Changes

- Full application notifications attach a server-generated PDF with all submitted summary text, page numbers, word wrapping, and Latin/Cyrillic support. The licensed Noto Sans font is bundled and traced into the server function. Both existing submission buttons use this endpoint.
- The agency inbox is excluded from customer follow-up scheduling for agent-submitted applications. Existing customer auto-replies remain enabled.
- Contact accepts the optional company field as displayed, preserves natural name entry, and shows inline errors without losing entered values.
- Contact, COI, and indication fields have associated labels and clearer status announcements.
- Indication progress remains 5.6 seconds minimum. Lookup text appears only during an actual DOT request; missing records explicitly use unverified one-truck assumptions. Fields lock while submitting; stale requests and timers are cleaned up.
- Corrected the broken phone link on Links and removed internal publishing/SEO instructions from public copy.
- Added page-specific canonical URLs for COI, Careers, and Privacy; COI has its own title and description. Removed nested main elements from legal pages without changing legal provisions.
- Long email and website addresses wrap on narrow screens, including Contact and legal pages.

## Local Verification

- Lint and production build pass; 87 unit tests pass.
- Browser audit: 21 routes at 320 and 1440 pixels (42 layouts), with no horizontal overflow, missing images, unlabeled fields, invalid phone links, or JavaScript errors.
- Metadata audit: all 122 sitemap URLs have the expected canonical URL, title, description, and single H1.
- Route audit: 122 sitemap URLs and 107 unique internal links passed HTTP/link checks.
- Full lead regression checks passed, including DOT failures/timeouts, cancellation, accepted-only analytics, both application buttons, duplicate-click protection, and six responsive widths.
- Browser regression form POST requests were mocked. This section does not establish real email delivery.
- A two-page sample PDF was rendered and visually inspected. Cyrillic/Romanian names, long fields, and final text were preserved without clipping.

## External Accounts

- Google Search Console accepted indexing requests for `/services` and `/blog/how-much-does-commercial-truck-insurance-cost`. This is queue acceptance, not a guarantee of indexing or rankings.
- The signed-in Analytics selector only exposed an unrelated old account. Approval was requested to create a separate Supreme account; no new GA4 account, resource, or terms acceptance has been performed.
- Resend Pro dashboard access is available. Real production test delivery and PDF attachment verification must be recorded after this release is deployed.
- No paid OpenSEO refresh, subscription, new automation, invented review, or video testimonial was created. Genuine permissioned review/video assets remain an owner input.

## Production Verification

Pending publication and exactly two labeled test submissions, one quick quote and one full application, to the agency mailbox. Do not infer inbox delivery from the website success screen alone.
