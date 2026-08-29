const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function parseOptionalSlugArg(args: readonly string[]) {
  if (args.length === 0) return "";

  const value = args.length === 1 && args[0] !== "--slug"
    ? args[0]
    : args.length === 2 && args[0] === "--slug"
      ? args[1]
      : "";

  const slug = value?.trim() || "";
  if (!slug || !SAFE_SLUG.test(slug)) {
    throw new Error("Expected an optional safe slug as <slug> or --slug <slug>.");
  }

  return slug;
}