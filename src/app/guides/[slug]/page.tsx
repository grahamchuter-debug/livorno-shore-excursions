import { notFound } from "next/navigation";
import { highlightPageMetadata, guidePageMetadata } from "@/lib/seo";
import { HighlightArticle } from "@/components/HighlightArticle";
import { GuideArticle } from "@/components/GuideArticle";
import { getGuideBySlug, getAllGuideSlugs } from "@/lib/guides";
import type { GuidePage } from "@/data/types";

function getRelatedGuidePage(slug: string): GuidePage | undefined {
  const entry = getGuideBySlug(slug);
  if (!entry) return undefined;
  if (entry.kind === "experience") return entry.page;
  return {
    slug: entry.page.slug,
    title: entry.page.title,
    seoTitle: entry.page.seoTitle,
    metaDescription: entry.page.metaDescription,
    tagline: entry.page.tagline,
    overview: entry.page.overview,
    body: entry.page.body,
    highlights: entry.page.highlights,
    tips: entry.page.tips,
    faqs: entry.page.faqs,
    relatedSlugs: entry.page.relatedAttractionSlugs,
    imageKey: "florence",
    hubPath: "/guides",
  };
}

export function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getGuideBySlug(slug);
  if (!entry) return {};
  if (entry.kind === "highlight") {
    return highlightPageMetadata(slug, entry.page.seoTitle, entry.page.metaDescription);
  }
  return guidePageMetadata(
    entry.page.hubPath,
    slug,
    entry.page.seoTitle,
    entry.page.metaDescription,
    entry.page.imageKey,
  );
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getGuideBySlug(slug);
  if (!entry) notFound();

  if (entry.kind === "highlight") {
    return <HighlightArticle page={entry.page} />;
  }

  return (
    <GuideArticle
      page={entry.page}
      hubLabel="Tuscany Planning Guides"
      getRelatedPage={getRelatedGuidePage}
    />
  );
}
