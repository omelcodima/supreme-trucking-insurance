"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import PromoPlayer from "./PromoPlayer";
import HeroScene from "./HeroScene";
import { serviceAreaSummary } from "@/lib/serviceArea";
import type { HomepageVariant } from "@/lib/homepageDesignValues";
import { regionScenes, regionalHeadline, regionIsServed } from "@/lib/regionalHero";
import useRegionalHero, { regionalForeground } from "./useRegionalHero";
import styles from "./RegionalHero.module.css";

export default function HomeHero({ variant }: { variant: HomepageVariant }) {
  const cinematic = variant === "cinematic";
  const { choice, choose, scene } = useRegionalHero();
  const available = !scene || regionIsServed(scene);
  return (
    <>
      <section className={`home-hero ${styles.root}${cinematic ? " home-hero--cinematic" : ""}`} data-homepage-design={variant} data-region={scene?.code || "national"}>
        {scene ? <div className={styles.scene} aria-hidden="true">
          <Image src={scene.asset} alt="" fill sizes="100vw" loading="eager" unoptimized className={styles.background} />
          <Image src={regionalForeground} alt="" fill sizes="100vw" loading="eager" unoptimized className={styles.foreground} />
        </div> : <Image
          src={cinematic ? "/images/hero-cinematic.webp" : "/images/hero-premium.jpg"}
          alt="A tractor-trailer on the open highway"
          fill priority sizes="100vw" className="home-hero-image"
        />}
        {!cinematic && !scene && <HeroScene />}
        <div className="home-hero-shade" />
        <div className="site-container home-hero-inner">
          <div className="home-hero-copy">
            <p className="hero-kicker">{regionalHeadline(scene)}</p>
            <h1>
              <span className="hero-brand-name">Supreme</span>
              <span className="hero-brand-category">Trucking Insurance.</span>
            </h1>
            <p>Independent agents. Trucking-focused markets. Clear answers for owner operators, fleets, and new authority.</p>
            <div className={styles.location}>
              <label htmlFor="hero-business-state"><MapPin size={15} aria-hidden="true" />Business state</label>
              <select id="hero-business-state" value={choice} onChange={event => choose(event.target.value)}>
                <option value="auto">Automatic (approximate)</option>
                <option value="national">National view</option>
                {regionScenes.map(state => <option key={state.code} value={state.code}>{state.name}</option>)}
              </select>
            </div>
            {!available && <p className={styles.unavailable}>We do not currently write policies for businesses based in {scene!.name}.</p>}
            <div className="hero-buttons">
              <Link href={available ? "/quote" : "/contact"} className="button-primary">
                {available ? "Get a Free Quote" : "Ask About Availability"} <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <a href="tel:+13609367196" className="hero-call">
                <Phone size={17} aria-hidden="true" /> (360) 936-7196
              </a>
            </div>
            <p className="hero-service-area">{serviceAreaSummary}</p>
            <PromoPlayer />
          </div>
        </div>
        {scene && <a className={styles.credit} href={`/image-credits#${scene.code}`} aria-label={`${scene.name}: ${scene.landmark}. View photo credits`}>{scene.name} · {scene.landmark}</a>}
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
