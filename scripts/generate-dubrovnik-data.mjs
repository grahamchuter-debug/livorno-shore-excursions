#!/usr/bin/env node
/**
 * Generates Dubrovnik-specific content data files from structured definitions.
 * Run: node scripts/generate-dubrovnik-data.mjs
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
  "Cruise ships dock at Gruž (Gruz) commercial cruise terminal, about 2.5 km east of Dubrovnik Old Town's Pile Gate. Taxis to the walls take 10–15 minutes; port shuttle buses and local services run in season; a waterfront walk takes 25–35 minutes. Build a 60–90 minute buffer before all-aboard — summer queues at the city walls and cable car can slow your return to the terminal.";

const GT = `[
      { method: "Taxi from Gruž terminal", detail: "Metered or pre-booked taxi to Pile Gate, cable car station or harbour.", time: "10–15 min", cost: "€12–18" },
      { method: "Port shuttle / local bus", detail: "Shuttle buses to Old Town in peak season; Line 1A/1B toward Pile or Lapad.", time: "15–25 min", cost: "€1.73–2" },
      { method: "Shore excursion", detail: "Coach or walking tour with guide, wall tickets and return timed to all-aboard.", time: "Door-to-door", cost: "Tour price" },
    ]`;

const PORT_LOGISTICS =
  "Ships dock at Gruž (Gruz) commercial cruise terminal, 2.5 km from Pile Gate. Allow 10–15 minutes by taxi to the Old Town walls or 25–35 minutes on foot along the waterfront. Confirm your all-aboard time and keep a 60–90 minute buffer — summer queues at the city walls ticket office and Mount Srđ cable car can add 20–30 minutes to your return.";

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
    seoTitle: "${esc(cfg.optionA)} vs ${esc(cfg.optionB)} — Dubrovnik Cruise Passengers",
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

// ─── HIGHLIGHTS (15 AttractionPage guides) ───────────────────────────────────

const attractions = [
  {
    slug: "dubrovnik-old-town-guide",
    name: "Dubrovnik Old Town",
    title: "Dubrovnik Old Town Guide from Cruise Port",
    seoTitle: "Dubrovnik Old Town Guide — UNESCO Walled City from Gruž Port",
    meta: "Explore Dubrovnik's UNESCO Old Town from Gruž cruise port — Pile Gate, Stradun, marble streets and realistic timings for cruise passengers.",
    tagline: "Marble Stradun, baroque facades and living history — the Adriatic's most complete walled city.",
    overview:
      "Dubrovnik Old Town is a UNESCO World Heritage site enclosed by medieval walls that survived the 1667 earthquake and the 1990s siege. From Gruž port it is the essential anchor for almost every Dubrovnik port day.",
    body2:
      "Enter via Pile Gate (western) or Ploče Gate (eastern). The Stradun — the main marble promenade — runs 300 metres between the gates; side lanes climb to churches, monasteries and hidden courtyards. Most passengers cover the core in 2–3 hours before optional wall walks or cable car ascents.",
    body3:
      "Summer crowds peak 11:00–15:00 when multiple ships are in port. Morning arrivals should walk Old Town first, then walls or cable car. Evening departures allow a late-afternoon stroll when day-trippers thin.",
    distance: "2.5 km / 10–15 min taxi or 25–35 min walk from Gruž",
    travel: "10–15 minutes by taxi; 25–35 minutes walking",
    timeNeeded: "Allow 2–4 hours on foot",
    highlights: ["Stradun marble promenade", "Onofrio's Fountain at Pile Gate", "Franciscan Monastery pharmacy museum", "Rector's Palace and Sponza"],
    tips: ["Start at Pile Gate before wall queues build", "Carry water — shade is limited on Stradun", "Book wall tickets online in peak season"],
    faqs: [
      ["Can I walk from Gruž port to Old Town?", "Yes — follow the waterfront promenade toward Lapad and Pile Gate. Allow 25–35 minutes each way; taxis are faster in heat."],
      ["How much walking is involved?", "Expect 3–5 km on polished marble and cobbles with occasional steps in side lanes."],
    ],
    related: ["stradun-walking-guide", "walking-city-walls", "one-day-in-dubrovnik"],
    excursion: "old-town-walking-tour",
  },
  {
    slug: "walking-city-walls",
    name: "Dubrovnik City Walls",
    title: "Walking Dubrovnik City Walls from Cruise Port",
    seoTitle: "Dubrovnik City Walls Walk — Cruise Port Guide & Timings",
    meta: "Walk Dubrovnik's medieval city walls from Gruž cruise port — ticket tips, 2 km circuit, views and return-to-ship planning for cruise passengers.",
    tagline: "Two kilometres of ramparts — the definitive Dubrovnik experience above terracotta roofs.",
    overview:
      "Dubrovnik's city walls form a complete circuit around the Old Town — roughly 2 km with minimal shade and spectacular Adriatic views. For many cruise passengers this is the single must-do sight after stepping ashore at Gruž.",
    body2:
      "The full circuit takes 60–90 minutes at a moderate pace with photo stops. Enter at Pile Gate (near Onofrio's Fountain) or Ploče Gate; one-way sections occasionally apply in peak season. Ticket queues at Pile can exceed 30 minutes when three ships are in port — buy online or join a guided wall tour with skip-the-line access.",
    body3:
      "The walls involve steps, uneven stone and full sun exposure. Not suitable for severe mobility limitations. Combine with Old Town walking the same half-day — walls first while legs are fresh, then Stradun lunch below.",
    distance: "2.5 km from Gruž to Pile Gate entrance",
    travel: "10–15 min taxi, then wall circuit on foot",
    timeNeeded: "Allow 1.5–2.5 hours including ticket queue",
    highlights: ["Minčeta Tower panoramic outlook", "Fort Bokar and Lovrijenac views", "Harbour and Adriatic panoramas", "Terracotta roofscape over Stradun"],
    tips: ["Walk counter-clockwise from Pile for classic photo angles", "No shade — hat and sunscreen essential", "Avoid midday starts in July and August"],
    faqs: [
      ["Can I walk the walls on a short port call?", "Yes if you have 4+ usable hours — allow 90 minutes on the circuit plus transfer."],
      ["Are the walls included on shore excursions?", "Many walking tours include tickets and timed entry — worth it when queues are long."],
    ],
    related: ["dubrovnik-old-town-guide", "fort-lovrijenac", "best-dubrovnik-viewpoints"],
    excursion: "city-walls-walking-tour",
  },
  {
    slug: "mount-srd-cable-car-guide",
    name: "Mount Srđ Cable Car",
    title: "Mount Srđ Cable Car Guide from Cruise Port",
    seoTitle: "Mount Srđ Cable Car from Dubrovnik Cruise Port — Panoramic Views",
    meta: "Ride the Mount Srđ cable car from Gruž cruise port — Dubrovnik panoramas, Imperial Fortress and realistic port-day timing.",
    tagline: "400 metres above the Old Town — the Adriatic's most dramatic city panorama.",
    overview:
      "The Dubrovnik cable car ascends Mount Srđ in four minutes, delivering bird's-eye views over the walled city, Lokrum Island and the Elafiti archipelago. It is the fastest way to grasp Dubrovnik's geography on a port day.",
    body2:
      "The lower station sits above the Old Town — taxi to Pile Gate then a short uphill walk, or a dedicated excursion with transfers from Gruž. At the summit, walk the Imperial Fortress (Homeland War Museum optional), the Panorama Restaurant terrace and the white stone cross viewpoint.",
    body3:
      "Cable car queues rival the city walls in peak season — 30–45 minute waits are common mid-morning. Book timed tickets or visit late afternoon if your ship departs after 18:00. Operations suspend in high winds.",
    distance: "2.5 km to Pile area, then 5 min walk to station",
    travel: "10–15 min taxi plus 5 min walk to station",
    timeNeeded: "Allow 1.5–2 hours including queues",
    highlights: ["Summit panorama over Old Town and islands", "Imperial Fortress and cross viewpoint", "Homeland War Museum (optional)", "Sunset views on late departures"],
    tips: ["Check wind closures on the cable car website", "Combine with walls only on 8+ hour calls", "Bring a layer — summit is breezy even in summer"],
    faqs: [
      ["Is the cable car worth it on a cruise port day?", "Yes for first-timers who want the iconic aerial photo — pair with Old Town, not a full wall walk on tight schedules."],
      ["Cable car or city walls?", "Walls immerse you in medieval stone; cable car delivers scale and geography. See our comparison if you must choose one."],
    ],
    related: ["best-dubrovnik-viewpoints", "walking-city-walls", "city-walls-vs-cable-car"],
    excursion: "cable-car-panorama",
  },
  {
    slug: "best-dubrovnik-viewpoints",
    name: "Best Dubrovnik Viewpoints",
    title: "Best Dubrovnik Viewpoints from Cruise Port",
    seoTitle: "Best Dubrovnik Viewpoints — Walls, Srđ & Photo Spots for Cruise Passengers",
    meta: "Best Dubrovnik viewpoints for cruise passengers — city walls, Mount Srđ cable car, Lovrijenac and hidden photo spots from Gruž port.",
    tagline: "Walls, summit and fortress — where to photograph Dubrovnik on a port day.",
    overview:
      "Dubrovnik is one of Europe's most photogenic cities. Cruise passengers with limited hours should prioritise three tiers: rampart views on the city walls, the Mount Srđ cable car panorama, and Fort Lovrijenac across the harbour.",
    body2:
      "City walls deliver close-up roofscapes and Adriatic blues — best light is morning from the Minceta section. Mount Srđ shows the entire walled ellipse and island chain — essential context shots. Lovrijenac (the Red Keep) frames the Old Town from the western harbour approach.",
    body3:
      "Secondary spots include the Jesuit Stairs (Game of Thrones fame), Buža Bar cliff terraces and Ploče Gate harbour outlook. Photography-focused passengers should book morning wall or cable car slots before Stradun crowds peak.",
    distance: "All viewpoints within Old Town or 5 min taxi from Pile",
    travel: "10–15 min taxi from Gruž to Pile Gate area",
    timeNeeded: "1–3 hours depending on how many spots you visit",
    highlights: ["Minčeta Tower wall outlook", "Mount Srđ cable car summit", "Fort Lovrijenac harbour view", "Buža Bar cliff terrace"],
    tips: ["Shoot walls in morning, Srđ in late afternoon if possible", "Polarising filter helps with Adriatic glare", "Guided photo tours know crowd-free angles"],
    faqs: [
      ["Best single viewpoint on a tight schedule?", "Mount Srđ cable car — maximum impact in minimum time if queues cooperate."],
      ["Can I photograph Dubrovnik without wall tickets?", "Yes — Lovrijenac exterior, harbour walk and Buža Bar offer free angles."],
    ],
    related: ["mount-srd-cable-car-guide", "walking-city-walls", "fort-lovrijenac"],
    excursion: "cable-car-panorama",
  },
  {
    slug: "lokrum-island-guide",
    name: "Lokrum Island",
    title: "Lokrum Island Guide from Cruise Port",
    seoTitle: "Lokrum Island from Dubrovnik Cruise Port — Boat, Beach & Benedictine Abbey",
    meta: "Visit Lokrum Island from Gruž cruise port — 10-minute boat from Old Town harbour, swimming, peacocks and return timing for cruise passengers.",
    tagline: "Ten minutes by boat — botanical gardens, hidden coves and peacocks offshore.",
    overview:
      "Lokrum Island sits 600 metres from Dubrovnik's Old Town harbour — a UNESCO-protected nature reserve with Benedictine ruins, swimming rocks and tame peacocks. It is the classic half-day escape when you want Adriatic water without a long coastal drive.",
    body2:
      "Boats depart from the Old Town harbour (near Ploče Gate) every 15–30 minutes in season — buy tickets at the kiosk, not at Gruž. Allow 10–15 minutes taxi from the cruise terminal to the harbour, then 15 minutes on the boat. Most passengers spend 2–3 hours swimming, walking botanical paths and climbing to Fort Royal for views back to the walls.",
    body3:
      "There are no cars, hotels or overnight stays on Lokrum — last boats return before sunset. Combine Lokrum with a morning Old Town walk only on 8+ hour calls; do not attempt walls, cable car and Lokrum on one standard port day.",
    distance: "2.5 km to harbour, then 600 m boat crossing",
    travel: "10–15 min taxi to harbour + 15 min boat",
    timeNeeded: "Allow 3–4 hours including boat and island time",
    highlights: ["Benedictine monastery ruins", "Fort Royal viewpoint over Dubrovnik", "Swimming at the Dead Sea salt lake", "Botanical garden and peacocks"],
    tips: ["Take the first boat after Old Town arrival to maximise island time", "Wear water shoes for rocky swim entries", "Bring cash for boat tickets and café"],
    faqs: [
      ["Can I visit Lokrum on a standard port day?", "Yes on 7+ usable hours — allow 3–4 hours total including harbour transfer."],
      ["Lokrum or Old Town walls?", "Walls for first-timers; Lokrum when you want swimming and nature. See our comparison guide."],
    ],
    related: ["dubrovnik-beaches", "dubrovnik-boat-trips", "lokrum-island-vs-old-town"],
    excursion: "lokrum-island-excursion",
  },
  {
    slug: "fort-lovrijenac",
    name: "Fort Lovrijenac",
    title: "Fort Lovrijenac Guide from Cruise Port",
    seoTitle: "Fort Lovrijenac Dubrovnik — Red Keep & Harbour Fortress from Cruise Port",
    meta: "Visit Fort Lovrijenac from Gruž cruise port — Game of Thrones Red Keep, harbour views and ticket tips for cruise passengers.",
    tagline: "The Red Keep rises from a 37-metre cliff — Dubrovnik's western guardian and GoT icon.",
    overview:
      "Fort Lovrijenac guards Dubrovnik's western harbour entrance — a standalone fortress predating much of the city walls. Game of Thrones fans know it as the Red Keep; historians value its inscription above the gate: 'Freedom is not sold for all the gold in the world.'",
    body2:
      "The fort is a 5-minute walk from Pile Gate along the harbour path — separate ticket from the city walls (though combo tickets exist). Interior rooms are sparse; the draw is harbour views back toward the walled city and the atmospheric stone amphitheatre used for Shakespeare performances in summer.",
    body3:
      "Game of Thrones tours spend 20–30 minutes here with filming context. Independent visitors need 45–60 minutes including the walk from Pile. Combine with city walls (western section) or a harbour stroll — not with Lokrum unless your call exceeds 9 hours.",
    distance: "2.5 km from Gruž to Pile, then 5 min walk",
    travel: "10–15 min taxi to Pile Gate area",
    timeNeeded: "Allow 45–90 minutes",
    highlights: ["Harbour panorama toward Old Town walls", "Game of Thrones Red Keep filming location", "Cliff-top fortress architecture", "Shakespeare festival amphitheatre"],
    tips: ["Combo wall + Lovrijenac ticket saves money if doing both", "Morning light on the fort facade from the harbour path", "Wear grippy shoes — polished stone near the cliff edge"],
    faqs: [
      ["Is Lovrijenac included on city walls ticket?", "Sometimes via combo pass — check current ticketing; separate entry also available."],
      ["Worth it without Game of Thrones interest?", "Yes for harbour photographers — one of the best free exterior angles is from the path below."],
    ],
    related: ["dubrovnik-game-of-thrones-guide", "walking-city-walls", "dubrovnik-old-town-guide"],
    excursion: "game-of-thrones-tour",
  },
  {
    slug: "stradun-walking-guide",
    name: "Stradun Walking Guide",
    title: "Stradun Walking Guide — Dubrovnik's Main Street from Cruise Port",
    seoTitle: "Stradun Walking Guide Dubrovnik — Marble Promenade from Cruise Port",
    meta: "Walk the Stradun from Gruž cruise port — Dubrovnik's marble main street, side lanes, cafés and realistic cruise passenger timings.",
    tagline: "Polished marble underfoot — the spine of the walled city from Pile to Ploče.",
    overview:
      "The Stradun (Placa) is Dubrovnik's 300-metre marble promenade connecting Pile Gate to Ploče Gate. Every Dubrovnik port day passes through it — this guide helps you use the Stradun as orientation, not just a crowded corridor.",
    body2:
      "Walk east from Pile past Onofrio's Fountain and the Franciscan Monastery (Europe's oldest pharmacy still operating) toward the Bell Tower and Orlando's Column at Luža Square. Side lanes north and south hide churches, wine bars and residential courtyards tourists miss when they stay on the main axis.",
    body3:
      "Stradun cafés charge premium prices for the setting — locals drink in side-street konobas. Allow 45–60 minutes for the main axis plus one side-lane detour; longer if shopping for Croatian olive oil, lavender and filigree jewellery.",
    distance: "Stradun runs through Old Town centre — 2.5 km from Gruž to Pile",
    travel: "10–15 min taxi or 25–35 min walk to Pile Gate",
    timeNeeded: "45 minutes to 2 hours",
    highlights: ["Onofrio's Fountain at Pile Gate", "Franciscan Monastery pharmacy", "Orlando's Column and Luža Square", "Side lanes to St Blaise Church"],
    tips: ["Explore side lanes — the Stradun itself is busiest midday", "St Blaise Church is free and air-conditioned", "Save shopping for the return walk toward Pile"],
    faqs: [
      ["Is the Stradun the same as Old Town?", "It is the main street — Old Town includes walls, harbour and dozens of side lanes beyond the Stradun."],
      ["When is the Stradun least crowded?", "Before 10:00 and after 16:00 — midday crush when multiple ships are in port."],
    ],
    related: ["dubrovnik-old-town-guide", "dubrovnik-food-guide", "one-day-in-dubrovnik"],
    excursion: "old-town-walking-tour",
  },
  {
    slug: "dubrovnik-food-guide",
    name: "Dubrovnik Food",
    title: "Dubrovnik Food Guide for Cruise Passengers",
    seoTitle: "Dubrovnik Food Guide — What to Eat on a Cruise Port Day",
    meta: "Dubrovnik food guide for cruise passengers — seafood, peka, oysters from Ston, wine and where to eat near Old Town from Gruž port.",
    tagline: "Adriatic seafood, slow-roasted peka and Pelješac wine — Dalmatian flavours in the walled city.",
    overview:
      "Dubrovnik's cuisine centres on the Adriatic — fresh fish, shellfish, octopus salad and peka (meat or octopus under a bell lid with embers). On a port day, lunch in a Stradun-side konoba or harbour taverna is the classic move.",
    body2:
      "Signature dishes include black risotto (cuttlefish ink), brudet fish stew, grilled orada and shellfish from nearby Ston — famous for oysters. Pelješac peninsula wines (Plavac Mali reds, Pošip whites) pair naturally with seafood lunches.",
    body3:
      "Allow 60–90 minutes for sit-down lunch — Dalmatian dining is unhurried. Food-and-wine excursions add market visits and wine tastings with cruise-timed returns. Do not pair a full food tour with walls, cable car and Lokrum on one day.",
    distance: "Old Town restaurants 2.5 km from Gruž",
    travel: "Part of Old Town visit — 10–15 min taxi to Pile",
    timeNeeded: "60–90 minutes for lunch; half day for food tour",
    highlights: ["Black risotto and grilled Adriatic fish", "Peka slow-roast tradition", "Ston oysters and shellfish", "Pelješac wine pairings"],
    tips: ["Book harbour tavernas on multi-ship days", "Ask for the catch of the day — written menus may list generic items", "Share plates — portions are generous"],
    faqs: [
      ["What should I eat on a Dubrovnik port day?", "Grilled fish or black risotto at a konoba, plus local Pošip or Plavac Mali wine."],
      ["Are food tours worth it on a cruise schedule?", "Yes for first-timers — guides handle reservations and introduce dishes you might not order alone."],
    ],
    related: ["best-restaurants-near-cruise-port", "one-day-in-dubrovnik", "dubrovnik-for-first-time-visitors"],
    excursion: "food-wine-tour",
  },
  {
    slug: "best-restaurants-near-cruise-port",
    name: "Restaurants Near Cruise Port",
    title: "Best Restaurants Near Dubrovnik Cruise Port",
    seoTitle: "Best Restaurants Near Gruž Cruise Port — Where to Eat Before Returning",
    meta: "Best restaurants near Gruž cruise terminal and on the route to Old Town — lunch planning and return timing for Dubrovnik cruise passengers.",
    tagline: "Harbour konobas, Lapad waterfront and Old Town gems — where to eat on a port day.",
    overview:
      "Most cruise passengers eat inside the Old Town walls, but Gruž and Lapad offer quieter options near the terminal if you want lunch before or after an excursion without Stradun crowds.",
    body2:
      "Gruž harbour area has casual seafood trattorias popular with yacht crews — convenient if your tour returns early. Lapad peninsula (between Gruž and Pile) offers waterfront dining with easier taxi access than navigating Old Town lanes with a full stomach before all-aboard.",
    body3:
      "Inside the walls, harbour-side tavernas east of Ploče Gate serve excellent fish with marina views. Stradun-facing restaurants trade atmosphere for premium prices — side lanes one block north often deliver better value and quality.",
    distance: "Gruž harbour: at terminal; Old Town: 2.5 km",
    travel: "On foot in Gruž; 10–15 min taxi to Old Town restaurants",
    timeNeeded: "60–90 minutes for lunch",
    highlights: ["Gruž harbour casual seafood", "Lapad waterfront bistros", "Old Town harbour tavernas near Ploče", "Side-lane konobas off Stradun"],
    tips: ["Reserve Stradun restaurants on multi-ship days", "Eat lunch before 12:30 to beat peak queues", "Carry euros — some konobas prefer cash"],
    faqs: [
      ["Can I eat near the ship without going to Old Town?", "Yes — Gruž and Lapad have solid seafood options if your itinerary allows."],
      ["Best area for a special lunch?", "Harbour tavernas near Ploče Gate combine views with authentic Dalmatian menus."],
    ],
    related: ["dubrovnik-food-guide", "dubrovnik-old-town-guide", "one-day-in-dubrovnik"],
    excursion: "food-wine-tour",
  },
  {
    slug: "one-day-in-dubrovnik",
    name: "One Day in Dubrovnik",
    title: "One Day in Dubrovnik from a Cruise Ship",
    seoTitle: "One Day in Dubrovnik from a Cruise Ship — Sample Itineraries",
    meta: "One day in Dubrovnik from a cruise ship — hour-by-hour itineraries for walls, Old Town, cable car and Lokrum with Gruž port timing.",
    tagline: "Hour-by-hour Dubrovnik — realistic schedules from gangway to all-aboard.",
    overview:
      "A Dubrovnik port day typically gives 7–10 usable hours ashore. This guide maps sample timelines for walls, Old Town, cable car and island escapes with 60–90 minute return buffers built in.",
    body2:
      "Classic highlights: disembark 08:00, taxi to Pile by 08:20, city walls 08:30–10:00, Stradun and lunch 10:30–12:30, cable car 13:00–14:00, free time or shopping 14:00–15:00, taxi to Gruž by 16:00 on a 17:30 sailing.",
    body3:
      "Island variant: Old Town morning, Lokrum boat after lunch — skip walls and cable car. GoT variant: Lovrijenac, Jesuit Stairs, Pile gate walk with guided filming commentary. Adjust every time against your ship's actual schedule.",
    distance: "All itineraries start from Gruž — 2.5 km to Old Town",
    travel: "10–15 min taxi each transfer; walking within walls",
    timeNeeded: "Full port day",
    highlights: ["Classic walls + cable car timeline", "Lokrum island half-day variant", "Independent Old Town-only schedule"],
    tips: ["Subtract 30 minutes when two or more ships share the port", "Buy wall and cable car tickets online the night before", "Confirm excursion meeting point at terminal exit"],
    faqs: [
      ["How many hours do I have in Dubrovnik?", "Subtract 60–90 minutes buffer from departure minus arrival — that is your planning window."],
      ["What if we arrive at noon?", "Focus on Old Town and one anchor — walls OR cable car, not both."],
    ],
    related: ["best-things-to-do-cruise-ship", "dubrovnik-old-town-guide", "walking-city-walls"],
    excursion: "dubrovnik-highlights",
  },
  {
    slug: "best-things-to-do-cruise-ship",
    name: "Best Things to Do",
    title: "Best Things to Do in Dubrovnik from a Cruise Ship",
    seoTitle: "Best Things to Do in Dubrovnik from a Cruise Ship — Port Day Guide",
    meta: "Best things to do in Dubrovnik from a cruise ship — city walls, Old Town, cable car, Lokrum and boat trips ranked for Gruž port days.",
    tagline: "One port day, many Dubrovniks — how to choose what fits your hours ashore.",
    overview:
      "Dubrovnik compresses medieval grandeur, Adriatic islands and blockbuster filming locations into a walkable walled city 2.5 km from Gruž. Your ship's hours determine whether you walk walls, ride the cable car, swim at Lokrum or combine highlights on a guided tour.",
    body2:
      "Standard 8–10 hour calls suit walls plus Old Town, or a highlights tour adding cable car or Lovrijenac. Short calls under 7 usable hours should prioritise Old Town on foot — still unforgettable without every ticketed attraction.",
    body3:
      "Use our cruise planner to match interests to realistic itineraries. First-timers often choose a highlights tour; repeat visitors head to Lokrum, Elafiti boat trips or food-and-wine routes.",
    distance: "Old Town 2.5 km; Lokrum via harbour; Elafiti 1+ hour by boat",
    travel: "10–15 min taxi to Pile; boats from Old Town harbour",
    timeNeeded: "Plan one major anchor per half day",
    highlights: ["City walls circuit", "Mount Srđ cable car panorama", "Lokrum Island swim stop", "Game of Thrones locations"],
    tips: ["Check exact arrival and departure on your cruise app", "Book excursions before sailing in July and August", "Keep 60–90 minutes return buffer"],
    faqs: [
      ["What is the number one thing in Dubrovnik on a cruise?", "City walls for most first-timers; cable car if mobility limits rampart walking."],
      ["Can I see everything in one day?", "No — choose two anchors maximum on a standard call."],
    ],
    related: ["one-day-in-dubrovnik", "dubrovnik-for-first-time-visitors", "walking-city-walls"],
    excursion: "dubrovnik-highlights",
  },
  {
    slug: "dubrovnik-beaches",
    name: "Dubrovnik Beaches",
    title: "Best Beaches from Dubrovnik Cruise Port",
    seoTitle: "Best Dubrovnik Beaches from Cruise Port — Banje, Lapad & Lokrum",
    meta: "Best beaches near Dubrovnik cruise port for cruise passengers — Banje Beach, Lapad bays, Lokrum swimming and realistic half-day planning.",
    tagline: "Adriatic swimming steps from the walls — where cruise passengers take a dip.",
    overview:
      "Dubrovnik is not a beach-resort city, but several swim spots fit a port day. Banje Beach below the walls, Lapad peninsula bays near Gruž and Lokrum Island's rocky coves each offer different experiences.",
    body2:
      "Banje Beach is closest to Old Town — 5 minutes downhill from Ploče Gate with wall views and sunbed hire. Lapad (between Gruž and Pile) offers multiple small bays with showers and cafés — easier logistics if you return to the ship mid-afternoon.",
    body3:
      "Beach time trades wall walking and museums. On calls under 8 hours, pick swimming OR walls — not both with cable car. Lokrum suits passengers who want nature with their swim.",
    distance: "Banje: below Old Town walls; Lapad: 1–2 km from Gruž",
    travel: "10–15 min taxi to Banje or Lapad",
    timeNeeded: "2–3 hours for a swim and lunch",
    highlights: ["Banje Beach below the walls", "Lapad peninsula bays near Gruž", "Lokrum Island rocky swim spots", "Buža Bar cliff swimming hole"],
    tips: ["Pack water shoes for pebble entries", "Rent sunbeds at Banje for comfort", "Confirm ship time before a late swim"],
    faqs: [
      ["Can I swim on a Dubrovnik port day?", "Yes — allow 2+ hours including transfer and changing time."],
      ["Closest beach to the cruise port?", "Lapad bays — 10-minute taxi from Gruž without entering Old Town."],
    ],
    related: ["lokrum-island-guide", "dubrovnik-boat-trips", "lokrum-island-vs-old-town"],
    excursion: "lokrum-island-excursion",
  },
  {
    slug: "dubrovnik-boat-trips",
    name: "Dubrovnik Boat Trips",
    title: "Dubrovnik Boat Trips from Cruise Port",
    seoTitle: "Dubrovnik Boat Trips from Cruise Port — Elafiti Islands & Coastal Cruises",
    meta: "Dubrovnik boat trips for cruise passengers — Elafiti Islands, Lokrum ferries, sunset cruises and combining with your Gruž port schedule.",
    tagline: "Elafiti archipelago and Adriatic sunsets — see Dubrovnik from the water.",
    overview:
      "Boat trips reveal Dubrovnik's relationship with the sea — from 15-minute Lokrum ferries to half-day Elafiti Island hops and evening sunset cruises along the walled coast.",
    body2:
      "Elafiti trips (Koločep, Lopud, Šipan) depart from Gruž or Old Town harbour — typically 4–5 hours with swim stops and village walks. Sunset coastal cruises stay closer to the walls, ideal for late departures and photography.",
    body3:
      "Motion-sensitive passengers should check Adriatic conditions — summer seas are usually calm but afternoon breezes can chop open water. Operators cancel or shorten routes in rough weather; have a land-based backup.",
    distance: "Harbour departures 0–2.5 km from Gruž terminal",
    travel: "Walk to Gruž harbour or taxi to Old Town harbour",
    timeNeeded: "2–5 hours depending on trip type",
    highlights: ["Elafiti Islands three-island circuit", "Sunset cruise past city walls", "Lokrum ferry from Old Town harbour", "Swim stops in hidden coves"],
    tips: ["Book Elafiti trips for morning departures on hot days", "Bring a dry bag for electronics", "Sunset cruises suit ships departing 18:00 or later"],
    faqs: [
      ["Are boat trips safe on a port day?", "Yes with reputable operators who track ship departure — confirm return time in writing."],
      ["Elafiti or Lokrum on a standard call?", "Lokrum fits shorter calls; Elafiti needs 7+ usable hours."],
    ],
    related: ["lokrum-island-guide", "dubrovnik-beaches", "boat-trip-vs-walking-tour"],
    excursion: "boat-trip-elafiti",
  },
  {
    slug: "dubrovnik-hidden-gems",
    name: "Dubrovnik Hidden Gems",
    title: "Dubrovnik Hidden Gems from Cruise Port",
    seoTitle: "Hidden Gems in Dubrovnik — Beyond the Walls for Cruise Passengers",
    meta: "Hidden gems in Dubrovnik for cruise passengers — Buža Bar, War Photo Museum, side lanes and quiet corners away from Stradun crowds.",
    tagline: "Beyond the Stradun crush — quiet lanes, cliff bars and local corners.",
    overview:
      "Dubrovnik's main sights draw crowds, but the walled city hides quieter experiences for passengers willing to leave the marble promenade. These gems fit into standard port days without extra transfers.",
    body2:
      "Buža Bar — a cliff-side drinks terrace punched through the outer wall — rewards explorers who follow 'Cold Drinks' signs through a stone portal. The War Photo Limited museum near Pile offers sobering context on the 1990s siege without the crowds of the cable car.",
    body3:
      "Side lanes north of Stradun (Prijeko, Boskoviceva) hold residential courtyards, small galleries and konobas locals prefer. Dawn or late-afternoon visits beat midday coach groups.",
    distance: "All within Old Town — 2.5 km from Gruž to Pile",
    travel: "10–15 min taxi to Pile, then on foot",
    timeNeeded: "1–2 hours alongside main sights",
    highlights: ["Buža Bar cliff terrace", "War Photo Limited museum", "Jesuit Stairs side passage", "Prijeko lane local konobas"],
    tips: ["Ask for Buža — locals know the portal location", "Museum visit adds 45 minutes — skip if walls are your priority", "Respect residential lanes — keep voices low"],
    faqs: [
      ["Are hidden gems worth it on a first visit?", "After walls or cable car — not instead of them on a short call."],
      ["Is Buža Bar easy to find?", "Look for a hole-in-the-wall sign near the outer wall south of Pile — part of the adventure."],
    ],
    related: ["stradun-walking-guide", "dubrovnik-old-town-guide", "dubrovnik-game-of-thrones-guide"],
    excursion: "independent-walking-guide",
  },
  {
    slug: "dubrovnik-game-of-thrones-guide",
    name: "Game of Thrones Guide",
    title: "Game of Thrones Filming Locations in Dubrovnik",
    seoTitle: "Game of Thrones Dubrovnik Guide — King's Landing Locations from Cruise Port",
    meta: "Game of Thrones filming locations in Dubrovnik for cruise passengers — King's Landing walks, Fort Lovrijenac, Jesuit Stairs and guided tour options from Gruž.",
    tagline: "Walk King's Landing — where Dubrovnik's stones became Westeros.",
    overview:
      "Dubrovnik served as King's Landing in Game of Thrones — the walled city, Fort Lovrijenac and the Jesuit Stairs appear in dozens of scenes. Cruise passengers can self-walk key spots or join a dedicated GoT tour with insider filming stories.",
    body2:
      "Essential stops: Fort Lovrijenac (Red Keep exterior), Jesuit Stairs (Cersei's walk of atonement), Pile Gate and harbour (Blackwater Bay approaches), and the Ethnographic Museum (Littlefinger's brothel exterior). Most fit a 2–3 hour walking loop inside the walls.",
    body3:
      "GoT tours add cost but deliver scene-by-scene context and crowd navigation. Independent fans should download a location map and walk early morning before Stradun fills. Combine with historic Old Town context — Dubrovnik's real history is equally dramatic.",
    distance: "All locations within Old Town and Lovrijenac",
    travel: "10–15 min taxi to Pile Gate",
    timeNeeded: "2–3 hours for main locations",
    highlights: ["Fort Lovrijenac — Red Keep", "Jesuit Stairs — Walk of Shame", "Harbour — Blackwater Bay views", "Pile Gate — city entrance scenes"],
    tips: ["Book GoT tours early in peak season", "Wear comfortable shoes — tours climb stairs repeatedly", "Read historic context too — real siege history rivals fiction"],
    faqs: [
      ["Do I need a tour for Game of Thrones locations?", "No — self-walk with a map works; tours add stories and pacing for fans."],
      ["GoT tour or historic Old Town tour?", "GoT if fandom is the priority; historic tour for broader Dubrovnik context. See our comparison."],
    ],
    related: ["fort-lovrijenac", "dubrovnik-old-town-guide", "game-of-thrones-tour-vs-historic-tour"],
    excursion: "game-of-thrones-tour",
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

// ─── EXPERIENCES (5 GuidePage audience guides) ───────────────────────────────

const experiences = [
  {
    slug: "dubrovnik-for-first-time-visitors",
    title: "Dubrovnik for First-Time Visitors",
    seoTitle: "Dubrovnik for First-Time Cruise Visitors — What to See on a Port Day",
    meta: "First time in Dubrovnik on a cruise? Choose between city walls, Old Town and highlights tours with realistic Gruž port timing.",
    tagline: "One port day inside the walls — where first-timers should start.",
    overview:
      "First-time Dubrovnik callers face a happy problem: the walled city is compact but ticketed sights queue in summer. Your hours ashore pick whether you walk walls, ride the cable car or book a sequenced highlights tour.",
    body1:
      "Standard 8–10 hour calls suit city walls plus Stradun, or a highlights tour adding Mount Srđ or Fort Lovrijenac. Short calls under 7 usable hours: focus on Old Town on foot — still extraordinary without every ticket.",
    body2:
      "First-timers should buy wall tickets online or book a walking tour before sailing in July and August. Multi-ship days fill queues at Pile Gate and the cable car station by mid-morning.",
    body3:
      "Do not attempt walls, cable car and Lokrum independently on one standard call — pick two anchors maximum and keep a 60–90 minute return buffer to Gruž.",
    highlights: ["Highlights tour for standard calls", "Old Town + walls for focused days", "Book early in peak season"],
    tips: ["Check arrival and departure on your cruise app", "Keep 60–90 minute return buffer", "Read city walls vs cable car comparison if torn"],
    faqs: [
      ["City walls or cable car for first-timers?", "Walls for immersion; cable car for the iconic panorama. Highlights tours often include both on long calls."],
      ["Can first-timers go independent?", "Yes for Old Town — walls benefit from skip-the-line tours when queues are long."],
    ],
    recommendations: [
      { cat: "editors-choice", title: "Dubrovnik Highlights", desc: "Walls, Old Town and cable car sequenced with expert timing.", href: "/shore-excursions/dubrovnik-highlights" },
      { cat: "best-short-port", title: "Old Town walking tour", desc: "Essential Stradun route when hours are tight.", href: "/shore-excursions/old-town-walking-tour" },
      { cat: "best-value", title: "Best excursions ranked", desc: "Our first-timer comparison guide.", href: "/compare/best-dubrovnik-excursion-first-time-visitors" },
    ],
    related: ["dubrovnik-for-history-lovers", "city-walls-vs-cable-car", "one-day-in-dubrovnik"],
    imageKey: "city",
  },
  {
    slug: "dubrovnik-for-families",
    title: "Dubrovnik for Families on a Cruise",
    seoTitle: "Family-Friendly Dubrovnik Shore Excursions from Cruise Port",
    meta: "Dubrovnik with kids from a cruise ship — Lokrum Island, paced Old Town walks, cable car and family tours with reliable return timing from Gruž.",
    tagline: "Peacocks, swimming and short walks — family Dubrovnik without meltdowns.",
    overview:
      "Families need realistic pacing, toilet breaks and shade — not a three-hour wall march in full sun. Dubrovnik delivers with Lokrum's peacocks, Lapad beaches near Gruž and cable car thrills without extensive walking.",
    body1:
      "City walls involve 2 km of steps and minimal shade — challenging for under-eights. Family tours use shorter Lovrijenac visits, Stradun stories and Lokrum boat trips instead of full rampart circuits.",
    body2:
      "Lokrum Island suits school-age children — boat ride, swimming and peacocks. Toddlers do better at Lapad bays near the port with facilities and shallow entry than on rocky Lokrum shores.",
    body3:
      "Private vehicles at each stop help strollers versus uncertain buses. Share children's ages when booking — group family tours suit school-age kids; private tours adapt for mixed ages and nap windows.",
    highlights: ["Lokrum for boat ride and peacocks", "Cable car without extensive walking", "Lapad beaches near Gruž"],
    tips: ["Pack snacks, sun hats and water shoes", "Avoid full wall circuit with toddlers", "Book private for groups of four plus"],
    faqs: [
      ["Is Dubrovnik good for kids on a cruise?", "Yes — compact Old Town, Lokrum peacocks and cable car thrills beat long inland transfers."],
      ["City walls with young children?", "Long and hot for under-fives — choose family-dubrovnik or Lokrum instead."],
    ],
    recommendations: [
      { cat: "best-families", title: "Family Dubrovnik Excursion", desc: "Paced routing with Lokrum or Lapad stop.", href: "/shore-excursions/family-dubrovnik" },
      { cat: "best-coastal", title: "Lokrum Island Excursion", desc: "Boat, swim and peacocks offshore.", href: "/shore-excursions/lokrum-island-excursion" },
      { cat: "best-luxury", title: "Private Dubrovnik Tour", desc: "Custom stops and vehicle at each site.", href: "/shore-excursions/private-dubrovnik" },
    ],
    related: ["dubrovnik-for-first-time-visitors", "lokrum-island-vs-old-town", "family-dubrovnik"],
    imageKey: "family",
  },
  {
    slug: "dubrovnik-for-history-lovers",
    title: "Dubrovnik for History Lovers",
    seoTitle: "Dubrovnik History Shore Excursions — Ragusa Republic & Medieval Walls",
    meta: "History-focused Dubrovnik from Gruž cruise port — Ragusa Republic, city walls, Rector's Palace and 1990s siege context for cruise passengers.",
    tagline: "From Ragusa merchants to modern resilience — layered history in stone.",
    overview:
      "Dubrovnik's history spans the independent Ragusa Republic, Venetian influence, Napoleonic occupation and the 1990s Homeland War siege. A port day can cover surprising depth when you prioritise context over cable car selfies.",
    body1:
      "Old Town walking tours sequence Rector's Palace, Sponza, Dominican Monastery and city walls with stories of diplomacy, quarantine (the word 'quarantine' originates from Dubrovnik's Lazarettos) and maritime trade.",
    body2:
      "Fort Lovrijenac and the walls demonstrate medieval military engineering. The War Photo Limited museum and Mount Srđ Imperial Fortress add 20th-century layers without leaving the standard tourist envelope.",
    body3:
      "Avoid GoT-only tours if history is your priority — choose old-town-walking-tour or city-walls-walking-tour with a licensed historian guide rather than a filming-location focus.",
    highlights: ["Ragusa Republic and Rector's Palace", "City walls military architecture", "1990s siege context at War Photo museum"],
    tips: ["Walls first while legs are fresh", "Rector's Palace mid-morning before crowds", "Allow time for Dominican Monastery cloister"],
    faqs: [
      ["Which sight on a short call?", "Old Town walk with Rector's Palace — walls if you have 4+ extra hours."],
      ["Is the Homeland War museum worth it?", "Mount Srđ museum adds 45 minutes — powerful context for modern European history."],
    ],
    recommendations: [
      { cat: "best-historic", title: "Old Town Walking Tour", desc: "Ragusa heritage, palace and Stradun context.", href: "/shore-excursions/old-town-walking-tour" },
      { cat: "editors-choice", title: "City Walls Walking Tour", desc: "Medieval ramparts with historian guide.", href: "/shore-excursions/city-walls-walking-tour" },
      { cat: "best-historic", title: "Dubrovnik Highlights", desc: "Walls, Lovrijenac and Old Town when hours allow.", href: "/shore-excursions/dubrovnik-highlights" },
    ],
    related: ["game-of-thrones-tour-vs-historic-tour", "fort-lovrijenac", "walking-city-walls"],
    imageKey: "history",
  },
  {
    slug: "dubrovnik-for-photography",
    title: "Dubrovnik for Photography",
    seoTitle: "Dubrovnik Photography Guide — Best Shots from Cruise Port",
    meta: "Photography-focused Dubrovnik from Gruž cruise port — walls, Mount Srđ, golden hour and crowd-free angles for cruise passengers.",
    tagline: "Terracotta, Adriatic blue and golden ramparts — Dubrovnik through a lens.",
    overview:
      "Dubrovnik is among the Mediterranean's most photographed cities. Cruise passengers with limited hours should sequence morning wall light, summit panoramas and harbour angles at Fort Lovrijenac before Stradun shadows flatten.",
    body1:
      "City walls: shoot east-facing sections in morning, west toward Lovrijenac in late afternoon. Mount Srđ delivers the money shot — entire walled ellipse and island chain — best 90 minutes before sunset if your ship allows.",
    body2:
      "Secondary angles: Buža Bar cliff terrace, Jesuit Stairs symmetry, harbour approach from Ploče Gate and Banje Beach with walls rising behind. Avoid Stradun midday — harsh overhead light and crowds.",
    body3:
      "Sunset coastal cruises suit ships departing 18:00 or later — golden light on limestone from the water without fighting wall queue times.",
    highlights: ["Minčeta Tower morning light", "Mount Srđ summit panorama", "Fort Lovrijenac harbour framing", "Sunset cruise angles"],
    tips: ["Polarising filter for Adriatic glare", "Book first cable car slot of the day", "Tripod allowed on walls — watch step edges"],
    faqs: [
      ["Best single shot on a tight schedule?", "Mount Srđ summit — context and impact in one frame if queues cooperate."],
      ["Drone photography?", "Drones are restricted over Old Town — use cable car and walls instead."],
    ],
    recommendations: [
      { cat: "best-photography", title: "Cable Car Panorama Tour", desc: "Summit timing for best light.", href: "/shore-excursions/cable-car-panorama" },
      { cat: "best-view", title: "City Walls Walking Tour", desc: "Rampart angles with skip-the-line entry.", href: "/shore-excursions/city-walls-walking-tour" },
      { cat: "best-coastal", title: "Sunset Coastal Cruise", desc: "Golden-hour walls from the Adriatic.", href: "/shore-excursions/sunset-coastal-cruise" },
    ],
    related: ["best-dubrovnik-viewpoints", "mount-srd-cable-car-guide", "city-walls-vs-cable-car"],
    imageKey: "city",
  },
  {
    slug: "independent-vs-cruise-line-excursions",
    title: "Independent vs Cruise Line Excursions in Dubrovnik",
    seoTitle: "Independent vs Cruise Line Dubrovnik Excursions — Which to Choose?",
    meta: "Ship tours vs independent Dubrovnik shore excursions — return-to-ship guarantees, wall queues, pricing and when DIY Old Town walks win at Gruž.",
    tagline: "Ship guarantee or smaller groups — how to choose at Dubrovnik's cruise port.",
    overview:
      "Dubrovnik rewards independent exploration — Old Town is 2.5 km from Gruž with taxis and shuttles available. Ship excursions still matter for city walls skip-the-line access, cable car timing and Lokrum boat coordination.",
    body1:
      "Cruise line coaches carry 40–50 passengers with fixed pacing. Independent small-group tours (8–16) often include wall tickets, earlier entry slots and 20–40% lower prices with more guide interaction.",
    body2:
      "Ship tours guarantee the vessel waits if their excursion runs late — not if you separate from the group. Reputable independents track all-aboard with 60–90 minute buffers but will not delay departure if you miss the meeting point.",
    body3:
      "DIY shines for Old Town: taxi to Pile (10–15 minutes), walk Stradun and side lanes, return by taxi 90 minutes before all-aboard. Do not DIY walls in peak season without pre-booked timed tickets — queues can consume an hour.",
    highlights: ["Old Town excellent for independent walks", "Walls benefit from pre-booked tickets or tours", "Ship guarantee vs smaller groups trade-off"],
    tips: ["Read independent operator reviews for ship-tracking policy", "Buy wall tickets online the night before", "Keep ship excursion if anxious about missing all-aboard"],
    faqs: [
      ["Will the ship wait for independent tours?", "No — only ship-sponsored excursions carry the delay guarantee. Follow meeting times strictly."],
      ["Can I walk from the ship without any tour?", "Yes for Old Town — 25–35 minutes along the waterfront or a quick taxi to Pile Gate."],
    ],
    recommendations: [
      { cat: "best-independent", title: "Independent Walking Guide", desc: "DIY Old Town route with timings from Gruž.", href: "/shore-excursions/independent-walking-guide" },
      { cat: "editors-choice", title: "Dubrovnik Highlights", desc: "When you want walls and cable car handled.", href: "/shore-excursions/dubrovnik-highlights" },
      { cat: "best-value", title: "Compare DIY vs guided", desc: "Honest trade-offs for your call length.", href: "/compare/diy-vs-guided" },
    ],
    related: ["dubrovnik-for-first-time-visitors", "diy-vs-guided", "old-town-walking-tour"],
    imageKey: "old-town",
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

// ─── EXCURSIONS (12 ExcursionPage entries) ───────────────────────────────────

const excursions = [
  {
    slug: "dubrovnik-highlights",
    title: "Dubrovnik Highlights Shore Excursion",
    seoTitle: "Dubrovnik Highlights Shore Excursion from Gruž Cruise Port",
    meta: "Walk city walls, explore Old Town and ride the Mount Srđ cable car on one cruise-timed highlights tour from Gruž with return-to-ship confidence.",
    category: "Highlights",
    tagline: "Walls, Stradun and summit views — Dubrovnik's essential trio on a single port day.",
    duration: "6–7 hours",
    pace: "Moderate",
    bestFor: "First-time visitors with a standard 8–10 hour port call",
    overview:
      "Dubrovnik Highlights is our Editor's Choice for passengers who want the walled city's headline sights without choosing between ramparts and panoramas. A sequenced route covers the city walls, Stradun walk and Mount Srđ cable car.",
    body1:
      "Morning departures from Gruž reach Pile Gate before wall queues peak — timed entry where possible, then a guided Stradun walk with Rector's Palace exterior and Franciscan Monastery context.",
    body2:
      "Afternoon cable car ascent to Mount Srđ delivers the iconic aerial view over the walled ellipse and Lokrum Island. Your guide sequences tickets and transfers so afternoon queues do not consume your return buffer.",
    body3:
      "This is a full day, not a leisurely beach visit. On calls under 8 usable hours, switch to Old Town only or city walls tour instead.",
    highlights: ["City walls circuit with guide", "Stradun and Old Town highlights", "Mount Srđ cable car panorama", "Door-to-door Gruž transfer"],
    included: ["Licensed guide", "Coach or minivan transport", "Wall and cable car tickets where stated", "Return timed to ship"],
    tips: ["Book before sailing in July and August", "Wear sun protection — limited shade on walls", "Comfortable shoes essential for ramparts"],
    faqs: [
      ["Can I skip the cable car on a highlights tour?", "Many operators offer a walls-focused variant — confirm when booking on shorter calls."],
      ["Is this too much for a 7-hour port call?", "Tight — choose old-town-walking-tour or city-walls-walking-tour on shorter calls."],
    ],
    related: ["city-walls-walking-tour", "old-town-walking-tour", "cable-car-panorama"],
    featured: true,
  },
  {
    slug: "city-walls-walking-tour",
    title: "City Walls Walking Tour",
    seoTitle: "Dubrovnik City Walls Shore Excursion from Gruž Cruise Port",
    meta: "Walk Dubrovnik's medieval city walls from Gruž cruise port — skip-the-line entry, historian guide and cruise-timed return.",
    category: "City walls",
    tagline: "Two kilometres of ramparts — the definitive Dubrovnik experience with expert context.",
    duration: "3–4 hours",
    pace: "Active",
    bestFor: "Active travellers and first-timers who want the wall walk as their anchor",
    overview:
      "The city walls circuit is Dubrovnik's signature experience — 2 km of ramparts with Adriatic views and minimal shade. This tour includes timed entry, historian guide and Old Town orientation after the descent.",
    body1:
      "Your guide meets you at Gruž or Pile Gate and navigates ticket entry — critical in peak season when independent queues exceed 30 minutes. The counter-clockwise route from Pile hits Minčeta Tower and Lovrijenac outlooks with commentary on Ragusa defence.",
    body2:
      "Expect 60–90 minutes on the walls plus a short Stradun walk and optional Lovrijenac visit. Steps, uneven stone and full sun mean this tour suits passengers with moderate fitness — not limited mobility.",
    body3:
      "Pairs naturally with an independent harbour lunch but not with cable car and Lokrum on standard 8-hour calls — walls alone fill a half-day comfortably.",
    highlights: ["Skip-the-line wall entry where available", "Minčeta Tower and Fort Bokar views", "Historian guide on Ragusa history", "Post-wall Old Town orientation"],
    included: ["City walls ticket", "Licensed walking guide", "Transfer from Gruž on most tours"],
    tips: ["Morning tours beat midday heat", "Bring water — no vendors on ramparts", "Hat and sunscreen mandatory in summer"],
    faqs: [
      ["How much walking is involved?", "2 km on walls plus 1–2 km in Old Town — allow 8,000–10,000 steps."],
      ["Suitable for fear of heights?", "Wall path is wide but exposed — discuss with operator if anxious."],
    ],
    related: ["dubrovnik-highlights", "old-town-walking-tour", "fort-lovrijenac"],
    featured: true,
  },
  {
    slug: "old-town-walking-tour",
    title: "Old Town Walking Tour",
    seoTitle: "Dubrovnik Old Town Shore Excursion from Gruž Cruise Port",
    meta: "Walk Dubrovnik's UNESCO Old Town from Gruž — Stradun, Rector's Palace, churches and side lanes with expert guide and return timing.",
    category: "Old Town & culture",
    tagline: "Marble Stradun, baroque facades and hidden lanes — the walled city on foot.",
    duration: "3–4 hours",
    pace: "Moderate",
    bestFor: "Culture lovers, short port calls and passengers who skip the wall circuit",
    overview:
      "Dubrovnik Old Town sits 2.5 km from Gruž — this walking tour covers Stradun, Rector's Palace, Sponza, Dominican Monastery and side lanes without the physical demands of the full wall circuit.",
    body1:
      "Your guide meets at the terminal or Pile Gate and routes you away from midday Stradun crush through Prijeko and Boskoviceva lanes. Rector's Palace and Sponza anchor the Ragusa Republic narrative.",
    body2:
      "Expect 3–5 km on polished marble and cobbles — manageable for most adults. Optional St Blaise Church and Franciscan pharmacy museum stops fit shorter calls.",
    body3:
      "Ideal when wall queues are extreme or mobility limits rampart walking. Combine with cable car independently only on 9+ hour calls.",
    highlights: ["Stradun and Luža Square", "Rector's Palace and Sponza", "Side lanes and local courtyards", "St Blaise Church and Franciscan Monastery"],
    included: ["Licensed walking guide", "Taxi to Pile on most tours", "Palace entry where stated"],
    tips: ["Start early before multi-ship crowds", "Dress modestly for church visits", "Save shopping for post-tour free time"],
    faqs: [
      ["Can I walk from the ship without a tour?", "Yes — this tour adds context, palace entry and crowd navigation."],
      ["Old Town without walls on a first visit?", "Acceptable on short calls — but walls remain the top sight if hours allow."],
    ],
    related: ["independent-walking-guide", "city-walls-walking-tour", "dubrovnik-highlights"],
    featured: true,
  },
  {
    slug: "cable-car-panorama",
    title: "Mount Srđ Cable Car Panorama",
    seoTitle: "Mount Srđ Cable Car Shore Excursion from Dubrovnik Cruise Port",
    meta: "Ride the Dubrovnik cable car from Gruž cruise port — summit views, Imperial Fortress and Old Town walk with cruise-timed returns.",
    category: "Viewpoints",
    tagline: "Four minutes to the summit — Dubrovnik's most dramatic panorama above the walls.",
    duration: "3–4 hours",
    pace: "Relaxed",
    bestFor: "Photographers, limited-mobility passengers and panoramic view seekers",
    overview:
      "The Mount Srđ cable car delivers bird's-eye views over the walled city, Lokrum and the Elafiti islands — ideal when wall walking is too demanding or queues make timed entry uncertain.",
    body1:
      "Your excursion handles taxi transfers from Gruž, timed cable car tickets and summit time at the cross viewpoint and Imperial Fortress terrace. Many routes add a short Old Town walk afterward.",
    body2:
      "Cable car operations suspend in high winds — reputable operators monitor conditions and adjust. Summer queues can reach 45 minutes without pre-booked slots.",
    body3:
      "Pairs with Old Town but not with full wall circuit and Lokrum on standard calls — choose panorama OR walls as your primary anchor.",
    highlights: ["Summit panorama over Old Town", "Imperial Fortress exterior", "Timed cable car tickets", "Optional Old Town walk"],
    included: ["Cable car return ticket", "Guide and transport", "Return to Gruž"],
    tips: ["Bring a layer — summit is breezy", "Check wind closures morning of", "Late afternoon suits photography on late sailings"],
    faqs: [
      ["Cable car or walls?", "Walls for medieval immersion; cable car for scale and photos. See our comparison guide."],
      ["Worth it on a short call?", "Yes — faster impact than walls if queues are managed."],
    ],
    related: ["dubrovnik-highlights", "city-walls-walking-tour", "sunset-coastal-cruise"],
  },
  {
    slug: "lokrum-island-excursion",
    title: "Lokrum Island Excursion",
    seoTitle: "Lokrum Island Shore Excursion from Dubrovnik Cruise Port",
    meta: "Visit Lokrum Island from Gruž cruise port — boat transfer, swimming, peacocks and Benedictine ruins with cruise-timed returns.",
    category: "Islands & coast",
    tagline: "Ten minutes by boat — peacocks, swimming and fortress views offshore.",
    duration: "4–5 hours",
    pace: "Relaxed",
    bestFor: "Nature lovers, swimmers and families wanting Adriatic water without long drives",
    overview:
      "Lokrum Island sits 600 metres from Dubrovnik harbour — a nature reserve with swimming spots, botanical gardens and Fort Royal views. This excursion handles harbour transfers, boat tickets and island time.",
    body1:
      "Morning taxi from Gruž to Old Town harbour, then the Lokrum ferry. Your guide allows 2–3 hours on island paths, the Dead Sea salt lake and Fort Royal viewpoint back toward the walls.",
    body2:
      "Last boats return before sunset — operators track your ship's all-aboard with explicit meeting times at the harbour. No cars or overnight stays on Lokrum.",
    body3:
      "Does not combine with full walls and cable car on standard 8-hour calls — island OR ramparts as your anchor.",
    highlights: ["Lokrum ferry from Old Town harbour", "Swimming and botanical garden", "Fort Royal Dubrovnik viewpoint", "Peacocks and monastery ruins"],
    included: ["Boat tickets", "Guide and harbour transfers", "Return to Gruž"],
    tips: ["Water shoes for rocky swim entries", "Bring cash for island café", "First boat maximises island time"],
    faqs: [
      ["Lokrum or Elafiti on a port day?", "Lokrum fits standard calls; Elafiti needs longer hours."],
      ["Can non-swimmers enjoy Lokrum?", "Yes — peacocks, gardens and fortress views reward walkers."],
    ],
    related: ["boat-trip-elafiti", "family-dubrovnik", "dubrovnik-beaches"],
  },
  {
    slug: "game-of-thrones-tour",
    title: "Game of Thrones Walking Tour",
    seoTitle: "Game of Thrones Dubrovnik Shore Excursion — King's Landing from Cruise Port",
    meta: "Walk Game of Thrones filming locations in Dubrovnik from Gruž — Fort Lovrijenac, Jesuit Stairs and King's Landing with cruise-timed returns.",
    category: "Game of Thrones",
    tagline: "Walk King's Landing — Fort Lovrijenac, Jesuit Stairs and harbour scenes with a fan guide.",
    duration: "3–4 hours",
    pace: "Moderate",
    bestFor: "Game of Thrones fans and pop-culture travellers",
    overview:
      "Dubrovnik became King's Landing on screen — this walking tour hits Fort Lovrijenac (Red Keep), Jesuit Stairs (Walk of Shame), harbour approaches and key Stradun filming spots with scene-by-scene commentary.",
    body1:
      "Your guide sequences locations to minimise backtracking and midday Stradun crush. Lovrijenac ticket included on most routes — interior and harbour views with filming context.",
    body2:
      "Expect 3–5 km with repeated stair climbs — comfortable shoes essential. Real Dubrovnik history is woven in so the tour rewards even casual viewers.",
    body3:
      "For broader heritage context, see our GoT vs historic tour comparison — or book old-town-walking-tour if fiction is secondary.",
    highlights: ["Fort Lovrijenac — Red Keep", "Jesuit Stairs filming spot", "Harbour — Blackwater Bay angles", "Pile Gate and Stradun scenes"],
    included: ["Licensed guide", "Lovrijenac entry where stated", "Transfer from Gruž on most tours"],
    tips: ["Book early in peak season — popular tour", "Bring camera — guides know best angles", "Read historic siege context too"],
    faqs: [
      ["Need to have seen every episode?", "No — guides explain scenes in context for all viewers."],
      ["GoT or historic tour?", "GoT for fandom; historic for Ragusa heritage. See our comparison page."],
    ],
    related: ["old-town-walking-tour", "city-walls-walking-tour", "fort-lovrijenac"],
    featured: true,
  },
  {
    slug: "boat-trip-elafiti",
    title: "Elafiti Islands Boat Trip",
    seoTitle: "Elafiti Islands Boat Trip from Dubrovnik Cruise Port",
    meta: "Cruise the Elafiti Islands from Gruž — Koločep, Lopud and Šipan swim stops with cruise-timed returns from Dubrovnik port.",
    category: "Boat trips",
    tagline: "Three islands, hidden coves — Adriatic island-hopping on a half-day cruise.",
    duration: "5–6 hours",
    pace: "Relaxed",
    bestFor: "Boat lovers, swimmers and passengers wanting water over wall walking",
    overview:
      "The Elafiti archipelago north of Dubrovnik offers village walks, swim stops and seafood lunch on car-free islands. This half-day boat trip departs from Gruž or Old Town harbour with explicit return scheduling.",
    body1:
      "Typical routes visit Koločep, Lopud and Šipan with 30–45 minutes ashore per island — enough for swimming, church visits and konoba lunch on longer departures.",
    body2:
      "Sea conditions affect routing — operators adjust in rough weather but rarely cancel entirely in summer. Motion-sensitive passengers should check forecasts.",
    body3:
      "Requires 7+ usable hours — do not pair with walls and cable car on the same call. Ideal for repeat visitors who have walked the ramparts before.",
    highlights: ["Three-island Elafiti circuit", "Swim stops in sheltered coves", "Village walks on Lopud and Šipan", "Coastal views of Dubrovnik walls from sea"],
    included: ["Boat trip ticket", "Guide on most packages", "Transfer to departure point"],
    tips: ["Morning departures for calmer seas", "Bring swimwear and dry bag", "Have Old Town backup if weather cancels"],
    faqs: [
      ["Elafiti or Lokrum?", "Elafiti for island-hopping; Lokrum for a shorter offshore escape."],
      ["Suitable for non-swimmers?", "Yes — village walks and deck views still reward."],
    ],
    related: ["lokrum-island-excursion", "sunset-coastal-cruise", "dubrovnik-boat-trips"],
  },
  {
    slug: "food-wine-tour",
    title: "Dubrovnik Food & Wine Tour",
    seoTitle: "Dubrovnik Food & Wine Shore Excursion from Gruž Cruise Port",
    meta: "Taste Dubrovnik on a food and wine shore excursion — Adriatic seafood, peka, Pelješac wines and konoba lunch timed to your ship.",
    category: "Food & drink",
    tagline: "Black risotto, peka and Pelješac wine — Dalmatian flavours in the walled city.",
    duration: "4–5 hours",
    pace: "Relaxed",
    bestFor: "Food lovers and couples wanting culinary depth on a port day",
    overview:
      "Dubrovnik's Adriatic cuisine deserves a dedicated half-day — this tour combines market insights, konoba tastings and Pelješac wine pairings with cruise-timed returns from Gruž.",
    body1:
      "Morning Old Town market walk (when operating) introduces local produce, olive oil and shellfish from Ston. Midday konoba lunch features black risotto, grilled fish or peka with Pošip or Plavac Mali wines.",
    body2:
      "Guides handle reservations on multi-ship days when walk-in tables vanish. Allow 60–90 minutes seated — Dalmatian lunch is unhurried.",
    body3:
      "Do not pair with full walls and cable car — culinary depth OR rampart walking as your anchor.",
    highlights: ["Market and produce introduction", "Konoba lunch with Adriatic seafood", "Pelješac wine tastings", "Old Town side-lane restaurants"],
    included: ["Food and wine tastings", "Licensed guide", "Lunch where stated", "Return to Gruž"],
    tips: ["Flag dietary needs at booking", "Eat a light breakfast before multi-course tastings", "Cash tip appreciated in konobas"],
    faqs: [
      ["Realistic on an 8-hour call?", "Yes — this tour is designed as your primary activity."],
      ["Vegetarian options?", "Grilled vegetables, pasta and cheese plates available — notify when booking."],
    ],
    related: ["old-town-walking-tour", "dubrovnik-food-guide", "independent-walking-guide"],
  },
  {
    slug: "independent-walking-guide",
    title: "Independent Old Town Walking Guide",
    seoTitle: "Independent Dubrovnik Old Town Guide from Gruž Cruise Port",
    meta: "Self-guided Dubrovnik Old Town walk from Gruž — Pile Gate route, timings, taxi tips and return-to-ship planning for independent cruise passengers.",
    category: "Independent",
    tagline: "Taxi to Pile, walk Stradun, manage your own return — DIY Dubrovnik done right.",
    duration: "3–5 hours self-paced",
    pace: "Moderate",
    bestFor: "Confident independent walkers who want flexibility and lower cost",
    overview:
      "Dubrovnik Old Town is one of the Adriatic's best DIY walks from a cruise terminal. This excursion product is a guided safety net — but the route works independently with a pre-booked afternoon taxi back to Gruž.",
    body1:
      "Taxi to Pile Gate (€12–18), walk Stradun east to Luža Square, detour to Dominican Monastery and St Blaise Church, lunch in a side-lane konoba, return taxi 90 minutes before all-aboard.",
    body2:
      "Buy city walls tickets online if adding the rampart circuit — do not rely on walk-up entry in July or August. Cable car tickets similarly benefit from advance purchase.",
    body3:
      "You manage timing alone — no ship delay guarantee. Ideal for experienced cruisers who have navigated Mediterranean ports before.",
    highlights: ["Self-paced Stradun and side lanes", "Taxi logistics from Gruž explained", "Optional wall and cable car add-ons", "Return buffer checklist"],
    included: ["Route map and timing guide", "Optional meet-and-walk guide on some packages", "Taxi booking assistance where stated"],
    tips: ["Pre-book afternoon taxi back to Gruž", "Download offline Old Town map", "Carry euros for konobas and tickets"],
    faqs: [
      ["Is DIY safe for cruise passengers?", "Yes — Old Town is compact and tourist-friendly. Watch pickpockets in Stradun crowds."],
      ["DIY walls in peak season?", "Only with pre-booked timed tickets — otherwise join a wall tour."],
    ],
    related: ["old-town-walking-tour", "diy-vs-guided", "dubrovnik-for-first-time-visitors"],
  },
  {
    slug: "private-dubrovnik",
    title: "Private Dubrovnik Tour",
    seoTitle: "Private Dubrovnik Shore Excursion from Gruž Cruise Port",
    meta: "Private Dubrovnik tour from Gruž — custom walls, cable car, Lokrum and Old Town routing with premium vehicle and flexible pacing.",
    category: "Private & luxury",
    tagline: "Your pace, your priorities — private vehicle and historian guide from the terminal.",
    duration: "Flexible — typically 6–8 hours",
    pace: "Relaxed",
    bestFor: "Families, limited mobility, premium travellers and mixed-interest groups",
    overview:
      "Private tours eliminate coach convoys and fixed shopping stops. Your historian guide sequences walls, cable car, Lovrijenac and Lokrum according to your ship's hours and group's mobility.",
    body1:
      "Vehicle meets you at Gruž terminal exit — no waiting for 50-passenger coach fill. Timed wall and cable car entries arranged in advance; Lovrijenac and harbour stops at your pace.",
    body2:
      "Limited-mobility passengers benefit from drop-offs at Pile and Ploče gates, avoiding unnecessary steps. Stroller-friendly routes skip the full wall circuit.",
    body3:
      "Premium pricing reflects exclusivity and flexibility — strongest return-to-ship confidence for groups who cannot afford timing mistakes.",
    highlights: ["Private vehicle from Gruž", "Custom itinerary sequencing", "Historian or specialist guide", "Timed attraction entries"],
    included: ["Private guide", "Private vehicle", "Tickets where stated", "Ship-aware return scheduling"],
    tips: ["Share mobility needs at booking", "Book two weeks ahead in August", "Confirm wall ticket availability early"],
    faqs: [
      ["Worth the cost over group tours?", "Yes for mixed ages, mobility limits or specific photo timing requests."],
      ["Can private tours combine walls and Lokrum?", "On 9+ hour calls — your guide will advise honestly."],
    ],
    related: ["dubrovnik-highlights", "family-dubrovnik", "cable-car-panorama"],
  },
  {
    slug: "family-dubrovnik",
    title: "Family Dubrovnik Excursion",
    seoTitle: "Family Dubrovnik Shore Excursion from Gruž Cruise Port",
    meta: "Family-friendly Dubrovnik from Gruž — Lokrum peacocks, cable car, paced Old Town and beach stop with child-aware guides.",
    category: "Family",
    tagline: "Peacocks, cable car and short walks — Dubrovnik paced for mixed-age families.",
    duration: "5–6 hours",
    pace: "Relaxed",
    bestFor: "Families with children aged 5–14 and multi-generational groups",
    overview:
      "Family Dubrovnik skips the full wall marathon in favour of cable car thrills, Lokrum peacocks or Lapad beach, plus a short Stradun walk with stories that engage children.",
    body1:
      "Guides use game-based storytelling on Stradun — pirates, merchants and siege tales rather than dry dates. Cable car summit visit keeps walking manageable for young legs.",
    body2:
      "Lokrum boat option suits school-age children; toddlers may prefer Lapad beach near Gruž with facilities. Toilet and ice-cream stops built into routing.",
    body3:
      "Share ages at booking — guides adapt vocabulary and walking distance. Private upgrade recommended for strollers or mixed teen/toddler groups.",
    highlights: ["Cable car summit visit", "Lokrum or Lapad beach option", "Paced Stradun walk for children", "Explicit return timing to Gruž"],
    included: ["Family-specialist guide", "Transport from terminal", "Cable car or boat tickets where stated"],
    tips: ["Pack snacks and sun hats", "Skip full wall circuit with under-eights", "Book private if group has mixed ages"],
    faqs: [
      ["Minimum age for city walls?", "No official minimum but full circuit is gruelling for under-eights — we route families differently."],
      ["Stroller-friendly?", "Old Town cobbles are difficult — Lapad and cable car better for strollers."],
    ],
    related: ["lokrum-island-excursion", "private-dubrovnik", "dubrovnik-for-families"],
  },
  {
    slug: "sunset-coastal-cruise",
    title: "Sunset Coastal Cruise",
    seoTitle: "Dubrovnik Sunset Coastal Cruise from Gruž Cruise Port",
    meta: "Sunset cruise along Dubrovnik's walls from Gruž — golden-hour photography and Adriatic views for late-departure cruise ships.",
    category: "Boat trips",
    tagline: "Golden light on limestone walls — Dubrovnik from the Adriatic at dusk.",
    duration: "2–3 hours",
    pace: "Relaxed",
    bestFor: "Photographers and passengers on ships departing 18:00 or later",
    overview:
      "A sunset coastal cruise circles the walled city from the water — golden light on terracotta roofs, Lovrijenac silhouette and Adriatic breeze without wall queues or rampart steps.",
    body1:
      "Departures from Gruž or Old Town harbour align with late sailings — typically 16:30–17:00 start for 90 minutes on the water. Prosecco and light snacks on premium operators.",
    body2:
      "Ideal when you walked Old Town or walls in the morning and want a second anchor without more walking. Less suitable for ships with all-aboard before 17:30.",
    body3:
      "Weather cancellations are rare in summer — operators offer reschedule or refund policies. Motion-sensitive passengers find coastal routes calmer than open-water Elafiti trips.",
    highlights: ["Golden-hour wall photography from sea", "Fort Lovrijenac silhouette", "Adriatic sunset views", "Minimal walking required"],
    included: ["Boat cruise ticket", "Transfer to departure point", "Drinks on premium packages"],
    tips: ["Confirm ship departure before booking", "Bring a light jacket — breeze after sunset", "Wide-angle lens for wall panoramas"],
    faqs: [
      ["Can I do walls and sunset cruise same day?", "Yes on late departures — walls morning, cruise late afternoon."],
      ["Which ships suit this tour?", "Departure 18:00 or later with all-aboard 17:00+ — verify your schedule."],
    ],
    related: ["cable-car-panorama", "boat-trip-elafiti", "dubrovnik-for-photography"],
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

// ─── COMPARISONS (5 versus + 1 guide) ──────────────────────────────────────

const comparisons = [
  versus({
    slug: "city-walls-vs-cable-car",
    optionA: "City Walls",
    optionB: "Mount Srđ Cable Car",
    summary:
      "On a standard Dubrovnik port day you can often fit both, but if you must choose one ticketed anchor the walls immerse you in medieval stone while the cable car delivers scale and the iconic aerial panorama.",
    verdict:
      "Choose city walls if you want the definitive Dubrovnik walk and can handle 2 km of steps in sun. Choose the cable car if mobility limits rampart walking or queues at Pile Gate are extreme. First-timers on 8-hour calls should prioritise walls; photographers may prefer Srđ for the single best frame.",
    overview: [
      "City walls: 2 km circuit, 60–90 minutes, queues at Pile Gate in peak season, full sun exposure.",
      "Cable car: 4-minute ascent, summit views, separate queues at the lower station, suspends in high winds.",
      "Combining both is standard on highlights tours for 8+ hour calls — DIY dual-anchor days need strict time discipline.",
    ],
    table: [
      { category: "Transfer from Gruž", optionA: "10–15 min taxi to Pile", optionB: "10–15 min taxi + walk to station" },
      { category: "Time on site", optionA: "1.5–2.5 hours including queue", optionB: "1–1.5 hours including queue" },
      { category: "Physical effort", optionA: "Active — steps and sun", optionB: "Low — elevator and terrace walks" },
      { category: "Best for", optionA: "History, immersion, first-timers", optionB: "Photography, panoramas, limited mobility" },
      { category: "Return-to-ship confidence", optionA: "High when timed entry booked", optionB: "High unless wind closure forces plan change" },
    ],
    faqs: [
      ["Can I do both on one port day?", "Yes on 8+ hour calls — walls morning, cable car afternoon is the classic sequence."],
      ["Which has longer queues?", "Often comparable in July — both benefit from pre-booked tickets or guided tours."],
    ],
    related: ["dubrovnik-for-first-time-visitors", "walking-city-walls", "mount-srd-cable-car-guide"],
    imageKey: "fortress",
  }),
  versus({
    slug: "lokrum-island-vs-old-town",
    optionA: "Lokrum Island",
    optionB: "Dubrovnik Old Town",
    summary:
      "Lokrum offers Adriatic swimming and nature 10 minutes by boat from the harbour; Old Town delivers UNESCO marble streets and wall access 2.5 km from Gruž. On standard calls pick one as your half-day anchor.",
    verdict:
      "Choose Old Town (with or without walls) for first-time Dubrovnik and cultural depth. Choose Lokrum when you want swimming, peacocks and an island escape without coastal drives. Repeat visitors who have walked the walls often pick Lokrum.",
    overview: [
      "Old Town: 2.5 km from Gruž, 10–15 min taxi, walls and Stradun on foot, peak Stradun crowds midday.",
      "Lokrum: taxi to harbour plus 15 min boat, 2–3 hours on island, last ferry timing critical.",
      "Combining both needs 8+ usable hours — walls plus Lokrum is too much for most standard calls.",
    ],
    table: [
      { category: "Transfer from Gruž", optionA: "Taxi to harbour + boat", optionB: "10–15 min taxi to Pile" },
      { category: "Time needed", optionA: "3–4 hours total", optionB: "2–4 hours walking" },
      { category: "Swimming", optionA: "Yes — rocky coves", optionB: "Banje Beach optional add-on" },
      { category: "Best for", optionA: "Nature, swim, families", optionB: "Culture, walls, first-timers" },
      { category: "Independence", optionA: "Needs boat tickets and timing", optionB: "Excellent for DIY walks" },
    ],
    faqs: [
      ["Lokrum on a first visit?", "After walls or instead of cable car — not instead of Old Town entirely."],
      ["Can I do Old Town morning and Lokrum afternoon?", "Yes on 9+ hour calls with careful ferry timing."],
    ],
    related: ["lokrum-island-guide", "dubrovnik-old-town-guide", "dubrovnik-for-families"],
    imageKey: "boat",
  }),
  versus({
    slug: "diy-vs-guided",
    optionA: "DIY Dubrovnik",
    optionB: "Guided Shore Excursion",
    summary:
      "DIY Old Town walks from Gruž cost little and carry high return confidence. DIY city walls in peak season add queue risk. Guided excursions cost more but bundle skip-the-line tickets, historian guides and ship-aware timing.",
    verdict:
      "Choose DIY for Old Town if you are a confident walker and will taxi back 90 minutes before all-aboard with pre-booked wall tickets if needed. Choose guided for walls skip-the-line, cable car coordination, Lokrum boats and first-time callers who want zero queue stress.",
    overview: [
      "DIY: taxi to Pile (€12–18), walk Stradun, lunch in konoba, taxi to Gruž — €30–50 plus food. You manage tickets and queues.",
      "Guided: minivan from terminal, timed wall entry, historian guide, 60–90 minute buffers. Operators track ship departure.",
      "DIY saves €40–80 per person for Old Town days; guided saves costly queue mistakes in July and August.",
    ],
    table: [
      { category: "Cost per person", optionA: "€30–55 plus food", optionB: "€70–130+ all-in" },
      { category: "Return confidence", optionA: "High for Old Town only", optionB: "High for all routes" },
      { category: "Wall queues", optionA: "Risk without pre-booking", optionB: "Usually managed by operator" },
      { category: "Best for", optionA: "Experienced cruisers, Old Town focus", optionB: "Walls, cable car, Lokrum, first-timers" },
    ],
    faqs: [
      ["Is DIY Old Town safe?", "Yes — compact and well signposted. Pre-book afternoon taxi in peak season."],
      ["Best sight for DIY?", "Old Town walk — walls only with online timed tickets."],
    ],
    related: ["independent-vs-cruise-line-excursions", "independent-walking-guide", "dubrovnik-for-first-time-visitors"],
    imageKey: "old-town",
  }),
  versus({
    slug: "game-of-thrones-tour-vs-historic-tour",
    optionA: "Game of Thrones Tour",
    optionB: "Historic Old Town Tour",
    summary:
      "Both walk the same stone — GoT tours emphasise King's Landing filming locations and fan stories; historic tours emphasise Ragusa Republic merchants, siege history and baroque heritage.",
    verdict:
      "Choose GoT if fandom drives your visit and you want Jesuit Stairs and Lovrijenac with scene references. Choose historic if you care about UNESCO context, Rector's Palace and the 1990s siege beyond fantasy fiction. Many passengers want both — historic guides often touch key filming spots anyway.",
    overview: [
      "GoT tours: Lovrijenac, Jesuit Stairs, harbour, Pile Gate — 2–3 hours with pop-culture focus.",
      "Historic tours: Rector's Palace, Sponza, Dominican Monastery, walls context — broader timeline.",
      "Same geography — different narrative lens. Wall tickets may apply on either route.",
    ],
    table: [
      { category: "Focus", optionA: "Filming locations and fan stories", optionB: "Ragusa history and heritage" },
      { category: "Duration", optionA: "2–3 hours typical", optionB: "3–4 hours typical" },
      { category: "Best for", optionA: "GoT fans", optionB: "History lovers, first-time culture visitors" },
      { category: "Overlap", optionA: "High — same streets", optionB: "High — same streets" },
    ],
    faqs: [
      ["Can one tour do both?", "Some guides blend themes — ask when booking."],
      ["GoT tour without seeing the show?", "Yes — locations still impress; historic tour may suit better."],
    ],
    related: ["dubrovnik-game-of-thrones-guide", "dubrovnik-for-history-lovers", "game-of-thrones-tour"],
    imageKey: "history",
  }),
  versus({
    slug: "boat-trip-vs-walking-tour",
    optionA: "Boat Trip",
    optionB: "Walking Tour",
    summary:
      "A Dubrovnik port day often forces a choice between Adriatic water — Elafiti islands or sunset cruise — and walled-city walking. Your ship's hours and whether you have walked Dubrovnik before should decide.",
    verdict:
      "Choose a walking tour (walls or Old Town) for first-time Dubrovnik — the walled city is the headline. Choose a boat trip if you have done the walls before, want swimming without rampart steps, or your ship suits a sunset coastal cruise.",
    overview: [
      "Walking tours: 3–5 km on marble and walls, cultural depth, queues at Pile in peak season.",
      "Boat trips: Elafiti 5–6 hours or sunset cruise 2–3 hours, weather dependent, minimal walking.",
      "Mixing half-day boat and half-day walls works only on 10+ hour calls with private coordination.",
    ],
    table: [
      { category: "Minimum call length", optionA: "5–6 hours (sunset) or 7+ (Elafiti)", optionB: "4+ hours for Old Town" },
      { category: "Physical effort", optionA: "Low — seated on boat", optionB: "Moderate to active on walls" },
      { category: "Best for", optionA: "Repeat visitors, swimmers, photographers at dusk", optionB: "First-timers, history, UNESCO" },
      { category: "Weather risk", optionA: "Sea state may alter routes", optionB: "Rarely cancelled" },
    ],
    faqs: [
      ["Boat morning, walls afternoon?", "Only on 10+ hour calls — otherwise one anchor per day."],
      ["Best boat for standard calls?", "Lokrum ferry or sunset cruise — not full Elafiti unless hours allow."],
    ],
    related: ["dubrovnik-boat-trips", "walking-city-walls", "boat-trip-elafiti"],
    imageKey: "boat",
  }),
  comparisonGuide({
    slug: "best-dubrovnik-excursion-first-time-visitors",
    title: "Best Dubrovnik Excursions for First-Time Visitors",
    seoTitle: "Best Dubrovnik Shore Excursions for First-Timers — Gruž Port",
    meta: "Ranked Dubrovnik shore excursions for first-time cruise passengers at Gruž — highlights, walls, Old Town and private options.",
    summary:
      "First-timers need one clear anchor, reliable wall or cable car entry and an operator who understands all-aboard — these excursions deliver consistently from Gruž.",
    verdict: "Book before sailing in peak season. Morning departures protect afternoon return margins when wall and cable car queues build.",
    overview: [
      "Dubrovnik Highlights balances walls, Old Town and cable car for standard 8–10 hour calls.",
      "City walls tour suits passengers who want the rampart walk as their single must-do.",
      "Old Town walking suits short calls and those skipping the full wall circuit.",
      "Private tours suit mixed groups wanting flexible pacing and skip-the-line coordination.",
    ],
    guideItems: [
      { name: "Dubrovnik Highlights", slug: "dubrovnik-highlights", href: "/shore-excursions/dubrovnik-highlights", reason: "Editor's pick — walls, Stradun and cable car sequenced with expert timing.", topExcursion: "Dubrovnik Highlights Shore Excursion", returnConfidence: "High on 8+ hour calls", walkingDifficulty: "Moderate — walls and cobbles" },
      { name: "City Walls Walking Tour", slug: "city-walls-walking-tour", href: "/shore-excursions/city-walls-walking-tour", reason: "When the rampart walk is your non-negotiable must-do.", topExcursion: "City Walls Walking Tour", returnConfidence: "High with timed entry", walkingDifficulty: "Active — 2 km ramparts" },
      { name: "Old Town Walking Tour", slug: "old-town-walking-tour", href: "/shore-excursions/old-town-walking-tour", reason: "Best when your call is short or wall walking is too demanding.", topExcursion: "Old Town Walking Tour", returnConfidence: "Very high", walkingDifficulty: "Moderate — 3–5 km marble" },
      { name: "Cable Car Panorama", slug: "cable-car-panorama", href: "/shore-excursions/cable-car-panorama", reason: "Iconic summit photo when walls are not your priority.", topExcursion: "Mount Srđ Cable Car Panorama", returnConfidence: "High unless wind closure", walkingDifficulty: "Easy" },
      { name: "Private Dubrovnik", slug: "private-dubrovnik", href: "/shore-excursions/private-dubrovnik", reason: "Custom routing for families and mixed interests with strongest flexibility.", topExcursion: "Private Dubrovnik Tour", returnConfidence: "Very high", walkingDifficulty: "Flexible" },
    ],
    faqs: [
      ["One excursion for first-timers?", "Dubrovnik Highlights on standard calls — Old Town only on short calls."],
      ["Walls or highlights tour?", "Highlights if you want walls plus cable car; walls tour if ramparts alone fill your day."],
    ],
    related: ["dubrovnik-for-first-time-visitors", "city-walls-vs-cable-car", "dubrovnik-highlights"],
    imageKey: "highlights",
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

export interface PlannerInput {
  timeframe: "short" | "standard" | "long";
  arrivalTime?: string;
  departureTime?: string;
  adults: number;
  children: number;
  interests: string[];
  mobility: "full" | "some" | "limited";
  budget: "budget" | "mid" | "premium";
  style: "guided" | "mix" | "diy";
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
  { id: "history", label: "History & heritage" },
  { id: "city-walls", label: "City walls walk" },
  { id: "viewpoints", label: "Viewpoints & panoramas" },
  { id: "got", label: "Game of Thrones" },
  { id: "islands", label: "Islands & coast" },
  { id: "food", label: "Food & wine" },
  { id: "boat", label: "Boat trips" },
  { id: "family", label: "Family-friendly" },
  { id: "old-town", label: "Old Town & culture" },
  { id: "photography", label: "Photography" },
];

const INTEREST_TO_EXCURSION: Record<string, string[]> = {
  history: ["old-town-walking-tour", "dubrovnik-highlights", "city-walls-walking-tour"],
  "city-walls": ["city-walls-walking-tour", "dubrovnik-highlights", "old-town-walking-tour"],
  viewpoints: ["cable-car-panorama", "dubrovnik-highlights", "sunset-coastal-cruise"],
  got: ["game-of-thrones-tour", "dubrovnik-highlights", "old-town-walking-tour"],
  islands: ["lokrum-island-excursion", "boat-trip-elafiti", "sunset-coastal-cruise"],
  food: ["food-wine-tour", "old-town-walking-tour", "dubrovnik-highlights"],
  boat: ["boat-trip-elafiti", "sunset-coastal-cruise", "lokrum-island-excursion"],
  family: ["family-dubrovnik", "lokrum-island-excursion", "old-town-walking-tour"],
  "old-town": ["old-town-walking-tour", "independent-walking-guide", "dubrovnik-highlights"],
  photography: ["cable-car-panorama", "sunset-coastal-cruise", "city-walls-walking-tour"],
};

const ITINERARY_THEMES: Record<
  string,
  { headline: string; slugs: string[]; summary: string }
> = {
  "editors-choice": {
    headline: "Editor's Choice — Walls • Old Town • Mount Srđ",
    slugs: ["dubrovnik-highlights", "city-walls-walking-tour", "old-town-walking-tour"],
    summary: "The essential Dubrovnik trio — ramparts, Stradun and summit views sequenced with expert timing.",
  },
  "best-historic": {
    headline: "Historic Dubrovnik",
    slugs: ["old-town-walking-tour", "city-walls-walking-tour", "dubrovnik-highlights"],
    summary: "Ragusa Republic heritage, medieval walls and palace museums without rushing.",
  },
  "best-view": {
    headline: "Best Viewpoints",
    slugs: ["cable-car-panorama", "city-walls-walking-tour", "sunset-coastal-cruise"],
    summary: "Mount Srđ panorama, rampart outlooks and golden-hour Adriatic angles.",
  },
  "best-got": {
    headline: "Game of Thrones Day",
    slugs: ["game-of-thrones-tour", "old-town-walking-tour", "city-walls-walking-tour"],
    summary: "King's Landing locations — Lovrijenac, Jesuit Stairs and harbour scenes with fan guide.",
  },
  "best-coastal": {
    headline: "Coastal Escape",
    slugs: ["lokrum-island-excursion", "boat-trip-elafiti", "sunset-coastal-cruise"],
    summary: "Lokrum swim stop, Elafiti islands or sunset cruise — Adriatic water over ramparts.",
  },
  "best-food": {
    headline: "Food & Wine",
    slugs: ["food-wine-tour", "old-town-walking-tour", "dubrovnik-highlights"],
    summary: "Konoba lunch, Pelješac wines and market tastings fitted to your port hours.",
  },
  "best-independent": {
    headline: "Independent Explorer",
    slugs: ["independent-walking-guide", "old-town-walking-tour", "cable-car-panorama"],
    summary: "Taxi to Pile Gate, walk Stradun and manage your own return buffer to Gruž.",
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
  const map = { short: 5, standard: 7.5, long: 10 };
  return map[input.timeframe];
}

function pickTheme(input: PlannerInput): keyof typeof ITINERARY_THEMES {
  const { interests, children, style, mobility, timeframe } = input;
  const active = interests.length ? interests : ["old-town", "history"];

  if (children > 0 || active.includes("family")) return "best-coastal";
  if (active.includes("got")) return "best-got";
  if (style === "diy" || (active.includes("old-town") && style !== "guided")) return "best-independent";
  if (active.includes("food")) return "best-food";
  if (active.includes("boat") || active.includes("islands")) return "best-coastal";
  if (active.includes("viewpoints") || active.includes("photography")) return "best-view";
  if (active.includes("city-walls") || active.includes("history")) return "best-historic";
  if (timeframe === "short" || usableHours(input) < 6) return "best-independent";
  if (mobility === "limited") return "best-historic";
  return "editors-choice";
}

export function generateDubrovnikPlan(input: PlannerInput): PlannerResult {
  const { timeframe, arrivalTime, departureTime, adults, children, interests, mobility, budget, style } = input;
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

  const activeInterests = interests.length ? interests : ["old-town", "history"];
  for (const interest of activeInterests) {
    for (const s of INTEREST_TO_EXCURSION[interest] ?? []) pushSlug(s);
  }
  if (hasKids) pushSlug("family-dubrovnik");
  if (mobility === "limited") pushSlug("private-dubrovnik");
  if (style === "diy") pushSlug("independent-walking-guide");
  if (budget === "premium") pushSlug("private-dubrovnik");
  if (timeframe === "short" || hours < 6) pushSlug("old-town-walking-tour");

  const reasonMap: Record<string, string> = {
    "dubrovnik-highlights": "Editor's Choice — walls, Old Town and cable car on one sequenced day.",
    "city-walls-walking-tour": "Two kilometres of ramparts — Dubrovnik's signature experience.",
    "old-town-walking-tour": "Stradun and Ragusa heritage — best anchor for any call length.",
    "cable-car-panorama": "Mount Srđ summit — the iconic aerial panorama over the walls.",
    "lokrum-island-excursion": "Peacocks, swimming and fortress views offshore.",
    "game-of-thrones-tour": "King's Landing filming locations with fan guide.",
    "boat-trip-elafiti": "Elafiti island-hopping with swim stops.",
    "food-wine-tour": "Adriatic seafood, peka and Pelješac wine pairings.",
    "family-dubrovnik": "Paced routing with cable car or Lokrum for children.",
    "private-dubrovnik": mobility === "limited" ? "Private vehicle at each stop — essential for easy access." : "Flexible routing for your group.",
    "sunset-coastal-cruise": "Golden-hour walls from the Adriatic — ideal for late sailings.",
    "independent-walking-guide": "DIY Old Town route — taxi to Pile, walk Stradun.",
  };

  const excursionLinks = excSlugs
    .slice(0, 5)
    .map((s) => excursionLink(s, reasonMap[s] ?? "A strong match for your Dubrovnik port day."))
    .filter((x): x is PlannerLink => x !== null);

  const transfers: PlannerLink[] = [
    {
      label: "Dubrovnik Cruise Port Guide",
      href: "/cruise-port-guide",
      why: "Gruž terminal layout, taxis, shuttles and routes to Pile Gate.",
    },
  ];
  if (party >= 3 || hasKids || mobility === "limited" || budget === "premium") {
    transfers.push({
      label: "Private Dubrovnik Tour",
      href: "/shore-excursions/private-dubrovnik",
      why: "Strongest return-to-ship confidence for your group when queues build at Pile Gate.",
    });
  }

  const logistics: PlannerLink[] = [
    { label: "Ship Schedules", href: "/ship-schedules/dubrovnik", why: "See how many ships share your port day." },
    {
      label: "First-Time Dubrovnik Guide",
      href: "/guides/dubrovnik-for-first-time-visitors",
      why: "Choose your anchor sight when hours are tight.",
    },
    {
      label: "DIY vs Guided",
      href: "/compare/diy-vs-guided",
      why: "When independent Old Town walks beat organised tours.",
    },
  ];

  const topExc = excursionLinks[0]?.label ?? theme.headline;
  const dayPlan: { time: string; text: string }[] = [];

  const arriveLabel = arrivalTime ?? (timeframe === "short" ? "08:00" : timeframe === "long" ? "07:00" : "07:30");
  const departLabel = departureTime ?? (timeframe === "short" ? "14:00" : timeframe === "long" ? "18:00" : "17:00");

  dayPlan.push({
    time: "On arrival",
    text: \`Disembark at Gruž terminal (\${arriveLabel}). Meet your excursion at the terminal exit, or taxi to Pile Gate (10–15 min) for an independent Old Town start.\`,
  });

  if (themeKey === "best-coastal") {
    dayPlan.push({
      time: "Morning",
      text: \`Depart for Lokrum harbour or Elafiti boat — \${topExc}. Morning ferries beat afternoon heat and crowds.\`,
    });
    dayPlan.push({
      time: "Midday",
      text: themeKey === "best-coastal" && activeInterests.includes("boat") ? "Island swim stop or coastal cruise leg — allow 2+ hours on the water." : "Lokrum peacocks, swim and Fort Royal viewpoint — allow 2–3 hours offshore.",
    });
    dayPlan.push({
      time: "Afternoon",
      text: "Return boat and taxi to Gruž — do not add city walls unless your departure is 18:00 or later.",
    });
  } else if (themeKey === "best-food") {
    dayPlan.push({ time: "Morning", text: "Old Town market stroll and first tastings near Stradun side lanes." });
    dayPlan.push({ time: "Midday", text: "Konoba lunch with Pelješac wine — allow 90 minutes seated." });
    dayPlan.push({ time: "Afternoon", text: "Coffee at Luža Square and taxi back toward Gruž." });
  } else if (themeKey === "best-independent") {
    dayPlan.push({ time: "Morning", text: "Taxi to Pile Gate — walk Stradun, Rector's Palace exterior and Franciscan Monastery." });
    dayPlan.push({ time: "Midday", text: "Lunch in a Prijeko side-lane konoba — black risotto or grilled fish." });
    dayPlan.push({ time: "Afternoon", text: "Optional Buža Bar cliff terrace, shop for olive oil, taxi to Gruž 90 minutes before all-aboard." });
  } else if (themeKey === "best-got") {
    dayPlan.push({ time: "Morning", text: "Fort Lovrijenac and Jesuit Stairs with GoT guide — early start beats Stradun crowds." });
    dayPlan.push({ time: "Midday", text: "Harbour and Pile Gate filming spots with lunch near Ploče Gate." });
    dayPlan.push({ time: "Afternoon", text: "Optional Ethnographic Museum exterior — return via taxi to Gruž." });
  } else if (themeKey === "best-view") {
    dayPlan.push({ time: "Morning", text: "City walls or cable car first for best light — timed entry avoids peak queues." });
    dayPlan.push({ time: "Midday", text: "Stradun walk below the ramparts — short lunch near Luža Square." });
    dayPlan.push({ time: "Afternoon", text: "Sunset coastal cruise if your ship departs 18:00+ — otherwise summit or harbour photos." });
  } else if (hasKids) {
    dayPlan.push({ time: "Morning", text: "Cable car summit or Lokrum boat — short transfers for children." });
    dayPlan.push({ time: "Midday", text: "Ice cream on Stradun and short Lovrijenac exterior visit." });
    dayPlan.push({ time: "Afternoon", text: "Lapad beach near Gruž or early return to ship — avoid full wall circuit with toddlers." });
  } else {
    dayPlan.push({
      time: "Morning",
      text: \`City walls or historic anchor first: \${topExc}. Morning entry beats Pile Gate queues.\`,
    });
    dayPlan.push({ time: "Midday", text: "Stradun walk and konoba lunch — Rector's Palace or Dominican Monastery stop." });
    dayPlan.push({ time: "Afternoon", text: "Cable car or Lovrijenac if hours allow — otherwise free time near Pile before returning to Gruž." });
  }

  dayPlan.push({
    time: "Return buffer",
    text: \`Be back at Gruž terminal 60–90 minutes before all-aboard (\${departLabel} sailing). Wall and cable car queues can add 20–30 minutes in peak season.\`,
  });

  const interestLabels = activeInterests
    .map((i) => INTEREST_OPTIONS.find((o) => o.id === i)?.label ?? i)
    .join(", ")
    .toLowerCase();

  return {
    headline: theme.headline,
    summary: \`\${theme.summary} A \${timeframe} Dubrovnik port day (~\${hours.toFixed(1)} usable hours) for \${party} guest\${party === 1 ? "" : "s"} interested in \${interestLabels}.\`,
    excursions: excursionLinks,
    transfers,
    stay: [],
    logistics,
    dayPlan,
  };
}

/** @deprecated Use generateDubrovnikPlan */
export const generateCorfuPlan = generateDubrovnikPlan;
`,
);

w(
  "editorial.ts",
  `import type { EditorialCategory } from "./types";

export interface EditorialCategoryDef {
  id: EditorialCategory;
  label: string;
  shortLabel: string;
  description: string;
}

export const EDITORIAL_CATEGORIES: EditorialCategoryDef[] = [
  { id: "editors-choice", label: "Editor's Choice", shortLabel: "Editor's Choice", description: "Our top pick after comparing options for Dubrovnik cruise passengers." },
  { id: "best-historic", label: "Best Historic Experience", shortLabel: "Historic", description: "Ragusa Republic heritage, walls and palace museums without rushing." },
  { id: "best-independent", label: "Best Independent Experience", shortLabel: "Independent", description: "The smartest DIY approach when you prefer to explore from Gruž port." },
  { id: "best-coastal", label: "Best Coastal Experience", shortLabel: "Coastal", description: "Lokrum, Elafiti islands and Adriatic cruises timed to your ship." },
  { id: "best-view", label: "Best Viewpoints", shortLabel: "Viewpoints", description: "Mount Srđ cable car, rampart outlooks and panorama photography." },
  { id: "best-got", label: "Best Game of Thrones Experience", shortLabel: "Game of Thrones", description: "King's Landing filming locations with expert fan guides." },
  { id: "best-families", label: "Best for Families", shortLabel: "Families", description: "Paced for children and mixed-age groups with reliable return timing." },
  { id: "best-photography", label: "Best for Photography", shortLabel: "Photography", description: "Golden-hour angles, summit panoramas and crowd-free outlooks." },
  { id: "best-food", label: "Best Food & Wine Experience", shortLabel: "Food & Wine", description: "Adriatic seafood, peka and Pelješac tastings that fit a cruise schedule." },
  { id: "best-luxury", label: "Best Luxury Experience", shortLabel: "Luxury", description: "Private vehicles, premium pacing and skip-the-line access from Gruž." },
  { id: "hidden-gem", label: "Hidden Gem", shortLabel: "Hidden Gem", description: "A rewarding alternative away from Stradun midday crush." },
  { id: "best-value", label: "Best Value", shortLabel: "Best Value", description: "Strong sightseeing per euro when budget matters as much as timing." },
  { id: "best-short-port", label: "Best for Short Port Calls", shortLabel: "Short Port", description: "Realistic when your ship is in Dubrovnik for under seven usable hours." },
];

export function getEditorialLabel(id: EditorialCategory): string {
  return EDITORIAL_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
`,
);

w(
  "homepage.ts",
  `import type { FAQ, VisitorType, ExperienceCard } from "./types";

export const visitorTypes: VisitorType[] = [
  {
    id: "port-day",
    label: "I'm visiting Dubrovnik for the day on a cruise",
    shortLabel: "Port day",
    description: "You're calling at Dubrovnik for the day. Find shore excursions, planning guides and a realistic port-day itinerary from Gruž.",
    href: "/shore-excursions",
    cta: "Plan my port day",
  },
  {
    id: "first-time",
    label: "It's my first time in Dubrovnik",
    shortLabel: "First visit",
    description: "City walls or cable car? Our first-timer guides and comparison pages help you choose confidently.",
    href: "/guides/dubrovnik-for-first-time-visitors",
    cta: "First-timer guide",
  },
  {
    id: "independent",
    label: "I prefer to explore independently",
    shortLabel: "Independent",
    description: "Taxi to Pile Gate, walk the Stradun, manage your own return — when DIY beats a ship tour.",
    href: "/guides/independent-vs-cruise-line-excursions",
    cta: "Independent guide",
  },
  {
    id: "planner",
    label: "I want a personalised itinerary",
    shortLabel: "Custom plan",
    description: "Tell us your hours ashore, interests and budget — get a tailored Dubrovnik plan with return-to-ship timing.",
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
    slug: "historic-dubrovnik",
    title: "Historic Dubrovnik",
    description: "Stradun, Rector's Palace and Ragusa Republic stories — UNESCO marble streets from Gruž port.",
    href: "/guides/dubrovnik-old-town-guide",
    cta: "Explore Old Town",
    imageKey: "old-town",
  },
  {
    slug: "islands-coastline",
    title: "Islands & Coastline",
    description: "Lokrum peacocks, Elafiti boat trips and Adriatic swimming — coastal escapes on a port day.",
    href: "/guides/lokrum-island-guide",
    cta: "Explore islands",
    imageKey: "boat",
  },
  {
    slug: "best-views",
    title: "Best Viewpoints",
    description: "City walls ramparts, Mount Srđ cable car and Fort Lovrijenac — Dubrovnik from every angle.",
    href: "/guides/mount-srd-cable-car-guide",
    cta: "Find viewpoints",
    imageKey: "fortress",
  },
  {
    slug: "game-of-thrones",
    title: "Game of Thrones",
    description: "Walk King's Landing — Lovrijenac, Jesuit Stairs and harbour scenes from your favourite series.",
    href: "/guides/dubrovnik-game-of-thrones-guide",
    cta: "Explore GoT locations",
    imageKey: "history",
  },
  {
    slug: "food-culture",
    title: "Food & Culture",
    description: "Black risotto, peka and Pelješac wine — Dalmatian flavours in the walled city.",
    href: "/guides/dubrovnik-food-guide",
    cta: "Taste Dubrovnik",
    imageKey: "food",
  },
  {
    slug: "independent",
    title: "Independent Explorer",
    description: "Taxi to Pile Gate, walk side lanes, manage your own return — when independent beats a guided excursion.",
    href: "/guides/independent-vs-cruise-line-excursions",
    cta: "Go independent",
    imageKey: "old-town",
  },
];

export const coreSections: HomeSection[] = [
  { slug: "shore-excursions", number: "01", title: "Shore Excursions", description: "City walls, Old Town, cable car and Lokrum — cruise-timed from Gruž terminal.", href: "/shore-excursions", cta: "Browse excursions" },
  { slug: "guides", number: "02", title: "Dubrovnik Planning Guides", description: "Authority guides for walls, viewpoints, islands, food and every type of passenger.", href: "/guides", cta: "Read guides" },
  { slug: "cruise-port-guide", number: "03", title: "Dubrovnik Cruise Port Guide", description: "Gruž terminal layout, taxis, shuttles and getting to Pile Gate on arrival.", href: "/cruise-port-guide", cta: "Port guide" },
  { slug: "cruise-planner", number: "04", title: "Dubrovnik Cruise Planner", description: "Answer a few questions — get a tailored itinerary with return-to-ship confidence.", href: "/cruise-planner", cta: "Start planning" },
  { slug: "compare", number: "05", title: "Compare Options", description: "Walls vs cable car, Lokrum vs Old Town, DIY vs guided — honest comparisons.", href: "/compare/city-walls-vs-cable-car", cta: "Compare options" },
  { slug: "ship-schedules", number: "06", title: "Cruise Ship Schedules", description: "See which ships call at Dubrovnik and plan around published arrival and departure times.", href: "/ship-schedules/dubrovnik", cta: "View schedules" },
  { slug: "one-day", number: "07", title: "One Day in Dubrovnik", description: "Hour-by-hour sample itineraries from gangway to all-aboard.", href: "/guides/one-day-in-dubrovnik", cta: "One-day guide" },
  { slug: "faq", number: "08", title: "FAQ", description: "Dubrovnik cruise port questions answered — timing, taxis, excursions and return buffers.", href: "/faq", cta: "Read FAQs" },
];

export function getHomepageFaqs(): FAQ[] {
  return [
    {
      question: "How far is Dubrovnik Old Town from the cruise port?",
      answer: "About 2.5 km from Gruž terminal — 10–15 minutes by taxi or 25–35 minutes walking along the waterfront to Pile Gate.",
    },
    {
      question: "Can I walk the city walls on a Dubrovnik port day?",
      answer: "Yes on calls of 7+ usable hours. Allow 1.5–2.5 hours for the circuit plus transfer, with a 60–90 minute return buffer. Buy tickets online in peak season.",
    },
    {
      question: "Should I book a shore excursion or explore independently?",
      answer: "Old Town is excellent for independent walks. City walls, cable car and Lokrum benefit from pre-booked tickets or tours — see our DIY vs guided comparison.",
    },
    {
      question: "What is the best Dubrovnik excursion for first-timers?",
      answer: "Dubrovnik Highlights combining walls, Old Town and cable car on 8+ hour calls — or a focused Old Town walk on shorter calls. See our first-timer guide.",
    },
    {
      question: "Where do cruise ships dock in Dubrovnik?",
      answer: "At Gruž (Gruz) commercial cruise terminal, east of the Old Town. Confirm your cruise app for berth assignment — most ships dock directly at the terminal.",
    },
  ];
}
`,
);

w(
  "schedules.ts",
  `import type { ScheduleEntry, ShipSchedulePort } from "./types";
import {
  filterEntriesByMonth,
  filterEntriesByYear,
  getMonthsWithEntries,
  type ScheduleYear,
} from "@/lib/schedule-utils";
import dubrovnikSchedule from "./imported-schedules/dubrovnik.json";

const SCHEDULE_FAQS = [
  {
    question: "How accurate are Dubrovnik cruise ship schedules?",
    answer:
      "Schedules are compiled from published timetables and updated periodically. Times and berths can change — confirm with your cruise line before booking excursions.",
  },
  {
    question: "How far is the Old Town from Gruž cruise terminal?",
    answer:
      "About 2.5 km — 10–15 minutes by taxi or 25–35 minutes on foot to Pile Gate. Allow extra time when multiple ships share the port.",
  },
  {
    question: "Can I walk the city walls on a short port call?",
    answer:
      "Calls under 7 usable hours are tight — choose Old Town only or a wall tour with pre-booked entry. Standard 8–11 hour calls suit the full wall circuit.",
  },
];

const SCHEDULE_TIPS = [
  "Check how many ships share your port day before booking wall tickets or excursions",
  "Buy city walls and cable car tickets online on multi-ship days",
  "Allow 60–90 minute return buffer from Old Town to Gruž terminal",
  "Start at Pile Gate before 10:00 when possible to beat wall queues",
];

export const schedulePorts: ShipSchedulePort[] = [
  {
    slug: "dubrovnik",
    name: "Dubrovnik (Gruž)",
    country: "Croatia",
    seoTitle: "Dubrovnik Cruise Ship Schedule 2026",
    metaDescription:
      "Dubrovnik cruise ship schedule — see which ships call at Gruž terminal and plan shore excursions around published arrival and departure times.",
    intro:
      "Dubrovnik is a flagship Adriatic port of call. Check scheduled arrivals and departures before booking city walls, cable car or Lokrum excursions.",
    description: "Croatia's walled-city cruise gateway — UNESCO Old Town 2.5 km from Gruž terminal.",
    scheduleOverview:
      "Peak cruise traffic April through October, with heaviest calls June to September on Adriatic and Eastern Mediterranean itineraries.",
    planningTips: SCHEDULE_TIPS,
    faqs: SCHEDULE_FAQS,
  },
];

const scheduleData: Record<string, ScheduleEntry[]> = {
  dubrovnik: dubrovnikSchedule as ScheduleEntry[],
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
  title: "Dubrovnik Cruise Port Guide",
  subtitle: "Gruž terminal, taxis to Pile Gate, shuttles and return-to-ship timing for cruise passengers.",
  terminals: [
    {
      name: "Gruž (Gruz) Cruise Terminal",
      quay: "Main commercial cruise berth",
      usedBy: "Most large ships — MSC, Celebrity, Royal Caribbean, Norwegian, Viking and others",
      cityAccess: "Taxi 10–15 min to Pile Gate; port shuttles and Line 1A/1B buses in season; excursion coaches at terminal exit",
    },
    {
      name: "Tender operations",
      quay: "Anchorage in Gruž Bay",
      usedBy: "Occasional overflow when berths are full or for very large vessels",
      cityAccess: "Tender to Gruž area then taxi or shuttle to Old Town — add 30–45 minutes to your planning",
    },
    {
      name: "Old Town harbour",
      quay: "Small-boat pier — not cruise berth",
      usedBy: "Lokrum ferries and excursion boats — passengers reach via taxi from Gruž",
      cityAccess: "10–15 min taxi from terminal to Old Town harbour for Lokrum and coastal departures",
    },
  ] as Terminal[],
  sections: [
    {
      heading: "Where cruise ships dock in Dubrovnik",
      paragraphs: [
        "Dubrovnik cruise ships dock at the Gruž (Gruz) commercial cruise terminal on the city's western harbour, about 2.5 km from Pile Gate — the main western entrance to the walled Old Town.",
        "Unlike some Mediterranean ports where heritage sits an hour away, Dubrovnik's UNESCO core is genuinely reachable in 10–15 minutes by taxi. Peak season can see two or three ships sharing a single day — wall and cable car queues build accordingly.",
        "Dubrovnik appears on Adriatic, Greek Isles and Eastern Mediterranean itineraries from April through October, with heaviest traffic June to September.",
      ],
    },
    {
      heading: "Getting from Gruž to Dubrovnik Old Town",
      paragraphs: [
        "Pile Gate is 2.5 km from Gruž terminal — roughly 10–15 minutes by taxi (€12–18) or 25–35 minutes walking along the waterfront promenade past Lapad.",
        "Port shuttle buses and public Line 1A/1B services run toward Old Town in season. Excursion coaches and minivans meet passengers at the terminal exit with name boards or line flags.",
        "Mount Srđ cable car lower station sits above the Old Town — reach via Pile Gate area then a short uphill walk. Lokrum ferries depart from Old Town harbour — taxi from Gruž first, not from the cruise terminal pier.",
      ],
    },
    {
      heading: "Facilities and practicalities",
      paragraphs: [
        "Gruž terminal offers toilets, seating, tourist information and a taxi rank outside the building. ATMs and larger shops sit closer to Old Town — withdraw euros on the ship if needed.",
        "Currency is the euro. Croatian is the local language; English is widely spoken in tourist areas. Download offline maps — terminal Wi-Fi is unreliable.",
        "Dubrovnik is compact and generally safe. Watch polished marble when wet and belongings in crowded Stradun when multiple ships are in port.",
      ],
    },
    {
      heading: "Return-to-ship timing",
      paragraphs: [
        "Confirm all-aboard time — usually 30–60 minutes before departure. Keep a 60–90 minute buffer beyond your expected travel time, especially returning from Old Town when wall or cable car queues run long.",
        "Independent walkers should book a return taxi 90 minutes before all-aboard. Ship excursions carry delay guarantees; reputable independent operators track departure but will not wait if you separate from the group.",
        "Tender operations require an earlier return — allow extra margin to queue for the tender boat back to your ship.",
      ],
    },
  ] as PortGuideSection[],
  faqs: [
    {
      question: "How far is Dubrovnik Old Town from the cruise port?",
      answer: "About 2.5 km — 10–15 minutes by taxi or 25–35 minutes walking along the waterfront to Pile Gate.",
    },
    {
      question: "Can I walk from the cruise ship to Dubrovnik Old Town?",
      answer: "Yes — follow the waterfront promenade toward Lapad and Pile Gate. Comfortable shoes recommended; taxis are faster in summer heat.",
    },
    {
      question: "Do cruise ships tender in Dubrovnik?",
      answer: "Occasionally when berths are full. Tendering adds 30–45 minutes — confirm on your cruise app the evening before.",
    },
    {
      question: "How much time do I need to return from the city walls?",
      answer: "Allow 10–15 minutes taxi from Pile Gate to Gruž plus a 60–90 minute buffer before all-aboard. Peak-season queues at the walls exit can add 15–20 minutes.",
    },
  ] as FAQ[],
};

export const terminals = portGuideContent.terminals;
export const portGuideSections = portGuideContent.sections;
export const portGuideFaqs = portGuideContent.faqs;
`,
);

w(
  "faqs.ts",
  `import type { FAQ } from "./types";
import { getHomepageFaqs } from "./homepage";

export const extraFaqs: FAQ[] = [
  {
    question: "Where do cruise ships dock in Dubrovnik?",
    answer:
      "At Gruž (Gruz) commercial cruise terminal, about 2.5 km from Pile Gate. Some vessels tender in peak season — check your cruise app.",
  },
  {
    question: "How long does the city walls walk take?",
    answer:
      "The full circuit is roughly 2 km and takes 60–90 minutes at a moderate pace. Add 20–30 minutes for ticket queues in July and August without pre-booking.",
  },
  {
    question: "Can I visit Dubrovnik Old Town without a shore excursion?",
    answer:
      "Yes — taxi to Pile Gate or walk 25–35 minutes from Gruž. Pre-book wall tickets online if adding the rampart circuit.",
  },
  {
    question: "What is the best Dubrovnik excursion for first-time visitors?",
    answer:
      "Dubrovnik Highlights combining walls, Old Town and cable car on 8+ hour calls — or a focused Old Town walk on shorter calls.",
  },
  {
    question: "Should I book excursions through my cruise line?",
    answer:
      "Ship tours guarantee the vessel waits if their excursion is late. Reputable independent operators track all-aboard with buffers — often smaller groups and lower prices.",
  },
  {
    question: "Is a Dubrovnik port day long enough for walls and Lokrum?",
    answer:
      "Tight on standard 8-hour calls — choose walls OR Lokrum as your second anchor. Highlights tours sequence sights for experienced passengers on longer calls.",
  },
  {
    question: "How early should I return to Gruž from the Old Town?",
    answer:
      "Allow 10–15 minutes taxi plus 60–90 minutes before all-aboard. Wall exit queues and Stradun crowds can add time on multi-ship days.",
  },
  {
    question: "What currency is used in Dubrovnik?",
    answer:
      "The euro. Cards work in most Old Town establishments; carry cash for small konobas, buses and taxis.",
  },
  {
    question: "Are Dubrovnik shore excursions suitable for limited mobility?",
    answer:
      "Old Town marble and wall steps are challenging. Cable car, Lovrijenac exterior and private tours with vehicle drops work better than full wall circuits.",
  },
  {
    question: "When is peak cruise season in Dubrovnik?",
    answer:
      "April through October, with heaviest ship traffic June to September. Book wall tickets and excursions before sailing in July and August.",
  },
];

export function getAllFaqs(): FAQ[] {
  return [...getHomepageFaqs(), ...extraFaqs];
}
`,
);

w("imported-schedules/dubrovnik.json", "[]\n");

console.log("Dubrovnik data generation complete.");
