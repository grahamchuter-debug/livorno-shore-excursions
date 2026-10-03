import { excursions } from "./excursions";
import { SIGNATURE_EXPERIENCE_PATH, signatureTuscanyExperience } from "./signature-experience";

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
  { id: "florence", label: "Florence & Renaissance art" },
  { id: "cinque-terre", label: "Cinque Terre villages" },
  { id: "pisa", label: "Pisa & Leaning Tower" },
  { id: "food", label: "Food & wine" },
  { id: "photography", label: "Photography & scenery" },
  { id: "family", label: "Family-friendly" },
  { id: "independent", label: "Independent travel" },
  { id: "luxury", label: "Luxury & romance" },
  { id: "coastal", label: "Coastal scenery" },
];

const INTEREST_TO_EXCURSION: Record<string, string[]> = {
  florence: ["florence-highlights", "florence-and-pisa-combo", "taste-of-tuscany"],
  "cinque-terre": ["cinque-terre-highlights", "cinque-terre-family", "cinque-terre-seafood"],
  pisa: ["pisa-lucca-highlights", "pisa-half-day", "florence-and-pisa-combo"],
  food: ["taste-of-tuscany", "cinque-terre-seafood", "florence-highlights"],
  photography: ["cinque-terre-highlights", "florence-highlights", "pisa-lucca-highlights"],
  family: ["cinque-terre-family", "pisa-lucca-highlights", "cinque-terre-highlights"],
  independent: ["cinque-terre-highlights", "pisa-half-day", "florence-highlights"],
  luxury: ["florence-highlights", "cinque-terre-highlights", "taste-of-tuscany"],
  coastal: ["cinque-terre-highlights", "cinque-terre-seafood", "cinque-terre-family"],
};

const ITINERARY_THEMES: Record<string, { headline: string; slugs: string[]; summary: string }> = {
  "editors-choice": {
    headline: "Editor's Choice — Florence Highlights",
    slugs: ["florence-highlights", "cinque-terre-highlights", "pisa-lucca-highlights"],
    summary: "Our Editor's Choice — Duomo, Signoria and Ponte Vecchio with motorway timing built around your ship.",
  },
  "best-historic": {
    headline: "Florence Highlights",
    slugs: ["florence-highlights", "florence-and-pisa-combo", "pisa-lucca-highlights"],
    summary: "Renaissance Florence — the art capital in one carefully timed port day.",
  },
  "best-food": {
    headline: "Taste of Tuscany",
    slugs: ["taste-of-tuscany", "cinque-terre-seafood", "florence-highlights"],
    summary: "Chianti wine, trattoria lunch or Ligurian seafood fitted to your Livorno port hours.",
  },
  "best-photography": {
    headline: "Cinque Terre Highlights",
    slugs: ["cinque-terre-highlights", "pisa-lucca-highlights", "florence-highlights"],
    summary: "Manarola harbours, Vernazza castle and Tuscan architecture for photography lovers.",
  },
  "best-independent": {
    headline: "Independent Cinque Terre",
    slugs: ["cinque-terre-highlights", "pisa-half-day", "florence-highlights"],
    summary: "Train to Cinque Terre from Livorno Centrale — manage your own return buffer.",
  },
  "best-families": {
    headline: "Cinque Terre Family",
    slugs: ["cinque-terre-family", "pisa-lucca-highlights", "cinque-terre-highlights"],
    summary: "Coastal villages, gelato and shorter walks — paced for mixed-age families.",
  },
  "best-luxury": {
    headline: "Signature Tuscany Experience",
    slugs: ["florence-highlights", "cinque-terre-highlights", "taste-of-tuscany"],
    summary: "Premium small-group pacing — Signature Tuscany Experience in preparation via The Wow Collection.",
  },
  "hidden-gem": {
    headline: "Pisa & Lucca",
    slugs: ["pisa-lucca-highlights", "pisa-half-day", "taste-of-tuscany"],
    summary: "Leaning Tower and medieval Lucca — excellent value away from Florence coach convoys.",
  },
};

function excursionLink(slug: string, why: string): PlannerLink | null {
  const e = excursions.find((x) => x.slug === slug);
  if (!e) return null;
  return { label: e.title, href: `/shore-excursions/${slug}`, why };
}

function usableHours(input: PlannerInput): number | null {
  if (input.arrivalTime && input.departureTime) {
    const [aH, aM] = input.arrivalTime.split(":").map(Number);
    const [dH, dM] = input.departureTime.split(":").map(Number);
    if ([aH, aM, dH, dM].some((n) => Number.isNaN(n))) return null;
    const raw = (dH * 60 + dM - (aH * 60 + aM)) / 60;
    return Math.max(0, raw - 1.5);
  }
  return null;
}

function pickTheme(input: PlannerInput): keyof typeof ITINERARY_THEMES {
  const { interests, children, travelStyle, mobility, budget } = input;
  const active = interests.length ? interests : ["florence", "coastal"];

  if (children > 0 || active.includes("family")) return "best-families";
  if (budget === "premium" || active.includes("luxury") || mobility === "limited") return "best-luxury";
  if (travelStyle === "diy" || active.includes("independent")) return "best-independent";
  if (active.includes("food")) return "best-food";
  if (active.includes("photography") || active.includes("coastal")) return "best-photography";
  if (active.includes("pisa")) return "hidden-gem";
  if (active.includes("cinque-terre")) return "best-photography";
  if (active.includes("florence")) return "editors-choice";
  const hours = usableHours(input);
  if (hours !== null && hours < 6) return "best-families";
  return "editors-choice";
}

export function generateTuscanyPlan(input: PlannerInput): PlannerResult {
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

  const activeInterests = interests.length ? interests : ["florence", "coastal"];
  for (const interest of activeInterests) {
    for (const s of INTEREST_TO_EXCURSION[interest] ?? []) pushSlug(s);
  }
  if (hasKids) pushSlug("cinque-terre-family");
  if (travelStyle === "diy") pushSlug("cinque-terre-highlights");
  if (budget === "premium") pushSlug("florence-highlights");
  if (hours !== null && hours < 6) pushSlug("pisa-half-day");

  const reasonMap: Record<string, string> = {
    "florence-highlights": "Editor's Choice — Duomo, Signoria and Ponte Vecchio for first-timers.",
    "cinque-terre-highlights": "Manarola, Vernazza and coastal train — closest to Livorno.",
    "pisa-lucca-highlights": "Leaning Tower and medieval Lucca — best value for shorter calls.",
    "florence-and-pisa-combo": "Both icons on 10+ hour calls only.",
    "pisa-half-day": "Compact Leaning Tower day for limited hours.",
    "cinque-terre-family": "Gelato, harbours and paced routing for children.",
    "taste-of-tuscany": "Chianti wine and trattoria pranzo inland.",
    "cinque-terre-seafood": "Harbour lunch and Ligurian wine on the coast.",
  };

  const excursionLinks = excSlugs
    .slice(0, 5)
    .map((s) => excursionLink(s, reasonMap[s] ?? "A strong match for your Tuscany port day."))
    .filter((x): x is PlannerLink => x !== null);

  if (!excursionLinks.some((l) => l.href === SIGNATURE_EXPERIENCE_PATH)) {
    excursionLinks.unshift({
      label: signatureTuscanyExperience.title,
      href: SIGNATURE_EXPERIENCE_PATH,
      why: "Flagship Signature Experience — in preparation via The Wow Collection.",
    });
  }

  const transfers: PlannerLink[] = [
    {
      label: "Livorno Cruise Port Guide",
      href: "/cruise-port-guide",
      why: "Terminal layout, train station access and coach pickup points.",
    },
  ];

  const logistics: PlannerLink[] = [
    { label: "Ship Schedules", href: "/ship-schedules/livorno", why: "See which ships share your Livorno port day." },
    { label: "Florence or Pisa?", href: "/compare/florence-vs-pisa", why: "Honest comparison to help you choose." },
  ];

  const topExc = excursionLinks[0]?.label ?? theme.headline;
  const dayPlan: { time: string; text: string }[] = [];
  const arriveLabel = arrivalTime || "your arrival";
  const departLabel = departureTime || "all-aboard";

  dayPlan.push({
    time: arrivalTime ? arriveLabel : "On arrival",
    text: `Disembark at Livorno cruise terminal (${arriveLabel}). Meet your excursion at the terminal exit, or walk 10–15 minutes to Livorno Centrale for trains to Cinque Terre.`,
  });

  if (themeKey === "best-food") {
    dayPlan.push({ time: "Morning", text: "Scenic drive to Chianti or coastal village — wine tasting or market stop." });
    dayPlan.push({ time: "Midday", text: "Trattoria pranzo or harbour seafood lunch — allow 90 minutes seated." });
    dayPlan.push({ time: "Afternoon", text: "Village stroll, then return toward Livorno with motorway or train buffer." });
  } else if (themeKey === "best-independent") {
    dayPlan.push({ time: "Morning", text: "Walk to Livorno Centrale — regional train to Manarola or Vernazza." });
    dayPlan.push({ time: "Midday", text: "Self-guided harbour walks — confirm return train before leaving the village." });
    dayPlan.push({ time: "Afternoon", text: "Return train mid-afternoon, terminal 90 minutes before all-aboard." });
  } else if (themeKey === "best-families") {
    dayPlan.push({ time: "Morning", text: "Cinque Terre harbour and gelato — or Pisa Piazza dei Miracoli for easy terrain." });
    dayPlan.push({ time: "Midday", text: "Lunch stop and shorter village walk paced for children." });
    dayPlan.push({ time: "Afternoon", text: "Early return to terminal — avoid rushed Florence with toddlers." });
  } else if (themeKey === "hidden-gem") {
    dayPlan.push({ time: "Morning", text: "Pisa Leaning Tower and Piazza dei Miracoli photos." });
    dayPlan.push({ time: "Midday", text: "Transfer to medieval Lucca — walled city stroll and lunch." });
    dayPlan.push({ time: "Afternoon", text: "Return to Livorno with generous buffer." });
  } else if (themeKey === "best-photography" || themeKey === "best-luxury" || themeKey === "editors-choice") {
    dayPlan.push({ time: "Morning", text: themeKey === "editors-choice" ? "Coach to Florence — Duomo, Signoria and Ponte Vecchio." : "Manarola and Vernazza harbours — morning light for photos." });
    dayPlan.push({ time: "Midday", text: "Lunch in the city or village — unhurried if on small-group tour." });
    dayPlan.push({ time: "Afternoon", text: `Return transfer planned for your ship — flexible pacing on ${topExc}.` });
  } else {
    dayPlan.push({ time: "Morning", text: `Tuscany anchor first: ${topExc}.` });
    dayPlan.push({ time: "Midday", text: "Lunch stop — trattoria or harbour depending on destination." });
    dayPlan.push({ time: "Afternoon", text: "Return transfer with explicit motorway or train buffer." });
  }

  dayPlan.push({
    time: "Return buffer",
    text: `Be back at Livorno terminal 60–90 minutes before all-aboard (${departLabel} sailing). Motorway traffic from Florence can add 20–30 minutes in peak summer.`,
  });

  const interestLabels = activeInterests
    .map((i) => INTEREST_OPTIONS.find((o) => o.id === i)?.label ?? i)
    .join(", ")
    .toLowerCase();

  const styleLabel = travelStyle === "diy" ? "independent" : "guided";

  const hoursLabel =
    hours === null
      ? "timed around your published call"
      : `~${hours.toFixed(1)} usable hours`;

  return {
    headline: theme.headline,
    summary: `${theme.summary} A Livorno port day (${hoursLabel}) for ${party} guest${party === 1 ? "" : "s"} interested in ${interestLabels}, preferring ${styleLabel} travel.`,
    excursions: excursionLinks.slice(0, 5),
    transfers,
    stay: [],
    logistics,
    dayPlan,
  };
}

