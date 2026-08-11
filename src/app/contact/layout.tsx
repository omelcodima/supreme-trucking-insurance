import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Contact Supreme Trucking Insurance",
  },
  description:
    "Contact Supreme Trucking Insurance for commercial trucking quotes, COI requests, policy documents, and service questions.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}