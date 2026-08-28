const BLOG_TOPIC_STOP_WORDS = new Set([
  "a",
  "about",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "business",
  "businesses",
  "carrier",
  "carriers",
  "company",
  "companies",
  "compliance",
  "driver",
  "drivers",
  "fleet",
  "fleets",
  "fmcsa",
  "for",
  "from",
  "guide",
  "how",
  "in",
  "insurance",
  "is",
  "it",
  "matter",
  "matters",
  "new",
  "news",
  "of",
  "on",
  "operation",
  "operations",
  "our",
  "push",
  "safety",
  "that",
  "the",
  "their",
  "this",
  "to",
  "truck",
  "trucker",
  "truckers",
  "trucking",
  "update",
  "updates",
  "what",
  "why",
  "with",
  "your",
]);

function normalizeTopicToken(token: string): string {
  if (token.length > 4 && token.endsWith("ies")) {
    return `${token.slice(0, -3)}y`;
  }
  if (token.length > 4 && token.endsWith("s") && !token.endsWith("ss")) {
    return token.slice(0, -1);
  }
  return token;
}

export function blogTopicTokens(value: string): string[] {
  const normalized = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .match(/[a-z0-9]+/g) || [];

  return [
    ...new Set(
      normalized
        .map(normalizeTopicToken)
        .filter((token) => token.length > 2 && !BLOG_TOPIC_STOP_WORDS.has(token)),
    ),
  ];
}

export type BlogTopicSimilarity = {
  overlap: number;
  containment: number;
  jaccard: number;
};

export function compareBlogTopics(candidate: string, existing: string): BlogTopicSimilarity {
  const candidateTokens = new Set(blogTopicTokens(candidate));
  const existingTokens = new Set(blogTopicTokens(existing));
  const overlap = [...candidateTokens].filter((token) => existingTokens.has(token)).length;
  const smallerSize = Math.min(candidateTokens.size, existingTokens.size);
  const unionSize = new Set([...candidateTokens, ...existingTokens]).size;

  return {
    overlap,
    containment: smallerSize > 0 ? overlap / smallerSize : 0,
    jaccard: unionSize > 0 ? overlap / unionSize : 0,
  };
}

export function findNearDuplicateBlogTopic(
  candidate: string,
  existingTitles: string[],
): { existingTitle: string; similarity: BlogTopicSimilarity } | null {
  for (const existingTitle of existingTitles) {
    const similarity = compareBlogTopics(candidate, existingTitle);
    if (similarity.overlap >= 2 && similarity.containment >= 0.5) {
      return { existingTitle, similarity };
    }
  }
  return null;
}
