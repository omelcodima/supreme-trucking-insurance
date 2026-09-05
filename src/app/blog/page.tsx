import type { Metadata } from "next";
import Link from "next/link";
import { BlogVisual } from "@/components/BlogVisual";
import { getAllBlogPosts } from "@/lib/allBlogPosts";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  defaultOgImage,
  jsonLdScript,
  siteName,
} from "@/lib/seo";
import { getPostImageAlt } from "@/lib/blogSeo";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { blogPosts as guides } from "@/lib/blogPosts";
import { selectArticles } from "@/lib/blogLibrary";

export const revalidate = 21600;

export const metadata: Metadata = {
  title: "Trucking Insurance Blog | Supreme Trucking Insurance",
  description:
    "Practical trucking insurance guides for owner-operators, fleets, new authorities, cargo coverage, and commercial truck insurance pricing.",
  keywords: [
    "trucking insurance",
    "commercial truck insurance",
    "FMCSA updates",
    "owner-operator insurance",
    "fleet insurance",
    "cargo insurance",
    "new authority insurance",
  ],
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/blog"),
    siteName,
    title: "Trucking Insurance Blog",
    description:
      "Practical trucking insurance guides for owner-operators, fleets, new authorities, cargo coverage, and pricing.",
    images: [{ url: defaultOgImage, width: 1200, height: 630, alt: siteName }],
  },
};

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const value = (key: string) =>
    typeof params[key] === "string" ? (params[key] as string) : "";
  const filters = {
    q: value("q").slice(0, 200),
    category: value("category"),
    type: value("type"),
    page: value("page"),
  };
  const guideSlugs = new Set(guides.map((p) => p.slug));
  const allPosts = (await getAllBlogPosts()).map((post) => ({
    ...post,
    kind: guideSlugs.has(post.slug) ? ("guides" as const) : ("news" as const),
  }));
  const categories = [...new Set(allPosts.map((post) => post.category))].sort();
  const result = selectArticles(allPosts, filters);
  function href(changes: Partial<typeof filters>) {
    const search = new URLSearchParams();
    Object.entries({ ...filters, ...changes }).forEach(([key, val]) => {
      if (val && !(key === "page" && val === "1")) search.set(key, val);
    });
    return search.size ? `/blog?${search}` : "/blog";
  }
  const list = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Trucking insurance guides and news",
    itemListElement: result.posts.map((post, index) => ({
      "@type": "ListItem",
      position: (result.page - 1) * 9 + index + 1,
      name: post.title,
      url: absoluteUrl(`/blog/${post.slug}`),
    })),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(list)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
        )}
      />
      <section className="site-section blog-heading">
        <div className="site-container">
          <p className="section-kicker">Supreme resources</p>
          <h1 className="section-heading">Trucking insurance guides & news.</h1>
          <p className="section-description">
            Practical coverage advice and trucking updates, without the jargon.
          </p>
        </div>
      </section>
      <section className="blog-library">
        <div className="site-container">
          <form
            action="/blog"
            method="get"
            className="blog-filters"
            role="search"
            aria-label="Search articles"
          >
            <div className="blog-search">
              <label className="sr-only" htmlFor="article-search">
                Search articles
              </label>
              <Search size={18} aria-hidden="true" />
              <input
                id="article-search"
                className="filter-input"
                type="search"
                name="q"
                defaultValue={filters.q}
                placeholder="Search articles"
                maxLength={200}
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="article-category">
                Topic
              </label>
              <select
                id="article-category"
                className="filter-input"
                name="category"
                defaultValue={filters.category}
              >
                <option value="">All topics</option>
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            {filters.type && (
              <input type="hidden" name="type" value={filters.type} />
            )}
            <button className="button-primary" type="submit">
              <Search size={17} aria-hidden="true" />
              Search
            </button>
          </form>
          <div className="blog-toolbar">
            <nav aria-label="Article type" className="article-types">
              {[
                ["", "All articles"],
                ["guides", "Insurance guides"],
                ["news", "Trucking news"],
              ].map(([type, label]) => (
                <Link
                  key={type}
                  href={href({ type, page: "1" })}
                  aria-current={
                    filters.type === type ||
                    (!["guides", "news"].includes(filters.type) && type === "")
                      ? "page"
                      : undefined
                  }
                >
                  {label}
                </Link>
              ))}
            </nav>
            <p>{result.total} articles</p>
          </div>
          {result.total ? (
            <div className="blog-grid">
              {result.posts.map((post) => (
                <article key={post.slug} className="blog-card">
                  <Link href={`/blog/${post.slug}`}>
                    <BlogVisual
                      title={post.title}
                      category={post.category}
                      sourceName={post.sourceTitle}
                      imageUrl={post.imageUrl}
                      imageAltText={getPostImageAlt(post)}
                    />
                    <div className="blog-card-copy">
                      <p className="blog-meta">
                        {post.category}
                        <span>{post.readTime}</span>
                      </p>
                      <h2>{post.title}</h2>
                      <p className="blog-description">{post.description}</p>
                      <span className="text-link">
                        Read article
                        <ArrowRight size={15} aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="blog-empty">
              <h2>No articles found</h2>
              <Link href="/blog" className="text-link">
                Clear filters
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          )}
          {result.pageCount > 1 && (
            <nav className="blog-pagination" aria-label="Article pages">
              {result.page > 1 ? (
                <Link
                  href={href({ page: String(result.page - 1) })}
                  className="button-secondary"
                >
                  <ArrowLeft size={16} aria-hidden="true" />
                  Previous
                </Link>
              ) : (
                <span />
              )}
              <div>
                {Array.from({ length: result.pageCount }, (_, i) => i + 1).map(
                  (page) => (
                    <Link
                      key={page}
                      href={href({ page: String(page) })}
                      aria-label={`Page ${page}`}
                      aria-current={page === result.page ? "page" : undefined}
                    >
                      {page}
                    </Link>
                  ),
                )}
              </div>
              {result.page < result.pageCount ? (
                <Link
                  href={href({ page: String(result.page + 1) })}
                  className="button-secondary"
                >
                  Next
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
