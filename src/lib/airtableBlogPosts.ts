import type { BlogPost } from "@/lib/blogPosts";

type AirtableRecord = {
  id: string;
  fields: Record<string, unknown>;
};

type AirtableListResponse = {
  records?: AirtableRecord[];
  offset?: string;
};

type AirtableCreateResponse = {
  records?: AirtableRecord[];
};

type AirtableEnvironment = {
  AIRTABLE_API_KEY?: string;
  AIRTABLE_BASE_ID?: string;
  AIRTABLE_BLOG_TABLE_NAME?: string;
  AIRTABLE_BLOG_VIEW_NAME?: string;
};

type AirtableFetchOptions = {
  cache?: RequestCache;
  revalidate?: number;
  timeoutMs?: number;
  environment?: AirtableEnvironment;
  fetch?: typeof globalThis.fetch;
};

type AirtableCreateOptions = {
  timeoutMs?: number;
  environment?: AirtableEnvironment;
  fetch?: typeof globalThis.fetch;
};

type AirtableConfig = {
  apiKey: string;
  baseId: string;
  tableName: string;
  viewName?: string;
};

export const AIRTABLE_BLOG_CACHE_SECONDS = 21_600;
export const AIRTABLE_BLOG_CACHE_TAG = "airtable-blog-posts";
export const AIRTABLE_BLOG_REQUEST_TIMEOUT_MS = 5_000;
export const AIRTABLE_RATE_LIMIT_RETRY_MS = 30_000;

export class AirtableBlogFetchError extends Error {
  readonly status: number;
  readonly retryAfterMs?: number;

  constructor(status: number, retryAfterMs?: number) {
    super(`Airtable blog request failed with status ${status}.`);
    this.name = "AirtableBlogFetchError";
    this.status = status;
    this.retryAfterMs = retryAfterMs;
  }
}

type AirtableReadRetryOptions = {
  maxAttempts?: number;
  timeoutRetryDelayMs?: number;
  rateLimitRetryDelayMs?: number;
  sleep?: (delayMs: number) => Promise<void>;
  onRetry?: (event: {
    attempt: number;
    delayMs: number;
    reason: "timeout" | "rate-limit";
  }) => void;
};

function retryAfterMilliseconds(value: string | null) {
  if (!value) {
    return undefined;
  }

  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return Math.ceil(seconds * 1_000);
  }

  const retryAt = Date.parse(value);
  return Number.isNaN(retryAt) ? undefined : Math.max(0, retryAt - Date.now());
}

export async function retryAirtableRead<T>(
  operation: () => Promise<T>,
  options: AirtableReadRetryOptions = {},
): Promise<T> {
  const maxAttempts = Math.max(1, Math.floor(options.maxAttempts ?? 2));
  const sleep = options.sleep ?? ((delayMs: number) => new Promise((resolve) => setTimeout(resolve, delayMs)));

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      const timedOut = error instanceof Error && error.name === "TimeoutError";
      const rateLimited = error instanceof AirtableBlogFetchError && error.status === 429;

      if (attempt === maxAttempts || (!timedOut && !rateLimited)) {
        throw error;
      }

      const reason = rateLimited ? "rate-limit" : "timeout";
      const delayMs = rateLimited
        ? error.retryAfterMs ?? options.rateLimitRetryDelayMs ?? AIRTABLE_RATE_LIMIT_RETRY_MS
        : options.timeoutRetryDelayMs ?? 1_000;

      options.onRetry?.({ attempt, delayMs, reason });
      await sleep(delayMs);
    }
  }

  throw new Error("Airtable read retry loop ended unexpectedly.");
}

function getAirtableConfig(environment?: AirtableEnvironment): AirtableConfig | null {
  const source = environment ?? {
    AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY,
    AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID,
    AIRTABLE_BLOG_TABLE_NAME: process.env.AIRTABLE_BLOG_TABLE_NAME,
    AIRTABLE_BLOG_VIEW_NAME: process.env.AIRTABLE_BLOG_VIEW_NAME,
  };
  const apiKey = source.AIRTABLE_API_KEY?.trim();
  const baseId = source.AIRTABLE_BASE_ID?.trim();
  const tableName = source.AIRTABLE_BLOG_TABLE_NAME?.trim();

  if (!apiKey || !baseId || !tableName) {
    return null;
  }

  return {
    apiKey,
    baseId,
    tableName,
    viewName: source.AIRTABLE_BLOG_VIEW_NAME?.trim() || undefined,
  };
}

function airtableUrl(config: AirtableConfig, offset?: string) {
  const params = new URLSearchParams({
    pageSize: "100",
  });

  if (config.viewName) {
    params.set("view", config.viewName);
  }

  if (offset) {
    params.set("offset", offset);
  }

  return `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableName)}?${params}`;
}

function airtableFetchInit(config: AirtableConfig, options: AirtableFetchOptions = {}) {
  const init: RequestInit & {
    next?: { revalidate: number; tags: string[] };
  } = {
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
    },
    signal: AbortSignal.timeout(options.timeoutMs ?? AIRTABLE_BLOG_REQUEST_TIMEOUT_MS),
  };

  if (options.cache) {
    init.cache = options.cache;
  } else {
    init.next = {
      revalidate: options.revalidate ?? AIRTABLE_BLOG_CACHE_SECONDS,
      tags: [AIRTABLE_BLOG_CACHE_TAG],
    };
  }

  return init;
}

function stringField(fields: Record<string, unknown>, name: string) {
  const value = fields[name];
  return typeof value === "string" ? value.trim() : "";
}

function stringListField(fields: Record<string, unknown>, name: string) {
  const value = fields[name];
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function parseSections(fields: Record<string, unknown>): BlogPost["sections"] {
  const rawSections = stringField(fields, "Sections JSON");

  if (rawSections) {
    try {
      const parsed = JSON.parse(rawSections) as {
        heading?: unknown;
        body?: unknown;
      }[];

      if (Array.isArray(parsed)) {
        const sections = parsed
          .map((section) => {
            const heading = typeof section?.heading === "string" ? section.heading.trim() : "";
            const body = Array.isArray(section?.body)
              ? section.body.filter((paragraph): paragraph is string => typeof paragraph === "string")
              : typeof section?.body === "string"
                ? section.body
                    .split(/\n{2,}/)
                    .map((paragraph) => paragraph.trim())
                    .filter(Boolean)
                : [];

            return { heading, body };
          })
          .filter((section) => section.heading && section.body.length);

        if (sections.length > 0) {
          return sections;
        }
      }
    } catch {
      // Fall back to section fields below.
    }
  }

  return [1, 2, 3]
    .map((number) => ({
      heading: stringField(fields, `Section ${number} Heading`),
      body: stringField(fields, `Section ${number} Body`)
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean),
    }))
    .filter((section) => section.heading && section.body.length);
}

function recordToBlogPost(record: AirtableRecord): BlogPost | null {
  const { fields } = record;
  const slug = stringField(fields, "Slug");
  const title = stringField(fields, "Title");
  const intro = stringField(fields, "Intro");
  const sections = parseSections(fields);
  const takeaway = stringField(fields, "Takeaway");

  if (!slug || !title || !intro || sections.length === 0 || !takeaway) {
    return null;
  }

  return {
    slug,
    title,
    description: stringField(fields, "Description") || intro,
    category: stringField(fields, "Category") || "Trucking News",
    date: stringField(fields, "Date") || new Date().toISOString().slice(0, 10),
    readTime: stringField(fields, "Read Time") || "4 min read",
    sourceTitle: stringField(fields, "Source Title") || undefined,
    sourceUrl: stringField(fields, "Source URL") || undefined,
    sourcePublishedAt: stringField(fields, "Source Published At") || undefined,
    tags: stringListField(fields, "Tags"),
    imageUrl: stringField(fields, "Image URL") || undefined,
    imageAltText: stringField(fields, "Image Alt") || stringField(fields, "Image Alt Text") || undefined,
    imageLabel: stringField(fields, "Image Label") || undefined,
    imageCue: stringField(fields, "Image Cue") || undefined,
    googleBusinessPost: stringField(fields, "Google Business Post") || undefined,
    socialPost: stringField(fields, "Social Post") || undefined,
    intro,
    sections,
    takeaway,
  };
}

export async function listAirtableBlogRecords(options: AirtableFetchOptions = {}) {
  const config = getAirtableConfig(options.environment);
  if (!config) {
    return [];
  }

  const fetchImplementation = options.fetch ?? globalThis.fetch;
  const records: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const response = await fetchImplementation(
      airtableUrl(config, offset),
      airtableFetchInit(config, options),
    );

    if (!response.ok) {
      await response.body?.cancel().catch(() => undefined);
      throw new AirtableBlogFetchError(
        response.status,
        retryAfterMilliseconds(response.headers.get("retry-after")),
      );
    }

    const data = (await response.json()) as AirtableListResponse;
    records.push(...(data.records || []));
    offset = data.offset;
  } while (offset);

  return records;
}

export async function getPublishedAirtableBlogPosts(options: AirtableFetchOptions = {}) {
  const records = await listAirtableBlogRecords(options);

  return records
    .filter((record) => stringField(record.fields, "Status").toLowerCase() === "published")
    .map(recordToBlogPost)
    .filter((post): post is BlogPost => Boolean(post))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function createAirtableBlogPost(
  fields: Record<string, string>,
  options: AirtableCreateOptions = {},
) {
  const config = getAirtableConfig(options.environment);
  if (!config) {
    throw new Error("Airtable blog configuration is missing.");
  }

  const response = await (options.fetch ?? globalThis.fetch)(
    `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableName)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(options.timeoutMs ?? AIRTABLE_BLOG_REQUEST_TIMEOUT_MS),
      body: JSON.stringify({
        records: [{ fields }],
      }),
    },
  );

  if (!response.ok) {
    await response.body?.cancel().catch(() => undefined);
    throw new AirtableBlogFetchError(
      response.status,
      retryAfterMilliseconds(response.headers.get("retry-after")),
    );
  }

  return (await response.json()) as AirtableCreateResponse;
}
