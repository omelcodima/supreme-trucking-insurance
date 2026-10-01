export function normalizeGeneratedBlogParagraph(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/\\([*_`])/g, "$1")
    .replace(/\*\*([\s\S]*?)\*\*/g, "$1")
    .replace(/__([\s\S]*?)__/g, "$1")
    .replace(/`([^`\n]+)`/g, "$1")
    .trim();
}

function splitGeneratedBlogParagraphs(value: string): string[] {
  return value
    .replace(/\\r\\n|\\n|\\r/g, "\n")
    .split(/\r?\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function normalizeGeneratedBlogSectionBody(value: unknown): string[] {
  const paragraphs = (Array.isArray(value) ? value : [value]).flatMap((paragraph) =>
    typeof paragraph === "string" ? splitGeneratedBlogParagraphs(paragraph) : [],
  );

  return paragraphs.map(normalizeGeneratedBlogParagraph).filter(Boolean);
}
