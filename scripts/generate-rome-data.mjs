#!/usr/bin/env node
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const DATA = join(import.meta.dirname, "..", "src/data");

function w(name, content) {
  writeFileSync(join(DATA, name), content, "utf8");
  console.log("wrote", name);
}

const gt = `[
      { method: "Regional train", detail: "Trenitalia from Civitavecchia station to Roma Termini, then metro or taxi.", time: "~80 min", cost: "€5–15" },
      { method: "Private transfer", detail: "Pre-booked car or van from the cruise terminal to central Rome.", time: "~75 min", cost: "€120–220" },
      { method: "Shore excursion", detail: "Door-to-door tour with tickets, guide and return timed to all-aboard.", time: "~75 min each way", cost: "Tour price" },
    ]`;

const baseTransfer =
  "From Civitavecchia cruise port, reaching central Rome takes roughly 75 minutes by private transfer or about 80 minutes by regional train to Roma Termini plus onward metro or taxi. Build a 60–90 minute buffer before all-aboard — afternoon traffic on the A12 back to the port is unpredictable on cruise days.";

function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function attraction(cfg) {
  const slug = `${cfg.id}-from-cruise-port`;
  return `  {
    slug: "${slug}",
    title: "${esc(cfg.title)}",
    seoTitle: "${esc(cfg.seoTitle)}",
    metaDescription: "${esc(cfg.meta)}",
    attractionName: "${esc(cfg.name)}",
    tagline: "${esc(cfg.tagline)}",
    overview: "${esc(cfg.overview)}",
    body: [
      "${esc(baseTransfer)}",
      "${esc(cfg.body2)}",
      "${esc(cfg.body3)}",
    ],
    distanceFromPort: "About 70 km / 75–80 min from Civitavecchia",
    travelTime: "75–80 minutes each way",
    timeNeeded: "${esc(cfg.timeNeeded)}",
    gettingThere: ${gt},
    highlights: [${cfg.highlights.map((h) => `"${esc(h)}"`).join(", ")}],
    tips: [${cfg.tips.map((t) => `"${esc(t)}"`).join(", ")}],
    faqs: [
      { question: "${esc(cfg.faq1q)}", answer: "${esc(cfg.faq1a)}" },
      { question: "${esc(cfg.faq2q)}", answer: "${esc(cfg.faq2a)}" },
    ],
    relatedAttractionSlugs: [${cfg.related.map((r) => `"${r}-from-cruise-port"`).join(", ")}],
    relatedExcursionSlug: "${cfg.excursion}",
  }`;
}

const attractions = [
  {
    id: "colosseum",
    name: "Colosseum",
    title: "Colosseum from Civitavecchia Cruise Port",
    seoTitle: "Colosseum from Civitavecchia Cruise Port — How to Get There",
    meta: "How to reach the Colosseum from Civitavecchia cruise port — train (~80 min), private transfer (~75 min) and shore excursions with timed entry for cruise passengers.",
    tagline: "Rome's iconic amphitheatre — book timed entry and plan your return to the ship.",
    overview:
      "The Colosseum tops almost every Civitavecchia wish list. Timed tickets are essential; a morning slot leaves room for the Roman Forum and a safe drive back to the port.",
    body2:
      "The Colosseum uses strict timed entry that sells out weeks ahead in Mediterranean cruise season. Shore excursions bundle transfer, skip-the-line entry and guide commentary — the lowest-stress option for first-time visitors.",
    body3:
      "Walking includes ramps and uneven stone. Most passengers combine the Colosseum with the Forum in one archaeological morning before central Rome highlights in the afternoon.",
    timeNeeded: "Allow 3–4 hours including travel",
    highlights: ["Arena tiers and exterior arches", "Views toward the Roman Forum", "Optional underground visits when booked ahead"],
    tips: ["Book timed entry before sailing", "Morning slots protect your return buffer", "Wear sturdy shoes for ancient paving"],
    faq1q: "Can I visit the Colosseum on a Civitavecchia port day?",
    faq1a: "Yes on 9–11 hour calls with pre-booked tickets or a guided excursion. Allow 75–80 minutes each way plus 2+ hours on site.",
    faq2q: "Is the train practical for cruise passengers?",
    faq2a: "Possible for confident travellers, but metro connections and ticket logistics add risk. Most passengers choose door-to-door excursions for return-to-ship confidence.",
    related: ["roman-forum", "palatine-hill", "trevi-fountain"],
    excursion: "colosseum",
  },
  {
    id: "roman-forum",
    name: "Roman Forum",
    title: "Roman Forum from Civitavecchia Cruise Port",
    seoTitle: "Roman Forum from Civitavecchia — Cruise Passenger Guide",
    meta: "Reach the Roman Forum from Civitavecchia cruise port — transfer times, walking distances and combining with the Colosseum on a port day.",
    tagline: "Walk where senators debated — usually combined with the Colosseum ticket.",
    overview:
      "The Roman Forum is the heart of ancient Rome beside the Colosseum. Most timed tickets include Forum and Palatine access — plan at least 90 minutes on foot through the ruins.",
    body2:
      "The Forum is open-air with uneven paths and limited shade — challenging in midsummer heat. A guide adds context because ruins alone can feel abstract; independent visitors should download a map before leaving the ship.",
    body3:
      "Combine Forum and Colosseum in one morning, then add Trevi Fountain or Pantheon in the afternoon only if your ship stays until evening departure.",
    timeNeeded: "Allow 1.5–2 hours on site plus travel",
    highlights: ["Via Sacra and Arch of Titus", "Temple of Saturn and Vestal House", "Views toward Palatine Hill"],
    tips: ["Same ticket as Colosseum — book one timed entry", "Bring water and sun protection in summer", "Moderate walking on uneven stones"],
    faq1q: "Is the Forum included with Colosseum tickets?",
    faq1a: "Yes — standard timed tickets include the Colosseum, Roman Forum and Palatine Hill within a 24-hour window.",
    faq2q: "How much walking is involved?",
    faq2a: "Expect 1–2 km on uneven paths with some slopes. Manageable for most adults but tiring in heat.",
    related: ["colosseum", "palatine-hill", "pantheon"],
    excursion: "ancient-rome-combo",
  },
  {
    id: "palatine-hill",
    name: "Palatine Hill",
    title: "Palatine Hill from Civitavecchia Cruise Port",
    seoTitle: "Palatine Hill from Civitavecchia — Imperial Palace Guide",
    meta: "Visit Palatine Hill from Civitavecchia — emperors' palaces, Forum views and fitting it into a Rome port day with the Colosseum.",
    tagline: "Imperial palaces above the Forum — quieter crowds and the best panoramas.",
    overview:
      "Palatine Hill rises above the Roman Forum where emperors built their palaces. It shares the Colosseum ticket and rewards uphill walking with sweeping views over ancient Rome.",
    body2:
      "The hill involves gravel paths and slopes — worth it for photographers and history lovers. Many coach tours skip upper terraces; a guided ancient-Rome combo ensures more than a drive-by.",
    body3: "If mobility is limited, focus on the Colosseum exterior and Forum valley rather than the full Palatine circuit.",
    timeNeeded: "Allow 45–90 minutes on site",
    highlights: ["Domus Augustana ruins", "Views over Circus Maximus", "Panoramas across the Forum"],
    tips: ["Included on Colosseum tickets — plan routing to avoid backtracking", "Steeper paths than the Forum valley", "Best in morning light"],
    faq1q: "Can I skip Palatine Hill on a tight port day?",
    faq1a: "Yes — prioritise Colosseum interior and Forum if time is short. Palatine adds depth but requires extra walking.",
    faq2q: "Is Palatine Hill accessible?",
    faq2a: "Partially — some areas are accessible but much involves slopes and uneven paths. Private tours adapt routing.",
    related: ["colosseum", "roman-forum", "castel-sant-angelo"],
    excursion: "ancient-rome-combo",
  },
  {
    id: "trevi-fountain",
    name: "Trevi Fountain",
    title: "Trevi Fountain from Civitavecchia Cruise Port",
    seoTitle: "Trevi Fountain from Civitavecchia — Getting There",
    meta: "Reach Trevi Fountain from Civitavecchia — transfer times, crowd tips and fitting it into a Rome highlights loop.",
    tagline: "Rome's most famous fountain — free to visit but crowded at midday.",
    overview:
      "The Trevi Fountain is a quick photogenic stop — no ticket required but expect crowds. It pairs with the Pantheon and Spanish Steps on a central Rome walking loop.",
    body2:
      "The fountain sits below street level in a small piazza. Arrive early or after 16:00 for photos without hundreds of shoulders in frame. Pickpockets work the crowds — keep bags secured.",
    body3: "Allow 20–30 minutes including photos. It is a natural add-on after Vatican or ancient Rome mornings when excursions route through central Rome.",
    timeNeeded: "Allow 20–30 minutes at the fountain",
    highlights: ["Baroque sculpture and turquoise pool", "Coin-toss tradition", "Nearby gelato and espresso bars"],
    tips: ["Visit early or after 16:00 for lighter crowds", "Watch for pickpockets", "Combine with Pantheon on foot"],
    faq1q: "Do I need tickets for Trevi Fountain?",
    faq1a: "No — it is free and open 24 hours. It is a brief stop, not a standalone half-day from Civitavecchia.",
    faq2q: "Can I reach Trevi on the train DIY?",
    faq2a: "Yes — metro from Termini to Barberini then a 5-minute walk. On a port day, a highlights tour is less stressful.",
    related: ["pantheon", "spanish-steps", "piazza-navona"],
    excursion: "rome-highlights",
  },
  {
    id: "pantheon",
    name: "Pantheon",
    title: "Pantheon from Civitavecchia Cruise Port",
    seoTitle: "Pantheon from Civitavecchia Cruise Port — Cruise Day Guide",
    meta: "Visit the Pantheon from Civitavecchia — free entry, dress code and walking links to Trevi and Piazza Navona.",
    tagline: "Rome's best-preserved ancient temple — free entry with modest dress.",
    overview:
      "The Pantheon's dome and oculus have survived nearly 2,000 years. Entry is free but popular — expect a short queue. It anchors a walkable triangle with Trevi and Piazza Navona.",
    body2:
      "Interior visits take 20–40 minutes. Shoulders and knees should be covered. The portico columns photograph well from the piazza if queues are long.",
    body3: "Afternoon sun through the oculus is memorable. Pair with Campo de' Fiori or Piazza Navona five minutes away.",
    timeNeeded: "Allow 30–45 minutes on site",
    highlights: ["Coffered dome and open oculus", "Raphael's tomb", "Piazza della Rotonda cafés"],
    tips: ["Cover shoulders and knees", "Combine with Trevi and Navona on foot", "Queues move faster mid-week"],
    faq1q: "Is the Pantheon free?",
    faq1a: "Yes — entry is free. No timed ticket is required but lines form on busy cruise days.",
    faq2q: "How far from Trevi Fountain?",
    faq2a: "About 10 minutes on foot — easy to combine on a highlights tour.",
    related: ["trevi-fountain", "piazza-navona", "spanish-steps"],
    excursion: "rome-highlights",
  },
  {
    id: "piazza-navona",
    name: "Piazza Navona",
    title: "Piazza Navona from Civitavecchia Cruise Port",
    seoTitle: "Piazza Navona from Civitavecchia — Baroque Rome Guide",
    meta: "Reach Piazza Navona from Civitavecchia — Bernini fountains, cafés and central Rome walking routes.",
    tagline: "Baroque fountains and café culture — five minutes from the Pantheon.",
    overview:
      "Piazza Navona occupies an ancient stadium outline framed by Bernini's Fountain of the Four Rivers. It is a natural pause on any central Rome walking loop.",
    body2:
      "The square is flat and easy underfoot — good for passengers wanting atmosphere without archaeological climbs. Café prices are premium for the view; excursions often allow free time here.",
    body3: "Street artists add energy. Allow 30–45 minutes, longer if you sit for lunch watching the fountains.",
    timeNeeded: "Allow 30–60 minutes",
    highlights: ["Fountain of the Four Rivers", "Sant'Agnese church façade", "Outdoor dining and performers"],
    tips: ["Flat terrain — easier than Forum", "Check café prices before sitting", "Combine with Pantheon and Campo de' Fiori"],
    faq1q: "Is Piazza Navona worth a dedicated trip from Civitavecchia?",
    faq1a: "Not alone — it shines as part of a central Rome loop with Pantheon, Trevi and Spanish Steps.",
    faq2q: "Is the square accessible?",
    faq2a: "Yes — level cobblestone, among the easiest major sights for limited mobility.",
    related: ["pantheon", "trevi-fountain", "castel-sant-angelo"],
    excursion: "rome-highlights",
  },
  {
    id: "spanish-steps",
    name: "Spanish Steps",
    title: "Spanish Steps from Civitavecchia Cruise Port",
    seoTitle: "Spanish Steps from Civitavecchia — Piazza di Spagna Guide",
    meta: "Visit the Spanish Steps from Civitavecchia — shopping streets and fitting Tridente sights into a Rome port day.",
    tagline: "The famous Scalinata and designer shopping above Piazza di Spagna.",
    overview:
      "The Spanish Steps climb to Trinità dei Monti — a classic photo stop. Sitting on the steps is restricted but the piazza and boutiques remain a favourite free-time area.",
    body2:
      "The steps are a brief visit; Via Condotti is Rome's shopping heart. Excursions allow 30–45 minutes here before Vatican City or the return coach.",
    body3: "Evening light is beautiful but risky for port schedules — prioritise morning or early afternoon on cruise days.",
    timeNeeded: "Allow 30–45 minutes",
    highlights: ["Trinità dei Monti church", "Barcaccia fountain", "Designer shopping on Via Condotti"],
    tips: ["Sitting on the steps is not permitted", "Combine with Trevi on foot", "Metro Spagna is nearest"],
    faq1q: "Can I climb the Spanish Steps on a port day?",
    faq1a: "Yes — the climb takes a few minutes. Most passengers photograph from Piazza di Spagna.",
    faq2q: "How far from the Vatican?",
    faq2a: "About 20–30 minutes on foot or 15 minutes by taxi — many tours route Vatican morning and Tridente afternoon.",
    related: ["trevi-fountain", "pantheon", "piazza-navona"],
    excursion: "rome-highlights",
  },
  {
    id: "castel-sant-angelo",
    name: "Castel Sant'Angelo",
    title: "Castel Sant'Angelo from Civitavecchia Cruise Port",
    seoTitle: "Castel Sant'Angelo from Civitavecchia — Tiber Landmark Guide",
    meta: "Visit Castel Sant'Angelo from Civitavecchia — papal fortress, bridge views and links to Vatican City.",
    tagline: "Hadrian's mausoleum turned papal fortress — stunning from the bridge.",
    overview:
      "Castel Sant'Angelo dominates the Tiber beside Vatican City. Interior visits offer river views and papal history; even an exterior stop on Ponte Sant'Angelo delivers iconic photos.",
    body2:
      "Interior visits take 60–90 minutes with spiral ramps and terrace views. Tickets are easier than the Colosseum but worth pre-booking in peak season.",
    body3: "Hidden-gem seekers love the castle when Vatican queues overwhelm. Couples and history lovers get papal intrigue without Forum climbing.",
    timeNeeded: "Allow 45–90 minutes",
    highlights: ["Ponte Sant'Angelo angel statues", "Terrace views toward St Peter's", "Papal apartments museum"],
    tips: ["Pair with Vatican or St Peter's", "Book interior tickets in summer", "Flat bridge approach"],
    faq1q: "Is Castel Sant'Angelo near the Vatican?",
    faq1a: "Yes — a 5–10 minute walk from St Peter's Square along Via della Conciliazione.",
    faq2q: "Can I skip the interior on a tight port day?",
    faq2a: "Absolutely — the bridge and exterior are worthwhile without a ticket.",
    related: ["pantheon", "trevi-fountain", "colosseum"],
    excursion: "hidden-rome",
  },
];

w(
  "highlights.ts",
  `import type { AttractionPage } from "./types";

export const highlights: AttractionPage[] = [
${attractions.map(attraction).join(",\n")}
];

export function getHighlightBySlug(slug: string): AttractionPage | undefined {
  return highlights.find((h) => h.slug === slug);
}

export function getAllHighlightSlugs(): string[] {
  return highlights.map((h) => h.slug);
}
`,
);

function guidePage(cfg) {
  const recs = (cfg.recs ?? [])
    .map(
      (r) =>
        `      { category: "${r.cat}", title: "${esc(r.title)}", description: "${esc(r.desc)}", href: "${r.href}" },`,
    )
    .join("\n");
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
    faqs: [
      { question: "${esc(cfg.faq1q)}", answer: "${esc(cfg.faq1a)}" },
      { question: "${esc(cfg.faq2q)}", answer: "${esc(cfg.faq2a)}" },
    ],${recs ? `\n    recommendations: [\n${recs}\n    ],` : ""}
    relatedSlugs: [${cfg.related.map((s) => `"${s}"`).join(", ")}],
    imageKey: "${cfg.imageKey}",
    hubPath: "${cfg.hubPath}",
  }`;
}

function guideFile(exportName, arrayName, pages, getFn, slugsFn) {
  return `import type { GuidePage } from "./types";

export const ${arrayName}: GuidePage[] = [
${pages.map(guidePage).join(",\n")}
];

export function ${getFn}(slug: string): GuidePage | undefined {
  return ${arrayName}.find((p) => p.slug === slug);
}

export function ${slugsFn}(): string[] {
  return ${arrayName}.map((p) => p.slug);
}
`;
}

const vaticanPages = [
  {
    slug: "vatican-museums",
    title: "Vatican Museums — Civitavecchia Cruise Guide",
    seoTitle: "Vatican Museums from Civitavecchia Cruise Port",
    meta: "Visit the Vatican Museums from Civitavecchia — skip-the-line timing, dress code and return-to-ship planning for cruise passengers.",
    tagline: "Michelangelo, Raphael and miles of galleries — ticket timing makes or breaks your port day.",
    overview: "The Vatican Museums are the world's richest papal art collection. From Civitavecchia you need 75–80 minutes each way plus 2–3 hours inside — only realistic on 9+ hour port calls with pre-booked entry.",
    body1: baseTransfer,
    body2: "Skip-the-line timed tickets or a guided excursion are essential — walk-up queues can exceed two hours on cruise days. Morning entries (08:30–10:00) leave afternoon margin for St Peter's Basilica or Castel Sant'Angelo.",
    body3: "Dress modestly — shoulders and knees covered. Large bags are not permitted; leave bulky daypacks on the coach if your tour allows.",
    highlights: ["Sistine Chapel ceiling", "Raphael Rooms", "Spiral exit staircase and gallery maps"],
    tips: ["Book skip-the-line tickets before sailing", "Morning slot protects return buffer", "No large backpacks inside"],
    faq1q: "Can I do Vatican Museums on a Civitavecchia port day?",
    faq1a: "Yes on 9–11 hour calls with pre-booked morning entry. Allow 75–80 minutes each way plus 2–3 hours in the museums.",
    faq2q: "Should I combine Museums and St Peter's?",
    faq2a: "Many excursions do both — confirm routing because basilica queues add 30–60 minutes without skip-the-line access.",
    recs: [
      { cat: "best-guided", title: "Vatican Shore Excursion", desc: "Door-to-door with skip-the-line entry and return timed to your ship.", href: "/shore-excursions/vatican" },
      { cat: "best-first-time", title: "Vatican in One Day Guide", desc: "How to sequence Museums, Sistine Chapel and St Peter's.", href: "/vatican/vatican-in-one-day" },
      { cat: "editors-choice", title: "Skip-the-Line Guide", desc: "Ticket types and timing that actually work from Civitavecchia.", href: "/vatican/vatican-skip-the-line-guide" },
    ],
    related: ["sistine-chapel", "st-peters-basilica", "vatican-in-one-day"],
    imageKey: "vatican",
    hubPath: "/vatican",
  },
  {
    slug: "sistine-chapel",
    title: "Sistine Chapel — What Cruise Passengers Should Know",
    seoTitle: "Sistine Chapel from Civitavecchia — Cruise Passenger Guide",
    meta: "See the Sistine Chapel from Civitavecchia — it is inside the Vatican Museums route, silence rules and photography restrictions explained.",
    tagline: "Michelangelo's ceiling is the climax of the Museums route — not a separate ticket.",
    overview: "The Sistine Chapel sits at the end of the Vatican Museums one-way route. You cannot buy a standalone ticket — plan the full museum visit with your Civitavecchia transfer.",
    body1: baseTransfer,
    body2: "Visitors must stay silent and photography is prohibited — guards enforce both. The chapel is smaller than photos suggest; peak crowds mean shoulder-to-shoulder viewing in summer.",
    body3: "Budget 20–30 minutes in the chapel itself after 90+ minutes walking galleries. Fatigue is real — wear comfortable shoes for marble floors.",
    highlights: ["Creation of Adam", "Last Judgement altar wall", "Michelangelo and Botticelli side panels"],
    tips: ["No photos or video inside", "Cannot backtrack — exit is one-way", "Rest before the final gallery push"],
    faq1q: "Can I visit only the Sistine Chapel?",
    faq1a: "No — it is only accessible through the Vatican Museums ticketed route.",
    faq2q: "How long is the walk to the chapel?",
    faq2a: "Typically 45–90 minutes through galleries depending on pace and crowds before you reach the chapel.",
    recs: [
      { cat: "best-guided", title: "Vatican Excursion", desc: "Guides navigate the one-way route efficiently.", href: "/shore-excursions/vatican" },
      { cat: "best-history", title: "Vatican Museums Guide", desc: "Full context before you reach the chapel.", href: "/vatican/vatican-museums" },
    ],
    related: ["vatican-museums", "st-peters-basilica", "vatican-skip-the-line-guide"],
    imageKey: "vatican",
    hubPath: "/vatican",
  },
  {
    slug: "st-peters-basilica",
    title: "St Peter's Basilica — Civitavecchia Port Day Guide",
    seoTitle: "St Peter's Basilica from Civitavecchia Cruise Port",
    meta: "Visit St Peter's Basilica from Civitavecchia — free entry, dome climb, dress code and security queues for cruise passengers.",
    tagline: "The world's largest church — free entry but security lines can eat an hour.",
    overview: "St Peter's Basilica is free to enter but security queues vary wildly. From Civitavecchia, pair it with Vatican Museums morning or an afternoon slot after ancient Rome — not both on a short call.",
    body1: baseTransfer,
    body2: "Dome climb tickets add 30–60 minutes and 551 steps — spectacular views but not for vertigo or tight schedules. Papal tombs and Michelangelo's Pietà are ground-level highlights.",
    body3: "Strict dress code — no shorts, bare shoulders or hats. Security is airport-style; allow 20–45 minutes in queue unless your excursion includes skip-the-line basilica access.",
    highlights: ["Michelangelo's Pietà", "Bernini's baldachin", "Optional dome panorama"],
    tips: ["Shoulders and knees covered", "Dome climb needs separate ticket", "Afternoon queues sometimes shorter"],
    faq1q: "Is St Peter's Basilica free?",
    faq1a: "Entry is free; dome and treasury tickets cost extra. Excursions may bundle skip-the-line basilica access.",
    faq2q: "Can I do basilica and Colosseum same day?",
    faq2a: "Only on long port calls with a fast private tour — most passengers choose Vatican OR ancient Rome as their anchor.",
    recs: [
      { cat: "best-first-time", title: "Vatican in One Day", desc: "Realistic sequencing from Civitavecchia.", href: "/vatican/vatican-in-one-day" },
      { cat: "best-guided", title: "Vatican Shore Excursion", desc: "Combines Museums and basilica with transfer.", href: "/shore-excursions/vatican" },
      { cat: "best-history", title: "Castel Sant'Angelo", desc: "Five-minute walk from the basilica — papal fortress views.", href: "/rome-highlights/castel-sant-angelo-from-cruise-port" },
    ],
    related: ["vatican-museums", "sistine-chapel", "vatican-in-one-day"],
    imageKey: "vatican",
    hubPath: "/vatican",
  },
  {
    slug: "vatican-in-one-day",
    title: "Vatican in One Day from Civitavecchia",
    seoTitle: "Vatican in One Day from Civitavecchia Cruise Port",
    meta: "Fit Vatican Museums, Sistine Chapel and St Peter's into one Civitavecchia port day — realistic timing and return-to-ship confidence.",
    tagline: "The full Vatican experience is possible on a long port call — if you book morning entry and a door-to-door tour.",
    overview: "A complete Vatican day from Civitavecchia means 75–80 minutes inbound, 3–4 hours on site, and 75–80 minutes back with a 60-minute buffer. Works on 10–11 hour calls, not 7-hour whistle stops.",
    body1: baseTransfer,
    body2: "Sample timing: 07:30 leave port, 09:00 Vatican Museums entry, 12:00 St Peter's Square, 13:00 lunch near Prati, 14:30 depart Rome, 16:00 port with buffer before 17:30 all-aboard.",
    body3: "Do not add Colosseum the same day unless you accept exterior-only stops. First-timers should pick Vatican OR ancient Rome as the anchor theme.",
    highlights: ["Morning Museums and Sistine Chapel", "St Peter's Square and basilica", "Castel Sant'Angelo photo stop optional"],
    tips: ["Book earliest museum slot", "Light lunch near Vatican — avoid crossing city", "Confirm ship departure before booking"],
    faq1q: "Is Vatican in one day realistic from Civitavecchia?",
    faq1a: "Yes on 10+ hour calls with pre-booked morning tickets and door-to-door transfer. Short calls should focus on basilica exterior or skip Vatican entirely.",
    faq2q: "What is return-to-ship confidence?",
    faq2a: "High on reputable excursions with 60–90 minute buffers. DIY train days are moderate — one delay can jeopardise all-aboard.",
    recs: [
      { cat: "editors-choice", title: "Vatican Shore Excursion", desc: "Our top pick for a complete Vatican port day.", href: "/shore-excursions/vatican" },
      { cat: "best-guided", title: "Skip-the-Line Guide", desc: "Ticket strategy that saves hours.", href: "/vatican/vatican-skip-the-line-guide" },
      { cat: "best-short-port", title: "Train DIY Guide", desc: "Only if your call is long and you accept schedule risk.", href: "/shore-excursions/train-diy-guide" },
    ],
    related: ["vatican-museums", "vatican-skip-the-line-guide", "st-peters-basilica"],
    imageKey: "vatican",
    hubPath: "/vatican",
  },
  {
    slug: "vatican-skip-the-line-guide",
    title: "Vatican Skip-the-Line Guide for Cruise Passengers",
    seoTitle: "Vatican Skip-the-Line Tickets from Civitavecchia",
    meta: "Skip-the-line Vatican tickets and tours from Civitavecchia — official entry types, scams to avoid and timing for cruise schedules.",
    tagline: "The difference between a smooth Vatican morning and losing two hours in a sun-baked queue.",
    overview: "Skip-the-line means pre-booked timed entry or a guided tour with reserved access — not a magical side door. From Civitavecchia, book before sailing or use a shore excursion that includes official tickets.",
    body1: baseTransfer,
    body2: "Official Vatican timed tickets release weeks ahead and sell out on peak cruise days. Third-party 'skip the line' sellers vary — stick to Vatican.va, reputable operators or cruise-timed excursions with published inclusions.",
    body3: "St Peter's basilica skip-the-line is separate from Museums tickets. Confirm whether your package includes both or only museum entry.",
    highlights: ["Official timed museum tickets", "Early-entry and Friday evening options", "Guided tour fast-track lanes"],
    tips: ["Book 4–8 weeks ahead in summer", "Avoid unofficial touts at Vatican gates", "Screenshot tickets offline"],
    faq1q: "Are skip-the-line tickets worth it from Civitavecchia?",
    faq1a: "Essential on cruise days — standard queues can exceed two hours, destroying a port day.",
    faq2q: "Can I buy tickets at the port?",
    faq2a: "Unlikely on the day — sellouts are common. Pre-book before your cruise or book an excursion with included entry.",
    recs: [
      { cat: "editors-choice", title: "Vatican Excursion", desc: "Tickets, guide and return transfer bundled.", href: "/shore-excursions/vatican" },
      { cat: "best-independent", title: "Train DIY Guide", desc: "For confident travellers who pre-buy tickets online.", href: "/shore-excursions/train-diy-guide" },
      { cat: "best-value", title: "Compare DIY vs Guided", desc: "When independent booking beats ship tours.", href: "/compare/diy-vs-guided" },
    ],
    related: ["vatican-museums", "vatican-in-one-day", "sistine-chapel"],
    imageKey: "vatican",
    hubPath: "/vatican",
  },
];

w("vatican-pages.ts", guideFile("vatican", "vaticanPages", vaticanPages, "getVaticanPageBySlug", "getAllVaticanPageSlugs"));

console.log("Phase 1 complete — extend script for remaining files");
