export type HomepageVariant = "classic" | "cinematic";
export type HomepageDesign = { variant: HomepageVariant; version: number };

export function isHomepageVariant(value: unknown): value is HomepageVariant {
  return value === "classic" || value === "cinematic";
}

export function isDesignChange(value: unknown): value is HomepageDesign {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  return isHomepageVariant(candidate.variant) &&
    Number.isSafeInteger(candidate.version) &&
    (candidate.version as number) >= 0 &&
    (candidate.version as number) < 2147483647;
}
