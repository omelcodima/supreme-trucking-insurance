#!/usr/bin/env node

const baseUrl = new URL(process.argv[2] || process.env.SEO_BASE_URL || "https://supremetruckinginsurance.com");
const origin = baseUrl.origin;
const sitemapUrl = new URL("/sitemap.xml", baseUrl).href;
const concurrency = Number.parseInt(process.env.SEO_AUDIT_CONCURRENCY || "8", 10);
const userAgent = "Supreme-SEO-Health/1.0";

function normalizedUrl(value, relativeTo = baseUrl) {
  const url = new URL(value, relativeTo);
  url.hash = "";
  return url.href;
}

async function mapLimit(items, limit, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function run() {
    while (true) {
      const index = nextIndex;
      nextIndex += 1;
      if (index >= items.length) return;
      results[index] = await worker(items[index], index);
    }
  }

  const workerCount = Math.max(1, Math.min(Number.isFinite(limit) ? limit : 8, items.length));
  await Promise.all(Array.from({ length: workerCount }, run));
  return results;
}

function extractInternalLinks(html, pageUrl) {
  const links = new Set();

  for (const match of html.matchAll(/<a\b[^>]*\bhref=(?:"([^"]*)"|'([^']*)')[^>]*>/gi)) {
    const rawHref = (match[1] ?? match[2] ?? "").trim();
    if (!rawHref || rawHref.startsWith("#") || /^(?:mailto|tel|javascript):/i.test(rawHref)) continue;

    try {
      const url = new URL(rawHref, pageUrl);
      if (url.origin !== origin) continue;
      url.hash = "";
      links.add(url.href);
    } catch {
      // Malformed links are outside this HTTP route-health check.
    }
  }

  return [...links];
}

async function fetchRoute(url) {
  try {
    const response = await fetch(url, {
      redirect: "manual",
      headers: { "user-agent": userAgent },
      signal: AbortSignal.timeout(30_000),
    });
    const contentType = response.headers.get("content-type") || "";
    const html = response.status === 200 && contentType.includes("text/html") ? await response.text() : "";

    return {
      url,
      status: response.status,
      location: response.headers.get("location"),
      links: html ? extractInternalLinks(html, url) : [],
    };
  } catch (error) {
    return {
      url,
      status: 0,
      location: null,
      links: [],
      error: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
    };
  }
}

const sitemapResponse = await fetch(sitemapUrl, {
  redirect: "manual",
  headers: { "user-agent": userAgent },
  signal: AbortSignal.timeout(30_000),
});

if (sitemapResponse.status !== 200) {
  throw new Error(`Sitemap returned HTTP ${sitemapResponse.status}.`);
}

const sitemapXml = await sitemapResponse.text();
const sitemapUrls = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => {
  const canonicalUrl = new URL(match[1].trim(), baseUrl);
  return normalizedUrl(`${canonicalUrl.pathname}${canonicalUrl.search}`, baseUrl);
});
const duplicateSitemapUrls = sitemapUrls.filter((url, index) => sitemapUrls.indexOf(url) !== index);

const sitemapChecks = await mapLimit(sitemapUrls, concurrency, fetchRoute);
const internalReferences = new Map();

for (const page of sitemapChecks) {
  for (const link of page.links) {
    if (!internalReferences.has(link)) internalReferences.set(link, new Set());
    internalReferences.get(link).add(page.url);
  }
}

const internalChecks = await mapLimit([...internalReferences.keys()].sort(), concurrency, async (url) => {
  const result = await fetchRoute(url);
  return {
    ...result,
    links: undefined,
    referencedBy: [...internalReferences.get(url)].sort(),
  };
});

const sitemapIssues = sitemapChecks
  .filter((route) => route.status !== 200)
  .map((route) => ({
    url: route.url,
    status: route.status,
    location: route.location,
    ...(route.error ? { error: route.error } : {}),
  }));
const internalRedirects = internalChecks.filter((route) => route.status >= 300 && route.status < 400);
const brokenInternalLinks = internalChecks.filter((route) => route.status === 0 || route.status >= 400);
const sitemapUrlSet = new Set(sitemapUrls);
const blogIndexUrl = normalizedUrl("/blog", baseUrl);
const missingBlogArticlesFromSitemap = internalChecks
  .filter((route) => {
    const pathname = new URL(route.url).pathname;
    return route.status === 200 &&
      pathname.startsWith("/blog/") &&
      route.referencedBy.includes(blogIndexUrl) &&
      !sitemapUrlSet.has(route.url);
  })
  .map((route) => ({ url: route.url, referencedBy: route.referencedBy }));

const report = {
  ok:
    duplicateSitemapUrls.length === 0 &&
    sitemapIssues.length === 0 &&
    internalRedirects.length === 0 &&
    brokenInternalLinks.length === 0 &&
    missingBlogArticlesFromSitemap.length === 0,
  checkedAt: new Date().toISOString(),
  baseUrl: origin,
  sitemapStatus: sitemapResponse.status,
  sitemapUrlCount: sitemapUrls.length,
  uniqueInternalLinkCount: internalChecks.length,
  duplicateSitemapUrlCount: duplicateSitemapUrls.length,
  sitemapIssueCount: sitemapIssues.length,
  internalRedirectCount: internalRedirects.length,
  brokenInternalLinkCount: brokenInternalLinks.length,
  missingBlogArticleFromSitemapCount: missingBlogArticlesFromSitemap.length,
  duplicateSitemapUrls,
  sitemapIssues,
  internalRedirects,
  brokenInternalLinks,
  missingBlogArticlesFromSitemap,
};

console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exitCode = 1;
