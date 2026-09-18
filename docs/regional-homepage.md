# State-aware homepage

The homepage keeps a national, cached server-rendered version. A separate
`GET /api/visitor-region` reads only Vercel's country and first-level region
headers, returns an allowlisted US state code, and sets private/no-store on both
browser and CDN caches. It does not read or store IPs, GPS, city or coordinates.
No third-party geolocation subscription is required.

The client loads only the suggested state's local photo and a shared transparent
truck foreground. Both must load successfully before replacing the original
hero. Unknown, non-US, blocked or failed requests keep the national hero. Rapid
selection changes cannot let an older image-load result replace the newer choice.

The native Business state selector supports automatic, national and all 50 states.
Only a manual choice is saved in sessionStorage. This display preference does not
prefill an application, change pricing, establish eligibility or redirect visitors.
The existing 48-state service-area disclosure remains visible. Alaska and Hawaii
have scenes but show the existing service exclusion and a contact CTA instead of
claiming insurance is available there. No "best rate" promise is made.

## Assets

- `scripts/region-scene-sources.mjs`: reviewed landmark/photo selections.
- `scripts/prepare-region-scenes.mjs`: offline acquisition and WebP optimization.
- `src/lib/regionScenes.json`: source URLs, authors and licenses.
- `public/images/states/`: 50 local photographs, one per state.
- `/image-credits`: public attribution, original files and applicable licenses.

The common foreground was prepared with the built-in image generation tool from
`public/images/hero-cinematic.webp`, preserving the dark tractor/box trailer and
foreground road with transparent sky/terrain. Final asset:
`public/images/hero-regional-foreground.webp`. This is illustrative photography,
not evidence of a local office or a truck physically visiting that landmark.

Prompt: Extract the exact existing dark metallic aerodynamic semi truck and silver
box trailer, same front-left perspective, headlights, wheels, warm lighting and
left-of-frame position. Remove sky, clouds, mountains and distant terrain to true
alpha. Retain the vehicle, contact shadow and lower foreground asphalt; leave the
right half above the asphalt transparent. Do not add words, logos or buildings.

## Verification

Unit tests check all 50 files, state validation, unserved states, neutral fallback,
privacy/cache headers and real foreground alpha. Browser QA must check WA/NY,
manual override, national reset, invalid/failed geolocation, image failure,
desktop/mobile, image framing and unchanged quote destinations. Never spoof a
public production request to claim testing every real geographic IP location.

Verified locally on September 17, 2026:
- All 50 manual selections rendered both images. Served states retained `/quote`;
  AK/HI used `/contact` with the service-area exception.
- WA/NY switch, manual selection across reload, national reset and automatic
  unknown-region fallback passed in the browser.
- Local endpoint checks covered WA, NY, unknown/invalid and non-US regions with
  private/no-store responses. No real visitor records were created.
- Cinematic layout checked at 1920x1080, 1440x900, 894x999, 768x1024,
  390x844 and 320x667. No horizontal overflow; compact mobile retains a peek of
  the next section. Classic fallback was also checked.
- Asset contact sheets were inspected and unsuitable source photographs replaced.
  Network and decode failures are covered by the image preloading unit test.
- Local preview: `http://localhost:3220/`. QA fixtures are not published.
