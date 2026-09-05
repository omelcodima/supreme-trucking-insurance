import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { quoteHrefForPath } from "@/lib/quoteContext";
import { googleBusinessUrl } from "@/lib/socialProfiles";
import { absoluteUrl, breadcrumbJsonLd, jsonLdScript } from "@/lib/seo";

type QA = { q: string; a: string };
type QuickFact = { label: string; value: string };

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
  immersiveHero?: boolean;
  quickFacts?: QuickFact[];
  canonicalPath?: string;
  serviceType?: string;
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
  faqs = [],
  extraSideCard,
  primaryCtaLabel,
  primaryCtaHref,
  ctaTitle,
  ctaDescription,
  ctaButtonLabel,
  immersiveHero = false,
  quickFacts = [],
  canonicalPath,
  serviceType,
}: Props) {
  const ctaHref = primaryCtaHref || quoteHrefForPath(canonicalPath || "");
  const breadcrumbData = canonicalPath
    ? breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: title, path: canonicalPath },
      ])
    : null;
  const serviceData = canonicalPath && serviceType
    ? {
        "@context": "https://schema.org",
        "@type": "Service",
        name: serviceType,
        serviceType,
        description,
        url: absoluteUrl(canonicalPath),
        areaServed: {
          "@type": "Country",
          name: "United States",
        },
        provider: {
          "@id": absoluteUrl("/#insurance-agency"),
        },
      }
    : null;

  return (
    <>
      {breadcrumbData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(breadcrumbData)}
        />
      ) : null}
      {serviceData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(serviceData)}
        />
      ) : null}
      {immersiveHero ? (
        <>
          <section className="section-shell service-hero">
            <div className="relative mx-auto overflow-hidden">
              <Image
                src={image}
                alt={title}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/55" />
              <div className="site-container service-hero-inner relative z-10 flex items-end">
                <div className="max-w-3xl text-white">
                  <span className="mb-4 block text-xs font-semibold uppercase text-white">
                    {eyebrow}
                  </span>
                  <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                    {title}
                  </h1>
                  <p className="mt-5 max-w-2xl text-base leading-7 text-white/95 md:text-lg md:leading-8">
                    {description}
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href={ctaHref}
                      className="button-primary"
                    >
                      {primaryCtaLabel}
                    </Link>
                    <a
                      href="tel:+13609367196"
                      className="button-secondary"
                    >
                      Call (360) 936-7196
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {quickFacts.length > 0 ? (
            <section className="border-b border-[#E7DED2] bg-[#FFFDF9]">
              <div className="mx-auto grid max-w-6xl px-4 md:grid-cols-3 md:divide-x md:divide-[#E7DED2]">
                {quickFacts.map((fact) => (
                  <div key={fact.label} className="border-b border-[#E7DED2] py-6 last:border-b-0 md:border-b-0 md:px-7 md:py-8 first:md:pl-0 last:md:pr-0">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f97316]">{fact.label}</p>
                    <p className="mt-2 text-base font-bold leading-6 text-[#2F261C]">{fact.value}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </>
      ) : (
        <section className="section-shell">
          <div className="max-w-6xl mx-auto px-4 pt-14 pb-16 md:pt-20 md:pb-20 grid gap-10 lg:grid-cols-[1fr_0.95fr] items-center">
            <div>
              <span className="eyebrow mb-5">{eyebrow}</span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#2F261C] leading-tight">{title}</h1>
              <p className="mt-5 text-lg md:text-xl text-[#5A4B3B] max-w-2xl leading-relaxed">{description}</p>
            </div>
            <div className="hero-image-shell p-4">
              <div className="relative h-[280px] md:h-[360px] rounded-[1.5rem] overflow-hidden">
                <Image src={image} alt={title} fill priority sizes="(min-width: 1024px) 48vw, 100vw" style={{ objectFit: "cover" }} />
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="section-shell site-section">
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
                <div key={item} className="border-b py-3 text-sm text-[#515c59] flex gap-3 items-start">
                  <Check className="shrink-0 text-[#c94c05]" size={18} aria-hidden="true" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <Link
              href={ctaHref}
              className="button-primary"
            >
              {primaryCtaLabel}<ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>

          <div className="space-y-4">
            {(sideTitle || sideQuote) && (
              <div className="border-b pb-6">
                <h3 className="text-lg font-bold mb-3">Get to know Supreme</h3>
                <a href={googleBusinessUrl} target="_blank" rel="noopener noreferrer" className="text-link">View our Google Business profile<ArrowRight size={16} aria-hidden="true" /></a>
              </div>
            )}

            {faqs.map((faq) => (
              <details key={faq.q} className="service-faq">
                <summary>{faq.q}<ChevronDown size={17} aria-hidden="true" /></summary>
                <p>{faq.a}</p>
              </details>
            ))}

            {extraSideCard}
          </div>
        </div>
      </section>

      <section className="site-section bg-[#e9f0ed] text-[#202625] text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">{ctaTitle}</h2>
          <p className="text-[#515c59] mb-8">{ctaDescription}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={ctaHref} className="button-primary">
              {ctaButtonLabel}
            </Link>
            <a href="tel:+13609367196" className="button-secondary">
              Call (360) 936-7196
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
