const DEFAULT_READ_TIME = "4 min read";
const MAX_REASONABLE_MINUTES = 60;

export function normalizeReadTime(value: unknown): string {
  let minutes: number | undefined;

  if (typeof value === "number" && Number.isFinite(value)) {
    minutes = Math.round(value);
  } else if (typeof value === "string") {
    const match = value
      .trim()
      .match(/^(\d+(?:\.\d+)?)\s*(?:min(?:ute)?s?(?:\s+read)?)?$/i);
    if (match) {
      minutes = Math.round(Number(match[1]));
    }
  }

  if (!minutes || minutes < 1 || minutes > MAX_REASONABLE_MINUTES) {
    return DEFAULT_READ_TIME;
  }

  return `${minutes} min read`;
}
