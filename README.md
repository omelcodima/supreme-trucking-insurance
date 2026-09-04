# Supreme Trucking Insurance

Production website and content automation for [supremetruckinginsurance.com](https://supremetruckinginsurance.com).

This worktree is the clean operational branch used by the Hermes Supreme publication/hero monitor. It contains the Airtable-backed blog, checked-in snapshot fallback, lead routes, SEO routes, and the M/W/F automated publishing workflow.

## Current operating status

Verified on **2026-09-04**:

- The production site, quote route, blog index, `robots.txt`, and sitemap respond successfully.
- The Vercel blog cron published [`tariff-whiplash-cross-border-trucking-insurance`](https://supremetruckinginsurance.com/blog/tariff-whiplash-cross-border-trucking-insurance) to Airtable at the scheduled Friday run.
- The article, its current hero image, canonical metadata, visible source link, blog-index link, and sitemap entry were verified live.
- The article is using a unique, subject-matched **Pexels fallback**. Premium Higgsfield replacement is blocked until the Hermes Higgsfield MCP OAuth session is refreshed; do not report the fallback as a successful Higgsfield generation.
- The unattended social path has no verified publishing credentials. It can prepare captions, but it must not claim that Facebook, Instagram, LinkedIn, or Google Business publication occurred without a public post URL/readback.

Do not place secret values, OAuth material, customer records, or lead PII in this repository or in command output.

## Architecture

- **Framework:** Next.js App Router
- **Production hosting:** Vercel
- **Blog source of truth:** Airtable `Blog Posts`
- **Resilience fallback:** `src/content/publishedBlogSnapshot.ts`
- **Publishing route:** `/api/blog/auto-draft`
- **Lead routes:** `/api/contact` and `/api/signup`
- **Production route checks:** `scripts/verify-seo-routes.mjs` and `scripts/verify-lead-routes.mjs`
- **Hero discovery/upgrade helper:** `scripts/blog-higgsfield-media.mjs`

Airtable remains authoritative when it is reachable. The checked-in snapshot prevents previously published articles from disappearing during an Airtable read outage. A transient CMS failure must not be interpreted as an empty blog.

## Automated publishing

Vercel invokes `/api/blog/auto-draft` on Monday, Wednesday, and Friday. The route selects a recent trucking/insurance source, generates original source-grounded content, and writes the result to Airtable. Production auto-publish is currently enabled.

The article contract includes:

```text
Status
Slug
Title
Description
Category
Date
Read Time
Intro
Sections JSON
Takeaway
Source Title
Source URL
Source Published At
Image URL
Image Alt Text
Image Label
Image Cue
Image Provider
Image Brief
Google Business Post
Social Post
Social Posted
```

The public article must preserve a visible source link and must not overstate insurance coverage, pricing, savings, or regulatory conclusions.

## Environment contract

Store values only in `.env.local` or Vercel environment settings. Common names used by the application include:

```bash
OPENAI_API_KEY=
OPENAI_MODEL=
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=
AIRTABLE_BLOG_TABLE_NAME=
BLOG_CRON_SECRET=
BLOG_AUTO_PUBLISH=
BLOG_NEWS_RSS_FEEDS=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_FORM_ENDPOINT=
NEXT_PUBLIC_SIGNUP_ENDPOINT=
RESEND_API_KEY=
EMAIL_FROM=
LEAD_NOTIFICATION_EMAIL=
```

Do not infer readiness from a variable name alone. Verify the live article or lead route after each production change.

## Operator verification

Install dependencies with the committed lockfile, then run the release gate:

```bash
npm ci
npm test
npm run lint
npm run build
npm run health:seo-routes
npm run health:lead-routes
```

Inspect the newest Airtable article without writing records or spending media credits:

```bash
node --env-file=.env.local --experimental-strip-types \
  scripts/blog-higgsfield-media.mjs discover
```

`package.json` declares the project as an ES module so Node's TypeScript test loader and media helper do not emit the prior `MODULE_TYPELESS_PACKAGE_JSON` warning on every automated run.

## Higgsfield hero upgrade

The safe sequence is:

1. Run `discover` and confirm the exact newest Airtable record, slug, source URL, and current provider.
2. If the result says `needsUpgrade: false`, stop without spending credits.
3. If an upgrade is needed, generate one subject-specific photorealistic 16:9 image with no text or logos.
4. Run the helper's `apply` path only with the exact Airtable record ID and verified output file.
5. Re-run production SEO health and fetch the live article/image before reporting completion.

A successful command is not proof that the public image changed. The live article and image URL are the acceptance criteria.

## Deployment rules

- Check `git status` before editing; do not overwrite another agent's work.
- Keep changes minimal and reversible.
- Require tests, lint, build, and relevant production health checks before deployment.
- Never deploy from a dirty or diverged worktree.
- After deployment, read back the exact production URL and verify the customer-visible result.
