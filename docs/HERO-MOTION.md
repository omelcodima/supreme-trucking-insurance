# Interactive homepage hero

September 6, 2026. Implements mouse-driven depth and scroll-driven approach/reverse motion in the homepage hero. The existing image, calls to action, promo video, and 12-market marquee are retained. The Supreme name is more prominent, with a restrained orange accent and stable HTML text over the full-bleed scene.

## Rendering

- Three.js is dynamically imported only for the hero enhancement. A subdivided, photo-textured mesh uses a bounded soft depth profile for the cab, trailer, and road. This is a 2.5D photograph-based effect, not a fully modeled truck or a truck-to-logo morph.
- Mouse movement adjusts perspective; scrolling down approaches the scene, and scrolling up reverses it. Scrolling is never captured or pinned.
- The render loop runs only while interpolating input or resizing, and stops when offscreen or the tab is hidden. Pixel ratio is capped at 1.5.
- Original HTML image remains visible while loading and on WebGL failure. Reduced-motion preference skips the enhancement and responds to preference changes. A keyboard-accessible pause/resume control freezes mouse and scroll animation.
- Graphics, observers, frame requests, and listeners are disposed on unmount. There are no external model/asset requests.

## Design investigation

A clean road plate was generated with the built-in image tool, but automatic foreground extraction failed. A photo-contour prototype did not preserve the vehicle edges well enough. Neither prototype is shipped. The final version uses the original `public/images/hero-premium.jpg` intact, with continuous mesh depth so the truck's shadow and road stay connected. Exploratory images are excluded from Git and deployment uploads in `output/playwright/`.

## Verification

- Production build, TypeScript, lint, and 72 unit tests pass.
- Playwright verified actual WebGL pixel content and pixel changes from mouse movement and scrolling; scrolling back restored the previous framing.
- Pause, keyboard resume, reduced motion, re-enabling motion, context-loss fallback, and quote navigation pass.
- Screenshots checked at 320x740, 390x844, 894x999, 1440x1000, and 1920x1080. No horizontal overflow or heading/button overflow, and the next section remains visible in each first viewport.
- Local production preview: http://localhost:3106. The older development server on port 3105 stopped responding during hot reload; it is not the verified preview.
- Browser verification script and screenshots are in `output/playwright/` (local-only).

## Source sync

The working branch is `codex/site-experience-cleanup`. GitHub authentication is still invalid as checked during this work; source commits must be pushed after authentication is restored. Avoid deploying older remote main over the current homepage and prior site redesign.

## Production release

- Live at https://supremetruckinginsurance.com/; deployed source `d82a957` (hero implementation `f30bd85`).
- Vercel deployment `dpl_BasQRcjJJpKtK6k6X3kZArbvcD1F`, status READY, September 6, 2026.
- Re-ran the complete pixel/interaction/responsive/fallback/quote-navigation browser check against the public domain. All passed with no page errors. Scroll reversal returned the sampled pixels within a mean channel difference of 0.002.
- During the remote build an Airtable read used the existing last-known-good published-post fallback. Blog integration was not changed in this release.
