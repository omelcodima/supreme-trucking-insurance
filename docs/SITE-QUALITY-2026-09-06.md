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
- The delivered test exposed legacy defaults in the full application. New/reset forms no longer assume Ohio, an eight-state operation, or nationwide radius. Empty editable rows are excluded from submitted/reviewed/printed drivers, equipment and claim history; missing claim history is explicitly unknown, not claim-free. Existing saved client choices are preserved. Equipment ACV is included in the emailed summary/PDF.

## Local Verification

- Lint and production build pass; 90 unit tests pass, including empty-row exclusion, partial records, zero-loss prior policies, preservation of saved choices, and explicit reset.
- Browser audit: 21 routes at 320 and 1440 pixels (42 layouts), with no horizontal overflow, missing images, unlabeled fields, invalid phone links, or JavaScript errors.
- Metadata audit: all 122 sitemap URLs have the expected canonical URL, title, description, and single H1.
- Route audit: 122 sitemap URLs and 107 unique internal links passed HTTP/link checks.
- Full lead regression checks passed, including DOT failures/timeouts, cancellation, accepted-only analytics, both application buttons, duplicate-click protection, and six responsive widths.
- Browser regression form POST requests were mocked. This section does not establish real email delivery.
- A two-page sample PDF was rendered and visually inspected. Cyrillic/Romanian names, long fields, and final text were preserved without clipping.

## External Accounts

- Google Search Console accepted indexing requests for `/services` and `/blog/how-much-does-commercial-truck-insurance-cost`. This is queue acceptance, not a guarantee of indexing or rankings.
- The signed-in Analytics selector only exposed an unrelated old account. Approval was requested to create a separate Supreme account; no new GA4 account, resource, or terms acceptance has been performed.
- Resend Pro delivery and the actual Outlook inbox were verified, as detailed below.
- No paid OpenSEO refresh, subscription, new automation, invented review, or video testimonial was created. Genuine permissioned review/video assets remain an owner input.

## Production Verification

- Initial production release: `a5af089`, Vercel `dpl_5TpRs1rQhWXCqoAGAqKQ9qc2W9SV`, READY, Next.js 16.3.3, approximately 29-second build.
- URL: https://supremetruckinginsurance.com. Target: production. GitHub main was fast-forwarded without replacing concurrent work.
- All 42 responsive views and metadata for 122 URLs passed on production. The complete lead regression passed at six widths, with no browser JavaScript errors. Those regression POSTs were mocked.
- Exactly two separate, unmocked requests were submitted through the production UI: one quick quote and one full application via Finish & submit. Both were labeled `TEST ONLY SUPREME WEBSITE CHECK 20260906`, used only test data and the agency's own inbox, and returned explicit acceptance. No additional real submission was made.
- Resend shows Delivered for both internal notifications and both automatic acknowledgments. All four messages were independently found in the Outlook Inbox for info@supremetruckinginsurance.com (not Junk).
- The full application contained Supreme-Trucking-Application.pdf (14 KB). The attachment was downloaded from the actual Outlook message, text-extracted, rendered and visually checked on both pages. ELD, dash cam, garaging, unit history and Cyrillic/Romanian text arrived intact.
- Evidence links: [full application email](https://resend.com/emails/798783d4-bbe7-481f-8c9f-17cb38b355a5), [quick quote email](https://resend.com/emails/4a04bc3f-b857-41ce-82b0-4caaaf1a989a).
- Test PDF: `/Users/dmitriomelco/Downloads/Supreme-Website-TEST-20260906.pdf`. This is QA data, not a customer application or coverage request.
- Production log review showed successful HTTP 200 requests, an existing Airtable dependency deprecation warning and an unconfigured optional lead webhook notice. No email failure was recorded. This is a point-in-time check, not continuous monitoring; no new drain or monitor was configured.
- The later empty-default/row correction is tested with mocked submissions to avoid sending extra real messages. Email provider and PDF-generation code are unchanged from the actual-delivery test.

Final corrective deployment and browser verification are pending at this point in the record.
