export interface SiteImage {
  src: string;
  alt: string;
  base: string;
}

const B = "/images";

function img(base: string, alt: string): SiteImage {
  return { base, src: `${B}/${base}.jpg`, alt };
}

export const siteImages = {
  hero: img("hero-home", "Cinque Terre coastline and Tuscan hills — gateway from Livorno cruise port"),
  ogDefault: img("og-default", "Tuscany cruise planning — Florence, Cinque Terre and Livorno cruise port"),
  logo: {
    base: "logo-mark",
    src: `${B}/logo-mark.svg`,
    alt: "Livorno Shore Excursions",
  },
  port: img("cruise-port", "Livorno cruise port — gateway to Tuscany and Cinque Terre"),
} as const;

export const subjectImages: Record<string, SiteImage> = {
  florence: img("portofino", "Florence Cathedral and Renaissance architecture — Tuscany from Livorno"),
  "cinque-terre": img("riviera-coast", "Cinque Terre colourful cliffside villages from Livorno"),
  pisa: img("photography", "Leaning Tower of Pisa — iconic Tuscany from Livorno"),
  tuscany: img("riviera-coast", "Tuscan countryside and coastline from Livorno cruise port"),
  food: img("food", "Tuscan cuisine and Chianti wine"),
  train: img("train", "Regional train to Cinque Terre from Livorno Centrale"),
  family: img("family", "Family exploring Tuscany from Livorno cruise ship"),
  compare: img("compare", "Comparing Tuscany cruise excursion options from Livorno"),
  port: img("cruise-port", "Livorno cruise port terminal"),
  highlights: img("riviera-coast", "Tuscany highlights from Livorno cruise port"),
  city: img("portofino", "Florence historic centre from Livorno"),
  history: img("camogli", "Historic Tuscan villages and medieval cities"),
  coast: img("riviera-coast", "Cinque Terre coastal scenery"),
  wine: img("food", "Chianti wine country Tuscany"),
  walking: img("beach", "Walking Cinque Terre coastal paths"),
  lucca: img("camogli", "Medieval Lucca walled city"),
  portovenere: img("ferry", "Portovenere harbour — Gulf of Livorno"),
};

function pick(key: string): SiteImage {
  return subjectImages[key] ?? siteImages.ogDefault;
}

const excursionImageKeys: Record<string, string> = {
  "florence-highlights": "florence",
  "cinque-terre-highlights": "cinque-terre",
  "pisa-lucca-highlights": "pisa",
  "florence-and-pisa-combo": "florence",
  "pisa-half-day": "pisa",
  "cinque-terre-family": "family",
  "taste-of-tuscany": "food",
  "cinque-terre-seafood": "food",
};

export function getExcursionImage(slug: string): SiteImage {
  return pick(excursionImageKeys[slug] ?? "highlights");
}

export const excursionsHubImage = pick("florence");

const highlightImageKeys: Record<string, string> = {
  "florence-from-livorno": "florence",
  "cinque-terre-from-livorno": "cinque-terre",
  "pisa-from-livorno": "pisa",
  "portovenere-from-livorno": "portovenere",
  "lucca-from-livorno": "lucca",
};

const comparisonImageKeys: Record<string, string> = {
  "florence-vs-cinque-terre": "compare",
  "florence-and-pisa-in-one-day": "florence",
  "is-pisa-worth-visiting": "pisa",
  "best-tuscany-shore-excursion": "florence",
  "small-group-vs-large-coach": "highlights",
  "best-tuscany-excursion-families": "family",
  "best-tuscany-excursion-couples": "cinque-terre",
  "best-tuscany-excursion-food-lovers": "food",
};

export function getComparisonImage(slug: string): SiteImage {
  return pick(comparisonImageKeys[slug] ?? "compare");
}

export function getHighlightImage(slug: string): SiteImage {
  return pick(highlightImageKeys[slug] ?? "highlights");
}

export function getGuideImage(key: string): SiteImage {
  return pick(highlightImageKeys[key] ?? (key in subjectImages ? key : "tuscany"));
}

export function getHotelImage(_slug: string): SiteImage {
  return pick("florence");
}

export function getTransferImage(_slug: string): SiteImage {
  return pick("train");
}

export const guidesHubImage = pick("tuscany");
