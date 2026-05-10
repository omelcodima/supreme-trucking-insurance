import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPost } from "@/lib/blogPosts";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {};
  }

  return {
    title: `${post.title} | Supreme Trucking Insurance`,
    description: post.description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: "Supreme Trucking Insurance",
    },
    publisher: {
      "@type": "Organization",
      name: "Supreme Trucking Insurance",
      logo: {
        "@type": "ImageObject",
        url: "https://supremetruckinginsurance.com/logo.png",
      },
    },
    mainEntityOfPage: `https://supremetruckinginsurance.com/blog/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <article className="section-shell warm-divider">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-20">
          <Link
            href="/blog"
            className="mb-8 inline-flex text-sm font-bold text-[#7B6B59] transition-colors hover:text-[#f97316]"
          >
            Back to blog
          </Link>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#f97316]">
            {post.category} • {post.readTime}
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-[#2F261C] md:text-6xl">
            {post.title}
          </h1>
          <p className="mt-6 text-xl leading-9 text-[#5A4B3B]">{post.intro}</p>
        </div>
      </article>

      <section className="section-soft py-14 md:py-18">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[1fr_320px]">
          <div className="card-premium rounded-[1.6rem] p-6 md:p-9">
            <div className="space-y-10">
              {post.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-2xl font-black text-[#2F261C] md:text-3xl">
                    {section.heading}
                  </h2>
                  <div className="mt-4 space-y-4">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="text-base leading-8 text-[#5A4B3B]">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-10 rounded-[1.25rem] border border-[#DED3C4] bg-[#F7F3EC] p-5">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#7B6B59]">
                Takeaway
              </p>
              <p className="mt-3 text-lg font-bold leading-8 text-[#2F261C]">
                {post.takeaway}
              </p>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="card-muted rounded-[1.4rem] p-5">
              <h2 className="text-xl font-black text-[#2F261C]">Start with your DOT number.</h2>
              <p className="mt-3 text-sm leading-6 text-[#5A4B3B]">
                Get a quick non-binding indication first, then continue into the full quote flow.
              </p>
              <Link
                href="/instant-indication"
                className="mt-5 inline-flex w-full justify-center rounded-xl bg-[#f97316] px-5 py-3 text-sm font-black text-white shadow-lg transition-colors hover:bg-orange-600"
              >
                Instant indication
              </Link>
            </div>

            <div className="card-premium rounded-[1.4rem] p-5">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#7B6B59]">
                Related reading
              </p>
              <div className="mt-4 grid gap-3">
                {relatedPosts.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/blog/${item.slug}`}
                    className="rounded-xl border border-[#E7DED2] bg-[#FFFDF9] p-4 transition-colors hover:border-[#f97316]/40"
                  >
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[#f97316]">
                      {item.category}
                    </p>
                    <h3 className="mt-2 text-sm font-black leading-5 text-[#2F261C]">
                      {item.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
