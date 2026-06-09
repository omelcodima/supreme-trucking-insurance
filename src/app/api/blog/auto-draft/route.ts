import { NextResponse } from "next/server";
import {
  createAirtableBlogPost,
  listAirtableBlogRecords,
} from "@/lib/airtableBlogPosts";

export const maxDuration = 60;

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
};

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
  const jsonText = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  const parsed = JSON.parse(jsonText) as GeneratedPost;

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
    readTime: parsed.readTime || "4 min read",
    googleBusinessPost: parsed.googleBusinessPost || "",
    socialPost: parsed.socialPost || "",
  };
}

async function generatePost(source: SourceItem): Promise<GeneratedPost> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing.");
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
      instructions:
        "You create original trucking insurance news posts for Supreme Trucking Insurance. The post must sound like it was written by a practical trucking insurance agency, not a generic AI writer and not a copied news article. Do not copy sentences from the source. Do not invent legal requirements, prices, guarantees, same-day promises, or coverage promises. Avoid fake urgency and heavy marketing. Keep it useful for owner-operators, fleets, dispatchers, new authorities, and trucking companies. Connect the news to trucking insurance only where the connection is reasonable: underwriting, filings, safety history, cargo, drivers, inspections, claims, renewals, or carrier appetite. Always include that the post is informational and final coverage depends on underwriting, filings, drivers, cargo, state, and carrier appetite.",
      input: `Create one original SEO blog/news post from this source. Return only valid JSON with these keys: slug, title, description, category, readTime, intro, sections, takeaway, googleBusinessPost, socialPost. sections must be an array of exactly 3 objects with heading and body. body must have 2 short paragraphs. Write in Supreme Trucking Insurance's voice: simple, modern, practical, low-noise, no fake claims. The article should summarize what happened, why trucking companies should care, and what insurance-related documents or questions they should prepare. Avoid quoting the source and do not present copied reporting as our own reporting. Source title: ${source.title}\nSource URL: ${source.url}\nSource published: ${source.publishedAt}\nSource summary: ${source.summary}`,
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

    const existingRecords = await listAirtableBlogRecords();
    const existingSourceUrls = new Set(
      existingRecords.map((record) => stringField(record.fields, "Source URL")).filter(Boolean),
    );
    const existingSlugs = new Set(
      existingRecords.map((record) => stringField(record.fields, "Slug")).filter(Boolean),
    );

    const candidates = [...(await getFederalRegisterItems()), ...(await getRssItems())]
      .filter((item) => !existingSourceUrls.has(item.url))
      .sort((a, b) => sourceScore(b) - sourceScore(a));

    const source = candidates.find((item) => sourceScore(item) > 0) || candidates[0];

    if (!source) {
      return NextResponse.json({ ok: true, message: "No new trucking source items found." });
    }

    const generatedPost = await generatePost(source);
    let slug = generatedPost.slug;
    let suffix = 2;
    while (existingSlugs.has(slug)) {
      slug = `${generatedPost.slug}-${suffix}`;
      suffix += 1;
    }

    const status = process.env.BLOG_AUTO_PUBLISH === "true" ? "Published" : "Draft";
    const today = new Date().toISOString().slice(0, 10);
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
    });

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
