import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import PromoPlayer from "./PromoPlayer";
import HeroScene from "./HeroScene";
import { serviceAreaSummary } from "@/lib/serviceArea";
import type { HomepageVariant } from "@/lib/homepageDesignValues";

export default function HomeHero({ variant }: { variant: HomepageVariant }) {
  const cinematic = variant === "cinematic";
  return (
    <>
      <section className={`home-hero${cinematic ? " home-hero--cinematic" : ""}`} data-homepage-design={variant}>
        <Image
          src={cinematic ? "/images/hero-cinematic.webp" : "/images/hero-premium.jpg"}
          alt="A tractor-trailer on the open highway"
          fill priority sizes="100vw" className="home-hero-image"
        />
        {!cinematic && <HeroScene />}
        <div className="home-hero-shade" />
        <div className="site-container home-hero-inner">
          <div className="home-hero-copy">
            <p className="hero-kicker">For the business behind the wheel</p>
            <h1>
              <span className="hero-brand-name">Supreme</span>
              <span className="hero-brand-category">Trucking Insurance.</span>
            </h1>
            <p>Independent agents. Trucking-focused markets. Clear answers for owner operators, fleets, and new authority.</p>
            <div className="hero-buttons">
              <Link href="/quote" className="button-primary">
                Get a Free Quote <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <a href="tel:+13609367196" className="hero-call">
                <Phone size={17} aria-hidden="true" /> (360) 936-7196
              </a>
            </div>
            {cinematic && <p className="hero-service-area">{serviceAreaSummary}</p>}
            <PromoPlayer />
          </div>
        </div>
      </section>
      {cinematic && (
        <nav className="hero-operation-strip" aria-label="Find coverage for your business">
          <div className="site-container">
            <span>Built around your operation.</span>
            <Link href="/owner-operator">Owner operators <ArrowRight size={15} aria-hidden="true" /></Link>
            <Link href="/fleet">Fleets <ArrowRight size={15} aria-hidden="true" /></Link>
            <Link href="/new-venture">New authority <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
        </nav>
      )}
    </>
  );
}
