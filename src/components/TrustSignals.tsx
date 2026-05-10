import Link from "next/link";

const googleBusinessUrl =
  "https://www.google.com/search?kgmid=/g/11z72w_0z4&q=Supreme+Trucking+Insurance+Agency";

const trustItems = [
  ["48", "states licensed", "Built for truckers who run across state lines."],
  ["4", "languages", "English, Russian, Ukrainian, and Romanian."],
  ["DOT", "first review", "We use DOT details to understand the account faster."],
  ["COI", "support", "Certificate requests have their own intake flow."],
];

export default function TrustSignals() {
  return (
    <section className="section-soft warm-divider py-14 md:py-18">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <span className="eyebrow mb-4">Trust signals</span>
            <h2 className="text-3xl font-extrabold leading-tight text-[#2F261C] md:text-5xl">
              A real trucking insurance agency, not a generic quote page.
            </h2>
            <p className="mt-4 text-lg leading-8 text-[#5A4B3B]">
              Supreme focuses on trucking accounts: owner-operators, fleets, new authority,
              cargo, physical damage, filings, and certificate requests.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={googleBusinessUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-[#f97316] px-6 py-3 text-center text-sm font-extrabold text-white shadow-lg transition-colors hover:bg-orange-600"
              >
                View Google profile
              </a>
              <Link
                href="/trucking-insurance"
                className="rounded-xl border border-[#DED3C4] bg-[#FFFDF9] px-6 py-3 text-center text-sm font-extrabold text-[#2F261C] transition-colors hover:border-[#f97316] hover:text-[#f97316]"
              >
                See state pages
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {trustItems.map(([value, title, body]) => (
              <div key={title} className="card-premium rounded-[1.35rem] p-5">
                <p className="text-3xl font-black text-[#f97316]">{value}</p>
                <h3 className="mt-2 text-lg font-black text-[#2F261C]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#5A4B3B]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
