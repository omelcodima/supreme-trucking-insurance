import "server-only";

const REDACTED = "[REDACTED]";
const SENSITIVE_KEYS = new Set([
  "password",
  "authorization",
  "accesstoken",
  "refreshtoken",
  "cookie",
  "setcookie",
]);

function normalizeKey(key: string): string {
  return key.toLowerCase().replaceAll("_", "").replaceAll("-", "");
}

function redactString(value: string, sensitiveValues: readonly string[]): string {
  let redacted = value;
  for (const sensitiveValue of sensitiveValues) {
    redacted = redacted.split(sensitiveValue).join(REDACTED);
  }
  return redacted;
}

function redactValue(
  value: unknown,
  seen: WeakMap<object, unknown>,
  sensitiveValues: readonly string[],
): unknown {
  if (typeof value === "string") {
    return redactString(value, sensitiveValues);
  }
  if (value === null || typeof value !== "object") {
    return value;
  }

  const existing = seen.get(value);
  if (existing !== undefined) {
    return existing;
  }

  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  if (Array.isArray(value)) {
    const clone: unknown[] = [];
    seen.set(value, clone);
    for (const item of value) {
      clone.push(redactValue(item, seen, sensitiveValues));
    }
    return clone;
  }

  const clone: Record<string, unknown> = {};
  seen.set(value, clone);
  for (const [key, nestedValue] of Object.entries(value)) {
    clone[key] = SENSITIVE_KEYS.has(normalizeKey(key))
      ? REDACTED
      : redactValue(nestedValue, seen, sensitiveValues);
  }
  return clone;
}

export function redactSecrets(
  value: unknown,
  sensitiveValues: Iterable<string> = [],
): unknown {
  const uniqueValues = [...new Set(sensitiveValues)]
    .filter((candidate) => candidate.length > 0 && candidate !== REDACTED)
    .sort((left, right) => right.length - left.length);
  return redactValue(value, new WeakMap(), uniqueValues);
}
