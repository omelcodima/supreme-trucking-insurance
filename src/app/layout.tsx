import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import BrandLogo from "../components/BrandLogo";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const googleBusinessUrl =
  "https://www.google.com/search?kgmid=/g/11z72w_0z4&q=Supreme+Trucking+Insurance+Agency";

const socialLinks = [
  {
    name: "Twitter",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
        <path
          fill="currentColor"
          d="M17.53 3h3.27l-7.14 8.16L22 21h-6.52l-5.1-6.68L4.54 21H1.27l7.64-8.73L1 3h6.68l4.61 6.1L17.53 3Zm-1.15 16.27h1.81L6.7 4.64H4.76l11.62 14.63Z"
        />
      </svg>
    ),
  },
  {
    name: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
        <path
          fill="currentColor"
          d="M7.8 2h8.4A5.81 5.81 0 0 1 22 7.8v8.4a5.81 5.81 0 0 1-5.8 5.8H7.8A5.81 5.81 0 0 1 2 16.2V7.8A5.81 5.81 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm8.95 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7.25A4.75 4.75 0 1 1 12 16.75 4.75 4.75 0 0 1 12 7.25Zm0 2A2.75 2.75 0 1 0 12 14.75 2.75 2.75 0 0 0 12 9.25Z"
        />
      </svg>
    ),
  },
  {
    name: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
        <path
          fill="currentColor"
          d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.25-1.5 1.55-1.5h1.65V4.62A22.1 22.1 0 0 0 14.3 4c-2.38 0-4 1.45-4 4.11v2.79H7.6V14h2.7v8h3.2Z"
        />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
        <path
          fill="currentColor"
          d="M6.94 8.98H3.73V21h3.21V8.98ZM5.33 3A1.86 1.86 0 1 0 5.3 6.72 1.86 1.86 0 0 0 5.33 3Zm15 11.1c0-3.22-1.72-5.39-4.49-5.39a3.86 3.86 0 0 0-3.49 1.92V8.98H9.28V21h3.2v-5.95c0-1.57.3-3.1 2.25-3.1 1.93 0 1.96 1.8 1.96 3.2V21h3.2l.44-6.9Z"
        />
      </svg>
    ),
  },
];

export const metadata: Metadata = {
  title: "Supreme Trucking Insurance | Fast Quotes. Multiple Carriers.",
  description:
    "Fast quotes. Multiple carriers. Owner operators, fleets & new authority. Licensed in 48 states. Call (360) 936-7196.",
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
        {/* STICKY NAV */}
        <header className="sticky top-0 z-50 bg-[#F7F3EC]/95 border-b border-[#E7DED2] shadow-none backdrop-blur">
          <nav className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-between gap-3">
              <BrandLogo compact />

              {/* NAV LINKS */}
              <div className="hidden md:flex items-center gap-8">
                <div className="relative group">
                  <span className="text-[#2F261C] font-medium cursor-pointer hover:text-[#f97316] transition-colors">
                    Services
                  </span>
                  <div className="absolute top-full left-0 pt-2 hidden group-hover:block z-50">
                    <div className="bg-[#F7F3EC] border border-[#E7DED2] rounded-lg shadow-xl p-2 min-w-48">
                      <Link href="/owner-operator" className="block px-4 py-2 text-[#2F261C] hover:text-[#f97316] hover:bg-[#EFE7DA] rounded transition-colors text-sm">Owner Operators</Link>
                      <Link href="/fleet" className="block px-4 py-2 text-[#2F261C] hover:text-[#f97316] hover:bg-[#EFE7DA] rounded transition-colors text-sm">Small Fleets</Link>
                      <Link href="/new-venture" className="block px-4 py-2 text-[#2F261C] hover:text-[#f97316] hover:bg-[#EFE7DA] rounded transition-colors text-sm">New Authority</Link>
                      <Link href="/cargo" className="block px-4 py-2 text-[#2F261C] hover:text-[#f97316] hover:bg-[#EFE7DA] rounded transition-colors text-sm">Cargo Insurance</Link>
                    </div>
                  </div>
                </div>
                <Link href="/coi-request" className="text-[#2F261C] font-medium hover:text-[#f97316] transition-colors">COI Request</Link>
                <Link href="/about" className="text-[#2F261C] font-medium hover:text-[#f97316] transition-colors">About</Link>
                <div className="relative group">
                  <span className="text-[#2F261C] font-medium cursor-pointer hover:text-[#f97316] transition-colors">
                    More
                  </span>
                  <div className="absolute top-full left-0 pt-2 hidden group-hover:block z-50">
                    <div className="bg-[#F7F3EC] border border-[#E7DED2] rounded-lg shadow-xl p-2 min-w-44">
                      <Link href="/instant-indication" className="block px-4 py-2 text-[#2F261C] hover:text-[#f97316] hover:bg-[#EFE7DA] rounded transition-colors text-sm">Instant Indication</Link>
                      <Link href="/blog" className="block px-4 py-2 text-[#2F261C] hover:text-[#f97316] hover:bg-[#EFE7DA] rounded transition-colors text-sm">Blog</Link>
                      <Link href="/careers" className="block px-4 py-2 text-[#2F261C] hover:text-[#f97316] hover:bg-[#EFE7DA] rounded transition-colors text-sm">Careers</Link>
                      <Link href="/contact" className="block px-4 py-2 text-[#2F261C] hover:text-[#f97316] hover:bg-[#EFE7DA] rounded transition-colors text-sm">Contact</Link>
                      <Link href="/privacy-policy" className="block px-4 py-2 text-[#2F261C] hover:text-[#f97316] hover:bg-[#EFE7DA] rounded transition-colors text-sm">Privacy</Link>
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

              <div className="flex items-center gap-2 md:hidden">
                <a
                  href="tel:+13609367196"
                  className="rounded-lg border border-[#DED3C4] bg-[#FFFDF9] px-3 py-2 text-sm font-bold text-[#2F261C] hover:border-[#f97316] hover:text-[#f97316] transition-colors"
                >
                  Call
                </a>
                <Link
                  href="/quote"
                  className="rounded-lg bg-[#f97316] px-3 py-2 text-sm font-bold text-white hover:bg-orange-600 transition-colors"
                >
                  Quote
                </Link>
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
                    <Link href="/fleet" className="hover:text-[#f97316] transition-colors">Small Fleets</Link>
                    <Link href="/new-venture" className="hover:text-[#f97316] transition-colors">New Authority</Link>
                    <Link href="/cargo" className="hover:text-[#f97316] transition-colors">Cargo Insurance</Link>
                    <Link href="/coi-request" className="hover:text-[#f97316] transition-colors">COI Request</Link>
                  </div>
                  <div className="grid gap-2">
                    <p className="text-xs uppercase tracking-[0.16em] text-[#7B6B59]">Company</p>
                    <Link href="/about" className="hover:text-[#f97316] transition-colors">About</Link>
                    <Link href="/instant-indication" className="hover:text-[#f97316] transition-colors">Instant Indication</Link>
                    <Link href="/blog" className="hover:text-[#f97316] transition-colors">Blog</Link>
                    <Link href="/careers" className="hover:text-[#f97316] transition-colors">Careers</Link>
                    <Link href="/contact" className="hover:text-[#f97316] transition-colors">Contact</Link>
                    <Link href="/privacy-policy" className="hover:text-[#f97316] transition-colors">Privacy Policy</Link>
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
                Your trusted partner for trucking insurance. We specialize in owner operators, small fleets, and new authority. Licensed in 48 states.
              </p>
              <div className="mt-5 flex items-center gap-3" aria-label="Social media">
                {socialLinks.map((social) => (
                  <span
                    key={social.name}
                    aria-label={social.name}
                    title={`${social.name} profile coming soon`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#D8CCBD] bg-[#FFFDF9]/70 text-[#5A4B3B] transition-all hover:-translate-y-0.5 hover:border-[#f97316]/45 hover:text-[#f97316] hover:shadow-[0_12px_26px_rgba(249,115,22,0.12)]"
                  >
                    {social.icon}
                  </span>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-[#f97316]">Services</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/owner-operator" className="text-[#5A4B3B] hover:text-[#f97316] transition-colors">Owner Operator Insurance</Link></li>
                <li><Link href="/fleet" className="text-[#5A4B3B] hover:text-[#f97316] transition-colors">Small Fleet Insurance</Link></li>
                <li><Link href="/new-venture" className="text-[#5A4B3B] hover:text-[#f97316] transition-colors">New Authority / New Venture</Link></li>
                <li><Link href="/cargo" className="text-[#5A4B3B] hover:text-[#f97316] transition-colors">Cargo Insurance</Link></li>
                <li><Link href="/coi-request" className="text-[#5A4B3B] hover:text-[#f97316] transition-colors">COI Request</Link></li>
                <li><Link href="/instant-indication" className="text-[#5A4B3B] hover:text-[#f97316] transition-colors">Instant Indication</Link></li>
              </ul>
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
                  <a href="mailto:domelco@aicinsagency.com" className="text-[#2F261C] hover:text-[#f97316] transition-colors font-medium">domelco@aicinsagency.com</a>
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
                  <Link href="/blog" className="mt-2 block text-[#2F261C] hover:text-[#f97316] transition-colors text-sm mb-3">Blog</Link>
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
              © 2026 Supreme Trucking Insurance. Licensed in 48 states.
            </p>
          </div>
        </footer>
        <Link
          href="/instant-indication"
          className="fixed bottom-20 right-4 z-40 inline-flex items-center gap-2 rounded-full border border-[#f97316]/35 bg-[#FFFDF9]/95 px-4 py-3 text-sm font-black text-[#2F261C] shadow-[0_16px_40px_rgba(89,63,37,0.18)] backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white hover:text-[#f97316] md:bottom-6 md:right-6"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 text-[#f97316]">
            <path fill="currentColor" d="M4 19h16v2H4v-2Zm2-3h2V8H6v8Zm5 0h2V3h-2v13Zm5 0h2v-6h-2v6Z" />
          </svg>
          Instant indication
        </Link>
      </body>
    </html>
  );
}
