import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
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
        <header className="sticky top-0 z-50 bg-[#0f2044] shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-3">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L4 10V24C4 33.4 12.1 41.4 22 43C31.9 41.4 40 33.4 40 24V10L22 2Z" fill="#f97316"/>
                <path d="M10 28V22H14V20H22V18H28L32 22V28H10Z" fill="white"/>
                <circle cx="14" cy="29" r="2" fill="white"/>
                <circle cx="28" cy="29" r="2" fill="white"/>
                <rect x="8" y="24" width="6" height="4" rx="1" fill="white"/>
              </svg>
              <div className="flex flex-col leading-tight">
                <span className="text-[#f97316] font-black text-lg tracking-wide">SUPREME</span>
                <span className="text-white text-xs font-medium tracking-widest">TRUCKING INSURANCE</span>
              </div>
            </Link>

            {/* NAV LINKS */}
            <div className="hidden md:flex items-center gap-8">
              <div className="relative group">
                <span className="text-white font-medium cursor-pointer hover:text-[#f97316] transition-colors">
                  Services
                </span>
                <div className="absolute top-full left-0 pt-2 hidden group-hover:block z-50">
                  <div className="bg-[#0f2044] border border-white/10 rounded-lg shadow-xl p-2 min-w-48">
                    <Link href="/owner-operator" className="block px-4 py-2 text-white hover:text-[#f97316] hover:bg-white/5 rounded transition-colors text-sm">Owner Operators</Link>
                    <Link href="/fleet" className="block px-4 py-2 text-white hover:text-[#f97316] hover:bg-white/5 rounded transition-colors text-sm">Small Fleets</Link>
                    <Link href="/new-venture" className="block px-4 py-2 text-white hover:text-[#f97316] hover:bg-white/5 rounded transition-colors text-sm">New Authority</Link>
                    <Link href="/cargo" className="block px-4 py-2 text-white hover:text-[#f97316] hover:bg-white/5 rounded transition-colors text-sm">Cargo Insurance</Link>
                  </div>
                </div>
              </div>
              <Link href="/loss-runs" className="text-white font-medium hover:text-[#f97316] transition-colors">Loss Run Help</Link>
              <Link href="/about" className="text-white font-medium hover:text-[#f97316] transition-colors">About</Link>
              <Link href="/contact" className="text-white font-medium hover:text-[#f97316] transition-colors">Contact</Link>
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
        <footer className="bg-[#0f2044] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* About */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <svg width="36" height="36" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L4 10V24C4 33.4 12.1 41.4 22 43C31.9 41.4 40 33.4 40 24V10L22 2Z" fill="#f97316"/>
                  <path d="M10 28V22H14V20H22V18H28L32 22V28H10Z" fill="white"/>
                  <circle cx="14" cy="29" r="2" fill="white"/>
                  <circle cx="28" cy="29" r="2" fill="white"/>
                </svg>
                <div>
                  <div className="text-[#f97316] font-black text-base">SUPREME</div>
                  <div className="text-white text-xs tracking-widest">TRUCKING INSURANCE</div>
                </div>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                Your trusted partner for trucking insurance. We specialize in owner operators, small fleets, and new authority. Licensed in 48 states.
              </p>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-[#f97316]">Services</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/owner-operator" className="text-white/70 hover:text-[#f97316] transition-colors">Owner Operator Insurance</Link></li>
                <li><Link href="/fleet" className="text-white/70 hover:text-[#f97316] transition-colors">Small Fleet Insurance</Link></li>
                <li><Link href="/new-venture" className="text-white/70 hover:text-[#f97316] transition-colors">New Authority / New Venture</Link></li>
                <li><Link href="/cargo" className="text-white/70 hover:text-[#f97316] transition-colors">Cargo Insurance</Link></li>
                <li><Link href="/loss-runs" className="text-white/70 hover:text-[#f97316] transition-colors">Loss Run Assistance</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-[#f97316]">Contact</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wide mb-1">Phone</p>
                  <a href="tel:+13609367196" className="text-white hover:text-[#f97316] transition-colors font-medium">(360) 936-7196</a>
                </div>
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wide mb-1">Email</p>
                  <a href="mailto:domelco@aicinsagency.com" className="text-white hover:text-[#f97316] transition-colors font-medium">domelco@aicinsagency.com</a>
                </div>
                <div className="pt-2">
                  <Link href="/quote" className="inline-block bg-[#f97316] text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-orange-600 transition-colors">
                    Get a Free Quote →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 mt-10 pt-6 border-t border-white/10 text-center">
            <p className="text-white/50 text-sm">
              © 2026 Supreme Trucking Insurance. Licensed in 48 states.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
