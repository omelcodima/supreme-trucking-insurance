import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blogPosts";

export const metadata: Metadata = {
  title: "Trucking Insurance Blog | Supreme Trucking Insurance",
  description:
    "Practical trucking insurance guides for owner-operators, fleets, new authorities, cargo coverage, and commercial truck insurance pricing.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogIndexPage() {
  return (
    <>
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
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="card-premium rounded-[1.5rem] p-6 transition-all hover:-translate-y-1 hover:border-[#f97316]/35"
              >
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f97316]">
                  {post.category} • {post.readTime}
                </p>
                <h2 className="mt-3 text-2xl font-black leading-tight text-[#2F261C]">
                  {post.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#5A4B3B]">{post.description}</p>
                <span className="mt-5 inline-flex text-sm font-black text-[#2F261C] transition-colors group-hover:text-[#f97316]">
                  Read guide →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
