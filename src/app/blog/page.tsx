import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Supreme Trucking Insurance",
  description: "Latest news and insights from Supreme Trucking Insurance.",
};

export default function BlogIndexPage() {
  return (
    <main className="bg-[#FAF7F2] text-[#2F261C]">
      <section className="bg-[#F7F3EC] border-b border-[#E7DED2]">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.24em] text-[#7B6B59] mb-4">Insights</p>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-5">Our Blog</h1>
            <p className="text-lg text-[#5A4B3B] leading-8">
              Stay up-to-date with the latest in trucking insurance, industry news, and tips for owner-operators and fleets.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6">
          {/* Placeholder for blog post list */}
          <div className="space-y-8">
            <p className="text-center text-[#7B6B59]">No blog posts yet. Check back soon!</p>
            {/* Example blog post card (commented out)
            <div className="card-premium rounded-[1.5rem] p-6 flex flex-col md:flex-row md:items-center gap-6">
              <div className="md:w-1/3 relative h-48 rounded-lg overflow-hidden">
                <img src="/images/blog-placeholder.jpg" alt="Blog post image" className="object-cover w-full h-full" />
              </div>
              <div className="md:w-2/3">
                <p className="text-sm uppercase tracking-[0.16em] text-[#7B6B59] mb-2">Category | Date</p>
                <h2 className="text-2xl font-bold text-[#2F261C] mb-3"><Link href="/blog/post-slug" className="hover:underline">Blog Post Title</Link></h2>
                <p className="text-[#5A4B3B] leading-relaxed text-sm mb-4">Short description of the blog post content...</p>
                <Link href="/blog/post-slug" className="text-[#f97316] font-bold hover:underline">
                  Read more →
                </Link>
              </div>
            </div>
            */}
          </div>
        </div>
      </section>
    </main>
  );
}
