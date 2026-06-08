# Supreme Trucking Insurance - Hermes Handoff

Date: June 8, 2026

This file is the working handoff for the Supreme Trucking Insurance website.

## Project

- Live site: https://supremetruckinginsurance.com
- Vercel project: `supreme-insurance-agency/supreme-trucking-insurance`
- GitHub repo: https://github.com/omelcodima/supreme-trucking-insurance.git
- Local repo path: `/Users/dmitriomelco/supreme-trucking-insurance`
- Framework: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS
- Main branch: `main`

## Useful Commands

Run these from `/Users/dmitriomelco/supreme-trucking-insurance`.

```bash
npm run lint
npm run build
npm run dev
npx vercel --prod --yes
git status --short
```

## Current Status

The site is live and deployed on Vercel. The working tree was clean when this handoff was created.

Recent commits:

```text
78d94bb Add SMS terms page
df83d21 Add articles insights page
0e11622 Add automatic trucking blog draft pipeline
4286da8 Add all state trucking insurance pages
cbd91d7 Add Google Business reviews page
```

## Important Pages

- `/` - homepage
- `/quote` - free quote intake
- `/instant-indication` - DOT-based instant indication tool
- `/coi-request` - certificate of insurance request
- `/articles` - polished articles and insights library
- `/blog` and `/blog/[slug]` - blog content
- `/trucking-insurance` - state directory
- `/trucking-insurance/[state]` - all 50 state SEO pages
- `/reviews` - Google Business review support page
- `/sms-terms-and-conditions` - SMS/MMS terms for phone/texting compliance
- `/privacy-policy` - privacy policy
- `/careers` - careers page

## External Integrations

### Vercel

The project is linked in `.vercel/`. Production deploys are done with:

```bash
npx vercel --prod --yes
```

### Airtable

Airtable is used for:

- quote leads
- contact/COI requests
- AI-generated blog drafts

Relevant env vars:

```text
AIRTABLE_API_KEY
AIRTABLE_BASE_ID
AIRTABLE_QUOTES_TABLE_NAME
AIRTABLE_CONTACTS_TABLE_NAME
AIRTABLE_BLOG_TABLE_NAME
```

The `Blog Posts` table was created for the automation. Fields include:

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
Google Business Post
Social Post
```

Only posts with `Status = Published` appear on the public site. New AI posts default to `Draft`.

### OpenAI Blog Automation

The weekly blog automation is installed.

- Cron route: `/api/blog/auto-draft`
- Vercel cron schedule: every Monday, 8 AM Pacific
- Current model env: `OPENAI_MODEL=gpt-5.4-mini`
- Required env: `OPENAI_API_KEY`
- Security env: `BLOG_CRON_SECRET`

Pipeline:

1. Fetch FMCSA-related Federal Register items.
2. Optional: fetch RSS feeds from `BLOG_NEWS_RSS_FEEDS`.
3. Generate an original trucking-insurance blog draft with OpenAI.
4. Save to Airtable as `Draft`.
5. User can review and change status to `Published`.

Test endpoint manually:

```bash
set -a; source .env.local; set +a
curl -s -H "Authorization: Bearer $BLOG_CRON_SECRET" \
  https://supremetruckinginsurance.com/api/blog/auto-draft
```

Known successful test draft:

```text
Title: FMCSA Seizure Exemptions: What Trucking Employers Should Know
Slug: fmcsas-epilepsy-seizure-exemption-what-trucking-employers-should-know
Status: Draft
Source: Federal Register / FMCSA
```

Security note: the OpenAI API key was pasted in chat during setup. It works, but should be rotated in OpenAI later and replaced in Vercel/local env.

### Data.Transportation.gov

Used for DOT/FMCSA lookup on the instant indication tool.

Relevant env var:

```text
DATA_TRANSPORTATION_APP_TOKEN
```

This is not an OpenAI key. It is only for transportation data lookup.

### Google Business

The website links to the company Google Business profile from `/reviews` and the footer.

Google Business URL currently used:

```text
https://www.google.com/search?kgmid=/g/11z72w_0z4&q=Supreme+Trucking+Insurance+Agency
```

Recommended ongoing routine:

- ask happy clients for Google reviews
- reply to every review
- post weekly updates on Google Business
- upload real photos regularly
- publish useful trucking insurance articles and share them to Google Business

## SEO Footprint Already Built

- All 50 state pages under `/trucking-insurance/[state]`
- Articles library at `/articles`
- Blog system with static posts plus Airtable dynamic posts
- Sitemap includes static pages, state pages, and blog posts
- Google Search Console was previously verified and sitemap submitted
- Organization schema exists in layout
- Article JSON-LD exists for blog posts
- FAQ/Breadcrumb schema exists on state pages and article/blog pages where applicable

## Compliance Pages

SMS page added for phone/texting approval:

```text
https://supremetruckinginsurance.com/sms-terms-and-conditions
```

Contains:

- SMS/MMS terms
- consent language
- message frequency
- message/data rates
- STOP opt-out
- HELP instructions
- privacy/data use
- contact information

## Design Direction

The user wants:

- simple, modern, slick
- less noise
- practical trucking insurance feel
- no fake urgency
- no “same-day turnaround” language
- strong trust signals but not cluttered
- owner-operator, fleet, new authority, cargo, COI, instant indication flows

Avoid:

- heavy marketing clutter
- fake claims
- copied competitor text
- overly generic insurance language
- too much visual noise

## Key Files

```text
src/app/layout.tsx
src/app/page.tsx
src/app/articles/page.tsx
src/app/blog/page.tsx
src/app/blog/[slug]/page.tsx
src/app/api/blog/auto-draft/route.ts
src/app/instant-indication/page.tsx
src/app/api/dot-lookup/route.ts
src/app/sms-terms-and-conditions/page.tsx
src/app/sitemap.ts
src/lib/blogPosts.ts
src/lib/allBlogPosts.ts
src/lib/airtableBlogPosts.ts
src/lib/statePages.ts
src/lib/seo.ts
lib/airtable.ts
vercel.json
```

## Current Recommendations / Next Work

1. Rotate the OpenAI API key because it was shared in chat.
2. Review the Airtable blog draft and publish it if acceptable.
3. Add a small admin/review page for blog drafts if the user wants less Airtable manual work.
4. Add real social profile URLs when available. Footer icons currently show placeholders.
5. Add more high-intent articles:
   - New authority trucking insurance checklist
   - Cargo insurance for reefer, flatbed, hotshot, car hauler
   - Trucking insurance by state requirements
   - COI request guide for brokers/shippers
   - Fleet renewal checklist
6. Keep Google Business active with reviews, photos, and weekly posts.
7. Confirm SMS terms page satisfies the phone company. Adjust wording if they request specific language.

## Important Caution

Do not commit `.env.local`. Do not expose API keys in docs, screenshots, or chat. The handoff intentionally lists env variable names only, not secret values.
