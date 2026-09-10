export const assistantLinks = {
  services: { label: "Insurance services", href: "/services" },
  cargo: { label: "Cargo insurance", href: "/cargo" },
  liability: { label: "Commercial auto insurance", href: "/commercial-auto-insurance" },
  quote: { label: "Full application", href: "/quote?mode=full" },
  indication: { label: "Instant indication", href: "/instant-indication" },
  coi: { label: "Request a certificate", href: "/coi-request" },
  contact: { label: "Contact the agency", href: "/contact" },
} as const;
export type AssistantTopic = keyof typeof assistantLinks;
export type AssistantMessage = { role: "user" | "assistant"; content: string };
export type AssistantAnswer = { answer: string; topic: AssistantTopic };
