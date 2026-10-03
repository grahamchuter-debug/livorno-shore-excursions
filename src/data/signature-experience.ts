import type { FAQ } from "./types";

export const SIGNATURE_EXPERIENCE_PATH = "/ultimate-tuscany-day";

export interface SignatureBenefit {
  emoji: string;
  title: string;
  description: string;
}

export const signatureTuscanyExperience = {
  slug: "signature-tuscany-experience",
  title: "Signature Tuscany Experience",
  seoTitle: "Signature Tuscany Experience — Flagship Shore Excursion from Livorno",
  metaDescription:
    "Our flagship Signature Experience for Livorno cruise passengers — a curated small-group day through Tuscany, designed with local experts. In preparation.",
  tagline:
    "The curated Tuscany day we would genuinely recommend to a first-time cruise passenger — designed with local experts, maximum 8 guests, timed for your ship.",
  overview:
    "Signature Tuscany Experience will be our flagship product — a small-group day (maximum eight guests) designed from scratch with local experts. It is the experience this homepage is built around: when launched, it becomes the primary recommendation without requiring a redesign.",
  comingSoon: true,
  benefits: [
    { emoji: "🚐", title: "Maximum 8 guests", description: "Small-group pacing through Tuscany without coach-tour inertia." },
    { emoji: "🎨", title: "Curated Tuscany routing", description: "Florence, Cinque Terre or a combination — sequenced with expert timing." },
    { emoji: "⏰", title: "Cruise-timed planning", description: "Every departure planned backward from your all-aboard time." },
    { emoji: "🤝", title: "Local expert design", description: "Built with guides who understand Livorno port logistics." },
  ] satisfies SignatureBenefit[],
  faqs: [
    {
      question: "When will Signature Tuscany Experience launch?",
      answer: "We are finalising partnerships with local experts. Register your interest via our enquire page to be notified at launch.",
    },
    {
      question: "How is this different from standard shore excursions?",
      answer: "Signature Experiences are curated through trusted local partners — designed from scratch for cruise passengers, not repurposed land tours. Maximum 8 guests, explicit return buffers, and editorial endorsement.",
    },
    {
      question: "Will this replace other recommendations on the site?",
      answer: "No — we will always offer honest comparisons and alternatives. Signature Tuscany Experience becomes our flagship recommendation for passengers who want the very best small-group experience.",
    },
  ] satisfies FAQ[],
};

export function getSignatureEditorialRecommendation() {
  return {
    category: "editors-choice" as const,
    title: "Signature Tuscany Experience",
    description: "Our flagship Signature Experience — curated Tuscany, maximum 8 guests. In preparation.",
    href: SIGNATURE_EXPERIENCE_PATH,
    signature: true,
    comingSoon: true,
  };
}
