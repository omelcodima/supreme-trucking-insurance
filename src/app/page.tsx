import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone, Check, ExternalLink } from "lucide-react";
import StateFinder from "@/components/StateFinder";
import PromoPlayer from "@/components/PromoPlayer";
import MarketMarquee from "@/components/MarketMarquee";
import HeroScene from "@/components/HeroScene";
import { featuredBlogPosts } from "@/lib/blogPosts";
import { statePages } from "@/lib/statePages";
import { googleBusinessUrl } from "@/lib/socialProfiles";

const operations = [
  {
    title: "Owner operators",
    description:
      "Coverage for your truck, your freight, and the business you built.",
    href: "/owner-operator",
    image: "/images/owner-operator-card-v2.jpg",
  },
  {
    title: "Fleets",
    description:
      "A clear policy structure and renewal support as your fleet grows.",
    href: "/fleet",
    image: "/images/fleet-card-v2.jpg",
  },
  {
    title: "New authority",
    description:
      "Your first policy, required filings, and a practical path to hauling.",
    href: "/new-venture",
    image: "/images/new-authority-card-v2.jpg",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="home-hero">
        <Image
          src="/images/hero-premium.jpg"
          alt="A tractor-trailer on the open highway"
          fill
          priority
          sizes="100vw"
          className="home-hero-image"
        />
        <HeroScene />
        <div className="home-hero-shade" />
        <div className="site-container home-hero-inner">
          <div className="home-hero-copy">
            <p className="hero-kicker">For the business behind the wheel</p>
            <h1>
              <span className="hero-brand-name">Supreme</span>
              <span className="hero-brand-category">Trucking Insurance.</span>
            </h1>
            <p>
              Independent agents. Trucking-focused markets. Clear answers for
              owner operators, fleets, and new authority.
            </p>
            <div className="hero-buttons">
              <Link href="/quote" className="button-primary">
                Get a Free Quote
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <a href="tel:+13609367196" className="hero-call">
                <Phone size={17} aria-hidden="true" />
                (360) 936-7196
              </a>
            </div>
            <PromoPlayer />
          </div>
        </div>
      </section>
      <MarketMarquee />
      <section className="site-section">
        <div className="site-container">
          <div className="section-header">
            <div>
              <p className="section-kicker">Coverage for your operation</p>
              <h2 className="section-heading">
                Your business. The right starting point.
              </h2>
            </div>
            <Link href="/cargo" className="text-link">
              Cargo coverage
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="operation-grid">
            {operations.map((op) => (
              <Link key={op.href} href={op.href} className="operation-card">
                <div className="operation-image">
                  <Image
                    src={op.image}
                    alt={op.title + " trucking operation"}
                    fill
                    sizes="(min-width: 800px) 380px, 100vw"
                  />
                </div>
                <div className="operation-copy">
                  <h3>
                    {op.title}
                    <ArrowRight size={20} aria-hidden="true" />
                  </h3>
                  <p>{op.description}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="coverage-links">
            <span>Also explore</span>
            <Link href="/commercial-auto-insurance">
              Commercial auto & primary liability
            </Link>
            <Link href="/cargo">Motor truck cargo</Link>
            <Link href="/bobtail-insurance">Bobtail / non-trucking</Link>
            <Link href="/new-venture">BMC-91 filings</Link>
          </div>
        </div>
      </section>
      <section className="site-section section-soft">
        <div className="site-container">
          <div className="home-trust">
            <div>
              <p className="section-kicker">A person, not a call center</p>
              <h2 className="section-heading">
                Insurance is complicated.
                <br />
                Working with us shouldn&apos;t be.
              </h2>
              <p className="section-description">
                Tell us about your operation. We organize the submission,
                approach suitable markets, and keep you updated as options come
                back.
              </p>
              <ul className="trust-list">
                {[
                  "One contact from quote to renewal",
                  "DOT lookup to reduce repeat questions",
                  "English, Russian, Ukrainian & Romanian",
                ].map((t) => (
                  <li key={t}>
                    <Check size={17} aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
              <Link href="/about" className="text-link">
                Meet Dmitri and Supreme
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <ol className="home-steps">
              {[
                [
                  "Tell us what you haul",
                  "Start with your DOT number and the coverage you need.",
                ],
                [
                  "We shop suitable markets",
                  "We compare options around your equipment, drivers, and routes.",
                ],
                [
                  "Choose with clear answers",
                  "Review your options with an agent before you decide.",
                ],
              ].map(([title, body], i) => (
                <li key={title}>
                  <span>0{i + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="google-line">
            <p>Get to know Supreme through our Google Business profile.</p>
            <a
              href={googleBusinessUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              View on Google
              <ExternalLink size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
      <section className="site-section">
        <div className="site-container state-band">
          <div>
            <p className="section-kicker">
              From your home base to your next load
            </p>
            <h2 className="section-heading">Trucking insurance by state.</h2>
            <p className="section-description">
              Local requirements and market options for your operation.
              Available in most states where licensed.
            </p>
          </div>
          <StateFinder
            states={[...statePages]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(({ name, slug }) => ({ name, slug }))}
          />
        </div>
      </section>
      <section className="site-section section-soft">
        <div className="site-container">
          <div className="section-header">
            <div>
              <p className="section-kicker">Before you buy</p>
              <h2 className="section-heading">
                Useful answers. Plain English.
              </h2>
            </div>
            <Link href="/blog" className="text-link">
              All guides & news
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="home-guides">
            {featuredBlogPosts.slice(0, 3).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <p className="section-kicker">{post.category}</p>
                <h3>{post.title}</h3>
                <span className="text-link">
                  Read guide
                  <ArrowRight size={15} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="home-final">
        <div className="site-container">
          <div>
            <h2>Let&apos;s get your next quote moving.</h2>
            <p>A trucking specialist is one request away.</p>
          </div>
          <Link href="/quote" className="button-primary">
            Get a Free Quote
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
