import Link from "next/link";
import BrandLogo from "./BrandLogo";
import { classPages } from "@/lib/classPages";
import { featuredStatePages } from "@/lib/statePages";
import { googleBusinessUrl, socialProfiles } from "@/lib/socialProfiles";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container footer-main">
        <div>
          <BrandLogo />
          <p className="mt-5 max-w-sm text-sm leading-6">
            Trucking insurance for owner operators, fleets, and new authority.
            Licensed in most states.
          </p>
          <p className="language-note mt-4">
            English · Russian · Ukrainian · Romanian
          </p>
        </div>
        <div>
          <h2>Contact Supreme</h2>
          <a href="tel:+13609367196" className="footer-phone">
            (360) 936-7196
          </a>
          <a
            href="mailto:info@supremetruckinginsurance.com"
            className="footer-email"
          >
            info@supremetruckinginsurance.com
          </a>
          <a href={googleBusinessUrl} target="_blank" rel="noopener noreferrer">
            Find us on Google
          </a>
          <div className="footer-social">
            {socialProfiles.map((p) => (
              <a
                href={p.href}
                key={p.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {p.label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h2>Explore</h2>
          <div className="footer-explore">
            {[
              ["/owner-operator", "Owner operators"],
              ["/fleet", "Fleets"],
              ["/new-venture", "New authority"],
              ["/cargo", "Cargo insurance"],
              ["/coi-request", "COI Request"],
              ["/instant-indication", "Instant indication"],
              ["/about", "About Supreme"],
              ["/blog", "Guides & news"],
              ["/reviews", "Reviews"],
              ["/contact", "Contact"],
            ].map(([href, label]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="site-container footer-secondary">
        <details>
          <summary>Coverage by operation & state</summary>
          <div className="footer-directory">
            <Link href="/commercial-auto-insurance">
              Commercial auto / primary liability
            </Link>
            {classPages.map((p) => (
              <Link href={`/${p.slug}`} key={p.slug}>
                {p.name}
              </Link>
            ))}
            {featuredStatePages.map((s) => (
              <Link href={`/trucking-insurance/${s.slug}`} key={s.slug}>
                {s.name}
              </Link>
            ))}
            <Link href="/trucking-insurance">All states</Link>
          </div>
        </details>
        <div className="footer-legal">
          <p>© 2026 Supreme Trucking Insurance</p>
          <div>
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/sms-terms-and-conditions">SMS Terms</Link>
            <Link href="/careers">Careers</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
