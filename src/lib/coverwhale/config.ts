import "server-only";

const ALLOWED_BASE_URLS = new Set([
  "https://api.coverwhale.dev/v1",
  "https://api.coverwhale.com/v1",
]);

const DEFAULT_REQUEST_TIMEOUT_MS = 10_000;
const MAX_REQUEST_TIMEOUT_MS = 120_000;

type CoverWhaleEnvironment = Readonly<Record<string, string | undefined>>;

export interface CoverWhaleBaseConfig {
  baseUrl: string;
  requestTimeoutMs: number;
}

export interface CoverWhaleAuthConfig extends CoverWhaleBaseConfig {
  username: string;
  password: string;
}

function readBaseUrl(environment: CoverWhaleEnvironment): string {
  const configured = environment.COVERWHALE_BASE_URL;
  const normalized = configured?.endsWith("/")
    ? configured.slice(0, -1)
    : configured;

  if (!normalized || !ALLOWED_BASE_URLS.has(normalized)) {
    throw new Error(
      "COVERWHALE_BASE_URL must be an approved CoverWhale HTTPS API URL",
    );
  }

  return normalized;
}

function readRequestTimeout(environment: CoverWhaleEnvironment): number {
  const configured = environment.COVERWHALE_REQUEST_TIMEOUT_MS;
  if (configured === undefined || configured === "") {
    return DEFAULT_REQUEST_TIMEOUT_MS;
  }

  if (!/^\d+$/.test(configured)) {
    throw new Error("COVERWHALE_REQUEST_TIMEOUT_MS must be a positive integer");
  }

  const timeout = Number(configured);
  if (timeout <= 0 || timeout > MAX_REQUEST_TIMEOUT_MS) {
    throw new Error(
      `COVERWHALE_REQUEST_TIMEOUT_MS must be between 1 and ${MAX_REQUEST_TIMEOUT_MS}`,
    );
  }

  return timeout;
}

export function getCoverWhaleBaseConfig(
  environment: CoverWhaleEnvironment = process.env,
): CoverWhaleBaseConfig {
  return {
    baseUrl: readBaseUrl(environment),
    requestTimeoutMs: readRequestTimeout(environment),
  };
}

export function getCoverWhaleAuthConfig(
  environment: CoverWhaleEnvironment = process.env,
): CoverWhaleAuthConfig {
  const baseConfig = getCoverWhaleBaseConfig(environment);
  const username = environment.COVERWHALE_USERNAME;
  const password = environment.COVERWHALE_PASSWORD;

  if (!username) {
    throw new Error("COVERWHALE_USERNAME is required for authentication");
  }
  if (!password) {
    throw new Error("COVERWHALE_PASSWORD is required for authentication");
  }

  return { ...baseConfig, username, password };
}
