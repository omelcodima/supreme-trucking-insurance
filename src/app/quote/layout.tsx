import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Commercial Truck Insurance Quote | Supreme Trucking",
  description:
    "Request a commercial trucking insurance quote for an owner-operator, fleet, new authority, cargo, or physical damage coverage.",
  alternates: {
    canonical: "/quote",
  },
};

export default function QuoteLayout({ children }: { children: ReactNode }) {
  return children;
}
