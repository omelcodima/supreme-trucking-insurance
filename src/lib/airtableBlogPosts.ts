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

const airtableApiKey = process.env.AIRTABLE_API_KEY;
const airtableBaseId = process.env.AIRTABLE_BASE_ID;
const airtableBlogTableName = process.env.AIRTABLE_BLOG_TABLE_NAME;

function airtableUrl(offset?: string) {
  const params = new URLSearchParams({
    pageSize: "100",
  });

  if (process.env.AIRTABLE_BLOG_VIEW_NAME) {
    params.set("view", process.env.AIRTABLE_BLOG_VIEW_NAME);
  }

  if (offset) {
    params.set("offset", offset);
  }

  return `https://api.airtable.com/v0/${airtableBaseId}/${encodeURIComponent(airtableBlogTableName || "")}?${params}`;
}

function hasAirtableConfig() {
  return Boolean(airtableApiKey && airtableBaseId && airtableBlogTableName);
}

function stringField(fields: Record<string, unknown>, name: string) {
  const value = fields[name];
  return typeof value === "string" ? value.trim() : "";
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
    googleBusinessPost: stringField(fields, "Google Business Post") || undefined,
    socialPost: stringField(fields, "Social Post") || undefined,
    intro,
    sections,
    takeaway,
  };
}

export async function listAirtableBlogRecords() {
  if (!hasAirtableConfig()) {
    return [];
  }

  const records: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const response = await fetch(airtableUrl(offset), {
      headers: {
        Authorization: `Bearer ${airtableApiKey}`,
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.error("Airtable blog fetch failed:", response.status, await response.text());
      return records;
    }

    const data = (await response.json()) as AirtableListResponse;
    records.push(...(data.records || []));
    offset = data.offset;
  } while (offset);

  return records;
}

export async function getPublishedAirtableBlogPosts() {
  const records = await listAirtableBlogRecords();

  return records
    .filter((record) => stringField(record.fields, "Status").toLowerCase() === "published")
    .map(recordToBlogPost)
    .filter((post): post is BlogPost => Boolean(post))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function createAirtableBlogPost(fields: Record<string, string>) {
  if (!hasAirtableConfig()) {
    throw new Error("Airtable blog configuration is missing.");
  }

  const response = await fetch(
    `https://api.airtable.com/v0/${airtableBaseId}/${encodeURIComponent(airtableBlogTableName || "")}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${airtableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [{ fields }],
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Airtable blog create failed: ${response.status} ${await response.text()}`);
  }

  return (await response.json()) as AirtableCreateResponse;
}
