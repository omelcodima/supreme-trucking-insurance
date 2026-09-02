import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Instant Truck Insurance Indication | Supreme Trucking",
  description:
    "Use a DOT number and operating details to prepare a non-binding commercial truck insurance indication and quote checklist.",
  alternates: {
    canonical: "/instant-indication",
  },
};

export default function InstantIndicationLayout({ children }: { children: ReactNode }) {
  return children;
}
