import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import Analytics from "@/components/Analytics";
import BrandLogo from "../components/BrandLogo";
import { defaultOgImage, siteName, siteUrl } from "@/lib/seo";
import { featuredStatePages } from "@/lib/statePages";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const googleBusinessUrl =
  "https://www.google.com/search?kgmid=/g/11z72w_0z4&q=Supreme+Trucking+Insurance+Agency";

const serviceLinks = [
  { href: "/owner-operator", label: "Owner Operators", detail: "Coverage for independent truck owners" },
  { href: "/fleet", label: "Fleet Insurance", detail: "Structured coverage for growing fleets" },
  { href: "/new-venture", label: "New Authority", detail: "Insurance and filing guidance" },
  { href: "/cargo", label: "Cargo Insurance", detail: "Protection for the freight you haul" },
];

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "InsuranceAgency",
  "@id": "https://supremetruckinginsurance.com/#insurance-agency",
  name: "Supreme Trucking Insurance",
  url: "https://supremetruckinginsurance.com",
  logo: "https://supremetruckinginsurance.com/logo.png",
  telephone: "+1-360-936-7196",
  email: "info@supremetruckinginsurance.com",
  areaServed: "United States",
  sameAs: [googleBusinessUrl],
  knowsAbout: [
    "Commercial truck insurance",
    "Owner operator insurance",
    "Fleet trucking insurance",
    "New authority trucking insurance",
    "Motor truck cargo insurance",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Supreme Trucking Insurance | Fast Quotes. Multiple Carriers.",
  description:
    "Fast quotes. Multiple carriers. Owner operators, fleets & new authority. Licensed in most states. Call (360) 936-7196.",
  keywords: [
    "trucking insurance",
    "commercial truck insurance",
    "owner operator insurance",
    "fleet truck insurance",
    "new authority truck insurance",
    "motor truck cargo insurance",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: "Supreme Trucking Insurance",
    description:
      "Commercial trucking insurance for owner-operators, fleets, new authority, cargo, and physical damage.",
    images: [{ url: defaultOgImage, width: 1200, height: 630, alt: siteName }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Supreme Trucking Insurance",
    description:
      "Commercial trucking insurance for owner-operators, fleets, new authority, cargo, and physical damage.",
    images: [defaultOgImage],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Analytics />
        {/* STICKY NAV */}
        <header className="sticky top-0 z-50 bg-[#F7F3EC]/95 border-b border-[#E7DED2] shadow-none backdrop-blur">
          <nav className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-between gap-3">
              <BrandLogo compact />

              {/* NAV LINKS */}
              <div className="hidden md:flex items-center gap-8">
                <div className="relative group">
                  <button
                    type="button"
                    className="text-[#2F261C] font-medium cursor-pointer hover:text-[#f97316] focus:text-[#f97316] transition-colors"
                    aria-haspopup="true"
                  >
                    Services
                  </button>
                  <div className="absolute top-full left-0 pt-3 hidden group-hover:block group-focus-within:block z-50">
                    <div className="w-[22rem] rounded-lg border border-[#E7DED2] bg-[#FFFDF9] p-3 shadow-[0_20px_50px_rgba(62,43,25,0.16)]">
                      <p className="px-3 pb-2 pt-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#9A8067]">
                        Coverage by operation
                      </p>
                      {serviceLinks.map(({ href, label, detail }) => (
                        <Link
                          key={href}
                          href={href}
                          className="group/item block rounded-md px-3 py-3 transition-colors hover:bg-[#F3ECE2] focus:bg-[#F3ECE2]"
                        >
                          <span className="block text-sm font-bold text-[#2F261C] transition-colors group-hover/item:text-[#f97316]">
                            {label}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-[#7B6B59]">{detail}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <Link href="/coi-request" className="text-[#2F261C] font-medium hover:text-[#f97316] transition-colors">COI Request</Link>
                <Link href="/about" className="text-[#2F261C] font-medium hover:text-[#f97316] transition-colors">About</Link>
                <div className="relative group">
                  <span className="text-[#2F261C] font-medium cursor-pointer hover:text-[#f97316] transition-colors">
                    Resources
                  </span>
                  <div className="absolute top-full left-0 pt-2 hidden group-hover:block z-50">
                    <div className="bg-[#F7F3EC] border border-[#E7DED2] rounded-lg shadow-xl p-2 min-w-44">
                      <Link href="/instant-indication" className="block px-4 py-2 text-[#2F261C] hover:text-[#f97316] hover:bg-[#EFE7DA] rounded transition-colors text-sm">Instant Indication</Link>
                      <Link href="/blog" className="block px-4 py-2 text-[#2F261C] hover:text-[#f97316] hover:bg-[#EFE7DA] rounded transition-colors text-sm">Blog & Insights</Link>
                      <Link href="/reviews" className="block px-4 py-2 text-[#2F261C] hover:text-[#f97316] hover:bg-[#EFE7DA] rounded transition-colors text-sm">Reviews</Link>
                      <Link href="/contact" className="block px-4 py-2 text-[#2F261C] hover:text-[#f97316] hover:bg-[#EFE7DA] rounded transition-colors text-sm">Contact</Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden md:flex flex-col items-end gap-1">
                <div className="flex items-center gap-4">
                  <Link
                    href="/quote"
                    className="bg-[#f97316] text-white px-5 py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors shadow-md whitespace-nowrap"
                  >
                    Get a Free Quote
                  </Link>
                  <a
                    href="tel:+13609367196"
                    className="hidden xl:block text-sm text-[#2F261C] font-semibold hover:text-[#f97316] transition-colors whitespace-nowrap"
                  >
                    Call (360) 936-7196
                  </a>
                </div>
                <p className="hidden xl:block text-xs text-[#7B6B59] tracking-[0.08em] uppercase whitespace-nowrap">
                  English • Russian • Ukrainian • Romanian
                </p>
              </div>

            </div>

            <details className="group mt-2 md:hidden rounded-2xl border border-[#E7DED2] bg-[#FFFDF9] open:shadow-[0_18px_45px_rgba(89,63,37,0.08)]">
              <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-bold text-[#2F261C]">
                Menu
                <span className="text-[#7B6B59] transition-transform group-open:rotate-45">＋</span>
              </summary>
              <div className="border-t border-[#E7DED2] px-4 py-4">
                <div className="grid gap-4 text-sm font-medium text-[#2F261C]">
                  <div className="grid gap-2">
                    <p className="text-xs uppercase tracking-[0.16em] text-[#7B6B59]">Services</p>
                    <Link href="/owner-operator" className="hover:text-[#f97316] transition-colors">Owner Operators</Link>
                    <Link href="/fleet" className="hover:text-[#f97316] transition-colors">Fleet Insurance</Link>
                    <Link href="/new-venture" className="hover:text-[#f97316] transition-colors">New Authority</Link>
                    <Link href="/cargo" className="hover:text-[#f97316] transition-colors">Cargo Insurance</Link>
                    <Link href="/coi-request" className="hover:text-[#f97316] transition-colors">COI Request</Link>
                  </div>
                  <div className="grid gap-2">
                    <p className="text-xs uppercase tracking-[0.16em] text-[#7B6B59]">Company</p>
                    <Link href="/about" className="hover:text-[#f97316] transition-colors">About</Link>
                    <Link href="/reviews" className="hover:text-[#f97316] transition-colors">Reviews</Link>
                    <Link href="/contact" className="hover:text-[#f97316] transition-colors">Contact</Link>
                  </div>
                  <div className="grid gap-2">
                    <p className="text-xs uppercase tracking-[0.16em] text-[#7B6B59]">Resources</p>
                    <Link href="/instant-indication" className="hover:text-[#f97316] transition-colors">Instant Indication</Link>
                    <Link href="/blog" className="hover:text-[#f97316] transition-colors">Blog & Insights</Link>
                  </div>
                  <div className="rounded-xl border border-[#E7DED2] bg-[#F7F3EC] px-4 py-3 text-[#5A4B3B]">
                    <a href="tel:+13609367196" className="block text-lg font-black text-[#2F261C] hover:text-[#f97316] transition-colors">
                      (360) 936-7196
                    </a>
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#7B6B59]">English • Russian • Ukrainian • Romanian</p>
                  </div>
                </div>
              </div>
            </details>
          </nav>
        </header>

        <main>{children}</main>

        {/* FOOTER */}
        <footer className="bg-[#EDE5D8] text-[#2F261C] py-12 border-t border-[#DED3C4]">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* About */}
            <div>
              <div className="mb-4">
                <BrandLogo />
              </div>
              <p className="text-[#5A4B3B] text-sm leading-relaxed">
                Your trusted partner for trucking insurance. We specialize in owner operators, small fleets, and new authority. Licensed in most states.
              </p>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-[#f97316]">Services</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/owner-operator" className="text-[#5A4B3B] hover:text-[#f97316] transition-colors">Owner Operator Insurance</Link></li>
                <li><Link href="/fleet" className="text-[#5A4B3B] hover:text-[#f97316] transition-colors">Fleet Insurance</Link></li>
                <li><Link href="/new-venture" className="text-[#5A4B3B] hover:text-[#f97316] transition-colors">New Authority / New Venture</Link></li>
                <li><Link href="/cargo" className="text-[#5A4B3B] hover:text-[#f97316] transition-colors">Cargo Insurance</Link></li>
                <li><Link href="/coi-request" className="text-[#5A4B3B] hover:text-[#f97316] transition-colors">COI Request</Link></li>
                <li><Link href="/instant-indication" className="text-[#5A4B3B] hover:text-[#f97316] transition-colors">Instant Indication</Link></li>
              </ul>
              <h3 className="mt-8 text-lg font-bold mb-4 text-[#f97316]">States</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {featuredStatePages.slice(0, 8).map((state) => (
                  <Link
                    key={state.slug}
                    href={`/trucking-insurance/${state.slug}`}
                    className="text-[#5A4B3B] transition-colors hover:text-[#f97316]"
                  >
                    {state.name}
                  </Link>
                ))}
              </div>
              <Link
                href="/trucking-insurance"
                className="mt-3 inline-block text-sm font-bold text-[#2F261C] transition-colors hover:text-[#f97316]"
              >
                All state pages →
              </Link>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-[#f97316]">Contact</h3>
              <div className="space-y-3 text-sm">
                <p className="text-[#7B6B59] text-xs uppercase tracking-[0.12em]">English • Russian • Ukrainian • Romanian</p>
                <div>
                  <p className="text-[#7B6B59] text-xs uppercase tracking-wide mb-1">Phone</p>
                  <a href="tel:+13609367196" className="text-[#2F261C] hover:text-[#f97316] transition-colors font-medium">(360) 936-7196</a>
                </div>
                <div>
                  <p className="text-[#7B6B59] text-xs uppercase tracking-wide mb-1">Email</p>
                  <a href="mailto:info@supremetruckinginsurance.com" className="text-[#2F261C] hover:text-[#f97316] transition-colors font-medium">info@supremetruckinginsurance.com</a>
                </div>
                <div>
                  <p className="text-[#7B6B59] text-xs uppercase tracking-wide mb-1">Google Business</p>
                  <a
                    href={googleBusinessUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2F261C] hover:text-[#f97316] transition-colors font-medium"
                  >
                    View Supreme on Google
                  </a>
                </div>
                <div className="pt-2">
                  <Link href="/privacy-policy" className="block text-[#2F261C] hover:text-[#f97316] transition-colors text-sm">Privacy Policy</Link>
                  <Link href="/sms-terms-and-conditions" className="mt-2 block text-[#2F261C] hover:text-[#f97316] transition-colors text-sm mb-3">SMS Terms & Conditions</Link>
                  <Link href="/about" className="mt-2 block text-[#2F261C] hover:text-[#f97316] transition-colors text-sm mb-3">About</Link>
                  <Link href="/contact" className="block text-[#2F261C] hover:text-[#f97316] transition-colors text-sm mb-3">Contact</Link>
                  <Link href="/blog" className="block text-[#2F261C] hover:text-[#f97316] transition-colors text-sm mb-3">Blog & Insights</Link>
                  <Link href="/reviews" className="block text-[#2F261C] hover:text-[#f97316] transition-colors text-sm mb-3">Reviews</Link>
                  <Link href="/careers" className="block text-[#2F261C] hover:text-[#f97316] transition-colors text-sm mb-3">Careers</Link>
                  <Link href="/quote" className="inline-block bg-[#f97316] text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-orange-600 transition-colors">
                    Get a Free Quote →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 mt-10 pt-6 border-t border-[#D8CCBD] text-center">
            <p className="text-[#7B6B59] text-sm">
              © 2026 Supreme Trucking Insurance. Licensed in most states.
            </p>
          </div>
        </footer>
        <Link
          href="/instant-indication"
          className="fixed bottom-6 right-6 z-40 hidden items-center gap-3 rounded-full border border-[#f97316]/35 bg-[#FFFDF9]/95 px-7 py-4 text-lg font-black text-[#2F261C] shadow-[0_18px_44px_rgba(89,63,37,0.22)] backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white hover:text-[#f97316] md:inline-flex"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 text-[#f97316]">
            <path fill="currentColor" d="M4 19h16v2H4v-2Zm2-3h2V8H6v8Zm5 0h2V3h-2v13Zm5 0h2v-6h-2v6Z" />
          </svg>
          Instant indication
        </Link>
      </body>
    </html>
  );
}
