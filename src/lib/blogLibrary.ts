export type ArticleSummary = {
  title: string;
  description: string;
  category: string;
  kind: "guides" | "news";
};
export const ARTICLES_PER_PAGE = 9;

export type ArticleFilters = {
  q?: string;
  category?: string;
  type?: string;
  page?: string;
};

export function articleLibraryHref(filters: ArticleFilters) {
  const search = new URLSearchParams();
  const query = filters.q?.trim().slice(0, 200);
  if (query) search.set("q", query);
  if (filters.category) search.set("category", filters.category);
  if (filters.type === "news" || filters.type === "guides") {
    search.set("type", filters.type);
  }
  const page = Number(filters.page);
  if (Number.isFinite(page) && page >= 2) search.set("page", String(Math.floor(page)));
  return search.size ? `/blog?${search}` : "/blog";
}

export function articleListingSeo(filters: ArticleFilters, currentPage: number) {
  const type = filters.type === "news" || filters.type === "guides" ? filters.type : "";
  const label = filters.q?.trim()
    ? "Article Search"
    : filters.category
      ? "Trucking Articles by Topic"
      : filters.type === "news"
        ? "Trucking News"
        : filters.type === "guides"
          ? "Trucking Insurance Guides"
          : "Trucking Insurance Blog";
  const pageLabel = currentPage > 1 ? ` | Page ${currentPage}` : "";
  const descriptions: Record<string, string> = {
    news: "Trucking news and FMCSA updates for owner-operators and fleets. Read Supreme's coverage of industry developments and insurance considerations.",
    guides: "Practical trucking insurance guides for owner-operators, fleets, and new authorities. Explore coverage, pricing, filings, and renewal preparation.",
  };
  const description = filters.q?.trim() || filters.category
    ? "Browse Supreme's trucking articles by topic or search. Find coverage guides, industry news, and practical insurance information."
    : descriptions[type] || "Trucking insurance guides and industry news from Supreme. Explore coverage, costs, FMCSA updates, and practical tips for owner-operators and fleets.";
  return {
    title: `${label}${pageLabel} | Supreme`,
    description: currentPage > 1 ? `Page ${currentPage}: ${description}` : description,
    canonical: articleLibraryHref({ ...filters, page: String(currentPage) }),
    // Curated news/guides archives are indexable; arbitrary search combinations are not.
    robots: { index: !filters.q?.trim() && !filters.category, follow: true },
  };
}

export function selectArticles<T extends ArticleSummary>(
  posts: T[],
  filters: ArticleFilters,
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
