#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, readFile, rename, stat, unlink } from "node:fs/promises";
import https from "node:https";
import path from "node:path";
import process from "node:process";

import sharp from "sharp";

import {
  OPENAI_BLOG_IMAGE_MODEL,
  OPENAI_BLOG_IMAGE_PROVIDER,
  OPENAI_BLOG_IMAGE_SIZE,
  buildOpenAiBlogPrompt,
  buildOpenAiImageRequest,
  decodeOpenAiImageResponse,
  getStableBlogImagePath,
  getStableBlogImageUrl,
  isRepositoryBackedBlogImage,
  isScheduledOpenAiUpgrade,
  needsOpenAiUpgrade,
} from "../src/lib/blogHero.ts";
import { parseOptionalSlugArg } from "../src/lib/blogWorkerArgs.ts";

const MAX_INPUT_BYTES = 64 * 1024;
const MAX_IMAGE_BYTES = 30 * 1024 * 1024;
const MAX_GATEWAY_RESPONSE_BYTES = 48 * 1024 * 1024;
const MAX_AIRTABLE_RESPONSE_BYTES = 10 * 1024 * 1024;
const IMAGE_GENERATION_TIMEOUT_MS = 5 * 60_000;
const AIRTABLE_TIMEOUT_MS = 45_000;
const USER_AGENT = "Supreme-Trucking-Insurance-OpenAI-Image-Worker/1.0";
const IMAGE_GATEWAY_URL = "https://ai-gateway.vercel.sh/v1/images/generations";

function requiredEnvironment(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function airtableConfig() {
  return {
    apiKey: requiredEnvironment("AIRTABLE_API_KEY"),
    baseId: requiredEnvironment("AIRTABLE_BASE_ID"),
    tableName: process.env.AIRTABLE_BLOG_TABLE_NAME?.trim() || "Blog Posts",
  };
}

function field(record, name) {
  const value = record?.fields?.[name];
  return typeof value === "string" ? value.trim() : "";
}

function jsonOutput(value) {
  process.stdout.write(`${JSON.stringify(value)}\n`);
}

function airtableTableUrl(config, suffix = "") {
  const table = encodeURIComponent(config.tableName);
  return `https://api.airtable.com/v0/${config.baseId}/${table}${suffix}`;
}

async function airtableRequest(url, config, init = {}) {
  const body = typeof init.body === "string" || Buffer.isBuffer(init.body) ? init.body : undefined;
  return new Promise((resolve, reject) => {
    const request = https.request(url, {
      method: init.method || "GET",
      // The worker host has no usable IPv6 route; Undici's family selection can
      // exhaust its connect budget before reaching Airtable's working IPv4 IPs.
      family: 4,
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": USER_AGENT,
        ...(body ? { "Content-Length": Buffer.byteLength(body) } : {}),
        ...(init.headers || {}),
      },
    }, (response) => {
      const chunks = [];
      let bytes = 0;
      response.on("data", (chunk) => {
        bytes += chunk.length;
        if (bytes > MAX_AIRTABLE_RESPONSE_BYTES) {
          request.destroy(new Error("Airtable response exceeded the maximum size."));
          return;
        }
        chunks.push(chunk);
      });
      response.on("end", () => {
        const status = response.statusCode || 0;
        if (status < 200 || status >= 300) {
          reject(new Error(`Airtable request failed with status ${status}.`));
          return;
        }
        try {
          resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
        } catch {
          reject(new Error("Airtable returned invalid JSON."));
        }
      });
      response.on("error", reject);
    });

    request.setTimeout(AIRTABLE_TIMEOUT_MS, () => {
      request.destroy(new Error(`Airtable request timed out after ${AIRTABLE_TIMEOUT_MS}ms.`));
    });
    request.on("error", reject);
    if (body) request.write(body);
    request.end();
  });
}

async function listAirtableRecords(config) {
  const records = [];
  let offset = "";

  do {
    const params = new URLSearchParams({ pageSize: "100" });
    if (offset) params.set("offset", offset);
    const data = await airtableRequest(`${airtableTableUrl(config)}?${params}`, config);
    records.push(...(data.records || []));
    offset = typeof data.offset === "string" ? data.offset : "";
  } while (offset);

  return records;
}

function recordCandidate(record) {
  if (field(record, "Status").toLowerCase() !== "published") return null;

  const slug = field(record, "Slug");
  const title = field(record, "Title");
  if (!record.id || !slug || !title) return null;

  const candidate = {
    recordId: record.id,
    slug,
    title,
    date: field(record, "Date"),
    intro: field(record, "Intro"),
    sectionsJson: field(record, "Sections JSON"),
    takeaway: field(record, "Takeaway"),
    sourceTitle: field(record, "Source Title"),
    sourceUrl: field(record, "Source URL"),
    imagePrompt: field(record, "Image Prompt"),
    imageProvider: field(record, "Image Provider"),
    imageModel: field(record, "Image Model"),
    imageUrl: field(record, "Image URL"),
    createdTime: typeof record.createdTime === "string" ? record.createdTime : "",
  };

  try {
    candidate.stablePath = getStableBlogImagePath(slug);
    candidate.stableUrl = getStableBlogImageUrl(slug);
  } catch {
    return null;
  }

  candidate.needsUpgrade = needsOpenAiUpgrade(candidate);
  candidate.generationPrompt = buildOpenAiBlogPrompt(candidate);
  return candidate;
}

function candidateTimestamp(candidate) {
  const value = Date.parse(candidate.date || candidate.createdTime || "");
  return Number.isNaN(value) ? 0 : value;
}

function currentPacificDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

async function discover(args) {
  const config = airtableConfig();
  const requestedSlug = parseOptionalSlugArg(args);
  const candidates = (await listAirtableRecords(config))
    .map(recordCandidate)
    .filter(Boolean)
    .sort((a, b) => candidateTimestamp(b) - candidateTimestamp(a));

  const currentDate = currentPacificDate();
  const candidate = requestedSlug
    ? candidates.find((item) => item.slug === requestedSlug)
    : candidates.find((item) => isScheduledOpenAiUpgrade(item, currentDate));

  if (!candidate) {
    const latest = candidates[0];
    jsonOutput({
      ok: true,
      action: "none",
      reason: requestedSlug
        ? "published slug not found"
        : "no Published post dated today needs an OpenAI image upgrade",
      currentDate,
      latest: latest
        ? {
            recordId: latest.recordId,
            slug: latest.slug,
            title: latest.title,
            date: latest.date,
            imageProvider: latest.imageProvider,
            imageModel: latest.imageModel,
            imageUrl: latest.imageUrl,
          }
        : null,
    });
    return;
  }

  jsonOutput({ ok: true, action: candidate.needsUpgrade ? "generate" : "verified", ...candidate });
}

async function readJsonStdin() {
  let raw = "";
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) {
    raw += chunk;
    if (Buffer.byteLength(raw) > MAX_INPUT_BYTES) throw new Error("JSON input is too large.");
  }
  if (!raw.trim()) throw new Error("Expected JSON on stdin.");
  return JSON.parse(raw);
}

function validatePublishedImageInput(input) {
  const required = ["recordId", "slug", "title", "generationPrompt", "sha256"];
  for (const name of required) {
    if (typeof input[name] !== "string" || !input[name].trim()) {
      throw new Error(`Missing required image field: ${name}`);
    }
  }

  const expectedPath = getStableBlogImagePath(input.slug);
  const expectedUrl = getStableBlogImageUrl(input.slug);
  if (input.stableUrl && input.stableUrl !== expectedUrl) throw new Error("Stable image URL does not match the article slug.");
  if (!/^[a-f0-9]{64}$/.test(input.sha256.trim())) throw new Error("Expected a lowercase SHA-256 image hash.");
  if (input.modelId && input.modelId !== OPENAI_BLOG_IMAGE_MODEL) throw new Error("Unexpected OpenAI image model.");

  return {
    ...input,
    recordId: input.recordId.trim(),
    slug: input.slug.trim(),
    title: input.title.trim(),
    generationPrompt: input.generationPrompt.trim().slice(0, 10_000),
    modelId: OPENAI_BLOG_IMAGE_MODEL,
    modelName: "OpenAI GPT Image 2 (ChatGPT image)",
    sha256: input.sha256.trim(),
    stablePath: expectedPath,
    stableUrl: expectedUrl,
  };
}

async function readBoundedResponse(response, maximumBytes) {
  const contentLength = Number(response.headers.get("content-length") || 0);
  if (contentLength > maximumBytes) {
    await response.body?.cancel().catch(() => undefined);
    throw new Error("Image provider response exceeded the maximum size.");
  }

  const chunks = [];
  let bytes = 0;
  if (!response.body) throw new Error("Image provider returned an empty response body.");
  for await (const chunk of response.body) {
    const buffer = Buffer.from(chunk);
    bytes += buffer.length;
    if (bytes > maximumBytes) {
      await response.body.cancel().catch(() => undefined);
      throw new Error("Image provider response exceeded the maximum size.");
    }
    chunks.push(buffer);
  }
  return Buffer.concat(chunks);
}

async function generateOpenAiImage(args) {
  const config = airtableConfig();
  const requestedSlug = parseOptionalSlugArg(args);
  const candidates = (await listAirtableRecords(config))
    .map(recordCandidate)
    .filter(Boolean)
    .sort((a, b) => candidateTimestamp(b) - candidateTimestamp(a));
  const currentDate = currentPacificDate();
  const candidate = requestedSlug
    ? candidates.find((item) => item.slug === requestedSlug)
    : candidates.find((item) => isScheduledOpenAiUpgrade(item, currentDate));
  if (!candidate) throw new Error(requestedSlug ? "Published slug not found." : "No Published post dated today needs an OpenAI image upgrade.");
  if (candidate.date !== currentDate) throw new Error("Historical image generation is disabled for scheduled runs.");
  if (!candidate.needsUpgrade) {
    jsonOutput({ ok: true, action: "none", reason: "OpenAI image is already current", slug: candidate.slug });
    return;
  }

  const apiKey = requiredEnvironment("AI_GATEWAY_API_KEY");
  const requestBody = buildOpenAiImageRequest(candidate.generationPrompt);
  const response = await fetch(IMAGE_GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": USER_AGENT,
    },
    body: JSON.stringify(requestBody),
    signal: AbortSignal.timeout(IMAGE_GENERATION_TIMEOUT_MS),
  });
  const responseBuffer = await readBoundedResponse(response, MAX_GATEWAY_RESPONSE_BYTES);
  let responseBody;
  try {
    responseBody = JSON.parse(responseBuffer.toString("utf8"));
  } catch {
    throw new Error(`OpenAI image generation returned invalid JSON with status ${response.status}. No automatic retry was attempted.`);
  }
  if (!response.ok) {
    const providerMessage = typeof responseBody?.error?.message === "string"
      ? responseBody.error.message.replace(/\s+/g, " ").trim().slice(0, 300)
      : "provider rejected the request";
    throw new Error(`OpenAI image generation failed with status ${response.status}: ${providerMessage}. No automatic retry was attempted.`);
  }

  const { bytes: source, revisedPrompt } = decodeOpenAiImageResponse(responseBody, MAX_IMAGE_BYTES);
  const sourceMetadata = await sharp(source).metadata();
  if (sourceMetadata.format !== "png" || sourceMetadata.width !== 2048 || sourceMetadata.height !== 1152) {
    throw new Error(`OpenAI image must be a ${OPENAI_BLOG_IMAGE_SIZE} PNG before staging.`);
  }

  const outputPath = path.resolve(candidate.stablePath);
  const temporaryPath = `${outputPath}.tmp-${process.pid}`;
  await mkdir(path.dirname(outputPath), { recursive: true });

  try {
    await sharp(source)
      .rotate()
      .resize(1600, 900, { fit: "cover", position: "attention" })
      .webp({ quality: 88, effort: 6, smartSubsample: true })
      .toFile(temporaryPath);
    await rename(temporaryPath, outputPath);
  } finally {
    await unlink(temporaryPath).catch(() => undefined);
  }

  const output = await readFile(outputPath);
  const metadata = await sharp(output).metadata();
  if (metadata.format !== "webp" || metadata.width !== 1600 || metadata.height !== 900) {
    throw new Error("Generated asset failed WebP output verification.");
  }

  jsonOutput({
    ok: true,
    action: "generated-and-staged",
    recordId: candidate.recordId,
    slug: candidate.slug,
    title: candidate.title,
    provider: OPENAI_BLOG_IMAGE_PROVIDER,
    modelId: OPENAI_BLOG_IMAGE_MODEL,
    modelName: "OpenAI GPT Image 2 (ChatGPT image)",
    generationPrompt: candidate.generationPrompt,
    revisedPrompt,
    stablePath: candidate.stablePath,
    stableUrl: candidate.stableUrl,
    sourceWidth: sourceMetadata.width,
    sourceHeight: sourceMetadata.height,
    width: metadata.width,
    height: metadata.height,
    bytes: (await stat(outputPath)).size,
    sha256: createHash("sha256").update(output).digest("hex"),
    gatewayRequestId: response.headers.get("x-vercel-ai-gateway-request-id")
      || response.headers.get("x-request-id")
      || "",
  });
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));
}

function htmlToText(value) {
  return decodeHtmlEntities(value)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeForMatch(value) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function credentialFreeHttpsUrl(value, label) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`${label} must be a valid URL.`);
  }
  if (parsed.protocol !== "https:" || parsed.username || parsed.password) {
    throw new Error(`${label} must be a credential-free HTTPS URL.`);
  }
  return parsed;
}

function cacheBustedUrl(value, cacheBust) {
  const parsed = credentialFreeHttpsUrl(value, "Article image URL");
  parsed.searchParams.set("verify", cacheBust);
  return parsed.toString();
}

function htmlContainsAssetUrl(value, assetUrl) {
  return value.includes(assetUrl)
    || decodeHtmlEntities(value).includes(assetUrl)
    || value.includes(encodeURIComponent(assetUrl));
}

function containsMeaningfulText(haystack, needle) {
  const normalizedHaystack = normalizeForMatch(haystack);
  const normalizedNeedle = normalizeForMatch(needle);
  if (normalizedNeedle.length < 20) return false;
  return normalizedHaystack.includes(normalizedNeedle.slice(0, 140));
}

async function fetchPublicAsset(url, accept) {
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: accept || "*/*" },
    cache: "no-store",
    redirect: "follow",
    signal: AbortSignal.timeout(45_000),
  });
  const contentLength = Number(response.headers.get("content-length") || 0);
  if (contentLength > MAX_IMAGE_BYTES) {
    await response.body?.cancel().catch(() => undefined);
    throw new Error(`Public verification payload is too large: ${url}`);
  }
  const body = Buffer.from(await response.arrayBuffer());
  if (body.length > MAX_IMAGE_BYTES) throw new Error(`Public verification payload is too large: ${url}`);
  return {
    status: response.status,
    contentType: response.headers.get("content-type") || "",
    body,
    effectiveUrl: response.url,
  };
}

function canonicalBlogOrigin() {
  const configuredOrigin = (process.env.SUPREME_BLOG_ORIGIN || "https://supremetruckinginsurance.com").trim().replace(/\/+$/, "");
  const originUrl = new URL(configuredOrigin);
  if (originUrl.protocol !== "https:" || originUrl.username || originUrl.password) {
    throw new Error("SUPREME_BLOG_ORIGIN must be a credential-free HTTPS origin.");
  }
  return originUrl.origin;
}

async function verifyLive(args) {
  const config = airtableConfig();
  const requestedSlug = parseOptionalSlugArg(args);
  const candidates = (await listAirtableRecords(config))
    .map(recordCandidate)
    .filter(Boolean)
    .sort((a, b) => candidateTimestamp(b) - candidateTimestamp(a));
  const candidate = requestedSlug
    ? candidates.find((item) => item.slug === requestedSlug)
    : candidates[0];
  if (!candidate) throw new Error(requestedSlug ? "Published slug not found for verification." : "No Published article found.");

  let sections;
  try {
    sections = JSON.parse(candidate.sectionsJson);
  } catch {
    throw new Error("Airtable Sections JSON is invalid during live verification.");
  }
  if (!Array.isArray(sections) || sections.length === 0) {
    throw new Error("Airtable article has no sections during live verification.");
  }
  const sectionHeading = sections.find((section) => typeof section?.heading === "string" && section.heading.trim())?.heading || "";
  const bodyParagraph = sections
    .flatMap((section) => Array.isArray(section?.body) ? section.body : [])
    .find((paragraph) => typeof paragraph === "string" && paragraph.trim().length >= 20) || "";
  if (!sectionHeading || !bodyParagraph) throw new Error("Airtable article has no substantive section body.");

  const repositoryBacked = isRepositoryBackedBlogImage(candidate);
  const isOpenAi = candidate.imageProvider.toLowerCase() === OPENAI_BLOG_IMAGE_PROVIDER.toLowerCase();
  const expectedImageUrl = repositoryBacked ? candidate.stableUrl : candidate.imageUrl;
  credentialFreeHttpsUrl(expectedImageUrl, "Airtable Image URL");

  const origin = canonicalBlogOrigin();
  const articleUrl = `${origin}/blog/${candidate.slug}`;
  const cacheBust = Date.now().toString();
  const [article, blog, sitemap, image] = await Promise.all([
    fetchPublicAsset(`${articleUrl}?verify=${cacheBust}`, "text/html"),
    fetchPublicAsset(`${origin}/blog?verify=${cacheBust}`, "text/html"),
    fetchPublicAsset(`${origin}/sitemap.xml?verify=${cacheBust}`, "application/xml,text/xml"),
    fetchPublicAsset(cacheBustedUrl(expectedImageUrl, cacheBust), "image/webp,image/*"),
  ]);

  const articleHtml = article.body.toString("utf8");
  const articleText = htmlToText(articleHtml);
  const blogHtml = blog.body.toString("utf8");
  const sitemapXml = sitemap.body.toString("utf8");
  const imageMetadata = await sharp(image.body).metadata();
  let localImage = null;
  if (repositoryBacked) {
    try {
      localImage = await readFile(path.resolve(candidate.stablePath));
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }
  }
  const remoteHash = createHash("sha256").update(image.body).digest("hex");
  const localHash = localImage ? createHash("sha256").update(localImage).digest("hex") : "";

  const checks = {
    airtableStatusPublished: true,
    airtableProviderPresent: Boolean(candidate.imageProvider),
    airtableImageUrlPresent: Boolean(candidate.imageUrl),
    repositoryImageModelPresent: !repositoryBacked || Boolean(candidate.imageModel),
    repositoryStableImageUrl: !repositoryBacked || candidate.imageUrl === candidate.stableUrl,
    openAiModelExpected: !isOpenAi || candidate.imageModel === OPENAI_BLOG_IMAGE_MODEL,
    articleStatus200: article.status === 200,
    articleCanonicalUrl: article.effectiveUrl.startsWith(articleUrl),
    articleTitlePresent: containsMeaningfulText(articleText, candidate.title),
    articleIntroPresent: containsMeaningfulText(articleText, candidate.intro),
    articleSectionPresent: containsMeaningfulText(articleText, sectionHeading),
    articleBodyPresent: containsMeaningfulText(articleText, bodyParagraph),
    articleSubstantive: articleText.length >= 1_000,
    articleExpectedImageUrl: htmlContainsAssetUrl(articleHtml, expectedImageUrl),
    articleLiteralMarkdownAbsent: !articleText.includes("**") && !articleText.includes("`") && !articleText.includes("__"),
    blogStatus200: blog.status === 200,
    blogContainsSlug: blogHtml.includes(candidate.slug),
    sitemapStatus200: sitemap.status === 200,
    sitemapContainsCanonicalUrl: sitemapXml.includes(articleUrl),
    imageStatus200: image.status === 200,
    imageContentType: image.contentType.toLowerCase().startsWith("image/"),
    imageDimensionsMinimum: Boolean(imageMetadata.width && imageMetadata.height)
      && imageMetadata.width >= 768
      && imageMetadata.height >= 432,
    imageHasBytes: image.body.length > 20_000,
    repositoryImageContentTypeWebp: !repositoryBacked || image.contentType.toLowerCase().startsWith("image/webp"),
    repositoryImageDimensions1600x900: !repositoryBacked
      || (imageMetadata.format === "webp" && imageMetadata.width === 1600 && imageMetadata.height === 900),
    repositoryLocalImagePresent: !repositoryBacked || Boolean(localImage),
    repositoryLocalRemoteHashMatch: !repositoryBacked || (Boolean(localImage) && localHash === remoteHash),
  };
  const failedChecks = Object.entries(checks).filter(([, passed]) => !passed).map(([name]) => name);
  const ok = failedChecks.length === 0;
  jsonOutput({
    ok,
    action: "verified-live",
    recordId: candidate.recordId,
    slug: candidate.slug,
    title: candidate.title,
    articleUrl,
    provider: candidate.imageProvider,
    model: candidate.imageModel,
    imageUrl: expectedImageUrl,
    stableUrl: repositoryBacked ? candidate.stableUrl : "",
    image: {
      status: image.status,
      contentType: image.contentType,
      bytes: image.body.length,
      width: imageMetadata.width,
      height: imageMetadata.height,
      sha256: remoteHash,
    },
    checks,
    failedChecks,
  });
  if (!ok) process.exitCode = 1;
}

async function revalidateLive() {
  const secret = requiredEnvironment("SUPREME_BLOG_CRON_SECRET");
  const origin = canonicalBlogOrigin();
  const response = await fetch(`${origin}/api/blog/auto-draft?mode=revalidate`, {
    headers: {
      Authorization: `Bearer ${secret}`,
      "User-Agent": USER_AGENT,
      Accept: "application/json",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(45_000),
  });
  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }
  const ok = response.status === 200
    && body?.ok === true
    && body?.mode === "revalidate"
    && Array.isArray(body?.paths)
    && body.paths.includes("/blog")
    && body.paths.includes("/blog/[slug]")
    && body.paths.includes("/sitemap.xml");
  jsonOutput({
    ok,
    action: "revalidated",
    status: response.status,
    mode: body?.mode || "",
    paths: Array.isArray(body?.paths) ? body.paths : [],
  });
  if (!ok) process.exitCode = 1;
}

async function publish() {
  const input = validatePublishedImageInput(await readJsonStdin());
  const publicImage = await fetchPublicAsset(
    cacheBustedUrl(input.stableUrl, Date.now().toString()),
    "image/webp,image/*",
  );
  const publicMetadata = await sharp(publicImage.body).metadata();
  const remoteHash = createHash("sha256").update(publicImage.body).digest("hex");
  const localImage = await readFile(path.resolve(input.stablePath));
  const localHash = createHash("sha256").update(localImage).digest("hex");
  if (
    publicImage.status !== 200
    || !publicImage.contentType.toLowerCase().startsWith("image/webp")
    || publicMetadata.format !== "webp"
    || publicMetadata.width !== 1600
    || publicMetadata.height !== 900
    || publicImage.body.length <= 20_000
    || remoteHash !== input.sha256
    || localHash !== input.sha256
  ) {
    throw new Error("Deployed OpenAI hero failed content type, dimensions, bytes, or SHA-256 verification.");
  }

  const config = airtableConfig();
  const current = await airtableRequest(
    airtableTableUrl(config, `/${encodeURIComponent(input.recordId)}`),
    config,
  );
  if (field(current, "Status").toLowerCase() !== "published" || field(current, "Slug") !== input.slug) {
    throw new Error("Airtable record changed before the OpenAI image could be published.");
  }

  const fields = {
    "Image URL": input.stableUrl,
    "Image Alt": `${input.title} — premium editorial trucking photograph`,
    "Image Prompt": input.generationPrompt,
    "Image Provider": OPENAI_BLOG_IMAGE_PROVIDER,
    "Image Model": OPENAI_BLOG_IMAGE_MODEL,
    "Image Generated At": new Date().toISOString(),
  };

  const updated = await airtableRequest(
    airtableTableUrl(config, `/${encodeURIComponent(input.recordId)}`),
    config,
    { method: "PATCH", body: JSON.stringify({ fields }) },
  );

  jsonOutput({
    ok: true,
    action: "published",
    recordId: updated.id,
    slug: input.slug,
    title: input.title,
    provider: OPENAI_BLOG_IMAGE_PROVIDER,
    model: OPENAI_BLOG_IMAGE_MODEL,
    stableUrl: input.stableUrl,
    imageStatus: publicImage.status,
    imageContentType: publicImage.contentType,
    imageBytes: publicImage.body.length,
    sha256: remoteHash,
  });
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (command === "discover") return discover(args);
  if (command === "generate") return generateOpenAiImage(args);
  if (command === "verify") return verifyLive(args);
  if (command === "revalidate") return revalidateLive();
  if (command === "publish") return publish();
  throw new Error("Usage: blog-openai-image.mjs <discover [<slug>|--slug <slug>]|generate [<slug>|--slug <slug>]|verify [<slug>|--slug <slug>]|revalidate|publish>");
}

main().catch((error) => {
  jsonOutput({ ok: false, error: error instanceof Error ? error.message : "Unknown worker error." });
  process.exitCode = 1;
});
