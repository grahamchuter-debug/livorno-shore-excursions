import type { FAQ, VisitorType, ExperienceCard } from "./types";
import { SIGNATURE_EXPERIENCE_PATH } from "./signature-experience";

export const homepageTagline = "The Gateway to Tuscany & Cinque Terre";

export const visitorTypes: VisitorType[] = [
  {
    id: "port-day",
    label: "I'm visiting Tuscany for the day on a cruise",
    shortLabel: "Port day",
    description: "You're calling at Livorno for the day. Find shore excursions, planning guides and a realistic Tuscany itinerary from the cruise terminal.",
    href: "/shore-excursions",
    cta: "Plan my port day",
  },
  {
    id: "first-time",
    label: "It's my first time in Tuscany",
    shortLabel: "First visit",
    description: "Florence or Cinque Terre? Our first-timer guides and comparison pages help you choose confidently from Livorno.",
    href: "/compare/best-tuscany-shore-excursion",
    cta: "First-timer guide",
  },
  {
    id: "independent",
    label: "I prefer to explore independently",
    shortLabel: "Independent",
    description: "Train to Cinque Terre or Florence — manage your own return buffer when DIY beats a ship tour.",
    href: "/guides/independent-tuscany-guide",
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
    slug: "signature-tuscany",
    title: "Signature Tuscany Experience",
    description: "Our flagship Signature Experience — curated small-group Tuscany, maximum 8 guests. In preparation.",
    href: SIGNATURE_EXPERIENCE_PATH,
    cta: "Signature Experience",
    imageKey: "florence",
  },
  {
    slug: "florence",
    title: "Renaissance Florence",
    description: "Duomo, Uffizi highlights and Ponte Vecchio — the art capital of the world from Livorno.",
    href: "/guides/florence-from-livorno",
    cta: "Explore Florence",
    imageKey: "florence",
  },
  {
    slug: "cinque-terre",
    title: "Cinque Terre",
    description: "Manarola, Vernazza and coastal paths — five colourful villages on the Ligurian cliffs.",
    href: "/guides/cinque-terre-from-livorno",
    cta: "Discover Cinque Terre",
    imageKey: "cinque-terre",
  },
  {
    slug: "pisa",
    title: "Pisa & Lucca",
    description: "Leaning Tower, Piazza dei Miracoli and a compact medieval city — Tuscany's most iconic snapshot.",
    href: "/guides/pisa-from-livorno",
    cta: "Visit Pisa",
    imageKey: "pisa",
  },
  {
    slug: "food-wine",
    title: "Tuscan Food & Wine",
    description: "Chianti wine, trattoria lunch and local specialities — gastronomy as your port-day anchor.",
    href: "/guides/tuscan-food-guide",
    cta: "Taste Tuscany",
    imageKey: "food",
  },
  {
    slug: "wow-collection",
    title: "The Wow Collection",
    description: "Exclusive small-group excursions designed from scratch with local experts. In preparation.",
    href: "/wow-collection",
    cta: "The Wow Collection",
    imageKey: "cinque-terre",
  },
];

export const coreSections: HomeSection[] = [
  { slug: "compare", number: "01", title: "Compare Tuscany", description: "Florence or Cinque Terre? Pisa worth it? Small group vs coach — honest editorial comparisons.", href: "/compare", cta: "Compare options" },
  { slug: "shore-excursions", number: "02", title: "Shore Excursions", description: "Florence, Cinque Terre, Pisa and combos — cruise-timed from Livorno terminal.", href: "/shore-excursions", cta: "Browse excursions" },
  { slug: "cruise-planner", number: "03", title: "Tuscany Cruise Planner", description: "Answer a few questions — get a tailored itinerary with return-to-ship confidence.", href: "/cruise-planner", cta: "Start planning" },
  { slug: "cruise-port-guide", number: "04", title: "Livorno Cruise Port Guide", description: "Terminal layout, train station access and coach pickup on arrival.", href: "/cruise-port-guide", cta: "Port guide" },
  { slug: "ship-schedules", number: "05", title: "Cruise Ship Schedules", description: "See which ships call at Livorno and plan around published arrival and departure times.", href: "/ship-schedules/livorno", cta: "View schedules" },
  { slug: "guides", number: "06", title: "Tuscany Planning Guides", description: "Authority guides for Florence, Cinque Terre, Pisa and every type of passenger.", href: "/guides", cta: "Read guides" },
  { slug: "wow-collection", number: "07", title: "The Wow Collection", description: "Exclusive small-group excursions — a brand within your brand. In preparation.", href: "/wow-collection", cta: "Explore Wow" },
  { slug: "faq", number: "08", title: "FAQ", description: "Livorno cruise port questions answered — timing, trains, excursions and return buffers.", href: "/faq", cta: "Read FAQs" },
];

export function getHomepageFaqs(): FAQ[] {
  return [
    {
      question: "How far is Florence from Livorno cruise port?",
      answer: "About 90 km — 90–120 minutes by coach or private transfer along the A12 and A11. Allow a full day for Florence; combining with Pisa needs 10+ usable hours ashore.",
    },
    {
      question: "Can I visit Cinque Terre from Livorno on a port day?",
      answer: "Yes — Livorno is the closest major cruise port to Cinque Terre. Regional trains reach the villages in 10–20 minutes. Organised excursions handle village timing and return buffers.",
    },
    {
      question: "Florence or Cinque Terre — which should I choose?",
      answer: "Florence for Renaissance art and first-time Tuscany visitors. Cinque Terre for coastal scenery, photography and a more relaxed day. See our honest comparison page.",
    },
    {
      question: "Is Pisa worth visiting from Livorno?",
      answer: "Yes for the Leaning Tower and Piazza dei Miracoli — a compact half-day. Best combined with Lucca or as part of a Florence & Pisa combo on longer calls.",
    },
    {
      question: "Where do cruise ships dock in Livorno?",
      answer: "At the commercial cruise terminal near Livorno Centrale train station. Coaches meet passengers at the terminal exit; trains to Cinque Terre depart from the station 10–15 minutes walk away.",
    },
  ];
}
