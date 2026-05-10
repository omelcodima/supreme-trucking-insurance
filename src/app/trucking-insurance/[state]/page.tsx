import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { featuredStatePages, getStatePage, statePages } from "@/lib/statePages";

type Props = {
  params: Promise<{ state: string }>;
};

export function generateStaticParams() {
  return statePages.map((state) => ({ state: state.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const state = getStatePage(stateSlug);

  if (!state) {
    return {};
  }

  return {
    title: `${state.name} Trucking Insurance | Supreme Trucking Insurance`,
    description: `Commercial truck insurance options for ${state.name} owner-operators, fleets, new authorities, cargo, and physical damage. Licensed where available.`,
    alternates: {
      canonical: `/trucking-insurance/${state.slug}`,
    },
  };
}

export default async function StateInsurancePage({ params }: Props) {
  const { state: stateSlug } = await params;
  const state = getStatePage(stateSlug);

  if (!state) {
    notFound();
  }

  const relatedStates = featuredStatePages.filter((item) => item.slug !== state.slug).slice(0, 5);

  return (
    <>
      <section className="section-shell warm-divider">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:py-20 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <span className="eyebrow mb-5">{state.abbreviation} trucking insurance</span>
            <h1 className="text-4xl font-black leading-tight text-[#2F261C] md:text-6xl">
              {state.headline}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5A4B3B] md:text-xl md:leading-9">
              {state.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/quote"
                className="rounded-xl bg-[#f97316] px-7 py-4 text-center text-base font-bold text-white shadow-lg transition-colors hover:bg-orange-600"
              >
                Start a {state.abbreviation} quote
              </Link>
              <Link
                href="/instant-indication"
                className="rounded-xl border border-[#DED3C4] bg-[#FFFDF9] px-7 py-4 text-center text-base font-bold text-[#2F261C] transition-colors hover:border-[#f97316] hover:text-[#f97316]"
              >
                Get instant indication
              </Link>
            </div>
          </div>

          <aside className="card-premium rounded-[1.6rem] p-6">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#7B6B59]">
              Common {state.abbreviation} needs
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {state.operationFocus.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#DED3C4] bg-[#FFFDF9] px-3 py-2 text-sm font-bold text-[#5A4B3B]"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-[#E7DED2] bg-[#F7F3EC] p-4">
              <p className="text-sm leading-6 text-[#5A4B3B]">
                Supreme Trucking Insurance is built for trucking accounts, not generic business insurance. Availability depends on license, market appetite, filings, drivers, losses, and underwriting review.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="section-soft py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <span className="eyebrow mb-4">Market fit</span>
            <h2 className="text-3xl font-black leading-tight text-[#2F261C] md:text-5xl">
              What matters for {state.name} trucking insurance.
            </h2>
            <div className="mt-8 grid gap-4">
              {state.marketNotes.map((note) => (
                <div key={note} className="card-premium rounded-[1.35rem] p-5">
                  <p className="text-sm leading-6 text-[#5A4B3B]">{note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {state.faqs.map((faq) => (
              <div key={faq.q} className="card-muted rounded-[1.4rem] p-5">
                <h3 className="font-bold text-[#2F261C]">{faq.q}</h3>
                <p className="mt-2 text-sm leading-6 text-[#5A4B3B]">{faq.a}</p>
              </div>
            ))}
            <div className="rounded-[1.4rem] border border-[#DED3C4] bg-[#EFE7DA] p-5">
              <h3 className="font-black text-[#2F261C]">What to send first</h3>
              <p className="mt-2 text-sm leading-6 text-[#5A4B3B]">
                DOT or MC number, trucks, drivers, garaging, cargo type, radius, current policy, and loss runs if available.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 max-w-2xl">
            <span className="eyebrow mb-4">Coverage paths</span>
            <h2 className="text-3xl font-black leading-tight text-[#2F261C] md:text-5xl">
              Build the policy around the operation.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Owner operators", "Solo truckers needing liability, cargo, physical damage, and bobtail or non-trucking coverage.", "/owner-operator"],
              ["Fleets", "Growing operations that need clean schedules, driver review, renewal shopping, and stronger market presentation.", "/fleet"],
              ["New authority", "New ventures that need filings, market guidance, and practical next steps before hauling.", "/new-venture"],
            ].map(([title, description, href]) => (
              <Link key={title} href={href} className="card-premium rounded-[1.35rem] p-6 transition-transform hover:-translate-y-1">
                <h3 className="text-xl font-black text-[#2F261C]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#5A4B3B]">{description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f97316] py-16 text-center text-white md:py-18">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-3xl font-black md:text-4xl">Start your {state.name} trucking quote.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
            Send the basics and we’ll help review market fit, required coverages, and the next step.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/quote" className="rounded-xl bg-white px-8 py-4 font-bold text-[#2F261C] transition-colors hover:bg-[#FFF3E8]">
              Get a Free Quote
            </Link>
            <a href="tel:+13609367196" className="rounded-xl border-2 border-white px-8 py-4 font-bold text-white transition-colors hover:bg-white/10">
              Call (360) 936-7196
            </a>
          </div>
        </div>
      </section>

      <section className="section-soft py-12">
        <div className="mx-auto max-w-6xl px-4">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.16em] text-[#7B6B59]">
            More state pages
          </p>
          <div className="flex flex-wrap gap-2">
            {relatedStates.map((item) => (
              <Link
                key={item.slug}
                href={`/trucking-insurance/${item.slug}`}
                className="rounded-full border border-[#DED3C4] bg-[#FFFDF9] px-4 py-2 text-sm font-bold text-[#5A4B3B] transition-colors hover:border-[#f97316] hover:text-[#f97316]"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
