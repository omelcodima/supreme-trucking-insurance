import Link from "next/link";
import { ArrowRight, ClipboardList } from "lucide-react";

type GuideLink = { label: string; href: string };

type Props = {
  title: string;
  sections: { title: string; text: string }[];
  documents: string[];
  related: GuideLink[];
  sources?: GuideLink[];
};

export default function CoverageGuide({ title, sections, documents, related, sources = [] }: Props) {
  return (
    <>
      <section className="site-section border-y border-[#dce3df] bg-white">
        <div className="site-container">
          <h2 className="max-w-3xl text-3xl font-bold text-[#202625]">{title}</h2>
          <div className="mt-8 grid gap-x-12 gap-y-8 md:grid-cols-2">
            {sections.map((section) => (
              <div key={section.title} className="min-w-0 border-t border-[#dce3df] pt-5">
                <h3 className="text-xl font-bold text-[#202625]">{section.title}</h3>
                <p className="mt-3 leading-7 text-[#515c59]">{section.text}</p>
              </div>
            ))}
          </div>
          {sources.length > 0 ? (
            <div className="mt-8 text-sm text-[#515c59]">
              <p className="font-semibold">Further reading</p>
              <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-3">
                {sources.map((source) => (
                  <li key={source.href}><a href={source.href} className="underline underline-offset-4" target="_blank" rel="noopener noreferrer">{source.label}</a></li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>
      <section className="site-section">
        <div className="site-container grid gap-10 md:grid-cols-2">
          <div>
            <ClipboardList className="mb-4 text-[#c94c05]" size={28} aria-hidden="true" />
            <h2 className="text-2xl font-bold">What to have ready for your quote</h2>
            <p className="mt-3 leading-7 text-[#515c59]">Start with what you have. Your agent will confirm any additional information the carrier needs.</p>
            <ul className="mt-5 list-disc space-y-3 pl-5 text-[#515c59]">
              {documents.map((document) => <li key={document}>{document}</li>)}
            </ul>
            <Link href="/quote-checklist" className="text-link mt-5">
              Full quote preparation checklist <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <nav aria-label="Related insurance coverage" className="md:border-l md:border-[#dce3df] md:pl-10">
            <h2 className="text-2xl font-bold">Complete your coverage picture</h2>
            <ul className="mt-5">
              {related.map((link) => (
                <li key={link.href} className="border-b border-[#dce3df]">
                  <Link href={link.href} className="flex items-center justify-between gap-4 py-5 font-semibold text-[#202625] hover:text-[#c94c05]">
                    {link.label}<ArrowRight size={18} className="shrink-0" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/about" className="text-link mt-6">Meet your Supreme agent<ArrowRight size={16} aria-hidden="true" /></Link>
          </nav>
        </div>
      </section>
    </>
  );
}
