import { getHighlightBySlug, getAllHighlightSlugs } from "@/data/highlights";
import { getExperienceBySlug, getAllExperienceSlugs } from "@/data/experiences";
import type { AttractionPage, GuidePage } from "@/data/types";

export type GuideEntry =
  | { kind: "highlight"; page: AttractionPage }
  | { kind: "experience"; page: GuidePage };

export function getGuideBySlug(slug: string): GuideEntry | undefined {
  const highlight = getHighlightBySlug(slug);
  if (highlight) return { kind: "highlight", page: highlight };
  const experience = getExperienceBySlug(slug);
  if (experience) return { kind: "experience", page: experience };
  return undefined;
}

export function getAllGuideSlugs(): string[] {
  return [...getAllHighlightSlugs(), ...getAllExperienceSlugs()];
}
