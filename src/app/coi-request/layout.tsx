import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Request a Certificate of Insurance | Supreme Trucking" },
  description: "Request a certificate of insurance from Supreme Trucking Insurance. Send certificate holder details and delivery instructions for review by our team.",
  alternates: { canonical: "/coi-request" },
};

export default function CoiRequestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
