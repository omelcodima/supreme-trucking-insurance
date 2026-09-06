# Interactive coverage overview

September 6, 2026. Implements the approved next step: an interactive Services
coverage explorer. The existing homepage photo-depth hero, market marquee,
specialized coverage pages, and application submission flows are preserved.

## Visitor experience

- `/services` is linked from the Services menu (desktop and mobile), the homepage
  operation section, the footer, and the sitemap.
- Truck, Cargo, and Liability tabs and matching image hotspots select concise
  coverage explanations. This is an interactive bitmap diagram, not a 3D model.
- Each selection has a quote CTA carrying an exact supported coverage value.
  Physical Damage Only was added to the existing quick-quote choices so the
  Truck selection does not silently request a full coverage bundle.
- Cargo and Liability also link to the existing detailed coverage pages.
- Tabs support Left/Right, Home/End, normal Tab navigation, and visible focus.
  Inactive panels are invisible and inert but reserve their measured height to
  prevent layout jumps. Motion preferences disable decorative transitions.
- The page makes no guarantees of coverage, approval, savings, or availability.

## Content reference

Original short summaries checked against primary coverage explanations:

- https://www.progressivecommercial.com/coverages/physical-damage/
- https://www.progressivecommercial.com/coverages/motor-truck-cargo/
- https://www.progressivecommercial.com/commercial-auto-insurance/commercial-auto-coverage/

These are educational references, not a promise that any particular carrier or
policy provides all examples. Policy-dependent caveats remain visible.

## Image provenance

Built-in image generation tool, not the CLI fallback. A new unbranded studio
truck visual was generated for the site and optimized with Sharp to WebP.
No source photo or logo was replaced.

- Shipped asset: `public/images/coverage-truck-studio.webp`
- Dimensions: 1536 x 1024; size: 44,218 bytes.

Final prompt:

> Use case: product-mockup. Asset type: wide website interactive insurance diagram background. Create a premium photorealistic studio photograph of a complete American semi tractor and attached long dry van trailer, full exact side profile facing RIGHT. A modern silver aerodynamic sleeper cab on the right and a clean white rectangular dry van trailer extending to the left. Entire vehicle including all tires fits comfortably in frame, with generous margin above and below and 7 percent margin at each side. Landscape 3:2 composition. Truck fills approximately 85 percent width and the middle 40 percent height. Seamless pure white studio backdrop, subtle realistic soft gray contact shadow beneath the tires, finely detailed metal, natural proportions and credible trailer axles. Sharp realistic commercial product photography, bright neutral lighting, restrained professional automotive aesthetic. No words, no logos, no watermark, no humans, no labels, no icons, no borders or UI. We will add coverage buttons separately in code.

## Local verification

- Production build and TypeScript pass; ESLint passes.
- All 75 unit tests pass, including three new coverage/handoff tests.
- Playwright checks at 320, 390, 768, 894, 1440, and 1920 pixels: image loaded,
  three working tabs, matching hotspots, one accessible panel, stable panel
  dimensions, and no horizontal overflow.
- Keyboard traversal, reduced motion, desktop/mobile menu links, homepage link,
  canonical URL, sitemap, and actual quote preselection for all three layers pass.
- No first-party HTTP errors or uncaught page exceptions in the verified flow.
- No real lead submission or email was sent during these tests.
- Local production preview: http://localhost:3107/services
- Scripts, reports, and screenshots live in ignored `output/playwright/`.
  That folder and `.playwright-cli/` are also excluded from ESLint and deployment.

## Source synchronization

Working branch: `codex/site-experience-cleanup`. GitHub authentication remains
invalid as checked September 6. The source must be pushed after reconnection;
do not deploy an older remote main over this branch's production changes.
