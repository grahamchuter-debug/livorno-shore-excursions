import Link from "next/link";
import type { GuidePage } from "@/data/types";
import { PhotoHeroBand } from "@/components/PhotoHeroBand";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQSection } from "@/components/FAQSection";
import { PlanningLinks } from "@/components/PlanningLinks";
import { EditorialRecommendations } from "@/components/EditorialRecommendations";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, articleSchema } from "@/lib/schema";
import { subjectImages } from "@/lib/images";

interface GuideArticleProps {
  page: GuidePage;
  hubLabel: string;
  getRelatedPage: (slug: string) => GuidePage | undefined;
}

export function GuideArticle({ page, hubLabel, getRelatedPage }: GuideArticleProps) {
  const path = `${page.hubPath}/${page.slug}`;
  const image = subjectImages[page.imageKey] ?? subjectImages.tuscany;
  const related = page.relatedSlugs.map(getRelatedPage).filter(Boolean) as GuidePage[];

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: hubLabel, path: page.hubPath },
    { name: page.title, path },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbs),
          faqSchema(page.faqs),
          articleSchema({ title: page.seoTitle, description: page.metaDescription, path, image: image.src }),
        ]}
      />
      <PhotoHeroBand image={image} eyebrow={hubLabel} title={page.title} subtitle={page.tagline} compact />
      <section className="section-padding">
        <div className="container-wide max-w-4xl">
          <Breadcrumbs items={breadcrumbs} />
          <p className="text-lg leading-relaxed text-gray-700">{page.overview}</p>
          <div className="prose-body">
            {page.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {page.highlights.length > 0 && (
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="card-feature">
                <h2 className="font-display text-xl font-bold text-gray-900">Highlights</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
                  {page.highlights.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              <div className="card-feature">
                <h2 className="font-display text-xl font-bold text-gray-900">Tips for cruise passengers</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
                  {page.tips.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {page.recommendations && (
            <EditorialRecommendations recommendations={page.recommendations} />
          )}

          {related.length > 0 && (
            <div className="mt-12">
              <h2 className="section-title text-2xl mb-6">Related guides</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => (
                  <Link key={r.slug} href={`${r.hubPath}/${r.slug}`} className="nav-card">
                    <h3 className="font-display text-base font-bold text-gray-900">{r.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{r.tagline}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12">
            <FAQSection faqs={page.faqs} title={`${page.title} — FAQs`} />
          </div>
          <div className="mt-12">
            <PlanningLinks />
          </div>
        </div>
      </section>
    </>
  );
}
