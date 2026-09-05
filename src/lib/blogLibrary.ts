export type ArticleSummary = {
  title: string;
  description: string;
  category: string;
  kind: "guides" | "news";
};
export const ARTICLES_PER_PAGE = 9;

export function selectArticles<T extends ArticleSummary>(
  posts: T[],
  filters: { q?: string; category?: string; type?: string; page?: string },
) {
  const terms = (filters.q || "")
    .normalize("NFKC")
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const filtered = posts.filter((post) => {
    if (filters.type === "guides" || filters.type === "news") {
      if (post.kind !== filters.type) return false;
    }
    if (filters.category && post.category !== filters.category) return false;
    const text = `${post.title} ${post.description} ${post.category}`
      .normalize("NFKC")
      .toLowerCase();
    return terms.every((term) => text.includes(term));
  });
  const pageCount = Math.max(1, Math.ceil(filtered.length / ARTICLES_PER_PAGE));
  const requested = Number(filters.page);
  const page = Math.min(
    pageCount,
    Math.max(1, Number.isFinite(requested) ? Math.floor(requested) : 1),
  );
  return {
    posts: filtered.slice(
      (page - 1) * ARTICLES_PER_PAGE,
      page * ARTICLES_PER_PAGE,
    ),
    total: filtered.length,
    page,
    pageCount,
  };
}
