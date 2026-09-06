# Homepage market logos

Updated September 6, 2026. The twelve names match `carrierMarkets` in the prior homepage at commit `07c72de`; no additional market relationships or market counts are claimed. This list is not independent verification of direct carrier appointments. The existing access/state/underwriting disclaimer is retained.

One row drifts left over 90 seconds. Equal-width repeated lists produce a continuous loop. The duplicate list is hidden from assistive technology. Visitors can pause/resume using the icon button, and hovering over the logos pauses movement. Reduced-motion preference shows all twelve once in a static responsive grid.

Original four assets and their sources are documented in `SITE-EXPERIENCE-2026-09-05.md`. The eight restored brands use artwork obtained from their official websites without recoloring or redrawing:

| Market | Official asset source |
| --- | --- |
| IAT / Harco | https://www.iatinsurancegroup.com/media/zfjl31om/iat-logo-larger.png |
| AIG | https://www.aig.com/content/experience-fragments/aig/america-canada/us_aig/en/footer/master/_jcr_content/root/responsivegrid_1958828262/container/teaserflex.coreimg.png/1785248292136/aig-logo.png |
| Nirvana | https://cdn.prod.website-files.com/66b7f3068b19345bbd14c747/69b95e21aa59e3c729370268_NirvanaLogoDark.svg (linked by nirvanatech.com) |
| Lancer | https://images.squarespace-cdn.com/content/v1/58530c911b631b89245744ab/646e1f84-e4db-42d9-9ccb-6eb29ea1d094/Lancer_logo_Att_outlines_300_rev-250px.png?format=1500w (linked by lancerinsurance.com) |
| Benchmark | https://www.benchmarkinsco.com/assets/images/logo-benchmarkinsco.svg |
| Berkley | https://www.berkley.com/sites/g/files/xkzibx366/files/2022-03/Berkley_logo_Header.svg |
| Crum & Forster | PNG embedded in the public branded response from https://www.cfins.com/ |
| GEICO | https://www.geico.com/_next/image/?url=%2Fimages%2Fgeico-gecko-dark.png&w=3840&q=75 |

Lancer supplies a reversed white wordmark, so its image is presented on a dark background. All files are served locally; the page does not depend on external logo hosts at runtime.

## Verification

- Production build and lint pass; 68 unit tests pass, including the market list and local asset checks.
- Playwright verified movement, pause/resume, keyboard resume, hover pause, and a seamless equal-width loop.
- No horizontal overflow at 320, 390, 894, or 1440 pixels. All 24 images load (12 markets plus an accessibility-hidden duplicate for the loop).
- Reduced motion displays the 12 markets once, without animation or a redundant pause control. Desktop and mobile screenshots were visually reviewed.
- Local screenshots are in `output/playwright/`, excluded from Git and deployment uploads.

## Production release

- Published commit `8fc72b9` to https://supremetruckinginsurance.com/ on September 6, 2026.
- Vercel deployment: `dpl_ZVxRwpR9mybmwpy6iwnS5vFe56Df` (READY).
- Public-site checks: all logos load, leftward motion/pause/keyboard/hover controls pass, no mobile horizontal overflow, no browser errors or warnings.
- Source remains on local branch `codex/site-experience-cleanup`. GitHub authentication still needs reconnecting before these changes and the preceding site redesign can be pushed; avoid deploying the older remote main over this release.
