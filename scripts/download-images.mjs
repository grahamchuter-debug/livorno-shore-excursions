#!/usr/bin/env node
/**
 * Download Italian Riviera / Genoa images from Wikimedia Commons (CC-licensed).
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT = join(import.meta.dirname, "..", "public/images");
const UA = "LaSpeziaShoreExcursions/1.0 (https://laspeziashoreexcursions.com; image setup)";

/** Each output file gets a unique primary location where possible. */
const IMAGE_FILES = {
  "hero-home.jpg": ["File:Portofino - panoramio.jpg"],
  "og-default.jpg": ["File:Portofino - panoramio.jpg", "File:Camogli - panoramio.jpg"],
  "portofino.jpg": ["File:Portofino - panoramio.jpg"],
  "santa-margherita.jpg": ["File:Santa Margherita Ligure - panoramio.jpg", "File:Santa Margherita Ligure.jpg"],
  "santa-margherita-marina.jpg": [
    "File:Porto di Santa Margherita Ligure.jpg",
    "File:Santa Margherita Ligure.jpg",
  ],
  "camogli.jpg": ["File:Camogli - panoramio.jpg"],
  "photography.jpg": ["File:Camogli - panoramio.jpg"],
  "riviera-coast.jpg": ["File:Santa Margherita Ligure - panoramio.jpg", "File:Portofino - panoramio.jpg"],
  "yacht.jpg": ["File:Portofino - panoramio.jpg"],
  "food.jpg": ["File:Pesto alla genovese.jpg", "File:Focaccia di Recco.jpg"],
  "train.jpg": [
    "File:The railway near Manarola.jpg",
    "File:Manarola and train.jpg",
    "File:Genova Piazza Principe station.jpg",
  ],
  "ferry.jpg": [
    "File:Portofino from the sea.jpg",
    "File:Portofino - view from the sea.jpg",
    "File:Portofino seen from the sea.jpg",
  ],
  "beach.jpg": ["File:Camogli - panoramio.jpg"],
  "family.jpg": ["File:Santa Margherita Ligure - panoramio.jpg"],
  "compare.jpg": ["File:Camogli - panoramio.jpg", "File:Portofino - panoramio.jpg"],
  "cruise-port.jpg": [
    "File:Porto antico di Genova.jpg",
    "File:Old Port of Genoa.jpg",
    "File:Porto Antico Genova.jpg",
  ],
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function resolveImageUrl(fileTitle) {
  const api = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url&iiurlwidth=1600&format=json`;
  const data = await fetchJson(api);
  const pages = data.query?.pages ?? {};
  const page = Object.values(pages)[0];
  if (!page || page.missing) return null;
  const info = page.imageinfo?.[0];
  return info?.thumburl ?? info?.url ?? null;
}

async function downloadOne(filename, titles) {
  for (const title of titles) {
    try {
      await sleep(600);
      const url = await resolveImageUrl(title);
      if (!url) continue;
      const res = await fetch(url, { headers: { "User-Agent": UA } });
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      writeFileSync(join(OUT, filename), buf);
      console.log(`✓ ${filename} ← ${title}`);
      return true;
    } catch (e) {
      console.warn(`  skip ${title}: ${e.message}`);
    }
  }
  console.error(`✗ ${filename} — no source found`);
  return false;
}

mkdirSync(OUT, { recursive: true });

const targets = process.argv.slice(2);
const entries = Object.entries(IMAGE_FILES).filter(([name]) =>
  targets.length === 0 || targets.includes(name),
);

let ok = 0;
let fail = 0;
for (const [filename, titles] of entries) {
  const success = await downloadOne(filename, titles);
  if (success) ok++;
  else fail++;
}

console.log(`\nDone: ${ok} downloaded, ${fail} failed.`);
