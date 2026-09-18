#!/usr/bin/env node
/**
 * Post-build SEO QA checks for La Spezia Shore Excursions static export.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

function getSiteConfig() {
  const siteTs = readFileSync(join(ROOT, "src/lib/site.ts"), "utf8");
  const url = siteTs.match(/url:\s*"([^"]+)"/)?.[1]?.replace(/\/$/, "");
  const domain = siteTs.match(/domain:\s*"([^"]+)"/)?.[1];
  if (!url || !domain) throw new Error("Could not parse SITE from src/lib/site.ts");
  return { url, domain };
}
const OUT = join(ROOT, "out");
const SRC = join(ROOT, "src");
const { url: SITE_URL, domain: SITE_DOMAIN } = getSiteConfig();
const errors = [];
const warnings = [];

function walkHtml(dir, files = []) {
  if (!existsSync(dir)) return files;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkHtml(p, files);
    else if (name.endsWith(".html")) files.push(p);
  }
  return files;
}

function loadSlugs(relativePath, exportName) {
  const text = readFileSync(join(ROOT, relativePath), "utf8");
  const fnMatch = text.match(
    new RegExp(`export function ${exportName}\\(\\)[^{]*\\{[^]*?return ([^;]+);`, "m"),
  );
  if (!fnMatch) return [];
  const arrayMatch = fnMatch[1].match(/\.map\(\([^)]*\) => [^.]+\.(\w+)\)/);
  if (!arrayMatch) return [];
  const field = arrayMatch[1];
  return [...new Set([...text.matchAll(new RegExp(`${field}:\\s*"([^"]+)"`, "g"))].map((m) => m[1]))];
}

// 1. Production build output exists
if (!existsSync(OUT)) {
  errors.push("out/ directory missing — run npm run build first");
} else {
  const htmlFiles = walkHtml(OUT);
  if (!htmlFiles.length) errors.push("No HTML files in out/");

  // 2. noindex on important pages
  const indexableMustNotHaveNoindex = htmlFiles.filter(
    (f) => !f.includes("/privacy/") && !f.includes("/terms/"),
  );
  for (const f of indexableMustNotHaveNoindex) {
    const html = readFileSync(f, "utf8");
    if (/noindex/i.test(html) && !f.includes("404") && !f.includes("_not-found")) {
      errors.push(`Unexpected noindex: ${f.replace(OUT, "")}`);
    }
  }

  // privacy/terms should be noindex
  for (const special of ["privacy", "terms"]) {
    const f = htmlFiles.find((h) => h.includes(`/${special}/`));
    if (f) {
      const html = readFileSync(f, "utf8");
      if (!/noindex/i.test(html)) warnings.push(`${special} page may be indexable (expected noindex)`);
    }
  }

  // 3. Canonical HTTPS non-www
  for (const f of htmlFiles.slice(0, 30)) {
    const html = readFileSync(f, "utf8");
    const canon = html.match(/rel="canonical" href="([^"]+)"/);
    if (canon) {
      const url = canon[1];
      if (!url.startsWith(SITE_URL)) errors.push(`Non-canonical host: ${url} in ${f.replace(OUT, "")}`);
      if (url.includes("www.")) errors.push(`WWW in canonical: ${url}`);
      if (url.startsWith("http://")) errors.push(`HTTP canonical: ${url}`);
    }
  }

  // 4. Duplicate titles (sample)
  const titles = new Map();
  for (const f of htmlFiles) {
    const html = readFileSync(f, "utf8");
    const m = html.match(/<title>([^<]+)<\/title>/);
    if (m) {
      const t = m[1].trim();
      if (titles.has(t)) titles.get(t).push(f);
      else titles.set(t, [f]);
    }
  }
  for (const [title, files] of titles) {
    if (files.length > 1 && !title.includes("404")) {
      warnings.push(`Duplicate title "${title}" on ${files.length} pages`);
    }
  }

  // 5. JSON-LD present on homepage
  const home = join(OUT, "index.html");
  if (existsSync(home)) {
    const html = readFileSync(home, "utf8");
    if (!html.includes("TravelAgency")) warnings.push("Homepage missing TravelAgency JSON-LD");
    if (!html.includes("WebSite")) warnings.push("Homepage missing WebSite JSON-LD");
    if (!html.includes("FAQPage")) warnings.push("Homepage missing FAQPage JSON-LD");
  }
}

// 6. robots.txt
const robots = join(OUT, "robots.txt");
if (existsSync(robots)) {
  const text = readFileSync(robots, "utf8");
  if (/disallow:\s*\//i.test(text)) errors.push("robots.txt disallows all crawling");
  if (!text.includes("Sitemap")) warnings.push("robots.txt missing sitemap reference");
} else if (existsSync(OUT)) {
  errors.push("robots.txt missing from out/");
}

// 7. sitemap canonical URLs only
const sitemap = join(OUT, "sitemap.xml");
if (existsSync(sitemap)) {
  const xml = readFileSync(sitemap, "utf8");
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  for (const url of urls) {
    if (!url.startsWith(SITE_URL)) errors.push(`Sitemap non-canonical URL: ${url}`);
    if (url.includes("/privacy") || url.includes("/terms")) errors.push(`Sitemap includes noindex page: ${url}`);
  }
  if (urls.some((u) => u.includes("www."))) errors.push("Sitemap contains www URLs");
} else if (existsSync(OUT)) {
  errors.push("sitemap.xml missing from out/");
}

// 8. _redirects
const redirects = join(ROOT, "public/_redirects");
if (existsSync(redirects)) {
  const text = readFileSync(redirects, "utf8");
  if (!text.includes(`www.${SITE_DOMAIN}`)) errors.push("_redirects missing www → apex rule");
  if (!text.includes("301")) warnings.push("_redirects may missing 301 flags");
} else {
  errors.push("public/_redirects missing");
}

// 9. Metadata / OG on homepage
if (existsSync(join(OUT, "index.html"))) {
  const html = readFileSync(join(OUT, "index.html"), "utf8");
  if (!html.includes('property="og:title"') && !html.includes('og:title')) warnings.push("Homepage may missing og:title");
  if (!html.includes('property="og:description"') && !html.includes('og:description')) warnings.push("Homepage may missing og:description");
}

console.log("=== SEO QA Report ===\n");
if (errors.length) {
  console.error(`ERRORS (${errors.length}):`);
  errors.forEach((e) => console.error(`  ✗ ${e}`));
}
if (warnings.length) {
  console.warn(`\nWARNINGS (${warnings.length}):`);
  warnings.forEach((w) => console.warn(`  ! ${w}`));
}
console.log("\nIntentional exclusions:");
console.log("  • /privacy/ and /terms/ — noindex, excluded from sitemap");
console.log("  • HTTP→HTTPS — Cloudflare Always Use HTTPS + _redirects fallback");
console.log("  • WWW→non-WWW — public/_redirects 301 rules");

if (errors.length) {
  process.exit(1);
}
console.log("\nSEO QA passed (with warnings noted above if any).");
