#!/usr/bin/env node
/**
 * Generates Genoa / Italian Riviera cruise planning content data files.
 * Run: node scripts/generate-genoa-data.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const DATA = join(import.meta.dirname, "..", "src/data");
mkdirSync(join(DATA, "imported-schedules"), { recursive: true });

function w(name, content) {
  writeFileSync(join(DATA, name), content, "utf8");
  console.log("wrote", name);
}

function esc(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

const PORT_BASE =
  "Cruise ships dock at Genoa's Stazione Marittime cruise terminal in the Porto Antico area — the gateway to the Italian Riviera. Portofino sits 35 km east along the coast, Santa Margherita Ligure 32 km, Camogli 28 km. Most passengers reach the Riviera by coach excursion, private transfer, regional train to Santa Margherita, or ferry from Genoa harbour. Build a 60–90 minute buffer before all-aboard — summer coastal road traffic returning from Portofino can add 20–30 minutes.";

const GT = `[
      { method: "Regional train from Genova Piazza Principe / Brignole", detail: "Direct services to Santa Margherita Ligure — allow 15–25 min taxi from cruise terminal to station.", time: "45–60 min", cost: "€4–8" },
      { method: "Shore excursion minivan/coach", detail: "Door-to-door with guide, timed return and harbour drop-offs on the Riviera.", time: "Full day", cost: "Tour price" },
      { method: "Ferry from Genoa to Camogli/Portofino (seasonal)", detail: "Seasonal passenger ferries from Porto Antico — check timetables; not daily on all sailings.", time: "45–90 min", cost: "€15–25" },
      { method: "Private transfer", detail: "Pre-booked car or minivan to Portofino, Santa Margherita or Camogli.", time: "40–75 min", cost: "€120–280" },
    ]`;

const PORT_LOGISTICS =
  "Ships dock at Genoa Stazione Marittime in Porto Antico. Allow 15–25 minutes taxi to Genova Piazza Principe or Brignole for trains, or meet your coach at the terminal exit. Confirm all-aboard and keep a 60–90 minute buffer — summer coastal road traffic returning from Portofino can delay returns by 20–30 minutes.";

const SIGNATURE_EXPERIENCE_PATH = "/ultimate-italian-riviera-day";

function faq(q, a) {
  return `{ question: "${esc(q)}", answer: "${esc(a)}" }`;
}

function rec(cat, title, desc, href) {
  return `{ category: "${cat}", title: "${esc(title)}", description: "${esc(desc)}", href: "${href}" }`;
}

function attraction(cfg) {
  return `  {
    slug: "${cfg.slug}",
    title: "${esc(cfg.title)}",
    seoTitle: "${esc(cfg.seoTitle)}",
    metaDescription: "${esc(cfg.meta)}",
    attractionName: "${esc(cfg.name)}",
    tagline: "${esc(cfg.tagline)}",
    overview: "${esc(cfg.overview)}",
    body: [
      "${esc(PORT_BASE)}",
      "${esc(cfg.body2)}",
      "${esc(cfg.body3)}",
    ],
    distanceFromPort: "${esc(cfg.distance)}",
    travelTime: "${esc(cfg.travel)}",
    timeNeeded: "${esc(cfg.timeNeeded)}",
    gettingThere: ${GT},
    highlights: [${cfg.highlights.map((h) => `"${esc(h)}"`).join(", ")}],
    tips: [${cfg.tips.map((t) => `"${esc(t)}"`).join(", ")}],
    faqs: [${cfg.faqs.map(([q, a]) => faq(q, a)).join(", ")}],
    relatedAttractionSlugs: [${cfg.related.map((r) => `"${r}"`).join(", ")}],
    relatedExcursionSlug: "${cfg.excursion}",
  }`;
}

function guide(cfg) {
  const recs = cfg.recommendations?.length
    ? `,\n    recommendations: [\n      ${cfg.recommendations.map((r) => rec(r.cat, r.title, r.desc, r.href)).join(",\n      ")}\n    ]`
    : "";
  return `  {
    slug: "${cfg.slug}",
    title: "${esc(cfg.title)}",
    seoTitle: "${esc(cfg.seoTitle)}",
    metaDescription: "${esc(cfg.meta)}",
    tagline: "${esc(cfg.tagline)}",
    overview: "${esc(cfg.overview)}",
    body: [
      "${esc(cfg.body1)}",
      "${esc(cfg.body2)}",
      "${esc(cfg.body3)}",
    ],
    highlights: [${cfg.highlights.map((h) => `"${esc(h)}"`).join(", ")}],
    tips: [${cfg.tips.map((t) => `"${esc(t)}"`).join(", ")}],
    faqs: [${cfg.faqs.map(([q, a]) => faq(q, a)).join(", ")}]${recs},
    relatedSlugs: [${cfg.related.map((r) => `"${r}"`).join(", ")}],
    imageKey: "${cfg.imageKey}",
    hubPath: "/guides",
  }`;
}

function excursion(cfg) {
  const featured = cfg.featured ? ",\n    featured: true" : "";
  return `  {
    slug: "${cfg.slug}",
    title: "${esc(cfg.title)}",
    seoTitle: "${esc(cfg.seoTitle)}",
    metaDescription: "${esc(cfg.meta)}",
    category: "${esc(cfg.category)}",
    tagline: "${esc(cfg.tagline)}",
    duration: "${esc(cfg.duration)}",
    pace: "${cfg.pace}",
    bestFor: "${esc(cfg.bestFor)}",
    overview: "${esc(cfg.overview)}",
    body: [
      "${esc(cfg.body1)}",
      "${esc(cfg.body2)}",
      "${esc(cfg.body3)}",
    ],
    highlights: [${cfg.highlights.map((h) => `"${esc(h)}"`).join(", ")}],
    included: [${cfg.included.map((i) => `"${esc(i)}"`).join(", ")}],
    portLogistics: PORT_LOGISTICS,
    tips: [${cfg.tips.map((t) => `"${esc(t)}"`).join(", ")}],
    faqs: [${cfg.faqs.map(([q, a]) => faq(q, a)).join(", ")}],
    relatedExcursionSlugs: [${cfg.related.map((r) => `"${r}"`).join(", ")}]${featured},
  }`;
}

function versus(cfg) {
  return `  {
    slug: "${cfg.slug}",
    title: "${esc(cfg.optionA)} vs ${esc(cfg.optionB)}",
    seoTitle: "${esc(cfg.seoTitle || cfg.optionA + " vs " + cfg.optionB + " — Genoa Cruise Passengers")}",
    metaDescription: "${esc(cfg.summary)}",
    kind: "versus",
    optionA: "${esc(cfg.optionA)}",
    optionB: "${esc(cfg.optionB)}",
    summary: "${esc(cfg.summary)}",
    verdict: "${esc(cfg.verdict)}",
    overview: [${cfg.overview.map((o) => `"${esc(o)}"`).join(", ")}],
    comparisonTable: [${cfg.table.map((r) => `{ category: "${esc(r.category)}", optionA: "${esc(r.optionA)}", optionB: "${esc(r.optionB)}" }`).join(", ")}],
    faqs: [${cfg.faqs.map(([q, a]) => faq(q, a)).join(", ")}],
    relatedSlugs: [${cfg.related.map((r) => `"${r}"`).join(", ")}],
    imageKey: "${cfg.imageKey}",
  }`;
}

function comparisonGuide(cfg) {
  return `  {
    slug: "${cfg.slug}",
    title: "${esc(cfg.title)}",
    seoTitle: "${esc(cfg.seoTitle)}",
    metaDescription: "${esc(cfg.meta)}",
    kind: "guide",
    summary: "${esc(cfg.summary)}",
    verdict: "${esc(cfg.verdict)}",
    overview: [${cfg.overview.map((o) => `"${esc(o)}"`).join(", ")}],
    guideItems: [${cfg.guideItems.map((g) => `{
        name: "${esc(g.name)}",
        slug: "${g.slug}",
        href: "${g.href}",
        reason: "${esc(g.reason)}",
        topExcursion: "${esc(g.topExcursion)}",
        returnConfidence: "${esc(g.returnConfidence)}",
        walkingDifficulty: "${esc(g.walkingDifficulty)}",
      }`).join(", ")}],
    faqs: [${cfg.faqs.map(([q, a]) => faq(q, a)).join(", ")}],
    relatedSlugs: [${cfg.related.map((r) => `"${r}"`).join(", ")}],
    imageKey: "${cfg.imageKey}",
  }`;
}

// ─── HIGHLIGHTS (authority attraction pages) ─────────────────────────────────

const attractions = [
  {
    slug: "portofino-from-genoa",
    name: "Portofino from Genoa",
    title: "Portofino from Genoa Cruise Port",
    seoTitle: "Portofino from Genoa — Shore Excursions & Travel Guide for Cruise Passengers",
    meta: "How to reach Portofino from Genoa cruise port — travel times, harbour walks, viewpoints and return-to-ship planning for Italian Riviera cruise passengers.",
    tagline: "The world's most photographed harbour — pastel facades and yacht-filled waters east of Genoa.",
    overview: "Portofino is the icon of the Italian Riviera. From Genoa's Stazione Marittime terminal, coach excursions or private transfers deliver you to the tiny harbour village in 60–75 minutes along the coastal road.",
    body2: "A Portofino day needs 3–4 hours ashore minimum once you arrive. Prioritise the harbour promenade, Castello Brown viewpoint and the walk to San Giorgio church — not multiple inland hikes on a standard call.",
    body3: "Return coaches typically depart Portofino by 15:30–16:00 for 17:00–18:00 all-aboard. Summer coastal traffic back to Genoa can add 20–30 minutes — build your buffer accordingly.",
    distance: "About 35 km / 60–75 min from Genoa terminal",
    travel: "60–75 minutes by coach or private transfer",
    timeNeeded: "Allow 3–4 hours in Portofino on a full-day excursion",
    highlights: ["Portofino harbour and pastel waterfront", "Castello Brown panoramic views", "San Giorgio church above the village", "Luxury yacht spotting at the marina"],
    tips: ["Arrive before 11:00 to beat midday coach crowds", "Wear comfortable shoes — village lanes are steep", "Book excursions before sailing in July and August"],
    faqs: [
      ["Can I visit Portofino on a Genoa port day?", "Yes on calls of 8+ usable hours. Standard 9–10 hour port days suit a focused Portofino excursion with 3–4 hours in the village."],
      ["Is the train an option to Portofino?", "Train to Santa Margherita Ligure then bus or boat — see our independent Riviera guide for DIY timing."],
    ],
    related: ["portofino-harbour-guide", "santa-margherita-from-genoa", "italian-riviera-guide"],
    excursion: "ultimate-italian-riviera-day",
  },
  {
    slug: "santa-margherita-from-genoa",
    name: "Santa Margherita Ligure from Genoa",
    title: "Santa Margherita Ligure from Genoa Cruise Port",
    seoTitle: "Santa Margherita Ligure from Genoa — Riviera Town & Portofino Gateway",
    meta: "Reach Santa Margherita Ligure from Genoa cruise port — seaside promenade, train access, boat links to Portofino and return planning.",
    tagline: "Elegant seaside resort — the practical gateway to Portofino and the eastern Riviera.",
    overview: "Santa Margherita Ligure is a graceful coastal town 32 km east of Genoa — palm-lined promenade, Belle Époque hotels and the regional train station closest to Portofino.",
    body2: "Most excursions pause here for coffee or lunch before continuing to Portofino or Camogli. Independent travellers can train from Genova Piazza Principe in about 45 minutes and connect by ferry or bus to Portofino.",
    body3: "Santa Margherita suits passengers who want Riviera atmosphere without Portofino's crush — allow 2–3 hours for the promenade, harbour and gelato stops.",
    distance: "About 32 km / 50–60 min from Genoa terminal",
    travel: "50–60 minutes by coach; 45 min by regional train",
    timeNeeded: "Allow 2–3 hours in Santa Margherita",
    highlights: ["Lungomare waterfront promenade", "Santa Margherita harbour", "Regional train hub for the Riviera", "Boat connections to Portofino"],
    tips: ["Train from Piazza Principe is the best DIY option", "Combine with Portofino only on 9+ hour calls", "Lunch on the promenade needs reservation on cruise days"],
    faqs: [
      ["Is Santa Margherita worth visiting alone?", "Yes for a relaxed Riviera day — especially if Portofino crowds worry you."],
      ["How do I reach Portofino from Santa Margherita?", "Seasonal ferry (15 min) or local bus — allow queue time on busy summer days."],
    ],
    related: ["santa-margherita-promenade", "portofino-from-genoa", "italian-riviera-guide"],
    excursion: "portofino-santa-margherita",
  },
  {
    slug: "camogli-from-genoa",
    name: "Camogli from Genoa",
    title: "Camogli from Genoa Cruise Port",
    seoTitle: "Camogli from Genoa — Fishing Village Shore Excursions & Timings",
    meta: "Reach Camogli's colourful fishing village from Genoa cruise port — harbour, beach, regional train and return-to-ship confidence.",
    tagline: "Pastel fishermen's houses and working harbour — the Riviera's most authentic village.",
    overview: "Camogli sits 28 km east of Genoa — a photogenic fishing village with tall pastel houses, a lively marina and a pebble beach. It is closer than Portofino and often less crowded on cruise days.",
    body2: "Most excursions allow 2–3 hours: harbour stroll, beach time, focaccia at a waterfront bakery and views from the pier. The village is compact and walkable on gentle slopes.",
    body3: "Camogli pairs naturally with Portofino on combo excursions, or stands alone on shorter port days when the coastal road to Portofino feels too ambitious.",
    distance: "About 28 km / 45–55 min from Genoa terminal",
    travel: "45–55 minutes by road or regional train",
    timeNeeded: "Allow 2–3 hours in Camogli",
    highlights: ["Colourful harbour facades", "Camogli beach and promenade", "San Rocco hillside church", "Fresh seafood and focaccia"],
    tips: ["Morning light is best for harbour photography", "Regional train stops at Camogli-San Fruttuoso station", "Combine with Portofino only on long calls"],
    faqs: [
      ["Camogli or Portofino for a first visit?", "Portofino for the icon; Camogli for atmosphere and fewer crowds — see our comparison."],
      ["Can I swim at Camogli on a port day?", "Yes in summer — allow time to dry off before coach departure."],
    ],
    related: ["camogli-fishing-village", "portofino-from-genoa", "best-beaches"],
    excursion: "riviera-highlights",
  },
  {
    slug: "italian-riviera-guide",
    name: "Italian Riviera",
    title: "Italian Riviera Guide from Genoa Cruise Port",
    seoTitle: "Italian Riviera from Genoa — Portofino, Camogli & Coastal Towns Guide",
    meta: "Plan your Italian Riviera day from Genoa cruise port — Portofino, Santa Margherita, Camogli, travel options and realistic port-day scope.",
    tagline: "Liguria's glittering coast — from Genoa's harbour to Portofino's pastel perfection.",
    overview: "The Italian Riviera (Riviera di Levante) stretches east from Genoa through Camogli, Santa Margherita and Portofino to the Cinque Terre beyond. Cruise passengers typically focus on the Portofino peninsula on a single port day.",
    body2: "One Riviera day means one coastal anchor — Portofino combo, Camogli village, or a food-focused Ligurian lunch — not Portofino plus Cinque Terre independently on standard calls.",
    body3: "Coastal road traffic peaks on summer afternoons returning to Genoa. Excursion operators schedule departures with 60–90 minute buffers before all-aboard.",
    distance: "Portofino 35 km; Camogli 28 km; Santa Margherita 32 km",
    travel: "45–75 minutes depending on destination",
    timeNeeded: "Allow 6–7 usable hours ashore for a Riviera excursion",
    highlights: ["Portofino harbour village", "Santa Margherita promenade", "Camogli fishing port", "Coastal viewpoints above the sea"],
    tips: ["Pick one anchor per port day", "Book excursions before peak summer sailings", "Check seasonal ferry timetables for DIY travellers"],
    faqs: [
      ["Can I see the Cinque Terre from Genoa?", "Not realistically on a standard port day — focus on Portofino peninsula towns instead."],
      ["Best first Riviera destination?", "Portofino on organised excursions; Camogli for a calmer alternative."],
    ],
    related: ["portofino-from-genoa", "camogli-from-genoa", "one-day-on-the-riviera"],
    excursion: "riviera-highlights",
  },
  {
    slug: "portofino-harbour-guide",
    name: "Portofino Harbour",
    title: "Portofino Harbour Guide for Cruise Passengers",
    seoTitle: "Portofino Harbour — Cruise Day Visit & Photography Tips",
    meta: "Explore Portofino's famous harbour from Genoa — waterfront walks, best photo spots, timing and return planning for cruise passengers.",
    tagline: "Yachts, pastel facades and café tables at the water's edge.",
    overview: "Portofino's harbour is one of the Mediterranean's most recognisable scenes — a tiny crescent of boutiques, restaurants and fishing boats framed by green headlands.",
    body2: "Allow 90 minutes for the waterfront circuit: Piazzetta photos, marina walk, gelato stop and the lane up toward San Giorgio. Midday brings coach groups — arrive early with your excursion.",
    body3: "Harbour restaurants charge premium prices — a quick focaccia or picnic viewpoint lunch preserves time and budget for sightseeing.",
    distance: "Heart of Portofino village",
    travel: "Walk from coach drop-off at village entrance",
    timeNeeded: "Allow 90 minutes for the harbour area",
    highlights: ["Piazzetta and waterfront cafés", "Marina and superyacht spotting", "Harbour photography from the pier", "Lane to San Giorgio church"],
    tips: ["Photograph from the pier for classic harbour views", "Visit before 11:00 on summer cruise days", "Wear sun protection — shade is limited on the waterfront"],
    faqs: [
      ["How crowded is Portofino harbour?", "Very on summer cruise days 11:00–15:00 — early arrival helps."],
      ["Are harbour restaurants worth it?", "Atmosphere yes; value mixed — quick bites preserve sightseeing time."],
    ],
    related: ["portofino-from-genoa", "best-photography-locations", "best-viewpoints"],
    excursion: "ultimate-italian-riviera-day",
  },
  {
    slug: "santa-margherita-promenade",
    name: "Santa Margherita Promenade",
    title: "Santa Margherita Promenade Guide for Cruise Passengers",
    seoTitle: "Santa Margherita Lungomare — Riviera Walk from Genoa",
    meta: "Walk Santa Margherita's seaside promenade from Genoa cruise port — distances, cafés, boat links and cruise-day timing.",
    tagline: "Palm trees, pastel hotels and the gentle rhythm of the Ligurian coast.",
    overview: "Santa Margherita's lungomare stretches along a graceful bay — ideal for a relaxed Riviera hour between coach transfers or as the focus of a calmer port day.",
    body2: "The promenade walk from the train station to the harbour takes 20–30 minutes each way with café stops. Belle Époque villas and fishing boats share the waterfront.",
    body3: "Combine the promenade with a ferry to Portofino only if your excursion or independent schedule allows 90 minutes in each location plus return buffer.",
    distance: "Santa Margherita Ligure waterfront",
    travel: "Walk from train station or coach drop-off",
    timeNeeded: "Allow 60–90 minutes for the promenade",
    highlights: ["Palm-lined lungomare", "Harbour and fishing fleet", "Belle Époque hotel facades", "Ferry pier to Portofino"],
    tips: ["Gelato on the promenade is a Riviera ritual", "Morning walks beat afternoon coach congestion", "Reserve waterfront lunch tables on cruise days"],
    faqs: [
      ["Is the promenade flat?", "Yes — one of the easiest Riviera walks for limited mobility."],
      ["Walk or bus to Portofino?", "Ferry is scenic and avoids road traffic — check seasonal timetables."],
    ],
    related: ["santa-margherita-from-genoa", "portofino-from-genoa", "romantic-riviera"],
    excursion: "portofino-santa-margherita",
  },
  {
    slug: "camogli-fishing-village",
    name: "Camogli Fishing Village",
    title: "Camogli Fishing Village Guide for Cruise Passengers",
    seoTitle: "Camogli Fishing Village — Harbour & Old Town from Genoa",
    meta: "Explore Camogli's fishing village from Genoa cruise port — harbour lanes, San Rocco church, beach and authentic Ligurian atmosphere.",
    tagline: "Working fishing port meets Riviera colour — without Portofino's price tag.",
    overview: "Camogli retains the feel of a working Ligurian port — fish markets, tall pastel houses stacked above the marina and a pebble beach at the village edge.",
    body2: "The classic walk: harbour promenade → Via Garibaldi lanes → beach → optional climb toward San Rocco for panoramic views. Allow 2–3 hours without rushing.",
    body3: "Camogli's annual fish festival (second Sunday in May) draws huge crowds — check dates if your sailing coincides.",
    distance: "Camogli historic centre, 28 km from Genoa",
    travel: "45–55 minutes by coach from Genoa terminal",
    timeNeeded: "Allow 2–3 hours in the village",
    highlights: ["Harbour and pastel house facades", "Via Garibaldi old-town lanes", "Camogli beach", "San Rocco hillside panorama"],
    tips: ["Try local focaccia di Recco at a bakery", "San Rocco climb adds 30 minutes but rewards with views", "Less crowded than Portofino on most cruise days"],
    faqs: [
      ["Camogli or Portofino for photography?", "Camogli for colourful houses; Portofino for the iconic harbour crescent."],
      ["Is Camogli stroller-friendly?", "Harbour and promenade yes; hillside lanes are steep."],
    ],
    related: ["camogli-from-genoa", "ligurian-cuisine", "hidden-riviera"],
    excursion: "hidden-riviera-day",
  },
  {
    slug: "ligurian-cuisine",
    name: "Ligurian Cuisine",
    title: "Ligurian Cuisine Guide for Cruise Passengers",
    seoTitle: "Ligurian Food Guide — Pesto, Seafood & Riviera Dining from Genoa",
    meta: "Essential Ligurian dishes for cruise passengers — pesto, focaccia, seafood, wine and where to eat on a Genoa port day.",
    tagline: "Pesto, focaccia and catch-of-the-day — the flavours of the Italian Riviera.",
    overview: "Ligurian cuisine is fresh, herb-driven and deeply coastal. Cruise passengers encounter it in Genoa's old town, Riviera village trattorias and dedicated food excursions.",
    body2: "Must-try dishes include trofie al pesto, focaccia di Recco, acciughe (anchovies), cappon magro seafood salad and pansoti in walnut sauce. Wine excursions often include a multi-course pranzo with Vermentino or Pigato.",
    body3: "Lunch timing matters on port days — aim to eat 12:30–13:30 so you are not rushing back from Portofino at 15:00. Avoid sit-down meals if your excursion returns before 14:00.",
    distance: "Available throughout the Riviera from Genoa excursions",
    travel: "Included in food and village tours",
    timeNeeded: "Allow 60–90 minutes for a proper Ligurian lunch",
    highlights: ["Trofie al pesto Genovese", "Focaccia di Recco", "Grilled local fish and seafood", "Vermentino and Pigato white wines"],
    tips: ["Book trattoria tables ahead in Portofino on cruise days", "Try farinata (chickpea flatbread) in Genoa if time allows", "Village lunches are the easiest food experience on a port day"],
    faqs: [
      ["What should I eat in Portofino on a port day?", "Quick focaccia or seafood pasta — save long tasting menus for dedicated food tours."],
      ["Is Genoa known for pesto?", "Yes — Genoa is the birthplace of pesto alla Genovese. Some excursions include a pesto demonstration."],
    ],
    related: ["riviera-food-guide", "taste-liguria", "camogli-fishing-village"],
    excursion: "taste-liguria",
  },
  {
    slug: "best-viewpoints",
    name: "Best Viewpoints",
    title: "Best Viewpoints on the Italian Riviera from Genoa",
    seoTitle: "Best Riviera Viewpoints — Portofino, Camogli & Coastal Panoramas",
    meta: "The best viewpoints on the Italian Riviera from Genoa cruise port — Castello Brown, San Rocco, coastal roads and return timing.",
    tagline: "Turquoise bays and terraced hills — where the Riviera reveals its full drama.",
    overview: "The Italian Riviera rewards passengers who climb briefly above the harbours — Castello Brown over Portofino, San Rocco above Camogli and headland turns on the coastal drive east from Genoa.",
    body2: "Viewpoint stops add 20–40 minutes each. On standard port days, pick one elevated lookout plus harbour level — not three climbs plus a village lunch unless hours exceed 9.",
    body3: "Morning haze burns off by 10:00 — best light for east-facing coastal panoramas is mid-morning through early afternoon.",
    distance: "Viewpoints at Portofino, Camogli and coastal road pull-offs",
    travel: "Walk or short drive from village centres",
    timeNeeded: "20–40 minutes per viewpoint",
    highlights: ["Castello Brown over Portofino harbour", "San Rocco church panorama above Camogli", "Coastal road lookout toward San Fruttuoso", "Santa Margherita bay from the promenade end"],
    tips: ["Wear grippy shoes — viewpoint paths can be steep", "Polarising filter helps with sea glare", "Allow extra time if your excursion includes a viewpoint hike"],
    faqs: [
      ["Best single viewpoint?", "Castello Brown over Portofino — iconic and achievable on most excursions."],
      ["Viewpoints with limited mobility?", "Santa Margherita promenade and Camogli harbour level suit easier access."],
    ],
    related: ["best-photography-locations", "portofino-harbour-guide", "italian-riviera-guide"],
    excursion: "photography-riviera",
  },
  {
    slug: "best-photography-locations",
    name: "Best Photography Locations",
    title: "Best Photography Locations on the Italian Riviera",
    seoTitle: "Riviera Photography Guide — Portofino, Camogli & Coastal Shots from Genoa",
    meta: "Best photography spots on the Italian Riviera from Genoa — harbour angles, golden hour, gear tips and cruise-day timing.",
    tagline: "Pastel harbours, yacht masts and Ligurian light — the Riviera through a lens.",
    overview: "The Riviera is one of Europe's most photogenic coastlines. Cruise passengers with camera priorities should choose excursions that build in harbour time and at least one elevated viewpoint.",
    body2: "Classic shots: Portofino harbour from the pier, Camogli house stacks from the beach, Santa Margherita promenade palms, coastal road curves with turquoise water below.",
    body3: "Midday sun is harsh on waterfront facades — shoot harbours before 11:00 or after 15:00 when possible. See our Photography Riviera excursion for guide-led composition stops.",
    distance: "Throughout Portofino peninsula villages",
    travel: "On foot within villages; coach for coastal road shots",
    timeNeeded: "Allow extra 30–60 minutes for photography pacing",
    highlights: ["Portofino Piazzetta classic angle", "Camogli harbour from the pier", "Santa Margherita lungomare symmetry", "Coastal road pull-offs east of Genoa"],
    tips: ["Bring a wide-angle lens for harbour scenes", "Respect private property when shooting village lanes", "Book Photography Riviera for timed golden-hour routing"],
    faqs: [
      ["Best harbour for photography?", "Portofino for icons; Camogli for colourful house stacks without the same crowds."],
      ["Drone photography allowed?", "Restricted in many village centres — check local rules; handheld cameras are safest."],
    ],
    related: ["best-viewpoints", "portofino-harbour-guide", "photography-riviera"],
    excursion: "photography-riviera",
  },
  {
    slug: "best-beaches",
    name: "Best Beaches",
    title: "Best Beaches on the Italian Riviera from Genoa",
    seoTitle: "Riviera Beaches from Genoa — Camogli, Paraggi & Swim Stops",
    meta: "Best beaches reachable from Genoa cruise port — Camogli pebble beach, Paraggi bay near Portofino and swim timing on port days.",
    tagline: "Pebbled coves and clear Ligurian water — when your port day includes beach time.",
    overview: "The Italian Riviera offers pebble beaches and small coves rather than wide sandy stretches. Camogli beach suits a quick swim on village excursions; Paraggi bay near Portofino is the closest swim spot to the famous harbour.",
    body2: "Beach time needs 60–90 minutes including changing and drying — factor this into your excursion choice. Not all Portofino-focused tours include swim stops.",
    body3: "Water shoes help on pebble beaches. Summer water temperature is pleasant June through September; May and October swims are for the brave.",
    distance: "Camogli beach 28 km; Paraggi 33 km from Genoa",
    travel: "Walk from village centres or short transfer to Paraggi",
    timeNeeded: "Allow 60–90 minutes for beach time",
    highlights: ["Camogli pebble beach", "Paraggi bay near Portofino", "Santa Margherita small bathing areas", "Clear Ligurian swimming water"],
    tips: ["Pack swimwear under day clothes if beach time is possible", "Pebbles are hot in midday sun — water shoes recommended", "Confirm beach stop when booking Portofino excursions"],
    faqs: [
      ["Can I swim on a Portofino port day?", "Yes at Paraggi if your tour allows time — otherwise choose Camogli or a family-focused excursion."],
      ["Sandy beaches near Genoa?", "Mostly pebble and stone — Boccadasse near Genoa is a small pebble cove if you stay local."],
    ],
    related: ["camogli-from-genoa", "family-riviera", "camogli-fishing-village"],
    excursion: "family-riviera",
  },
];

w(
  "highlights.ts",
  `import type { AttractionPage } from "./types";

export const highlights: AttractionPage[] = [
${attractions.map(attraction).join(",\n")}
];

export function getHighlightBySlug(slug: string): AttractionPage | undefined {
  return highlights.find((p) => p.slug === slug);
}

export function getAllHighlightSlugs(): string[] {
  return highlights.map((p) => p.slug);
}
`,
);

// ─── EXPERIENCES (GuidePage audience guides) ────────────────────────────────

const experiences = [
  {
    slug: "best-things-to-do-from-genoa",
    title: "Best Things to Do from Genoa Cruise Port",
    seoTitle: "Best Things to Do from Genoa — Italian Riviera for Cruise Passengers",
    meta: "The best things to do from Genoa cruise port — Portofino, Camogli, Santa Margherita, food tours and independent options ranked for cruise passengers.",
    tagline: "Portofino, Camogli or the coast — ranked for your Riviera port day.",
    overview: "Genoa is the Italian Riviera's cruise gateway. The best things to do all lie along the coast east of Porto Antico: glamorous Portofino, authentic Camogli, elegant Santa Margherita and Ligurian food experiences each suit different call lengths.",
    body1: "First-time visitors: Portofino on an organised excursion or Ultimate Italian Riviera Day for Portofino, Santa Margherita and Camogli. Families: Camogli beach and harbour walks. Food lovers: Taste Liguria or village trattoria lunches.",
    body2: "Independent travellers with 8+ hours can train to Santa Margherita from Genova Piazza Principe — allow 15–25 minutes taxi from the cruise terminal to the station plus 45 minutes on the train.",
    body3: "Skip trying to 'see all of Liguria' in one call. Rank your must-do, match it to your hours, and keep the 60–90 minute return buffer sacred.",
    highlights: ["Portofino — harbour village and viewpoints", "Camogli — fishing village and beach", "Santa Margherita — promenade and ferry links", "Ligurian pesto and seafood lunches"],
    tips: ["Match destination to call length", "Book excursions before peak summer sailings", "Check coastal road traffic on summer afternoons"],
    faqs: [
      ["What is the number-one thing from Genoa?", "Portofino for first-timers; Camogli if crowds or budget worry you."],
      ["Is Genoa city worth visiting?", "Old town and pesto if time allows — most passengers head east to the Riviera."],
    ],
    recommendations: [
      { cat: "editors-choice", title: "Ultimate Italian Riviera Day", desc: "Portofino, Santa Margherita and Camogli — max 8 guests.", href: SIGNATURE_EXPERIENCE_PATH },
      { cat: "best-historic", title: "Riviera Highlights", desc: "Portofino and Camogli sequenced with coastal timing.", href: "/shore-excursions/riviera-highlights" },
      { cat: "best-independent", title: "Independent Riviera Guide", desc: "DIY train and ferry options.", href: "/guides/independent-riviera-guide" },
    ],
    related: ["one-day-on-the-riviera", "portofino-from-genoa", "italian-riviera-guide"],
    imageKey: "city",
  },
  {
    slug: "one-day-on-the-riviera",
    title: "One Day on the Italian Riviera from Genoa",
    seoTitle: "One Day on the Italian Riviera from Genoa Cruise Port — Sample Itineraries",
    meta: "Plan one day on the Italian Riviera from Genoa — hour-by-hour Portofino, Camogli and combo itineraries with return-to-ship timing.",
    tagline: "Gangway to all-aboard — realistic Riviera schedules that actually work.",
    overview: "A Genoa port day gives you 7–9 usable hours ashore after embarkation formalities. One Riviera day means choosing a single coastal theme — Portofino glamour, Camogli village life or a food-focused Ligurian lunch.",
    body1: "Classic full day: 08:00 depart terminal, 09:30–13:00 Portofino harbour and Castello Brown, 13:30 lunch in Santa Margherita, 15:00 Camogli stroll, 16:30 return toward Genoa. Camogli-only days allow a slower pace with beach time.",
    body2: "Build every itinerary backward from all-aboard. Summer coastal road delays from Portofino routinely add 20–30 minutes — your excursion operator should depart the peninsula by 15:30 on 17:00–18:00 sailings.",
    body3: "Short calls under 7 hours: Camogli harbour only or Santa Margherita promenade — not Portofino plus Camogli independently. Use our cruise planner for a tailored hour-by-hour plan.",
    highlights: ["Portofino full day (8+ hours)", "Camogli village and beach (6+ hours)", "Portofino plus Camogli combo (9+ hours)", "Ligurian food half-day (8+ hours)"],
    tips: ["Work backward from all-aboard time", "One anchor per day unless on an organised combo", "Book excursions before you sail"],
    faqs: [
      ["Can I see Portofino and Camogli in one day?", "Yes on organised combo excursions with tight pacing — not independently on standard calls."],
      ["How many usable hours on a typical call?", "Subtract 60–90 minutes for embarkation and return buffer from your port window."],
    ],
    recommendations: [
      { cat: "editors-choice", title: "Ultimate Italian Riviera Day", desc: "Three villages sequenced with expert coastal timing.", href: SIGNATURE_EXPERIENCE_PATH },
      { cat: "best-short-port", title: "Riviera Highlights", desc: "Portofino and Camogli when hours are limited.", href: "/shore-excursions/riviera-highlights" },
      { cat: "best-value", title: "Best excursions ranked", desc: "First-timer comparison for your call length.", href: "/compare/best-riviera-excursion-first-time-visitors" },
    ],
    related: ["best-things-to-do-from-genoa", "italian-riviera-guide", "portofino-from-genoa"],
    imageKey: "highlights",
  },
  {
    slug: "independent-riviera-guide",
    title: "Independent Riviera Guide — Train & Ferry from Genoa",
    seoTitle: "Genoa to the Riviera by Train — Independent Cruise Passenger Guide",
    meta: "Reach Portofino and Santa Margherita by train from Genoa cruise port — timetables, ferry links and return-to-ship planning.",
    tagline: "Regional trains to Santa Margherita — when DIY beats the coach convoy.",
    overview: "Independent travel from Genoa suits confident cruisers who accept timing risk. Regional services reach Santa Margherita Ligure in about 45 minutes from Genova Piazza Principe — but you must taxi 15–25 minutes from the cruise terminal to the station first.",
    body1: "Morning pattern: taxi to Piazza Principe, train to Santa Margherita, ferry or bus to Portofino. Return train mid-afternoon, taxi to terminal 90 minutes before all-aboard.",
    body2: "Door-to-door coaches are often faster and less stressful than train plus taxi plus village connections. Trains win on cost for solo travellers and flexibility once on the coast.",
    body3: "No ship delay guarantee on independent travel — miss your planned connection and you absorb the risk. See our DIY vs guided comparison before deciding.",
    highlights: ["Genova Piazza Principe regional services", "45 minutes to Santa Margherita", "Seasonal ferries to Portofino and Camogli", "Taxi link from cruise terminal"],
    tips: ["Buy return tickets at the station", "Validate tickets before boarding", "Allow 90-minute return buffer including taxi"],
    faqs: [
      ["Is the train faster than a coach?", "Rarely door-to-door — coaches meet you at the terminal and drop in village centres."],
      ["Can I train to the Riviera and back on a port day?", "Yes on 8+ hour calls with strict time discipline and confirmed ferry timetables."],
    ],
    recommendations: [
      { cat: "best-independent", title: "Independent Explorer", desc: "Guided safety net with train option.", href: "/shore-excursions/independent-explorer" },
      { cat: "best-value", title: "DIY vs Guided", desc: "Honest cost and timing comparison.", href: "/compare/diy-vs-guided" },
      { cat: "best-independent", title: "Boat vs Road", desc: "When ferries beat coastal coaches.", href: "/compare/boat-vs-road" },
    ],
    related: ["ferries-vs-guided-tours", "diy-vs-guided", "santa-margherita-from-genoa"],
    imageKey: "port",
  },
  {
    slug: "ferries-vs-guided-tours",
    title: "Ferries vs Guided Tours on the Italian Riviera",
    seoTitle: "Riviera Ferries vs Shore Excursions from Genoa Cruise Port",
    meta: "Compare seasonal ferries and guided shore excursions from Genoa — timing, cost, Portofino access and return-to-ship confidence.",
    tagline: "Coastal road or harbour hop — how cruise passengers reach Portofino.",
    overview: "Reaching the Riviera from Genoa involves either coastal road transfers on coach excursions or seasonal passenger ferries from Porto Antico and Santa Margherita. Each suits different passengers and call lengths.",
    body1: "Guided tours bundle road transport, village orientation and explicit return timing — the default for first-timers. Ferries offer scenic approaches to Camogli and Portofino but depend on seasonal timetables that may not align with your port window.",
    body2: "Independent ferry days work when you confirm return sailings before leaving the ship and keep a 90-minute terminal buffer. Combined train-plus-ferry itineraries need more planning than a single coach booking.",
    body3: "See our boat vs road comparison for side-by-side timing. Most first-time visitors should book a guided Riviera excursion rather than assembling ferries on a maiden cruise.",
    highlights: ["Coastal coach transfers on excursions", "Seasonal ferries from Genoa and Santa Margherita", "Scenic harbour approaches by boat", "Return-to-ship timing on guided tours"],
    tips: ["Check ferry timetables the week before sailing", "Guided tours handle coastal road traffic margins", "Ferries can cancel in rough weather — have a backup plan"],
    faqs: [
      ["Can I ferry to Portofino from Genoa?", "Seasonal services exist — confirm timetables match your port hours before relying on them."],
      ["Ferry or coach for first-timers?", "Coach excursion — simpler timing and return confidence."],
    ],
    recommendations: [
      { cat: "editors-choice", title: "Riviera Highlights", desc: "Coastal road routing with guide and return timing.", href: "/shore-excursions/riviera-highlights" },
      { cat: "best-independent", title: "Independent Explorer", desc: "Train and ferry planning support.", href: "/shore-excursions/independent-explorer" },
      { cat: "best-value", title: "Boat vs Road", desc: "Detailed comparison.", href: "/compare/boat-vs-road" },
    ],
    related: ["independent-riviera-guide", "boat-vs-road", "diy-vs-guided"],
    imageKey: "port",
  },
  {
    slug: "riviera-food-guide",
    title: "Riviera Food Guide for Cruise Passengers",
    seoTitle: "Ligurian Food & Wine Guide — What to Eat from Genoa Cruise Port",
    meta: "Essential Ligurian food for cruise passengers — pesto, focaccia, seafood, wine and where to eat on a Genoa port day.",
    tagline: "Pesto, anchovies and Vermentino — taste the Riviera on a port day.",
    overview: "Ligurian food rewards passengers who anchor on gastronomy rather than rushing three villages. Pesto, focaccia di Recco, fresh seafood and crisp white wines define the coast east of Genoa.",
    body1: "Dedicated food excursions include trattoria lunch, pesto tasting and village market stops. Portofino harbour restaurants are atmospheric but expensive — village lunches inland or in Camogli offer better value.",
    body2: "Do not pair a full food tour with a three-village combo on standard calls — culinary depth OR Portofino glamour, not both unless hours exceed 10.",
    body3: "Flag dietary restrictions at booking — Ligurian cuisine is seafood-heavy but vegetarian pasta and focaccia options exist.",
    highlights: ["Trofie al pesto Genovese", "Focaccia di Recco with cheese", "Grilled catch-of-the-day", "Vermentino and Pigato wines"],
    tips: ["Eat lightly before multiple wine tastings", "Book lunch reservations on cruise days", "Taste Liguria excursion is the easiest food-focused port day"],
    faqs: [
      ["Food tour on an 8-hour call?", "Yes — designed as your primary activity with realistic timing."],
      ["Pesto demonstration included?", "Some Taste Liguria tours include a short pesto workshop — confirm when booking."],
    ],
    recommendations: [
      { cat: "best-food", title: "Taste Liguria", desc: "Pesto, seafood and Riviera wine.", href: "/shore-excursions/taste-liguria" },
      { cat: "best-food", title: "Ultimate Italian Riviera Day", desc: "Villages plus waterfront lunch stop.", href: SIGNATURE_EXPERIENCE_PATH },
      { cat: "best-value", title: "Ligurian cuisine guide", desc: "What to order at village trattorias.", href: "/highlights/ligurian-cuisine" },
    ],
    related: ["ligurian-cuisine", "taste-liguria", "hidden-riviera"],
    imageKey: "food",
  },
  {
    slug: "hidden-riviera",
    title: "Hidden Riviera from Genoa",
    seoTitle: "Hidden Italian Riviera Shore Excursions — Beyond Portofino",
    meta: "Discover hidden Riviera villages from Genoa cruise port — Camogli, San Fruttuoso paths and uncrowded alternatives to Portofino.",
    tagline: "Beyond the yacht harbour — quieter Ligurian corners within reach of your ship.",
    overview: "Most Genoa passengers head straight for Portofino. Hidden Riviera rewards those who want fishing villages, cliff paths and trattoria lunches without the Piazzetta crush — Camogli, lesser-known coves and San Fruttuoso viewpoints.",
    body1: "Camogli is the anchor for hidden Riviera days — harbour colour, beach time and San Rocco views suit passengers who find Portofino overwhelming. Dedicated hidden tours add coastal walks and village pranzo.",
    body2: "Hidden Riviera excursions need 8+ usable hours and book out early in summer. Do not attempt Portofino plus Cinque Terre on a standard call — pick one theme.",
    body3: "Repeat Riviera visitors and food lovers get the most from this slower pace. First-timers should still consider Portofino once before going hidden.",
    highlights: ["Camogli fishing harbour", "San Rocco hillside views", "Village trattoria lunches", "Coastal paths away from coach crowds"],
    tips: ["Choose Camogli over Portofino if crowds stress you", "Hidden tours need 8+ hour calls", "Book village lunches ahead on cruise days"],
    faqs: [
      ["Is hidden Riviera realistic on a port day?", "Yes — Camogli alone fits 7+ hours; full hidden tours need 8–9 usable hours ashore."],
      ["Hidden Riviera or Portofino?", "Portofino for first-timers; hidden Riviera for repeat visitors and relaxed travellers."],
    ],
    recommendations: [
      { cat: "hidden-gem", title: "Hidden Riviera Day", desc: "Villages, coves and paced coastal routes.", href: "/shore-excursions/hidden-riviera-day" },
      { cat: "best-historic", title: "Camogli Fishing Village", desc: "Authentic harbour without Portofino prices.", href: "/highlights/camogli-fishing-village" },
      { cat: "best-food", title: "Taste Liguria", desc: "Pesto, seafood and village lunch.", href: "/shore-excursions/taste-liguria" },
    ],
    related: ["camogli-from-genoa", "camogli-fishing-village", "hidden-riviera-day"],
    imageKey: "history",
  },
  {
    slug: "luxury-riviera",
    title: "Luxury Riviera Experiences from Genoa",
    seoTitle: "Luxury Italian Riviera Shore Excursions — Private Portofino from Genoa",
    meta: "Luxury Riviera from Genoa cruise port — private Portofino tours, yacht harbour access and bespoke coastal experiences with VIP pacing.",
    tagline: "Ultimate Riviera — private transfers, harbour tables and zero coach convoys.",
    overview: "Luxury Riviera from Genoa means private Mercedes or minivan from the terminal, reserved harbour lunch tables, flexible Portofino pacing and optional boat charter — timed to your ship, not a 50-seat coach schedule.",
    body1: "Private tours sequence Portofino viewpoints, Santa Margherita promenade and Camogli according to your priorities — lunch reservations arranged weeks ahead, guide waiting at the terminal exit.",
    body2: "Premium experiences suit passengers who have seen Portofino on a group tour before or want an indulgent second visit with boat transfer and waterfront dining.",
    body3: "Luxury pricing reflects exclusivity and flexibility — strongest return-to-ship confidence when coastal road traffic is unpredictable.",
    highlights: ["Private vehicle from Genoa terminal", "Reserved Portofino or Santa Margherita lunch", "Flexible viewpoint and photo stops", "Optional private boat charter"],
    tips: ["Book two weeks ahead in August", "Share mobility and dietary needs at booking", "Confirm restaurant availability early"],
    faqs: [
      ["Worth the cost over group tours?", "Yes for mixed interests, VIP lunch access or specific photo timing."],
      ["Private tour plus boat charter?", "Only on 10+ hour calls — your guide will advise honestly."],
    ],
    recommendations: [
      { cat: "best-luxury", title: "Ultimate Italian Riviera Day", desc: "Signature small-group — max 8 guests.", href: SIGNATURE_EXPERIENCE_PATH },
      { cat: "best-luxury", title: "Portofino & Santa Margherita", desc: "Premium coastal pacing.", href: "/shore-excursions/portofino-santa-margherita" },
      { cat: "best-food", title: "Taste Liguria", desc: "Curated Ligurian gastronomy.", href: "/shore-excursions/taste-liguria" },
    ],
    related: ["ultimate-italian-riviera-day", "portofino-from-genoa", "romantic-riviera"],
    imageKey: "luxury",
  },
  {
    slug: "family-riviera",
    title: "Family Riviera from Genoa",
    seoTitle: "Family-Friendly Italian Riviera Shore Excursions from Genoa",
    meta: "Family Riviera from Genoa — Camogli beach, harbour walks and paced routing for children with reliable return timing.",
    tagline: "Beach time, gelato and harbour exploration — the Riviera paced for families.",
    overview: "Family Riviera days skip Portofino's steep lanes and premium prices in favour of Camogli beach, flat promenade walks and explicit gelato stops — shorter transfers and less queue stress.",
    body1: "Morning at Camogli: harbour photos, beach time, focaccia snack. Afternoon in Santa Margherita: promenade stroll and ferry watching. Portofino only on longer calls with older children.",
    body2: "Guides use story-based commentary — fishermen at Camogli, Belle Époque hotels at Santa Margherita — rather than dense art history. Toilet and snack stops built into routing.",
    body3: "Share children's ages at booking. Private upgrade recommended for strollers or mixed teen/toddler groups.",
    highlights: ["Camogli beach — pebble shore and shallow water", "Flat Santa Margherita promenade", "Gelato and focaccia stops", "Explicit return timing to Genoa"],
    tips: ["Skip Portofino steep lanes with toddlers", "Pack water shoes for pebble beaches", "Family Riviera excursion handles pacing for you"],
    faqs: [
      ["Portofino with kids?", "Possible with school-age children — Camogli and Santa Margherita suit younger families better."],
      ["Stroller-friendly?", "Santa Margherita promenade and Camogli harbour yes; Portofino lanes are steep."],
    ],
    recommendations: [
      { cat: "best-families", title: "Family Riviera Excursion", desc: "Beach, harbour and gelato pacing.", href: "/shore-excursions/family-riviera" },
      { cat: "best-families", title: "Riviera Highlights", desc: "Camogli and Portofino with family-aware guide.", href: "/shore-excursions/riviera-highlights" },
      { cat: "best-value", title: "Family excursion comparison", desc: "Ranked for mixed-age groups.", href: "/compare/best-riviera-excursion-families" },
    ],
    related: ["best-beaches", "camogli-from-genoa", "family-riviera"],
    imageKey: "family",
  },
  {
    slug: "romantic-riviera",
    title: "Romantic Riviera from Genoa",
    seoTitle: "Romantic Italian Riviera Shore Excursions — Couples Guide from Genoa",
    meta: "Romantic Riviera from Genoa — Portofino harbour, sunset viewpoints and intimate coastal experiences for couples.",
    tagline: "Harbour tables, coastal viewpoints and Ligurian sunsets — the Riviera for two.",
    overview: "Couples want unhurried harbour time, waterfront lunch tables and golden-hour photos — Portofino at its most magical when pacing allows a slow promenade and Castello Brown views together.",
    body1: "Ultimate Italian Riviera Day suits couples on standard calls — small group intimacy without private-tour pricing. Private upgrades add reserved harbour lunch and flexible photo stops.",
    body2: "Santa Margherita promenade at dusk suits late sailings; early all-aboard times favour morning Portofino light over sunset chasing.",
    body3: "Book waterfront tables weeks ahead for Portofino — walk-ins fail on cruise days.",
    highlights: ["Portofino harbour at golden hour", "Castello Brown shared panorama", "Santa Margherita promenade stroll", "Waterfront Ligurian lunch for two"],
    tips: ["Book lunch reservations when booking your excursion", "Photography Riviera suits couples with camera priorities", "Private transfer avoids coach crowds"],
    faqs: [
      ["Most romantic excursion?", "Ultimate Italian Riviera Day with harbour lunch — or private Portofino for exclusivity."],
      ["Sunset in Portofino on a port day?", "Only on late sailings — confirm all-aboard before planning golden hour."],
    ],
    recommendations: [
      { cat: "best-luxury", title: "Ultimate Italian Riviera Day", desc: "Small-group romance — max 8 guests.", href: SIGNATURE_EXPERIENCE_PATH },
      { cat: "best-luxury", title: "Portofino & Santa Margherita", desc: "Harbour and promenade for two.", href: "/shore-excursions/portofino-santa-margherita" },
      { cat: "best-value", title: "Couples excursion comparison", desc: "Ranked for pairs.", href: "/compare/best-riviera-excursion-couples" },
    ],
    related: ["portofino-harbour-guide", "santa-margherita-promenade", "luxury-riviera"],
    imageKey: "luxury",
  },
  {
    slug: "italian-riviera-walking-guide",
    title: "Italian Riviera Walking Guide from Genoa",
    seoTitle: "Riviera Walking Guide — Distances & Routes for Cruise Passengers",
    meta: "Walk the Italian Riviera from Genoa cruise port — Portofino village routes, Camogli harbour circuit and return timing.",
    tagline: "Harbour lanes to hilltop churches — the essential Riviera walks for cruise passengers.",
    overview: "Riviera villages are compact and walkable once your excursion drops you off. Portofino's steep lanes, Camogli's harbour circuit and Santa Margherita's flat promenade each suit different mobility levels.",
    body1: "Portofino walk: village entrance → Piazzetta → marina → San Giorgio lane → optional Castello Brown (steep). Allow 2–3 hours including photos and gelato.",
    body2: "Camogli walk: harbour → Via Garibaldi → beach → San Rocco optional climb. Allow 2 hours on gentler terrain with beach time.",
    body3: "Wear grippy shoes — cobbles and village steps are slippery when wet. Build 90 minutes return transfer buffer into every walking plan.",
    highlights: ["Portofino harbour circuit", "Camogli Via Garibaldi lanes", "Santa Margherita lungomare", "Castello Brown and San Rocco viewpoints"],
    tips: ["Start walking when your coach arrives — beat midday heat", "Carry water in summer — shade is limited on harbours", "Photography Riviera builds extra stops into the route"],
    faqs: [
      ["How much walking in Portofino?", "Expect 2–4 km with steep sections if you climb to viewpoints."],
      ["Easiest Riviera walk?", "Santa Margherita promenade — flat and accessible."],
    ],
    recommendations: [
      { cat: "best-historic", title: "Ultimate Italian Riviera Day", desc: "Guided walking routes across three villages.", href: SIGNATURE_EXPERIENCE_PATH },
      { cat: "best-photography", title: "Photography Riviera", desc: "Composition stops built into the walk.", href: "/shore-excursions/photography-riviera" },
      { cat: "best-independent", title: "Independent Explorer", desc: "Self-paced walking with timetable support.", href: "/shore-excursions/independent-explorer" },
    ],
    related: ["portofino-harbour-guide", "camogli-fishing-village", "best-viewpoints"],
    imageKey: "city",
  },
];

w(
  "experiences.ts",
  `import type { GuidePage } from "./types";

export const experiencePages: GuidePage[] = [
${experiences.map(guide).join(",\n")}
];

export function getExperienceBySlug(slug: string): GuidePage | undefined {
  return experiencePages.find((p) => p.slug === slug);
}

/** @deprecated Use getExperienceBySlug */
export const getExperiencePageBySlug = getExperienceBySlug;

export function getAllExperienceSlugs(): string[] {
  return experiencePages.map((p) => p.slug);
}
`,
);

// ─── EXCURSIONS ──────────────────────────────────────────────────────────────

const excursions = [
  {
    slug: "ultimate-italian-riviera-day",
    title: "Ultimate Italian Riviera Day",
    seoTitle: "Ultimate Italian Riviera Day — Signature Shore Excursion from Genoa",
    meta: "Portofino, Santa Margherita and Camogli in one small-group day from Genoa cruise port — maximum 8 guests, cruise-timed coastal routing.",
    category: "Signature Experience",
    tagline: "Portofino, Santa Margherita and Camogli — the Riviera's essential trio with expert coastal timing.",
    duration: "9–10 hours",
    pace: "Moderate",
    bestFor: "First-time visitors wanting the definitive Riviera day in a small group",
    overview: "Ultimate Italian Riviera Day is our Signature Experience — maximum eight guests sequencing Portofino harbour, Santa Margherita promenade and Camogli village with coastal road timing built around your all-aboard.",
    body1: "Morning departures from Genoa reach Portofino before midday coach crowds — harbour walk, Castello Brown viewpoint and San Giorgio lane, then Santa Margherita promenade and Camogli harbour.",
    body2: "Your guide sequences lunch and coastal legs so summer road traffic does not consume your return buffer. Typical return to terminal 16:30–17:00 for 18:00 all-aboard.",
    body3: "Requires 9+ usable hours — on shorter calls choose Riviera Highlights or Camogli-focused tours instead.",
    highlights: ["Portofino harbour and Castello Brown", "Santa Margherita lungomare", "Camogli fishing village", "Door-to-door Genoa transfer"],
    included: ["Licensed guide", "Small-group vehicle (max 8 guests)", "Coastal transfers", "Return timed to ship"],
    tips: ["Book before sailing in July and August", "Wear comfortable shoes for village lanes", "Eat a substantial breakfast — lunch is scenic but unhurried"],
    faqs: [
      ["Too much for a 9-hour call?", "Standard on our Signature Experience — not recommended under 8.5 usable hours."],
      ["How is this different from Riviera Highlights?", "Smaller group, more flexible pacing — our editorial Signature Experience recommendation."],
    ],
    related: ["riviera-highlights", "portofino-santa-margherita", "photography-riviera"],
    featured: true,
  },
  {
    slug: "riviera-highlights",
    title: "Riviera Highlights Shore Excursion",
    seoTitle: "Riviera Highlights Shore Excursion from Genoa Cruise Port",
    meta: "Portofino harbour and Camogli village on one cruise-timed highlights tour from Genoa with return-to-ship confidence.",
    category: "Highlights",
    tagline: "Portofino and Camogli in one port day — the Riviera's essential duo with coastal road expertise.",
    duration: "8–9 hours",
    pace: "Moderate",
    bestFor: "First-time visitors with a standard 8–9 hour port call",
    overview: "Riviera Highlights covers Portofino's iconic harbour and Camogli's colourful fishing village on one sequenced route — the Editor's Choice group excursion for passengers who want both anchors without a private vehicle.",
    body1: "Morning at Portofino: harbour promenade, marina photos and optional Castello Brown. Afternoon in Camogli: harbour stroll, beach time and focaccia stop before coastal return to Genoa.",
    body2: "Coastal road timing accounts for summer traffic east of Genoa. Typical return to terminal 16:00–17:00 for 18:00 all-aboard.",
    body3: "Requires 8+ usable hours — on shorter calls choose Camogli-only or Santa Margherita promenade tours.",
    highlights: ["Portofino Piazzetta and harbour", "Castello Brown viewpoint", "Camogli pastel harbour", "Coastal drive along the Riviera"],
    included: ["Licensed guide", "Coach or minivan transport", "Return timed to ship"],
    tips: ["Book before sailing in peak season", "Wear sun protection on harbour walks", "Keep 90 minutes for return transfer"],
    faqs: [
      ["Portofino and Camogli enough for one day?", "Yes — both villages are compact. Ultimate Italian Riviera Day adds Santa Margherita."],
      ["Includes lunch?", "Quick stops standard — sit-down lunch may be optional add-on."],
    ],
    related: ["ultimate-italian-riviera-day", "portofino-santa-margherita", "hidden-riviera-day"],
    featured: true,
  },
  {
    slug: "portofino-santa-margherita",
    title: "Portofino & Santa Margherita Shore Excursion",
    seoTitle: "Portofino & Santa Margherita Shore Excursion from Genoa",
    meta: "Combine Portofino harbour and Santa Margherita promenade from Genoa — glamorous villages sequenced for your ship.",
    category: "Portofino & coast",
    tagline: "Glamorous morning, promenade afternoon — Portofino and Santa Margherita for your port day.",
    duration: "8–9 hours",
    pace: "Moderate",
    bestFor: "Couples and first-timers wanting Portofino without Camogli",
    overview: "Portofino & Santa Margherita balances a focused Portofino morning — harbour, viewpoints and gelato — with an afternoon on Santa Margherita's palm-lined lungomare and harbour.",
    body1: "Morning in Portofino allows 3 hours: Piazzetta, marina walk and optional Castello Brown. Lunch in Santa Margherita or quick waterfront bite.",
    body2: "Afternoon promenade stroll and ferry pier views before coastal return with explicit road-traffic buffer.",
    body3: "Not suitable for calls under 8 usable hours — choose Camogli or hidden Riviera instead.",
    highlights: ["Portofino harbour and marina", "Castello Brown panorama", "Santa Margherita lungomare", "Waterfront lunch stop"],
    included: ["Licensed guide", "Coach or minivan transport", "Return timed to ship"],
    tips: ["Book waterfront lunch ahead in peak season", "Morning Portofino beats midday coach queues", "Wear comfortable shoes for village steps"],
    faqs: [
      ["Difference from Ultimate Italian Riviera Day?", "This tour skips Camogli — slightly more time in Portofino and Santa Margherita."],
      ["Includes Castello Brown?", "Viewpoint stop standard on most departures — confirm when booking."],
    ],
    related: ["ultimate-italian-riviera-day", "riviera-highlights", "romantic-riviera"],
    featured: true,
  },
  {
    slug: "taste-liguria",
    title: "Taste Liguria Shore Excursion",
    seoTitle: "Taste Liguria Food & Wine Shore Excursion from Genoa",
    meta: "Taste Liguria from Genoa — pesto, seafood, village lunch and Riviera wine on a cruise-timed gastronomy tour.",
    category: "Food & wine",
    tagline: "Pesto, anchovies and Vermentino — Ligurian gastronomy as your port-day anchor.",
    duration: "7–8 hours",
    pace: "Relaxed",
    bestFor: "Food lovers who prefer tasting over harbour hopping",
    overview: "Taste Liguria replaces village rushing with pesto demonstrations, seafood tastings and a multi-course village pranzo on the Riviera — ideal for passengers who have seen Portofino before or prioritise Ligurian cuisine.",
    body1: "Morning departure, scenic coastal drive, pesto or focaccia tasting mid-morning, seated pranzo 12:30–14:00 in Camogli or Santa Margherita hinterland, optional village stroll, return mid-afternoon.",
    body2: "Designated drivers and restaurant reservations handled by the operator. Allow 60–90 minutes seated for lunch — Ligurian pranzo is unhurried.",
    body3: "Does not combine with a three-village combo on standard calls — this is your primary activity.",
    highlights: ["Pesto or focaccia tasting", "Multi-course Ligurian seafood lunch", "Vermentino wine pairing", "Village market or bakery stop"],
    included: ["Food tastings and lunch", "Licensed guide", "Return to Genoa terminal"],
    tips: ["Flag dietary needs at booking", "Eat a light breakfast", "Seafood-heavy menu — notify for vegetarian needs"],
    faqs: [
      ["Realistic on an 8-hour call?", "Yes — designed as a standalone gastronomy day."],
      ["Vegetarian options?", "Pasta al pesto, focaccia and vegetable antipasti — notify when booking."],
    ],
    related: ["riviera-food-guide", "ligurian-cuisine", "hidden-riviera-day"],
  },
  {
    slug: "photography-riviera",
    title: "Photography Riviera Shore Excursion",
    seoTitle: "Photography Riviera Shore Excursion from Genoa Cruise Port",
    meta: "Photography-focused Riviera tour from Genoa — Portofino harbour angles, Camogli facades and coastal viewpoints with guide-led composition stops.",
    category: "Photography",
    tagline: "Harbour light, pastel facades and coastal curves — the Riviera through a photographer's lens.",
    duration: "8–9 hours",
    pace: "Moderate",
    bestFor: "Photography enthusiasts who need time for composition",
    overview: "Photography Riviera builds extra stops into the coastal route — Portofino pier angles, Camogli house stacks, Santa Margherita promenade symmetry and road pull-offs — for passengers who prioritise images over shopping.",
    body1: "Morning light at Portofino harbour before coach crowds peak. Midday Camogli facades from pier and beach. Afternoon coastal road viewpoints if time and traffic allow.",
    body2: "Guide allows brief composition pauses not feasible on standard highlights pacing. Tripods may be restricted in crowded village centres — handheld setups work best.",
    body3: "Requires 8+ usable hours. First-timers without camera priorities should choose Riviera Highlights instead.",
    highlights: ["Portofino classic harbour angle", "Camogli stacked house photography", "Santa Margherita promenade shots", "Coastal road turquoise-water viewpoints"],
    included: ["Photography-aware guide", "Coastal transport", "Return timed to ship"],
    tips: ["Bring polarising filter for sea glare", "Wear grippy shoes for viewpoint paths", "Morning departures capture best harbour light"],
    faqs: [
      ["DSLR or smartphone?", "Both — guide helps with composition either way."],
      ["Drone allowed?", "Restricted in many villages — confirm locally; handheld cameras safest."],
    ],
    related: ["best-photography-locations", "ultimate-italian-riviera-day", "riviera-highlights"],
  },
  {
    slug: "independent-explorer",
    title: "Independent Explorer Shore Excursion",
    seoTitle: "Independent Riviera Explorer from Genoa — Train & Ferry Options",
    meta: "Independent Riviera from Genoa — train timetables, ferry links, village maps and guide support for confident DIY cruise passengers.",
    category: "Independent",
    tagline: "Train to Santa Margherita or self-paced Camogli — independence with a safety net.",
    duration: "7–9 hours self-paced",
    pace: "Moderate",
    bestFor: "Confident independent travellers who want flexibility and lower cost",
    overview: "The Independent Explorer product supports DIY Riviera days — train schedules to Santa Margherita, ferry timetables to Portofino and optional meet-and-guide hours — for passengers who accept timing responsibility without a full coach tour.",
    body1: "Typical pattern: taxi to Piazza Principe, regional train to Santa Margherita, ferry or bus to Portofino, return train mid-afternoon, taxi to terminal 90 minutes before all-aboard.",
    body2: "Alternative: train to Camogli for harbour walk — closer, cheaper and easier to recover if connections slip. Camogli suits shorter calls and first-time independents.",
    body3: "No ship delay guarantee — you manage timing alone. Ideal for experienced Mediterranean cruisers.",
    highlights: ["Train and taxi logistics explained", "Ferry timetables to Portofino", "Village route maps", "Return buffer checklist"],
    included: ["Route planning and timetables", "Optional meet-and-walk guide", "Taxi booking assistance where stated"],
    tips: ["Confirm ferry sailings before leaving the ship", "Validate train tickets before boarding", "Carry euros for taxis and food"],
    faqs: [
      ["Is DIY safe from Genoa?", "Yes for confident travellers — see DIY vs guided comparison for risk assessment."],
      ["Train or coach?", "Coach for first-timers; train for solo budget travellers with confirmed connections."],
    ],
    related: ["independent-riviera-guide", "riviera-highlights", "diy-vs-guided"],
  },
  {
    slug: "family-riviera",
    title: "Family Riviera Shore Excursion",
    seoTitle: "Family Italian Riviera Shore Excursion from Genoa Cruise Port",
    meta: "Family-friendly Riviera from Genoa — Camogli beach, harbour walks and paced routing for children with reliable return timing.",
    category: "Family",
    tagline: "Beach time, harbour colour and gelato — the Riviera paced for mixed-age families.",
    duration: "7–8 hours",
    pace: "Relaxed",
    bestFor: "Families with children aged 4–14",
    overview: "Family Riviera skips Portofino's steep premium lanes in favour of Camogli beach, flat Santa Margherita promenade and explicit gelato stops — shorter transfers and child-aware guides.",
    body1: "Morning at Camogli: harbour photos, beach play, focaccia snack. Afternoon in Santa Margherita: promenade stroll and ferry watching. Portofino photo stop only on longer calls.",
    body2: "Guides use story-based commentary — fishermen, yachts and Belle Époque hotels — rather than dense history. Toilet and snack stops built into routing.",
    body3: "Share children's ages at booking. Private upgrade recommended for strollers or mixed teen/toddler groups.",
    highlights: ["Camogli beach time", "Flat Santa Margherita promenade", "Gelato and focaccia stops", "Explicit return timing to Genoa"],
    included: ["Family-specialist guide", "Coach or minivan transport"],
    tips: ["Pack water shoes for pebble beach", "Sun hats essential in summer", "Skip Portofino lanes with toddlers"],
    faqs: [
      ["Portofino with kids?", "Photo stop yes; extended visit suits school-age children only."],
      ["Stroller-friendly?", "Santa Margherita and Camogli harbour yes; Portofino lanes are steep."],
    ],
    related: ["riviera-highlights", "best-beaches", "family-riviera"],
  },
  {
    slug: "hidden-riviera-day",
    title: "Hidden Riviera Day Excursion",
    seoTitle: "Hidden Italian Riviera Shore Excursion — Camogli & Coastal Villages from Genoa",
    meta: "Hidden Riviera from Genoa — Camogli, San Rocco views and uncrowded coastal lanes away from Portofino coach convoys.",
    category: "Hidden Riviera",
    tagline: "Fishing villages, cliff views and trattoria lunch — the Riviera without the Piazzetta crush.",
    duration: "8–9 hours",
    pace: "Relaxed",
    bestFor: "Repeat visitors and relaxed travellers avoiding Portofino crowds",
    overview: "Hidden Riviera Day focuses on Camogli, coastal pull-offs and village trattoria lunch — for passengers who have done Portofino before or prefer authentic fishing-port atmosphere.",
    body1: "Routing varies by operator: extended Camogli time, San Rocco climb, coastal walk segments and reserved village pranzo. Less marquee glamour, more Ligurian authenticity.",
    body2: "Village lunches need reservations on cruise days — your guide handles tables and timing. Less steep walking than Portofino-focused days.",
    body3: "Requires 8+ usable hours. First-timers should consider Ultimate Italian Riviera Day instead.",
    highlights: ["Extended Camogli harbour time", "San Rocco panoramic views", "Village trattoria lunch", "Coastal lanes away from coach crowds"],
    included: ["Licensed guide", "Coach or minivan transport", "Lunch where stated", "Return timed to ship"],
    tips: ["Ideal for second-time Riviera callers", "Bring a camera for harbour colour stacks", "Wear comfortable walking shoes"],
    faqs: [
      ["Hidden Riviera or Riviera Highlights?", "Highlights adds Portofino; Hidden Riviera goes deeper into Camogli and village life."],
      ["First visit to the Riviera?", "Choose Portofino once — hidden Riviera rewards repeat visitors."],
    ],
    related: ["camogli-from-genoa", "taste-liguria", "hidden-riviera"],
  },
];

w(
  "excursions.ts",
  `import type { ExcursionPage } from "./types";

const PORT_LOGISTICS =
  "${esc(PORT_LOGISTICS)}";

export const excursions: ExcursionPage[] = [
${excursions.map(excursion).join(",\n")}
];

export function getExcursionBySlug(slug: string): ExcursionPage | undefined {
  return excursions.find((p) => p.slug === slug);
}

export function getAllExcursionSlugs(): string[] {
  return excursions.map((p) => p.slug);
}

export function getFeaturedExcursions(): ExcursionPage[] {
  return excursions.filter((p) => p.featured);
}
`,
);

// ─── COMPARISONS ─────────────────────────────────────────────────────────────

const comparisons = [
  versus({
    slug: "portofino-vs-camogli",
    optionA: "Portofino",
    optionB: "Camogli",
    summary: "Portofino delivers the world's most famous harbour — yachts, pastel facades and celebrity cachet 35 km from Genoa. Camogli offers colourful fishing-village atmosphere 28 km east, often with fewer crowds and better value.",
    verdict: "Choose Portofino for the iconic Riviera photo and first-time glamour. Choose Camogli when crowds, prices or steep lanes worry you, or when your call is shorter. Many passengers see both on organised combo tours on 9+ hour calls.",
    overview: [
      "Portofino: 35 km, 60–75 min transfer, 3–4 hours needed in village, steep lanes.",
      "Camogli: 28 km, 45–55 min transfer, 2–3 hours at harbour and beach, gentler terrain.",
      "Combining both needs 8+ usable hours — Riviera Highlights or Ultimate Italian Riviera Day handle coastal timing.",
    ],
    table: [
      { category: "Distance from Genoa", optionA: "35 km / 60–75 min", optionB: "28 km / 45–55 min" },
      { category: "Time on site", optionA: "3–4 hours minimum", optionB: "2–3 hours" },
      { category: "Best for", optionA: "Icons, glamour, first-timers", optionB: "Authentic village, families, value" },
      { category: "Physical effort", optionA: "Moderate — steep village lanes", optionB: "Easy to moderate — harbour flat" },
      { category: "Return confidence", optionA: "Good with 90-min buffer — coastal traffic risk", optionB: "Very high — closer and quicker" },
    ],
    faqs: [
      ["Can I do both on one port day?", "Yes on 8+ hour calls via organised combo — not recommended independently."],
      ["Which is more crowded?", "Portofino — especially 11:00–15:00 on summer cruise days."],
    ],
    related: ["portofino-from-genoa", "camogli-from-genoa", "riviera-highlights"],
    imageKey: "city",
  }),
  versus({
    slug: "portofino-vs-santa-margherita",
    optionA: "Portofino",
    optionB: "Santa Margherita Ligure",
    summary: "Portofino is the tiny glamour harbour — yachts, designer boutiques and steep lanes. Santa Margherita is the elegant resort town next door: flat promenade, train station and ferry link to Portofino.",
    verdict: "Choose Portofino for the definitive harbour experience. Choose Santa Margherita for relaxed promenade walks, easier mobility and as a base for ferry connections. Portofino & Santa Margherita excursions combine both on standard calls.",
    overview: [
      "Portofino: tiny village, 3–4 hours, steep lanes, premium prices.",
      "Santa Margherita: larger town, 2–3 hours, flat lungomare, train hub.",
      "Ferry connects them in 15 minutes seasonally — many tours visit both.",
    ],
    table: [
      { category: "Transfer from Genoa", optionA: "60–75 min coach", optionB: "50–60 min coach / 45 min train" },
      { category: "Crowds", optionA: "Heavy at Piazzetta midday", optionB: "Moderate — calmer promenade" },
      { category: "Best for", optionA: "Iconic harbour photos", optionB: "Relaxed pacing, train access, couples" },
      { category: "Walking", optionA: "Steep village lanes", optionB: "Flat promenade — stroller-friendly" },
    ],
    faqs: [
      ["Santa Margherita instead of Portofino?", "Yes if mobility or crowds concern you — ferry over for a quick harbour visit."],
      ["Can I train to Santa Margherita independently?", "Yes — 45 minutes from Genova Piazza Principe."],
    ],
    related: ["santa-margherita-from-genoa", "portofino-from-genoa", "portofino-santa-margherita"],
    imageKey: "history",
  }),
  versus({
    slug: "diy-vs-guided",
    optionA: "DIY Riviera",
    optionB: "Guided Shore Excursion",
    summary: "DIY train and ferry travel to the Riviera costs less but adds station taxi time and connection risk. Guided excursions bundle coastal road navigation, village orientation and 60–90 minute return buffers.",
    verdict: "Choose DIY for Camogli by train or a confident Santa Margherita day with confirmed ferry timetables. Choose guided for first-timers, Portofino combos, food tours and anyone anxious about coastal road delays.",
    overview: [
      "DIY: taxi to Piazza Principe, regional train, ferry or bus — €30–50 plus food. You manage all timing.",
      "Guided: coach from terminal, village guide, explicit return — €80–150+ per person.",
      "DIY saves money for experienced cruisers; guided saves costly connection mistakes in summer.",
    ],
    table: [
      { category: "Cost per person", optionA: "€35–55 plus food", optionB: "€80–150+ all-in" },
      { category: "Return confidence", optionA: "Moderate — you manage trains and ferries", optionB: "High — operator tracks ship" },
      { category: "Portofino access", optionA: "Your responsibility to confirm ferries", optionB: "Usually included via road or boat" },
      { category: "Best for", optionA: "Experienced cruisers, Camogli day trips", optionB: "Portofino first-timers, combos, food tours" },
    ],
    faqs: [
      ["Will the ship wait for independent travel?", "No — only ship-sponsored excursions carry delay guarantee."],
      ["Best DIY destination?", "Camogli by train — closer and easier to recover if connections slip."],
    ],
    related: ["independent-riviera-guide", "independent-explorer", "best-things-to-do-from-genoa"],
    imageKey: "port",
  }),
  versus({
    slug: "boat-vs-road",
    optionA: "Boat/Ferry",
    optionB: "Coastal Road",
    summary: "Seasonal ferries from Genoa and Santa Margherita offer scenic harbour approaches to Camogli and Portofino. Coastal road coaches are reliable year-round and meet you at the cruise terminal.",
    verdict: "Choose ferries for scenic independent travel when timetables align with your port window and weather is calm. Choose road transfers for first-timers, combo excursions and guaranteed return timing regardless of sea conditions.",
    overview: [
      "Ferry: scenic, weather-dependent, seasonal timetables — €15–25 per leg.",
      "Road: year-round, terminal pickup, 45–75 min to villages — included in tour price.",
      "Many guided tours use road only; some add optional boat segments on calm days.",
    ],
    table: [
      { category: "Reliability", optionA: "Weather and season dependent", optionB: "Year-round" },
      { category: "Scenery", optionA: "Excellent from the water", optionB: "Good coastal road views" },
      { category: "Terminal pickup", optionA: "Walk to Porto Antico ferry", optionB: "Coach at cruise terminal exit" },
      { category: "Best for", optionA: "Independent travellers, calm summer days", optionB: "First-timers, combos, poor weather" },
    ],
    faqs: [
      ["Ferry faster than coach?", "Sometimes to Portofino from Santa Margherita — but add train/taxi legs for door-to-door."],
      ["Rough seas?", "Ferries cancel — road transfer is the safe fallback."],
    ],
    related: ["ferries-vs-guided-tours", "independent-riviera-guide", "portofino-from-genoa"],
    imageKey: "port",
  }),
  versus({
    slug: "independent-vs-small-group",
    optionA: "Fully Independent",
    optionB: "Small-Group Tour (max 8)",
    summary: "Fully independent travel offers maximum flexibility at lowest cost but you carry all timing risk. Small-group tours (maximum eight guests) blend personal attention with expert coastal road timing — our Signature Experience model.",
    verdict: "Choose fully independent for Camogli by train on a tight budget with confirmed return connections. Choose small-group for Portofino first visits, photography pacing and return confidence without a 50-seat coach.",
    overview: [
      "Independent: train, ferry, self-guided walks — €35–55. No guide buffer.",
      "Small-group: max 8 guests, licensed guide, flexible pacing — premium over large coaches.",
      "Ultimate Italian Riviera Day is our Signature small-group recommendation.",
    ],
    table: [
      { category: "Group size", optionA: "Solo or your party only", optionB: "Maximum 8 guests" },
      { category: "Guide access", optionA: "Self-guided or optional app", optionB: "Personal guide throughout" },
      { category: "Return planning", optionA: "You manage buffer", optionB: "Guide tracks ship and traffic" },
      { category: "Best for", optionA: "Budget, experience, Camogli DIY", optionB: "Portofino first-timers, couples, photography" },
    ],
    faqs: [
      ["Small-group vs large coach?", "Small-group allows flexible photo stops and faster boarding — see Ultimate Italian Riviera Day."],
      ["Independent Explorer product?", "Hybrid — planning support without full coach tour."],
    ],
    related: ["ultimate-italian-riviera-day", "independent-explorer", "luxury-riviera"],
    imageKey: "highlights",
  }),
  comparisonGuide({
    slug: "best-riviera-excursion-first-time-visitors",
    title: "Best Riviera Excursions for First-Time Visitors",
    seoTitle: "Best Italian Riviera Shore Excursions for First-Timers — Genoa Port",
    meta: "Ranked Italian Riviera shore excursions for first-time cruise passengers at Genoa — Portofino, combos and Camogli options.",
    summary: "First-timers need one clear anchor, reliable coastal timing and an operator who understands summer road traffic — these excursions deliver consistently from Genoa.",
    verdict: "Book before sailing in peak season. Morning departures protect afternoon return margins when coastal traffic builds.",
    overview: [
      "Ultimate Italian Riviera Day balances Portofino, Santa Margherita and Camogli for standard 9–10 hour calls.",
      "Riviera Highlights suits passengers who want Portofino and Camogli without the third stop.",
      "Camogli-focused tours are best when your call is shorter or Portofino feels too crowded.",
      "Independent Explorer suits confident travellers with train experience.",
    ],
    guideItems: [
      { name: "Ultimate Italian Riviera Day", slug: "ultimate-italian-riviera-day", href: SIGNATURE_EXPERIENCE_PATH, reason: "Signature pick — three villages sequenced with coastal expertise, max 8 guests.", topExcursion: "Ultimate Italian Riviera Day", returnConfidence: "High on 9+ hour calls", walkingDifficulty: "Moderate — Portofino lanes steep" },
      { name: "Riviera Highlights", slug: "riviera-highlights", href: "/shore-excursions/riviera-highlights", reason: "Portofino and Camogli when you want both icons on a group tour.", topExcursion: "Riviera Highlights Shore Excursion", returnConfidence: "High on 8+ hour calls", walkingDifficulty: "Moderate" },
      { name: "Portofino & Santa Margherita", slug: "portofino-santa-margherita", href: "/shore-excursions/portofino-santa-margherita", reason: "Glamour harbour plus flat promenade — good mobility balance.", topExcursion: "Portofino & Santa Margherita Shore Excursion", returnConfidence: "High", walkingDifficulty: "Moderate — Portofino steps" },
      { name: "Family Riviera", slug: "family-riviera", href: "/shore-excursions/family-riviera", reason: "Camogli beach and promenade when travelling with children.", topExcursion: "Family Riviera Shore Excursion", returnConfidence: "Very high", walkingDifficulty: "Easy to moderate" },
      { name: "Independent Explorer", slug: "independent-explorer", href: "/shore-excursions/independent-explorer", reason: "Train and ferry planning for experienced cruisers.", topExcursion: "Independent Explorer Shore Excursion", returnConfidence: "Moderate — you manage timing", walkingDifficulty: "Flexible" },
    ],
    faqs: [
      ["One excursion for first-timers?", "Ultimate Italian Riviera Day on 9+ hour calls — Riviera Highlights if budget matters more."],
      ["Portofino or Camogli?", "Portofino for the icon — see our comparison."],
    ],
    related: ["best-things-to-do-from-genoa", "portofino-vs-camogli", "ultimate-italian-riviera-day"],
    imageKey: "highlights",
  }),
  comparisonGuide({
    slug: "best-riviera-excursion-couples",
    title: "Best Riviera Excursions for Couples",
    seoTitle: "Romantic Italian Riviera Shore Excursions from Genoa — Couples Guide",
    meta: "Best Riviera excursions for couples from Genoa — Portofino harbour, promenade strolls and intimate coastal pacing.",
    summary: "Couples want unhurried harbour time, waterfront lunch tables and golden-hour photos — these excursions balance romance with return-to-ship discipline.",
    verdict: "Ultimate Italian Riviera Day for small-group intimacy; Portofino & Santa Margherita for harbour plus promenade; Photography Riviera when images matter most.",
    overview: [
      "Ultimate Italian Riviera Day: max 8 guests, flexible pacing, harbour lunch stop.",
      "Portofino & Santa Margherita: glamour plus flat promenade stroll.",
      "Photography Riviera: composition time at harbours and viewpoints.",
    ],
    guideItems: [
      { name: "Ultimate Italian Riviera Day", slug: "ultimate-italian-riviera-day", href: SIGNATURE_EXPERIENCE_PATH, reason: "Signature small-group — your pace, three villages, harbour lunch.", topExcursion: "Ultimate Italian Riviera Day", returnConfidence: "Very high", walkingDifficulty: "Moderate" },
      { name: "Portofino & Santa Margherita", slug: "portofino-santa-margherita", href: "/shore-excursions/portofino-santa-margherita", reason: "Harbour glamour and palm-lined promenade for two.", topExcursion: "Portofino & Santa Margherita Shore Excursion", returnConfidence: "High", walkingDifficulty: "Moderate" },
      { name: "Photography Riviera", slug: "photography-riviera", href: "/shore-excursions/photography-riviera", reason: "Extra time for harbour angles and coastal viewpoints.", topExcursion: "Photography Riviera Shore Excursion", returnConfidence: "High", walkingDifficulty: "Moderate" },
      { name: "Taste Liguria", slug: "taste-liguria", href: "/shore-excursions/taste-liguria", reason: "Shared vineyard or village pranzo and Ligurian wine.", topExcursion: "Taste Liguria Shore Excursion", returnConfidence: "High", walkingDifficulty: "Relaxed" },
    ],
    faqs: [
      ["Most romantic excursion?", "Ultimate Italian Riviera Day with waterfront lunch — book tables early."],
      ["Portofino and food tour same day?", "Only on 10+ hour private tours — otherwise pick one anchor."],
    ],
    related: ["romantic-riviera", "ultimate-italian-riviera-day", "portofino-santa-margherita"],
    imageKey: "luxury",
  }),
  comparisonGuide({
    slug: "best-riviera-excursion-families",
    title: "Best Riviera Excursions for Families",
    seoTitle: "Family-Friendly Italian Riviera Shore Excursions from Genoa",
    meta: "Best Riviera excursions for families from Genoa — Camogli beach, harbour walks and paced routing with reliable return timing.",
    summary: "Families need flat sights, beach time and short transfers — not a steep Portofino marathon. These excursions deliver from Genoa with child-aware guides.",
    verdict: "Family Riviera is the family default — Camogli beach plus Santa Margherita promenade. Riviera Highlights works for school-age children wanting Portofino photos.",
    overview: [
      "Family Riviera: Camogli beach, flat promenade, gelato stops.",
      "Riviera Highlights: Portofino photo stop plus Camogli if children manage steps.",
      "Hidden Riviera Day: village lunch without Portofino crush — school-age plus.",
    ],
    guideItems: [
      { name: "Family Riviera", slug: "family-riviera", href: "/shore-excursions/family-riviera", reason: "Beach, harbour and gelato — the family default.", topExcursion: "Family Riviera Shore Excursion", returnConfidence: "Very high", walkingDifficulty: "Easy — beach and flat promenade" },
      { name: "Riviera Highlights", slug: "riviera-highlights", href: "/shore-excursions/riviera-highlights", reason: "Portofino photos plus Camogli for school-age children.", topExcursion: "Riviera Highlights Shore Excursion", returnConfidence: "High", walkingDifficulty: "Moderate — Portofino steps" },
      { name: "Hidden Riviera Day", slug: "hidden-riviera-day", href: "/shore-excursions/hidden-riviera-day", reason: "Camogli depth without Piazzetta crowds.", topExcursion: "Hidden Riviera Day Excursion", returnConfidence: "High", walkingDifficulty: "Moderate" },
      { name: "Ultimate Italian Riviera Day", slug: "ultimate-italian-riviera-day", href: SIGNATURE_EXPERIENCE_PATH, reason: "Small group adapts pacing for mixed ages on long calls.", topExcursion: "Ultimate Italian Riviera Day", returnConfidence: "High on 9+ hour calls", walkingDifficulty: "Moderate" },
    ],
    faqs: [
      ["Portofino with kids?", "Photo stop yes for all ages; extended visit suits school-age plus."],
      ["Beach time included?", "Family Riviera and Camogli-focused tours — confirm when booking."],
    ],
    related: ["family-riviera", "best-beaches", "portofino-vs-camogli"],
    imageKey: "family",
  }),
];

w(
  "comparisons.ts",
  `import type { Comparison, ComparisonGuideItem, FAQ } from "./types";

export const comparisons: Comparison[] = [
${comparisons.join(",\n")}
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
`,
);

// ─── PLANNER ─────────────────────────────────────────────────────────────────

w(
  "planner.ts",
  `import { excursions } from "./excursions";
import { SIGNATURE_EXPERIENCE_PATH, ultimateItalianRivieraDay } from "./signature-experience";

export interface PlannerInput {
  arrivalTime?: string;
  departureTime?: string;
  adults: number;
  children: number;
  interests: string[];
  mobility: "full" | "some" | "limited";
  budget: "budget" | "mid" | "premium";
  travelStyle: "diy" | "guided";
}

export interface PlannerLink {
  label: string;
  href: string;
  why: string;
}

export interface PlannerResult {
  headline: string;
  summary: string;
  excursions: PlannerLink[];
  transfers: PlannerLink[];
  stay: PlannerLink[];
  logistics: PlannerLink[];
  dayPlan: { time: string; text: string }[];
}

export const INTEREST_OPTIONS = [
  { id: "portofino", label: "Portofino & glamour harbour" },
  { id: "villages", label: "Riviera villages" },
  { id: "food", label: "Food & wine" },
  { id: "photography", label: "Photography & scenery" },
  { id: "family", label: "Family-friendly" },
  { id: "beach", label: "Beach time" },
  { id: "independent", label: "Independent travel" },
  { id: "luxury", label: "Luxury & romance" },
  { id: "hidden", label: "Hidden Riviera" },
  { id: "coastal", label: "Coastal scenery" },
];

const INTEREST_TO_EXCURSION: Record<string, string[]> = {
  portofino: ["ultimate-italian-riviera-day", "riviera-highlights", "portofino-santa-margherita"],
  villages: ["hidden-riviera-day", "riviera-highlights", "ultimate-italian-riviera-day"],
  food: ["taste-liguria", "hidden-riviera-day", "ultimate-italian-riviera-day"],
  photography: ["photography-riviera", "ultimate-italian-riviera-day", "riviera-highlights"],
  family: ["family-riviera", "riviera-highlights", "hidden-riviera-day"],
  beach: ["family-riviera", "hidden-riviera-day", "riviera-highlights"],
  independent: ["independent-explorer", "hidden-riviera-day", "riviera-highlights"],
  luxury: ["ultimate-italian-riviera-day", "portofino-santa-margherita", "taste-liguria"],
  hidden: ["hidden-riviera-day", "taste-liguria", "family-riviera"],
  coastal: ["photography-riviera", "riviera-highlights", "ultimate-italian-riviera-day"],
};

const ITINERARY_THEMES: Record<
  string,
  { headline: string; slugs: string[]; summary: string }
> = {
  "editors-choice": {
    headline: "Editor's Choice — Ultimate Italian Riviera Day",
    slugs: ["ultimate-italian-riviera-day", "riviera-highlights", "portofino-santa-margherita"],
    summary: "Our Signature Experience — Portofino, Santa Margherita and Camogli in one small-group day (max 8 guests) with cruise-timed coastal planning.",
  },
  "best-historic": {
    headline: "Riviera Highlights",
    slugs: ["riviera-highlights", "ultimate-italian-riviera-day", "portofino-santa-margherita"],
    summary: "Portofino harbour and Camogli village — the essential Riviera duo without rushing your port day.",
  },
  "best-food": {
    headline: "Taste Liguria",
    slugs: ["taste-liguria", "hidden-riviera-day", "ultimate-italian-riviera-day"],
    summary: "Pesto, seafood and Riviera wine fitted to your Genoa port hours.",
  },
  "best-photography": {
    headline: "Photography Riviera",
    slugs: ["photography-riviera", "ultimate-italian-riviera-day", "riviera-highlights"],
    summary: "Portofino harbour angles, Camogli facades and coastal viewpoints.",
  },
  "best-independent": {
    headline: "Independent Explorer",
    slugs: ["independent-explorer", "hidden-riviera-day", "riviera-highlights"],
    summary: "Train to Santa Margherita or self-paced Camogli — manage your own return buffer to Genoa.",
  },
  "best-families": {
    headline: "Family Riviera",
    slugs: ["family-riviera", "riviera-highlights", "hidden-riviera-day"],
    summary: "Camogli beach and Santa Margherita promenade — paced for mixed-age families.",
  },
  "best-luxury": {
    headline: "Ultimate Italian Riviera Day",
    slugs: ["ultimate-italian-riviera-day", "portofino-santa-margherita", "taste-liguria"],
    summary: "Small-group vehicle, flexible harbour pacing and premium coastal routing.",
  },
  "hidden-gem": {
    headline: "Hidden Riviera",
    slugs: ["hidden-riviera-day", "taste-liguria", "family-riviera"],
    summary: "Camogli, village lunches and uncrowded lanes away from Portofino coach convoys.",
  },
};

function excursionLink(slug: string, why: string): PlannerLink | null {
  const e = excursions.find((x) => x.slug === slug);
  if (!e) return null;
  return { label: e.title, href: \`/shore-excursions/\${slug}\`, why };
}

function usableHours(input: PlannerInput): number {
  if (input.arrivalTime && input.departureTime) {
    const [aH, aM] = input.arrivalTime.split(":").map(Number);
    const [dH, dM] = input.departureTime.split(":").map(Number);
    const arrivalMins = aH * 60 + aM;
    const departMins = dH * 60 + dM;
    const raw = (departMins - arrivalMins) / 60;
    return Math.max(0, raw - 1.5);
  }
  return 7.5;
}

function pickTheme(input: PlannerInput): keyof typeof ITINERARY_THEMES {
  const { interests, children, travelStyle, mobility, budget } = input;
  const active = interests.length ? interests : ["portofino", "coastal"];

  if (children > 0 || active.includes("family") || active.includes("beach")) return "best-families";
  if (budget === "premium" || active.includes("luxury") || mobility === "limited") return "best-luxury";
  if (travelStyle === "diy" || active.includes("independent")) return "best-independent";
  if (active.includes("food")) return "best-food";
  if (active.includes("photography") || active.includes("coastal")) return "best-photography";
  if (active.includes("hidden") || active.includes("villages")) return "hidden-gem";
  if (active.includes("portofino")) return "editors-choice";
  if (mobility === "limited") return "best-luxury";
  if (usableHours(input) < 6) return "best-families";
  return "editors-choice";
}

export function generateGenoaPlan(input: PlannerInput): PlannerResult {
  const { arrivalTime, departureTime, adults, children, interests, mobility, budget, travelStyle } = input;
  const party = adults + children;
  const hasKids = children > 0;
  const hours = usableHours(input);

  const themeKey = pickTheme(input);
  const theme = ITINERARY_THEMES[themeKey];

  const excSlugs: string[] = [];
  const pushSlug = (s: string) => {
    if (s && !excSlugs.includes(s)) excSlugs.push(s);
  };

  for (const s of theme.slugs) pushSlug(s);

  const activeInterests = interests.length ? interests : ["portofino", "coastal"];
  for (const interest of activeInterests) {
    for (const s of INTEREST_TO_EXCURSION[interest] ?? []) pushSlug(s);
  }
  if (hasKids) pushSlug("family-riviera");
  if (mobility === "limited") pushSlug("ultimate-italian-riviera-day");
  if (travelStyle === "diy") pushSlug("independent-explorer");
  if (budget === "premium") pushSlug("ultimate-italian-riviera-day");
  if (hours < 6) pushSlug("family-riviera");

  const reasonMap: Record<string, string> = {
    "ultimate-italian-riviera-day": "Signature Experience — Portofino, Santa Margherita and Camogli, max 8 guests.",
    "riviera-highlights": "Portofino and Camogli on one sequenced coastal day.",
    "portofino-santa-margherita": "Harbour glamour plus flat promenade walk.",
    "taste-liguria": "Pesto, seafood and Ligurian wine lunch.",
    "photography-riviera": "Harbour angles and coastal viewpoints with photo pacing.",
    "hidden-riviera-day": "Camogli and village lunch away from Portofino crowds.",
    "family-riviera": "Beach, harbour and gelato for mixed-age families.",
    "independent-explorer": "Train or ferry DIY with planning support.",
  };

  const excursionLinks = excSlugs
    .slice(0, 5)
    .map((s) => excursionLink(s, reasonMap[s] ?? "A strong match for your Riviera port day."))
    .filter((x): x is PlannerLink => x !== null);

  if (!excursionLinks.some((l) => l.href === SIGNATURE_EXPERIENCE_PATH)) {
    excursionLinks.unshift({
      label: ultimateItalianRivieraDay.title,
      href: SIGNATURE_EXPERIENCE_PATH,
      why: reasonMap["ultimate-italian-riviera-day"],
    });
  }

  const transfers: PlannerLink[] = [
    {
      label: "Genoa Cruise Port Guide",
      href: "/cruise-port-guide",
      why: "Stazione Marittime terminal layout, taxis to Piazza Principe and coach pickup points.",
    },
  ];
  if (party >= 3 || hasKids || mobility === "limited" || budget === "premium") {
    transfers.push({
      label: "Ultimate Italian Riviera Day",
      href: SIGNATURE_EXPERIENCE_PATH,
      why: "Strongest return-to-ship confidence when coastal road traffic builds.",
    });
  }

  const logistics: PlannerLink[] = [
    { label: "Ship Schedules", href: "/ship-schedules/genoa", why: "See how many ships share your Genoa port day." },
    {
      label: "One Day on the Riviera",
      href: "/guides/one-day-on-the-riviera",
      why: "Hour-by-hour sample itineraries from gangway to all-aboard.",
    },
    {
      label: "DIY vs Guided",
      href: "/compare/diy-vs-guided",
      why: "When independent train and ferry travel beats a shore excursion.",
    },
  ];

  const topExc = excursionLinks[0]?.label ?? theme.headline;
  const dayPlan: { time: string; text: string }[] = [];

  const arriveLabel = arrivalTime ?? "07:30";
  const departLabel = departureTime ?? "17:00";

  dayPlan.push({
    time: "On arrival",
    text: \`Disembark at Genoa Stazione Marittime (\${arriveLabel}). Meet your excursion at the terminal exit, or taxi to Genova Piazza Principe (15–25 min) for an independent train to Santa Margherita.\`,
  });

  if (themeKey === "best-food") {
    dayPlan.push({ time: "Morning", text: "Scenic coastal drive — pesto or focaccia tasting mid-morning in a Riviera village." });
    dayPlan.push({ time: "Midday", text: "Multi-course Ligurian seafood pranzo with Vermentino — allow 90 minutes seated." });
    dayPlan.push({ time: "Afternoon", text: "Village stroll or bakery stop, then coastal return toward Genoa." });
  } else if (themeKey === "best-independent") {
    dayPlan.push({ time: "Morning", text: "Taxi to Piazza Principe — regional train to Santa Margherita or Camogli." });
    dayPlan.push({ time: "Midday", text: "Self-guided harbour walk or ferry to Portofino — confirm return sailings before leaving." });
    dayPlan.push({ time: "Afternoon", text: "Return train mid-afternoon, taxi to terminal 90 minutes before all-aboard." });
  } else if (themeKey === "best-families") {
    dayPlan.push({ time: "Morning", text: "Camogli harbour and beach time for children." });
    dayPlan.push({ time: "Midday", text: "Focaccia snack and gelato — transfer to Santa Margherita promenade." });
    dayPlan.push({ time: "Afternoon", text: "Flat lungomare walk — short coastal return to Genoa." });
  } else if (themeKey === "best-photography" || themeKey === "hidden-gem") {
    dayPlan.push({ time: "Morning", text: "Portofino harbour or Camogli facades — morning light for photos." });
    dayPlan.push({ time: "Midday", text: "Viewpoint or village stop — allow time for composition." });
    dayPlan.push({ time: "Afternoon", text: "Return via coastal road — do not add a third village unless hours exceed 9." });
  } else if (themeKey === "best-luxury" || themeKey === "editors-choice") {
    dayPlan.push({ time: "Morning", text: "Small-group coastal transfer — Portofino harbour, Castello Brown viewpoint and San Giorgio lane." });
    dayPlan.push({ time: "Midday", text: "Santa Margherita promenade and waterfront lunch stop." });
    dayPlan.push({ time: "Afternoon", text: "Camogli harbour stroll — flexible pacing to your ship on \${topExc}." });
  } else if (hasKids) {
    dayPlan.push({ time: "Morning", text: "Camogli beach and colourful harbour — flat and accessible for children." });
    dayPlan.push({ time: "Midday", text: "Gelato on the promenade and focaccia from a village bakery." });
    dayPlan.push({ time: "Afternoon", text: "Early return to terminal — avoid Portofino steep lanes with toddlers." });
  } else {
    dayPlan.push({
      time: "Morning",
      text: \`Riviera anchor first: \${topExc}. Morning arrival beats Portofino midday coach crowds.\`,
    });
    dayPlan.push({ time: "Midday", text: "Harbour lunch or gelato — quick stops if on a combo tour." });
    dayPlan.push({ time: "Afternoon", text: "Second village or viewpoint — coach departure planned for coastal traffic." });
  }

  dayPlan.push({
    time: "Return buffer",
    text: \`Be back at Genoa terminal 60–90 minutes before all-aboard (\${departLabel} sailing). Coastal road traffic from Portofino can add 20–30 minutes in peak summer.\`,
  });

  const interestLabels = activeInterests
    .map((i) => INTEREST_OPTIONS.find((o) => o.id === i)?.label ?? i)
    .join(", ")
    .toLowerCase();

  const styleLabel = travelStyle === "diy" ? "independent" : "guided";

  return {
    headline: theme.headline,
    summary: \`\${theme.summary} A Genoa port day (~\${hours.toFixed(1)} usable hours) for \${party} guest\${party === 1 ? "" : "s"} interested in \${interestLabels}, preferring \${styleLabel} travel.\`,
    excursions: excursionLinks.slice(0, 5),
    transfers,
    stay: [],
    logistics,
    dayPlan,
  };
}
`,
);

// ─── SIGNATURE EXPERIENCE ────────────────────────────────────────────────────

w(
  "signature-experience.ts",
  `import type { FAQ } from "./types";

export const SIGNATURE_EXPERIENCE_PATH = "${SIGNATURE_EXPERIENCE_PATH}";

export interface SignatureBenefit {
  emoji: string;
  title: string;
  description: string;
}

export interface ItineraryStep {
  time: string;
  title: string;
  description: string;
}

export interface PassengerSnapshot {
  title: string;
  quote: string;
}

export const ultimateItalianRivieraDay = {
  slug: "ultimate-italian-riviera-day",
  title: "Ultimate Italian Riviera Day",
  seoTitle: "Ultimate Italian Riviera Day — Signature Small-Group Experience from Genoa",
  metaDescription:
    "Our Signature Experience for Genoa cruise passengers — Portofino, Santa Margherita and Camogli in one carefully planned day, maximum 8 guests, timed for your ship with return-to-ship confidence.",
  tagline:
    "Portofino, Santa Margherita and Camogli in one unhurried day — the experience our editors would genuinely recommend to a first-time cruise passenger wanting the very best of the Italian Riviera.",
  overview:
    "Ultimate Italian Riviera Day is our flagship Signature Experience: a small-group day (maximum eight guests) that sequences Portofino's harbour, Santa Margherita's promenade and Camogli's fishing village with the pacing, flexibility and coastal road timing that large coach tours rarely achieve. It is the curated day we suggest when someone asks, \\"If I have one port call and want the Riviera properly, what should I do?\\"",
  editorsChoiceReasons: [
    {
      heading: "Three villages, one coherent day",
      text: "Portofino, Santa Margherita and Camogli each reward a port call on their own — Ultimate Italian Riviera Day sequences them without the rushed feel of a 50-seat coach convoy. Morning harbour walk in Portofino; promenade and lunch in Santa Margherita; afternoon colour in Camogli.",
    },
    {
      heading: "Built around cruise reality",
      text: "Every departure is planned backward from your all-aboard time. Coastal road legs account for summer traffic returning from Portofino; village time is coordinated so you are not standing in harbour crowds while your return window shrinks. This is port-day logistics, not generic Riviera tourism.",
    },
    {
      heading: "Small enough to adapt",
      text: "With a maximum of eight guests, your guide can adjust pacing — an extra ten minutes at the Piazzetta, a quieter lane in Camogli, or a brief gelato stop without derailing forty other passengers.",
    },
  ],
  smallGroupReasons: [
    "Faster embarkation at Genoa terminal — no waiting for a full coach to fill",
    "Quicker movement through Portofino's narrow lanes",
    "More time for harbour photographs without holding up a large group",
    "Direct conversation with your guide — ask about Ligurian food, yacht spotting or your return time",
    "Less time lost at rest stops and group headcounts",
  ],
  perfectFor: [
    "First-time Italian Riviera visitors on a standard 9–10 hour port call",
    "Couples and small families who want Portofino without choosing between villages",
    "Passengers who value personal attention over the lowest per-seat price",
    "Photography enthusiasts who need flexibility at harbours and viewpoints",
    "Travellers who feel anxious about coastal road return timing and prefer expert handling",
  ],
  notIdealFor: [
    "Calls under 8.5 usable hours ashore — choose Camogli-only or Family Riviera instead",
    "Passengers who want a full-day Genoa old-town visit — allow a dedicated Genoa day",
    "Large groups travelling together who need a private vehicle for ten or more",
    "Budget-first travellers — standard group excursions offer lower per-person pricing",
  ],
  benefits: [
    { emoji: "🚐", title: "Maximum 8 guests", description: "A small group that moves through Riviera villages without coach-tour inertia." },
    { emoji: "⚓", title: "Portofino, Santa Margherita & Camogli", description: "Three coastal anchors sequenced with harbour and viewpoint expertise." },
    { emoji: "📸", title: "Photography flexibility", description: "Time for harbour angles, Camogli facades and promenade views without rushing." },
    { emoji: "😊", title: "Personal guide attention", description: "Ask questions, adjust pace and hear context that large groups never receive." },
    { emoji: "🚶", title: "Less waiting", description: "Smaller groups mean faster boarding and fewer rest-stop delays." },
    { emoji: "⏰", title: "Cruise-timed planning", description: "Departures and coastal legs planned around your ship's published hours." },
    { emoji: "❤️", title: "Designed for cruise passengers", description: "Written for port-day reality — not a repurposed land tour with a ship pickup added." },
  ] satisfies SignatureBenefit[],
  vsLargeCoach: [
    { aspect: "Group size", signature: "Maximum 8 guests", largeCoach: "Often 40–50 passengers" },
    { aspect: "Portofino pacing", signature: "Adjustable harbour routes and viewpoint timing", largeCoach: "Fixed schedule — stragglers delay everyone" },
    { aspect: "Photography stops", signature: "Brief pauses built into the route", largeCoach: "Limited — group must keep moving" },
    { aspect: "Guide access", signature: "Direct conversation throughout the day", largeCoach: "Microphone briefing at each stop" },
    { aspect: "Terminal pickup", signature: "Small vehicle at cruise terminal exit", largeCoach: "Queue for full coach departure" },
    { aspect: "Return planning", signature: "Explicit coastal road buffer built into afternoon departure", largeCoach: "Varies by operator — confirm before booking" },
  ],
  itinerary: [
    { time: "08:00–08:30", title: "Meet at Genoa terminal", description: "Small-group pickup at Stazione Marittime cruise terminal exit. Brief overview of the day's timing and your all-aboard window." },
    { time: "08:30–09:45", title: "Transfer to Portofino", description: "Scenic coastal road east from Genoa through Rapallo toward the Portofino peninsula. Your guide outlines the morning route before arrival." },
    { time: "09:45–12:00", title: "Portofino — harbour & viewpoints", description: "Piazzetta promenade, marina walk and optional Castello Brown viewpoint. San Giorgio lane if time and mobility allow before lunch." },
    { time: "12:00–13:15", title: "Santa Margherita promenade & lunch", description: "Transfer to Santa Margherita Ligure — lungomare stroll and waterfront lunch or focaccia stop depending on group preference." },
    { time: "13:15–14:00", title: "Transfer to Camogli", description: "Short coastal hop to Camogli's fishing harbour — typically quieter than the morning Portofino inbound traffic." },
    { time: "14:00–15:30", title: "Camogli — fishing village", description: "Harbour promenade, pastel house photography and optional beach time. Focaccia from a village bakery if lunch was light." },
    { time: "15:30–16:30", title: "Return to Genoa", description: "Coastal road transfer with traffic buffer. Typical terminal arrival 16:30–17:00 for 18:00 all-aboard sailings." },
  ] satisfies ItineraryStep[],
  passengerSnapshots: [
    {
      title: "Elena & Marco — first Western Mediterranean cruise",
      quote: "We wanted Portofino but worried a big coach would feel rushed. Eight passengers meant our guide could slow down at the harbour when we asked — and we still made Camogli with an hour to spare before all-aboard.",
    },
    {
      title: "David — travelling solo",
      quote: "I did not want to puzzle over train and ferry timetables on my first cruise. The small group felt like travelling with knowledgeable friends — and Portofino at 10 a.m. beat the midday crush.",
    },
    {
      title: "The Chen family — teenage children",
      quote: "Our teens loved the yacht spotting in Portofino and the beach stop in Camogli. The guide actually talked to them instead of lecturing a bus — perfect sequencing for a port day.",
    },
  ] satisfies PassengerSnapshot[],
  returnReassurance: [
    "Every Ultimate Italian Riviera Day departure is planned backward from your ship's all-aboard time — typically allowing 60–90 minutes buffer beyond expected coastal travel.",
    "Summer road traffic from Portofino is the main variable; small-group departures from the peninsula are scheduled earlier than many large coaches to protect your margin.",
    "Your guide tracks the ship's published departure and communicates any timing adjustments during the day — you are not left guessing when to head back.",
    "If your cruise line publishes a change to port hours, contact us before sailing so the day's sequencing can be adjusted.",
  ],
  included: [
    "Small-group vehicle (maximum 8 guests)",
    "Licensed English-speaking guide for the full day",
    "Portofino harbour walking tour",
    "Santa Margherita promenade visit",
    "Camogli fishing village visit",
    "Return transfer timed to your ship",
  ],
  faqs: [
    {
      question: "Is Ultimate Italian Riviera Day right for my port call length?",
      answer: "Best on standard 9–10 hour calls with at least 8.5 usable hours ashore. Shorter calls suit Riviera Highlights or Family Riviera — use our cruise planner to confirm.",
    },
    {
      question: "How is this different from Riviera Highlights?",
      answer: "Riviera Highlights covers Portofino and Camogli on larger group tours. Ultimate Italian Riviera Day is our Signature Experience — maximum eight guests, adds Santa Margherita and offers more flexible pacing.",
    },
    {
      question: "Is lunch included?",
      answer: "A waterfront lunch or focaccia stop is planned into the day — inclusions vary by season. Confirm menu and dietary options when booking.",
    },
    {
      question: "What if coastal traffic delays our return?",
      answer: "Afternoon departures are scheduled with summer road traffic in mind. Small groups board faster than full coaches, which adds margin. Your guide protects your return window.",
    },
    {
      question: "Can eight guests include children?",
      answer: "Yes — families book regularly. The pacing suits school-age children better than toddlers; for very young children, Family Riviera may be a calmer alternative.",
    },
    {
      question: "Why is this a Signature Experience?",
      answer: "Signature Experiences are curated through trusted local partners and unique to our editorial recommendation — not a generic catalogue listing. We use this badge only when we would genuinely suggest the experience to a friend arriving into Genoa.",
    },
  ] satisfies FAQ[],
};

export function getSignatureEditorialRecommendation() {
  return {
    category: "editors-choice" as const,
    title: "Ultimate Italian Riviera Day",
    description: "Our Signature Experience — Portofino, Santa Margherita and Camogli, maximum 8 guests.",
    href: SIGNATURE_EXPERIENCE_PATH,
    signature: true,
  };
}
`,
);

// ─── HOMEPAGE ────────────────────────────────────────────────────────────────

w(
  "homepage.ts",
  `import type { FAQ, VisitorType, ExperienceCard } from "./types";

export const homepageTagline = "Your Gateway to the Italian Riviera";

export const visitorTypes: VisitorType[] = [
  {
    id: "port-day",
    label: "I'm visiting the Italian Riviera for the day on a cruise",
    shortLabel: "Port day",
    description: "You're calling at Genoa for the day. Find shore excursions, planning guides and a realistic Riviera itinerary from Stazione Marittime.",
    href: "/shore-excursions",
    cta: "Plan my port day",
  },
  {
    id: "first-time",
    label: "It's my first time on the Italian Riviera",
    shortLabel: "First visit",
    description: "Portofino or Camogli? Our first-timer guides and comparison pages help you choose confidently from Genoa.",
    href: "/guides/best-things-to-do-from-genoa",
    cta: "First-timer guide",
  },
  {
    id: "independent",
    label: "I prefer to explore independently",
    shortLabel: "Independent",
    description: "Train to Santa Margherita, ferry to Portofino, manage your own return — when DIY beats a ship tour.",
    href: "/guides/independent-riviera-guide",
    cta: "Independent guide",
  },
  {
    id: "planner",
    label: "I want a personalised itinerary",
    shortLabel: "Custom plan",
    description: "Tell us your hours ashore, interests and budget — get a tailored Riviera plan with return-to-ship timing.",
    href: "/cruise-planner",
    cta: "Use the planner",
  },
];

export interface HomeSection {
  slug: string;
  number: string;
  title: string;
  description: string;
  href: string;
  cta: string;
}

export const experienceCards: ExperienceCard[] = [
  {
    slug: "ultimate-riviera",
    title: "Ultimate Italian Riviera Day",
    description: "Portofino, Santa Margherita and Camogli — our Signature Experience for Genoa cruise passengers, maximum 8 guests.",
    href: "${SIGNATURE_EXPERIENCE_PATH}",
    cta: "Signature Experience",
    imageKey: "city",
  },
  {
    slug: "portofino-camogli",
    title: "Portofino & Camogli",
    description: "Glamour harbour and fishing village — the Riviera's best combo for first-time visitors and photography lovers.",
    href: "/guides/portofino-from-genoa",
    cta: "Explore Portofino",
    imageKey: "fortress",
  },
  {
    slug: "ligurian-food",
    title: "Ligurian Food & Wine",
    description: "Pesto, focaccia di Recco and fresh seafood — gastronomy as your port-day anchor on the Riviera.",
    href: "/guides/riviera-food-guide",
    cta: "Taste Liguria",
    imageKey: "food",
  },
  {
    slug: "hidden-riviera",
    title: "Hidden Riviera",
    description: "Camogli, coastal coves and village trattorias — uncrowded alternatives to the Portofino coach convoys.",
    href: "/guides/hidden-riviera",
    cta: "Discover hidden Riviera",
    imageKey: "history",
  },
  {
    slug: "independent-explorer",
    title: "Independent Explorer",
    description: "Regional train to Santa Margherita or self-paced Camogli — manage your own return buffer from Genoa.",
    href: "/guides/independent-riviera-guide",
    cta: "Go independent",
    imageKey: "port",
  },
];

export const coreSections: HomeSection[] = [
  { slug: "shore-excursions", number: "01", title: "Shore Excursions", description: "Portofino, Camogli, Santa Margherita and Ligurian food — cruise-timed from Genoa terminal.", href: "/shore-excursions", cta: "Browse excursions" },
  { slug: "cruise-planner", number: "02", title: "Riviera Cruise Planner", description: "Answer a few questions — get a tailored itinerary with return-to-ship confidence.", href: "/cruise-planner", cta: "Start planning" },
  { slug: "cruise-port-guide", number: "03", title: "Genoa Cruise Port Guide", description: "Stazione Marittime terminal layout, taxis to Piazza Principe and coach pickup on arrival.", href: "/cruise-port-guide", cta: "Port guide" },
  { slug: "ship-schedules", number: "04", title: "Cruise Ship Schedules", description: "See which ships call at Genoa and plan around published arrival and departure times.", href: "/ship-schedules/genoa", cta: "View schedules" },
  { slug: "guides", number: "05", title: "Riviera Planning Guides", description: "Authority guides for Portofino, Camogli, food and every type of passenger.", href: "/guides", cta: "Read guides" },
  { slug: "faq", number: "06", title: "FAQ", description: "Genoa cruise port questions answered — timing, trains, excursions and return buffers.", href: "/faq", cta: "Read FAQs" },
  { slug: "enquire", number: "07", title: "Enquire", description: "Ask about shore excursions, group sizes and availability for your Genoa port day.", href: "/enquire", cta: "Get in touch" },
];

export function getHomepageFaqs(): FAQ[] {
  return [
    {
      question: "How far is Portofino from Genoa cruise port?",
      answer: "About 35 km — 60–75 minutes by coach or private transfer along the coastal road. Regional train to Santa Margherita plus bus or ferry adds connection time.",
    },
    {
      question: "Can I visit Portofino and Camogli on one Genoa port day?",
      answer: "Yes on 8+ hour calls via organised combo excursions like Riviera Highlights or Ultimate Italian Riviera Day. Independent dual-village days are high risk on standard calls.",
    },
    {
      question: "Should I book a shore excursion or explore independently?",
      answer: "Portofino combos benefit from coach timing and village orientation. Camogli by train suits confident independents — see our DIY vs guided comparison.",
    },
    {
      question: "What is the best Riviera excursion for first-timers?",
      answer: "Ultimate Italian Riviera Day on 9+ hour calls — Portofino, Santa Margherita and Camogli with max 8 guests. Riviera Highlights if you prefer a group tour.",
    },
    {
      question: "Where do cruise ships dock in Genoa?",
      answer: "At Stazione Marittime cruise terminal in the Porto Antico area. Coaches and taxis meet passengers at the terminal exit.",
    },
  ];
}
`,
);

// ─── SCHEDULES ───────────────────────────────────────────────────────────────

w(
  "schedules.ts",
  `import type { ScheduleEntry, ShipSchedulePort } from "./types";
import {
  filterEntriesByMonth,
  filterEntriesByYear,
  getMonthsWithEntries,
  type ScheduleYear,
} from "@/lib/schedule-utils";
import genoaSchedule from "./imported-schedules/genoa.json";

const SCHEDULE_FAQS = [
  {
    question: "How accurate are Genoa cruise ship schedules?",
    answer:
      "Schedules are compiled from published timetables and updated periodically. Times and berths can change — confirm with your cruise line before booking excursions.",
  },
  {
    question: "How far is Portofino from Genoa cruise terminal?",
    answer:
      "About 35 km — 60–75 minutes by coach. Allow extra time when multiple ships share the port and coastal road traffic builds.",
  },
  {
    question: "Can I visit Portofino on a short port call?",
    answer:
      "Calls under 7 usable hours are tight for Portofino — choose Camogli or Santa Margherita instead. Standard 9–11 hour calls suit Ultimate Italian Riviera Day or Riviera Highlights.",
  },
];

const SCHEDULE_TIPS = [
  "Check how many ships share your Genoa port day before booking Riviera excursions",
  "Book excursions before sailing on multi-ship days in July and August",
  "Allow 60–90 minute return buffer from the Riviera to Genoa terminal",
  "Morning departures protect against afternoon coastal road delays from Portofino",
];

export const schedulePorts: ShipSchedulePort[] = [
  {
    slug: "genoa",
    name: "Genoa",
    country: "Italy",
    seoTitle: "Genoa Cruise Ship Schedule — Italian Riviera Port Calls",
    metaDescription:
      "Genoa cruise ship schedule — see which ships call at Stazione Marittime and plan Italian Riviera shore excursions around published arrival and departure times.",
    intro:
      "Genoa is the gateway port for the Italian Riviera on Western Mediterranean itineraries. Check scheduled arrivals and departures before booking Portofino, Camogli or Ligurian food excursions.",
    description: "Italy's Italian Riviera cruise gateway — Portofino 35 km east, Camogli 28 km, Santa Margherita 32 km along the coast.",
    scheduleOverview:
      "Peak cruise traffic April through October, with heaviest calls May to September on Mediterranean and Grand Voyage itineraries.",
    planningTips: SCHEDULE_TIPS,
    faqs: SCHEDULE_FAQS,
  },
];

const scheduleData: Record<string, ScheduleEntry[]> = {
  genoa: genoaSchedule as ScheduleEntry[],
};

export function getSchedulePortBySlug(slug: string): ShipSchedulePort | undefined {
  return schedulePorts.find((p) => p.slug === slug);
}

export function getAllSchedulePortSlugs(): string[] {
  return schedulePorts.map((p) => p.slug);
}

export function getScheduleEntries(slug: string): ScheduleEntry[] {
  return scheduleData[slug] ?? [];
}

export function getScheduleEntryCount(slug: string): number {
  return getScheduleEntries(slug).length;
}

export function getScheduleEntriesForYear(slug: string, year: ScheduleYear): ScheduleEntry[] {
  return filterEntriesByYear(getScheduleEntries(slug), year);
}

export function getScheduleEntriesForMonth(slug: string, monthKey: string): ScheduleEntry[] {
  return filterEntriesByMonth(getScheduleEntries(slug), monthKey);
}

export function getVerifiedMonthKeys(slug: string): string[] {
  return getMonthsWithEntries(getScheduleEntries(slug));
}

export function searchSchedulesByShip(query: string): { portSlug: string; entries: ScheduleEntry[] }[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const results: { portSlug: string; entries: ScheduleEntry[] }[] = [];
  for (const port of schedulePorts) {
    const matches = getScheduleEntries(port.slug).filter(
      (e) => e.ship.toLowerCase().includes(q) || e.cruiseLine.toLowerCase().includes(q),
    );
    if (matches.length) results.push({ portSlug: port.slug, entries: matches });
  }
  return results;
}

export function getTodayTomorrowEntries(slug: string): { today: ScheduleEntry[]; tomorrow: ScheduleEntry[] } {
  const entries = getScheduleEntries(slug);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return {
    today: entries.filter((e) => e.date === fmt(today)),
    tomorrow: entries.filter((e) => e.date === fmt(tomorrow)),
  };
}
`,
);

// ─── PORT GUIDE ──────────────────────────────────────────────────────────────

w(
  "port-guide.ts",
  `import type { FAQ } from "./types";

export interface Terminal {
  name: string;
  quay: string;
  usedBy: string;
  cityAccess: string;
}

export interface PortGuideSection {
  heading: string;
  paragraphs: string[];
}

export const portGuideContent = {
  title: "Genoa Cruise Port Guide",
  subtitle: "Stazione Marittime terminal, taxis to Piazza Principe, coaches to the Riviera and return-to-ship timing.",
  terminals: [
    {
      name: "Genoa Stazione Marittime (Porto Antico)",
      quay: "Cruise terminal in the Porto Antico waterfront district",
      usedBy: "Most large ships — MSC, Costa, Celebrity, Norwegian and others on Mediterranean itineraries",
      cityAccess: "Taxi 15–25 min to Genova Piazza Principe; excursion coaches at terminal exit; Portofino 60–75 min by coach",
    },
    {
      name: "Tender operations",
      quay: "Anchorage in Genoa harbour",
      usedBy: "Occasional overflow when berths are full or for very large vessels",
      cityAccess: "Tender to terminal area then taxi or coach — add 30–45 minutes to Riviera planning",
    },
    {
      name: "Genova Piazza Principe station",
      quay: "Not a cruise berth — rail hub 15–25 min taxi from terminal",
      usedBy: "Regional trains to Santa Margherita Ligure and Camogli — independent passengers reach via taxi",
      cityAccess: "15–25 min taxi from cruise terminal; direct trains to Santa Margherita (~45 min), Camogli (~40 min)",
    },
  ] as Terminal[],
  sections: [
    {
      heading: "Where cruise ships dock in Genoa",
      paragraphs: [
        "Cruise ships dock at Genoa's Stazione Marittime cruise terminal in the Porto Antico area — a revitalised waterfront district and the gateway to the Italian Riviera.",
        "Genoa is the departure point for the coast eastward: Camogli sits 28 km along the shore, Santa Margherita Ligure 32 km and Portofino 35 km. Most passengers leave immediately for Riviera shore excursions — Genoa's medieval old town rewards time if your return is early.",
        "Genoa appears on Western Mediterranean, Grand Voyage and Italy-intensive itineraries from April through October, with heaviest traffic May to September.",
      ],
    },
    {
      heading: "Getting from Genoa to the Italian Riviera",
      paragraphs: [
        "Portofino is 60–75 minutes by coach or private transfer from the cruise terminal along the coastal road — the fastest door-to-door option for most cruise passengers.",
        "Independent travellers taxi to Genova Piazza Principe or Brignole (15–25 minutes) for regional trains to Santa Margherita Ligure or Camogli. Seasonal ferries from Porto Antico reach Camogli and Portofino — check timetables against your port window.",
        "Camogli is the closest major village — 45–55 minutes by road. Santa Margherita offers flat promenade walks and ferry links to Portofino.",
      ],
    },
    {
      heading: "Facilities and practicalities",
      paragraphs: [
        "The cruise terminal offers toilets, seating and tourist information. ATMs are available — carry euros for taxis and train tickets.",
        "Currency is the euro. Italian is the local language; English is widely spoken on excursions and at major Riviera villages. Download offline maps — terminal Wi-Fi is unreliable.",
        "Genoa and the Riviera are generally safe. Watch belongings in Portofino crowds and on crowded trains during cruise season.",
      ],
    },
    {
      heading: "Return-to-ship timing",
      paragraphs: [
        "Confirm all-aboard time — usually 30–60 minutes before departure. Keep a 60–90 minute buffer beyond expected travel time, especially returning from Portofino on the coastal road.",
        "Summer afternoon traffic from the Riviera routinely adds 20–30 minutes. Excursion coaches typically depart Portofino by 15:30–16:00 for 17:00–18:00 all-aboard.",
        "Independent travellers should plan return trains and ferries with margin — the ship will not wait if you miss all-aboard on non-ship excursions.",
      ],
    },
  ] as PortGuideSection[],
  faqs: [
    {
      question: "How far is Portofino from Genoa cruise port?",
      answer: "About 35 km — 60–75 minutes by coach plus 15–25 minutes taxi from terminal to Piazza Principe if travelling by train to Santa Margherita first.",
    },
    {
      question: "Can I walk to Genova Piazza Principe from the cruise terminal?",
      answer: "Not recommended for Riviera day trips — 15–25 minutes by taxi through port and city traffic. Pre-book return taxis on busy port days.",
    },
    {
      question: "Do cruise ships tender in Genoa?",
      answer: "Occasionally when berths are full. Tendering adds 30–45 minutes — confirm on your cruise app the evening before.",
    },
    {
      question: "How much time to return from Portofino?",
      answer: "Allow 60–75 minutes coach transfer plus 60–90 minutes before all-aboard. Summer coastal traffic can add 20–30 minutes.",
    },
  ] as FAQ[],
};

export const terminals = portGuideContent.terminals;
export const portGuideSections = portGuideContent.sections;
export const portGuideFaqs = portGuideContent.faqs;
`,
);

// ─── FAQS ────────────────────────────────────────────────────────────────────

w(
  "faqs.ts",
  `import type { FAQ } from "./types";
import { getHomepageFaqs } from "./homepage";

export const extraFaqs: FAQ[] = [
  {
    question: "Where do cruise ships dock in Genoa?",
    answer:
      "At Stazione Marittime cruise terminal in the Porto Antico area. Coaches and taxis meet passengers at the terminal exit.",
  },
  {
    question: "How long does it take to reach Portofino from Genoa?",
    answer:
      "60–75 minutes by coach or private transfer, plus 15–25 minutes taxi from the cruise terminal to Piazza Principe if travelling by train to Santa Margherita first.",
  },
  {
    question: "Can I visit the Riviera without a shore excursion?",
    answer:
      "Yes — train to Santa Margherita or Camogli from Piazza Principe suits confident travellers. Confirm ferry timetables and allow 90 minutes return buffer.",
  },
  {
    question: "What is the best Riviera excursion for first-time visitors?",
    answer:
      "Ultimate Italian Riviera Day — Portofino, Santa Margherita and Camogli with max 8 guests on 9+ hour calls. Riviera Highlights for a group Portofino and Camogli combo.",
  },
  {
    question: "Should I book excursions through my cruise line?",
    answer:
      "Ship tours guarantee the vessel waits if their excursion is late. Reputable independent operators track all-aboard with buffers — often smaller groups and lower prices.",
  },
  {
    question: "Is a Genoa port day long enough for Portofino and Camogli?",
    answer:
      "Yes on 8+ hour calls via organised combo excursions. Standard 9–10 hour calls suit Ultimate Italian Riviera Day with three villages.",
  },
  {
    question: "How early should I return to Genoa from Portofino?",
    answer:
      "Coaches typically leave Portofino by 15:30–16:00. Independent travellers should be at Genoa terminal 60–90 minutes before all-aboard.",
  },
  {
    question: "What currency is used on the Italian Riviera?",
    answer:
      "The euro. Cards work at major villages; carry cash for taxis, regional trains and small trattorias.",
  },
  {
    question: "Are Riviera shore excursions suitable for limited mobility?",
    answer:
      "Santa Margherita promenade and Camogli harbour are relatively flat. Portofino lanes are steep — small-group tours with flexible pacing work better.",
  },
  {
    question: "When is peak cruise season in Genoa?",
    answer:
      "April through October, with heaviest ship traffic May to September. Book Riviera excursions before sailing in July and August.",
  },
];

export function getAllFaqs(): FAQ[] {
  return [...getHomepageFaqs(), ...extraFaqs];
}
`,
);

w("imported-schedules/genoa.json", "[]\n");

console.log("Genoa data generation complete.");
