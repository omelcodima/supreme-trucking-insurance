"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, Phone, ArrowRight } from "lucide-react";
import { quoteHrefForPath } from "@/lib/quoteContext";

export default function SiteActions() {
  const pathname = usePathname();
  if (
    ["/quote", "/instant-indication", "/coi-request", "/contact"].includes(
      pathname,
    )
  )
    return null;
  return (
    <>
      <Link href="/instant-indication" className="indication-shortcut">
        <Calculator size={19} aria-hidden="true" />
        Instant indication
      </Link>
      <div className="mobile-actions">
        <Link href={quoteHrefForPath(pathname)} className="button-primary">
          Get a Quote
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
        <a href="tel:+13609367196" className="button-secondary">
          <Phone size={17} aria-hidden="true" />
          Call
        </a>
      </div>
    </>
  );
}
