import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SubpageLayout from "@/components/SubpageLayout";
import { cityPages, cityPagePath, getCityPage } from "@/lib/cityPages";
import { getStatePage } from "@/lib/statePages";
import { absoluteUrl, breadcrumbJsonLd, faqJsonLd, jsonLdScript, siteName } from "@/lib/seo";

type Props = { params: Promise<{ state: string; city: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return cityPages.map(city => ({ state: city.state, city: city.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params;
  const city = getCityPage(stateSlug, citySlug);
  const state = getStatePage(stateSlug);
  if (!city || !state) notFound();
  const title = `${city.name}, ${state.abbreviation} Truck Insurance | Supreme`;
  return {
    title, description: city.description,
    alternates: { canonical: cityPagePath(city) },
    openGraph: { type: "website", title, description: city.description, siteName, url: absoluteUrl(cityPagePath(city)), images: [{ url: absoluteUrl("/images/highway-premium.jpg"), alt: "Commercial truck on the highway" }] },
    twitter: { card: "summary_large_image", title, description: city.description, images: [absoluteUrl("/images/highway-premium.jpg")] },
  };
}

export default async function CityInsurancePage({ params }: Props) {
  const { state: stateSlug, city: citySlug } = await params;
  const city = getCityPage(stateSlug, citySlug);
  const state = getStatePage(stateSlug);
  if (!city || !state) notFound();
  const title = `Commercial Truck Insurance in ${city.name}, ${state.abbreviation}`;
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "States and cities", path: "/trucking-insurance" },
    { name: state.name, path: `/trucking-insurance/${state.slug}` },
    { name: city.name, path: cityPagePath(city) },
  ];
  const faqs = [city.faq, {
    q: `How do I start a ${city.name} trucking insurance quote?`,
    a: "Send your contact details and coverage request, then prepare your DOT or MC number if available, drivers, vehicles, garaging, commodities, routes and available loss runs. An agent will review the operation and explain the remaining information needed. Requesting a quote does not bind coverage.",
  }];
  const nearbyGuides = cityPages.filter(item => item.state === state.slug && item.slug !== city.slug);
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd(breadcrumbs))} />
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqJsonLd(faqs))} />
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript({
      "@context": "https://schema.org", "@type": "Service", name: title,
      serviceType: "Commercial trucking insurance", description: city.description,
      url: absoluteUrl(cityPagePath(city)), provider: { "@id": absoluteUrl("/#insurance-agency") },
      areaServed: { "@type": "City", name: city.name, containedInPlace: { "@type": "State", name: state.name } },
    })} />
    <nav aria-label="Breadcrumb" className="site-container location-breadcrumb">
      <ol>{breadcrumbs.map((item, index) => <li key={item.path}>{index === breadcrumbs.length - 1 ? <span aria-current="page">{item.name}</span> : <Link href={item.path}>{item.name}</Link>}</li>)}</ol>
    </nav>
    <SubpageLayout
      eyebrow={`${state.name} trucking businesses`} title={title} description={city.description}
      image="/images/highway-premium.jpg" immersiveHero
      sectionTitle={`Your ${city.name} operation, explained clearly`}
      intro={[city.introduction, "Supreme is an independent trucking insurance agency based in Vancouver, Washington. We work by phone and online; office visits are by appointment. Availability depends on the operation, carrier appetite and underwriting review."]}
      listTitle="Details to have ready" listItems={city.prepare} faqs={faqs}
      primaryCtaLabel="Request a trucking quote" primaryCtaHref="/quote"
      ctaTitle={`Discuss your ${city.name} trucking operation`}
      ctaDescription="Tell us what you haul, where your trucks are kept and where they travel. An agent will help you identify the next steps."
      ctaButtonLabel="Get a Free Quote"
    >
      <section className="site-section city-operation-details">
        <div className="site-container">
          <h2>Local operations and coverage questions</h2>
          <div className="city-section-grid">{city.sections.map(section => <div key={section.heading}>
            <h3>{section.heading}</h3><p>{section.text}</p>
          </div>)}</div>
          <div className="city-resources">
            <h3>Local freight resources</h3>
            <ul>{city.sources.map(source => <li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer">{source.label}</a></li>)}</ul>
            <p>These resources describe local freight activity; they do not establish your policy terms or insurance eligibility.</p>
          </div>
        </div>
      </section>
      <section className="site-section">
        <div className="site-container city-next-steps">
          <div>
            <h2>Prepare a complete request</h2>
            <p>Match coverage to the work, not just the city. Review liability for your operation, cargo for the freight, and physical damage for your equipment.</p>
            <ul className="city-resource-links">
              <li><Link href="/commercial-auto-insurance">Commercial auto liability</Link></li>
              <li><Link href="/cargo">Motor truck cargo</Link></li>
              <li><Link href="/physical-damage-insurance">Truck and trailer physical damage</Link></li>
              <li><Link href="/quote-checklist">Documents for a quote</Link></li>
              <li><Link href="/new-venture">Starting with new authority</Link></li>
            </ul>
          </div>
          <div>
            <h2>More {state.name} locations</h2>
            <ul className="city-resource-links">{nearbyGuides.map(item => <li key={item.slug}><Link href={cityPagePath(item)}>{item.name} truck insurance</Link></li>)}</ul>
            <Link href={`/trucking-insurance/${state.slug}`} className="text-link mt-5">All of {state.name}</Link>
          </div>
        </div>
      </section>
    </SubpageLayout>
  </>;
}
