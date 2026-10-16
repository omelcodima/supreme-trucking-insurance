"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, ArrowRight } from "lucide-react";
import WebsiteAssistant from "./WebsiteAssistant";
import { quoteHrefForPath } from "@/lib/quoteContext";

export default function SiteActions({ voiceEnabled = false }: { voiceEnabled?: boolean }) {
  const pathname = usePathname() ?? "/";
  const formPage = ["/quote", "/instant-indication", "/coi-request", "/contact"].includes(pathname);
  return (
    <>
      <WebsiteAssistant key={pathname} formPage={formPage} voiceEnabled={voiceEnabled} />
      {!formPage && <div className="mobile-actions">
        <Link href={quoteHrefForPath(pathname)} className="button-primary">
          Get a Quote
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
        <a href="tel:+13609367196" className="button-secondary">
          <Phone size={17} aria-hidden="true" />
          Call
        </a>
      </div>}
    </>
  );
}
