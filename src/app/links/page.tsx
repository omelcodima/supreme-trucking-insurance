import type { Metadata } from "next";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export const metadata: Metadata = {
  title: "Supreme Trucking Insurance Links | Quotes, Documents & Updates",
  description:
    "Quick links for Supreme Trucking Insurance: get a quote, instant DOT indication, upload documents, call, email, read trucking insurance updates, and view Google Business.",
  alternates: {
    canonical: "/links",
  },
};

const primaryLinks = [
  {
    label: "Get a trucking insurance quote",
    description: "Owner-operators, fleets, new authority, cargo, physical damage, and filings.",
    href: "/quote",
  },
  {
    label: "Instant DOT indication",
    description: "Start with your DOT number for a quick non-binding indication.",
    href: "/instant-indication",
  },
  {
    label: "Upload documents",
    description: "Send loss runs, current policy documents, driver lists, vehicle schedules, or renewals.",
    href: "/contact/upload-docs",
  },
  {
    label: "Request a certificate of insurance",
    description: "COI requests for current clients and certificate holders.",
    href: "/coi-request",
  },
];

const quickLinks = [
  { label: "Call (360) 936-7196", href: "tel:+136****7196" },
  { label: "Email info@supremetruckinginsurance.com", href: "mailto:info@supremetruckinginsurance.com" },
  {
    label: "View Supreme on Google",
    href: "https://www.google.com/search?kgmid=/g/11z72w_0z4&q=Supreme+Trucking+Insurance+Agency",
  },
  { label: "Latest trucking insurance updates", href: "/blog" },
  { label: "Coverage articles", href: "/articles" },
];

export default function LinksPage() {
  return (
    <section className="section-shell warm-divider min-h-screen overflow-hidden">
      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <div className="rounded-[2rem] border border-[#DED3C4] bg-[#FFFDF9]/88 p-6 text-center shadow-[0_28px_80px_rgba(89,63,37,0.12)] md:p-9">
          <div className="mx-auto flex justify-center">
            <BrandLogo />
          </div>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-[#f97316]">
            Fast quotes • Multiple carriers • Trucking-focused
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-[#2F261C] md:text-5xl">
            Supreme Trucking Insurance quick links
          </h1>
          <p className="mt-5 text-base leading-8 text-[#5A4B3B] md:text-lg">
            Save this page for social bios, text messages, and drivers who need the right link fast.
          </p>

          <div className="mt-8 grid gap-3 text-left">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group rounded-[1.35rem] border border-[#DED3C4] bg-[#F7F3EC] p-5 transition-all hover:-translate-y-0.5 hover:border-[#f97316]/60 hover:bg-[#FFF7ED] hover:shadow-[0_18px_40px_rgba(249,115,22,0.12)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-black text-[#2F261C] group-hover:text-[#9A4D00]">
                      {link.label}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#5A4B3B]">{link.description}</p>
                  </div>
                  <span className="mt-1 rounded-full bg-[#f97316] px-3 py-1 text-sm font-black text-white">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-7 grid gap-2 text-left">
            {quickLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="rounded-full border border-[#DED3C4] bg-white/70 px-5 py-3 text-sm font-bold text-[#2F261C] transition-colors hover:border-[#f97316]/60 hover:text-[#f97316]"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="mt-8 rounded-[1.25rem] border border-[#F4C08A] bg-[#FFF7ED] p-5 text-left">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9A4D00]">
              Social profiles
            </p>
            <p className="mt-3 text-sm leading-7 text-[#5A4B3B]">
              Facebook, Instagram, LinkedIn, and Google Business posting will use this page as the link-in-bio hub once owner verification is completed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
