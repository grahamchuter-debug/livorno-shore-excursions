#!/usr/bin/env node
/**
 * Generates Corfu-specific content data files from structured definitions.
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
  "Corfu cruise ships dock at the New Port (Neo Limani), about 2 km west of Corfu Old Town. Taxis to the Liston take 5–10 minutes; local buses run every 15–20 minutes in season. Build a 60–90 minute buffer before all-aboard — summer traffic on the coastal road back to the port can slow returns from Paleokastritsa or Achilleion.";

const GT = `[
      { method: "Taxi from cruise terminal", detail: "Metered or pre-booked taxi to Old Town, Paleokastritsa or Achilleion.", time: "5–45 min", cost: "€8–55" },
      { method: "Public bus", detail: "Blue buses from port area to Old Town (Line 15) or island routes in season.", time: "10–25 min", cost: "€1.70–2" },
      { method: "Shore excursion", detail: "Coach or minivan with guide, tickets and return timed to all-aboard.", time: "Door-to-door", cost: "Tour price" },
    ]`;

function faq(q, a) {
  return `{ question: "${esc(q)}", answer: "${esc(a)}" }`;
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

const attractions = [
  {
    slug: "paleokastritsa-from-cruise-port",
    name: "Paleokastritsa",
    title: "Paleokastritsa from Corfu Cruise Port",
    seoTitle: "Paleokastritsa from Corfu Cruise Port — Beaches & Monastery Guide",
    meta: "How to reach Paleokastritsa from Corfu cruise port — travel times, beach coves, monastery visit and return-to-ship planning for cruise passengers.",
    tagline: "Turquoise coves and a cliff-top monastery — Corfu's most photographed coastline.",
    overview:
      "Paleokastritsa wraps six emerald bays beneath olive-covered cliffs on Corfu's northwest coast. Most cruise passengers visit the monastery viewpoint and one or two beaches before returning to the ship.",
    body2:
      "The drive from Neo Limani takes 35–45 minutes each way on winding coastal roads. A half-day excursion typically includes La Grotta viewpoint, a swim stop at Agios Spyridon beach or Ambelaki, and 30 minutes at the Theotokos Monastery.",
    body3:
      "Independent travellers need a pre-booked taxi or rental — public buses from Corfu Town exist but eat into a short port call. Boat trips to the Blue Caves often depart from Paleokastritsa harbour when seas allow.",
    distance: "About 25 km / 35–45 min from Neo Limani",
    travel: "35–45 minutes each way by road",
    timeNeeded: "Allow 3–4 hours including travel",
    highlights: ["Theotokos Monastery viewpoint", "La Grotta sea caves outlook", "Swimming at Agios Spyridon or Ambelaki bay"],
    tips: ["Book a morning departure to avoid afternoon port traffic", "Wear water shoes on pebble beaches", "Combine with a boat trip only on 8+ hour calls"],
    faqs: [
      ["Can I visit Paleokastritsa on a standard port day?", "Yes on calls of 7+ usable hours. Allow 35–45 minutes each way plus 2 hours on site."],
      ["Is Paleokastritsa better than the Old Town?", "Different experiences — beaches and scenery versus UNESCO streets. See our comparison guide if you must choose one anchor."],
    ],
    related: ["best-beaches-from-corfu-cruise-port", "blue-caves", "corfu-boat-trips"],
    excursion: "paleokastritsa",
  },
  {
    slug: "corfu-old-town-walking-guide",
    name: "Corfu Old Town",
    title: "Corfu Old Town Walking Guide from Cruise Port",
    seoTitle: "Corfu Old Town Walking Guide — UNESCO Streets from the Cruise Port",
    meta: "Walk Corfu's UNESCO Old Town from the cruise port — Liston, fortresses, Spianada and realistic timings for cruise passengers.",
    tagline: "Venetian alleys, pastel shutters and the Liston — Greece's most elegant port stroll.",
    overview:
      "Corfu Old Town is a UNESCO World Heritage site where Venetian, French and British layers meet Ionian light. From the cruise terminal it is one of the Mediterranean's easiest great-city walks.",
    body2:
      "Enter via Spianada square and the Liston arcades, then weave through Campiello lanes to Saint Spyridon and the Old Fortress esplanade. Most passengers cover the core in 2–3 hours on foot without a vehicle.",
    body3:
      "Cobblestones and occasional steps make comfortable shoes essential. A guided walking tour adds context on the island's unique history — Corfu was never under Ottoman rule, which shaped its architecture and cuisine.",
    distance: "2 km / 5–10 min taxi or 25 min walk from Neo Limani",
    travel: "5–10 minutes by taxi; 20–25 minutes walking",
    timeNeeded: "Allow 2–4 hours on foot",
    highlights: ["Liston promenade and Spianada", "Saint Spyridon church", "Old Fortress views from the esplanade"],
    tips: ["Start at Spianada to avoid uphill surprises", "Visit Spyridon mid-morning before cruise crowds peak", "Save shopping for the return leg toward the port"],
    faqs: [
      ["Can I walk from the cruise port to the Old Town?", "Yes — follow the coastal road toward Garitsa and enter via Spianada. Allow 25 minutes each way; taxis are faster in heat."],
      ["How much walking is involved?", "Expect 3–5 km on cobblestones with moderate slopes in Campiello. Manageable for most adults."],
    ],
    related: ["liston-promenade", "saint-spyridon-church", "venetian-fortresses"],
    excursion: "corfu-old-town",
  },
  {
    slug: "achilleion-palace-guide",
    name: "Achilleion Palace",
    title: "Achilleion Palace Guide from Corfu Cruise Port",
    seoTitle: "Achilleion Palace from Corfu Cruise Port — Empress Sisi's Villa",
    meta: "Visit Achilleion Palace from Corfu cruise port — travel time, terrace views, sculpture gardens and fitting Sisi's villa into your port day.",
    tagline: "Empress Elisabeth's hilltop villa — Achilles statues and views over the Ionian.",
    overview:
      "The Achilleion was built for Empress Elisabeth of Austria and later owned by Kaiser Wilhelm II. Terraced gardens, neoclassical statuary and panoramic views make it Corfu's premier palace visit.",
    body2:
      "The palace sits above the village of Gastouri, 25–30 minutes south of the port. Interior rooms display period furniture and murals; the gardens are the highlight for photographers on a tight schedule.",
    body3:
      "Combine Achilleion with Kanoni and Mouse Island only on longer calls — the route back to the port crosses busy suburban roads. Morning visits beat coach convoys from multiple ships.",
    distance: "About 10 km / 25–30 min from Neo Limani",
    travel: "25–30 minutes each way",
    timeNeeded: "Allow 1.5–2 hours on site plus travel",
    highlights: ["Achilles Dying sculpture terrace", "Palace state rooms and murals", "Views toward Corfu Town and the coast"],
    tips: ["Buy tickets online in peak season", "Pair with Kanoni on 9+ hour calls only", "Limited shade in gardens — bring water in summer"],
    faqs: [
      ["Is Achilleion worth it on a short port call?", "On calls under 7 hours, prioritise Old Town or Paleokastritsa. Achilleion suits 8+ hour days."],
      ["Can I combine Achilleion with the Old Town?", "Yes with a taxi or guided combo — allow 4–5 hours total including both."],
    ],
    related: ["kanoni-mouse-island", "corfu-old-town-walking-guide", "paleokastritsa-from-cruise-port"],
    excursion: "achilleion-palace",
  },
  {
    slug: "kanoni-mouse-island",
    name: "Kanoni & Mouse Island",
    title: "Kanoni & Mouse Island from Corfu Cruise Port",
    seoTitle: "Kanoni & Mouse Island — Corfu Cruise Port Viewpoint Guide",
    meta: "Reach Kanoni and Pontikonisi (Mouse Island) from Corfu cruise port — the classic Corfu postcard view and realistic timings.",
    tagline: "The postcard view — Vlacherna monastery and Mouse Island from Kanoni peninsula.",
    overview:
      "Kanoni offers Corfu's most iconic panorama: Vlacherna monastery linked by a causeway, Mouse Island (Pontikonisi) offshore, and aircraft approaching the runway beside the lagoon.",
    body2:
      "The viewpoint is 15–20 minutes from the port by taxi. Most passengers spend 30–45 minutes photographing, visiting the monastery chapel, and optionally taking the small boat to Mouse Island.",
    body3:
      "Kanoni pairs naturally with Achilleion (10 minutes uphill) or a Corfu Town walk if you taxi to Spianada afterward. It is a light-activity stop ideal for photography lovers and first-time visitors.",
    distance: "About 5 km / 15–20 min from Neo Limani",
    travel: "15–20 minutes each way",
    timeNeeded: "Allow 45–90 minutes",
    highlights: ["Kanoni belvedere panorama", "Vlacherna monastery chapel", "Optional boat to Pontikonisi (Mouse Island)"],
    tips: ["Visit mid-morning for softer light on the lagoon", "Watch for low-flying planes — part of the spectacle", "Combine with Achilleion on the same taxi loop"],
    faqs: [
      ["Can I walk to Kanoni from the port?", "Not practical on a port day — the route crosses busy roads without continuous pavement."],
      ["Is the Mouse Island boat worth it?", "A quick 5-minute crossing if queues are short; skip if your ship has a tight departure."],
    ],
    related: ["achilleion-palace-guide", "corfu-old-town-walking-guide", "best-things-to-do-corfu-cruise-ship"],
    excursion: "corfu-highlights",
  },
  {
    slug: "venetian-fortresses",
    name: "Venetian Fortresses",
    title: "Venetian Fortresses — Old & New Fort from Cruise Port",
    seoTitle: "Corfu Venetian Fortresses from Cruise Port — Old & New Fort Guide",
    meta: "Visit Corfu's Old Fortress and New Fortress from the cruise port — history, views and walking distances for cruise passengers.",
    tagline: "Venetian bastions guarding the Ionian — ramparts above Corfu Town.",
    overview:
      "Corfu's Old Fortress (Palaio Frourio) and New Fortress (Neo Frourio) anchored Venetian defence of the island. The Old Fortress is the easier visit from Spianada; the New Fortress offers broader harbour views with fewer crowds.",
    body2:
      "Enter the Old Fortress from Spianada — allow 45–60 minutes for ramparts, the church of St George, and harbour views. The New Fortress requires a short taxi or uphill walk from the Old Town.",
    body3:
      "Fortress visits involve steps and sun exposure. History lovers often combine the Old Fortress with a Liston stroll on independent days; guided tours handle tickets and pacing.",
    distance: "Old Fortress: edge of Spianada, 2 km from port",
    travel: "5–10 min taxi to Spianada, then on foot",
    timeNeeded: "45–90 minutes per fortress",
    highlights: ["Old Fortress harbour views", "St George church in the Old Fort", "New Fortress panoramic battlements"],
    tips: ["Old Fortress first if walking from Spianada", "Wear sun protection — limited shade on ramparts", "Check opening hours — shorter in winter"],
    faqs: [
      ["Which fortress should I choose on a short call?", "The Old Fortress — it sits beside the Old Town and needs no extra transfer."],
      ["Are the fortresses suitable for limited mobility?", "Partially — lower levels of the Old Fort are manageable; upper ramparts involve steps."],
    ],
    related: ["corfu-old-town-walking-guide", "liston-promenade", "corfu-for-history-lovers"],
    excursion: "corfu-old-town",
  },
  {
    slug: "liston-promenade",
    name: "Liston Promenade",
    title: "Liston Promenade — Corfu Old Town from Cruise Port",
    seoTitle: "Liston Promenade Corfu — Cruise Passenger Guide",
    meta: "Explore the Liston arcades and Spianada from Corfu cruise port — cafés, cricket pitch history and the heart of Old Town.",
    tagline: "Arcaded cafés facing Spianada — Corfu's social heart since Venetian times.",
    overview:
      "The Liston copies St Mark's Square arcades and faces Spianada — one of Europe's largest town squares. It is the natural starting point for any Old Town walk from the cruise port.",
    body2:
      "Pause for a coffee under the arches, then branch into Campiello lanes or climb to the Old Fortress. The square hosted cricket under British rule — a detail that surprises many first-time visitors.",
    body3:
      "Liston cafés charge premium prices for the setting; locals often drink standing at bars in side streets. Allow 30–60 minutes here before deeper exploration.",
    distance: "2 km from Neo Limani",
    travel: "5–10 min taxi or 25 min walk",
    timeNeeded: "30–60 minutes as a stop; longer with Old Town",
    highlights: ["Venetian arcades and café culture", "Spianada square and bandstand", "Gateway to Campiello alleys"],
    tips: ["Morning coffee before cruise crowds arrive", "Walk the full Spianada perimeter for fortress views", "Try kumquat liqueur or ginger beer — Corfiot specialties"],
    faqs: [
      ["Is the Liston walkable from the ship?", "Yes — follow the waterfront toward Garitsa; the Liston faces Spianada on the Old Town edge."],
      ["When is the Liston busiest?", "Midday when multiple ships are in port — go early or late afternoon if your departure allows."],
    ],
    related: ["corfu-old-town-walking-guide", "saint-spyridon-church", "corfu-food-guide"],
    excursion: "corfu-old-town",
  },
  {
    slug: "saint-spyridon-church",
    name: "Saint Spyridon Church",
    title: "Saint Spyridon Church — Corfu Old Town from Cruise Port",
    seoTitle: "Saint Spyridon Church Corfu — Cruise Port Visitor Guide",
    meta: "Visit Saint Spyridon church from Corfu cruise port — patron saint of the island, relic processions and dress code for cruise passengers.",
    tagline: "Corfu's patron saint — red-domed church in the heart of Campiello.",
    overview:
      "Saint Spyridon is Corfu's beloved patron. His relics rest in a silver sarcophagus inside this 16th-century church whose bell tower rises above Campiello's lanes.",
    body2:
      "The church is a 5-minute walk from the Liston. Modest dress is required — cover shoulders and knees. Photography inside is restricted during services; visit between morning masses for a quieter experience.",
    body3:
      "Four times a year the relics process through the Old Town — if your call coincides, expect festive crowds and road closures near Spianada. Otherwise allow 20–30 minutes for a respectful visit.",
    distance: "In Campiello, 2 km from port",
    travel: "Part of Old Town walk — 5 min from Liston",
    timeNeeded: "20–40 minutes",
    highlights: ["Silver reliquary of Saint Spyridon", "Ceiling frescoes and Venetian chandeliers", "Campiello lane atmosphere en route"],
    tips: ["Dress modestly — shawl available at door if needed", "Remove hats inside", "Combine with Liston and Old Fortress in one walk"],
    faqs: [
      ["Can I visit Saint Spyridon on a port day?", "Yes — it is central to any Old Town walk and needs no separate transfer."],
      ["Is there an entrance fee?", "No — donations welcome. Respect active worshippers."],
    ],
    related: ["corfu-old-town-walking-guide", "liston-promenade", "corfu-for-history-lovers"],
    excursion: "corfu-old-town",
  },
  {
    slug: "best-beaches-from-corfu-cruise-port",
    name: "Corfu Beaches",
    title: "Best Beaches from Corfu Cruise Port",
    seoTitle: "Best Corfu Beaches from Cruise Port — Paleokastritsa & More",
    meta: "Best beaches near Corfu cruise port for cruise passengers — Paleokastritsa, Glyfada, Barbati and realistic half-day beach planning.",
    tagline: "Turquoise Ionian coves — where cruise passengers can swim on a port day.",
    overview:
      "Corfu's beaches range from organised resort sand to wild pebble coves. On a port day, Paleokastritsa is the headline choice; Glyfada and Barbati work for passengers who want sand closer to town.",
    body2:
      "Paleokastritsa offers the clearest water but needs 35–45 minutes each way. Glyfada is 20 minutes south with sunbeds and tavernas — easier for families wanting a simple beach day.",
    body3:
      "Beach days trade cultural sightseeing for relaxation. On calls under 8 hours, pick one cove and stay — hopping beaches burns time on winding roads.",
    distance: "Paleokastritsa 25 km; Glyfada 12 km from port",
    travel: "20–45 minutes depending on beach",
    timeNeeded: "Half day minimum for any beach",
    highlights: ["Paleokastritsa multi-bay scenery", "Glyfada organised sand beach", "Barbati pebble cove views"],
    tips: ["Rent sunbeds at Glyfada for comfort", "Pebbles at Paleokastritsa — pack water shoes", "Confirm ship departure before a late swim"],
    faqs: [
      ["Can I swim on a Corfu port day?", "Yes — allow 2+ hours on the beach plus 40–90 minutes total driving."],
      ["Which beach is closest to the port?", "Glyfada and Kontokali are nearest; Paleokastritsa is worth the drive for scenery."],
    ],
    related: ["paleokastritsa-from-cruise-port", "corfu-boat-trips", "corfu-for-beach-lovers"],
    excursion: "beach-day",
  },
  {
    slug: "corfu-food-guide",
    name: "Corfu Food",
    title: "Corfu Food Guide for Cruise Passengers",
    seoTitle: "Corfu Food Guide — What to Eat on a Cruise Port Day",
    meta: "Corfu food guide for cruise passengers — pastitsada, sofrito, kumquat liqueur, where to eat near Old Town and on excursions.",
    tagline: "Ionians flavours — pastitsada, sofrito and kumquat traditions unlike anywhere in Greece.",
    overview:
      "Corfiot cuisine blends Venetian, French and Greek influences. On a port day, taste pastitsada (spiced beef pasta), sofrito (garlic veal), bourdeto (fish stew) and local kumquat products.",
    body2:
      "Old Town tavernas near Campiello serve classics at lunch; the Liston is better for coffee and sweets. Food tours combine market visits with tastings when you want structure and timing certainty.",
    body3:
      "Allow 60–90 minutes for sit-down lunch — Greek dining is unhurried. Excursions with village taverna stops suit passengers combining food with Paleokastritsa or Achilleion.",
    distance: "Old Town restaurants 2 km from port",
    travel: "Part of Old Town visit",
    timeNeeded: "60–90 minutes for lunch; half day for food tour",
    highlights: ["Pastitsada and sofrito classics", "Kumquat spoon sweets and liqueur", "Ginger beer — British-era Corfiot habit"],
    tips: ["Book lunch tavernas on multi-ship days", "Try kolombina kumquat sweets as gifts", "Share plates — Corfiot portions are generous"],
    faqs: [
      ["What should I eat on a Corfu port day?", "Pastitsada or sofrito at an Old Town taverna, plus kumquat liqueur to take home."],
      ["Are food tours worth it on a cruise schedule?", "Yes for first-timers — they handle timing and introduce dishes you might not order alone."],
    ],
    related: ["corfu-wine-guide", "corfu-olive-oil-experiences", "corfu-for-food-lovers"],
    excursion: "food-and-wine",
  },
  {
    slug: "corfu-olive-oil-experiences",
    name: "Corfu Olive Oil",
    title: "Corfu Olive Oil Experiences from Cruise Port",
    seoTitle: "Corfu Olive Oil Tasting from Cruise Port — Lianolia Variety",
    meta: "Corfu olive oil experiences for cruise passengers — Lianolia variety, village tastings and combining with a port-day excursion.",
    tagline: "Centuries of Lianolia olives — village tastings beyond the cruise terminal.",
    overview:
      "Corfu's Lianolia olive is distinct from mainland Greek varieties. Village mill visits and tasting sessions appear on food-focused excursions when your ship allows a half-day inland.",
    body2:
      "Standalone olive oil visits need 3–4 hours including transfer to villages like Vatos or inland Corfu. Most cruise passengers experience oil through combined food-and-culture tours rather than a dedicated stop.",
    body3:
      "Buy small bottles in Old Town shops if time is tight — look for PDO Corfu olive oil labels. Tastings pair naturally with wine on longer gourmet excursions.",
    distance: "Village mills 15–30 km inland",
    travel: "30–50 minutes to village experiences",
    timeNeeded: "2–3 hours for dedicated tasting",
    highlights: ["Lianolia variety flavour profile", "Traditional stone mill visits", "PDO Corfu olive oil shopping"],
    tips: ["Combine with wine tasting on 9+ hour calls", "Pack oil in checked luggage — carry-on limits apply", "Book combined food tours for best timing"],
    faqs: [
      ["Can I do an olive oil tasting on a port day?", "Yes on longer calls via a food excursion — rarely as a standalone for short calls."],
      ["What makes Corfu olive oil different?", "The Lianolia cultivar and Ionian climate produce greener, peppery oil unlike southern Greek styles."],
    ],
    related: ["corfu-food-guide", "corfu-wine-guide", "food-and-wine"],
    excursion: "food-and-wine",
  },
  {
    slug: "corfu-wine-guide",
    name: "Corfu Wine",
    title: "Corfu Wine Guide for Cruise Passengers",
    seoTitle: "Corfu Wine Guide — Tasting on a Cruise Port Day",
    meta: "Corfu wine guide for cruise passengers — Kakotrýgias, village wineries and pairing wine with a shore excursion.",
    tagline: "Village cellars and indigenous grapes — wine tasting fitted to your port hours.",
    overview:
      "Corfu's wine scene is intimate — small producers, kakotrýgias sweet wine traditions, and increasingly quality dry whites from local grapes. Tastings usually happen on food-and-wine excursions.",
    body2:
      "Dedicated winery visits need inland transfers of 30+ minutes. On standard 8-hour calls, a single tasting lunch at a village taverna is more realistic than multiple cellar stops.",
    body3:
      "Old Town wine bars offer quick introductions if you are walking independently. Guided tours handle reservations and return timing — important when tastings run long.",
    distance: "Wineries 15–25 km from port",
    travel: "30–45 minutes to village producers",
    timeNeeded: "90 minutes minimum for tasting with meal",
    highlights: ["Kakotrýgias sweet wine tradition", "Local white varieties with seafood", "Village taverna pairing lunches"],
    tips: ["Eat before multi-pour tastings", "Choose tours with explicit return-to-ship guarantee", "Buy bottles at duty-free limits for your next port"],
    faqs: [
      ["Is wine tasting realistic on a Corfu port day?", "Yes on 8+ hour calls via a food-and-wine excursion — not alongside Paleokastritsa and Old Town."],
      ["Can I buy Corfu wine near the port?", "Old Town shops stock local bottles; wider selection at specialist stores on Alexandras Avenue."],
    ],
    related: ["corfu-food-guide", "corfu-olive-oil-experiences", "food-and-wine"],
    excursion: "food-and-wine",
  },
  {
    slug: "best-things-to-do-corfu-cruise-ship",
    name: "Best Things to Do",
    title: "Best Things to Do in Corfu from a Cruise Ship",
    seoTitle: "Best Things to Do in Corfu from a Cruise Ship — Port Day Guide",
    meta: "Best things to do in Corfu from a cruise ship — Paleokastritsa, Old Town, Achilleion, beaches and boat trips ranked for port days.",
    tagline: "One port day, many Corfus — how to choose what fits your hours ashore.",
    overview:
      "Corfu rewards almost every interest — UNESCO Old Town, Paleokastritsa's coves, Achilleion's terraces, boat caves and village food. Your ship's hours determine how many anchors you can combine.",
    body2:
      "Standard 8–10 hour calls suit one major excursion plus a Old Town walk, or a focused half-day at Paleokastritsa. Short calls should prioritise Corfu Town on foot — it is uniquely close to the terminal.",
    body3:
      "Use our cruise planner to match interests to realistic itineraries. First-timers often choose a highlights tour; repeat visitors head to beaches or village food routes.",
    distance: "Varies — Old Town 2 km; Paleokastritsa 25 km",
    travel: "5–45 minutes depending on choice",
    timeNeeded: "Plan one anchor per half day",
    highlights: ["Old Town UNESCO walk", "Paleokastritsa coastline", "Achilleion and Kanoni views"],
    tips: ["Check your exact arrival and departure times", "Book excursions before sailing in peak season", "Keep 60–90 minutes return buffer"],
    faqs: [
      ["What is the number one thing in Corfu on a cruise?", "Corfu Old Town for culture; Paleokastritsa for scenery — most first-timers want one of these."],
      ["Can I see everything in one day?", "No — choose two anchors maximum on a standard call."],
    ],
    related: ["one-day-in-corfu-cruise-ship", "corfu-for-first-time-visitors", "paleokastritsa-from-cruise-port"],
    excursion: "corfu-highlights",
  },
  {
    slug: "one-day-in-corfu-cruise-ship",
    name: "One Day in Corfu",
    title: "One Day in Corfu from a Cruise Ship",
    seoTitle: "One Day in Corfu from a Cruise Ship — Sample Itineraries",
    meta: "One day in Corfu from a cruise ship — morning-to-all-aboard itineraries for highlights, beaches, food and independent walks.",
    tagline: "Hour-by-hour Corfu — realistic schedules from gangway to all-aboard.",
    overview:
      "A Corfu port day typically gives 7–10 usable hours. This guide maps sample timelines for highlights, beach, food and independent Old Town days with return-to-ship buffers built in.",
    body2:
      "Highlights combo: depart 08:30, Paleokastritsa and monastery by 10:00, Achilleion late morning, Old Town lunch, Spianada by 15:00, back to ship by 16:30 on a 17:30 sailing.",
    body3:
      "Independent walkers can skip coaches — taxi to Spianada, walk Liston, Spyridon, Old Fortress, lunch in Campiello, return by 16:00. Adjust every time against your ship's actual schedule.",
    distance: "Full island highlights up to 50 km round trip",
    travel: "Varies by itinerary",
    timeNeeded: "Full port day",
    highlights: ["Sample highlights timeline", "Independent Old Town schedule", "Beach-half-day option"],
    tips: ["Subtract 30 minutes for each additional ship in port", "Confirm excursion meeting time the night before", "Save Kanoni for light calls — quick photo stop"],
    faqs: [
      ["How many hours do I have in Corfu?", "Subtract 60–90 minutes buffer from departure minus arrival — that is your planning window."],
      ["What if we arrive at noon?", "Focus on Old Town and Kanoni — skip Paleokastritsa."],
    ],
    related: ["best-things-to-do-corfu-cruise-ship", "corfu-old-town-walking-guide", "corfu-highlights"],
    excursion: "corfu-highlights",
  },
  {
    slug: "corfu-boat-trips",
    name: "Corfu Boat Trips",
    title: "Corfu Boat Trips from Cruise Port",
    seoTitle: "Corfu Boat Trips from Cruise Port — Caves & Coast",
    meta: "Corfu boat trips for cruise passengers — Paleokastritsa departures, coastal cruises and combining with your port schedule.",
    tagline: "Coastal cruises and cave routes — see Corfu from the water.",
    overview:
      "Boat trips reveal Corfu's limestone coast, hidden coves and sea caves. Most depart from Paleokastritsa or Corfu Town harbour — excursion operators align departures with cruise schedules.",
    body2:
      "Standard trips last 45–90 minutes, circling bays and entering caves when sea conditions allow. Combine with a Paleokastritsa coach visit on 8+ hour calls — not with a full Old Town day.",
    body3:
      "Motion-sensitive passengers should check sea state — the Ionian can be choppy outside sheltered bays. Operators cancel cave entries in rough weather but still run coastal routes.",
    distance: "Paleokastritsa harbour 25 km from port",
    travel: "35–45 min to departure point",
    timeNeeded: "2–3 hours including transfer and trip",
    highlights: ["Paleokastritsa bay circuit", "Sea cave entries when calm", "Snorkel stops on longer trips"],
    tips: ["Book cave boats for morning calmer seas", "Bring a dry bag for electronics", "Wear swimwear under clothes for quick dips"],
    faqs: [
      ["Are boat trips safe on a port day?", "Yes with reputable operators who track ship departure — confirm return time in writing."],
      ["Can I do boat trips without Paleokastritsa?", "Harbour tours exist from Corfu Town but Paleokastritsa offers the best cave access."],
    ],
    related: ["blue-caves", "paleokastritsa-from-cruise-port", "boat-trips-blue-caves"],
    excursion: "boat-trips-blue-caves",
  },
  {
    slug: "blue-caves",
    name: "Blue Caves",
    title: "Blue Caves from Corfu Cruise Port",
    seoTitle: "Blue Caves Corfu — Cruise Passenger Boat Guide",
    meta: "Visit the Blue Caves near Paleokastritsa from Corfu cruise port — boat access, sea conditions and timing for cruise passengers.",
    tagline: "Luminous sea caves — best reached by boat from Paleokastritsa.",
    overview:
      "Corfu's Blue Caves (often grouped with Paleokastritsa's coastal formations) glow aquamarine when sunlight filters through submerged openings. Access is by small boat only.",
    body2:
      "Trips run from Paleokastritsa harbour in calm conditions — typically April through October. Allow 45–60 minutes on the water plus 35–45 minutes each way from the cruise port.",
    body3:
      "Do not confuse Corfu's caves with Zakynthos Blue Caves — they are different destinations. Corfu's are combined with Paleokastritsa on most shore excursions labelled 'caves and beaches'.",
    distance: "Paleokastritsa area, 25 km from port",
    travel: "35–45 min plus boat trip",
    timeNeeded: "3–4 hours total",
    highlights: ["Aquamarine cave interiors", "Coastal rock formations", "Combined beach and cave excursions"],
    tips: ["Morning departures for calmer seas", "Protect camera gear from spray", "Skip if prone to seasickness on choppy days"],
    faqs: [
      ["Can I visit Blue Caves on every port day?", "Only when seas permit — operators decide morning of; have a backup plan."],
      ["Are the Blue Caves the same as Paxos?", "No — Corfu's caves are near Paleokastritsa; Paxos is a separate day trip, too long for most port calls."],
    ],
    related: ["corfu-boat-trips", "paleokastritsa-from-cruise-port", "boat-trips-blue-caves"],
    excursion: "boat-trips-blue-caves",
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

// Continue in part 2 - experiences, excursions, comparisons, planner, etc.
console.log("Part 1 complete — run part 2");
