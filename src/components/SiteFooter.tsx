import Link from "next/link";
import BrandLogo from "./BrandLogo";
import AnalyticsPreferences from "./AnalyticsPreferences";
import { classPages } from "@/lib/classPages";
import { locationDirectory } from "@/lib/cityPages";
import { googleBusinessUrl, socialProfiles } from "@/lib/socialProfiles";
import { serviceAreaSummary } from "@/lib/serviceArea";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container footer-main">
        <div>
          <BrandLogo />
          <p className="mt-5 max-w-sm text-sm leading-6">
            Trucking insurance for owner operators, fleets, and new authority.{" "}
            {serviceAreaSummary}
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
              ["/services", "Coverage overview"],
              ["/owner-operator", "Owner operators"],
              ["/fleet", "Fleets"],
              ["/new-venture", "New authority"],
              ["/cargo", "Cargo insurance"],
              ["/quote-checklist", "Quote checklist"],
              ["/coi-request", "COI Request"],
              ["/instant-indication", "Instant indication"],
              ["/about", "About Supreme"],
              ["/blog", "Guides & news"],
              ["/reviews", "Reviews"],
              ["/contact", "Contact"],
              ["/trucking-insurance", "States & cities"],
            ].map(([href, label]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="site-container footer-secondary">
        <details className="footer-locations">
          <summary>Trucking insurance by state & city</summary>
          <div className="footer-location-grid">
            {["washington", "oregon", "california", "texas", "florida", "illinois", "georgia"].map(slug => {
              const state = locationDirectory.find(item => item.slug === slug)!;
              return <div key={slug}>
                <h2><Link href={`/trucking-insurance/${slug}`}>{state.name} truck insurance</Link></h2>
                <ul>{state.cities.map(city => <li key={city.name}>{city.href ? <Link href={city.href}>{city.name}</Link> : <span>{city.name}</span>}</li>)}</ul>
              </div>;
            })}
          </div>
          <Link href="/trucking-insurance#states-and-cities" className="text-link">All 48 states and major cities</Link>
        </details>
        <details>
          <summary>Coverage by operation</summary>
          <div className="footer-directory">
            <Link href="/commercial-auto-insurance">
              Commercial auto / primary liability
            </Link>
            {classPages.map((p) => (
              <Link href={`/${p.slug}`} key={p.slug}>
                {p.name}
              </Link>
            ))}
          </div>
        </details>
        <div className="footer-legal">
          <p>© 2026 Supreme Trucking Insurance</p>
          <div>
            <Link href="/privacy-policy">Privacy</Link>
            <AnalyticsPreferences />
            <Link href="/sms-terms-and-conditions">SMS Terms</Link>
            <Link href="/careers">Careers</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
