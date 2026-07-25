import "server-only";

import type { ZodType } from "zod";

import { redactSecrets } from "./redaction.ts";
import {
  AuthErrorSchema,
  AuthResponseSchema,
  StatusErrorSchema,
  ValidationErrorSchema,
  type CoverWhaleAuthResponse,
} from "./schemas.ts";

export type CoverWhaleHttpMethod =
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE";

type MaybePromise<T> = T | Promise<T>;

export interface CoverWhaleTokenProvider {
  getAccessToken(): MaybePromise<string | undefined>;
  refreshAccessToken(): MaybePromise<string>;
}

export interface CoverWhaleClientOptions {
  baseUrl: string;
  requestTimeoutMs?: number;
  maxSafeRetries?: number;
  maxRetryAfterMs?: number;
  fetch?: typeof globalThis.fetch;
  tokenProvider?: CoverWhaleTokenProvider;
  now?: () => number;
  sleep?: (milliseconds: number) => Promise<void>;
  backoff?: (retryAttempt: number) => number;
  setTimeout?: (callback: () => void, milliseconds: number) => unknown;
  clearTimeout?: (handle: unknown) => void;
}

export interface CoverWhaleRequestOptions<T> {
  body?: unknown;
  schema?: ZodType<T>;
  accessToken?: string;
  tokenProvider?: CoverWhaleTokenProvider;
  unauthenticated?: boolean;
  timeoutMs?: number;
}

type AmbiguousReason = "network" | "timeout" | "server";
type VendorErrorType = "validation" | "status" | "auth" | "unknown";

export class CoverWhaleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class CoverWhaleHttpError extends CoverWhaleError {
  readonly status: number;
  readonly fieldErrors?: unknown;
  readonly vendorErrorType: VendorErrorType;

  constructor(
    status: number,
    options: { fieldErrors?: unknown; vendorErrorType?: VendorErrorType } = {},
  ) {
    super(`CoverWhale request failed with status ${status}`);
    this.status = status;
    this.fieldErrors = options.fieldErrors;
    this.vendorErrorType = options.vendorErrorType ?? "unknown";
  }
}

export class CoverWhaleTimeoutError extends CoverWhaleError {
  constructor() {
    super("CoverWhale request timed out");
  }
}

export class CoverWhaleTokenProviderError extends CoverWhaleError {
  constructor() {
    super("CoverWhale token provider failed");
  }
}

export class CoverWhaleMissingAccessTokenError extends CoverWhaleError {
  constructor() {
    super("CoverWhale access token is required");
  }
}

export class CoverWhaleAmbiguousMutationError extends CoverWhaleError {
  readonly reason: AmbiguousReason;
  readonly status?: number;

  constructor(reason: AmbiguousReason, status?: number) {
    super("CoverWhale mutation outcome is unknown; reconcile before retrying");
    this.reason = reason;
    this.status = status;
  }
}

export class CoverWhaleResponseSchemaError extends CoverWhaleError {
  constructor() {
    super("CoverWhale response did not match the expected contract");
  }
}

class RequestTimedOut extends Error {}

const SAFE_METHODS = new Set<CoverWhaleHttpMethod>(["GET", "HEAD"]);
const TRANSIENT_STATUS_MIN = 500;
const TRANSIENT_STATUS_MAX = 599;
const DEFAULT_TIMEOUT_MS = 10_000;
const MAX_REQUEST_TIMEOUT_MS = 120_000;
const DEFAULT_MAX_SAFE_RETRIES = 2;
const MAX_SAFE_RETRIES = 5;
const DEFAULT_MAX_RETRY_AFTER_MS = 5_000;
const MAX_RETRY_AFTER_MS = 120_000;
const SENSITIVE_BODY_KEYS = new Set([
  "password",
  "authorization",
  "accesstoken",
  "refreshtoken",
  "cookie",
  "setcookie",
]);

function normalizeSensitiveKey(key: string): string {
  return key.toLowerCase().replaceAll("_", "").replaceAll("-", "");
}

function collectSensitiveBodyValues(
  value: unknown,
  result: Set<string> = new Set(),
  seen: WeakSet<object> = new WeakSet(),
): Set<string> {
  if (value === null || typeof value !== "object") {
    return result;
  }
  if (seen.has(value)) {
    return result;
  }
  seen.add(value);

  if (Array.isArray(value)) {
    for (const item of value) {
      collectSensitiveBodyValues(item, result, seen);
    }
    return result;
  }

  for (const [key, nestedValue] of Object.entries(value)) {
    if (
      SENSITIVE_BODY_KEYS.has(normalizeSensitiveKey(key)) &&
      typeof nestedValue === "string" &&
      nestedValue.length > 0
    ) {
      result.add(nestedValue);
    } else {
      collectSensitiveBodyValues(nestedValue, result, seen);
    }
  }
  return result;
}

function ensureRequestTimeout(value: number, name: string): number {
  if (
    !Number.isSafeInteger(value) ||
    value < 1 ||
    value > MAX_REQUEST_TIMEOUT_MS
  ) {
    throw new Error(`${name} must be between 1 and ${MAX_REQUEST_TIMEOUT_MS}`);
  }
  return value;
}

function normalizeBaseUrl(baseUrl: string): string {
  const normalized = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  if (
    normalized !== "https://api.coverwhale.dev/v1" &&
    normalized !== "https://api.coverwhale.com/v1"
  ) {
    throw new Error("baseUrl must be an approved CoverWhale HTTPS API URL");
  }
  return normalized;
}

function repeatedlyDecode(pathname: string): string {
  let decoded = pathname;
  for (let attempt = 0; attempt <= pathname.length; attempt += 1) {
    const next = decodeURIComponent(decoded);
    if (next === decoded) {
      return decoded;
    }
    decoded = next;
  }
  return decoded;
}

function buildApiUrl(baseUrl: string, path: string): string {
  if (
    !path ||
    path.includes("\\") ||
    path.includes("#") ||
    path.startsWith("//") ||
    /^[a-z][a-z\d+.-]*:/i.test(path)
  ) {
    throw new Error("CoverWhale path must be a relative API path inside /v1");
  }

  const [rawPathname] = path.split("?", 1);
  const relativePath = rawPathname.startsWith("/")
    ? rawPathname.slice(1)
    : rawPathname;

  if (!relativePath || relativePath.startsWith("/")) {
    throw new Error("CoverWhale path must be a relative API path inside /v1");
  }

  let decoded: string;
  try {
    decoded = repeatedlyDecode(relativePath);
  } catch {
    throw new Error("CoverWhale path must be a relative API path inside /v1");
  }

  const decodedSegments = decoded.replaceAll("\\", "/").split("/");
  if (decodedSegments.some((segment) => segment === "." || segment === "..")) {
    throw new Error("CoverWhale path must be a relative API path inside /v1");
  }

  const url = new URL(path.startsWith("/") ? path.slice(1) : path, `${baseUrl}/`);
  if (
    url.origin !== new URL(baseUrl).origin ||
    !url.pathname.startsWith("/v1/")
  ) {
    throw new Error("CoverWhale path must be a relative API path inside /v1");
  }

  return url.toString();
}

function isTransientStatus(status: number): boolean {
  return status === 429 ||
    (status >= TRANSIENT_STATUS_MIN && status <= TRANSIENT_STATUS_MAX);
}

function ensureBoundedInteger(
  value: number,
  name: string,
  maximum: number,
): number {
  if (!Number.isSafeInteger(value) || value < 0 || value > maximum) {
    throw new Error(`${name} must be between 0 and ${maximum}`);
  }
  return value;
}

export class CoverWhaleClient {
  private readonly baseUrl: string;
  private readonly requestTimeoutMs: number;
  private readonly maxSafeRetries: number;
  private readonly maxRetryAfterMs: number;
  private readonly fetchImplementation: typeof globalThis.fetch;
  private readonly defaultTokenProvider?: CoverWhaleTokenProvider;
  private readonly now: () => number;
  private readonly sleep: (milliseconds: number) => Promise<void>;
  private readonly backoff: (retryAttempt: number) => number;
  private readonly setTimeoutImplementation: (
    callback: () => void,
    milliseconds: number,
  ) => unknown;
  private readonly clearTimeoutImplementation: (handle: unknown) => void;

  constructor(options: CoverWhaleClientOptions) {
    this.baseUrl = normalizeBaseUrl(options.baseUrl);
    this.requestTimeoutMs = ensureRequestTimeout(
      options.requestTimeoutMs ?? DEFAULT_TIMEOUT_MS,
      "requestTimeoutMs",
    );
    this.maxSafeRetries = ensureBoundedInteger(
      options.maxSafeRetries ?? DEFAULT_MAX_SAFE_RETRIES,
      "maxSafeRetries",
      MAX_SAFE_RETRIES,
    );
    this.maxRetryAfterMs = ensureBoundedInteger(
      options.maxRetryAfterMs ?? DEFAULT_MAX_RETRY_AFTER_MS,
      "maxRetryAfterMs",
      MAX_RETRY_AFTER_MS,
    );
    this.fetchImplementation = options.fetch ?? globalThis.fetch;
    this.defaultTokenProvider = options.tokenProvider;
    this.now = options.now ?? Date.now;
    this.sleep = options.sleep ?? ((milliseconds) =>
      new Promise((resolve) => globalThis.setTimeout(resolve, milliseconds)));
    this.backoff = options.backoff ?? ((retryAttempt) => 100 * 2 ** (retryAttempt - 1));
    this.setTimeoutImplementation = options.setTimeout ??
      ((callback, milliseconds) => globalThis.setTimeout(callback, milliseconds));
    this.clearTimeoutImplementation = options.clearTimeout ??
      ((handle) => globalThis.clearTimeout(handle as ReturnType<typeof setTimeout>));
  }

  async health(): Promise<unknown> {
    return this.requestJson("GET", "/health", { unauthenticated: true });
  }

  async authenticate(
    username: string,
    password: string,
  ): Promise<CoverWhaleAuthResponse> {
    return this.requestJson("POST", "/authentication", {
      unauthenticated: true,
      body: { username, password },
      schema: AuthResponseSchema,
    });
  }

  async refresh(
    username: string,
    refreshToken: string,
  ): Promise<CoverWhaleAuthResponse> {
    return this.requestJson("POST", "/authentication", {
      unauthenticated: true,
      body: { username, refresh_token: refreshToken },
      schema: AuthResponseSchema,
    });
  }

  async requestJson<T = unknown>(
    method: CoverWhaleHttpMethod,
    path: string,
    options: CoverWhaleRequestOptions<T> = {},
  ): Promise<T> {
    const url = buildApiUrl(this.baseUrl, path);
    const timeoutMs = ensureRequestTimeout(
      options.timeoutMs ?? this.requestTimeoutMs,
      "timeoutMs",
    );
    const safeMethod = SAFE_METHODS.has(method);
    const tokenProvider = options.tokenProvider ?? this.defaultTokenProvider;
    const sensitiveValues = collectSensitiveBodyValues(options.body);
    let accessToken = options.accessToken;
    if (!options.unauthenticated && accessToken === undefined && tokenProvider) {
      accessToken = await this.readAccessToken(tokenProvider);
    }
    if (
      !options.unauthenticated &&
      (accessToken === undefined || accessToken.trim() === "")
    ) {
      throw new CoverWhaleMissingAccessTokenError();
    }
    if (accessToken) {
      sensitiveValues.add(accessToken);
    }

    let safeRetries = 0;
    let refreshed = false;

    while (true) {
      let response: Response;
      try {
        response = await this.fetchWithTimeout(
          url,
          method,
          options,
          accessToken,
          timeoutMs,
        );
      } catch (error) {
        const timedOut = error instanceof RequestTimedOut;
        if (safeMethod && safeRetries < this.maxSafeRetries) {
          safeRetries += 1;
          await this.sleepForRetry(safeRetries);
          continue;
        }
        if (!safeMethod) {
          throw new CoverWhaleAmbiguousMutationError(
            timedOut ? "timeout" : "network",
          );
        }
        if (timedOut) {
          throw new CoverWhaleTimeoutError();
        }
        throw new CoverWhaleError("CoverWhale network request failed");
      }

      if (
        response.status === 401 &&
        !options.unauthenticated &&
        tokenProvider &&
        !refreshed
      ) {
        await this.releaseResponse(response);
        accessToken = await this.refreshAccessToken(tokenProvider);
        sensitiveValues.add(accessToken);
        refreshed = true;
        continue;
      }

      if (isTransientStatus(response.status)) {
        if (safeMethod && safeRetries < this.maxSafeRetries) {
          safeRetries += 1;
          await this.releaseResponse(response);
          await this.sleepForRetry(
            safeRetries,
            response.headers.get("retry-after"),
          );
          continue;
        }
        if (!safeMethod && response.status >= 500) {
          await this.releaseResponse(response);
          throw new CoverWhaleAmbiguousMutationError("server", response.status);
        }
      }

      const payload = await this.readPayload(response);
      if (!response.ok) {
        throw this.createHttpError(response.status, payload, sensitiveValues);
      }

      if (!options.schema) {
        return payload as T;
      }

      const parsed = options.schema.safeParse(payload);
      if (!parsed.success) {
        throw new CoverWhaleResponseSchemaError();
      }
      return parsed.data;
    }
  }

  private async fetchWithTimeout<T>(
    url: string,
    method: CoverWhaleHttpMethod,
    options: CoverWhaleRequestOptions<T>,
    accessToken: string | undefined,
    timeoutMs: number,
  ): Promise<Response> {
    const controller = new AbortController();
    const headers = new Headers({ Accept: "application/json" });
    if (options.body !== undefined) {
      headers.set("Content-Type", "application/json");
    }
    if (!options.unauthenticated && accessToken) {
      headers.set("AccessToken", accessToken);
    }

    const fetchPromise = Promise.resolve().then(() =>
      this.fetchImplementation(url, {
        method,
        redirect: "manual",
        headers,
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        signal: controller.signal,
      }));

    let timedOut = false;
    let timer: unknown;
    const timeoutPromise = new Promise<never>((_resolve, reject) => {
      timer = this.setTimeoutImplementation(() => {
        timedOut = true;
        controller.abort();
        reject(new RequestTimedOut());
      }, timeoutMs);
    });

    try {
      return await Promise.race([fetchPromise, timeoutPromise]);
    } catch (error) {
      if (
        timedOut ||
        (controller.signal.aborted &&
          error instanceof DOMException &&
          error.name === "AbortError")
      ) {
        throw new RequestTimedOut();
      }
      throw error;
    } finally {
      this.clearTimeoutImplementation(timer);
    }
  }

  private async releaseResponse(response: Response): Promise<void> {
    try {
      await response.body?.cancel();
    } catch {
      // A failed cleanup must not mask the retry/reconciliation path.
    }
  }

  private async readAccessToken(
    tokenProvider: CoverWhaleTokenProvider,
  ): Promise<string | undefined> {
    try {
      return await tokenProvider.getAccessToken();
    } catch {
      throw new CoverWhaleTokenProviderError();
    }
  }

  private async refreshAccessToken(
    tokenProvider: CoverWhaleTokenProvider,
  ): Promise<string> {
    try {
      const accessToken = await tokenProvider.refreshAccessToken();
      if (!accessToken || accessToken.trim() === "") {
        throw new Error("empty token");
      }
      return accessToken;
    } catch {
      throw new CoverWhaleTokenProviderError();
    }
  }

  private async sleepForRetry(
    retryAttempt: number,
    retryAfter: string | null = null,
  ): Promise<void> {
    const delay = retryAfter === null
      ? this.backoff(retryAttempt)
      : this.parseRetryAfter(retryAfter);
    const boundedDelay = Math.min(
      this.maxRetryAfterMs,
      Math.max(0, Number.isFinite(delay) ? delay : 0),
    );
    await this.sleep(boundedDelay);
  }

  private parseRetryAfter(value: string): number {
    if (/^\d+(?:\.\d+)?$/.test(value)) {
      return Number(value) * 1_000;
    }

    const date = Date.parse(value);
    return Number.isNaN(date) ? 0 : Math.max(0, date - this.now());
  }

  private async readPayload(response: Response): Promise<unknown> {
    const text = await response.text();
    if (text === "") {
      return undefined;
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("json")) {
      return text;
    }

    try {
      return JSON.parse(text) as unknown;
    } catch {
      if (response.ok) {
        throw new CoverWhaleResponseSchemaError();
      }
      return undefined;
    }
  }

  private createHttpError(
    status: number,
    payload: unknown,
    sensitiveValues: ReadonlySet<string>,
  ): CoverWhaleHttpError {
    const validation = ValidationErrorSchema.safeParse(payload);
    if (validation.success) {
      return new CoverWhaleHttpError(status, {
        fieldErrors: redactSecrets(validation.data.errors, sensitiveValues),
        vendorErrorType: "validation",
      });
    }
    if (StatusErrorSchema.safeParse(payload).success) {
      return new CoverWhaleHttpError(status, { vendorErrorType: "status" });
    }
    if (AuthErrorSchema.safeParse(payload).success) {
      return new CoverWhaleHttpError(status, { vendorErrorType: "auth" });
    }
    return new CoverWhaleHttpError(status);
  }
}
