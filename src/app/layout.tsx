import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import BrandLogo from "../components/BrandLogo";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Supreme Trucking Insurance | Fast Quotes. Multiple Carriers.",
  description:
    "Fast quotes. Multiple carriers. Owner operators, fleets & new authority. Licensed in 48 states. Call (360) 936-7196.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* STICKY NAV */}
        <header className="sticky top-0 z-50 bg-[#F7F3EC] border-b border-[#E7DED2] shadow-none">
          <nav className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
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
              <Link href="/loss-runs" className="text-[#2F261C] font-medium hover:text-[#f97316] transition-colors">Loss Run Help</Link>
              <Link href="/about" className="text-[#2F261C] font-medium hover:text-[#f97316] transition-colors">About</Link>
              <Link href="/contact" className="text-[#2F261C] font-medium hover:text-[#f97316] transition-colors">Contact</Link>
              <Link href="/privacy-policy" className="text-[#2F261C] font-medium hover:text-[#f97316] transition-colors">Privacy</Link>
            </div>

            {/* CTA BUTTON */}
            <Link
              href="/quote"
              className="bg-[#f97316] text-white px-5 py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors shadow-md"
            >
              Get a Free Quote
            </Link>
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
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-[#f97316]">Services</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/owner-operator" className="text-[#5A4B3B] hover:text-[#f97316] transition-colors">Owner Operator Insurance</Link></li>
                <li><Link href="/fleet" className="text-[#5A4B3B] hover:text-[#f97316] transition-colors">Small Fleet Insurance</Link></li>
                <li><Link href="/new-venture" className="text-[#5A4B3B] hover:text-[#f97316] transition-colors">New Authority / New Venture</Link></li>
                <li><Link href="/cargo" className="text-[#5A4B3B] hover:text-[#f97316] transition-colors">Cargo Insurance</Link></li>
                <li><Link href="/loss-runs" className="text-[#5A4B3B] hover:text-[#f97316] transition-colors">Loss Run Assistance</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-[#f97316]">Contact</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-[#7B6B59] text-xs uppercase tracking-wide mb-1">Phone</p>
                  <a href="tel:+13609367196" className="text-[#2F261C] hover:text-[#f97316] transition-colors font-medium">(360) 936-7196</a>
                </div>
                <div>
                  <p className="text-[#7B6B59] text-xs uppercase tracking-wide mb-1">Email</p>
                  <a href="mailto:domelco@aicinsagency.com" className="text-[#2F261C] hover:text-[#f97316] transition-colors font-medium">domelco@aicinsagency.com</a>
                </div>
                <div className="pt-2">
                  <Link href="/privacy-policy" className="block text-[#2F261C] hover:text-[#f97316] transition-colors text-sm mb-3">Privacy Policy</Link>
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
      </body>
    </html>
  );
}
