import type { Metadata } from "next";
import Link from "next/link";

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
    <main className="section-shell text-[#2F261C] min-h-screen">
      <section className="section-soft border-b border-[#E7DED2]">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
          <span className="eyebrow mb-5">Blog</span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">Trucking insurance insights that stay practical.</h1>
          <p className="max-w-3xl text-lg md:text-xl text-[#5A4B3B] leading-relaxed">
            Articles, guides, and practical answers for owner operators, small fleets, and new authority businesses.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <article key={post.title} className="card-premium rounded-[1.75rem] p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-[#7B6B59] mb-3">Coming Soon</p>
              <h2 className="text-2xl font-black tracking-tight mb-3">{post.title}</h2>
              <p className="text-[#5A4B3B] leading-7">{post.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-soft py-14 md:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-[#2F261C]">Need a quote instead of another article?</h2>
          <p className="mt-4 text-lg text-[#5A4B3B]">Call now or send a quote request. Fast answers beat guesswork.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote" className="bg-[#f97316] text-white font-bold px-8 py-4 rounded-xl hover:bg-orange-600 transition-colors shadow-lg">
              Get a Free Quote
            </Link>
            <a href="tel:+13609367196" className="border border-[#DED3C4] bg-[#FFFDF9] text-[#2F261C] font-bold px-8 py-4 rounded-xl hover:border-[#f97316] hover:text-[#f97316] transition-colors">
              Call (360) 936-7196
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
