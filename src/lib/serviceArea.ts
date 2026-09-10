import { servedStatePages } from "./statePages.ts";

// Agency service availability, not a representation of a policy's coverage territory.
export const serviceAreaSummary =
  "Serving trucking businesses in 48 states — excluding Alaska and Hawaii.";

export const servedStateAreas = servedStatePages.map(({ name }) => ({
  "@type": "State" as const,
  name,
}));
