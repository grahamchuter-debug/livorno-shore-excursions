#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DATA = join(dirname(fileURLToPath(import.meta.url)), "..", "src/data");
const SCHED = join(DATA, "imported-schedules");
function w(n, c) { writeFileSync(join(DATA, n), c, "utf8"); console.log("wrote", n); }

w("hotels.ts", `import type { HotelPage } from "./types";

export const hotels: HotelPage[] = [
  {
    slug: "cruise-port-hotels",
    title: "Hotels Near Civitavecchia Cruise Port",
    seoTitle: "Hotels Near Civitavecchia Cruise Port — Embarkation Guide",
    metaDescription: "Hotels near Civitavecchia cruise port for calm embarkation — port town stays versus Rome overnight compared.",
    category: "Location",
    tagline: "Sleep near the ship or in Rome — embarkation morning made simple.",
    overview: "Civitavecchia town hotels offer 5–15 minute terminal transfers. Rome centre hotels reward you with Trevi and Trastevere the night before a 60–75 minute morning port transfer.",
    body: [
      "Port-adjacent hotels suit early sailings and passengers who want minimal embarkation stress. Rome hotels suit those arriving a day early for sightseeing.",
      "Peak Mediterranean season fills both — book when you confirm your cruise.",
      "Many properties store luggage if rooms are not ready on arrival from FCO.",
    ],
    areas: [
      { name: "Civitavecchia harbour", description: "Closest to terminals — quiet port town evening.", bestFor: "Shortest embarkation transfer" },
      { name: "Rome Centro Storico", description: "Pantheon, Trevi and Trastevere walkable.", bestFor: "Pre-cruise sightseeing" },
      { name: "Rome Prati", description: "Near Vatican — good for Vatican-focused pre-cruise day.", bestFor: "Vatican priority" },
    ],
    picks: [
      { name: "Harbour hotel Civitavecchia", description: "Walk or short taxi to terminal.", distance: "5–15 min to terminal" },
      { name: "Centro Storico boutique", description: "Icon Rome evening before sailing.", distance: "60–75 min to port" },
      { name: "Prati Vatican-area stay", description: "Vatican day before embarkation.", distance: "65–80 min to port" },
    ],
    tips: ["Confirm terminal transfer night before", "Book early for April–October", "Ask about early check-in"],
    faqs: [
      { question: "Civitavecchia or Rome night before?", answer: "Civitavecchia for easiest embarkation; Rome for sightseeing with morning transfer." },
      { question: "How early reach terminal?", answer: "Start of your cruise line check-in window — often late morning." },
    ],
    relatedHotelSlugs: ["best-hotels-before-cruise", "one-night-before-cruise", "family-hotels"],
    featured: true,
  },
  {
    slug: "best-hotels-before-cruise",
    title: "Best Hotels Before Your Civitavecchia Cruise",
    seoTitle: "Best Pre-Cruise Hotels — Rome & Civitavecchia",
    metaDescription: "Best hotels before a Civitavecchia cruise — Rome centre, port town and strategy for smooth embarkation.",
    category: "Planning",
    tagline: "One night in the right place removes most embarkation-day stress.",
    overview: "Pre-cruise hotel strategy balances sightseeing appetite with embarkation logistics. Rome centre maximises culture; Civitavecchia maximises sleep.",
    body: [
      "Classic pattern: FCO to Rome hotel, evening Trastevere dinner, morning private transfer to port.",
      "Avoid same-day flight plus embarkation — Mediterranean delays happen.",
      "Two nights in Rome unlock Colosseum day one and Vatican day two before sailing.",
    ],
    areas: [
      { name: "Rome historic centre", description: "Maximum sightseeing.", bestFor: "First-time visitors" },
      { name: "Civitavecchia port", description: "Maximum embarkation ease.", bestFor: "Late arrivals" },
      { name: "FCO airport", description: "Late flight logistics only.", bestFor: "Very late arrivals" },
    ],
    picks: [
      { name: "Centro Storico base", description: "Walk to Pantheon and Trevi.", distance: "60–75 min to port" },
      { name: "Port town hotel", description: "Short embarkation morning.", distance: "5–15 min to terminal" },
    ],
    tips: ["Book refundable flights if uncertain", "Pre-book port transfer", "Confirm terminal name"],
    faqs: [
      { question: "Minimum nights before cruise?", answer: "One night strongly recommended; two for unhurried Rome." },
      { question: "Best Rome area?", answer: "Centro Storico or Prati for walkable icons." },
    ],
    relatedHotelSlugs: ["one-night-before-cruise", "two-days-before-cruise", "cruise-port-hotels"],
    featured: true,
  },
  {
    slug: "best-hotels-after-cruise",
    title: "Best Hotels After Your Civitavecchia Cruise",
    seoTitle: "Post-Cruise Hotels — Rome Extensions & FCO",
    metaDescription: "Where to stay after disembarking at Civitavecchia — Rome extensions, airport hotels and late-flight strategies.",
    category: "Planning",
    tagline: "Disembarked — extend Rome or head toward your flight smartly.",
    overview: "After disembarkation, choose Rome centre for evening flights, day rooms for freshen-up, or FCO hotels for early next-day departures.",
    body: [
      "Rome centre plus luggage storage transforms six spare hours into a real afternoon.",
      "FCO airport hotels suit 06:00 flights — avoid crossing Rome at rush hour.",
      "Pre-book disembarkation transfer before you sail.",
    ],
    areas: [
      { name: "Rome centro", description: "Bonus sightseeing day.", bestFor: "Evening flights" },
      { name: "FCO airport", description: "Early next-day flight.", bestFor: "Morning departures" },
      { name: "Civitavecchia town", description: "Late disembarkation stopover.", bestFor: "Next-day local transfer" },
    ],
    picks: [
      { name: "Centro day room or hotel", description: "Explore before evening FCO transfer.", distance: "60–75 min to FCO" },
      { name: "Airport hotel FCO", description: "Short hop to terminals.", distance: "5 min to FCO" },
    ],
    tips: ["Store luggage for Rome time", "Keep 3-hour airport buffer", "Book day room ahead on Sundays"],
    faqs: [
      { question: "Rome after disembarkation?", answer: "Yes with 6+ spare hours — store bags and transfer to centro." },
      { question: "One night after cruise?", answer: "Rome centre if sightseeing; FCO if flying early next morning." },
    ],
    relatedHotelSlugs: ["day-rooms", "airport-hotels", "best-hotels-before-cruise"],
  },
  {
    slug: "family-hotels",
    title: "Family Hotels Before a Civitavecchia Cruise",
    seoTitle: "Family Hotels — Rome & Civitavecchia Pre-Cruise",
    metaDescription: "Family-friendly hotels before Civitavecchia cruise — apartments, pools and private transfers with children.",
    category: "Family",
    tagline: "Space, cots and calm transfers — Rome with kids before you sail.",
    overview: "Families benefit from Rome apartments or family rooms near Prati, private minivan transfers and port hotels for short embarkation mornings with toddlers.",
    body: [
      "Apartments offer kitchens and washing — useful before a cabin.",
      "Private FCO pickup with car seats beats train with jet-lagged children.",
      "Colosseum and gelato tours work pre-cruise; skip packed Vatican with toddlers.",
    ],
    areas: [
      { name: "Trastevere apartments", description: "Space and character.", bestFor: "Families with teens" },
      { name: "Prati family hotels", description: "Near Vatican, quieter streets.", bestFor: "Mixed-age groups" },
      { name: "Civitavecchia port", description: "Short embarkation.", bestFor: "Young children, early sail" },
    ],
    picks: [
      { name: "Two-bedroom apartment", description: "Kitchen and living space.", distance: "60–75 min to port" },
      { name: "Port hotel with family room", description: "Minimal embarkation morning.", distance: "10 min to terminal" },
    ],
    tips: ["Request cots at booking", "Pre-book minivan transfers", "Pack embarkation day snacks"],
    faqs: [
      { question: "Rome or port with kids?", answer: "Rome for gentle sightseeing day; port for easiest embarkation." },
      { question: "Apartments available?", answer: "Yes in Trastevere and Prati — book early for peak season." },
    ],
    relatedHotelSlugs: ["best-hotels-before-cruise", "cruise-port-hotels", "private-transfers"],
  },
  {
    slug: "luxury-hotels",
    title: "Luxury Hotels Before a Civitavecchia Cruise",
    seoTitle: "Luxury Pre-Cruise Hotels in Rome",
    metaDescription: "Five-star Rome hotels before Civitavecchia cruise — concierge transfers and premium pre-sail stays.",
    category: "Luxury",
    tagline: "Start in style — Rome's finest before you reach Civitavecchia.",
    overview: "Luxury pre-cruise stays centre on Via Veneto, Spanish Steps and Villa Borghese five-stars with concierge FCO pickup and morning port transfers.",
    body: [
      "Concierges arrange skip-the-line Vatican or private Colosseum before embarkation day.",
      "Pair with luxury Rome shore excursion for consistent premium service.",
      "Spa recovery after transatlantic flights is underrated.",
    ],
    areas: [
      { name: "Via Veneto", description: "Classic five-star corridor.", bestFor: "Honeymoons" },
      { name: "Spanish Steps", description: "Designer shopping access.", bestFor: "Couples" },
      { name: "Villa Borghese", description: "Quiet luxury near parks.", bestFor: "Relaxed elegance" },
    ],
    picks: [
      { name: "Five-star Via Veneto", description: "Butler service and rooftop dining.", distance: "65–80 min to port" },
      { name: "Boutique near Pantheon", description: "Intimate luxury centro.", distance: "60–75 min to port" },
    ],
    tips: ["Book restaurants via concierge", "Arrange port transfer night before", "Confirm late checkout if needed"],
    faqs: [
      { question: "Concierge port transfer?", answer: "Arranged at fixed quotes — confirm Civitavecchia terminal details." },
      { question: "Two luxury nights?", answer: "Ideal — day one ancient Rome, day two Vatican without port-day pressure." },
    ],
    relatedHotelSlugs: ["luxury-rome", "two-days-before-cruise", "private-transfers"],
    featured: true,
  },
  {
    slug: "airport-hotels",
    title: "Airport Hotels for Civitavecchia Cruises",
    seoTitle: "FCO Airport Hotels — Civitavecchia Cruise Embarkation",
    metaDescription: "Fiumicino airport hotels before Civitavecchia cruise — when they make sense versus Rome centre.",
    category: "Airport",
    tagline: "Late arrival solution — not a substitute for Rome sightseeing.",
    overview: "FCO airport hotels suit late-night landings and dawn port transfers without entering Rome traffic. Sacrifice sightseeing for logistics.",
    body: [
      "Pattern: land 22:00, sleep airside, 08:00 private transfer to Civitavecchia for afternoon sailing.",
      "If landing before 18:00, choose Rome centre or Civitavecchia instead.",
      "Morning port transfer 60–75 minutes — pre-book private.",
    ],
    areas: [
      { name: "FCO terminal hotels", description: "Walk to check-in next morning.", bestFor: "Early flights home" },
      { name: "FCO nearby hotels", description: "Shuttle to terminals.", bestFor: "Late arrivals" },
    ],
    picks: [
      { name: "Airport terminal hotel", description: "Minimal morning logistics.", distance: "60–75 min to port" },
    ],
    tips: ["Only if no Rome time available", "Pre-book port transfer", "Confirm shuttle hours"],
    faqs: [
      { question: "When use airport hotel?", answer: "Late arrivals or very early next-day flight — not for sightseeing." },
      { question: "Port transfer time?", answer: "About 60–75 minutes by private car." },
    ],
    relatedHotelSlugs: ["fiumicino-airport-to-cruise-port", "one-night-before-cruise", "best-hotels-before-cruise"],
  },
  {
    slug: "one-night-before-cruise",
    title: "One Night Before Your Civitavecchia Cruise",
    seoTitle: "One Night Before Civitavecchia Cruise — Hotel Guide",
    metaDescription: "Why one pre-cruise night near Rome or Civitavecchia matters — hotel picks and transfer planning.",
    category: "Planning",
    tagline: "The best insurance against missing your ship.",
    overview: "One night early eliminates same-day flight risk and gives you a Rome evening or calm Civitavecchia embarkation morning.",
    body: [
      "Fly FCO, transfer to hotel, enjoy Rome dinner or early sleep in port town.",
      "Morning private transfer to terminal at check-in opening.",
      "Hotel cost is trivial versus rebooking a missed cruise.",
    ],
    areas: [
      { name: "Rome centro", description: "Bonus sightseeing evening.", bestFor: "First-time visitors" },
      { name: "Civitavecchia", description: "Shortest embarkation.", bestFor: "Practical travellers" },
    ],
    picks: [
      { name: "Centro hotel", description: "Trevi walk after check-in.", distance: "60–75 min to port AM" },
      { name: "Port hotel", description: "10-minute terminal taxi.", distance: "5–15 min to terminal" },
    ],
    tips: ["Book refundable flights when possible", "Pre-book AM port transfer", "Confirm terminal 24h ahead"],
    faqs: [
      { question: "Rome or Civitavecchia?", answer: "Rome for experience; Civitavecchia for proximity." },
      { question: "When leave hotel?", answer: "Start of cruise line check-in window." },
    ],
    relatedHotelSlugs: ["two-days-before-cruise", "best-hotels-before-cruise", "cruise-port-hotels"],
    featured: true,
  },
  {
    slug: "where-to-stay-neighbourhoods",
    title: "Where to Stay in Rome Before Your Cruise",
    seoTitle: "Rome Neighbourhoods Before Civitavecchia Cruise",
    metaDescription: "Compare Rome neighbourhoods for pre-cruise stays — Centro, Trastevere, Prati and Vatican area.",
    category: "Location",
    tagline: "Match your neighbourhood to your pre-cruise priorities.",
    overview: "Centro Storico for icons, Trastevere for atmosphere, Prati for Vatican — all 60–75 minutes from Civitavecchia on embarkation morning.",
    body: [
      "Centro puts Pantheon and Trevi on your doorstep. Trastevere offers evening dining character. Prati suits Vatican-first pre-cruise days.",
      "Avoid staying far from centre unless purely airport logistics.",
      "Private morning transfer beats taxi hail on embarkation day.",
    ],
    areas: [
      { name: "Centro Storico", description: "Pantheon, Trevi, Navona.", bestFor: "First-timers" },
      { name: "Trastevere", description: "Village feel, trattorias.", bestFor: "Food lovers" },
      { name: "Prati", description: "Vatican proximity.", bestFor: "Vatican pre-cruise day" },
    ],
    picks: [
      { name: "Pantheon-area hotel", description: "Central icon access.", distance: "60–75 min to port" },
      { name: "Trastevere apartment", description: "Evening atmosphere.", distance: "65–80 min to port" },
    ],
    tips: ["Book centro early for peak season", "Check lift access with luggage", "Pre-book port transfer"],
    faqs: [
      { question: "Best area for first-timers?", answer: "Centro Storico — walkable icons and easy orientation." },
      { question: "Trastevere for families?", answer: "Yes — apartments and restaurants suit mixed-age groups." },
    ],
    relatedHotelSlugs: ["best-hotels-before-cruise", "cruise-port-hotels", "family-hotels"],
  },
];

export function getHotelBySlug(slug: string) {
  return hotels.find((h) => h.slug === slug);
}

export function getAllHotelSlugs() {
  return hotels.map((h) => h.slug);
}

export function getFeaturedHotels() {
  return hotels.filter((h) => h.featured);
}
`);

w("homepage.ts", `import type { FAQ, VisitorType, ExperienceCard } from "./types";

export const visitorTypes: VisitorType[] = [
  {
    id: "port-day",
    label: "I'm visiting Rome for the day on a cruise",
    shortLabel: "Port day",
    description: "You're calling at Civitavecchia for the day. Find shore excursions, Rome highlights and a realistic port-day plan.",
    href: "/shore-excursions",
    cta: "Plan my port day",
  },
  {
    id: "embarking",
    label: "I'm starting my cruise in Civitavecchia",
    shortLabel: "Starting a cruise",
    description: "You're embarking at Rome's cruise port. Sort FCO transfer, a pre-cruise hotel and a smooth route to the terminal.",
    href: "/cruise-transfers",
    cta: "Plan my embarkation",
  },
  {
    id: "disembarking",
    label: "I'm finishing my cruise in Civitavecchia",
    shortLabel: "Finishing a cruise",
    description: "You're disembarking here. Handle luggage, a late FCO flight and getting to the airport — and enjoy spare hours in Rome.",
    href: "/cruise-transfers/port-to-airport-transfers",
    cta: "Plan my disembarkation",
  },
  {
    id: "staying",
    label: "I'm staying in Rome before or after my cruise",
    shortLabel: "Staying over",
    description: "You've got extra nights in Rome or Civitavecchia. Pick the right hotel and things to see before or after you sail.",
    href: "/hotels",
    cta: "Plan my stay",
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
    slug: "first-time",
    title: "First Time in Rome",
    description: "One Civitavecchia port day — Colosseum or Vatican, Trevi, Pantheon and return timing explained.",
    href: "/experiences/rome-in-one-day",
    cta: "Plan first visit",
    imageKey: "city-highlights",
  },
  {
    slug: "vatican",
    title: "Vatican & Christian Rome",
    description: "Museums, Sistine Chapel and St Peter's — skip-the-line strategy from the cruise port.",
    href: "/vatican/vatican-in-one-day",
    cta: "Explore Vatican",
    imageKey: "vatican",
  },
  {
    slug: "food-wine",
    title: "Food & Wine",
    description: "Trastevere tastings, markets and frascati — Rome on a plate when icons can wait.",
    href: "/experiences/food-tours",
    cta: "Taste Rome",
    imageKey: "food",
  },
  {
    slug: "independent",
    title: "Independent Explorer",
    description: "Train DIY, ticket planning and when independent beats a guided excursion.",
    href: "/shore-excursions/train-diy-guide",
    cta: "Go independent",
    imageKey: "train",
  },
  {
    slug: "transfers-hotels",
    title: "Transfers & Hotels",
    description: "FCO to Civitavecchia, pre-cruise Rome stays and disembarkation logistics.",
    href: "/plan-your-cruise-holiday/civitavecchia-to-rome",
    cta: "Plan logistics",
    imageKey: "transfers",
  },
];

export const coreSections: HomeSection[] = [
  { slug: "shore-excursions", number: "01", title: "Shore Excursions", description: "Colosseum, Vatican, ancient Rome and highlights — cruise-timed from Civitavecchia.", href: "/shore-excursions", cta: "Browse excursions" },
  { slug: "rome-highlights", number: "02", title: "Rome Highlights", description: "Colosseum, Trevi, Pantheon and more — getting there from the cruise port.", href: "/rome-highlights/colosseum-from-cruise-port", cta: "See highlights" },
  { slug: "vatican", number: "03", title: "Vatican Guides", description: "Museums, Sistine Chapel and St Peter's — skip-the-line for port days.", href: "/vatican/vatican-museums", cta: "Vatican guides" },
  { slug: "cruise-planning", number: "04", title: "Cruise Planning", description: "Civitavecchia transfers, FCO links, hotels and embarkation timing.", href: "/plan-your-cruise-holiday/civitavecchia-to-rome", cta: "Plan cruise" },
  { slug: "experiences", number: "05", title: "Experiences", description: "Food, wine, hidden Rome, family days and luxury private tours.", href: "/experiences/rome-in-one-day", cta: "Explore experiences" },
  { slug: "compare", number: "06", title: "Compare", description: "Vatican vs Colosseum, DIY vs guided, train vs private — honest comparisons.", href: "/compare/vatican-vs-colosseum", cta: "Compare options" },
  { slug: "cruise-transfers", number: "07", title: "Cruise Transfers", description: "Private, shared and airport options between FCO, Rome and Civitavecchia.", href: "/cruise-transfers", cta: "Plan transfers" },
  { slug: "hotels", number: "08", title: "Hotels Before Your Cruise", description: "Rome centre or Civitavecchia port — where to stay before you sail.", href: "/hotels", cta: "Find hotels" },
  { slug: "cruise-port-guide", number: "09", title: "Civitavecchia Port Guide", description: "Terminals, train station walk and getting to Rome on arrival.", href: "/cruise-port-guide", cta: "Read port guide" },
  { slug: "cruise-planner", number: "10", title: "Rome Cruise Planner", description: "Answer a few questions — get a tailored Civitavecchia plan.", href: "/cruise-planner", cta: "Start planning" },
];

export function getHomepageFaqs(): FAQ[] {
  return [
    {
      question: "How do I get from Civitavecchia cruise port to Rome?",
      answer: "Regional train (~80 minutes to Roma Termini plus metro), private transfer (~75 minutes door-to-door), or a shore excursion with tickets and return timing included. See our Civitavecchia to Rome guide.",
    },
    {
      question: "Can I see the Colosseum and Vatican on one port day?",
      answer: "Both interiors are unrealistic on standard 9–10 hour calls. Choose one anchor sight — our comparison guide explains the trade-offs.",
    },
    {
      question: "Should I arrive in Rome the day before my cruise?",
      answer: "Yes whenever possible. FCO to Civitavecchia is 60–75 minutes — a pre-cruise night removes same-day flight risk and gives you Rome time.",
    },
    {
      question: "Which airport serves Civitavecchia cruises?",
      answer: "Fiumicino (FCO) is the main international airport, 60–75 minutes from the port. Ciampino (CIA) also works for European flights.",
    },
    {
      question: "Is Civitavecchia the same as Rome?",
      answer: "No — Civitavecchia is Rome's cruise port, 70 km from the Colosseum. Plan 75–80 minutes each way for Rome sightseeing.",
    },
  ];
}
`);

w("port-guide.ts", `import type { FAQ } from "./types";

export interface Terminal {
  name: string;
  quay: string;
  usedBy: string;
  cityAccess: string;
}

export const terminals: Terminal[] = [
  { name: "Terminal 25 / Bramante", quay: "Main cruise quay", usedBy: "Most large ships — MSC, Costa, Royal Caribbean, NCL, Celebrity, Princess and others", cityAccess: "Walk 10–15 min to Civitavecchia station for Rome trains, or meet excursion coaches at terminal exit" },
  { name: "Terminal 12 / Amerigo Vespucci", quay: "Secondary berths", usedBy: "Additional ships on busy days and some lines", cityAccess: "Shuttle or walk to station area; taxis at terminal rank" },
  { name: "Terminal 11", quay: "Occasional berths", usedBy: "Smaller or overflow ships", cityAccess: "Taxi or port shuttle to main terminal area recommended" },
];

export interface PortGuideSection {
  heading: string;
  paragraphs: string[];
}

export const portGuideSections: PortGuideSection[] = [
  {
    heading: "Where cruise ships dock at Civitavecchia",
    paragraphs: [
      "Civitavecchia — often marketed as 'Rome' on cruise itineraries — is Italy's principal cruise port, handling turnaround and port-of-call ships for the Eternal City. Modern terminals sit along the harbour with the town and train station nearby.",
      "Your berth determines walk time to Civitavecchia station and the excursion coach pickup point. Check pier assignment on your cruise app — busy days use multiple terminals.",
    ],
  },
  {
    heading: "Getting from the port to Rome",
    paragraphs: [
      "Rome's historic centre is about 70 km inland. Regional trains from Civitavecchia station to Roma Termini take roughly 50–60 minutes plus 10–15 minutes walk from terminal to station. Total DIY time often exceeds 80 minutes each way.",
      "Private transfers and shore excursions pick up at the terminal and reach the Colosseum or Vatican in about 75 minutes — the option most first-time passengers choose for return-to-ship confidence.",
      "Do not expect to walk to Rome from the port — you need train, transfer or organised tour.",
    ],
  },
  {
    heading: "Facilities and practicalities",
    paragraphs: [
      "Terminals offer toilets, seating, limited shops and taxi ranks. Wi-Fi is unreliable — download tickets and maps on the ship.",
      "Currency is the euro. Italian is the local language; English is common in tourist Rome. Watch belongings in crowded Rome piazzas.",
      "Civitavecchia town has cafés and basic services near the harbour if you stay local instead of going to Rome.",
    ],
  },
  {
    heading: "Return-to-ship timing",
    paragraphs: [
      "Confirm all-aboard time — usually 30–60 minutes before departure. Allow 75–80 minutes from central Rome plus a 60–90 minute buffer for A12 motorway traffic.",
      "Morning timed entries (Colosseum or Vatican) protect afternoon returns. Ship excursions carry delay guarantees; independent tours require you to respect meeting times.",
    ],
  },
];

export const portGuideFaqs: FAQ[] = [
  { question: "How far is Civitavecchia from Rome?", answer: "About 70 km — 75 minutes by road or roughly 80 minutes by train to Roma Termini plus connections to sights." },
  { question: "Can I walk to the train station from the cruise terminal?", answer: "Yes — Civitavecchia station is roughly 10–15 minutes walk from most terminals." },
  { question: "Is there a shuttle from the port to Rome?", answer: "No public shuttle — use regional train, private transfer or a shore excursion coach." },
  { question: "How much time do I need to get back to my ship from Rome?", answer: "Allow 75–80 minutes transfer plus 60–90 minute buffer before all-aboard — earlier on heavy traffic days." },
];
`);

w("schedules.ts", `import type { ScheduleEntry, ShipSchedulePort } from "./types";
import {
  filterEntriesByMonth,
  filterEntriesByYear,
  getMonthsWithEntries,
  type ScheduleYear,
} from "@/lib/schedule-utils";
import civitavecchiaSchedule from "./imported-schedules/civitavecchia.json";

const SCHEDULE_FAQS = [
  {
    question: "How accurate are Civitavecchia cruise ship schedules?",
    answer: "Schedules are compiled from published timetables and updated periodically. Times and berths can change — confirm with your cruise line before booking excursions or transfers.",
  },
  {
    question: "Why does my itinerary say Rome but dock at Civitavecchia?",
    answer: "Cruise lines market the destination as Rome while ships dock at Civitavecchia port, 70 km from the Colosseum. All our Rome planning assumes this transfer.",
  },
  {
    question: "Can I visit Rome on a short port call?",
    answer: "Calls under 8 usable hours are tight — choose one focused excursion or stay local. Standard 9–11 hour calls suit Colosseum or Vatican with proper tickets.",
  },
];

const SCHEDULE_TIPS = [
  "Check how many ships share your port day before booking skip-the-line tickets",
  "Book morning timed entry for Colosseum or Vatican on multi-ship days",
  "Allow 75–80 minutes return from Rome plus 60–90 minute buffer",
  "Confirm your terminal pier on the cruise app the night before",
];

export const schedulePorts: ShipSchedulePort[] = [
  {
    slug: "civitavecchia",
    name: "Civitavecchia (Rome)",
    country: "Italy",
    seoTitle: "Civitavecchia Cruise Ship Schedule 2026 & 2027",
    metaDescription: "Civitavecchia cruise ship schedule — see which ships call at Rome's cruise port and plan Colosseum and Vatican excursions around published times.",
    intro: "Civitavecchia is the Mediterranean's gateway to Rome for cruise ships. Check scheduled arrivals and departures before booking Rome shore excursions or FCO transfers.",
    description: "Rome's cruise port — turnaround home port and Western Mediterranean port of call.",
    scheduleOverview: "Year-round cruise activity with peak traffic April through October for Rome turnaround and port-of-call visits.",
    planningTips: SCHEDULE_TIPS,
    faqs: SCHEDULE_FAQS,
  },
];

const scheduleData: Record<string, ScheduleEntry[]> = {
  civitavecchia: civitavecchiaSchedule as ScheduleEntry[],
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
`);

writeFileSync(join(SCHED, "civitavecchia.json"), JSON.stringify([
  { date: "2026-04-05", ship: "MSC Splendida", cruiseLine: "MSC Cruises", arrival: "07:00", departure: "18:00", timeInPort: "11h", terminal: "Terminal 25", callType: "Port of call" },
  { date: "2026-04-12", ship: "Costa Diadema", cruiseLine: "Costa Cruises", arrival: "08:00", departure: "19:00", timeInPort: "11h", terminal: "Terminal 25", callType: "Turnaround" },
  { date: "2026-04-19", ship: "Wonder of the Seas", cruiseLine: "Royal Caribbean", arrival: "06:30", departure: "17:00", timeInPort: "10h 30m", terminal: "Terminal 25", callType: "Turnaround" },
  { date: "2026-04-26", ship: "Norwegian Epic", cruiseLine: "Norwegian Cruise Line", arrival: "07:00", departure: "16:00", timeInPort: "9h", terminal: "Terminal 12", callType: "Port of call" },
  { date: "2026-05-03", ship: "Celebrity Edge", cruiseLine: "Celebrity Cruises", arrival: "07:00", departure: "18:00", timeInPort: "11h", terminal: "Terminal 25", callType: "Turnaround" },
  { date: "2026-05-10", ship: "MSC Grandiosa", cruiseLine: "MSC Cruises", arrival: "08:00", departure: "19:00", timeInPort: "11h", terminal: "Terminal 25", callType: "Turnaround" },
  { date: "2026-05-17", ship: "Enchanted Princess", cruiseLine: "Princess Cruises", arrival: "07:00", departure: "17:00", timeInPort: "10h", terminal: "Terminal 12", callType: "Port of call" },
  { date: "2026-05-24", ship: "Costa Smeralda", cruiseLine: "Costa Cruises", arrival: "08:00", departure: "20:00", timeInPort: "12h", terminal: "Terminal 25", callType: "Turnaround" },
  { date: "2026-06-07", ship: "Oasis of the Seas", cruiseLine: "Royal Caribbean", arrival: "06:30", departure: "17:30", timeInPort: "11h", terminal: "Terminal 25", callType: "Turnaround" },
  { date: "2026-06-14", ship: "Norwegian Prima", cruiseLine: "Norwegian Cruise Line", arrival: "07:00", departure: "16:00", timeInPort: "9h", terminal: "Terminal 12", callType: "Port of call" },
  { date: "2026-06-21", ship: "MSC World Europa", cruiseLine: "MSC Cruises", arrival: "07:00", departure: "18:00", timeInPort: "11h", terminal: "Terminal 25", callType: "Turnaround" },
  { date: "2026-07-05", ship: "Celebrity Beyond", cruiseLine: "Celebrity Cruises", arrival: "07:00", departure: "18:00", timeInPort: "11h", terminal: "Terminal 25", callType: "Turnaround" },
  { date: "2026-07-19", ship: "Sky Princess", cruiseLine: "Princess Cruises", arrival: "07:00", departure: "17:00", timeInPort: "10h", terminal: "Terminal 12", callType: "Port of call" },
  { date: "2026-08-02", ship: "Wonder of the Seas", cruiseLine: "Royal Caribbean", arrival: "06:30", departure: "17:00", timeInPort: "10h 30m", terminal: "Terminal 25", callType: "Turnaround" },
  { date: "2026-08-16", ship: "Costa Toscana", cruiseLine: "Costa Cruises", arrival: "08:00", departure: "19:00", timeInPort: "11h", terminal: "Terminal 25", callType: "Turnaround" },
  { date: "2026-09-06", ship: "Norwegian Epic", cruiseLine: "Norwegian Cruise Line", arrival: "07:00", departure: "16:00", timeInPort: "9h", terminal: "Terminal 12", callType: "Port of call" },
  { date: "2026-09-20", ship: "Celebrity Apex", cruiseLine: "Celebrity Cruises", arrival: "07:00", departure: "18:00", timeInPort: "11h", terminal: "Terminal 25", callType: "Turnaround" },
  { date: "2026-10-04", ship: "Enchanted Princess", cruiseLine: "Princess Cruises", arrival: "07:00", departure: "17:00", timeInPort: "10h", terminal: "Terminal 12", callType: "Port of call" },
  { date: "2026-10-18", ship: "MSC Grandiosa", cruiseLine: "MSC Cruises", arrival: "08:00", departure: "19:00", timeInPort: "11h", terminal: "Terminal 25", callType: "Turnaround" },
  { date: "2026-11-08", ship: "Costa Diadema", cruiseLine: "Costa Cruises", arrival: "07:00", departure: "18:00", timeInPort: "11h", terminal: "Terminal 25", callType: "Turnaround" },
], null, 2));

w("faqs.ts", `import type { FAQ } from "./types";
import { getHomepageFaqs } from "./homepage";

export const extraFaqs: FAQ[] = [
  {
    question: "How far is Civitavecchia cruise port from Rome?",
    answer: "About 70 km — roughly 75 minutes by private transfer or 80 minutes by regional train to Roma Termini, plus onward travel to sights.",
  },
  {
    question: "Do I need timed tickets for the Colosseum and Vatican?",
    answer: "Yes — both use timed entry that sells out on cruise days. Book before your cruise or take an excursion with included tickets.",
  },
  {
    question: "Is the train from Civitavecchia to Rome safe for cruise passengers?",
    answer: "Generally yes for experienced travellers — allow extra return margin. First-timers usually prefer door-to-door excursions for return-to-ship confidence.",
  },
  {
    question: "Which Rome sights fit one port day?",
    answer: "One major interior (Colosseum OR Vatican) plus centro exteriors like Trevi and Pantheon on a 9–10 hour call. See our Rome in One Day guide.",
  },
  {
    question: "Should I book excursions through my cruise line?",
    answer: "Ship tours guarantee the vessel waits if their tour is late. Reputable independent operators track all-aboard with buffers — often smaller groups and lower prices.",
  },
  {
    question: "Where should I stay the night before a Civitavecchia cruise?",
    answer: "Rome centre for sightseeing with morning port transfer, or Civitavecchia town for the shortest embarkation — see our hotel guides.",
  },
  {
    question: "How early should I return to Civitavecchia from Rome?",
    answer: "Allow 75–80 minutes from central Rome plus 60–90 minutes before all-aboard for traffic on the A12.",
  },
  {
    question: "Can I store luggage after disembarking for a late FCO flight?",
    answer: "Yes — Rome Termini lockers and Civitavecchia storage options let you explore hands-free before your airport transfer.",
  },
];

export function getAllFaqs(): FAQ[] {
  return [...getHomepageFaqs(), ...extraFaqs];
}
`);

console.log("Part 5 done");
