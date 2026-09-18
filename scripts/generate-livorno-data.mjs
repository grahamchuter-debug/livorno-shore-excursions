#!/usr/bin/env node
/**
 * Generates Livorno / Tuscany cruise planning content data files.
 * Run: node scripts/generate-livorno-data.mjs
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
  "Cruise ships dock at Livorno's commercial cruise terminal (Molo Garibaldi / Darsena Toscana), the gateway to Tuscany. Florence is roughly 90 km inland, Pisa about 25 km south and Lucca 35 km east. Most passengers reach Tuscany by coach excursion, private transfer or regional train from Livorno Centrale. Build a 60–90 minute buffer before all-aboard — motorway traffic returning from Florence can add 20–40 minutes on peak summer days.";

const GT = `[
      { method: "Regional train from Livorno Centrale", detail: "Direct services to Florence SMN, Pisa Centrale and Lucca — allow 15–20 min taxi from cruise terminal to station.", time: "20–75 min", cost: "€3–12" },
      { method: "Shore excursion coach", detail: "Door-to-door with guide, timed return and skip-the-line options where available.", time: "Full day", cost: "Tour price" },
      { method: "Private transfer", detail: "Pre-booked car or minivan to Florence, Pisa, Lucca or wine country.", time: "25–90 min", cost: "€120–350" },
    ]`;

const PORT_LOGISTICS =
  "Ships dock at Livorno cruise terminal. Allow 15–20 minutes taxi to Livorno Centrale for trains, or meet your coach at the terminal exit. Confirm all-aboard and keep a 60–90 minute buffer — summer motorway traffic from Florence and Pisa can delay returns by 20–40 minutes.";

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
    seoTitle: "${esc(cfg.seoTitle || cfg.optionA + " vs " + cfg.optionB + " — Livorno Cruise Passengers")}",
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
    slug: "florence-from-livorno",
    name: "Florence from Livorno",
    title: "Florence from Livorno Cruise Port",
    seoTitle: "Florence from Livorno — Shore Excursions & Train Guide for Cruise Passengers",
    meta: "How to reach Florence from Livorno cruise port — travel times, Duomo, Uffizi, David and return-to-ship planning for Tuscany cruise passengers.",
    tagline: "The Renaissance capital of the world — ninety minutes from your ship.",
    overview: "Florence is the reason most passengers choose Livorno. From the cruise terminal, coach excursions or trains deliver you to Piazza del Duomo, the Uffizi and Michelangelo's David within 75–90 minutes.",
    body2: "A full Florence day needs 6–7 usable hours ashore minimum. Prioritise the Duomo exterior, Piazza della Signoria, Ponte Vecchio and either the Accademia (David) or Uffizi — not both on a standard call unless you book skip-the-line entry.",
    body3: "Return coaches typically depart Florence by 15:30–16:00 for 17:00–18:00 all-aboard. Independent travellers on the train should allow 90 minutes buffer including taxi to terminal and potential motorway delays.",
    distance: "About 90 km / 75–90 min from Livorno terminal",
    travel: "75–90 minutes by coach or train",
    timeNeeded: "Allow 5–6 hours in Florence on a full-day excursion",
    highlights: ["Duomo and Brunelleschi's dome", "Ponte Vecchio", "Michelangelo's David at the Accademia", "Uffizi Gallery masterpieces"],
    tips: ["Book Accademia or Uffizi tickets weeks ahead in summer", "Wear comfortable shoes — Florence is compact but cobbled", "Start at the Duomo before midday crowds peak"],
    faqs: [
      ["Can I visit Florence on a Livorno port day?", "Yes on calls of 8+ usable hours. Standard 9–10 hour port days suit a focused Florence excursion with 5–6 hours in the city."],
      ["Is the train faster than a coach?", "Door-to-door, coaches are often quicker. Trains suit confident independent travellers — see our train vs transfer comparison."],
    ],
    related: ["florence-walking-guide", "florence-duomo", "ponte-vecchio", "michelangelo-david"],
    excursion: "renaissance-florence",
  },
  {
    slug: "pisa-from-livorno",
    name: "Pisa from Livorno",
    title: "Pisa from Livorno Cruise Port",
    seoTitle: "Pisa from Livorno — Leaning Tower Shore Excursions & Timings",
    meta: "Reach Pisa and the Leaning Tower from Livorno cruise port — travel times, Field of Miracles, walking distances and return-to-ship confidence.",
    tagline: "Italy's most recognisable landmark — just 25 km from your ship.",
    overview: "Pisa is Livorno's closest major Tuscan destination. The Leaning Tower and Field of Miracles sit 25 km south — reachable in 30–45 minutes by coach, train or private transfer.",
    body2: "Most cruise excursions allow 2–3 hours at the Field of Miracles: the tower, cathedral, baptistery and camposanto. Climbing the tower requires pre-booked timed entry — slots sell out weeks ahead in summer.",
    body3: "Pisa pairs naturally with Lucca on combo excursions, or with Florence on longer port days. For photography, morning light on the tower is best before 11:00.",
    distance: "About 25 km / 30–45 min from Livorno terminal",
    travel: "30–45 minutes by road or train",
    timeNeeded: "Allow 2–3 hours at the Field of Miracles",
    highlights: ["Leaning Tower of Pisa", "Pisa Cathedral", "Baptistery of St John", "Historic centre along the Arno"],
    tips: ["Pre-book tower climb tickets online", "Leave bags at the free deposit before climbing", "Combine with Lucca only on 9+ hour calls"],
    faqs: [
      ["How far is Pisa from Livorno cruise port?", "About 25 km — 30–45 minutes by coach or regional train from Livorno Centrale."],
      ["Can I climb the Leaning Tower on a port day?", "Yes with pre-booked timed entry. Allow 30 minutes for the climb plus 2 hours for the complex."],
    ],
    related: ["leaning-tower-guide", "pisa-walking-guide", "florence-from-livorno"],
    excursion: "florence-and-pisa",
  },
  {
    slug: "lucca-from-livorno",
    name: "Lucca from Livorno",
    title: "Lucca from Livorno Cruise Port",
    seoTitle: "Lucca from Livorno — City Walls & Hidden Tuscany Guide",
    meta: "Visit Lucca's Renaissance walls and historic centre from Livorno cruise port — travel times, cycling the ramparts and return planning.",
    tagline: "A perfectly preserved walled city — Tuscany's most charming alternative to the crowds.",
    overview: "Lucca offers a gentler Tuscan experience than Florence or Pisa. Its intact Renaissance walls, tree-lined ramparts and quiet piazzas suit passengers who want culture without crush.",
    body2: "The walled centre is compact — walk the ramparts (4 km circuit) or hire a bicycle, visit San Michele and climb Torre Guinigi for panoramic views. Most excursions allow 2.5–3 hours in Lucca.",
    body3: "Lucca pairs well with Pisa on combo tours or stands alone on shorter calls when Florence feels too ambitious. Independent travellers can reach Lucca by train in about 30 minutes from Livorno Centrale.",
    distance: "About 35 km / 45–60 min from Livorno terminal",
    travel: "45–60 minutes by coach; 30 min by train",
    timeNeeded: "Allow 2.5–3 hours in Lucca",
    highlights: ["Renaissance city walls", "Piazza dell'Anfiteatro", "Torre Guinigi", "San Michele in Foro"],
    tips: ["Rent a bicycle to cycle the walls — the classic Lucca experience", "Try buccellato, Lucca's aniseed bread", "Less crowded than Florence — ideal for relaxed port days"],
    faqs: [
      ["Is Lucca worth visiting instead of Florence?", "For a calmer, walkable experience — yes. See our Florence vs Lucca comparison for honest advice."],
      ["Can I cycle the city walls?", "Yes — bike hire shops near the walls rent for €3–5 per hour. Allow 45–60 minutes for the full circuit."],
    ],
    related: ["lucca-city-walls", "hidden-tuscany", "pisa-from-livorno"],
    excursion: "pisa-lucca-combo",
  },
  {
    slug: "bolgheri-wine-region",
    name: "Bolgheri Wine Region",
    title: "Bolgheri Wine Region from Livorno",
    seoTitle: "Bolgheri Wine Region from Livorno — Super Tuscan Wine Tours",
    meta: "Visit Bolgheri's cypress-lined vineyards and Super Tuscan wineries from Livorno cruise port — wine tasting, timing and shore excursion advice.",
    tagline: "Cypress avenues and world-famous Super Tuscans — wine country at its most cinematic.",
    overview: "Bolgheri sits on the Tuscan coast south of Livorno, famous for Sassicaia, Ornellaia and the iconic cypress-lined Via Bolgheri. Wine-focused excursions typically include two cellar visits and lunch.",
    body2: "The drive takes 45–60 minutes each way through coastal Maremma countryside. Most wine tours allow 3–4 hours in the region with guided tastings at premium estates — book well ahead for summer sailings.",
    body3: "Bolgheri suits food and wine lovers on 8+ hour calls who have already seen Florence or Pisa. Combine with a coastal viewpoint for photography of the famous cypress avenue.",
    distance: "About 60 km / 45–60 min south of Livorno",
    travel: "45–60 minutes each way by coach",
    timeNeeded: "Allow 4–5 hours including tastings",
    highlights: ["Via Bolgheri cypress avenue", "Super Tuscan wine tastings", "Medieval Bolgheri village", "Castello di Bolgheri"],
    tips: ["Book winery visits weeks ahead — estates limit cruise-day groups", "Eat lightly before multiple tastings", "Designated drivers are provided on guided tours"],
    faqs: [
      ["Can I visit Bolgheri on a standard port day?", "Yes on 8+ hour calls with a dedicated wine excursion. Allow 45–60 minutes each way plus 3 hours for tastings."],
      ["Do I need to pre-book winery visits?", "Yes — premium estates require reservations and may not accept walk-ins, especially during cruise season."],
    ],
    related: ["tuscan-wine-guide", "taste-tuscany", "food-wine-experiences"],
    excursion: "bolgheri-wine-tour",
  },
  {
    slug: "tuscan-wine-guide",
    name: "Tuscan Wine",
    title: "Tuscan Wine Guide for Cruise Passengers",
    seoTitle: "Tuscan Wine Guide — Chianti, Bolgheri & Super Tuscans from Livorno",
    meta: "Understand Tuscan wine regions reachable from Livorno — Chianti, Bolgheri, Brunello and Super Tuscans with cruise-day tasting advice.",
    tagline: "From Chianti Classico to Super Tuscans — what cruise passengers should know before tasting.",
    overview: "Tuscany produces some of Italy's most celebrated wines. From Livorno, Bolgheri and coastal Maremma are most practical on a port day; Chianti and Montalcino need longer drives.",
    body2: "Super Tuscans (Sassicaia, Tignanello, Ornellaia) put Bolgheri on the map. Chianti Classico offers accessible tastings closer to Florence. Brunello di Montalcino requires a dedicated long day — rarely feasible from Livorno.",
    body3: "Guided wine excursions handle transport, designated drivers and estate reservations. Independent tasting is possible near Lucca or Pisa but needs careful timing for your return.",
    distance: "Bolgheri 60 km; Chianti 80–100 km from Livorno",
    travel: "45–90 minutes depending on region",
    timeNeeded: "Allow 3–4 hours for a wine-focused excursion",
    highlights: ["Bolgheri Super Tuscans", "Chianti Classico vineyards", "Vernaccia di San Gimignano", "Brunello di Montalcino (long day only)"],
    tips: ["Bolgheri is the most photogenic wine region near Livorno", "Book tastings ahead — estates limit group sizes", "See our Taste Tuscany excursion for a curated day"],
    faqs: [
      ["Which wine region is best from Livorno?", "Bolgheri for Super Tuscans and scenery; Chianti if combined with a Florence excursion."],
      ["Can I do a wine tour and Florence in one day?", "Only on very long calls (10+ hours) — see our Florence + Wine combination guide on the homepage."],
    ],
    related: ["bolgheri-wine-region", "tuscan-food-guide", "food-wine-experiences"],
    excursion: "taste-tuscany",
  },
  {
    slug: "tuscan-olive-oil-guide",
    name: "Tuscan Olive Oil",
    title: "Tuscan Olive Oil Guide for Cruise Passengers",
    seoTitle: "Tuscan Olive Oil — Tasting & Village Visits from Livorno",
    meta: "Discover Tuscan extra virgin olive oil from Livorno — frantoio visits, tasting tips and how to combine with wine country excursions.",
    tagline: "Liquid gold from centuries-old groves — the taste of Tuscany beyond the wine glass.",
    overview: "Tuscany's extra virgin olive oil is as celebrated as its wine. Frantoio (mill) visits and grove walks feature on many Taste Tuscany and village excursions from Livorno.",
    body2: "The best olive oil comes from hillside groves around Lucca, the Chianti and Maremma. Many wine estates also produce oil — combined tastings are common on Bolgheri and Chianti tours.",
    body3: "Look for DOP certification and harvest dates on labels. November harvest means freshest oil in early winter sailings; summer cruise passengers taste previous year's vintage.",
    distance: "Varies — Lucca hills 35 km; Maremma 60 km",
    travel: "Included in wine and village excursions",
    timeNeeded: "30–60 minutes for a frantoio visit and tasting",
    highlights: ["Extra virgin DOP Tuscan oil", "Frantoio mill visits", "Combined wine and oil tastings", "Village grove walks"],
    tips: ["Taste oil on plain bread to appreciate quality", "Buy from the estate — airport-friendly sizes available", "Combine with wine tastings on Bolgheri tours"],
    faqs: [
      ["Can I visit an olive oil mill on a port day?", "Yes — most Taste Tuscany and Bolgheri excursions include a frantoio or grove stop."],
      ["When is olive harvest season?", "November in Tuscany. Cruise passengers taste the previous harvest's oil throughout the season."],
    ],
    related: ["tuscan-wine-guide", "tuscan-food-guide", "tuscan-villages"],
    excursion: "taste-tuscany",
  },
  {
    slug: "tuscan-food-guide",
    name: "Tuscan Food",
    title: "Tuscan Food Guide for Cruise Passengers",
    seoTitle: "Tuscan Food Guide — What to Eat on a Livorno Port Day",
    meta: "Essential Tuscan dishes for cruise passengers — bistecca, ribollita, pappa al pomodoro, cacciucco and where to eat near Florence, Pisa and Lucca.",
    tagline: "Bistecca, ribollita and cacciucco — the flavours that define Tuscany.",
    overview: "Tuscan cuisine is honest, seasonal and deeply regional. Cruise passengers encounter it in Florence trattorias, Lucca bakeries, Livorno seafood restaurants and vineyard lunches.",
    body2: "Must-try dishes include bistecca alla fiorentina (Florence), cacciucco fish stew (Livorno), ribollita soup, pappa al pomodoro and Lucca's buccellato bread. Wine excursions often include a multi-course pranzo.",
    body3: "Lunch timing matters on port days — aim to eat 12:30–13:30 so you are not rushing back from Florence at 15:00. Avoid sit-down meals if your excursion returns before 14:00.",
    distance: "Available throughout Tuscany from Livorno excursions",
    travel: "Included in food and wine tours",
    timeNeeded: "Allow 60–90 minutes for a proper Tuscan lunch",
    highlights: ["Bistecca alla fiorentina", "Cacciucco Livornese", "Ribollita and pappa al pomodoro", "Pecorino and local salumi"],
    tips: ["Book trattoria tables ahead in Florence on cruise days", "Try cacciucco in Livorno if you have time before departure", "Vineyard lunches are the easiest food experience on a port day"],
    faqs: [
      ["What should I eat in Florence on a port day?", "Panini or lampredotto from a market, or a quick trattoria lunch near Santa Croce — save bistecca for a longer visit."],
      ["Is Livorno known for seafood?", "Yes — cacciucco fish stew is the city's signature dish. Some passengers dine in Livorno before reboarding."],
    ],
    related: ["tuscan-wine-guide", "food-wine-experiences", "florence-from-livorno"],
    excursion: "taste-tuscany",
  },
  {
    slug: "florence-walking-guide",
    name: "Florence Walking Guide",
    title: "Florence Walking Guide from Livorno",
    seoTitle: "Florence Walking Guide — Cruise Passenger Itinerary & Distances",
    meta: "Walk Florence from Livorno cruise port — hour-by-hour itinerary, distances between sights and return-to-ship timing for cruise passengers.",
    tagline: "Duomo to Ponte Vecchio on foot — the essential Florence walk for cruise passengers.",
    overview: "Florence's historic centre is compact and walkable. From your excursion drop-off, most major sights sit within a 15-minute walk of each other — ideal for a focused Renaissance day.",
    body2: "A classic route: Duomo → Baptistery → Piazza della Signoria → Uffizi exterior → Ponte Vecchio → Santa Croce. Allow 4–5 hours including the Accademia (David) or Uffizi interior visit.",
    body3: "Cobblestones and summer heat make comfortable shoes essential. The centre is largely flat; Torre Arnolfo at Palazzo Vecchio adds steps if you want elevated views.",
    distance: "Historic centre spans roughly 2 km east-west",
    travel: "Walking only once in Florence",
    timeNeeded: "4–5 hours for the core walk plus one museum",
    highlights: ["Duomo and Giotto's Campanile", "Piazza della Signoria", "Ponte Vecchio", "Via de' Tornabuoni"],
    tips: ["Start at the Duomo when your coach arrives", "Pre-book Accademia or Uffizi — walk-ins rarely work on cruise days", "Keep 90 minutes for return coach and motorway"],
    faqs: [
      ["How much walking is involved in Florence?", "Expect 5–8 km on cobbles. The centre is flat but museum queues involve standing."],
      ["Can I see Florence without entering museums?", "Yes — exterior architecture, piazzas and Ponte Vecchio need no tickets and suit shorter calls."],
    ],
    related: ["florence-duomo", "ponte-vecchio", "florence-for-first-time-visitors"],
    excursion: "renaissance-florence",
  },
  {
    slug: "florence-duomo",
    name: "Florence Duomo",
    title: "Florence Duomo Guide for Cruise Passengers",
    seoTitle: "Florence Duomo — Brunelleschi's Dome from Livorno Cruise Port",
    meta: "Visit Florence Cathedral and Brunelleschi's dome from Livorno — tickets, climbing times and cruise-day planning for the Duomo complex.",
    tagline: "Brunelleschi's dome — the defining silhouette of the Renaissance.",
    overview: "The Cathedral of Santa Maria del Fiore dominates Florence's skyline. Brunelleschi's dome, Giotto's campanile and the baptistery doors form the heart of any Florence port day.",
    body2: "Exterior viewing is free and immediate. Climbing the dome (463 steps) or campanile requires timed tickets — book weeks ahead. The combined Duomo pass covers baptistery, museum and climbs.",
    body3: "Dome climbs take 45–60 minutes and are physically demanding. On tight port schedules, admire the exterior and baptistery doors, then prioritise the Accademia for David.",
    distance: "Centrepiece of Florence historic centre",
    travel: "Walk from excursion drop-off",
    timeNeeded: "30 min exterior; 60–90 min with dome climb",
    highlights: ["Brunelleschi's dome", "Giotto's Campanile", "Baptistery bronze doors", "Duomo Museum"],
    tips: ["Book dome tickets online — same-day rarely available in summer", "Dress modestly — shoulders and knees covered", "Morning light is best for facade photography"],
    faqs: [
      ["Can I climb the dome on a cruise port day?", "Yes with pre-booked tickets on 8+ hour calls. Allow 60 minutes plus queue time."],
      ["Is the Duomo free to enter?", "The cathedral nave is free; dome, campanile and baptistery require the combined pass."],
    ],
    related: ["florence-walking-guide", "ponte-vecchio", "michelangelo-david"],
    excursion: "renaissance-florence",
  },
  {
    slug: "ponte-vecchio",
    name: "Ponte Vecchio",
    title: "Ponte Vecchio Guide for Cruise Passengers",
    seoTitle: "Ponte Vecchio Florence — Cruise Day Visit & Photography Tips",
    meta: "Visit Florence's Ponte Vecchio from Livorno — jewellers' shops, best viewpoints and timing for cruise passengers.",
    tagline: "Medieval bridge of goldsmiths — Florence's most romantic crossing.",
    overview: "The Ponte Vecchio spans the Arno with jewellers' shops built along its span — the only bridge in Florence spared during WWII. It is a 10-minute walk from the Duomo and essential on any Florence day.",
    body2: "Walk the bridge in 15–20 minutes; allow extra time for window shopping and photos from the Corridoio Vasariano viewpoints. Sunset sailings may catch golden light if your excursion departs Florence after 16:00.",
    body3: "The bridge is crowded 11:00–15:00 on cruise days. Visit early with your excursion or save it for the return walk toward the coach pickup.",
    distance: "10-minute walk from the Duomo",
    travel: "On foot within Florence",
    timeNeeded: "Allow 20–30 minutes",
    highlights: ["Medieval jewellers' shops", "Arno river views", "Corridoio Vasariano outlook", "Sunset photography"],
    tips: ["Photograph from Ponte Santa Trinita for the classic view", "Shops are expensive — browsing is free", "Pickpockets operate in crowds — secure belongings"],
    faqs: [
      ["How long do I need at Ponte Vecchio?", "20–30 minutes for a walk and photos. Add time if shopping."],
      ["Is Ponte Vecchio included in Florence excursions?", "Yes — all Renaissance Florence tours pass the bridge en route between Duomo and Oltrarno."],
    ],
    related: ["florence-walking-guide", "florence-duomo", "uffizi-gallery"],
    excursion: "renaissance-florence",
  },
  {
    slug: "michelangelo-david",
    name: "Michelangelo's David",
    title: "Michelangelo's David — Accademia Guide for Cruise Passengers",
    seoTitle: "Michelangelo's David from Livorno — Accademia Tickets & Timings",
    meta: "See Michelangelo's David at the Accademia Gallery from Livorno — skip-the-line tickets, visit duration and cruise-day planning.",
    tagline: "The world's most famous sculpture — worth every minute of planning.",
    overview: "Michelangelo's David at the Galleria dell'Accademia is the single most sought-after sight on Florence excursions from Livorno. Timed entry is essential — walk-in queues can exceed two hours.",
    body2: "Allow 60–90 minutes inside: David in the Tribune, unfinished Slaves and the painting galleries. Most shore excursions include pre-booked entry; independent travellers must reserve weeks ahead.",
    body3: "Choose David OR the Uffizi on a standard port day — not both unless your call exceeds 10 usable hours. David wins for first-time visitors; the Uffizi for art enthusiasts.",
    distance: "Accademia is 10 minutes walk north of the Duomo",
    travel: "Walk from Florence excursion drop-off",
    timeNeeded: "60–90 minutes including entry",
    highlights: ["David in the Tribune", "Michelangelo's unfinished Slaves", "Gothic and Renaissance painting galleries"],
    tips: ["Book timed entry online — essential in summer", "No large bags — use free cloakroom", "Arrive 15 minutes before your slot"],
    faqs: [
      ["Do I need to book David tickets in advance?", "Yes — absolutely on cruise days. Excursions include tickets; DIY travellers book at accademia.org."],
      ["David or Uffizi — which should I choose?", "David for the iconic experience; Uffizi for broader Renaissance art. First-timers should choose David."],
    ],
    related: ["uffizi-gallery", "florence-walking-guide", "florence-for-first-time-visitors"],
    excursion: "renaissance-florence",
  },
  {
    slug: "uffizi-gallery",
    name: "Uffizi Gallery",
    title: "Uffizi Gallery Guide for Cruise Passengers",
    seoTitle: "Uffizi Gallery from Livorno — Tickets & Cruise Day Planning",
    meta: "Visit the Uffizi Gallery from Livorno cruise port — Botticelli, da Vinci, timed entry and realistic visit duration for cruise passengers.",
    tagline: "Botticelli's Birth of Venus and the masters of the Renaissance under one roof.",
    overview: "The Uffizi holds the world's finest collection of Renaissance painting. Botticelli, Leonardo, Michelangelo, Raphael and Caravaggio fill rooms that demand 2–3 hours minimum.",
    body2: "Timed entry is mandatory. A focused visit covering Rooms 1–15 (Botticelli, Leonardo, Michelangelo) takes 2 hours; the full collection needs half a day — impractical on most port calls.",
    body3: "Choose the Uffizi over David only if you have already seen David or are a serious art enthusiast on a long port day. First-time visitors should prioritise David.",
    distance: "Between Duomo and Ponte Vecchio on Piazza della Signoria",
    travel: "Walk from excursion drop-off",
    timeNeeded: "2–3 hours for a focused visit",
    highlights: ["Botticelli's Birth of Venus", "Leonardo's Annunciation", "Michelangelo's Tondo Doni", "Caravaggio's Medusa"],
    tips: ["Book timed entry weeks ahead", "Focus on the second floor — the core collection", "Download the Uffizi app for room-by-room navigation"],
    faqs: [
      ["Can I visit the Uffizi on a standard port day?", "Yes on 9+ hour calls with pre-booked entry. Allow 2–3 hours inside plus travel from Livorno."],
      ["Uffizi or Accademia for first-timers?", "Accademia (David) — more iconic in less time. Uffizi rewards repeat visitors and art lovers."],
    ],
    related: ["michelangelo-david", "florence-walking-guide", "florence-duomo"],
    excursion: "renaissance-florence",
  },
  {
    slug: "pisa-walking-guide",
    name: "Pisa Walking Guide",
    title: "Pisa Walking Guide from Livorno",
    seoTitle: "Pisa Walking Guide — Field of Miracles & Historic Centre",
    meta: "Walk Pisa from Livorno cruise port — Field of Miracles circuit, tower climb and return timing for cruise passengers.",
    tagline: "From the Leaning Tower to the Arno — Pisa on foot in two hours.",
    overview: "Pisa's Field of Miracles (Piazza dei Miracoli) is compact and flat — ideal for cruise passengers with limited time. The tower, cathedral, baptistery and camposanto sit within 500 metres.",
    body2: "Allow 2–3 hours: 30 minutes for exterior photos, optional 30-minute tower climb, 30 minutes for cathedral and baptistery interiors, and a stroll along Borgo Stretto to the Arno.",
    body3: "The historic centre beyond the Field of Miracles is pleasant but secondary on port days. Most excursions focus on the piazza and skip the university quarter.",
    distance: "Field of Miracles is 1.5 km from Pisa Centrale station",
    travel: "Walk from coach drop-off at Piazza dei Miracoli",
    timeNeeded: "2–3 hours for the core visit",
    highlights: ["Leaning Tower", "Pisa Cathedral", "Baptistery", "Camposanto Monumentale"],
    tips: ["Pre-book tower climb — deposit bags at the free cloakroom", "Morning light for tower photography", "Wear comfortable shoes — lawns are uneven"],
    faqs: [
      ["How much walking in Pisa?", "1–2 km on flat ground. The Field of Miracles is fully accessible."],
      ["Can I skip the tower and still enjoy Pisa?", "Absolutely — exterior views and cathedral interiors are impressive without climbing."],
    ],
    related: ["leaning-tower-guide", "pisa-from-livorno", "pisa-for-first-time-visitors"],
    excursion: "florence-and-pisa",
  },
  {
    slug: "leaning-tower-guide",
    name: "Leaning Tower of Pisa",
    title: "Leaning Tower Guide for Cruise Passengers",
    seoTitle: "Leaning Tower of Pisa — Climb Tickets & Livorno Port Day Guide",
    meta: "Climb the Leaning Tower of Pisa from Livorno — timed tickets, what to expect and return-to-ship confidence for cruise passengers.",
    tagline: "294 steps to the most famous tilt in the world.",
    overview: "The Leaning Tower of Pisa is the icon of Tuscany — and the closest major landmark to Livorno cruise port. Climbing the tower is optional but unforgettable with pre-booked timed entry.",
    body2: "The climb takes 30 minutes (294 steps, no lift). You feel the tilt immediately — hold the handrail. Only 45 people ascend at a time in 30-minute slots. Bags must be deposited at the free cloakroom.",
    body3: "Without climbing, exterior photography and cathedral entry still make Pisa worthwhile. The tower is best photographed from the cathedral side lawn in morning light.",
    distance: "Piazza dei Miracoli, Pisa",
    travel: "30–45 minutes from Livorno by coach",
    timeNeeded: "30 min climb; 2 hours total at the complex",
    highlights: ["Tower climb with panoramic views", "Cathedral interior", "Baptistery acoustics", "Classic tower photographs"],
    tips: ["Book climb tickets at opapisa.it weeks ahead", "Arrive 15 minutes before your slot with ID", "Children under 8 cannot climb"],
    faqs: [
      ["Can I climb the tower on a port day?", "Yes with pre-booked timed entry. Allow 30 minutes for the climb plus travel from Livorno."],
      ["What if tower tickets are sold out?", "Exterior views and cathedral remain worthwhile — or choose a Lucca excursion instead."],
    ],
    related: ["pisa-walking-guide", "pisa-from-livorno", "florence-and-pisa"],
    excursion: "florence-and-pisa",
  },
  {
    slug: "lucca-city-walls",
    name: "Lucca City Walls",
    title: "Lucca City Walls Guide for Cruise Passengers",
    seoTitle: "Lucca City Walls — Walk & Cycle the Ramparts from Livorno",
    meta: "Walk or cycle Lucca's Renaissance walls from Livorno cruise port — 4 km circuit, bike hire and cruise-day timing.",
    tagline: "Four kilometres of tree-lined ramparts — Tuscany's most peaceful walk.",
    overview: "Lucca's intact Renaissance walls are unique in Italy — wide enough to walk or cycle, shaded by plane trees and offering views over terracotta rooftops. The classic Lucca experience for cruise passengers.",
    body2: "The full circuit is 4 km and takes 45–60 minutes on foot or 30 minutes by bicycle. Bike hire shops near Porta Santa Maria rent for €3–5 per hour. The walls are flat and accessible.",
    body3: "Combine the wall walk with Piazza dell'Anfiteatro and Torre Guinigi on a 2.5–3 hour Lucca visit. Less demanding than Florence — ideal for families and relaxed travellers.",
    distance: "Lucca historic centre, 35 km from Livorno",
    travel: "45–60 minutes by coach from Livorno",
    timeNeeded: "45–60 minutes for the wall circuit",
    highlights: ["4 km tree-lined ramparts", "Bicycle hire and cycle circuit", "Views over terracotta rooftops", "Porta San Pietro and bastions"],
    tips: ["Rent a bicycle — the definitive Lucca experience", "Start at Porta Santa Maria for easy bike hire", "Combine with gelato in Piazza dell'Anfiteatro"],
    faqs: [
      ["Can I walk the walls on a port day?", "Yes — the full circuit fits within a 2.5–3 hour Lucca excursion."],
      ["Are the walls suitable for limited mobility?", "The ramparts are wide and mostly flat — easier than Florence's cobbles or Pisa's tower steps."],
    ],
    related: ["lucca-from-livorno", "hidden-tuscany", "pisa-or-lucca"],
    excursion: "pisa-lucca-combo",
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

// ─── EXPERIENCES (12 GuidePage audience guides) ─────────────────────────────

const experiences = [
  {
    slug: "hidden-tuscany",
    title: "Hidden Tuscany from Livorno",
    seoTitle: "Hidden Tuscany Shore Excursions — Villages & Countryside from Livorno",
    meta: "Discover hidden Tuscany from Livorno cruise port — Lucca hills, hilltop villages, olive groves and uncrowded alternatives to Florence.",
    tagline: "Beyond the coach convoys — Tuscany's quieter corners within reach of your ship.",
    overview: "Most Livorno passengers head straight for Florence or Pisa. Hidden Tuscany rewards those who want cypress lanes, walled villages and vineyard lunches without the Duomo crush — Lucca, Bolgheri backroads and the hills above the coast.",
    body1: "Lucca is the anchor for hidden Tuscany on a port day — Renaissance walls, Piazza dell'Anfiteatro and bike rides on the ramparts suit passengers who find Florence overwhelming. Combo tours add Pisa in the morning and Lucca in the afternoon.",
    body2: "Dedicated hidden Tuscany excursions drive inland through olive groves and medieval borghi — often including a frantoio stop and village pranzo. These need 8+ usable hours and book out early in summer.",
    body3: "Do not attempt Florence plus hidden villages on a standard call — pick one theme. Repeat Tuscany visitors and food lovers get the most from this slower pace.",
    highlights: ["Lucca walls and quiet piazzas", "Hilltop villages and olive groves", "Bolgheri cypress avenues", "Village lunches away from crowds"],
    tips: ["Choose Lucca over Florence if crowds stress you", "Hidden Tuscany tours need 8+ hour calls", "Book village lunches ahead on cruise days"],
    faqs: [
      ["Is hidden Tuscany realistic on a port day?", "Yes — Lucca alone fits 7+ hours; full village tours need 8–9 usable hours ashore."],
      ["Hidden Tuscany or Florence?", "Florence for first-timers; hidden Tuscany for repeat visitors and relaxed travellers."],
    ],
    recommendations: [
      { cat: "hidden-gem", title: "Hidden Tuscany Day", desc: "Villages, groves and a paced countryside route.", href: "/shore-excursions/hidden-tuscany-day" },
      { cat: "best-historic", title: "Pisa & Lucca Combo", desc: "Tower in the morning, walled Lucca in the afternoon.", href: "/shore-excursions/pisa-lucca-combo" },
      { cat: "best-food", title: "Taste Tuscany", desc: "Wine, oil and Tuscan lunch in the hills.", href: "/shore-excursions/taste-tuscany" },
    ],
    related: ["lucca-from-livorno", "tuscan-villages", "scenic-tuscany"],
    imageKey: "history",
  },
  {
    slug: "one-day-in-tuscany",
    title: "One Day in Tuscany from Livorno",
    seoTitle: "One Day in Tuscany from Livorno Cruise Port — Sample Itineraries",
    meta: "Plan one day in Tuscany from Livorno — hour-by-hour Florence, Pisa and combo itineraries with return-to-ship timing for cruise passengers.",
    tagline: "Gangway to all-aboard — realistic Tuscany schedules that actually work.",
    overview: "A Livorno port day gives you 7–9 usable hours ashore after embarkation formalities. One day in Tuscany means choosing a single regional anchor — Florence, Pisa, Lucca or wine country — not all four.",
    body1: "Classic full day: 07:30 depart terminal, 09:00–14:30 in Florence (Duomo, David, Ponte Vecchio), 16:00–17:00 back at ship. Pisa-only days allow a slower pace with tower climb and Lucca add-on on 9+ hour calls.",
    body2: "Build every itinerary backward from all-aboard. Summer A12 motorway delays from Florence routinely add 20–40 minutes — your excursion operator should depart Florence by 15:30 on 17:00–18:00 sailings.",
    body3: "Short calls under 7 hours: Pisa Field of Miracles only or Lucca walls — not Florence. Use our cruise planner for a tailored hour-by-hour plan.",
    highlights: ["Florence Renaissance day (8+ hours)", "Pisa tower and Field of Miracles (6+ hours)", "Pisa plus Lucca combo (9+ hours)", "Wine country half-day (8+ hours)"],
    tips: ["Work backward from all-aboard time", "One anchor per day — not Florence and Pisa independently", "Book museum tickets before you sail"],
    faqs: [
      ["Can I see Florence and Pisa in one day?", "Only on organised combo excursions with tight pacing — not independently on standard calls."],
      ["How many usable hours on a typical call?", "Subtract 60–90 minutes for embarkation and return buffer from your port window."],
    ],
    recommendations: [
      { cat: "editors-choice", title: "Tuscany Highlights", desc: "Florence and Pisa sequenced with expert motorway timing.", href: "/shore-excursions/tuscany-highlights" },
      { cat: "best-short-port", title: "Pisa & Lucca Combo", desc: "Closest sights when hours are limited.", href: "/shore-excursions/pisa-lucca-combo" },
      { cat: "best-value", title: "Best excursions ranked", desc: "First-timer comparison for your call length.", href: "/compare/best-tuscany-excursion-first-time-visitors" },
    ],
    related: ["florence-for-first-time-visitors", "best-things-to-do-from-livorno", "livorno-cruise-terminal-guide"],
    imageKey: "highlights",
  },
  {
    slug: "best-things-to-do-from-livorno",
    title: "Best Things to Do from Livorno Cruise Port",
    seoTitle: "Best Things to Do from Livorno — Tuscany for Cruise Passengers",
    meta: "The best things to do from Livorno cruise port — Florence, Pisa, Lucca, wine tours and independent train options ranked for cruise passengers.",
    tagline: "Florence, Pisa, Lucca or the vines — ranked for your port day.",
    overview: "Livorno is Tuscany's cruise gateway — not a destination itself. The best things to do all lie inland: Renaissance Florence, the Leaning Tower, Lucca's walls and Bolgheri's Super Tuscans each suit different call lengths and interests.",
    body1: "First-time visitors: Florence for the Duomo and David, or a Tuscany Highlights combo if you want Florence and Pisa glimpses. Families: Lucca bike rides and Pisa's flat Field of Miracles. Food lovers: Taste Tuscany or Bolgheri wine tours.",
    body2: "Independent travellers with 8+ hours can train to Florence SMN from Livorno Centrale — allow 15–20 minutes taxi to the station plus 75 minutes on the train. Coaches are faster door-to-door for most passengers.",
    body3: "Skip trying to 'see all of Tuscany' in one call. Rank your must-do, match it to your hours, and keep the 60–90 minute return buffer sacred.",
    highlights: ["Florence — Duomo, David, Ponte Vecchio", "Pisa — Leaning Tower and Field of Miracles", "Lucca — walled city and ramparts", "Bolgheri — Super Tuscan wine country"],
    tips: ["Match destination to call length", "Pre-book tower and museum tickets", "Check motorway traffic on summer afternoons"],
    faqs: [
      ["What is the number-one thing from Livorno?", "Florence for first-timers; Pisa if your call is short or you have seen Florence before."],
      ["Is Livorno city worth visiting?", "Cacciucco seafood if time allows — most passengers head straight to Tuscany."],
    ],
    recommendations: [
      { cat: "editors-choice", title: "Renaissance Florence", desc: "Focused Duomo, David and Ponte Vecchio day.", href: "/shore-excursions/renaissance-florence" },
      { cat: "best-historic", title: "Florence & Pisa Combo", desc: "Two icons when hours allow.", href: "/shore-excursions/florence-and-pisa" },
      { cat: "best-independent", title: "Independent Train Guide", desc: "DIY Florence by regional train.", href: "/guides/independent-train-guide" },
    ],
    related: ["best-tuscany-shore-excursions", "florence-from-livorno", "pisa-from-livorno"],
    imageKey: "city",
  },
  {
    slug: "best-tuscany-shore-excursions",
    title: "Best Tuscany Shore Excursions from Livorno",
    seoTitle: "Best Tuscany Shore Excursions from Livorno Cruise Port — Ranked",
    meta: "Ranked Tuscany shore excursions from Livorno — Florence, Pisa, Lucca, wine tours and private options with return-to-ship confidence.",
    tagline: "The excursions that deliver — ranked for cruise passengers at Livorno.",
    overview: "Not every Tuscany tour fits a cruise schedule. The best Livorno shore excursions share three traits: realistic motorway timing, pre-booked entry where queues kill port days, and explicit return buffers before all-aboard.",
    body1: "Editor's Choice: Tuscany Highlights and Renaissance Florence for first-timers. Best value: Pisa & Lucca combo on shorter calls. Ultimate Tuscany: Private Florence with custom museum timing and skip-the-line coordination.",
    body2: "Ship excursions guarantee the vessel waits if their tour runs late; reputable independents track all-aboard with 60–90 minute buffers but will not delay departure if you miss the meeting point.",
    body3: "Book before sailing in July and August — Accademia, tower climb and Bolgheri estate slots sell out weeks ahead on multi-ship days.",
    highlights: ["Tuscany Highlights — Florence and Pisa combo", "Renaissance Florence — David and Duomo focus", "Pisa & Lucca — best for shorter calls", "Bolgheri Wine Tour — Super Tuscan tastings"],
    tips: ["Compare ship vs independent pricing", "Read return-to-ship policies carefully", "Morning departures protect afternoon motorway margins"],
    faqs: [
      ["Best excursion for first-timers?", "Tuscany Highlights on 9+ hour calls; Renaissance Florence if Florence alone is your goal."],
      ["Are independent excursions safe?", "Yes with reputable operators — verify ship-tracking and buffer policies in reviews."],
    ],
    recommendations: [
      { cat: "editors-choice", title: "Tuscany Highlights", desc: "Our top pick for standard port days.", href: "/shore-excursions/tuscany-highlights" },
      { cat: "best-luxury", title: "Private Florence", desc: "Ultimate Tuscany — your pace, your museums.", href: "/shore-excursions/private-florence" },
      { cat: "best-value", title: "First-timer comparison", desc: "Ranked excursions by call length.", href: "/compare/best-tuscany-excursion-first-time-visitors" },
    ],
    related: ["one-day-in-tuscany", "florence-for-first-time-visitors", "diy-vs-guided"],
    imageKey: "highlights",
  },
  {
    slug: "florence-for-first-time-visitors",
    title: "Florence for First-Time Visitors from Livorno",
    seoTitle: "Florence for First-Time Cruise Visitors — Livorno Port Day Guide",
    meta: "First time in Florence from a Livorno cruise? Duomo, David, Uffizi choices and realistic timing for Tuscany first-timers.",
    tagline: "Your first Renaissance day — what to see when hours are finite.",
    overview: "First-time Florence visitors from Livorno face a happy problem: the historic centre is compact but ticketed sights queue for hours in summer. Your port window decides whether you prioritise David, the Duomo exterior or a broader walk.",
    body1: "Standard 9–10 hour calls suit a focused Florence excursion: Duomo and Piazza della Signoria, Accademia for David, Ponte Vecchio — 5–6 hours in the city plus 75–90 minutes each-way transfer.",
    body2: "Choose David OR the Uffizi on a first visit — not both unless your call exceeds 10 usable hours. David wins for the iconic experience; book timed entry weeks ahead or join a tour that includes tickets.",
    body3: "Do not attempt dome climb plus David plus Uffizi on one standard call. Pick two anchors maximum and keep 90 minutes for motorway return to Livorno terminal.",
    highlights: ["Duomo exterior and baptistery doors", "Michelangelo's David at the Accademia", "Ponte Vecchio and Arno views", "Piazza della Signoria"],
    tips: ["Book Accademia tickets before you sail", "Start at the Duomo when your coach arrives", "Wear comfortable shoes on cobbles"],
    faqs: [
      ["David or Uffizi for first-timers?", "David — more iconic in less time. Uffizi rewards art enthusiasts on longer calls."],
      ["Can first-timers go by train?", "Yes — confident travellers only. See our independent train guide and train vs transfer comparison."],
    ],
    recommendations: [
      { cat: "editors-choice", title: "Renaissance Florence", desc: "Duomo, David and Ponte Vecchio with timed entry.", href: "/shore-excursions/renaissance-florence" },
      { cat: "best-historic", title: "Florence Walking Guide", desc: "Hour-by-hour route through the historic centre.", href: "/highlights/florence-walking-guide" },
      { cat: "best-short-port", title: "Florence vs Pisa", desc: "Honest comparison when you must choose one.", href: "/compare/florence-vs-pisa" },
    ],
    related: ["florence-walking-guide", "michelangelo-david", "florence-vs-pisa"],
    imageKey: "city",
  },
  {
    slug: "pisa-for-first-time-visitors",
    title: "Pisa for First-Time Visitors from Livorno",
    seoTitle: "Pisa for First-Time Cruise Visitors — Leaning Tower from Livorno",
    meta: "First time in Pisa from Livorno cruise port? Leaning Tower tickets, Field of Miracles timing and return confidence for first-timers.",
    tagline: "The tower, the cathedral, the photos — Pisa in one port day.",
    overview: "Pisa is Livorno's closest icon — 25 km south, flat, compact and ideal for first-timers on shorter calls or anyone who finds Florence too ambitious. The Field of Miracles fits in 2–3 focused hours.",
    body1: "Allow 30–45 minutes transfer from Livorno terminal, then 2–3 hours at Piazza dei Miracoli: tower photos, optional climb, cathedral and baptistery interiors. Morning light on the tower is best before 11:00.",
    body2: "Tower climb requires pre-booked timed entry at opapisa.it — walk-in slots vanish on cruise days. Deposit bags at the free cloakroom before ascending 294 steps.",
    body3: "Pisa pairs with Lucca on 9+ hour combo excursions. On 6–7 hour calls, Pisa alone is the right scope — do not add Florence.",
    highlights: ["Leaning Tower exterior and climb", "Pisa Cathedral and baptistery", "Camposanto Monumentale", "Classic tower photography"],
    tips: ["Pre-book tower climb tickets online", "Arrive 15 minutes before your climb slot", "Combine with Lucca only on long calls"],
    faqs: [
      ["Is Pisa enough for a full port day?", "Yes on 7–8 hour calls — add Lucca on 9+ hours or Florence only via organised combo."],
      ["Can I skip the tower climb?", "Absolutely — exterior views and cathedral interiors still impress."],
    ],
    recommendations: [
      { cat: "best-short-port", title: "Pisa & Lucca Combo", desc: "Tower morning, walled Lucca afternoon.", href: "/shore-excursions/pisa-lucca-combo" },
      { cat: "editors-choice", title: "Florence & Pisa", desc: "Both icons when hours allow.", href: "/shore-excursions/florence-and-pisa" },
      { cat: "best-photography", title: "Leaning Tower Guide", desc: "Climb tickets and best photo angles.", href: "/highlights/leaning-tower-guide" },
    ],
    related: ["leaning-tower-guide", "pisa-walking-guide", "pisa-or-lucca"],
    imageKey: "fortress",
  },
  {
    slug: "tuscan-villages",
    title: "Tuscan Villages from Livorno",
    seoTitle: "Tuscan Villages from Livorno — Hilltowns & Borghi for Cruise Passengers",
    meta: "Visit Tuscan villages from Livorno cruise port — Lucca, Bolgheri, hilltop borghi and olive-grove hamlets on shore excursions.",
    tagline: "Stone lanes, church bells and vineyard views — village Tuscany at cruise-day pace.",
    overview: "Tuscan villages offer the postcard Italy many passengers expect — terracotta rooftops, cypress alleys and quiet piazzas. From Livorno, Lucca is the most practical village-scale city; Bolgheri and inland borghi feature on wine and hidden Tuscany tours.",
    body1: "Lucca delivers the complete walled-village experience: Piazza dell'Anfiteatro, Torre Guinigi and rampart bike rides in 2.5–3 hours. Smaller borghi on hidden Tuscany excursions add frantoio visits and multi-course pranzo.",
    body2: "San Gimignano and Siena are too far for standard Livorno calls — allow 2+ hours each way. Focus on Lucca, Bolgheri village and coastal Maremma hamlets instead.",
    body3: "Village tours suit food lovers and repeat Tuscany visitors more than first-timers who have not yet seen Florence.",
    highlights: ["Lucca walled centre", "Bolgheri medieval village", "Olive grove hamlets", "Village trattoria lunches"],
    tips: ["Lucca is the best village day from Livorno", "Wear layers — hill towns can be breezy", "Book lunch reservations on cruise days"],
    faqs: [
      ["Can I visit San Gimignano from Livorno?", "Not realistically on a standard port day — 2+ hours each way from terminal."],
      ["Best village for families?", "Lucca — flat ramparts, gelato and bike hire suit all ages."],
    ],
    recommendations: [
      { cat: "hidden-gem", title: "Hidden Tuscany Day", desc: "Village routing away from Florence crowds.", href: "/shore-excursions/hidden-tuscany-day" },
      { cat: "best-families", title: "Pisa & Lucca Combo", desc: "Tower plus bike-friendly walled city.", href: "/shore-excursions/pisa-lucca-combo" },
      { cat: "best-food", title: "Taste Tuscany", desc: "Village lunch with wine and oil tastings.", href: "/shore-excursions/taste-tuscany" },
    ],
    related: ["lucca-from-livorno", "hidden-tuscany", "bolgheri-wine-region"],
    imageKey: "history",
  },
  {
    slug: "scenic-tuscany",
    title: "Scenic Tuscany from Livorno",
    seoTitle: "Scenic Tuscany — Best Views & Drives from Livorno Cruise Port",
    meta: "Scenic Tuscany from Livorno — cypress avenues, hilltop panoramas, coastal Maremma and the best photography stops for cruise passengers.",
    tagline: "Cypress lanes, terracotta hills and coastal light — Tuscany at its most photogenic.",
    overview: "Scenic Tuscany is why passengers tolerate the motorway from Livorno — cypress-lined Via Bolgheri, Lucca rampart views, Florence's Duomo silhouette and Maremma coastal outlooks reward photographers and scenery lovers.",
    body1: "Bolgheri's cypress avenue is the single most photogenic drive near Livorno — most wine tours pause for photos. Lucca's Torre Guinigi and wall circuit deliver rooftop panoramas without Florence's crowds.",
    body2: "Florence offers classic Renaissance scenery: Ponte Santa Trinita for Ponte Vecchio views, Piazzale Michelangelo for the skyline — but only if your excursion includes the extra stop and time allows.",
    body3: "Scenic drives add transfer time — choose scenery OR deep museum visits on standard calls, not both.",
    highlights: ["Via Bolgheri cypress avenue", "Lucca rampart panoramas", "Florence Duomo skyline", "Maremma coastal hills"],
    tips: ["Morning light for Bolgheri cypress photos", "Torre Guinigi opens late — check hours", "Polarising filter helps in bright Tuscan sun"],
    faqs: [
      ["Best single scenic stop?", "Via Bolgheri on a wine tour — iconic and achievable from Livorno."],
      ["Scenic tour or Florence museums?", "Scenery on repeat visits; museums for first-timers."],
    ],
    recommendations: [
      { cat: "best-photography", title: "Bolgheri Wine Tour", desc: "Cypress avenue plus Super Tuscan tastings.", href: "/shore-excursions/bolgheri-wine-tour" },
      { cat: "best-historic", title: "Renaissance Florence", desc: "Duomo silhouette and Arno bridges.", href: "/shore-excursions/renaissance-florence" },
      { cat: "hidden-gem", title: "Hidden Tuscany Day", desc: "Hilltop views without Florence crush.", href: "/shore-excursions/hidden-tuscany-day" },
    ],
    related: ["bolgheri-wine-region", "lucca-city-walls", "florence-duomo"],
    imageKey: "photography",
  },
  {
    slug: "luxury-tuscany-experiences",
    title: "Luxury Tuscany Experiences from Livorno",
    seoTitle: "Luxury Tuscany Shore Excursions — Private Florence & Wine from Livorno",
    meta: "Luxury Tuscany from Livorno cruise port — private Florence tours, premium Bolgheri estates and bespoke wine experiences with VIP pacing.",
    tagline: "Ultimate Tuscany — private transfers, premium estates and zero coach convoys.",
    overview: "Luxury Tuscany from Livorno means private Mercedes or minivan from the terminal, skip-the-line museum coordination, premium Bolgheri estate access and lunch at Michelin-recommended agriturismos — paced to your ship, not a 50-seat coach schedule.",
    body1: "Private Florence tours sequence Accademia, Uffizi or Duomo dome climb according to your priorities — timed entries arranged weeks ahead, guide waiting at the terminal exit, flexible lunch at a reserved trattoria.",
    body2: "Premium wine experiences visit Sassicaia-tier estates with private tastings and chef-prepared lunch — stronger when you have already seen Florence and want an indulgent second visit.",
    body3: "Luxury pricing reflects exclusivity and flexibility — strongest return-to-ship confidence for groups who cannot afford timing mistakes on the A12 motorway.",
    highlights: ["Private vehicle from Livorno terminal", "Skip-the-line museum coordination", "Premium Bolgheri estate tastings", "Bespoke lunch reservations"],
    tips: ["Book two weeks ahead in August", "Share mobility and dietary needs at booking", "Confirm museum ticket availability early"],
    faqs: [
      ["Worth the cost over group tours?", "Yes for mixed interests, VIP museum access or specific photo timing."],
      ["Private Florence plus wine?", "Only on 10+ hour calls — your guide will advise honestly."],
    ],
    recommendations: [
      { cat: "best-luxury", title: "Private Florence", desc: "Ultimate Tuscany — custom Renaissance day.", href: "/shore-excursions/private-florence" },
      { cat: "best-luxury", title: "Bolgheri Wine Tour", desc: "Premium Super Tuscan estates.", href: "/shore-excursions/bolgheri-wine-tour" },
      { cat: "best-food", title: "Taste Tuscany", desc: "Curated wine and gastronomy.", href: "/shore-excursions/taste-tuscany" },
    ],
    related: ["private-florence", "bolgheri-wine-region", "renaissance-florence"],
    imageKey: "luxury",
  },
  {
    slug: "food-wine-experiences",
    title: "Food & Wine Experiences from Livorno",
    seoTitle: "Tuscan Food & Wine Shore Excursions from Livorno Cruise Port",
    meta: "Tuscan food and wine from Livorno — bistecca, Bolgheri Super Tuscans, olive oil tastings and vineyard lunches timed to your ship.",
    tagline: "Bistecca, Brunello and cacciucco — taste Tuscany on a port day.",
    overview: "Tuscan food and wine experiences from Livorno combine vineyard lunches, Super Tuscan tastings and olive oil frantoio visits — ideal for passengers who have seen Florence before or prefer gastronomy over museum queues.",
    body1: "Taste Tuscany excursions typically include two tasting stops, a multi-course pranzo and scenic drives through Chianti foothills or Bolgheri — allow 4–5 hours plus motorway transfer.",
    body2: "Florence food lovers can grab lampredotto panini or a quick trattoria lunch on a Renaissance day — but dedicated food tours need a half-day minimum without adding major sightseeing.",
    body3: "Do not pair a full food tour with Florence museums on standard calls — culinary depth OR David, not both.",
    highlights: ["Bolgheri Super Tuscan tastings", "Tuscan olive oil frantoio visits", "Multi-course vineyard pranzo", "Florence market and trattoria stops"],
    tips: ["Eat lightly before multiple wine tastings", "Flag dietary restrictions at booking", "Vineyard lunch is easiest on a port day"],
    faqs: [
      ["Food tour on an 8-hour call?", "Yes — designed as your primary activity with realistic timing."],
      ["Florence bistecca on a port day?", "Tight — quick lunch yes; full bistecca experience needs a dedicated food focus."],
    ],
    recommendations: [
      { cat: "best-food", title: "Taste Tuscany", desc: "Wine, oil and Tuscan lunch in the hills.", href: "/shore-excursions/taste-tuscany" },
      { cat: "best-food", title: "Bolgheri Wine Tour", desc: "Super Tuscans and cypress-scenery.", href: "/shore-excursions/bolgheri-wine-tour" },
      { cat: "best-value", title: "Food lovers comparison", desc: "Ranked excursions for gastronomes.", href: "/compare/best-tuscany-excursion-food-lovers" },
    ],
    related: ["tuscan-food-guide", "tuscan-wine-guide", "bolgheri-wine-region"],
    imageKey: "food",
  },
  {
    slug: "independent-train-guide",
    title: "Independent Train Guide — Livorno to Florence & Pisa",
    seoTitle: "Livorno to Florence by Train — Independent Cruise Passenger Guide",
    meta: "Reach Florence and Pisa by train from Livorno cruise port — Livorno Centrale timetables, taxi to station and return-to-ship planning.",
    tagline: "Regional trains to Florence SMN — when DIY beats the coach convoy.",
    overview: "Independent train travel from Livorno suits confident cruisers who accept timing risk. Regional services reach Florence Santa Maria Novella in about 75 minutes and Pisa Centrale in 15–20 minutes from Livorno Centrale — but you must taxi 15–20 minutes from the cruise terminal to the station first.",
    body1: "Morning pattern: taxi to Livorno Centrale, train to Florence SMN, walk to Duomo (10 minutes from station). Pre-book Accademia timed entry — walk-ins fail on cruise days. Return train mid-afternoon, taxi to terminal 90 minutes before all-aboard.",
    body2: "Door-to-door coaches are often faster and less stressful than train plus taxi plus station navigation. Trains win on cost for solo travellers and flexibility within Florence once arrived.",
    body3: "No ship delay guarantee on independent travel — miss your planned train and you absorb the risk. See our train vs private transfer comparison before deciding.",
    highlights: ["Livorno Centrale regional services", "75 minutes to Florence SMN", "15–20 minutes to Pisa Centrale", "Taxi link from cruise terminal"],
    tips: ["Buy return tickets at Livorno Centrale", "Validate tickets before boarding", "Allow 90-minute return buffer including taxi"],
    faqs: [
      ["Is the train faster than a coach?", "Rarely door-to-door — coaches meet you at the terminal and drop in Florence centre."],
      ["Can I train to Florence and back on a port day?", "Yes on 8+ hour calls with strict time discipline and pre-booked museum tickets."],
    ],
    recommendations: [
      { cat: "best-independent", title: "Independent Explorer", desc: "Guided safety net with train option.", href: "/shore-excursions/independent-explorer" },
      { cat: "best-value", title: "Train vs Private Transfer", desc: "Honest cost and timing comparison.", href: "/compare/train-vs-private-transfer" },
      { cat: "best-independent", title: "DIY vs Guided", desc: "When independent travel wins.", href: "/compare/diy-vs-guided" },
    ],
    related: ["florence-from-livorno", "train-vs-private-transfer", "diy-vs-guided"],
    imageKey: "port",
  },
  {
    slug: "livorno-cruise-terminal-guide",
    title: "Livorno Cruise Terminal Guide",
    seoTitle: "Livorno Cruise Terminal Guide — Molo Garibaldi & Darsena Toscana",
    meta: "Livorno cruise terminal guide — Molo Garibaldi berth, taxis to Livorno Centrale, coach meeting points and return-to-ship timing.",
    tagline: "Molo Garibaldi, Darsena Toscana — your Tuscany gateway starts here.",
    overview: "Cruise ships dock at Livorno's commercial cruise terminal at Molo Garibaldi / Darsena Toscana — a working port city, not a heritage destination. Excursion coaches, taxis and shuttle services meet passengers at the terminal exit; trains to Florence leave from Livorno Centrale 15–20 minutes away.",
    body1: "Terminal facilities include toilets, seating and tourist information. Taxis queue outside — confirm metered fare to Livorno Centrale (€15–25) or pre-book for Florence transfers. Most shore excursions use coach pickup at the terminal plaza.",
    body2: "Livorno city itself is known for cacciucco fish stew and the Venezia Nuova canal district — some passengers dine ashore before reboarding if their return is early. Most head straight to Tuscany.",
    body3: "Summer motorway traffic on the A12 from Florence adds 20–40 minutes to afternoon returns — build a 60–90 minute buffer before all-aboard regardless of transport mode.",
    highlights: ["Molo Garibaldi cruise berth", "Taxi to Livorno Centrale", "Coach and excursion pickup", "Cacciucco in Venezia Nuova"],
    tips: ["Meet excursions at terminal exit — confirm pickup point", "Carry euros for taxis and station tickets", "Download offline maps — terminal Wi-Fi is patchy"],
    faqs: [
      ["How far is Florence from the cruise terminal?", "About 90 km — 75–90 minutes by coach or train plus station taxi."],
      ["Can I walk to Livorno Centrale?", "Not recommended — 15–20 minutes by taxi through industrial port roads."],
    ],
    recommendations: [
      { cat: "best-short-port", title: "Pisa & Lucca Combo", desc: "Closest sights when transfer time matters.", href: "/shore-excursions/pisa-lucca-combo" },
      { cat: "editors-choice", title: "Tuscany Highlights", desc: "Door-to-door from terminal to Tuscany.", href: "/shore-excursions/tuscany-highlights" },
      { cat: "best-independent", title: "Train Guide", desc: "Regional rail to Florence and Pisa.", href: "/guides/independent-train-guide" },
    ],
    related: ["one-day-in-tuscany", "independent-train-guide", "best-things-to-do-from-livorno"],
    imageKey: "port",
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
// ─── EXCURSIONS (10 ExcursionPage entries) ───────────────────────────────────

const excursions = [
  {
    slug: "tuscany-highlights",
    title: "Tuscany Highlights Shore Excursion",
    seoTitle: "Tuscany Highlights Shore Excursion from Livorno Cruise Port",
    meta: "Florence Duomo, Michelangelo's David and Pisa's Leaning Tower on one cruise-timed highlights tour from Livorno with return-to-ship confidence.",
    category: "Highlights",
    tagline: "Florence and Pisa in one port day — Tuscany's essential duo with expert motorway timing.",
    duration: "9–10 hours",
    pace: "Moderate",
    bestFor: "First-time visitors with a standard 9–10 hour port call",
    overview: "Tuscany Highlights is our Editor's Choice for passengers who want Florence and Pisa without choosing between them. A sequenced route covers the Duomo, Accademia David and Field of Miracles with motorway timing built around your all-aboard.",
    body1: "Morning departures from Livorno reach Florence before midday crowds peak — Duomo exterior, Piazza della Signoria and timed Accademia entry for David, then afternoon transfer to Pisa's Field of Miracles.",
    body2: "Your guide sequences tickets and motorway legs so A12 summer traffic does not consume your return buffer. Typical return to terminal 16:30–17:00 for 18:00 all-aboard.",
    body3: "Requires 9+ usable hours — on shorter calls choose Renaissance Florence or Pisa & Lucca instead.",
    highlights: ["Florence Duomo and historic centre", "Michelangelo's David at the Accademia", "Pisa Leaning Tower and Field of Miracles", "Door-to-door Livorno transfer"],
    included: ["Licensed guide", "Coach transport", "Accademia timed entry where stated", "Return timed to ship"],
    tips: ["Book before sailing in July and August", "Wear comfortable shoes for cobbles", "Eat a substantial breakfast — lunch is quick"],
    faqs: [
      ["Too much for a 9-hour call?", "Tight but standard on organised highlights tours — not recommended under 8.5 usable hours."],
      ["Can I skip Pisa?", "Some operators offer Florence-only variants — confirm when booking."],
    ],
    related: ["renaissance-florence", "florence-and-pisa", "pisa-lucca-combo"],
    featured: true,
  },
  {
    slug: "renaissance-florence",
    title: "Renaissance Florence Shore Excursion",
    seoTitle: "Renaissance Florence Shore Excursion from Livorno Cruise Port",
    meta: "Visit Florence from Livorno — Duomo, Michelangelo's David, Ponte Vecchio and skip-the-line entry on a focused Renaissance day.",
    category: "Florence & culture",
    tagline: "Duomo, David and Ponte Vecchio — a full Renaissance day without the rush of a combo tour.",
    duration: "8–9 hours",
    pace: "Moderate",
    bestFor: "First-timers who want Florence as their single anchor",
    overview: "Renaissance Florence dedicates your port day to the Cradle of the Renaissance — 5–6 hours in the historic centre with pre-booked Accademia entry, Duomo walk and Ponte Vecchio without splitting time with Pisa.",
    body1: "Coach from Livorno terminal reaches Florence in 75–90 minutes. Your guide routes Duomo → Signoria → Accademia → Ponte Vecchio with timed museum entry avoiding two-hour walk-in queues.",
    body2: "Allow 60–90 minutes at the Accademia for David. Optional Uffizi upgrade only on 10+ hour calls — standard days focus on David and exterior architecture.",
    body3: "Afternoon departure from Florence by 15:30–16:00 protects against A12 motorway delays on summer sailings.",
    highlights: ["Duomo and Giotto's Campanile", "Michelangelo's David — timed entry", "Piazza della Signoria", "Ponte Vecchio"],
    included: ["Licensed guide", "Coach transport", "Accademia ticket where stated", "Return timed to ship"],
    tips: ["Book weeks ahead for summer sailings", "Dress modestly for cathedral visits", "Keep 90 minutes for return transfer"],
    faqs: [
      ["David or Uffizi on this tour?", "David is standard — Uffizi only on extended private or long-call variants."],
      ["Florence only vs Tuscany Highlights?", "This tour if Florence is your priority; Highlights if you need Pisa too."],
    ],
    related: ["tuscany-highlights", "florence-and-pisa", "private-florence"],
    featured: true,
  },
  {
    slug: "florence-and-pisa",
    title: "Florence & Pisa Shore Excursion",
    seoTitle: "Florence & Pisa Shore Excursion from Livorno Cruise Port",
    meta: "Combine Florence and Pisa from Livorno — Renaissance highlights and the Leaning Tower on one cruise-timed shore excursion.",
    category: "Highlights",
    tagline: "Renaissance morning, leaning afternoon — Florence and Pisa sequenced for your ship.",
    duration: "9–10 hours",
    pace: "Active",
    bestFor: "Active travellers wanting both Florence and Pisa on one call",
    overview: "Florence & Pisa balances a focused Florence morning — Duomo, David or Signoria walk — with an afternoon at the Field of Miracles. More walking than Tuscany Highlights but similar geography with slightly different pacing.",
    body1: "Morning in Florence allows 4–5 hours: exterior Duomo, Accademia David or a fast historic-centre walk depending on ticket availability. Lunch on the coach or quick panini.",
    body2: "Afternoon at Pisa: 2 hours at Piazza dei Miracoli with optional tower climb if pre-booked. Return via A12 with explicit motorway buffer.",
    body3: "Not suitable for limited mobility or calls under 9 usable hours — choose Pisa & Lucca or Renaissance Florence instead.",
    highlights: ["Florence historic centre walk", "Accademia David or Duomo focus", "Pisa Field of Miracles", "Optional tower climb"],
    included: ["Licensed guide", "Coach transport", "Museum tickets where stated", "Return timed to ship"],
    tips: ["Pre-book tower climb separately if wanted", "Active pacing — expect 8–10 km walking", "Morning Florence beats afternoon coach queues"],
    faqs: [
      ["Difference from Tuscany Highlights?", "Similar geography — compare operator pacing and museum inclusions when booking."],
      ["Tower climb included?", "Usually optional add-on — exterior photos are standard."],
    ],
    related: ["tuscany-highlights", "renaissance-florence", "pisa-lucca-combo"],
    featured: true,
  },
  {
    slug: "taste-tuscany",
    title: "Taste Tuscany Shore Excursion",
    seoTitle: "Taste Tuscany Food & Wine Shore Excursion from Livorno",
    meta: "Taste Tuscany from Livorno — wine tastings, olive oil, vineyard lunch and hill-country scenery on a cruise-timed gastronomy tour.",
    category: "Food & wine",
    tagline: "Super Tuscans, olive oil and pranzo — gastronomy as your port-day anchor.",
    duration: "7–8 hours",
    pace: "Relaxed",
    bestFor: "Food and wine lovers who have seen Florence or prefer tasting over museums",
    overview: "Taste Tuscany replaces museum queues with frantoio visits, cellar tastings and a multi-course vineyard lunch in the hills above Livorno — Chianti foothills or coastal Maremma depending on the season.",
    body1: "Morning departure, scenic drive through olive groves, first tasting mid-morning, seated pranzo 12:30–14:00, optional village stroll, return to terminal mid-afternoon.",
    body2: "Designated drivers and estate reservations handled by the operator. Allow 60–90 minutes seated for lunch — Tuscan pranzo is unhurried.",
    body3: "Does not combine with Florence sightseeing on standard calls — this is your primary activity.",
    highlights: ["Two wine or oil tasting stops", "Multi-course Tuscan lunch", "Scenic hill-country drives", "Estate and frantoio visits"],
    included: ["Food and wine tastings", "Licensed guide", "Lunch where stated", "Return to Livorno terminal"],
    tips: ["Flag dietary needs at booking", "Eat a light breakfast", "Bolgheri variant available on some sailings"],
    faqs: [
      ["Realistic on an 8-hour call?", "Yes — designed as a standalone gastronomy day."],
      ["Vegetarian options?", "Pasta, pecorino and grilled vegetables — notify when booking."],
    ],
    related: ["bolgheri-wine-tour", "hidden-tuscany-day", "food-wine-experiences"],
  },
  {
    slug: "hidden-tuscany-day",
    title: "Hidden Tuscany Day Excursion",
    seoTitle: "Hidden Tuscany Shore Excursion — Villages & Countryside from Livorno",
    meta: "Hidden Tuscany from Livorno — hilltop villages, olive groves and uncrowded lanes away from Florence coach convoys.",
    category: "Hidden Tuscany",
    tagline: "Villages, groves and cypress lanes — Tuscany without the Duomo queues.",
    duration: "8–9 hours",
    pace: "Relaxed",
    bestFor: "Repeat visitors and relaxed travellers avoiding Florence crowds",
    overview: "Hidden Tuscany Day drives inland through borghi, olive groves and vineyard lanes — often combining Lucca hills with a village lunch and frantoio stop. For passengers who have done Florence before.",
    body1: "Routing varies by operator: Lucca countryside, Montecarlo wine hills or Maremma hamlets south of Livorno. Expect 3–4 hours in the landscape plus transfer.",
    body2: "Village lunches need reservations on cruise days — your guide handles tables and timing. Less walking than Florence — more scenic stops.",
    body3: "Requires 8+ usable hours. First-timers should choose Renaissance Florence instead.",
    highlights: ["Hilltop village visits", "Olive grove and frantoio stops", "Scenic cypress drives", "Village trattoria lunch"],
    included: ["Licensed guide", "Coach transport", "Lunch where stated", "Return timed to ship"],
    tips: ["Ideal for second-time Tuscany callers", "Bring a camera for cypress lanes", "Wear comfortable walking shoes"],
    faqs: [
      ["Hidden Tuscany or Lucca combo?", "Hidden Tuscany goes deeper inland; Pisa & Lucca adds the tower."],
      ["First visit to Tuscany?", "Choose Florence first — hidden Tuscany rewards repeat visitors."],
    ],
    related: ["pisa-lucca-combo", "taste-tuscany", "hidden-tuscany"],
  },
  {
    slug: "independent-explorer",
    title: "Independent Explorer Shore Excursion",
    seoTitle: "Independent Tuscany Explorer from Livorno — Train & Self-Guided Options",
    meta: "Independent Tuscany from Livorno — train timetables, Florence route maps and guide support for confident DIY cruise passengers.",
    category: "Independent",
    tagline: "Train to Florence or self-paced Pisa — independence with a safety net.",
    duration: "7–9 hours self-paced",
    pace: "Moderate",
    bestFor: "Confident independent travellers who want flexibility and lower cost",
    overview: "The Independent Explorer product supports DIY Tuscany days — train schedules to Florence SMN, Pisa walking maps and optional meet-and-guide hours — for passengers who accept timing responsibility without a full coach tour.",
    body1: "Typical pattern: taxi to Livorno Centrale, regional train to Florence, self-guided Duomo walk with pre-booked Accademia slot, return train mid-afternoon, taxi to terminal 90 minutes before all-aboard.",
    body2: "Alternative: train to Pisa Centrale for Field of Miracles — closer, cheaper and easier to recover if trains run late. Pisa suits shorter calls and first-time independents.",
    body3: "No ship delay guarantee — you manage timing alone. Ideal for experienced Mediterranean cruisers.",
    highlights: ["Train and taxi logistics explained", "Florence and Pisa route maps", "Optional guide hours on some packages", "Return buffer checklist"],
    included: ["Route planning and timetables", "Optional meet-and-walk guide", "Taxi booking assistance where stated"],
    tips: ["Pre-book Accademia or tower tickets", "Validate train tickets before boarding", "Carry euros for taxis and food"],
    faqs: [
      ["Is DIY safe from Livorno?", "Yes for confident travellers — see train vs transfer comparison for risk assessment."],
      ["Train or coach?", "Coach for first-timers; train for solo budget travellers with museum tickets pre-booked."],
    ],
    related: ["independent-train-guide", "renaissance-florence", "diy-vs-guided"],
  },
  {
    slug: "family-day-tuscany",
    title: "Family Day in Tuscany Excursion",
    seoTitle: "Family Tuscany Shore Excursion from Livorno Cruise Port",
    meta: "Family-friendly Tuscany from Livorno — Pisa tower, Lucca bike rides and paced routing for children with reliable return timing.",
    category: "Family",
    tagline: "Tower photos, wall bikes and gelato — Tuscany paced for mixed-age families.",
    duration: "7–8 hours",
    pace: "Relaxed",
    bestFor: "Families with children aged 5–14",
    overview: "Family Day Tuscany skips the Florence museum marathon in favour of Pisa's flat Field of Miracles and Lucca's bike-friendly ramparts — shorter transfers, less queue stress and explicit gelato stops.",
    body1: "Morning at Pisa: tower photos, lawn space for children, optional climb for over-eights with pre-booked tickets. Afternoon in Lucca: bike hire on the walls, Piazza dell'Anfiteatro and Torre Guinigi if legs allow.",
    body2: "Guides use story-based commentary — Galileo at Pisa, medieval merchants at Lucca — rather than dense art history. Toilet and snack stops built into routing.",
    body3: "Share children's ages at booking. Private upgrade recommended for strollers or mixed teen/toddler groups.",
    highlights: ["Pisa Field of Miracles — flat and accessible", "Lucca wall bike ride", "Gelato and snack stops", "Explicit return timing to Livorno"],
    included: ["Family-specialist guide", "Coach transport", "Bike hire where stated"],
    tips: ["Skip Florence museums with under-tens", "Pre-book tower climb for over-eights only", "Pack snacks and sun hats"],
    faqs: [
      ["Florence with kids?", "Possible but demanding — Pisa and Lucca suit families better on standard calls."],
      ["Stroller-friendly?", "Pisa lawns and Lucca ramparts yes; Florence cobbles are difficult."],
    ],
    related: ["pisa-lucca-combo", "private-florence", "florence-for-first-time-visitors"],
  },
  {
    slug: "pisa-lucca-combo",
    title: "Pisa & Lucca Shore Excursion",
    seoTitle: "Pisa & Lucca Shore Excursion from Livorno Cruise Port",
    meta: "Visit Pisa's Leaning Tower and Lucca's walled city from Livorno — the best combo for shorter port calls and relaxed pacing.",
    category: "Pisa & Lucca",
    tagline: "Tower in the morning, walled Lucca in the afternoon — Tuscany's best short-call combo.",
    duration: "7–8 hours",
    pace: "Moderate",
    bestFor: "Shorter port calls, families and passengers who find Florence too far",
    overview: "Pisa & Lucca is the smartest combo when your call is 7–9 hours or Florence feels too ambitious. Two compact destinations 30–45 minutes from Livorno with minimal motorway risk on return.",
    body1: "Morning at Piazza dei Miracoli: Leaning Tower photos, cathedral interior, optional climb. Transfer to Lucca for afternoon wall walk or bike ride, Piazza dell'Anfiteatro and gelato.",
    body2: "Less motorway exposure than Florence days — return confidence is high even on summer afternoons. Ideal best-short-port excursion.",
    body3: "Does not include Florence — choose Tuscany Highlights if you need the Duomo on the same call.",
    highlights: ["Pisa Leaning Tower and cathedral", "Lucca Renaissance walls", "Bike hire on Lucca ramparts", "Short transfer distances"],
    included: ["Licensed guide", "Coach transport", "Tower tickets where stated", "Return timed to ship"],
    tips: ["Best excursion for calls under 9 hours", "Book tower climb ahead if wanted", "Rent bikes in Lucca — kids love it"],
    faqs: [
      ["Pisa & Lucca or Florence?", "Florence for first-timer art; Pisa & Lucca for shorter calls and families."],
      ["Enough time for both?", "Yes — both sites are compact. Allow 2 hours Pisa, 2.5 hours Lucca."],
    ],
    related: ["tuscany-highlights", "hidden-tuscany-day", "family-day-tuscany"],
  },
  {
    slug: "bolgheri-wine-tour",
    title: "Bolgheri Wine Tour Shore Excursion",
    seoTitle: "Bolgheri Wine Tour from Livorno — Super Tuscan Shore Excursion",
    meta: "Bolgheri Super Tuscan wine tour from Livorno — Sassicaia country, cypress avenue and premium estate tastings on a cruise-timed day.",
    category: "Food & wine",
    tagline: "Via Bolgheri cypresses and Super Tuscan cellars — wine country south of Livorno.",
    duration: "7–8 hours",
    pace: "Relaxed",
    bestFor: "Wine enthusiasts and photographers who want Bolgheri's iconic scenery",
    overview: "Bolgheri Wine Tour drives south through Maremma to the cypress-lined Via Bolgheri — home of Sassicaia, Ornellaia and Italy's most photographed wine road. Two estate tastings and village stroll included.",
    body1: "45–60 minutes each way from Livorno terminal. Morning cypress avenue photo stop, first estate tasting, village lunch in Bolgheri, second cellar visit, return mid-afternoon.",
    body2: "Premium estates require advance reservations — operators book weeks ahead for cruise groups. Designated drivers provided on all guided tours.",
    body3: "Best for passengers who have seen Florence or prefer wine over museums. See our food lovers comparison for ranking.",
    highlights: ["Via Bolgheri cypress avenue", "Two Super Tuscan estate tastings", "Medieval Bolgheri village", "Maremma scenic drives"],
    included: ["Wine tastings", "Licensed guide", "Coach transport", "Lunch where stated"],
    tips: ["Book early for August sailings", "Eat lightly before tastings", "Morning light best for cypress photos"],
    faqs: [
      ["Bolgheri or Chianti?", "Bolgheri is closer and more scenic from Livorno; Chianti needs longer drives."],
      ["Non-drinkers?", "Village walk and scenery still reward — notify operator."],
    ],
    related: ["taste-tuscany", "bolgheri-wine-region", "scenic-tuscany"],
  },
  {
    slug: "private-florence",
    title: "Private Florence Shore Excursion",
    seoTitle: "Private Florence Shore Excursion from Livorno — Ultimate Tuscany",
    meta: "Private Florence from Livorno — custom Duomo, David and Uffizi routing with premium vehicle and flexible pacing for your ship.",
    category: "Private & luxury",
    tagline: "Ultimate Tuscany — private vehicle, skip-the-line museums and your pace from the terminal.",
    duration: "Flexible — typically 8–10 hours",
    pace: "Relaxed",
    bestFor: "Premium travellers, mixed-interest groups and passengers wanting VIP museum access",
    overview: "Private Florence eliminates coach convoys and fixed shopping stops. Your art historian guide sequences Accademia, Uffizi or Duomo dome according to your ship's hours and your group's priorities.",
    body1: "Mercedes or minivan meets you at Livorno terminal exit — no waiting for 50-passenger coach fill. Timed museum entries arranged in advance; lunch at a reserved trattoria near Santa Croce.",
    body2: "Mixed groups benefit: some visit Uffizi while others walk Ponte Vecchio — impossible on group tours. Limited-mobility passengers get door-to-door drops at each sight.",
    body3: "Premium pricing reflects exclusivity — strongest return-to-ship confidence when A12 traffic is unpredictable.",
    highlights: ["Private vehicle from terminal", "Custom museum sequencing", "Skip-the-line coordination", "Flexible lunch reservations"],
    included: ["Private art historian guide", "Private vehicle", "Museum tickets where stated", "Ship-aware return scheduling"],
    tips: ["Book two weeks ahead in peak season", "Share museum priorities at booking", "Confirm ticket availability early"],
    faqs: [
      ["Worth it over group tours?", "Yes for mixed ages, VIP access or specific museum combinations."],
      ["Private Florence plus Pisa?", "Only on 10+ hour calls — your guide will advise."],
    ],
    related: ["renaissance-florence", "tuscany-highlights", "luxury-tuscany-experiences"],
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

// ─── COMPARISONS (6 versus + 4 guide) ────────────────────────────────────────

const comparisons = [
  versus({
    slug: "florence-vs-pisa",
    optionA: "Florence",
    optionB: "Pisa",
    summary: "Florence delivers the Renaissance — Duomo, David and world-class museums 90 minutes from Livorno. Pisa offers the Leaning Tower 30 minutes away on a flat, compact site ideal for shorter calls.",
    verdict: "Choose Florence for first-time Tuscany and art. Choose Pisa when your call is under 8 hours, you travel with young children, or you have already seen Florence. Many passengers do both via an organised combo on 9+ hour calls.",
    overview: [
      "Florence: 90 km, 75–90 min transfer, 5–6 hours needed in city, museum tickets essential.",
      "Pisa: 25 km, 30–45 min transfer, 2–3 hours at Field of Miracles, tower climb optional.",
      "Combining both needs 9+ usable hours — Tuscany Highlights or Florence & Pisa excursions handle motorway timing.",
    ],
    table: [
      { category: "Distance from Livorno", optionA: "90 km / 75–90 min", optionB: "25 km / 30–45 min" },
      { category: "Time on site", optionA: "5–6 hours minimum", optionB: "2–3 hours" },
      { category: "Best for", optionA: "Art, Renaissance, first-timers", optionB: "Short calls, families, iconic photo" },
      { category: "Physical effort", optionA: "Moderate — cobbles and museums", optionB: "Easy — flat lawns" },
      { category: "Return confidence", optionA: "Good with 90-min buffer — A12 traffic risk", optionB: "Very high — short transfer" },
    ],
    faqs: [
      ["Can I do both on one port day?", "Yes on 9+ hour calls via organised combo — not recommended independently."],
      ["Which has longer queues?", "Florence museums — Accademia and Uffizi need pre-booking; Pisa tower needs timed slots."],
    ],
    related: ["florence-for-first-time-visitors", "pisa-for-first-time-visitors", "florence-only-vs-florence-and-pisa"],
    imageKey: "city",
  }),
  versus({
    slug: "florence-vs-lucca",
    optionA: "Florence",
    optionB: "Lucca",
    summary: "Florence is the Renaissance heavyweight — museums, Duomo and crowds. Lucca is a walled gem 35 km east: bike-friendly ramparts, quiet piazzas and no museum queues.",
    verdict: "Choose Florence if this is your first Tuscany visit and you accept coach time and queues. Choose Lucca for relaxed pacing, families and passengers who prefer charm over blockbuster art.",
    overview: [
      "Florence: 75–90 min coach, 5–6 hours in centre, Accademia or Uffizi tickets critical.",
      "Lucca: 45–60 min coach or 30 min train, 2.5–3 hours, wall bike ride is the highlight.",
      "Not combinable as equal anchors on standard calls — pick one or choose Pisa & Lucca combo without Florence.",
    ],
    table: [
      { category: "Transfer from Livorno", optionA: "75–90 min coach", optionB: "45–60 min coach / 30 min train" },
      { category: "Crowds", optionA: "Heavy at Duomo and museums", optionB: "Moderate — calmer than Florence" },
      { category: "Best for", optionA: "Art and first-timers", optionB: "Families, relaxed pace, repeat visitors" },
      { category: "Walking", optionA: "5–8 km cobbles", optionB: "3–4 km, flat ramparts" },
    ],
    faqs: [
      ["Lucca instead of Florence?", "Yes if crowds and coach time worry you — especially on shorter calls."],
      ["Can I train to Lucca independently?", "Yes — 30 minutes from Livorno Centrale, easier DIY than Florence."],
    ],
    related: ["lucca-from-livorno", "hidden-tuscany", "pisa-or-lucca"],
    imageKey: "history",
  }),
  versus({
    slug: "diy-vs-guided",
    optionA: "DIY Tuscany",
    optionB: "Guided Shore Excursion",
    summary: "DIY train travel to Florence or Pisa costs less but adds station taxi time and timing risk. Guided excursions bundle motorway navigation, museum tickets and 60–90 minute return buffers.",
    verdict: "Choose DIY for Pisa by train or a confident Florence day with pre-booked Accademia tickets and strict schedule discipline. Choose guided for first-timers, Florence combos, wine tours and anyone anxious about A12 motorway delays.",
    overview: [
      "DIY: taxi to Livorno Centrale, regional train, self-guided walk — €25–45 plus food. You manage all timing.",
      "Guided: coach from terminal, timed museum entry, historian guide, explicit return — €80–150+ per person.",
      "DIY saves money for experienced cruisers; guided saves costly queue and motorway mistakes in summer.",
    ],
    table: [
      { category: "Cost per person", optionA: "€30–55 plus food", optionB: "€80–150+ all-in" },
      { category: "Return confidence", optionA: "Moderate — you manage trains and taxis", optionB: "High — operator tracks ship" },
      { category: "Museum access", optionA: "Your responsibility to pre-book", optionB: "Usually included or coordinated" },
      { category: "Best for", optionA: "Experienced cruisers, Pisa day trips", optionB: "Florence first-timers, combos, wine tours" },
    ],
    faqs: [
      ["Will the ship wait for independent travel?", "No — only ship-sponsored excursions carry delay guarantee."],
      ["Best DIY destination?", "Pisa by train — closer and easier to recover if trains slip."],
    ],
    related: ["independent-train-guide", "independent-explorer", "best-things-to-do-from-livorno"],
    imageKey: "port",
  }),
  versus({
    slug: "train-vs-private-transfer",
    optionA: "Regional Train",
    optionB: "Private Transfer",
    summary: "Regional trains from Livorno Centrale reach Florence SMN in about 75 minutes for €10–15 — but you need a taxi to the station first. Private transfers offer door-to-door comfort from terminal to Florence centre in similar total time at premium cost.",
    verdict: "Choose the train for budget solo travel to Florence or Pisa with pre-booked museum slots and strict return discipline. Choose private transfer for families, groups of three or more, limited mobility or when every minute of port time counts.",
    overview: [
      "Train: 15–20 min taxi to station, 75 min to Florence, 10 min walk to Duomo — €25–40 total one way.",
      "Private transfer: terminal to Florence centre in 75–90 min — €120–200 per vehicle one way.",
      "Coaches on group excursions sit between both on cost and convenience.",
    ],
    table: [
      { category: "Door-to-door time", optionA: "90–110 min including station taxi", optionB: "75–90 min direct" },
      { category: "Cost (solo)", optionA: "€25–40 each way", optionB: "€120–200 per vehicle" },
      { category: "Flexibility", optionA: "Fixed train schedules", optionB: "Depart when you choose" },
      { category: "Best for", optionA: "Solo budget travellers", optionB: "Families, groups, premium pacing" },
    ],
    faqs: [
      ["Train faster than coach?", "Rarely door-to-door — coaches pick up at terminal and drop in city centre."],
      ["Book transfer one-way?", "Round-trip private transfer often better value for Florence days."],
    ],
    related: ["independent-train-guide", "private-florence", "livorno-cruise-terminal-guide"],
    imageKey: "port",
  }),
  versus({
    slug: "florence-only-vs-florence-and-pisa",
    optionA: "Florence Only",
    optionB: "Florence & Pisa",
    summary: "Florence only gives you 5–6 unhurried hours for David, Duomo and Ponte Vecchio. Adding Pisa compresses Florence time but delivers the Leaning Tower on the same call.",
    verdict: "Choose Florence only on 8–9 hour calls when David and the Duomo are your priority. Choose Florence & Pisa on 9–10 hour calls when you want both icons and accept tighter pacing. Never add Pisa independently after a full Florence coach tour on standard calls.",
    overview: [
      "Florence only: 5–6 hours in city, one museum focus, relaxed lunch optional.",
      "Florence & Pisa: 4 hours Florence, 2 hours Pisa, lunch on the move.",
      "Both need organised excursions for motorway timing — DIY dual-city days are high risk.",
    ],
    table: [
      { category: "Minimum call length", optionA: "8 usable hours", optionB: "9+ usable hours" },
      { category: "Florence time", optionA: "5–6 hours", optionB: "4 hours typical" },
      { category: "Pisa included", optionA: "No", optionB: "Yes — 2 hours" },
      { category: "Pacing", optionA: "Moderate", optionB: "Active" },
    ],
    faqs: [
      ["Florence only boring?", "Not at all — David alone fills 90 minutes plus historic-centre walk."],
      ["Which excursion for both?", "Tuscany Highlights or Florence & Pisa — compare inclusions when booking."],
    ],
    related: ["renaissance-florence", "tuscany-highlights", "florence-and-pisa"],
    imageKey: "highlights",
  }),
  versus({
    slug: "pisa-or-lucca",
    optionA: "Pisa",
    optionB: "Lucca",
    summary: "Pisa delivers the world's most famous tower on a flat, open piazza. Lucca offers walled-city charm, bike rides and gelato — 30 minutes further east, equally reachable from Livorno.",
    verdict: "Choose Pisa for the iconic tower photo and short-call efficiency. Choose Lucca for a fuller day experience with walls, piazzas and less of a 'checkpoint' feel. The Pisa & Lucca combo is the best of both on 8+ hour calls.",
    overview: [
      "Pisa: 25 km, Field of Miracles, 2–3 hours, tower climb optional.",
      "Lucca: 35 km, walled centre, 2.5–3 hours, bike ride highlight.",
      "Combo excursions do Pisa morning, Lucca afternoon — ideal best-short-port strategy.",
    ],
    table: [
      { category: "Distance from Livorno", optionA: "25 km", optionB: "35 km" },
      { category: "Iconic factor", optionA: "Leaning Tower — global icon", optionB: "Walled city — charming, less famous" },
      { category: "Best for", optionA: "Short calls, first photos", optionB: "Families, relaxed exploration" },
      { category: "Physical effort", optionA: "Easy — flat", optionB: "Easy — flat ramparts" },
    ],
    faqs: [
      ["Both in one day?", "Yes — Pisa & Lucca combo is designed for exactly this."],
      ["Pisa or Lucca for toddlers?", "Both work — Lucca walls and gelato slightly edge Pisa."],
    ],
    related: ["pisa-lucca-combo", "pisa-for-first-time-visitors", "lucca-from-livorno"],
    imageKey: "fortress",
  }),
  comparisonGuide({
    slug: "best-tuscany-excursion-first-time-visitors",
    title: "Best Tuscany Excursions for First-Time Visitors",
    seoTitle: "Best Tuscany Shore Excursions for First-Timers — Livorno Port",
    meta: "Ranked Tuscany shore excursions for first-time cruise passengers at Livorno — Florence, combos and Pisa options.",
    summary: "First-timers need one clear anchor, reliable museum or tower entry and an operator who understands A12 motorway timing — these excursions deliver consistently from Livorno.",
    verdict: "Book before sailing in peak season. Morning departures protect afternoon return margins when Florence motorway traffic builds.",
    overview: [
      "Tuscany Highlights balances Florence and Pisa for standard 9–10 hour calls.",
      "Renaissance Florence suits passengers who want a full Florence day without Pisa.",
      "Pisa & Lucca combo is best when your call is shorter or Florence feels too far.",
      "Private Florence suits mixed groups wanting flexible museum pacing.",
    ],
    guideItems: [
      { name: "Tuscany Highlights", slug: "tuscany-highlights", href: "/shore-excursions/tuscany-highlights", reason: "Editor's pick — Florence and Pisa sequenced with motorway expertise.", topExcursion: "Tuscany Highlights Shore Excursion", returnConfidence: "High on 9+ hour calls", walkingDifficulty: "Moderate — cobbles in Florence" },
      { name: "Renaissance Florence", slug: "renaissance-florence", href: "/shore-excursions/renaissance-florence", reason: "When Florence alone is your non-negotiable must-do.", topExcursion: "Renaissance Florence Shore Excursion", returnConfidence: "High with timed museum entry", walkingDifficulty: "Moderate — 5–8 km cobbles" },
      { name: "Florence & Pisa", slug: "florence-and-pisa", href: "/shore-excursions/florence-and-pisa", reason: "Active pacing for both icons on long calls.", topExcursion: "Florence & Pisa Shore Excursion", returnConfidence: "High on 9+ hour calls", walkingDifficulty: "Active — dual-city day" },
      { name: "Pisa & Lucca Combo", slug: "pisa-lucca-combo", href: "/shore-excursions/pisa-lucca-combo", reason: "Best when hours are limited or Florence is too ambitious.", topExcursion: "Pisa & Lucca Shore Excursion", returnConfidence: "Very high — short transfers", walkingDifficulty: "Easy to moderate" },
      { name: "Private Florence", slug: "private-florence", href: "/shore-excursions/private-florence", reason: "Custom routing for families and VIP museum access.", topExcursion: "Private Florence Shore Excursion", returnConfidence: "Very high", walkingDifficulty: "Flexible" },
    ],
    faqs: [
      ["One excursion for first-timers?", "Tuscany Highlights on 9+ hour calls — Renaissance Florence if Florence alone fills your day."],
      ["Florence or Pisa?", "Florence for art; Pisa for short calls — see our comparison."],
    ],
    related: ["florence-for-first-time-visitors", "florence-vs-pisa", "tuscany-highlights"],
    imageKey: "highlights",
  }),
  comparisonGuide({
    slug: "best-tuscany-excursion-families",
    title: "Best Tuscany Excursions for Families",
    seoTitle: "Family-Friendly Tuscany Shore Excursions from Livorno",
    meta: "Best Tuscany excursions for families from Livorno — Pisa, Lucca bikes and paced routing with reliable return timing.",
    summary: "Families need flat sights, toilet breaks and short transfers — not a six-hour Florence museum march. These excursions deliver from Livorno with child-aware guides.",
    verdict: "Skip Florence museums with under-eights. Pisa & Lucca combo is the family default — tower photos plus wall bikes.",
    overview: [
      "Pisa & Lucca combo: flat tower lawns, Lucca bike hire, gelato stops.",
      "Family Day Tuscany: dedicated child-aware guide and pacing.",
      "Private Florence: custom stops when mixed ages need flexibility.",
    ],
    guideItems: [
      { name: "Pisa & Lucca Combo", slug: "pisa-lucca-combo", href: "/shore-excursions/pisa-lucca-combo", reason: "Flat Pisa plus bike-friendly Lucca — the family default.", topExcursion: "Pisa & Lucca Shore Excursion", returnConfidence: "Very high", walkingDifficulty: "Easy — flat sites" },
      { name: "Family Day Tuscany", slug: "family-day-tuscany", href: "/shore-excursions/family-day-tuscany", reason: "Story-based guides and explicit snack stops.", topExcursion: "Family Day in Tuscany Excursion", returnConfidence: "High", walkingDifficulty: "Easy to moderate" },
      { name: "Private Florence", slug: "private-florence", href: "/shore-excursions/private-florence", reason: "Split interests — museum for teens, Ponte Vecchio walk for others.", topExcursion: "Private Florence Shore Excursion", returnConfidence: "Very high", walkingDifficulty: "Flexible" },
      { name: "Hidden Tuscany Day", slug: "hidden-tuscany-day", href: "/shore-excursions/hidden-tuscany-day", reason: "Village scenery without Florence crush — school-age plus.", topExcursion: "Hidden Tuscany Day Excursion", returnConfidence: "High", walkingDifficulty: "Moderate" },
    ],
    faqs: [
      ["Florence with kids?", "Possible but demanding — Pisa and Lucca suit families better."],
      ["Minimum age for tower climb?", "Over-eights with pre-booked tickets — exterior fun for all ages."],
    ],
    related: ["family-day-tuscany", "pisa-lucca-combo", "florence-vs-lucca"],
    imageKey: "family",
  }),
  comparisonGuide({
    slug: "best-tuscany-excursion-couples",
    title: "Best Tuscany Excursions for Couples",
    seoTitle: "Romantic Tuscany Shore Excursions from Livorno — Couples Guide",
    meta: "Best Tuscany excursions for couples from Livorno — private Florence, Bolgheri wine and Renaissance romance.",
    summary: "Couples want unhurried museum time, vineyard lunches and Ponte Vecchio sunsets — these excursions balance romance with return-to-ship discipline.",
    verdict: "Private Florence for art and intimacy; Bolgheri Wine Tour for vineyard romance; Renaissance Florence when budget matters more than exclusivity.",
    overview: [
      "Private Florence: reserved trattoria lunch, flexible museum pacing.",
      "Bolgheri Wine Tour: cypress scenery and Super Tuscan tastings for two.",
      "Renaissance Florence: shared David moment without private premium.",
    ],
    guideItems: [
      { name: "Private Florence", slug: "private-florence", href: "/shore-excursions/private-florence", reason: "Ultimate Tuscany — your pace, your museums, your lunch table.", topExcursion: "Private Florence Shore Excursion", returnConfidence: "Very high", walkingDifficulty: "Flexible" },
      { name: "Bolgheri Wine Tour", slug: "bolgheri-wine-tour", href: "/shore-excursions/bolgheri-wine-tour", reason: "Cypress avenue and cellar tastings — cinematic wine country.", topExcursion: "Bolgheri Wine Tour Shore Excursion", returnConfidence: "High", walkingDifficulty: "Easy" },
      { name: "Renaissance Florence", slug: "renaissance-florence", href: "/shore-excursions/renaissance-florence", reason: "David and Ponte Vecchio — classic romantic Florence.", topExcursion: "Renaissance Florence Shore Excursion", returnConfidence: "High", walkingDifficulty: "Moderate" },
      { name: "Taste Tuscany", slug: "taste-tuscany", href: "/shore-excursions/taste-tuscany", reason: "Shared vineyard pranzo and hill-country scenery.", topExcursion: "Taste Tuscany Shore Excursion", returnConfidence: "High", walkingDifficulty: "Relaxed" },
    ],
    faqs: [
      ["Most romantic excursion?", "Private Florence with trattoria lunch — or Bolgheri at sunset on late sailings."],
      ["Florence and wine same day?", "Only on 10+ hour private tours — otherwise pick one anchor."],
    ],
    related: ["luxury-tuscany-experiences", "private-florence", "bolgheri-wine-tour"],
    imageKey: "luxury",
  }),
  comparisonGuide({
    slug: "best-tuscany-excursion-food-lovers",
    title: "Best Tuscany Excursions for Food Lovers",
    seoTitle: "Best Tuscany Food & Wine Shore Excursions from Livorno",
    meta: "Ranked Tuscany food and wine excursions from Livorno — Bolgheri, Taste Tuscany and gastronomy-focused port days.",
    summary: "Food lovers should anchor on vineyard lunches and Super Tuscan tastings — not split a port day between David queues and a rushed trattoria.",
    verdict: "Taste Tuscany for balanced wine and food; Bolgheri Wine Tour for premium estates; avoid combo Florence tours if gastronomy is your priority.",
    overview: [
      "Taste Tuscany: two tastings, vineyard pranzo, hill scenery.",
      "Bolgheri Wine Tour: Super Tuscan estates and Via Bolgheri cypress photos.",
      "Florence add-on: lampredotto panini only if you accept museum-focused pacing.",
    ],
    guideItems: [
      { name: "Taste Tuscany", slug: "taste-tuscany", href: "/shore-excursions/taste-tuscany", reason: "Editor's pick for balanced wine, oil and Tuscan lunch.", topExcursion: "Taste Tuscany Shore Excursion", returnConfidence: "High", walkingDifficulty: "Relaxed" },
      { name: "Bolgheri Wine Tour", slug: "bolgheri-wine-tour", href: "/shore-excursions/bolgheri-wine-tour", reason: "Premium Super Tuscans and Italy's most photogenic wine road.", topExcursion: "Bolgheri Wine Tour Shore Excursion", returnConfidence: "High", walkingDifficulty: "Easy" },
      { name: "Hidden Tuscany Day", slug: "hidden-tuscany-day", href: "/shore-excursions/hidden-tuscany-day", reason: "Village trattoria lunch in uncrowded borghi.", topExcursion: "Hidden Tuscany Day Excursion", returnConfidence: "High", walkingDifficulty: "Moderate" },
      { name: "Renaissance Florence", slug: "renaissance-florence", href: "/shore-excursions/renaissance-florence", reason: "Quick trattoria lunch plus market stop if art comes first.", topExcursion: "Renaissance Florence Shore Excursion", returnConfidence: "High", walkingDifficulty: "Moderate" },
    ],
    faqs: [
      ["Food tour or Florence?", "Dedicated food tour if you have seen Florence; Renaissance day if not."],
      ["Bolgheri or Chianti?", "Bolgheri from Livorno — closer, more scenic, Super Tuscan focus."],
    ],
    related: ["food-wine-experiences", "tuscan-food-guide", "taste-tuscany"],
    imageKey: "food",
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
  { id: "renaissance", label: "Renaissance & Florence" },
  { id: "pisa", label: "Pisa & Leaning Tower" },
  { id: "wine", label: "Wine & vineyards" },
  { id: "villages", label: "Tuscan villages" },
  { id: "photography", label: "Photography & scenery" },
  { id: "family", label: "Family-friendly" },
  { id: "food", label: "Food & wine" },
  { id: "independent", label: "Independent travel" },
  { id: "art", label: "Art & museums" },
  { id: "scenery", label: "Scenic countryside" },
];

const INTEREST_TO_EXCURSION: Record<string, string[]> = {
  renaissance: ["renaissance-florence", "tuscany-highlights", "florence-and-pisa"],
  pisa: ["pisa-lucca-combo", "florence-and-pisa", "tuscany-highlights"],
  wine: ["bolgheri-wine-tour", "taste-tuscany", "hidden-tuscany-day"],
  villages: ["hidden-tuscany-day", "pisa-lucca-combo", "taste-tuscany"],
  photography: ["bolgheri-wine-tour", "scenic-tuscany", "pisa-lucca-combo"],
  family: ["family-day-tuscany", "pisa-lucca-combo", "hidden-tuscany-day"],
  food: ["taste-tuscany", "bolgheri-wine-tour", "hidden-tuscany-day"],
  independent: ["independent-explorer", "pisa-lucca-combo", "renaissance-florence"],
  art: ["renaissance-florence", "private-florence", "tuscany-highlights"],
  scenery: ["bolgheri-wine-tour", "hidden-tuscany-day", "taste-tuscany"],
};

const ITINERARY_THEMES: Record<
  string,
  { headline: string; slugs: string[]; summary: string }
> = {
  "editors-choice": {
    headline: "Editor's Choice — Florence • Pisa • Tuscany Highlights",
    slugs: ["tuscany-highlights", "renaissance-florence", "florence-and-pisa"],
    summary: "The essential Tuscany duo — Duomo, David and Leaning Tower sequenced with A12 motorway expertise.",
  },
  "best-historic": {
    headline: "Renaissance Florence",
    slugs: ["renaissance-florence", "tuscany-highlights", "private-florence"],
    summary: "Duomo, Michelangelo's David and Ponte Vecchio without rushing your port day.",
  },
  "best-food": {
    headline: "Taste Tuscany",
    slugs: ["taste-tuscany", "bolgheri-wine-tour", "hidden-tuscany-day"],
    summary: "Super Tuscans, olive oil and vineyard pranzo fitted to your Livorno port hours.",
  },
  "best-photography": {
    headline: "Scenic Tuscany",
    slugs: ["bolgheri-wine-tour", "pisa-lucca-combo", "hidden-tuscany-day"],
    summary: "Via Bolgheri cypresses, Lucca ramparts and hill-country panoramas.",
  },
  "best-independent": {
    headline: "Independent Explorer",
    slugs: ["independent-explorer", "pisa-lucca-combo", "renaissance-florence"],
    summary: "Train to Florence or self-paced Pisa — manage your own return buffer to Livorno.",
  },
  "best-families": {
    headline: "Family Tuscany",
    slugs: ["family-day-tuscany", "pisa-lucca-combo", "hidden-tuscany-day"],
    summary: "Pisa tower lawns and Lucca wall bikes — paced for mixed-age families.",
  },
  "best-luxury": {
    headline: "Ultimate Tuscany",
    slugs: ["private-florence", "bolgheri-wine-tour", "tuscany-highlights"],
    summary: "Private vehicle, skip-the-line museums and premium Bolgheri estates.",
  },
  "hidden-gem": {
    headline: "Hidden Tuscany",
    slugs: ["hidden-tuscany-day", "pisa-lucca-combo", "taste-tuscany"],
    summary: "Villages, olive groves and uncrowded lanes away from Florence coach convoys.",
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
  const { interests, children, style, mobility, timeframe, budget } = input;
  const active = interests.length ? interests : ["renaissance", "art"];

  if (children > 0 || active.includes("family")) return "best-families";
  if (budget === "premium" || active.includes("art") && mobility === "limited") return "best-luxury";
  if (style === "diy" || active.includes("independent")) return "best-independent";
  if (active.includes("food") || active.includes("wine")) return "best-food";
  if (active.includes("photography") || active.includes("scenery")) return "best-photography";
  if (active.includes("villages")) return "hidden-gem";
  if (active.includes("renaissance") || active.includes("art")) return "best-historic";
  if (active.includes("pisa")) return "best-families";
  if (timeframe === "short" || usableHours(input) < 6) return "best-families";
  if (mobility === "limited") return "best-luxury";
  return "editors-choice";
}

export function generateLivornoPlan(input: PlannerInput): PlannerResult {
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

  const activeInterests = interests.length ? interests : ["renaissance", "art"];
  for (const interest of activeInterests) {
    for (const s of INTEREST_TO_EXCURSION[interest] ?? []) pushSlug(s);
  }
  if (hasKids) pushSlug("family-day-tuscany");
  if (mobility === "limited") pushSlug("private-florence");
  if (style === "diy") pushSlug("independent-explorer");
  if (budget === "premium") pushSlug("private-florence");
  if (timeframe === "short" || hours < 6) pushSlug("pisa-lucca-combo");

  const reasonMap: Record<string, string> = {
    "tuscany-highlights": "Editor's Choice — Florence and Pisa on one sequenced day.",
    "renaissance-florence": "Duomo, David and Ponte Vecchio — focused Renaissance day.",
    "florence-and-pisa": "Both icons when your call length allows active pacing.",
    "pisa-lucca-combo": "Best for shorter calls — tower and walled Lucca.",
    "taste-tuscany": "Wine, oil and Tuscan pranzo in the hills.",
    "bolgheri-wine-tour": "Via Bolgheri cypresses and Super Tuscan estates.",
    "hidden-tuscany-day": "Villages and groves away from Florence crowds.",
    "family-day-tuscany": "Paced routing with Pisa and Lucca for children.",
    "private-florence": mobility === "limited" ? "Private vehicle — essential for easy Florence access." : "Ultimate Tuscany — flexible VIP pacing.",
    "independent-explorer": "Train or self-guided Pisa — DIY with planning support.",
  };

  const excursionLinks = excSlugs
    .slice(0, 5)
    .map((s) => excursionLink(s, reasonMap[s] ?? "A strong match for your Tuscany port day."))
    .filter((x): x is PlannerLink => x !== null);

  const transfers: PlannerLink[] = [
    {
      label: "Livorno Cruise Terminal Guide",
      href: "/cruise-port-guide",
      why: "Molo Garibaldi terminal layout, taxis to Livorno Centrale and coach pickup points.",
    },
  ];
  if (party >= 3 || hasKids || mobility === "limited" || budget === "premium") {
    transfers.push({
      label: "Private Florence Tour",
      href: "/shore-excursions/private-florence",
      why: "Strongest return-to-ship confidence when A12 motorway traffic builds.",
    });
  }

  const logistics: PlannerLink[] = [
    { label: "Ship Schedules", href: "/ship-schedules/livorno", why: "See how many ships share your Livorno port day." },
    {
      label: "First-Time Florence Guide",
      href: "/guides/florence-for-first-time-visitors",
      why: "Choose David, Duomo or Uffizi when hours are tight.",
    },
    {
      label: "Train vs Private Transfer",
      href: "/compare/train-vs-private-transfer",
      why: "When regional rail beats a coach from the terminal.",
    },
  ];

  const topExc = excursionLinks[0]?.label ?? theme.headline;
  const dayPlan: { time: string; text: string }[] = [];

  const arriveLabel = arrivalTime ?? (timeframe === "short" ? "08:00" : timeframe === "long" ? "07:00" : "07:30");
  const departLabel = departureTime ?? (timeframe === "short" ? "14:00" : timeframe === "long" ? "18:00" : "17:00");

  dayPlan.push({
    time: "On arrival",
    text: \`Disembark at Livorno cruise terminal (\${arriveLabel}). Meet your excursion at the terminal exit, or taxi to Livorno Centrale (15–20 min) for an independent train to Florence.\`,
  });

  if (themeKey === "best-food") {
    dayPlan.push({ time: "Morning", text: "Scenic drive to wine country — first tasting mid-morning on a vineyard terrace." });
    dayPlan.push({ time: "Midday", text: "Multi-course Tuscan pranzo with Super Tuscan pairings — allow 90 minutes seated." });
    dayPlan.push({ time: "Afternoon", text: "Second cellar or frantoio stop, then motorway return toward Livorno." });
  } else if (themeKey === "best-independent") {
    dayPlan.push({ time: "Morning", text: "Taxi to Livorno Centrale — regional train to Florence SMN or Pisa Centrale." });
    dayPlan.push({ time: "Midday", text: "Self-guided Duomo walk or Field of Miracles — pre-booked museum slot if Florence." });
    dayPlan.push({ time: "Afternoon", text: "Return train mid-afternoon, taxi to terminal 90 minutes before all-aboard." });
  } else if (themeKey === "best-families") {
    dayPlan.push({ time: "Morning", text: "Pisa Field of Miracles — tower photos and lawn time for children." });
    dayPlan.push({ time: "Midday", text: "Transfer to Lucca — gelato and bike hire on the walls." });
    dayPlan.push({ time: "Afternoon", text: "Torre Guinigi if legs allow — short motorway return to Livorno." });
  } else if (themeKey === "best-photography" || themeKey === "hidden-gem") {
    dayPlan.push({ time: "Morning", text: "Via Bolgheri cypress avenue or Lucca ramparts — morning light for photos." });
    dayPlan.push({ time: "Midday", text: "Village stroll or vineyard stop — allow time for composition." });
    dayPlan.push({ time: "Afternoon", text: "Return via coastal Maremma or A12 — do not add Florence unless hours exceed 10." });
  } else if (themeKey === "best-luxury") {
    dayPlan.push({ time: "Morning", text: "Private vehicle from terminal — timed Accademia or Uffizi entry with art historian guide." });
    dayPlan.push({ time: "Midday", text: "Reserved trattoria lunch near Santa Croce or Oltrarno." });
    dayPlan.push({ time: "Afternoon", text: "Ponte Vecchio and optional Duomo dome — flexible pacing to your ship." });
  } else if (hasKids) {
    dayPlan.push({ time: "Morning", text: "Pisa tower exterior and cathedral — flat, accessible for children." });
    dayPlan.push({ time: "Midday", text: "Lucca wall bike ride and gelato in Piazza dell'Anfiteatro." });
    dayPlan.push({ time: "Afternoon", text: "Early return to terminal — avoid Florence cobbles with toddlers." });
  } else {
    dayPlan.push({
      time: "Morning",
      text: \`Florence or combo anchor first: \${topExc}. Morning arrival beats Duomo midday crowds.\`,
    });
    dayPlan.push({ time: "Midday", text: "Accademia David or Duomo exterior — quick panini if on a combo tour." });
    dayPlan.push({ time: "Afternoon", text: "Pisa Field of Miracles if on highlights tour — otherwise Ponte Vecchio walk before coach departure." });
  }

  dayPlan.push({
    time: "Return buffer",
    text: \`Be back at Livorno terminal 60–90 minutes before all-aboard (\${departLabel} sailing). A12 motorway traffic from Florence can add 20–40 minutes in peak summer.\`,
  });

  const interestLabels = activeInterests
    .map((i) => INTEREST_OPTIONS.find((o) => o.id === i)?.label ?? i)
    .join(", ")
    .toLowerCase();

  return {
    headline: theme.headline,
    summary: \`\${theme.summary} A \${timeframe} Livorno port day (~\${hours.toFixed(1)} usable hours) for \${party} guest\${party === 1 ? "" : "s"} interested in \${interestLabels}.\`,
    excursions: excursionLinks,
    transfers,
    stay: [],
    logistics,
    dayPlan,
  };
}

/** @deprecated Use generateLivornoPlan */
export const generateDubrovnikPlan = generateLivornoPlan;
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
  { id: "editors-choice", label: "Editor's Choice", shortLabel: "Editor's Choice", description: "Our top pick after comparing options for Livorno cruise passengers." },
  { id: "best-historic", label: "Best Renaissance Experience", shortLabel: "Renaissance", description: "Duomo, David and Florence's historic centre without rushing your port day." },
  { id: "best-independent", label: "Best Independent Experience", shortLabel: "Independent", description: "The smartest DIY approach — train, taxi and self-guided Tuscany from Livorno." },
  { id: "best-coastal", label: "Best Coastal Experience", shortLabel: "Coastal", description: "Maremma, Bolgheri and Tuscan coast timed to your ship." },
  { id: "best-view", label: "Best Viewpoints", shortLabel: "Viewpoints", description: "Via Bolgheri cypresses, Lucca ramparts and scenic hill-country panoramas." },
  { id: "best-got", label: "Best Game of Thrones Experience", shortLabel: "Game of Thrones", description: "Not applicable to Tuscany — reserved for site consistency." },
  { id: "best-families", label: "Best for Families", shortLabel: "Families", description: "Pisa, Lucca and paced routing with reliable return timing for children." },
  { id: "best-photography", label: "Best for Photography", shortLabel: "Photography", description: "Cypress avenues, tower angles and golden-hour Tuscan landscapes." },
  { id: "best-food", label: "Best Food & Wine Experience", shortLabel: "Food & Wine", description: "Super Tuscans, olive oil and vineyard pranzo that fit a cruise schedule." },
  { id: "best-luxury", label: "Ultimate Tuscany", shortLabel: "Ultimate Tuscany", description: "Private vehicles, premium estates and skip-the-line museum access from Livorno." },
  { id: "hidden-gem", label: "Hidden Gem", shortLabel: "Hidden Gem", description: "Villages and countryside away from Florence coach convoys." },
  { id: "best-value", label: "Best Value", shortLabel: "Best Value", description: "Strong sightseeing per euro when budget matters as much as timing." },
  { id: "best-short-port", label: "Best for Short Port Calls", shortLabel: "Short Port", description: "Realistic when your ship is in Livorno for under eight usable hours." },
];

export function getEditorialLabel(id: EditorialCategory): string {
  return EDITORIAL_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
`,
);

w(
  "homepage.ts",
  `import type { FAQ, VisitorType, ExperienceCard } from "./types";

export const homepageTagline = "Your Gateway to Tuscany";

export const visitorTypes: VisitorType[] = [
  {
    id: "port-day",
    label: "I'm visiting Tuscany for the day on a cruise",
    shortLabel: "Port day",
    description: "You're calling at Livorno for the day. Find shore excursions, planning guides and a realistic Tuscany itinerary from Molo Garibaldi.",
    href: "/shore-excursions",
    cta: "Plan my port day",
  },
  {
    id: "first-time",
    label: "It's my first time in Tuscany",
    shortLabel: "First visit",
    description: "Florence or Pisa? Our first-timer guides and comparison pages help you choose confidently from Livorno.",
    href: "/guides/florence-for-first-time-visitors",
    cta: "First-timer guide",
  },
  {
    id: "independent",
    label: "I prefer to explore independently",
    shortLabel: "Independent",
    description: "Train to Florence, walk Pisa's Field of Miracles, manage your own return — when DIY beats a ship tour.",
    href: "/guides/independent-train-guide",
    cta: "Independent guide",
  },
  {
    id: "planner",
    label: "I want a personalised itinerary",
    shortLabel: "Custom plan",
    description: "Tell us your hours ashore, interests and budget — get a tailored Tuscany plan with return-to-ship timing.",
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
    slug: "renaissance-florence",
    title: "Renaissance Florence",
    description: "Duomo, Michelangelo's David and Ponte Vecchio — the Cradle of the Renaissance from Livorno cruise port.",
    href: "/guides/florence-for-first-time-visitors",
    cta: "Explore Florence",
    imageKey: "city",
  },
  {
    slug: "pisa-lucca",
    title: "Pisa & Lucca",
    description: "Leaning Tower and walled Lucca — Tuscany's best combo for shorter port calls and family days.",
    href: "/guides/pisa-for-first-time-visitors",
    cta: "Explore Pisa & Lucca",
    imageKey: "fortress",
  },
  {
    slug: "tuscan-wine",
    title: "Tuscan Wine & Food",
    description: "Bolgheri Super Tuscans, olive oil tastings and vineyard pranzo — gastronomy as your port-day anchor.",
    href: "/guides/food-wine-experiences",
    cta: "Taste Tuscany",
    imageKey: "food",
  },
  {
    slug: "hidden-tuscany",
    title: "Hidden Tuscany",
    description: "Villages, cypress lanes and olive groves — uncrowded alternatives to the Florence coach convoys.",
    href: "/guides/hidden-tuscany",
    cta: "Discover hidden Tuscany",
    imageKey: "history",
  },
  {
    slug: "independent-explorer",
    title: "Independent Explorer",
    description: "Regional train to Florence or self-paced Pisa — manage your own return buffer from Livorno Centrale.",
    href: "/guides/independent-train-guide",
    cta: "Go independent",
    imageKey: "port",
  },
];

export const coreSections: HomeSection[] = [
  { slug: "shore-excursions", number: "01", title: "Shore Excursions", description: "Florence, Pisa, Lucca and wine country — cruise-timed from Livorno terminal.", href: "/shore-excursions", cta: "Browse excursions" },
  { slug: "guides", number: "02", title: "Tuscany Planning Guides", description: "Authority guides for Florence, Pisa, wine country and every type of passenger.", href: "/guides", cta: "Read guides" },
  { slug: "cruise-port-guide", number: "03", title: "Livorno Cruise Port Guide", description: "Molo Garibaldi terminal layout, taxis to Livorno Centrale and coach pickup on arrival.", href: "/cruise-port-guide", cta: "Port guide" },
  { slug: "cruise-planner", number: "04", title: "Tuscany Cruise Planner", description: "Answer a few questions — get a tailored itinerary with return-to-ship confidence.", href: "/cruise-planner", cta: "Start planning" },
  { slug: "compare", number: "05", title: "Compare Options", description: "Florence vs Pisa, DIY vs guided, train vs transfer — honest Tuscany comparisons.", href: "/compare/florence-vs-pisa", cta: "Compare options" },
  { slug: "ship-schedules", number: "06", title: "Cruise Ship Schedules", description: "See which ships call at Livorno and plan around published arrival and departure times.", href: "/ship-schedules/livorno", cta: "View schedules" },
  { slug: "one-day", number: "07", title: "One Day in Tuscany", description: "Hour-by-hour sample itineraries from gangway to all-aboard.", href: "/guides/one-day-in-tuscany", cta: "One-day guide" },
  { slug: "faq", number: "08", title: "FAQ", description: "Livorno cruise port questions answered — timing, trains, excursions and return buffers.", href: "/faq", cta: "Read FAQs" },
];

export function getHomepageFaqs(): FAQ[] {
  return [
    {
      question: "How far is Florence from Livorno cruise port?",
      answer: "About 90 km — 75–90 minutes by coach or regional train from Livorno Centrale plus 15–20 minutes taxi from the cruise terminal to the station.",
    },
    {
      question: "Can I visit Florence and Pisa on one Livorno port day?",
      answer: "Yes on 9+ hour calls via organised combo excursions like Tuscany Highlights. Independent dual-city days are high risk on standard calls.",
    },
    {
      question: "Should I book a shore excursion or explore independently?",
      answer: "Florence and combo tours benefit from coach timing and museum tickets. Pisa by train suits confident independents — see our DIY vs guided comparison.",
    },
    {
      question: "What is the best Tuscany excursion for first-timers?",
      answer: "Tuscany Highlights on 9+ hour calls combining Florence and Pisa — or Renaissance Florence if Florence alone is your goal.",
    },
    {
      question: "Where do cruise ships dock in Livorno?",
      answer: "At the commercial cruise terminal at Molo Garibaldi / Darsena Toscana. Coaches and taxis meet passengers at the terminal exit.",
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
import livornoSchedule from "./imported-schedules/livorno.json";

const SCHEDULE_FAQS = [
  {
    question: "How accurate are Livorno cruise ship schedules?",
    answer:
      "Schedules are compiled from published timetables and updated periodically. Times and berths can change — confirm with your cruise line before booking excursions.",
  },
  {
    question: "How far is Florence from Livorno cruise terminal?",
    answer:
      "About 90 km — 75–90 minutes by coach or train. Allow extra time when multiple ships share the port and A12 motorway traffic builds.",
  },
  {
    question: "Can I visit Florence on a short port call?",
    answer:
      "Calls under 8 usable hours are tight for Florence — choose Pisa & Lucca instead. Standard 9–11 hour calls suit a focused Florence excursion.",
  },
];

const SCHEDULE_TIPS = [
  "Check how many ships share your Livorno port day before booking Florence museum tickets",
  "Book Accademia and tower climb tickets online on multi-ship days",
  "Allow 60–90 minute return buffer from Tuscany to Livorno terminal",
  "Morning departures protect against afternoon A12 motorway delays from Florence",
];

export const schedulePorts: ShipSchedulePort[] = [
  {
    slug: "livorno",
    name: "Livorno",
    country: "Italy",
    seoTitle: "Livorno Cruise Ship Schedule — Tuscany Port Calls",
    metaDescription:
      "Livorno cruise ship schedule — see which ships call at Molo Garibaldi and plan Tuscany shore excursions around published arrival and departure times.",
    intro:
      "Livorno is the gateway port for Tuscany on Western Mediterranean itineraries. Check scheduled arrivals and departures before booking Florence, Pisa or wine country excursions.",
    description: "Italy's Tuscany cruise gateway — Florence 90 km inland, Pisa 25 km south.",
    scheduleOverview:
      "Peak cruise traffic April through October, with heaviest calls May to September on Mediterranean and Grand Voyage itineraries.",
    planningTips: SCHEDULE_TIPS,
    faqs: SCHEDULE_FAQS,
  },
];

const scheduleData: Record<string, ScheduleEntry[]> = {
  livorno: livornoSchedule as ScheduleEntry[],
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
  title: "Livorno Cruise Port Guide",
  subtitle: "Molo Garibaldi terminal, taxis to Livorno Centrale, coaches to Tuscany and return-to-ship timing.",
  terminals: [
    {
      name: "Livorno Cruise Terminal (Molo Garibaldi)",
      quay: "Darsena Toscana commercial berth",
      usedBy: "Most large ships — MSC, Celebrity, Royal Caribbean, Norwegian, Costa and others",
      cityAccess: "Taxi 15–20 min to Livorno Centrale; excursion coaches at terminal exit; Florence 75–90 min by coach",
    },
    {
      name: "Tender operations",
      quay: "Anchorage in Livorno harbour",
      usedBy: "Occasional overflow when berths are full or for very large vessels",
      cityAccess: "Tender to terminal area then taxi or coach — add 30–45 minutes to Tuscany planning",
    },
    {
      name: "Livorno Centrale station",
      quay: "Not a cruise berth — rail hub 15–20 min taxi from terminal",
      usedBy: "Regional trains to Florence SMN, Pisa Centrale and Lucca — independent passengers reach via taxi",
      cityAccess: "15–20 min taxi from cruise terminal; direct trains to Florence (~75 min), Pisa (~15 min), Lucca (~30 min)",
    },
  ] as Terminal[],
  sections: [
    {
      heading: "Where cruise ships dock in Livorno",
      paragraphs: [
        "Cruise ships dock at Livorno's commercial cruise terminal at Molo Garibaldi / Darsena Toscana — a working port city on the Tuscan coast, not a heritage destination itself.",
        "Livorno is the gateway to Tuscany: Florence sits 90 km inland, Pisa 25 km south and Lucca 35 km east. Most passengers leave the port immediately for shore excursions or trains — the city is known for cacciucco fish stew rather than headline sights.",
        "Livorno appears on Western Mediterranean, Grand Voyage and Italy-intensive itineraries from April through October, with heaviest traffic May to September.",
      ],
    },
    {
      heading: "Getting from Livorno to Tuscany",
      paragraphs: [
        "Florence is 75–90 minutes by coach or regional train from Livorno. Coaches meet passengers at the terminal exit — the fastest door-to-door option for most cruise passengers.",
        "Independent travellers taxi to Livorno Centrale (15–20 minutes, €15–25) for regional trains to Florence Santa Maria Novella, Pisa Centrale or Lucca. Validate tickets before boarding.",
        "Pisa is the closest icon — 30–45 minutes by road. Wine country around Bolgheri sits 45–60 minutes south through Maremma countryside.",
      ],
    },
    {
      heading: "Facilities and practicalities",
      paragraphs: [
        "The cruise terminal offers toilets, seating and tourist information. ATMs are available but limited — carry euros for taxis and train tickets.",
        "Currency is the euro. Italian is the local language; English is widely spoken on excursions and at major Tuscan sights. Download offline maps — terminal Wi-Fi is unreliable.",
        "Livorno and Tuscany are generally safe. Watch belongings in Florence crowds and on crowded trains during cruise season.",
      ],
    },
    {
      heading: "Return-to-ship timing",
      paragraphs: [
        "Confirm all-aboard time — usually 30–60 minutes before departure. Keep a 60–90 minute buffer beyond expected travel time, especially returning from Florence on the A12 motorway.",
        "Summer afternoon traffic from Florence routinely adds 20–40 minutes. Excursion coaches typically depart Florence by 15:30–16:00 for 17:00–18:00 all-aboard.",
        "Independent travellers should plan return trains with margin — the ship will not wait if you miss all-aboard on non-ship excursions.",
      ],
    },
  ] as PortGuideSection[],
  faqs: [
    {
      question: "How far is Florence from Livorno cruise port?",
      answer: "About 90 km — 75–90 minutes by coach or train plus 15–20 minutes taxi from terminal to Livorno Centrale if travelling by rail.",
    },
    {
      question: "Can I walk to Livorno Centrale from the cruise terminal?",
      answer: "Not recommended — industrial port roads make it 15–20 minutes by taxi. Pre-book return taxis on busy port days.",
    },
    {
      question: "Do cruise ships tender in Livorno?",
      answer: "Occasionally when berths are full. Tendering adds 30–45 minutes — confirm on your cruise app the evening before.",
    },
    {
      question: "How much time to return from Florence?",
      answer: "Allow 75–90 minutes coach transfer plus 60–90 minutes before all-aboard. A12 summer traffic can add 20–40 minutes.",
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
    question: "Where do cruise ships dock in Livorno?",
    answer:
      "At the commercial cruise terminal at Molo Garibaldi / Darsena Toscana. Coaches and taxis meet passengers at the terminal exit.",
  },
  {
    question: "How long does it take to reach Florence from Livorno?",
    answer:
      "75–90 minutes by coach or regional train from Livorno Centrale, plus 15–20 minutes taxi from the cruise terminal to the station if travelling by rail.",
  },
  {
    question: "Can I visit Tuscany without a shore excursion?",
    answer:
      "Yes — train to Florence or Pisa from Livorno Centrale suits confident travellers. Pre-book museum tickets and allow 90 minutes return buffer.",
  },
  {
    question: "What is the best Tuscany excursion for first-time visitors?",
    answer:
      "Tuscany Highlights combining Florence and Pisa on 9+ hour calls — or Renaissance Florence for a dedicated Florence day.",
  },
  {
    question: "Should I book excursions through my cruise line?",
    answer:
      "Ship tours guarantee the vessel waits if their excursion is late. Reputable independent operators track all-aboard with buffers — often smaller groups and lower prices.",
  },
  {
    question: "Is a Livorno port day long enough for Florence and Pisa?",
    answer:
      "Yes on 9+ hour calls via organised combo excursions. Standard 8-hour calls suit Florence only or Pisa & Lucca.",
  },
  {
    question: "How early should I return to Livorno from Florence?",
    answer:
      "Coaches typically leave Florence by 15:30–16:00. Independent travellers should be at Livorno terminal 60–90 minutes before all-aboard.",
  },
  {
    question: "What currency is used in Tuscany?",
    answer:
      "The euro. Cards work at major sights; carry cash for taxis, regional trains and small trattorias.",
  },
  {
    question: "Are Tuscany shore excursions suitable for limited mobility?",
    answer:
      "Pisa and Lucca are relatively flat. Florence cobbles and museum queues are challenging — private tours with vehicle drops work better.",
  },
  {
    question: "When is peak cruise season in Livorno?",
    answer:
      "April through October, with heaviest ship traffic May to September. Book Accademia and tower tickets before sailing in July and August.",
  },
];

export function getAllFaqs(): FAQ[] {
  return [...getHomepageFaqs(), ...extraFaqs];
}
`,
);

w("imported-schedules/livorno.json", "[]\n");

console.log("Livorno data generation complete.");
