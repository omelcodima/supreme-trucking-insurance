import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

type QA = { q: string; a: string };

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  sectionTitle: string;
  intro: string[];
  listTitle: string;
  listItems: string[];
  sideTitle?: string;
  sideQuote?: string;
  sideQuoteByline?: string;
  faqs?: QA[];
  extraSideCard?: ReactNode;
  primaryCtaLabel: string;
  primaryCtaHref?: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonLabel: string;
};

export default function SubpageLayout({
  eyebrow,
  title,
  description,
  image,
  sectionTitle,
  intro,
  listTitle,
  listItems,
  sideTitle,
  sideQuote,
  sideQuoteByline,
  faqs = [],
  extraSideCard,
  primaryCtaLabel,
  primaryCtaHref = "/quote",
  ctaTitle,
  ctaDescription,
  ctaButtonLabel,
}: Props) {
  return (
    <>
      <section className="section-shell">
        <div className="max-w-6xl mx-auto px-4 pt-14 pb-16 md:pt-20 md:pb-20 grid gap-10 lg:grid-cols-[1fr_0.95fr] items-center">
          <div>
            <span className="eyebrow mb-5">{eyebrow}</span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#2F261C] leading-tight">{title}</h1>
            <p className="mt-5 text-lg md:text-xl text-[#5A4B3B] max-w-2xl leading-relaxed">{description}</p>
          </div>
          <div className="hero-image-shell p-4">
            <div className="relative h-[280px] md:h-[360px] rounded-[1.5rem] overflow-hidden">
              <Image src={image} alt={title} fill priority style={{ objectFit: "cover" }} />
            </div>
          </div>
        </div>
      </section>

      <section className="section-soft py-18 md:py-20">
        <div className="max-w-6xl mx-auto px-4 grid gap-12 md:grid-cols-[1.05fr_0.95fr] items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-[#2F261C] mb-6">{sectionTitle}</h2>
            <div className="space-y-4">
              {intro.map((paragraph) => (
                <p key={paragraph} className="text-[#5A4B3B] leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            <h3 className="text-xl font-bold text-[#2F261C] mt-8 mb-4">{listTitle}</h3>
            <div className="grid gap-3 sm:grid-cols-2 mb-8">
              {listItems.map((item) => (
                <div key={item} className="card-premium rounded-2xl px-4 py-4 text-sm text-[#5A4B3B] flex gap-3 items-start">
                  <span className="text-[#f97316] font-bold">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <Link
              href={primaryCtaHref}
              className="inline-block bg-[#f97316] text-white font-bold px-8 py-4 rounded-xl hover:bg-orange-600 transition-colors shadow-lg"
            >
              {primaryCtaLabel} →
            </Link>
          </div>

          <div className="space-y-4">
            {(sideTitle || sideQuote) && (
              <div className="rounded-[1.6rem] border border-[#DED3C4] bg-[#EFE7DA] p-6 shadow-[0_18px_45px_rgba(89,63,37,0.08)]">
                {sideTitle && <h3 className="text-xl font-black text-[#2F261C] mb-3">{sideTitle}</h3>}
                {sideQuote && <p className="text-[#5A4B3B] italic leading-relaxed">“{sideQuote}”</p>}
                {sideQuoteByline && <p className="mt-4 text-sm font-bold text-[#f97316]">— {sideQuoteByline}</p>}
              </div>
            )}

            {faqs.map((faq) => (
              <div key={faq.q} className="card-muted rounded-[1.4rem] p-5">
                <h4 className="font-bold text-[#2F261C] mb-2">{faq.q}</h4>
                <p className="text-sm text-[#5A4B3B] leading-relaxed">{faq.a}</p>
              </div>
            ))}

            {extraSideCard}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-18 bg-[#f97316] text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-black mb-4">{ctaTitle}</h2>
          <p className="text-white/90 mb-8 text-lg">{ctaDescription}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote" className="bg-white text-[#2F261C] font-bold px-8 py-4 rounded-xl hover:bg-[#FFF3E8] transition-colors">
              {ctaButtonLabel}
            </Link>
            <a href="tel:+13609367196" className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors">
              Call (360) 936-7196
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
