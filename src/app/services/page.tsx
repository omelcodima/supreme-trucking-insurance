import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CoverageExplorer from "@/components/CoverageExplorer";
import { defaultOgImage, siteName } from "@/lib/seo";
import styles from "./services.module.css";

const title = "Truck, Cargo & Liability Coverage | Supreme Trucking Insurance";
const description =
  "Understand the difference between physical damage, motor truck cargo, and primary auto liability. Find a starting point for your trucking insurance quote.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/services" },
  openGraph: { title, description, url: "/services", siteName, images: [defaultOgImage] },
  twitter: { card: "summary_large_image", title, description, images: [defaultOgImage] },
};

export default function ServicesPage() {
  return (
    <>
      <section className={styles.coverageSection}>
        <div className="site-container">
          <header className={styles.heading}>
            <p className="section-kicker">Coverage overview</p>
            <h1>Trucking insurance coverage.</h1>
            <p>Your equipment. Your freight. Your responsibility to others.</p>
          </header>
          <CoverageExplorer />
          <p className={styles.disclaimer}>
            Coverage depends on your policy, operation, state, limits, deductibles,
            and exclusions. These are general examples, not a coverage determination.
            A quote request does not bind insurance.
          </p>
        </div>
      </section>
      <section className={styles.operations}>
        <div className="site-container">
          <h2>Built around your operation.</h2>
          <div className={styles.operationLinks}>
            {[
              { href: "/owner-operator", title: "Owner operators", text: "Coverage for your truck and your business." },
              { href: "/fleet", title: "Fleets", text: "A policy structure that keeps up with your fleet." },
              { href: "/new-venture", title: "New authority", text: "Your first policy and a practical start." },
            ].map((item) => (
              <Link href={item.href} key={item.href}>
                <h3>{item.title}<ArrowRight size={19} aria-hidden="true" /></h3>
                <p>{item.text}</p>
              </Link>
            ))}
          </div>
          <div className={styles.otherCoverage}>
            <span>More coverage options</span>
            <Link href="/bobtail-insurance">Bobtail & non-trucking</Link>
            <Link href="/quote">Not sure? Talk with Supreme<ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
