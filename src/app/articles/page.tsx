import type { Metadata } from "next";
import Link from "next/link";
import { getAllBlogPosts } from "@/lib/allBlogPosts";
import { absoluteUrl, breadcrumbJsonLd, defaultOgImage, jsonLdScript, siteName } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Articles & Insights | Supreme Trucking Insurance",
  description:
    "Commercial trucking insurance articles for owner-operators, fleets, new authorities, cargo, DOT compliance, and insurance planning.",
  alternates: {
    canonical: "/articles",
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/articles"),
    siteName,
    title: "Commercial Trucking Insurance Articles & Insights",
    description:
      "Simple commercial trucking insurance articles for owner-operators, fleets, new authorities, cargo, DOT compliance, and insurance planning.",
    images: [{ url: defaultOgImage, width: 1200, height: 630, alt: siteName }],
  },
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export default async function ArticlesPage() {
  const posts = await getAllBlogPosts();
  const [featuredPost, ...otherPosts] = posts;
  const categories = Array.from(new Set(posts.map((post) => post.category))).slice(0, 8);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Commercial Trucking Insurance Articles",
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: post.title,
      url: absoluteUrl(`/blog/${post.slug}`),
    })),
  };
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Articles & Insights", path: "/articles" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(itemListJsonLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbs)} />

      <section className="section-shell warm-divider">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <span className="eyebrow mb-5">Articles & insights</span>
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-4xl font-black leading-tight text-[#2F261C] md:text-6xl">
                Clear trucking insurance answers before you shop.
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-[#5A4B3B] md:text-xl md:leading-9">
                Practical articles for owner-operators, fleets, new authorities, cargo coverage,
                DOT questions, filings, and commercial truck insurance planning.
              </p>
            </div>

            <div className="card-muted rounded-[1.5rem] p-6">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#7B6B59]">
                Browse by topic
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <span
                    key={category}
                    className="rounded-full border border-[#DED3C4] bg-[#FFFDF9] px-3 py-2 text-xs font-black text-[#5A4B3B]"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-soft py-14 md:py-18">
        <div className="mx-auto max-w-6xl px-4">
          {featuredPost ? (
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="card-premium group grid overflow-hidden rounded-[1.6rem] transition-all hover:-translate-y-1 hover:border-[#f97316]/35 lg:grid-cols-[0.82fr_1.18fr]"
            >
              <div className="flex min-h-64 flex-col justify-between bg-[#2F261C] p-7 text-white md:p-9">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-200">
                    Featured article
                  </p>
                  <div className="mt-8 inline-flex rounded-full bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-white/85">
                    {featuredPost.category}
                  </div>
                </div>
                <p className="mt-10 text-sm font-bold text-white/75">
                  {formatDate(featuredPost.date)} • {featuredPost.readTime}
                </p>
              </div>
              <div className="p-7 md:p-9">
                <h2 className="text-3xl font-black leading-tight text-[#2F261C] md:text-4xl">
                  {featuredPost.title}
                </h2>
                <p className="mt-4 text-base leading-8 text-[#5A4B3B]">
                  {featuredPost.description}
                </p>
                <span className="mt-7 inline-flex text-sm font-black text-[#2F261C] transition-colors group-hover:text-[#f97316]">
                  Read article →
                </span>
              </div>
            </Link>
          ) : null}

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {otherPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="card-premium group flex min-h-72 flex-col rounded-[1.35rem] p-6 transition-all hover:-translate-y-1 hover:border-[#f97316]/35"
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <span className="rounded-full border border-[#DED3C4] bg-[#FFFDF9] px-3 py-2 text-xs font-black text-[#f97316]">
                    {post.category}
                  </span>
                  <span className="text-xs font-bold text-[#7B6B59]">{post.readTime}</span>
                </div>
                <h2 className="text-2xl font-black leading-tight text-[#2F261C]">
                  {post.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-[#5A4B3B]">
                  {post.description}
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-[#E7DED2] pt-4">
                  <span className="text-xs font-bold text-[#7B6B59]">{formatDate(post.date)}</span>
                  <span className="text-sm font-black text-[#2F261C] transition-colors group-hover:text-[#f97316]">
                    Read →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 rounded-[1.6rem] bg-[#f97316] px-6 py-8 text-center text-white md:px-10">
            <h2 className="text-3xl font-black md:text-4xl">Need an answer for your operation?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-white/90">
              Start with a quick DOT-based indication or send a quote request and we will review
              the file around your trucks, cargo, drivers, radius, and filings.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/instant-indication"
                className="rounded-xl bg-white px-7 py-4 text-base font-black text-[#2F261C] transition-colors hover:bg-[#FFF7ED]"
              >
                Instant indication
              </Link>
              <Link
                href="/quote"
                className="rounded-xl border border-white/55 px-7 py-4 text-base font-black text-white transition-colors hover:bg-white/10"
              >
                Get a Free Quote
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
