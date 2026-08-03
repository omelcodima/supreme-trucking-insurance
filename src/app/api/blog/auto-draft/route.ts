import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import {
  AIRTABLE_BLOG_CACHE_TAG,
  createAirtableBlogPost,
  listAirtableBlogRecords,
  retryAirtableRead,
} from "@/lib/airtableBlogPosts";
import { parseGeneratedJson } from "@/lib/blogGeneratedJson";
import { normalizeReadTime } from "@/lib/blogReadTime";

export const maxDuration = 180;

const CRON_AIRTABLE_READ_TIMEOUT_MS = 20_000;

type SourceItem = {
  title: string;
  url: string;
  summary: string;
  publishedAt: string;
  sourceName: string;
};

type GeneratedPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  intro: string;
  sections: {
    heading: string;
    body: string[];
  }[];
  takeaway: string;
  googleBusinessPost: string;
  socialPost: string;
  imagePrompt?: string;
};

type GeneratedPostPayload = Omit<GeneratedPost, "readTime"> & {
  readTime?: unknown;
};

/**
 * Find a real stock photo for the post via Pexels (preferred), falling back
 * to AI generation. Image problems must never block publishing.
 */
async function findPexelsImage(query: string): Promise<{ url: string; credit: string } | null> {
  const pexelsKey = process.env.PEXELS_API_KEY;
  if (!pexelsKey) return null;
  try {
    const params = new URLSearchParams({ query, per_page: "6", orientation: "landscape" });
    const response = await fetch(`https://api.pexels.com/v1/search?${params}`, {
      headers: { Authorization: pexelsKey },
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) return null;
    const body = (await response.json()) as {
      photos?: { src?: { landscape?: string }; photographer?: string; avg_color?: string }[];
    };
    const photos = (body.photos || []).filter((p) => p.src?.landscape);
    if (photos.length === 0) return null;
    // Light rotation so back-to-back posts on similar topics don't reuse photo #1.
    const pick = photos[Math.floor(Math.random() * Math.min(photos.length, 4))];
    return { url: pick.src!.landscape!, credit: pick.photographer || "Pexels" };
  } catch {
    return null;
  }
}

/** Distill a photo search query from the article's image prompt / topic. */
function pexelsQueryFromPrompt(imagePrompt: string, title: string): string {
  const t = (imagePrompt + " " + title).toLowerCase();
  if (t.includes("medical") || t.includes("exam") || t.includes("audiometer") || t.includes("hearing")) return "medical exam doctor office";
  if (t.includes("qualification") || t.includes("folder") || t.includes("documents") || t.includes("paperwork")) return "documents paperwork desk office";
  if (t.includes("reefer") || t.includes("refrigerated")) return "refrigerated truck trailer loading";
  if (t.includes("warehouse") || t.includes("dock") || t.includes("cargo") || t.includes("pallet")) return "warehouse loading dock freight";
  if (t.includes("fleet") || t.includes("yard") || t.includes("parked")) return "truck fleet parking yard";
  if (t.includes("cab") || t.includes("dashboard") || t.includes("driver seat")) return "truck driver cab interior";
  if (t.includes("inspection") || t.includes("clipboard")) return "truck inspection mechanic";
  if (t.includes("money") || t.includes("calculator") || t.includes("settlement") || t.includes("earning")) return "calculator finance paperwork desk";
  return "semi truck highway";
}

function buildPostImageUrl(imagePrompt: string, slug: string): string {
  const style =
    "bright professional editorial photography, photorealistic, high detail, natural light, no text, no logos, no watermarks";
  const prompt = encodeURIComponent(`${imagePrompt}, ${style}`);
  // Deterministic seed per slug so the URL is stable across rebuilds.
  let seed = 0;
  for (let i = 0; i < slug.length; i++) seed = (seed * 31 + slug.charCodeAt(i)) >>> 0;
  return `https://image.pollinations.ai/prompt/${prompt}?width=1200&height=630&nologo=true&model=flux&seed=${seed % 100000}`;
}

async function verifyImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" },
      signal: AbortSignal.timeout(60000),
    });
    const type = response.headers.get("content-type") || "";
    return response.ok && type.startsWith("image/");
  } catch {
    return false;
  }
}

const defaultRssFeeds = [
  "https://landline.media/feed/",
  "https://www.ttnews.com/rss.xml",
];

const federalRegisterUrl =
  "https://www.federalregister.gov/api/v1/documents.json?conditions%5Bagencies%5D%5B%5D=federal-motor-carrier-safety-administration&per_page=10&order=newest";

function isAuthorized(request: Request) {
  const cronSecret = process.env.BLOG_CRON_SECRET || process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");
  const userAgent = request.headers.get("user-agent") || "";

  if (cronSecret && authorization === `Bearer ${cronSecret}`) {
    return true;
  }

  return userAgent.includes("vercel-cron/1.0");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72)
    .replace(/-+$/g, "");
}

function stringField(fields: Record<string, unknown>, name: string) {
  const value = fields[name];
  return typeof value === "string" ? value.trim() : "";
}

function stripHtml(value: string) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTag(block: string, tag: string) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? decodeXml(match[1]) : "";
}

function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

async function getFederalRegisterItems(): Promise<SourceItem[]> {
  const response = await fetch(federalRegisterUrl, {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    console.error("Federal Register fetch failed:", response.status);
    return [];
  }

  const data = (await response.json()) as {
    results?: {
      title?: string;
      html_url?: string;
      abstract?: string;
      publication_date?: string;
      type?: string;
    }[];
  };

  return (data.results || [])
    .map((item) => ({
      title: item.title || "",
      url: item.html_url || "",
      summary: [item.type, item.abstract].filter(Boolean).join(": "),
      publishedAt: item.publication_date || new Date().toISOString().slice(0, 10),
      sourceName: "Federal Register / FMCSA",
    }))
    .filter((item) => item.title && item.url);
}

async function getRssItems(): Promise<SourceItem[]> {
  const configuredFeedUrls = (process.env.BLOG_NEWS_RSS_FEEDS || "")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);
  const feedUrls = configuredFeedUrls.length > 0 ? configuredFeedUrls : defaultRssFeeds;

  const items = await Promise.all(
    feedUrls.map(async (feedUrl) => {
      try {
        const response = await fetch(feedUrl, { next: { revalidate: 3600 } });
        if (!response.ok) {
          return [];
        }

        const xml = await response.text();
        const itemBlocks = [...xml.matchAll(/<item[\s\S]*?<\/item>/gi)]
          .map((match) => match[0])
          .slice(0, 10);

        return itemBlocks
          .map((block) => ({
            title: extractTag(block, "title"),
            url: extractTag(block, "link") || extractTag(block, "guid"),
            summary: stripHtml(extractTag(block, "description")),
            publishedAt: extractTag(block, "pubDate")
              ? new Date(extractTag(block, "pubDate")).toISOString().slice(0, 10)
              : new Date().toISOString().slice(0, 10),
            sourceName: feedUrl,
          }))
          .filter((item) => item.title && item.url);
      } catch (error) {
        console.error("RSS fetch failed:", feedUrl, error);
        return [];
      }
    }),
  );

  return items.flat();
}

function sourceScore(item: SourceItem) {
  const text = `${item.title} ${item.summary}`.toLowerCase();
  const terms = [
    "breaking",
    "rate",
    "rates",
    "premium",
    "liability",
    "lawsuit",
    "nuclear verdict",
    "motor carrier",
    "commercial motor vehicle",
    "truck",
    "trucking",
    "driver",
    "safety",
    "authority",
    "registration",
    "hours of service",
    "cargo",
    "insurance",
    "compliance",
    "fmcsa",
    "dot",
    "broker",
    "freight",
    "inspection",
    "out of service",
  ];

  return terms.reduce((score, term) => score + (text.includes(term) ? 1 : 0), 0);
}

function getResponseText(data: unknown) {
  const response = data as {
    output_text?: string;
    output?: {
      content?: {
        text?: string;
      }[];
    }[];
  };

  if (response.output_text) {
    return response.output_text;
  }

  return (response.output || [])
    .flatMap((item) => item.content || [])
    .map((content) => content.text || "")
    .join("\n")
    .trim();
}

function parseGeneratedPost(text: string): GeneratedPost {
  const parsed = parseGeneratedJson(text) as GeneratedPostPayload;

  if (
    !parsed.slug ||
    !parsed.title ||
    !parsed.description ||
    !parsed.intro ||
    !Array.isArray(parsed.sections) ||
    parsed.sections.length < 3 ||
    !parsed.takeaway
  ) {
    throw new Error("OpenAI response did not include the required blog fields.");
  }

  return {
    ...parsed,
    slug: slugify(parsed.slug || parsed.title),
    category: parsed.category || "Trucking News",
    readTime: normalizeReadTime(parsed.readTime),
    googleBusinessPost: parsed.googleBusinessPost || "",
    socialPost: parsed.socialPost || "",
  };
}

async function generatePost(source: SourceItem): Promise<GeneratedPost> {
  const instructions =
    "You write for the Supreme Trucking Insurance blog — a real independent trucking insurance agency. Write like an experienced agent talking to trucking clients, not like an AI content mill. Vary your writing: some posts benefit from short punchy sections, others from a deeper dive; use concrete operational details truckers recognize (loss runs, MC numbers, driver files, reefer breakdowns, COIs, renewal shopping). Include one practical 'what we tell our clients' style insight. Never copy sentences from the source. Never invent legal requirements, prices, guarantees, same-day promises, or coverage promises. No fake urgency, no heavy marketing. Connect news to insurance only where reasonable: underwriting, filings, safety history, cargo, drivers, inspections, claims, renewals, carrier appetite. Always note the post is informational and final coverage depends on underwriting, filings, drivers, cargo, state, and carrier appetite.";
  const userPrompt = `Create one original SEO blog/news post from this source. Return only valid JSON with these keys: slug, title, description, category, readTime, intro, sections, takeaway, googleBusinessPost, socialPost, imagePrompt. sections must be an array of 3 to 5 objects with heading and body; vary section count and paragraph rhythm naturally (1-3 paragraphs per section; occasionally use a short dash list inside a body where it genuinely helps). Write in Supreme Trucking Insurance's voice: simple, modern, practical, low-noise, no fake claims. Summarize what happened, why trucking companies should care, and what insurance-related documents or questions to prepare. imagePrompt must describe ONE bright professional editorial photograph that literally depicts this article's specific subject (scene, objects, setting — e.g. 'refrigerated trailer being loaded at a food warehouse dock, morning light' for a reefer story). No text, no logos, no readable signage, no close-up faces in the imagePrompt. Source title: ${source.title}\nSource URL: ${source.url}\nSource published: ${source.publishedAt}\nSource summary: ${source.summary}`;

  // Preferred path: Vercel AI Gateway (flat subscription, OpenAI-compatible).
  const gatewayKey = process.env.AI_GATEWAY_API_KEY;
  if (gatewayKey) {
    const gatewayModel = process.env.BLOG_GATEWAY_MODEL || "openai/gpt-4o-mini";
    const response = await fetch("https://ai-gateway.vercel.sh/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${gatewayKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: gatewayModel,
        max_tokens: 2200,
        messages: [
          { role: "system", content: instructions },
          { role: "user", content: userPrompt },
        ],
      }),
    });
    if (response.ok) {
      const body = (await response.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const text = body.choices?.[0]?.message?.content?.trim();
      if (text) {
        return parseGeneratedPost(text);
      }
    } else {
      console.error("AI Gateway blog generation failed, falling back to OpenAI:", response.status, await response.text());
    }
  }

  // Fallback: direct OpenAI Responses API.
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("No AI provider available: AI Gateway failed/absent and OPENAI_API_KEY is missing.");
  }

  const model = process.env.OPENAI_MODEL || "gpt-5.2";
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      instructions,
      input: userPrompt,
      max_output_tokens: 2200,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed: ${response.status} ${await response.text()}`);
  }

  return parseGeneratedPost(getResponseText(await response.json()));
}

export async function GET(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
    }

    console.info("Blog automation stage: Airtable duplicate check started.");
    const existingRecords = await retryAirtableRead(
      () =>
        listAirtableBlogRecords({
          cache: "no-store",
          timeoutMs: CRON_AIRTABLE_READ_TIMEOUT_MS,
        }),
      {
        maxAttempts: 2,
        onRetry: ({ attempt, delayMs, reason }) => {
          console.warn("Blog automation stage: retrying Airtable duplicate check.", {
            attempt,
            delayMs,
            reason,
          });
        },
      },
    );
    console.info("Blog automation stage: Airtable duplicate check completed.", {
      records: existingRecords.length,
    });
    const existingSourceUrls = new Set(
      existingRecords.map((record) => stringField(record.fields, "Source URL")).filter(Boolean),
    );
    const existingSlugs = new Set(
      existingRecords.map((record) => stringField(record.fields, "Slug")).filter(Boolean),
    );

    console.info("Blog automation stage: source collection started.");
    const [federalRegisterItems, rssItems] = await Promise.all([
      getFederalRegisterItems(),
      getRssItems(),
    ]);
    const candidates = [...federalRegisterItems, ...rssItems]
      .filter((item) => !existingSourceUrls.has(item.url))
      .sort((a, b) => sourceScore(b) - sourceScore(a));
    console.info("Blog automation stage: source collection completed.", {
      candidates: candidates.length,
    });

    const source = candidates.find((item) => sourceScore(item) > 0) || candidates[0];

    if (!source) {
      return NextResponse.json({ ok: true, message: "No new trucking source items found." });
    }

    console.info("Blog automation stage: content generation started.", {
      sourceUrl: source.url,
    });
    const generatedPost = await generatePost(source);
    console.info("Blog automation stage: content generation completed.", {
      slug: generatedPost.slug,
    });
    let slug = generatedPost.slug;
    let suffix = 2;
    while (existingSlugs.has(slug)) {
      slug = `${generatedPost.slug}-${suffix}`;
      suffix += 1;
    }

    const status = process.env.BLOG_AUTO_PUBLISH === "true" ? "Published" : "Draft";
    const today = new Date().toISOString().slice(0, 10);

    // Topic-specific hero image: real Pexels photo first, AI fallback. Never blocks publishing.
    let imageUrl = "";
    let imageAlt = "";
    if (generatedPost.imagePrompt) {
      console.info("Blog automation stage: image selection started.");
      const pexels = await findPexelsImage(pexelsQueryFromPrompt(generatedPost.imagePrompt, generatedPost.title));
      if (pexels) {
        imageUrl = pexels.url;
        imageAlt = `${generatedPost.title} — photo by ${pexels.credit} (Pexels)`;
      } else {
        const candidateUrl = buildPostImageUrl(generatedPost.imagePrompt, slug);
        if (await verifyImageUrl(candidateUrl)) {
          imageUrl = candidateUrl;
          imageAlt = `${generatedPost.title} — ${generatedPost.imagePrompt.slice(0, 120)}`;
        }
      }
      console.info("Blog automation stage: image selection completed.", {
        imageFound: Boolean(imageUrl),
      });
    }

    console.info("Blog automation stage: Airtable create started.", { slug, status });
    const created = await createAirtableBlogPost({
      Status: status,
      Slug: slug,
      Title: generatedPost.title,
      Description: generatedPost.description,
      Category: generatedPost.category,
      Date: today,
      "Read Time": generatedPost.readTime,
      Intro: generatedPost.intro,
      "Sections JSON": JSON.stringify(generatedPost.sections),
      Takeaway: generatedPost.takeaway,
      "Source Title": source.title,
      "Source URL": source.url,
      "Source Published At": source.publishedAt,
      "Google Business Post": generatedPost.googleBusinessPost,
      "Social Post": generatedPost.socialPost,
      ...(imageUrl ? { "Image URL": imageUrl, "Image Alt": imageAlt } : {}),
    }, { timeoutMs: CRON_AIRTABLE_READ_TIMEOUT_MS });
    console.info("Blog automation stage: Airtable create completed.", { slug, status });

    if (status === "Published") {
      revalidateTag(AIRTABLE_BLOG_CACHE_TAG, "max");
    }

    return NextResponse.json({
      ok: true,
      status,
      slug,
      source: {
        title: source.title,
        url: source.url,
        publishedAt: source.publishedAt,
      },
      airtableRecordId: created.records?.[0]?.id,
    });
  } catch (error) {
    console.error("Error in GET /api/blog/auto-draft:", error);
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Blog automation failed." },
      { status: 500 },
    );
  }
}
