#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const DATA = join(import.meta.dirname, "..", "src/data");
function w(name, content) {
  writeFileSync(join(DATA, name), content, "utf8");
  console.log("wrote", name);
}

w("editorial.ts", `import type { EditorialCategory } from "./types";

export interface EditorialCategoryDef {
  id: EditorialCategory;
  label: string;
  shortLabel: string;
  description: string;
}

export const EDITORIAL_CATEGORIES: EditorialCategoryDef[] = [
  { id: "editors-choice", label: "Editor's Choice", shortLabel: "Editor's Choice", description: "Our top pick after comparing options for Corfu cruise passengers." },
  { id: "best-guided", label: "Best Guided Experience", shortLabel: "Best Guided", description: "The strongest guided shore excursion for this topic on a Corfu port day." },
  { id: "best-independent", label: "Best Independent Experience", shortLabel: "Best Independent", description: "The smartest DIY approach when you prefer to explore from the cruise port." },
  { id: "best-families", label: "Best for Families", shortLabel: "Families", description: "Paced for children and mixed-age groups with reliable return timing." },
  { id: "best-history", label: "Best for History Lovers", shortLabel: "History", description: "UNESCO Old Town, fortresses and Venetian heritage without rushing." },
  { id: "best-food-wine", label: "Best Food & Wine Experience", shortLabel: "Food & Wine", description: "Corfiot cuisine, olive oil and wine tastings that fit a cruise schedule." },
  { id: "best-beach", label: "Best Beach Experience", shortLabel: "Beach", description: "Turquoise coves and organised beaches with realistic transfer times." },
  { id: "best-boat", label: "Best Boat Trip", shortLabel: "Boat Trip", description: "Coastal cruises and cave routes timed to your ship's departure." },
  { id: "best-luxury", label: "Best Luxury Experience", shortLabel: "Luxury", description: "Private vehicles, premium pacing and exclusive access from the port." },
  { id: "best-first-time", label: "Best for First-Time Visitors", shortLabel: "First Time", description: "The essential Corfu introduction when you have only one port day." },
  { id: "hidden-gem", label: "Hidden Gem", shortLabel: "Hidden Gem", description: "A rewarding alternative away from the biggest coach convoys." },
  { id: "best-value", label: "Best Value", shortLabel: "Best Value", description: "Strong sightseeing per euro when budget matters as much as timing." },
  { id: "best-short-port", label: "Best for Short Port Calls", shortLabel: "Short Port", description: "Realistic when your ship is in Corfu for under seven usable hours." },
];

export function getEditorialLabel(id: EditorialCategory): string {
  return EDITORIAL_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
`);

w("homepage.ts", `import type { FAQ, VisitorType, ExperienceCard } from "./types";

export const visitorTypes: VisitorType[] = [
  {
    id: "port-day",
    label: "I'm visiting Corfu for the day on a cruise",
    shortLabel: "Port day",
    description: "You're calling at Corfu for the day. Find shore excursions, planning guides and a realistic port-day itinerary.",
    href: "/shore-excursions",
    cta: "Plan my port day",
  },
  {
    id: "first-time",
    label: "It's my first time in Corfu",
    shortLabel: "First visit",
    description: "Paleokastritsa or Old Town? Our first-timer guides and comparison pages help you choose confidently.",
    href: "/guides/corfu-for-first-time-visitors",
    cta: "First-timer guide",
  },
  {
    id: "independent",
    label: "I prefer to explore independently",
    shortLabel: "Independent",
    description: "Walk UNESCO Old Town from the terminal, use taxis wisely and know when DIY beats a ship tour.",
    href: "/guides/independent-vs-cruise-line-excursions",
    cta: "Independent guide",
  },
  {
    id: "planner",
    label: "I want a personalised itinerary",
    shortLabel: "Custom plan",
    description: "Tell us your hours ashore, interests and budget — get a tailored Corfu plan with return-to-ship timing.",
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
    slug: "beaches-coast",
    title: "Beaches & Scenic Coast",
    description: "Paleokastritsa's turquoise bays, Glyfada sand and the emerald coastline — half-day beach planning from the port.",
    href: "/guides/best-beaches-from-corfu-cruise-port",
    cta: "Explore beaches",
    imageKey: "beach",
  },
  {
    slug: "history-old-town",
    title: "History & UNESCO Old Town",
    description: "Liston, fortresses, Spyridon and Venetian lanes — walk Greece's most elegant heritage city from the terminal.",
    href: "/guides/corfu-old-town-walking-guide",
    cta: "Explore Old Town",
    imageKey: "old-town",
  },
  {
    slug: "boat-caves",
    title: "Boat Trips & Caves",
    description: "Coastal cruises, Blue Caves and Paleokastritsa boat routes — see Corfu from the Ionian on a port day.",
    href: "/guides/corfu-boat-trips",
    cta: "Explore boat trips",
    imageKey: "boat",
  },
  {
    slug: "food-culture",
    title: "Food & Local Culture",
    description: "Pastitsada, kumquat liqueur, olive oil and village tastings — Corfiot flavours unlike mainland Greece.",
    href: "/guides/corfu-food-guide",
    cta: "Taste Corfu",
    imageKey: "food",
  },
  {
    slug: "independent",
    title: "Independent Explorer",
    description: "Taxi to Spianada, walk Campiello, manage your own return — when independent beats a guided excursion.",
    href: "/guides/independent-vs-cruise-line-excursions",
    cta: "Go independent",
    imageKey: "old-town",
  },
];

export const coreSections: HomeSection[] = [
  { slug: "shore-excursions", number: "01", title: "Shore Excursions", description: "Paleokastritsa, Old Town, Achilleion and highlights — cruise-timed from Neo Limani.", href: "/shore-excursions", cta: "Browse excursions" },
  { slug: "guides", number: "02", title: "Corfu Planning Guides", description: "Authority guides for beaches, Old Town, food, boat trips and every type of passenger.", href: "/guides", cta: "Read guides" },
  { slug: "cruise-port-guide", number: "03", title: "Corfu Cruise Port Guide", description: "Terminal layout, taxis, buses and getting to Old Town on arrival.", href: "/cruise-port-guide", cta: "Port guide" },
  { slug: "cruise-planner", number: "04", title: "Corfu Cruise Planner", description: "Answer a few questions — get a tailored itinerary with return-to-ship confidence.", href: "/cruise-planner", cta: "Start planning" },
  { slug: "compare", number: "05", title: "Compare Options", description: "Paleokastritsa vs Old Town, beach vs sightseeing, DIY vs guided — honest comparisons.", href: "/compare/paleokastritsa-vs-corfu-old-town", cta: "Compare options" },
  { slug: "ship-schedules", number: "06", title: "Cruise Ship Schedules", description: "See which ships call at Corfu and plan around published arrival and departure times.", href: "/ship-schedules/corfu", cta: "View schedules" },
  { slug: "one-day", number: "07", title: "One Day in Corfu", description: "Hour-by-hour sample itineraries from gangway to all-aboard.", href: "/guides/one-day-in-corfu-cruise-ship", cta: "One-day guide" },
  { slug: "faq", number: "08", title: "FAQ", description: "Corfu cruise port questions answered — timing, taxis, excursions and return buffers.", href: "/faq", cta: "Read FAQs" },
];

export function getHomepageFaqs(): FAQ[] {
  return [
    {
      question: "How far is Corfu Old Town from the cruise port?",
      answer: "About 2 km — 5–10 minutes by taxi or 20–25 minutes walking along the coastal road toward Garitsa and Spianada.",
    },
    {
      question: "Can I visit Paleokastritsa on a Corfu port day?",
      answer: "Yes on calls of 7+ usable hours. Allow 35–45 minutes each way plus 2 hours at the coast, with a 60–90 minute return buffer.",
    },
    {
      question: "Should I book a shore excursion or explore independently?",
      answer: "Old Town is excellent for independent walks. Paleokastritsa, Achilleion and boat trips benefit from pre-booked transport — see our DIY vs guided comparison.",
    },
    {
      question: "What is the best Corfu excursion for first-timers?",
      answer: "A highlights tour combining Paleokastritsa, Achilleion and Old Town, or a focused Old Town walk if your call is short. See our first-timer guide.",
    },
    {
      question: "Where do cruise ships dock in Corfu?",
      answer: "At the New Port (Neo Limani), west of Corfu Town. Larger ships may use tenders in peak season — confirm on your cruise app.",
    },
  ];
}
`);

console.log("Part 2 partial — excursions/comparisons in part 3");
