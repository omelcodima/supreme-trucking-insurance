"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import BrandLogo from "./BrandLogo";

type NavigationLink = { href: string; label: string; detail?: string };
const services: NavigationLink[] = [
  {
    href: "/services",
    label: "Coverage overview",
    detail: "Your truck, cargo, and liability.",
  },
  {
    href: "/owner-operator",
    label: "Owner operators",
    detail: "Your truck. Your business.",
  },
  {
    href: "/fleet",
    label: "Fleet insurance",
    detail: "Coverage that grows with you.",
  },
  {
    href: "/new-venture",
    label: "New authority",
    detail: "Your first policy and filings.",
  },
  {
    href: "/cargo",
    label: "Cargo insurance",
    detail: "Protection for the freight you haul.",
  },
];
const resources: NavigationLink[] = [
  { href: "/instant-indication", label: "Instant indication" },
  { href: "/blog", label: "Guides & news" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [openedOn, setOpenedOn] = useState(pathname);
  const header = useRef<HTMLElement>(null);
  const activeMenu = openedOn === pathname ? open : null;
  function toggle(menu: string) {
    setOpenedOn(pathname);
    setOpen(activeMenu === menu ? null : menu);
  }
  useEffect(() => {
    function outside(event: PointerEvent) {
      if (!header.current?.contains(event.target as Node)) setOpen(null);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);

  return (
    <header
      className="site-header"
      ref={header}
      onKeyDown={(event) => {
        if (event.key === "Escape" && activeMenu) {
          header.current
            ?.querySelector<HTMLButtonElement>(
              `[aria-controls="nav-${activeMenu}"]`,
            )
            ?.focus();
          setOpen(null);
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node))
          setOpen(null);
      }}
    >
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <nav className="site-container header-row" aria-label="Main navigation">
        <BrandLogo compact />
        <div className="desktop-nav">
          {[
            { name: "Services", key: "services", links: services },
            { name: "Resources", key: "resources", links: resources },
          ].map((group) => (
            <div className="nav-group" key={group.key}>
              <button
                type="button"
                className="nav-trigger"
                aria-expanded={activeMenu === group.key}
                aria-controls={`nav-${group.key}`}
                onClick={() => toggle(group.key)}
              >
                {group.name}
                <ChevronDown size={15} aria-hidden="true" />
              </button>
              <div
                id={`nav-${group.key}`}
                className="nav-dropdown"
                hidden={activeMenu !== group.key}
              >
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(null)}
                    aria-current={pathname === link.href ? "page" : undefined}
                  >
                    <span>{link.label}</span>
                    {link.detail ? <small>{link.detail}</small> : null}
                  </Link>
                ))}
                {group.key === "services" && (
                  <Link
                    href="/trucking-insurance"
                    onClick={() => setOpen(null)}
                  >
                    Coverage by state
                  </Link>
                )}
              </div>
            </div>
          ))}
          <Link
            href="/coi-request"
            aria-current={pathname === "/coi-request" ? "page" : undefined}
          >
            COI Request
          </Link>
          <Link
            href="/about"
            aria-current={pathname === "/about" ? "page" : undefined}
          >
            About
          </Link>
        </div>
        <div className="header-actions">
          <a className="header-phone" href="tel:+13609367196">
            <Phone size={16} aria-hidden="true" />
            (360) 936-7196
          </a>
          <Link href="/quote" className="button-primary header-quote">
            Get a Quote
          </Link>
          <button
            type="button"
            className="icon-button mobile-menu-button"
            aria-label={activeMenu === "mobile" ? "Close menu" : "Open menu"}
            title={activeMenu === "mobile" ? "Close menu" : "Open menu"}
            aria-expanded={activeMenu === "mobile"}
            aria-controls="nav-mobile"
            onClick={() => toggle("mobile")}
          >
            {activeMenu === "mobile" ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <div
          id="nav-mobile"
          className="mobile-nav"
          hidden={activeMenu !== "mobile"}
        >
          <div>
            <p className="nav-label">Services</p>
            {services.map((link) => (
              <Link
                href={link.href}
                key={link.href}
                onClick={() => setOpen(null)}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/trucking-insurance" onClick={() => setOpen(null)}>
              Coverage by state
            </Link>
          </div>
          <div>
            <p className="nav-label">Company & resources</p>
            {[
              { href: "/coi-request", label: "COI Request" },
              { href: "/about", label: "About Supreme" },
              ...resources,
            ].map((link) => (
              <Link
                href={link.href}
                key={link.href}
                onClick={() => setOpen(null)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <a href="tel:+13609367196" className="mobile-nav-call">
            <Phone size={18} aria-hidden="true" />
            (360) 936-7196
          </a>
          <p className="language-note">
            English · Russian · Ukrainian · Romanian
          </p>
        </div>
      </nav>
    </header>
  );
}
