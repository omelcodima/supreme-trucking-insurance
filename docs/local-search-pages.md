# State and city directory

The `/trucking-insurance` directory lists major cities in the 48 states already
served by the agency. Alaska and Hawaii remain excluded. City names represent
service areas, not physical offices or guarantees of carrier eligibility.

## Publishing a city guide

- Add reviewed, location-specific content to `src/lib/cityPages.ts` only when it
  helps explain the actual freight operation and quote preparation.
- Use primary local sources for freight facts. Do not invent local insurance
  rules, premium estimates, licenses, offices or testimonials.
- Keep the city name in the matching state's `src/lib/locationDirectory.ts`
  list. Names alone do not generate pages; only reviewed guides become links.
- New guides automatically join the static route list, sitemap, state-page
  links and directory. The footer features selected states.
- Keep one self-canonical, one H1, visible FAQ text matching its schema, and a
  Service area tied to the existing agency. Do not create a fake city branch.

Initially published: Seattle, Tacoma, Vancouver and Spokane in Washington;
Portland and Eugene in Oregon. Other cities currently link through their state
page, not through duplicate city landing pages.

Run the test suite, lint, build and desktop/mobile browser checks before
publishing. Check search terms such as `Portland, OR` and `Portland, ME`, known
city routes, unknown-city 404s and sitemap entries.

Search indexing and rankings are not guaranteed. Avoid mass-produced location
pages whose only change is a city name. Reference:
https://developers.google.com/search/docs/essentials/spam-policies#doorway-abuse
