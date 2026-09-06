export const coverageOptions = [
  "Primary Liability Only",
  "Primary Liability + Cargo",
  "Motor Truck Cargo",
  "Physical Damage Only",
  "Full Coverage (Liability + Physical Damage + Cargo)",
  "Bobtail / Non-Trucking",
  "Occupational Accident",
  "General Liability",
  "Not Sure — Help Me Decide",
];

const serviceCoverage: Record<string, string> = {
  "/cargo": "Motor Truck Cargo",
  "/commercial-auto-insurance": "Primary Liability Only",
  "/bobtail-insurance": "Bobtail / Non-Trucking",
};

export function quoteHrefForPath(path: string) {
  const params = new URLSearchParams();
  if (serviceCoverage[path]) params.set("coverage", serviceCoverage[path]);
  if (["/fleet", "/owner-operator", "/new-venture"].includes(path))
    params.set("operation", path.slice(1));
  return params.size ? `/quote?${params}` : "/quote";
}

export function validCoverage(value?: string) {
  return value && coverageOptions.includes(value) ? value : "";
}
