#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, readFile, rename, stat, unlink } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import sharp from "sharp";

import {
  buildHiggsfieldBlogPrompt,
  getStableBlogImagePath,
  getStableBlogImageUrl,
  needsHiggsfieldUpgrade,
} from "../src/lib/blogHiggsfield.ts";

const MAX_INPUT_BYTES = 64 * 1024;
const MAX_DOWNLOAD_BYTES = 30 * 1024 * 1024;
const DOWNLOAD_TIMEOUT_MS = 90_000;
const USER_AGENT = "Supreme-Trucking-Insurance-Higgsfield-Worker/1.0";

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
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    await response.body?.cancel().catch(() => undefined);
    throw new Error(`Airtable request failed with status ${response.status}.`);
  }

  return response.json();
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

  candidate.needsUpgrade = needsHiggsfieldUpgrade(candidate);
  candidate.generationPrompt = buildHiggsfieldBlogPrompt(candidate);
  return candidate;
}

function candidateTimestamp(candidate) {
  const value = Date.parse(candidate.date || candidate.createdTime || "");
  return Number.isNaN(value) ? 0 : value;
}

async function discover(args) {
  const config = airtableConfig();
  const requestedSlug = args[0]?.trim() || "";
  const candidates = (await listAirtableRecords(config))
    .map(recordCandidate)
    .filter(Boolean)
    .sort((a, b) => candidateTimestamp(b) - candidateTimestamp(a));

  const candidate = requestedSlug
    ? candidates.find((item) => item.slug === requestedSlug)
    : candidates.find((item) => item.needsUpgrade);

  if (!candidate) {
    jsonOutput({ ok: true, action: "none", reason: requestedSlug ? "published slug not found" : "no Higgsfield upgrade needed" });
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

function validateGenerationInput(input) {
  const required = ["recordId", "slug", "title", "resultUrl", "generationPrompt"];
  for (const name of required) {
    if (typeof input[name] !== "string" || !input[name].trim()) {
      throw new Error(`Missing required generation field: ${name}`);
    }
  }

  const expectedPath = getStableBlogImagePath(input.slug);
  const expectedUrl = getStableBlogImageUrl(input.slug);
  const resultUrl = new URL(input.resultUrl);
  if (resultUrl.protocol !== "https:" || resultUrl.username || resultUrl.password) {
    throw new Error("Higgsfield result URL must be an HTTPS URL without embedded credentials.");
  }

  return {
    ...input,
    recordId: input.recordId.trim(),
    slug: input.slug.trim(),
    title: input.title.trim(),
    resultUrl: resultUrl.toString(),
    generationPrompt: input.generationPrompt.trim().slice(0, 10_000),
    modelId: typeof input.modelId === "string" ? input.modelId.trim().slice(0, 200) : "",
    modelName: typeof input.modelName === "string" ? input.modelName.trim().slice(0, 200) : "",
    stablePath: expectedPath,
    stableUrl: expectedUrl,
  };
}

async function downloadImage(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "image/*" },
    redirect: "follow",
    signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS),
  });

  if (!response.ok) {
    await response.body?.cancel().catch(() => undefined);
    throw new Error(`Higgsfield image download failed with status ${response.status}.`);
  }

  const contentLength = Number(response.headers.get("content-length") || 0);
  if (contentLength > MAX_DOWNLOAD_BYTES) {
    await response.body?.cancel().catch(() => undefined);
    throw new Error("Higgsfield image exceeds the maximum download size.");
  }

  const input = Buffer.from(await response.arrayBuffer());
  if (!input.length || input.length > MAX_DOWNLOAD_BYTES) {
    throw new Error("Higgsfield image payload is empty or too large.");
  }

  return input;
}

async function stage() {
  const input = validateGenerationInput(await readJsonStdin());
  const source = await downloadImage(input.resultUrl);
  const sourceMetadata = await sharp(source).metadata();
  if (!sourceMetadata.width || !sourceMetadata.height || sourceMetadata.width < 768 || sourceMetadata.height < 432) {
    throw new Error("Higgsfield image dimensions are below the minimum quality threshold.");
  }

  const outputPath = path.resolve(input.stablePath);
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
    action: "staged",
    recordId: input.recordId,
    slug: input.slug,
    title: input.title,
    modelId: input.modelId,
    modelName: input.modelName,
    generationPrompt: input.generationPrompt,
    stablePath: input.stablePath,
    stableUrl: input.stableUrl,
    width: metadata.width,
    height: metadata.height,
    bytes: (await stat(outputPath)).size,
    sha256: createHash("sha256").update(output).digest("hex"),
  });
}

async function verifyPublicImage(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "image/webp,image/*" },
    cache: "no-store",
    signal: AbortSignal.timeout(30_000),
  });
  const contentType = response.headers.get("content-type") || "";
  const length = Number(response.headers.get("content-length") || 0);
  if (!response.ok || !contentType.toLowerCase().startsWith("image/") || length === 0) {
    await response.body?.cancel().catch(() => undefined);
    throw new Error(`Stable image URL is not ready (status ${response.status}, type ${contentType || "missing"}).`);
  }
  await response.body?.cancel().catch(() => undefined);
  return { status: response.status, contentType, contentLength: length };
}

async function publish() {
  const input = validateGenerationInput(await readJsonStdin());
  const publicImage = await verifyPublicImage(input.stableUrl);
  const config = airtableConfig();
  const model = input.modelName || input.modelId || "Higgsfield top-quality image model";
  const fields = {
    "Image URL": input.stableUrl,
    "Image Alt": `${input.title} — premium editorial trucking photograph`,
    "Image Prompt": input.generationPrompt,
    "Image Provider": "Higgsfield",
    "Image Model": model,
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
    provider: "Higgsfield",
    model,
    stableUrl: input.stableUrl,
    imageStatus: publicImage.status,
    imageContentType: publicImage.contentType,
    imageBytes: publicImage.contentLength,
  });
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (command === "discover") return discover(args);
  if (command === "stage") return stage();
  if (command === "publish") return publish();
  throw new Error("Usage: blog-higgsfield-media.mjs <discover [slug]|stage|publish>");
}

main().catch((error) => {
  jsonOutput({ ok: false, error: error instanceof Error ? error.message : "Unknown worker error." });
  process.exitCode = 1;
});
