import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Supreme Trucking Insurance",
  description: "Insights, tips, and updates related to trucking insurance.",
};

const posts = [
  {
    title: "How Much Does Owner Operator Insurance Cost?",
    desc: "A practical breakdown of what affects pricing for owner operators and what underwriters usually look at.",
  },
  {
    title: "What Documents Do You Need for a Trucking Insurance Quote?",
    desc: "A quick guide to declarations pages, loss runs, driver lists, vehicle schedules, and other documents that speed up quoting.",
  },
  {
    title: "New Authority Trucking Insurance: What to Expect",
    desc: "What new ventures should know about pricing, underwriting, and getting coverage in place fast.",
  },
];

export default function BlogPage() {
  return (
    <main className="bg-[#FAF7F2] text-[#2F261C] min-h-screen">
      <section className="bg-[#F7F3EC] border-b border-[#E7DED2]">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <p className="text-sm uppercase tracking-[0.24em] text-[#7B6B59] mb-4">Blog</p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">Trucking Insurance Insights</h1>
          <p className="max-w-3xl text-lg text-[#5A4B3B] leading-8">
            Articles, guides, and practical answers for owner operators, small fleets, and new authority businesses.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6 grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <article key={post.title} className="rounded-3xl border border-[#E7DED2] bg-white/80 p-6 shadow-[0_10px_30px_rgba(47,38,28,0.05)]">
              <p className="text-xs uppercase tracking-[0.2em] text-[#7B6B59] mb-3">Coming Soon</p>
              <h2 className="text-2xl font-semibold tracking-tight mb-3">{post.title}</h2>
              <p className="text-[#5A4B3B] leading-7">{post.desc}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
