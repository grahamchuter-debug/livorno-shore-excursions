import Link from "next/link";
import { comparisonPageMetadata } from "@/lib/seo";
import { ComparisonHeroBand } from "@/components/ComparisonHeroBand";
import { ComparisonTable } from "@/components/ComparisonTable";
import { FAQSection } from "@/components/FAQSection";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PlanningLinks } from "@/components/PlanningLinks";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, articleSchema } from "@/lib/schema";
import {
  getComparisonBySlug,
  getAllComparisonSlugs,
  comparisons,
  getComparisonDisplayTitle,
} from "@/data/comparisons";
import { getComparisonImage } from "@/lib/images";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getAllComparisonSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getComparisonBySlug(slug);
  if (!c) return {};
  return comparisonPageMetadata(slug, c.seoTitle, c.metaDescription);
}

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const comp = getComparisonBySlug(slug);
  if (!comp) notFound();

  const path = `/compare/${slug}`;
  const image = getComparisonImage(slug);
  const displayTitle = getComparisonDisplayTitle(comp);
  const isGuide = comp.kind === "guide" && comp.guideItems;

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Compare", path: "/compare" },
    { name: displayTitle, path },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbs),
          faqSchema(comp.faqs),
          articleSchema({ title: comp.seoTitle, description: comp.metaDescription, path, image: image.src }),
        ]}
      />
      <ComparisonHeroBand image={image} title={displayTitle} subtitle={comp.summary} compact />
      <section className="section-padding">
        <div className="container-wide max-w-4xl">
          <Breadcrumbs items={breadcrumbs} />
          <p className="text-lg text-gray-700">{comp.verdict}</p>

          {comp.overview.length > 0 && (
            <div className="prose-body mt-6">
              {comp.overview.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}

          {isGuide ? (
            <div className="mt-8 overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-coastal-800 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Option</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Why choose it</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Top pick</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Return confidence</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Walking</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {comp.guideItems!.map((item) => (
                    <tr key={item.slug}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        <Link href={item.href} className="text-coastal-800 hover:underline">
                          {item.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.reason}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.topExcursion}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.returnConfidence}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.walkingDifficulty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            comp.comparisonTable &&
            comp.optionA &&
            comp.optionB && (
              <ComparisonTable rows={comp.comparisonTable} optionA={comp.optionA} optionB={comp.optionB} />
            )
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {isGuide
              ? comp.guideItems!.map((item) => (
                  <Link key={item.slug} href={item.href} className="btn-primary text-sm">
                    {item.name}
                  </Link>
                ))
              : comp.relatedSlugs.map((s) => (
                  <Link key={s} href={`/compare/${s}`} className="btn-secondary text-sm">
                    Related comparison
                  </Link>
                ))}
          </div>

          <div className="mt-12">
            <FAQSection faqs={comp.faqs} />
          </div>

          <h2 className="section-title text-2xl mt-12 mb-4">More comparisons</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {comparisons
              .filter((c) => c.slug !== slug)
              .slice(0, 4)
              .map((c) => (
                <Link key={c.slug} href={`/compare/${c.slug}`} className="nav-card">
                  <h3 className="font-display text-base font-bold text-gray-900">{getComparisonDisplayTitle(c)}</h3>
                  <p className="mt-1 text-sm text-gray-600">{c.summary}</p>
                </Link>
              ))}
          </div>

          <div className="mt-12">
            <PlanningLinks />
          </div>
        </div>
      </section>
    </>
  );
}
