export const BLOG_SEO_TITLE_MAX_LENGTH = 60;
export const BLOG_META_DESCRIPTION_MAX_LENGTH = 155;

const BLOG_TITLE_SUFFIX = " | Supreme Trucking Insurance";

function normalizeSeoText(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function truncateAtWord(value: string, maxLength: number): string {
  const normalized = normalizeSeoText(value);
  if (normalized.length <= maxLength) return normalized;
  if (maxLength <= 1) return normalized.slice(0, maxLength);

  const cut = normalized.slice(0, maxLength - 1).trimEnd();
  const lastSpace = cut.lastIndexOf(" ");
  const candidate = lastSpace >= Math.floor(maxLength * 0.6)
    ? cut.slice(0, lastSpace)
    : cut;
  return `${candidate.replace(/[,:;\-]+$/g, "")}…`;
}

export function validateGeneratedBlogSeoFields(
  titleValue: unknown,
  descriptionValue: unknown,
): { title: string; description: string } {
  const title = normalizeSeoText(titleValue);
  const description = normalizeSeoText(descriptionValue);

  if (!title) {
    throw new Error("OpenAI response did not include a non-empty SEO title.");
  }
  if (title.length > BLOG_SEO_TITLE_MAX_LENGTH) {
    throw new Error(
      `OpenAI response did not include an SEO title within ${BLOG_SEO_TITLE_MAX_LENGTH} characters.`,
    );
  }
  if (!description) {
    throw new Error("OpenAI response did not include a non-empty meta description.");
  }
  if (description.length > BLOG_META_DESCRIPTION_MAX_LENGTH) {
    throw new Error(
      `OpenAI response did not include a meta description within ${BLOG_META_DESCRIPTION_MAX_LENGTH} characters.`,
    );
  }

  return { title, description };
}

export function buildBlogMetadataTitle(titleValue: unknown): string {
  const title = normalizeSeoText(titleValue);
  const brandedTitle = `${title}${BLOG_TITLE_SUFFIX}`;
  if (brandedTitle.length <= BLOG_SEO_TITLE_MAX_LENGTH) {
    return brandedTitle;
  }
  return truncateAtWord(title, BLOG_SEO_TITLE_MAX_LENGTH);
}

export function clampBlogMetaDescription(descriptionValue: unknown): string {
  return truncateAtWord(
    normalizeSeoText(descriptionValue),
    BLOG_META_DESCRIPTION_MAX_LENGTH,
  );
}
