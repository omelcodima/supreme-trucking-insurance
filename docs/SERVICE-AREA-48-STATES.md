# Agency service area: 48 states

The owner confirmed on September 9, 2026 that Supreme Trucking Insurance serves all U.S. states except Alaska and Hawaii and approved aligning the website. This is agency service availability, not a new licensing assertion and not a statement about an insurance policy's coverage territory.

## Changes

- `servedStatePages` is the public 48-state catalog. The all-50 registry remains available to resolve existing URLs.
- The homepage chooser, state hub, ItemList data, and XML sitemap list only the 48 served states.
- Existing Alaska and Hawaii pages remain HTTP 200 with explicit unavailability notices and self-canonicals. Their metadata sets `noindex, follow`; their page-specific sales/service and FAQ markup is removed. Google must recrawl the pages to apply the indexing change. They are not blocked in robots.txt.
- Homepage, footer, contact information, relevant descriptions, and agency/service JSON-LD consistently describe the 48-state service area. No claim of a verified 48-state license inventory is added.
- The full application's company-state selector offers 48 states. Existing Alaska/Hawaii draft or imported values remain visible with an unavailable notice; its online-submit handler rejects those known company base states without erasing information. All 50 states remain available for operating routes, garaging, and driver licenses. This is a client-side form guard, not a new API-level restriction.
- Existing designs, customer records, owner dashboard work, insurance policy territory, and Google Ads campaigns are outside this release.

## Verification

```sh
npm test
npm run lint
npm run build
node scripts/verify-service-area.mjs http://127.0.0.1:3036
node scripts/verify-seo-routes.mjs http://127.0.0.1:3036
node scripts/verify-service-area.mjs https://supremetruckinginsurance.com
```

The focused HTTP check verifies 48 distinct served state routes, catalog links, sitemap entries, homepage choices, self-canonicals, single H1s, schema areas, and both noindex availability notices. Browser checks cover desktop notice rendering and mobile state selection/navigation, with no horizontal overflow on the sampled served-state page.

Reference: [Google noindex documentation](https://developers.google.com/search/docs/crawling-indexing/block-indexing), [Schema.org areaServed](https://schema.org/areaServed).

## Pre-release verification

- 132 unit tests passed, including saved excluded-state preservation, submission prevention without network requests, and unchanged operational/garaging/license data.
- ESLint and `git diff --check` passed.
- Next.js 16.3.3 production build passed, including TypeScript and all 124 generated pages.
- Focused HTTP verification passed against both the local development server and the locally running production build: all 48 served routes plus both availability notices.
- General SEO route audit: 122 sitemap URLs, 105 distinct internal links, 42 blog articles, no broken links, duplicate sitemap URLs, or internal redirects.
- Desktop and 320/390-pixel mobile browser checks covered availability notices, the state hub, homepage state selection and California navigation. The rendered full-application selector has 48 labeled enabled options, excludes AK/HI, changes selection successfully, and preserves it on reload. No real application was submitted.

The release is based on production commit `567e1a1fd3fbb152f6ad42ad552fb8683a522b9c` in an isolated worktree. Unrelated owner-dashboard changes in the original checkout are not part of this release. Production status must be confirmed after deployment using the commands above.
