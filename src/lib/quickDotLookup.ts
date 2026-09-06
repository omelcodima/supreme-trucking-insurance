export type QuickCarrier = {
  legalName: string;
  dotNumber: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  statusCode: string;
};

export function normalizeQuickDot(value: string) {
  return value.trim().replace(/^0+(?=\d)/, "");
}

export function validQuickDot(value: string) {
  return /^\d{2,9}$/.test(normalizeQuickDot(value));
}

export function parseQuickCarrier(value: unknown, requestedDot: string): QuickCarrier | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  if (data.ok !== true || !data.carrier || typeof data.carrier !== "object") return null;
  const carrier = data.carrier as Record<string, unknown>;
  const text = (key: string) => typeof carrier[key] === "string" ? carrier[key].trim().slice(0, 240) : "";
  const dotNumber = normalizeQuickDot(text("dotNumber"));
  const legalName = text("legalName");
  if (!legalName || !validQuickDot(dotNumber) || dotNumber !== normalizeQuickDot(requestedDot)) return null;
  return { legalName, dotNumber, street: text("street"), city: text("city"), state: text("state"), zip: text("zip"), statusCode: text("statusCode") };
}

export function clearConfirmedCompany(company: string, previous: QuickCarrier | null) {
  return previous && company === previous.legalName ? "" : company;
}
