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
