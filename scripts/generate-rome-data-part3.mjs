#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DATA = join(dirname(fileURLToPath(import.meta.url)), "..", "src/data");
function w(n, c) { writeFileSync(join(DATA, n), c, "utf8"); console.log("wrote", n); }
function esc(s) { return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"'); }

// --- comparisons.ts ---
w("comparisons.ts", `import type { Comparison, ComparisonGuideItem, FAQ } from "./types";

function makeVersus(
  slug: string,
  optionA: string,
  optionB: string,
  summary: string,
  verdict: string,
  overview: string[],
  table: { category: string; optionA: string; optionB: string }[],
  faqs: FAQ[],
  relatedSlugs: string[],
  imageKey: string,
): Comparison {
  return {
    slug,
    title: \`\${optionA} vs \${optionB}\`,
    seoTitle: \`\${optionA} vs \${optionB} — Civitavecchia Cruise Passengers\`,
    metaDescription: summary,
    kind: "versus",
    optionA,
    optionB,
    summary,
    verdict,
    overview,
    comparisonTable: table,
    faqs,
    relatedSlugs,
    imageKey,
  };
}

function makeGuide(
  slug: string,
  title: string,
  seoTitle: string,
  metaDescription: string,
  summary: string,
  verdict: string,
  overview: string[],
  guideItems: ComparisonGuideItem[],
  faqs: FAQ[],
  relatedSlugs: string[],
  imageKey: string,
): Comparison {
  return {
    slug,
    title,
    seoTitle,
    metaDescription,
    kind: "guide",
    summary,
    verdict,
    overview,
    guideItems,
    faqs,
    relatedSlugs,
    imageKey,
  };
}

export const comparisons: Comparison[] = [
  makeVersus(
    "vatican-vs-colosseum",
    "Vatican",
    "Colosseum",
    "On a single Civitavecchia port day, Vatican and Colosseum both demand 75–80 minutes each way plus 2–3 hours on site — choose one interior, not both, unless your ship stays 11+ hours.",
    "Choose Vatican if papal art and Sistine Chapel are your priority; choose Colosseum if ancient Rome and gladiator history define your bucket list. First-timers torn between them should pick whichever sells out first and book early.",
    [
      "Both anchors sit in Rome centre roughly 70 km from Civitavecchia — identical transfer burden. Vatican Museums need skip-the-line timed entry; Colosseum needs timed entry plus more walking on uneven ruins.",
      "Vatican routes include 2–3 hours indoors with dress code and no photography in the Sistine Chapel. Colosseum routes combine Forum and Palatine with sun exposure and slopes.",
      "Strong excursions exist for both — do not attempt both interiors on 9-hour calls. Exterior photo of the second sight is the realistic compromise.",
    ],
    [
      { category: "Transfer from Civitavecchia", optionA: "~75–80 min each way", optionB: "~75–80 min each way" },
      { category: "Time on site", optionA: "2–3 hours Museums route", optionB: "2–3 hours with Forum" },
      { category: "Ticket pressure", optionA: "Very high — sellouts common", optionB: "Very high — sellouts common" },
      { category: "Walking difficulty", optionA: "Moderate — long gallery miles", optionB: "Moderate–active — uneven ruins" },
      { category: "Best for", optionA: "Art, faith, Sistine Chapel", optionB: "Ancient history, gladiators" },
      { category: "Return-to-ship confidence", optionA: "High on morning guided tours", optionB: "High on morning guided tours" },
    ],
    [
      { question: "Can I do both on one port day?", answer: "Not both interiors on standard 9–10 hour calls. Choose one anchor; add exterior photos of the other if time allows." },
      { question: "Which is better for first-timers?", answer: "Split evenly — pick the one you care about more. Our Rome Highlights tour covers exterior stops at both when an interior is not required." },
    ],
    ["rome-in-one-day-what-can-you-see", "best-rome-excursions-first-time", "vatican-in-one-day"],
    "vatican",
  ),
  makeVersus(
    "diy-vs-guided",
    "DIY Rome by Train",
    "Guided Shore Excursion",
    "DIY train days from Civitavecchia cost less but add Termini connections, ticket logistics and moderate return-to-ship risk. Guided excursions cost more with highest timing confidence.",
    "Choose DIY if you are an experienced European traveller on a long port call with pre-bought tickets and a strict personal schedule. Choose guided for first-time Rome, families and anyone who cannot afford a missed all-aboard.",
    [
      "DIY: regional train ~50–60 min to Termini plus metro — total ~80–90 min door to sight. You manage Colosseum or Vatican tickets, restaurant stops and the return train alone.",
      "Guided: coach or van from terminal (~75 min) with tickets and guide included. Operators track ship departure and build 60–90 minute buffers.",
      "DIY saves €40–80 per person for confident travellers; guided saves stress and costly mistakes on ticket days.",
    ],
    [
      { category: "Cost per person", optionA: "€15–40 plus tickets", optionB: "€90–180+ all-in" },
      { category: "Return confidence", optionA: "Moderate — train delays happen", optionB: "High — operator tracks ship" },
      { category: "Ticket handling", optionA: "You pre-buy online", optionB: "Usually included" },
      { category: "Best for", optionA: "Experienced, long port calls", optionB: "First-timers and families" },
    ],
    [
      { question: "Is the train safe for cruise passengers?", answer: "Generally yes — allow extra margin and avoid the last possible train back." },
      { question: "Best DIY sight?", answer: "Colosseum or Vatican with pre-bought timed entry — centro fountains are free add-ons on foot." },
    ],
    ["train-vs-private-transfer", "cruise-line-vs-independent", "train-diy-guide"],
    "train",
  ),
  makeVersus(
    "cruise-line-vs-independent",
    "Cruise Line Excursion",
    "Independent Tour",
    "Ship tours guarantee the vessel waits if their tour runs late; independent operators with good reviews also track all-aboard but will not delay departure if you separate from the group.",
    "Choose cruise line if you cannot tolerate any risk of missing the ship and prefer onboard billing. Choose independent for smaller groups, better pacing and often lower prices when you respect return times.",
    [
      "Cruise line coaches carry 40–50 passengers with rigid shopping stops. Independent small-group tours (8–16) reach sights faster with more guide interaction.",
      "Ship waits only if you are on their ticketed excursion — not if their bus breaks down and you are stranded (rare but documented). Independents build buffers but you must respect meeting times.",
      "Price gap narrows on premium independents; widens on budget ship coaches versus small-group specialists.",
    ],
    [
      { category: "Ship waits if late", optionA: "Yes — on their tour", optionB: "No — but rare if you follow instructions" },
      { category: "Group size", optionA: "40–50 typical", optionB: "8–16 on quality tours" },
      { category: "Pricing", optionA: "Premium onboard markup", optionB: "Often 20–40% less" },
      { category: "Return confidence", optionA: "Very high on ship tour", optionB: "High with reputable operator" },
    ],
    [
      { question: "Are independent tours safe at Civitavecchia?", answer: "Yes — use established operators with ship-tracking policies and read recent reviews." },
      { question: "Will the ship wait for independent tours?", answer: "No — only ship-sponsored excursions carry the delay guarantee." },
    ],
    ["diy-vs-guided", "best-rome-excursions-first-time", "private-rome"],
    "excursions",
  ),
  makeVersus(
    "train-vs-private-transfer",
    "Regional Train",
    "Private Transfer",
    "Train from Civitavecchia to Rome costs a few euros but adds station walks and Termini connections. Private transfer is ~75 minutes terminal to centro with fixed pricing.",
    "Choose train for budget solo travellers on long calls with light luggage. Choose private transfer for families, groups, tight schedules and embarkation days with suitcases.",
    [
      "Train: Civitavecchia station 10–15 min walk from terminal, regional to Termini ~50–60 min, then metro or taxi to sights.",
      "Private: meet at terminal, drive to Colosseum or Vatican in ~75 min. Return pickup at agreed point — no station navigation.",
      "Groups of 3+ often find private minivan per-head cost approaches train plus metro plus taxi.",
    ],
    [
      { category: "Door-to-door time", optionA: "~80–90 min", optionB: "~75 min" },
      { category: "Luggage friendly", optionA: "Poor", optionB: "Excellent" },
      { category: "Typical cost", optionA: "€5–15 per person", optionB: "€120–220 per vehicle" },
      { category: "Embarkation day", optionA: "Stressful with bags", optionB: "Recommended" },
    ],
    [
      { question: "Is train OK for port day sightseeing?", answer: "Yes for experienced travellers — less ideal for first Rome visit or short calls." },
      { question: "When is private essential?", answer: "Embarkation/disembarkation with luggage, families with strollers, mobility limitations." },
    ],
    ["civitavecchia-to-rome", "private-transfers", "train-diy-guide"],
    "transfers",
  ),
  makeGuide(
    "rome-in-one-day-what-can-you-see",
    "Rome in One Day — What Can You Actually See?",
    "Rome in One Day from Civitavecchia — Realistic Sight List",
    "Honest guide to what fits in one Civitavecchia port day after 75–80 minute transfers each way.",
    "After transfers, a 10-hour port call gives roughly 6 hours in Rome — enough for one major interior plus several free exterior stops, not a comprehensive museum marathon.",
    "Prioritise one ticketed anchor, cluster free sights nearby, and leave 60–90 minutes return buffer. Evening departures enable extended centro time.",
    [
      "Standard 9–10 hour call: one of Colosseum interior OR Vatican Museums OR comprehensive centro exteriors (Trevi, Pantheon, Navona, Spanish Steps).",
      "11-hour call: Colosseum plus quick Trevi/Pantheon OR Vatican plus Castel Sant'Angelo exterior.",
      "7–8 hour call: centro walking tour or single monument — skip dual interiors entirely.",
    ],
    [
      { name: "Rome Highlights Tour", slug: "rome-highlights", href: "/shore-excursions/rome-highlights", reason: "Best single-day overview with efficient routing and return timing.", topExcursion: "Rome Highlights Excursion", returnConfidence: "High — built for standard port windows", walkingDifficulty: "Moderate — centro cobbles" },
      { name: "Ancient Rome Combo", slug: "ancient-rome-combo", href: "/shore-excursions/ancient-rome-combo", reason: "When Colosseum and Forum are your non-negotiable anchor.", topExcursion: "Ancient Rome Combo", returnConfidence: "High on 9+ hour calls", walkingDifficulty: "Active — ruins and slopes" },
      { name: "Vatican Excursion", slug: "vatican", href: "/shore-excursions/vatican", reason: "When Sistine Chapel and St Peter's define your day.", topExcursion: "Vatican Shore Excursion", returnConfidence: "High with morning entry", walkingDifficulty: "Moderate — long museum walk" },
      { name: "Golf Cart Tour", slug: "golf-cart", href: "/shore-excursions/golf-cart", reason: "Maximum centro icons with minimal walking on hot days.", topExcursion: "Golf Cart Rome Tour", returnConfidence: "High — compact route", walkingDifficulty: "Easy — minimal steps" },
    ],
    [
      { question: "Can I see Colosseum and Vatican same day?", answer: "Both interiors only on exceptional 11-hour calls with pre-booked entries — not recommended for first-timers." },
    ],
    ["vatican-vs-colosseum", "rome-in-one-day", "best-rome-excursions-first-time"],
    "city",
  ),
  makeGuide(
    "best-rome-excursions-first-time",
    "Best Rome Excursions for First-Time Visitors",
    "Best Civitavecchia Shore Excursions for First-Timers",
    "Ranked Rome shore excursions for first-time cruise passengers at Civitavecchia.",
    "First-timers need one clear anchor, skip-the-line tickets, door-to-door transfer and a operator who understands all-aboard — these four excursions deliver that consistently.",
    "Book before sailing in peak season. Morning starts protect afternoon return margins.",
    [
      "Rome Highlights balances icons without requiring two major tickets.",
      "Ancient Rome combo suits history-first passengers.",
      "Vatican excursion suits art and faith priorities.",
      "Private tour suits mixed groups wanting flexibility.",
    ],
    [
      { name: "Rome Highlights", slug: "rome-highlights", href: "/shore-excursions/rome-highlights", reason: "Editor's pick for first Rome day — icons, pacing and return confidence.", topExcursion: "Rome Highlights Excursion", returnConfidence: "High", walkingDifficulty: "Moderate" },
      { name: "Ancient Rome Combo", slug: "ancient-rome-combo", href: "/shore-excursions/ancient-rome-combo", reason: "Best when Colosseum interior is your must-do.", topExcursion: "Ancient Rome Combo", returnConfidence: "High", walkingDifficulty: "Active" },
      { name: "Vatican", slug: "vatican", href: "/shore-excursions/vatican", reason: "Best when Sistine Chapel is your must-do.", topExcursion: "Vatican Excursion", returnConfidence: "High", walkingDifficulty: "Moderate" },
      { name: "Private Rome", slug: "private-rome", href: "/shore-excursions/private-rome", reason: "Best for families wanting custom pacing.", topExcursion: "Private Rome Tour", returnConfidence: "Very high", walkingDifficulty: "Flexible" },
    ],
    [
      { question: "One excursion for first-timers?", answer: "Rome Highlights — or Ancient Rome / Vatican if you have a strong preference." },
    ],
    ["rome-in-one-day-what-can-you-see", "vatican-vs-colosseum", "cruise-line-vs-independent"],
    "excursions",
  ),
  makeGuide(
    "best-rome-excursions-families",
    "Best Rome Excursions for Families",
    "Family Rome Shore Excursions from Civitavecchia",
    "Family-friendly Rome excursions from Civitavecchia — pacing, strollers and kid engagement.",
    "Families need short transfers, engaging guides, toilet breaks and realistic sight counts — these excursions prioritise gladiator stories, gelato and parks over museum marathons.",
    "Avoid Vatican Museums with toddlers unless your children tolerate long indoor walks.",
    [
      "Family Rome balances Colosseum stories with gelato and shorter walks.",
      "Private tours adapt stops for stroller access.",
      "Golf carts reduce walking in summer heat.",
    ],
    [
      { name: "Family Rome", slug: "family-rome", href: "/shore-excursions/family-rome", reason: "Purpose-built kid pacing from Civitavecchia.", topExcursion: "Family Rome Excursion", returnConfidence: "High", walkingDifficulty: "Moderate — tailored pauses" },
      { name: "Private Rome", slug: "private-rome", href: "/shore-excursions/private-rome", reason: "Custom stops and vehicle at each site — best with strollers.", topExcursion: "Private Rome Tour", returnConfidence: "Very high", walkingDifficulty: "Flexible" },
      { name: "Golf Cart", slug: "golf-cart", href: "/shore-excursions/golf-cart", reason: "Fun transport kids enjoy with minimal walking.", topExcursion: "Golf Cart Tour", returnConfidence: "High", walkingDifficulty: "Easy" },
      { name: "Rome Highlights", slug: "rome-highlights", href: "/shore-excursions/rome-highlights", reason: "Teens and tweens — efficient icon overview.", topExcursion: "Rome Highlights", returnConfidence: "High", walkingDifficulty: "Moderate" },
    ],
    [{ question: "Age for Vatican Museums?", answer: "School age and up with stamina — young children better served by St Peter's square and exterior stops." }],
    ["family-rome", "family-hotels", "best-rome-excursions-first-time"],
    "family",
  ),
  makeGuide(
    "best-rome-excursions-couples",
    "Best Rome Excursions for Couples",
    "Romantic Rome Shore Excursions from Civitavecchia",
    "Couples' Rome excursions — intimate tours, wine and evening options from Civitavecchia.",
    "Couples often prefer private vehicles, Trastevere lunches and sunset viewpoints over crowded coaches — these options deliver atmosphere without sacrificing return timing.",
    "Late ship departures unlock evening fountain tours.",
    [
      "Luxury private tours offer Mercedes transport and terrace lunches.",
      "Food and wine tours suit culinary couples.",
      "Evening Rome fits ships departing after 20:00.",
    ],
    [
      { name: "Luxury Rome", slug: "luxury-rome", href: "/shore-excursions/luxury-rome", reason: "Premium private day with flexible romantic pacing.", topExcursion: "Luxury Rome Tour", returnConfidence: "Very high", walkingDifficulty: "Flexible" },
      { name: "Food Tours", slug: "food-tours", href: "/shore-excursions/food-tours", reason: "Trastevere tastings and wine — shared culinary experience.", topExcursion: "Roman Food Tour", returnConfidence: "High", walkingDifficulty: "Moderate" },
      { name: "Hidden Rome", slug: "hidden-rome", href: "/shore-excursions/hidden-rome", reason: "Intimate neighbourhoods away from coach crowds.", topExcursion: "Hidden Rome Tour", returnConfidence: "High", walkingDifficulty: "Moderate" },
      { name: "Evening Rome", slug: "evening-rome", href: "/experiences/evening-rome", reason: "Lit fountains and aperitivo for late departures.", topExcursion: "Evening Rome Excursion", returnConfidence: "High on late ships", walkingDifficulty: "Moderate" },
    ],
    [{ question: "Most romantic single excursion?", answer: "Luxury private Rome with Trastevere lunch — or food tour for culinary couples." }],
    ["luxury-rome", "food-tours", "evening-rome"],
    "luxury",
  ),
  makeGuide(
    "best-rome-excursions-history-lovers",
    "Best Rome Excursions for History Lovers",
    "Ancient Rome Shore Excursions from Civitavecchia",
    "Depth-first Rome excursions — Colosseum, Forum, Palatine and layered history for cruise passengers.",
    "History lovers should anchor on Ancient Rome combo with expert archaeologist guides — avoid highlights tours that reduce Forum to a photo stop.",
    "Vatican history layers Christian and Renaissance narratives — pair on two Rome visits, not one port day.",
    [
      "Ancient Rome combo maximises Forum and Palatine time.",
      "Colosseum underground tours available on select tickets.",
      "Hidden Rome adds Appian Way and Jewish Ghetto context.",
    ],
    [
      { name: "Ancient Rome Combo", slug: "ancient-rome-combo", href: "/shore-excursions/ancient-rome-combo", reason: "Editor's pick for ancient history depth.", topExcursion: "Ancient Rome Combo", returnConfidence: "High", walkingDifficulty: "Active" },
      { name: "Colosseum", slug: "colosseum", href: "/shore-excursions/colosseum", reason: "Focused gladiator arena with maximum arena time.", topExcursion: "Colosseum Excursion", returnConfidence: "High", walkingDifficulty: "Moderate" },
      { name: "Vatican", slug: "vatican", href: "/shore-excursions/vatican", reason: "Renaissance and papal history through museums route.", topExcursion: "Vatican Excursion", returnConfidence: "High", walkingDifficulty: "Moderate" },
      { name: "Hidden Rome", slug: "hidden-rome", href: "/shore-excursions/hidden-rome", reason: "Jewish Ghetto, Appian Way and layered neighbourhood history.", topExcursion: "Hidden Rome Tour", returnConfidence: "High", walkingDifficulty: "Moderate" },
    ],
    [{ question: "Forum enough time on combo tours?", answer: "Quality combos allow 60–90 minutes Forum/Palatine — verify inclusions before booking." }],
    ["colosseum-from-cruise-port", "roman-forum-from-cruise-port", "vatican-vs-colosseum"],
    "colosseum",
  ),
];

export function getComparisonBySlug(slug: string): Comparison | undefined {
  return comparisons.find((c) => c.slug === slug);
}

export function getAllComparisonSlugs(): string[] {
  return comparisons.map((c) => c.slug);
}

export function getComparisonDisplayTitle(comp: Comparison): string {
  if (comp.kind === "versus" && comp.optionA && comp.optionB) {
    return \`\${comp.optionA} vs \${comp.optionB}\`;
  }
  return comp.title;
}
`);

console.log("Part 3 comparisons done");
