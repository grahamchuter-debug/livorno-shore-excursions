#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DATA = join(dirname(fileURLToPath(import.meta.url)), "..", "src/data");
const SCHED = join(DATA, "imported-schedules");
function w(n, c) { writeFileSync(join(DATA, n), c, "utf8"); console.log("wrote", n); }

const portLog = "Allow 75–80 minutes each way from Civitavecchia cruise terminal. Book morning timed entries where required and confirm your ship's all-aboard time before leaving port. Reputable operators maintain 60–90 minute return buffers.";

function exc(slug, title, seo, meta, cat, tag, dur, pace, best, ov, b1, b2, b3, hi, inc, tips, faqs, rel, featured) {
  return `  {
    slug: "${slug}",
    title: "${title}",
    seoTitle: "${seo}",
    metaDescription: "${meta}",
    category: "${cat}",
    tagline: "${tag}",
    duration: "${dur}",
    pace: "${pace}" as const,
    bestFor: "${best}",
    overview: "${ov}",
    body: ["${b1}", "${b2}", "${b3}"],
    highlights: [${hi.map(h=>`"${h}"`).join(", ")}],
    included: [${inc.map(i=>`"${i}"`).join(", ")}],
    portLogistics: "${portLog}",
    tips: [${tips.map(t=>`"${t}"`).join(", ")}],
    faqs: [${faqs.map(f=>`{ question: "${f.q}", answer: "${f.a}" }`).join(", ")}],
    relatedExcursionSlugs: [${rel.map(r=>`"${r}"`).join(", ")}],${featured ? "\n    featured: true," : ""}
  }`;
}

w("excursions.ts", `import type { ExcursionPage } from "./types";

export const excursions: ExcursionPage[] = [
${exc("colosseum","Colosseum Shore Excursion","Colosseum Shore Excursion from Civitavecchia","Visit the Colosseum on a Civitavecchia shore excursion with pre-booked timed entry, expert guide and return timed to your ship.","Ancient Rome","Rome's gladiator arena — timed entry and transfer handled for cruise passengers.","4–5 hours","Moderate","First-timers and ancient history lovers","The Colosseum defines Rome for most cruise passengers. This excursion secures timed entry, handles the 75-minute transfer from Civitavecchia and still leaves a comfortable buffer before all-aboard.","Stepping onto the arena floor (where your ticket allows) connects you to 2,000 years of history — more moving with a guide who explains the hypogeum, spectator tiers and emperors' politics.","From Civitavecchia terminal, coaches or vans reach the Colosseum in roughly 75 minutes. Your entry slot is pre-arranged — essential on cruise days when walk-up tickets vanish by mid-morning.","Most routes include exterior Forum views; full Forum and Palatine walking depends on your package — confirm when booking.",["Skip-the-line Colosseum timed entry","Expert archaeologist or licensed guide","Door-to-door Civitavecchia transfer","Return aligned to ship departure"],["Pre-booked timed entry","Licensed guide","Return transfer from terminal"],["Book before your cruise in peak season","Morning entry protects afternoon return","Wear sturdy shoes for uneven paving"],[{q:"Is there time for the Forum too?",a:"Many combos include Forum and Palatine — choose Ancient Rome combo for maximum archaeological time."},{q:"Will the ship wait?",a:"Independent tours require you to respect all-aboard; ship excursions carry delay guarantee — keep buffer either way."}],["ancient-rome-combo","rome-highlights","private-rome"],true)}
,
${exc("vatican","Vatican Shore Excursion","Vatican Museums Shore Excursion from Civitavecchia","Skip-the-line Vatican Museums and Sistine Chapel from Civitavecchia with cruise-timed transfers and dress-code briefing.","Vatican","Michelangelo, Raphael and St Peter's — the Vatican done properly on a port day.","5–6 hours","Moderate","Art lovers and faith-focused travellers","The Vatican Museums demand skip-the-line timed entry and a sequenced route — exactly what this excursion delivers from Civitavecchia with return timing built around your ship.","Your guide navigates the one-way gallery route toward the Sistine Chapel — explaining Raphael Rooms and map galleries without the overwhelm of going alone on a deadline.","Dress code matters: shoulders and knees covered. Large bags stay on the coach — pack light for the museum walk.","St Peter's Basilica may be included or offered as optional free time — clarify basilica security queue time when booking.",["Skip-the-line Vatican Museums entry","Sistine Chapel with guide context","St Peter's Square (and basilica if included)","Civitavecchia door-to-door transfer"],["Timed museum tickets","Licensed Vatican guide","Return transfer"],["Earliest museum slot available","Modest dress required","No photos in Sistine Chapel"],[{q:"Basilica included?",a:"Varies by package — confirm skip-the-line basilica access versus square-only stop."},{q:"Can I do Vatican and Colosseum?",a:"Not both interiors on standard port calls — pick one anchor per day."}],["ancient-rome-combo","rome-highlights","luxury-rome"],true)}
,
${exc("ancient-rome-combo","Ancient Rome Combo Tour","Ancient Rome Shore Excursion — Colosseum, Forum & Palatine","Full ancient Rome from Civitavecchia — Colosseum, Roman Forum and Palatine Hill with timed tickets and expert guide.","Ancient Rome","The complete archaeological morning — Colosseum, Forum and Palatine in one sequenced visit.","5–6 hours","Active","History lovers who want depth over breadth","Ancient Rome combo is our Editor's Choice for passengers whose primary goal is imperial history — maximum time inside the ticketed zone with logical routing between Colosseum, Forum valley and Palatine terraces.","A specialist guide brings ruins to life — the Arch of Titus, Via Sacra and imperial palaces otherwise read as random stones.","Timed entry anchors your morning; the guide sequences Forum and Palatine before crowds and heat peak.","Afternoon may include a drive-by Trevi or Pantheon photo stop on return routing — not a second major interior.",["Colosseum timed entry","Roman Forum walk","Palatine Hill terraces","Expert ancient history guide"],["Combined archaeological ticket","Licensed guide","Door-to-door transfer"],["Most walking of standard tours — wear good shoes","Morning start essential","Not ideal for significant mobility limits without private variant"],[{q:"How much walking?",a:"Expect 2–3 km on uneven paths with slopes on Palatine — plan accordingly."},{q:"Better than Colosseum-only?",a:"Yes if Forum and Palatine matter — choose Colosseum-only if mobility is limited."}],["colosseum","vatican","rome-highlights"],true)}
,
${exc("rome-highlights","Rome Highlights Tour","Rome Highlights Shore Excursion from Civitavecchia","See Trevi, Pantheon, Colosseum exterior and more on a Civitavecchia highlights tour built for first-time visitors.","Highlights","The essential Rome icons in one balanced day — best for first-time Civitavecchia callers.","5–6 hours","Moderate","First-time visitors with one Rome day","Rome Highlights balances the city's postcard sights without requiring two major timed tickets — ideal when you want breadth and photos with reliable return timing.","Typical routing includes Colosseum exterior and Forum overview, Trevi Fountain, Pantheon, Piazza Navona and a drive past St Peter's or Castel Sant'Angelo depending on traffic.","One interior timed entry may be included (often Colosseum OR quick Pantheon queue) — confirm package details.","This is our best-first-time option when you cannot decide between Vatican and ancient Rome — you sample both eras externally.",["Colosseum and Forum photo stops","Trevi Fountain and Pantheon","Piazza Navona walk","Spanish Steps or St Peter's drive-by"],["Guide and transport","Select timed entry if package includes","Terminal pickup"],["Best default for first Rome visit","Confirm which interiors are included","Great photography opportunities"],[{q:"Inside Colosseum?",a:"Some packages include entry — others exterior only for time efficiency."},{q:"Enough for one day?",a:"Yes — this is designed as the complete first-timer Civitavecchia day."}],["colosseum","vatican","golf-cart"],true)}
,
${exc("food-tours","Roman Food Tour","Rome Food Tour from Civitavecchia Cruise Port","Taste Rome on a food tour from Civitavecchia — trattoria tastings, market visits and gelato timed for your ship.","Food & drink","Carbonara, supplì and gelato — Rome through its flavours on a port day.","4–5 hours","Relaxed","Food lovers and repeat Rome visitors","When you have eaten your way through the icons elsewhere, this tour centres Trastevere and Campo de' Fiori tastings with English-speaking food guides who know cruise deadlines.","Multiple small plates across trattorias replace a formal lunch — come hungry and skip ship buffet beforehand.","Wine and gelato tastings included on most routes — flag dietary restrictions at booking.","Less walking than Forum tours but cobbled lanes still require sensible shoes.",["Trastevere tastings","Market visit when scheduled","Wine or gelato pairings","Door-to-door transfer"],["Guided tastings","Food guide","Transport from port"],["Not ideal on 7-hour port calls","Inform allergies early","Afternoon tours need late ship departure"],[{q:"Full meal?",a:"Tastings usually equal a full meal by volume."},{q:"With Colosseum?",a:"Some combos add exterior photo — not interior same day."}],["wine-experiences","hidden-rome","rome-highlights"],false)}
,
${exc("family-rome","Family Rome Tour","Family-Friendly Rome Shore Excursion from Civitavecchia","Rome for families from Civitavecchia — gladiator stories, gelato, shorter walks and kid-friendly guides.","Family","Gladiators, gelato and manageable walks — Rome at a pace children tolerate.","4–5 hours","Relaxed","Families with children aged 5–14","Family Rome trades museum marches for engaging stories at the Colosseum, gelato stops and parks — with toilet breaks and shorter walking segments built in.","Guides use gladiator narratives and scavenger-style questions to keep children interested at ancient sites.","Vatican Museums are usually skipped in favour of St Peter's Square exterior — better for shorter attention spans.","Private vehicle at each stop helps with strollers versus public transport chaos.",["Colosseum with kid-focused guide","Gelato and pizza stop","St Peter's Square or Villa Borghese park","Short walking segments"],["Family-paced guide","Transport from terminal","Activity adapted to ages"],["Share children's ages when booking","Bring snacks and water","Stroller-friendly on private variant"],[{q:"Toddlers?",a:"Private tour strongly recommended — group tours suit school-age children best."},{q:"Vatican for kids?",a:"Generally no — square and Castel bridge work better."}],["private-rome","golf-cart","rome-highlights"],true)}
,
${exc("private-rome","Private Rome Tour","Private Rome Shore Excursion from Civitavecchia","Private Rome tours from Civitavecchia — your vehicle, your guide, your route with strongest return-to-ship confidence.","Private","Your party, your pace — the most flexible Rome day from Civitavecchia.","6–8 hours","Relaxed","Families, groups and mobility-limited passengers","Private tours assign your dedicated driver-guide team, build routes around your must-sees and maintain direct contact with port authorities regarding ship timing.","Colosseum morning plus Trevi and Pantheon afternoon — or Vatican plus Castel Sant'Angelo — your choice within realistic physics.","Per-person cost drops for groups of four to eight versus buying separate coach seats.","Strongest option when anyone in your party has mobility limits — vehicle waits at each stop.",["Custom itinerary","Private vehicle and guide","Flexible meal stops","Priority return timing"],["Private guide","Private transport","Tailored routing"],["Agree must-sees at booking","Operator pre-buys tickets when possible","Best value for 4+ guests"],[{q:"vs cruise line private?",a:"Often similar quality at lower price — without ship delay guarantee."},{q:"How many sights?",a:"One major interior plus 3–4 exterior stops is realistic."}],["luxury-rome","ancient-rome-combo","vatican"],true)}
,
${exc("golf-cart","Rome Golf Cart Tour","Rome Golf Cart Tour from Civitavecchia","Cover Rome's centro sights by golf cart from Civitavecchia — minimal walking for mobility-limited passengers.","Tour type","Trevi, Pantheon and Navona with minimal steps — golf cart through centro lanes.","4–5 hours","Relaxed","Mobility-limited passengers and hot summer days","Golf carts navigate pedestrian zones coaches cannot — efficient centro coverage with your driver-guide handling Civitavecchia transfers at both ends.","Routes hit Trevi, Pantheon, Piazza Navona, Spanish Steps and Janiculum viewpoint with short walks at each stop.","Not for Colosseum or Vatican interiors — exterior photo stops possible on long calls.","Popular with seniors and families avoiding marathon cobblestone miles in July heat.",["Golf cart centro tour","Minimal walking required","Photo stops at major fountains","Door-to-door from port"],["Cart and driver-guide","Port transfers","Route through permitted zones"],["Hold on in narrow lanes","Not substitute for Vatican Museums","Book morning for fewer pedestrians"],[{q:"Allowed in all piazzas?",a:"Routes follow permitted streets — final metres to fountains on foot."},{q:"Colosseum?",a:"Exterior drive-by possible — no arena entry via cart."}],["rome-highlights","private-rome","family-rome"],false)}
,
${exc("hidden-rome","Hidden Rome Tour","Hidden Rome Shore Excursion from Civitavecchia","Discover Trastevere, Jewish Ghetto and Castel Sant'Angelo on a hidden Rome tour for repeat Civitavecchia visitors.","Neighbourhood","Beyond the icons — neighbourhoods and stories coach tours skip.","5–6 hours","Moderate","Repeat visitors who have done Colosseum and Vatican","Hidden Rome explores Trastevere ochre lanes, Jewish Ghetto history, Aventine Keyhole and Castel Sant'Angelo — atmosphere over ticket queues.","Lower density sights mean more relaxed pacing and better café time — ideal when you refuse another Sistine Chapel shuffle.","First-timers should not choose this — you will feel you missed Rome entirely without icon anchors.","Photography-focused passengers love golden-hour facades in Trastevere.",["Trastevere and Ghetto walks","Castel Sant'Angelo bridge","Aventine Keyhole when time allows","Local trattoria lunch option"],["Neighbourhood guide","Transport from Civitavecchia","Walking route"],["Repeat visitors only","Wear comfortable shoes","Not for 7-hour calls"],[{q:"First cruise to Rome?",a:"Choose Highlights or Ancient Rome instead."},{q:"Catacombs?",a:"Specialised tours only — ask when booking."}],["food-tours","evening-rome","private-rome"],false)}
,
${exc("evening-rome","Evening Rome Tour","Evening Rome Excursion from Civitavecchia","Evening Rome for late-departure ships — lit fountains, aperitivo and night tours from Civitavecchia.","Experience","Rome after dark — for ships departing 20:00 or later.","5–6 hours","Relaxed","Late ship departures and photography lovers","When your ship sails after 20:00, standard afternoon-return tours waste Rome's most magical hours — this excursion schedules centro visits as daylight fades.","Trevi and Pantheon lit at night, Trastevere aperitivo and Colosseum exterior floodlights — memorable without midday heat.","Confirm your departure time before booking — useless on 17:00 sailings.","Operator must demonstrate prior late-return track record to Civitavecchia.",["Evening fountain circuit","Trastevere aperitivo stop","Colosseum exterior at night","Late return to port"],["Evening guide","Transport timed to late sailing","Flexible dinner option"],["Ship must depart 20:00+","Still keep 60-min buffer","Not for first-time icon interiors"],[{q:"My ship leaves 18:00?",a:"Choose standard Rome Highlights instead — evening tour will not fit."},{q:"Safe at night?",a:"Centro tourist zones are busy — standard urban awareness applies."}],["luxury-rome","food-tours","hidden-rome"],false)}
,
${exc("luxury-rome","Luxury Rome Tour","Luxury Private Rome Tour from Civitavecchia","Luxury Rome from Civitavecchia — premium vehicle, elite guide and skip-the-line priority for discerning cruise passengers.","Luxury","Mercedes, Michelin and skip-the-line — Rome without compromise on a port day.","6–8 hours","Relaxed","Couples, honeymoons and premium travellers","Luxury Rome assigns top-tier guides, premium vehicles and priority entries where available — with concierge-level attention to your ship's departure window.","Flexible Michelin or rooftop terrace lunch, extended time at Bernini fountains and optional shopping on Via Condotti if desired.","Costs more but eliminates every friction point that makes ordinary port days feel rushed.","Pair with luxury pre-cruise hotel for seamless FCO-to-Rome-to-ship journey.",["Premium private vehicle","Elite licensed guide","Priority entries where available","Flexible fine dining"],["Luxury transport","Top-tier guide","Concierge-style planning"],["Book early in peak season","Specify priorities at enquiry","Ideal for milestones"],[{q:"Worth the premium?",a:"For once-in-a-lifetime Rome days — yes, if budget allows."},{q:"Vatican included?",a:"Often — with earliest entry slots secured by operator."}],["private-rome","vatican","evening-rome"],true)}
,
${exc("train-diy-guide","Train DIY Rome Guide","DIY Rome by Train from Civitavecchia — Cruise Guide","Independent Rome day via train from Civitavecchia — schedules, tickets and return timing for confident cruise passengers.","Independent","The budget path — regional train to Termini and self-guided Rome for experienced travellers.","6–8 hours","Active","Experienced, budget-conscious passengers on long port calls","This is not a tour — our guide helps you plan the regional train, pre-bought timed tickets and strict return schedule from Civitavecchia station to your ship.","Walk 10–15 minutes from terminal to Civitavecchia station, train to Roma Termini (~50–60 min), metro or taxi to sights — reverse with generous margin.","Pre-buy Colosseum or Vatican timed entry online — walk-up fails on cruise days.","Return-to-ship confidence is moderate — one train delay can cascade. Not for first-timers or short calls.",["Train schedule planning","Ticket purchase guidance","Route maps and timing worksheet","Return buffer calculator"],["Planning guide only — not a guided tour","You manage all transport and tickets"],["Long port calls only (9+ hours)","Pre-buy timed entries","Avoid last train — leave Rome by 14:00–15:00 typical"],[{q:"Train cost?",a:"Regional train roughly €5–15 return plus metro — cheapest independent option."},{q:"Station walk?",a:"10–15 minutes from cruise terminal — factor into timing."}],["rome-highlights","private-rome","civitavecchia-to-rome"],false)}
];

export function getExcursionBySlug(slug: string) {
  return excursions.find((e) => e.slug === slug);
}

export function getAllExcursionSlugs() {
  return excursions.map((e) => e.slug);
}

export function getFeaturedExcursions() {
  return excursions.filter((e) => e.featured);
}
`);

// transfers.ts - Rome focused
w("transfers.ts", `import type { TransferPage } from "./types";

export const transfers: TransferPage[] = [
  {
    slug: "private-transfers",
    title: "Private Cruise Transfers — Civitavecchia & Rome",
    seoTitle: "Private Transfers FCO, Rome & Civitavecchia Cruise Port",
    metaDescription: "Private transfers between Fiumicino airport, Rome hotels and Civitavecchia cruise port — meet-and-greet for embarkation and disembarkation.",
    category: "Private",
    tagline: "Door-to-door comfort — the least stressful way to reach your ship or airport.",
    overview: "Private transfers give you a dedicated vehicle from FCO, Ciampino, central Rome or Civitavecchia terminal with luggage help and fixed pricing — essential on embarkation morning.",
    body: [
      "Civitavecchia lies 60–70 km from FCO and 70 km from central Rome. Private cars take 60–75 minutes; minivans suit families. Drivers should know your terminal and ship name.",
      "On disembarkation, pre-booked pickup avoids the taxi scramble when thousands leave ships simultaneously.",
      "For Rome port-day tours, the same private vehicle keeps your group together with the strongest return-to-ship confidence.",
    ],
    options: [
      { name: "Private car (1–3 guests)", description: "Saloon with meet-and-greet at FCO or terminal.", duration: "60–75 min", priceEstimate: "€120–180", bestFor: "Couples and small parties" },
      { name: "Private minivan (4–7 guests)", description: "Spacious van for families with luggage.", duration: "60–80 min", priceEstimate: "€140–220", bestFor: "Families and groups" },
      { name: "Rome to Civitavecchia port", description: "Hotel pickup to terminal on embarkation morning.", duration: "60–75 min", priceEstimate: "€110–170", bestFor: "Pre-cruise Rome stays" },
    ],
    timing: ["Book embarkation transfers for your check-in window opening", "Allow 75 min Rome centre to port in morning traffic", "Confirm terminal and ship name when booking"],
    tips: ["Request child seats in advance", "Keep driver contact on embarkation day", "Pre-book disembarkation pickup before sailing"],
    faqs: [
      { question: "FCO to Civitavecchia how long?", answer: "About 60–75 minutes by private car in normal traffic." },
      { question: "Worth it over shared shuttle?", answer: "For families with luggage and fixed embarkation times — almost always yes." },
    ],
    relatedTransferSlugs: ["shared-transfers", "fiumicino-airport-to-cruise-port", "cruise-port-transfers"],
    featured: true,
  },
  {
    slug: "shared-transfers",
    title: "Shared Transfers to Civitavecchia Cruise Port",
    seoTitle: "Shared Shuttle FCO to Civitavecchia — Budget Cruise Transfers",
    metaDescription: "Shared shuttle transfers between Fiumicino airport, Rome and Civitavecchia cruise port for budget-conscious passengers.",
    category: "Shared",
    tagline: "Lower cost, longer journey — best when you travel light with time buffer.",
    overview: "Shared shuttles pool passengers between FCO, Rome hotels and Civitavecchia — sensible for solo travellers if you allow 90–120 minutes and avoid tight same-day flight connections.",
    body: [
      "Multiple stops add time versus private transfer. Embarkation mornings are busiest — align your shuttle with check-in opening, not final boarding.",
      "Groups of three or more often find private minivan pricing competitive on per-head basis.",
      "Port-day Rome tours use excursion coaches — different from airport shared shuttles.",
    ],
    options: [
      { name: "Shared FCO to port", description: "Pooled van serving airport and cruise terminal.", duration: "90–120 min", priceEstimate: "€25–45 pp", bestFor: "Solo light packers" },
      { name: "Shared Rome hotel to port", description: "Pickup from central hotels on embarkation morning.", duration: "75–100 min", priceEstimate: "€20–35 pp", bestFor: "Budget pre-cruise stays" },
    ],
    timing: ["Allow extra time for multiple stops", "Not ideal with heavy luggage or toddlers", "Book timed slot matching check-in"],
    tips: ["Compare private price for groups", "Travel light", "Confirm pickup address night before"],
    faqs: [
      { question: "Reliable for embarkation?", answer: "Yes with adequate buffer — less reliable than private on same-day flight schedules." },
      { question: "Shared to Rome on port days?", answer: "Use shore excursions for port days — not airport shuttles." },
    ],
    relatedTransferSlugs: ["private-transfers", "fiumicino-airport-to-cruise-port", "cruise-port-transfers"],
  },
  {
    slug: "fiumicino-airport-to-cruise-port",
    title: "Fiumicino Airport to Civitavecchia Cruise Port",
    seoTitle: "FCO to Civitavecchia Cruise Port Transfer Guide",
    metaDescription: "Leonardo da Vinci airport (FCO) to Civitavecchia cruise port — private, shared and train options for embarkation day.",
    category: "Airport",
    tagline: "FCO to your ship — 60–75 minutes by road when planned properly.",
    overview: "Most Rome cruises embark at Civitavecchia, not Rome itself. FCO is 60–70 km from the port — pre-booked transfer is smoothest with luggage.",
    body: [
      "Private transfer: 60–75 minutes meet-and-greet at arrivals to terminal drop.",
      "Train: Leonardo Express to Termini, regional to Civitavecchia — 90–120 minutes plus station walks.",
      "Arrive the day before sailing whenever possible — same-day flight plus embarkation is high risk.",
    ],
    options: [
      { name: "Private car", description: "Direct FCO to cruise terminal.", duration: "60–75 min", priceEstimate: "€120–180", bestFor: "Families and groups" },
      { name: "Shared shuttle", description: "Budget pooled service.", duration: "90–120 min", priceEstimate: "€25–45 pp", bestFor: "Solo travellers" },
      { name: "Train via Termini", description: "Leonardo Express plus regional train.", duration: "90–120 min", priceEstimate: "€15–25", bestFor: "Light packers" },
    ],
    timing: ["Allow 3+ hours from landing to terminal on same-day embarkation", "Pre-cruise night strongly recommended", "Confirm terminal 24h ahead"],
    tips: ["Book transfer before flying", "Avoid unlicensed touts at FCO", "Keep cruise documents accessible"],
    faqs: [
      { question: "How far is FCO from Civitavecchia?", answer: "About 60–70 km — 60–75 minutes by road." },
      { question: "Same-day flight and cruise?", answer: "Risky — delays can cost you the ship. Arrive one night early." },
    ],
    relatedTransferSlugs: ["private-transfers", "shared-transfers", "rome-airport-transfers"],
    featured: true,
  },
  {
    slug: "rome-airport-transfers",
    title: "Rome Airport Transfers for Cruise Passengers",
    seoTitle: "Rome Airport Transfers — FCO & Ciampino to Civitavecchia",
    metaDescription: "Compare Fiumicino and Ciampino airport transfers to Civitavecchia cruise port and Rome hotels.",
    category: "Airport",
    tagline: "FCO and Ciampino — know your airport before booking transfers.",
    overview: "Fiumicino (FCO) handles most international flights; Ciampino (CIA) serves many European budget carriers. Both require planned links to Civitavecchia or Rome hotels.",
    body: [
      "FCO to Civitavecchia: 60–75 min private. CIA to Civitavecchia: 75–90 min private.",
      "FCO to Rome hotel: 45–60 min — common for pre-cruise nights before port transfer.",
      "Pre-book licensed operators with cruise-terminal experience.",
    ],
    options: [
      { name: "FCO to Civitavecchia", description: "Main embarkation route.", duration: "60–75 min", priceEstimate: "€120–180", bestFor: "International arrivals" },
      { name: "CIA to Civitavecchia", description: "Budget airline arrivals.", duration: "75–90 min", priceEstimate: "€130–190", bestFor: "European flights" },
      { name: "FCO to Rome hotel", description: "Pre-cruise city stay.", duration: "45–60 min", priceEstimate: "€50–80", bestFor: "Night-before-Rome stays" },
    ],
    timing: ["Verify airport code on booking", "CIA is smaller but farther from port", "Build buffer on embarkation morning"],
    tips: ["Fixed fares beat haggling at taxi rank", "Confirm terminal name with driver", "Request child seats early"],
    faqs: [
      { question: "Which airport is closer to the port?", answer: "FCO is slightly closer — both require road transfer." },
      { question: "Taxi from FCO?", answer: "Fixed fares exist — pre-booked private is more reliable on busy mornings." },
    ],
    relatedTransferSlugs: ["fiumicino-airport-to-cruise-port", "private-transfers", "airport-hotels"],
  },
  {
    slug: "cruise-port-transfers",
    title: "Civitavecchia Cruise Port Transfers Hub",
    seoTitle: "Civitavecchia Cruise Port Transfers — Complete Guide",
    metaDescription: "All transfer options at Civitavecchia — Rome day trips, FCO airport links and terminal pickup explained.",
    category: "Port",
    tagline: "Port, Rome and airport — every Civitavecchia transfer in one place.",
    overview: "Civitavecchia's cruise terminals connect to Rome (75–80 min), FCO (60–75 min) and town hotels (5–15 min). Know which transfer type fits your journey stage.",
    body: [
      "Port-day passengers: shore excursion coach pickup at terminal or walk to station for DIY train.",
      "Embarking passengers: FCO/CIA or Rome hotel to terminal — pre-book private for calm morning.",
      "Disembarking passengers: terminal to FCO or Rome with luggage — book before sailing.",
    ],
    options: [
      { name: "Shore excursion pickup", description: "Coach tours to Rome with return timing.", duration: "75 min to Rome", priceEstimate: "Tour price", bestFor: "Port days" },
      { name: "Private port transfer", description: "Airport or hotel to terminal.", duration: "60–75 min", priceEstimate: "€120–180", bestFor: "Embarkation" },
      { name: "Regional train", description: "Station 10–15 min walk from terminal.", duration: "80 min to Rome", priceEstimate: "€5–15", bestFor: "DIY port days" },
    ],
    timing: ["Terminal pickup 15 min after disembarkation for tours", "Embarkation: arrive at check-in opening", "Disembarkation: pre-book pickup time"],
    tips: ["Confirm pier-to-terminal shuttle if applicable", "Have all-aboard time on phone for port days", "Terminal name on booking"],
    faqs: [
      { question: "Where do tours pick up?", answer: "At terminal exit or coach park — voucher confirms exact gate." },
      { question: "Train station distance?", answer: "Civitavecchia station is 10–15 minutes walk from most terminals." },
    ],
    relatedTransferSlugs: ["private-transfers", "shared-transfers", "fiumicino-airport-to-cruise-port"],
    featured: true,
  },
  {
    slug: "port-to-airport-transfers",
    title: "Civitavecchia Cruise Port to Fiumicino Airport",
    seoTitle: "Civitavecchia to FCO Airport — Disembarkation Transfers",
    metaDescription: "Transfer from Civitavecchia cruise port to Fiumicino airport after disembarkation — timing and booking tips.",
    category: "Disembarkation",
    tagline: "Ship to plane — the smoothest route after disembarkation.",
    overview: "After disembarkation, pre-booked transfer to FCO avoids taxi queues. Allow 60–75 minutes drive plus 3-hour airport buffer for international flights.",
    body: [
      "Sunday mornings are busiest — thousands disembark simultaneously.",
      "If your flight is evening, store luggage and enjoy Rome before afternoon transfer.",
      "Private transfer pickup at terminal exit at agreed time — have phone contact ready.",
    ],
    options: [
      { name: "Private car to FCO", description: "Direct terminal to airport.", duration: "60–75 min", priceEstimate: "€120–180", bestFor: "Most passengers" },
      { name: "Shared shuttle to FCO", description: "Budget option with stops.", duration: "90–120 min", priceEstimate: "€25–45 pp", bestFor: "Solo travellers" },
    ],
    timing: ["Leave Rome or port 3+ hours before international flight", "Morning disembarkation + afternoon flight = Rome day possible", "Pre-book before cruise ends"],
    tips: ["Do not underestimate airport security queues", "Store bags for spare Rome hours", "Confirm pickup point night before"],
    faqs: [
      { question: "How early leave port for FCO?", answer: "Roughly 3 hours before flight plus 60–75 min drive — adjust for traffic." },
      { question: "Late afternoon flight?", answer: "Store luggage, tour Rome, transfer mid-afternoon — popular pattern." },
    ],
    relatedTransferSlugs: ["private-transfers", "fiumicino-airport-to-cruise-port", "late-flight-after-disembarkation"],
  },
  {
    slug: "late-flight-after-disembarkation",
    title: "Late Flight After Civitavecchia Disembarkation",
    seoTitle: "Late Flight After Rome Cruise — Transfer & Planning",
    metaDescription: "Your flight leaves hours after disembarkation — Rome time, luggage storage and FCO transfer planning.",
    category: "Disembarkation",
    tagline: "Six spare hours? Turn disembarkation into a bonus Rome afternoon.",
    overview: "Disembarking at 08:00 with a 20:00 flight enables a full Rome day if you store luggage and pre-book an afternoon FCO transfer.",
    body: [
      "Drop bags at storage, transfer to centro, explore Pantheon/Trevi area, collect bags, reach FCO by 17:00 for 20:00 flight.",
      "Avoid ambitious Vatican or Colosseum queues — centro walking or golf cart tours fit better.",
      "Day rooms available if you want shower and rest mid-day.",
    ],
    options: [
      { name: "Luggage storage + Rome time", description: "Hands-free centro exploration.", duration: "4–5 hours in Rome", priceEstimate: "Storage €5–15", bestFor: "Evening flights" },
      { name: "Pre-booked FCO transfer", description: "Afternoon pickup from Rome or port.", duration: "60–75 min", priceEstimate: "€120–180", bestFor: "Stress-free airport reach" },
    ],
    timing: ["3-hour airport buffer minimum", "Leave Rome centro 3 hours before flight", "Book storage near Termini or port"],
    tips: ["Pre-book everything before cruise ends", "Golf cart tour for efficient sightseeing", "Keep passport in day bag"],
    faqs: [
      { question: "Enough time for Rome?", answer: "4–5 hours sightseeing realistic with evening flight — enough for centro highlights." },
      { question: "Ship luggage storage?", answer: "You disembark fully — use port or Rome storage services." },
    ],
    relatedTransferSlugs: ["port-to-airport-transfers", "private-transfers", "day-rooms"],
  },
];

export function getTransferBySlug(slug: string) {
  return transfers.find((t) => t.slug === slug);
}

export function getAllTransferSlugs() {
  return transfers.map((t) => t.slug);
}

export function getFeaturedTransfers() {
  return transfers.filter((t) => t.featured);
}
`);

console.log("Part 4 excursions and transfers done");
