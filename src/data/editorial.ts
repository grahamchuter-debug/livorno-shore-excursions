import type { EditorialCategory } from "./types";
import { SIGNATURE_EXPERIENCE_PATH } from "./signature-experience";

export interface EditorialCategoryDef {
  id: EditorialCategory;
  label: string;
  shortLabel: string;
  description: string;
}

export const EDITORIAL_CATEGORIES: EditorialCategoryDef[] = [
  { id: "editors-choice", label: "Editor's Choice", shortLabel: "Editor's Choice", description: "Our top pick after comparing options for Livorno cruise passengers." },
  { id: "best-historic", label: "Best Historic Experience", shortLabel: "Historic", description: "Florence Renaissance art and architecture without rushing your port day." },
  { id: "best-independent", label: "Best Independent Experience", shortLabel: "Independent", description: "The smartest DIY approach — train to Cinque Terre or Florence from Livorno." },
  { id: "best-coastal", label: "Best Coastal Experience", shortLabel: "Coastal", description: "Cinque Terre villages, coastal paths and Ligurian seafood timed to your ship." },
  { id: "best-view", label: "Best Viewpoints", shortLabel: "Viewpoints", description: "Manarola sunsets, Vernazza harbour and Tuscan hill panoramas." },
  { id: "best-got", label: "Signature Experience", shortLabel: "Signature", description: "Our flagship Signature Tuscany Experience — curated small-group Tuscany." },
  { id: "best-families", label: "Best for Families", shortLabel: "Families", description: "Paced routing, shorter walks and reliable return timing for children." },
  { id: "best-photography", label: "Best Photography", shortLabel: "Photography", description: "Cinque Terre harbours, Florence architecture and Pisa's Leaning Tower." },
  { id: "best-food", label: "Best Food & Wine", shortLabel: "Food & Wine", description: "Tuscan trattorias, Chianti wine and Ligurian seafood that fit a cruise schedule." },
  { id: "best-luxury", label: "Luxury Choice", shortLabel: "Luxury", description: "Private vehicles, exclusive small groups and premium coastal routing." },
  { id: "hidden-gem", label: "Hidden Gem", shortLabel: "Hidden Gem", description: "Villages and experiences away from the main coach convoys." },
  { id: "best-value", label: "Best Value", shortLabel: "Best Value", description: "Strong sightseeing per euro when budget matters as much as timing." },
  { id: "best-short-port", label: "Best Short Port Call", shortLabel: "Short Port", description: "Realistic when your ship is in Livorno for under eight usable hours." },
];

export interface EditorsCollectionItem {
  id: string;
  emoji: string;
  label: string;
  description: string;
  href: string;
  cta: string;
  signature?: boolean;
  comingSoon?: boolean;
}

export const editorsCollectionItems: EditorsCollectionItem[] = [
  {
    id: "editors-choice",
    emoji: "⭐",
    label: "Editor's Choice",
    description: "Florence Highlights — our top pick for first-time visitors who want the definitive Renaissance day.",
    href: "/shore-excursions/florence-highlights",
    cta: "View pick",
  },
  {
    id: "signature-experience",
    emoji: "⭐",
    label: "Signature Experience",
    description: "Signature Tuscany Experience — our flagship small-group day, designed with local experts.",
    href: SIGNATURE_EXPERIENCE_PATH,
    cta: "Learn more",
    signature: true,
    comingSoon: true,
  },
  {
    id: "best-value",
    emoji: "⭐",
    label: "Best Value",
    description: "Pisa & Lucca — iconic sights and a compact medieval city without the Florence price tag.",
    href: "/compare/best-tuscany-shore-excursion",
    cta: "See recommendations",
  },
  {
    id: "families",
    emoji: "⭐",
    label: "Families",
    description: "Cinque Terre Family Tour — coastal villages, shorter walks and beach time for children.",
    href: "/compare/best-tuscany-excursion-families",
    cta: "Family guide",
  },
  {
    id: "couples",
    emoji: "⭐",
    label: "Couples",
    description: "Cinque Terre for Two — harbour strolls, cliffside views and unhurried village time.",
    href: "/compare/best-tuscany-excursion-couples",
    cta: "Couples guide",
  },
  {
    id: "food-wine",
    emoji: "⭐",
    label: "Food & Wine",
    description: "Taste of Tuscany — Chianti wine, trattoria lunch and local specialities as your port-day anchor.",
    href: "/compare/best-tuscany-excursion-food-lovers",
    cta: "Food & wine guide",
  },
  {
    id: "first-time",
    emoji: "⭐",
    label: "First-Time Visitors",
    description: "The honest ranking — which Tuscany experience suits your first cruise stop at Livorno.",
    href: "/compare/best-tuscany-shore-excursion",
    cta: "First-timer guide",
  },
];

export function getEditorialLabel(id: EditorialCategory): string {
  return EDITORIAL_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
