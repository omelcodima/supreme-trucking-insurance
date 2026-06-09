import type { Metadata } from "next";
import Link from "next/link";
import { BlogVisual } from "@/components/BlogVisual";
import { getAllBlogPosts } from "@/lib/allBlogPosts";
import { absoluteUrl, breadcrumbJsonLd, defaultOgImage, jsonLdScript, siteName } from "@/lib/seo";
import { getPostImageAlt, getPostTags } from "@/lib/blogSeo";

export const revalidate = 300;

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

export default async function BlogIndexPage() {
  const blogPosts = await getAllBlogPosts();

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Trucking Insurance Guides",
    itemListElement: blogPosts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: post.title,
      url: absoluteUrl(`/blog/${post.slug}`),
    })),
  };
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(itemListJsonLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbs)} />
      <section className="section-shell warm-divider">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <span className="eyebrow mb-5">Trucking insurance guides</span>
          <h1 className="max-w-4xl text-4xl font-black leading-tight text-[#2F261C] md:text-6xl">
            Practical answers before you shop trucking insurance.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#5A4B3B] md:text-xl md:leading-9">
            Simple guides for owner-operators, fleets, new authorities, cargo coverage, and commercial truck insurance pricing.
          </p>
        </div>
      </section>

      <section className="section-soft py-14 md:py-18">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-5 md:grid-cols-2">
            {blogPosts.map((post) => {
              const postTags = getPostTags(post).slice(0, 3);

              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="card-premium group overflow-hidden rounded-[1.5rem] p-3 transition-all hover:-translate-y-1 hover:border-[#f97316]/35"
                >
                <BlogVisual
                  title={post.title}
                  category={post.category}
                  sourceName={post.sourceTitle}
                  imageAltText={getPostImageAlt(post)}
                />
                <div className="p-3 pt-5">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f97316]">
                    {post.category} • {post.readTime}
                  </p>
                  <h2 className="mt-3 text-2xl font-black leading-tight text-[#2F261C]">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[#5A4B3B]">{post.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {postTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#F7F3EC] px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.12em] text-[#7B6B59]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="mt-5 inline-flex text-sm font-black text-[#2F261C] transition-colors group-hover:text-[#f97316]">
                    Read guide →
                  </span>
                </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
