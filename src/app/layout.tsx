import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import Analytics from "@/components/Analytics";
import ClarityAnalytics from "@/components/ClarityAnalytics";
import OpenAIAdsEvents from "@/components/OpenAIAdsEvents";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SiteActions from "@/components/SiteActions";
import { OPENAI_ADS_PIXEL_ID } from "@/lib/openaiAds";
import { defaultOgImage, siteName, siteUrl } from "@/lib/seo";
import { organizationSameAs } from "@/lib/socialProfiles";
import { servedStateAreas } from "@/lib/serviceArea";
import { agencyFacts } from "@/lib/agencyFacts";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "InsuranceAgency",
  "@id": "https://supremetruckinginsurance.com/#insurance-agency",
  name: agencyFacts.name,
  legalName: agencyFacts.legalName,
  description: agencyFacts.description,
  url: "https://supremetruckinginsurance.com",
  logo: "https://supremetruckinginsurance.com/images/supreme-brand-mark.png",
  telephone: agencyFacts.telephone,
  email: agencyFacts.email,
  address: agencyFacts.address,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Quotes and policy service",
    telephone: agencyFacts.telephone,
    email: agencyFacts.email,
    availableLanguage: agencyFacts.languages,
  },
  areaServed: servedStateAreas,
  sameAs: organizationSameAs,
  knowsAbout: [
    "Commercial truck insurance",
    "Owner operator insurance",
    "Fleet trucking insurance",
    "New authority trucking insurance",
    "Motor truck cargo insurance",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Trucking Insurance for Owner-Operators and Fleets | Supreme",
  description:
    "Trucking insurance for owner-operators, fleets, and new authority. Serving businesses in 48 states, excluding Alaska and Hawaii. Start a quote with Supreme.",
  keywords: [
    "trucking insurance",
    "commercial truck insurance",
    "owner operator insurance",
    "fleet truck insurance",
    "new authority truck insurance",
    "motor truck cargo insurance",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: "Supreme Trucking Insurance",
    description:
      "Commercial trucking insurance for owner-operators, fleets, and new authority. Serving 48 states, excluding Alaska and Hawaii.",
    images: [{ url: defaultOgImage, width: 1200, height: 630, alt: siteName }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Supreme Trucking Insurance",
    description:
      "Commercial trucking insurance for owner-operators, fleets, and new authority. Serving 48 states, excluding Alaska and Hawaii.",
    images: [defaultOgImage],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className} data-clarity-mask="true">
        <Script id="openai-ads-measurement-pixel" strategy="beforeInteractive">
          {`
            (function (w, d, s, u) {
              if (w.oaiq) return;
              var q = function () { q.q.push(arguments); };
              q.q = [];
              w.oaiq = q;
              var js = d.createElement(s);
              js.async = true;
              js.src = u;
              var f = d.getElementsByTagName(s)[0];
              f.parentNode.insertBefore(js, f);
            })(window, document, "script", "https://bzrcdn.openai.com/sdk/oaiq.min.js");
            oaiq("init", { pixelId: "${OPENAI_ADS_PIXEL_ID}" });
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <OpenAIAdsEvents />
        <Analytics />
        <ClarityAnalytics />
        <SiteHeader />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <SiteFooter />
        <SiteActions />
      </body>
    </html>
  );
}
