#!/usr/bin/env node
/**
 * Import Genoa cruise ship schedules from CSV into the site's JSON data file.
 *
 * Usage:  node scripts/import-schedules.mjs
 *
 * Source:  data/schedule-sources/genoa.csv
 * Output:  src/data/imported-schedules/genoa.json
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const SOURCE = resolve(ROOT, "data/schedule-sources/genoa.csv");
const OUTPUT = resolve(ROOT, "src/data/imported-schedules/genoa.json");

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current);
  return values.map((v) => v.trim());
}

function computeTimeInPort(arrival, departure) {
  if (!arrival || !departure) return undefined;
  const [ah, am] = arrival.split(":").map(Number);
  const [dh, dm] = departure.split(":").map(Number);
  if ([ah, am, dh, dm].some((n) => Number.isNaN(n))) return undefined;
  let minutes = dh * 60 + dm - (ah * 60 + am);
  if (minutes < 0) minutes += 24 * 60;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
}

function main() {
  if (!existsSync(SOURCE)) {
    console.error(`Source CSV not found: ${SOURCE}`);
    process.exit(1);
  }

  const raw = readFileSync(SOURCE, "utf8").trim();
  const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const header = parseCsvLine(lines[0]).map((h) => h.toLowerCase());

  const idx = (name) => header.indexOf(name);
  const iDate = idx("date");
  const iShip = idx("ship");
  const iLine = idx("cruiseline");
  const iArr = idx("arrival");
  const iDep = idx("departure");
  const iPax = idx("passengers");
  const iNotes = idx("notes");

  const entries = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    const arrival = iArr >= 0 ? cols[iArr] : "";
    const departure = iDep >= 0 ? cols[iDep] : "";
    entries.push({
      date: cols[iDate],
      ship: cols[iShip],
      cruiseLine: iLine >= 0 ? cols[iLine] : "",
      arrival,
      departure,
      timeInPort: computeTimeInPort(arrival, departure),
      terminal: "Molo Garibaldi",
      callType: "Port of call",
      ...(iPax >= 0 && cols[iPax] ? { passengers: cols[iPax] } : {}),
      ...(iNotes >= 0 && cols[iNotes] ? { notes: cols[iNotes] } : {}),
    });
  }

  mkdirSync(dirname(OUTPUT), { recursive: true });
  writeFileSync(OUTPUT, JSON.stringify(entries, null, 2) + "\n");
  console.log(`Imported ${entries.length} schedule entries to ${OUTPUT}`);
}

main();
