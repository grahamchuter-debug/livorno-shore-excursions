import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { comparisons, getComparisonDisplayTitle } from "@/data/comparisons";
import { getComparisonImage } from "@/lib/images";

const path = "/compare";
const description =
  "Honest comparisons for Tuscany cruise passengers — Florence or Cinque Terre, Pisa worth visiting, small group vs coach, and the best excursions for first-timers, families and couples.";

export const metadata = buildMetadata({
  title: "Compare Tuscany Cruise Options from Livorno",
  description,
  path,
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Compare", path },
];

export default function CompareHubPage() {
  const image = getComparisonImage("florence-vs-cinque-terre");
  return (
    <>
      <JsonLd data={[breadcrumbSchema(breadcrumbs), webPageSchema({ title: "Compare Tuscany Cruise Options", description, path })]} />
      <PageHero
        title="Compare Tuscany Cruise Options"
        subtitle="Editorial comparisons to help you choose — Florence, Cinque Terre, Pisa, tour style and the best excursions for your traveller type."
        image={image}
        compact
      />
      <section className="section-padding">
        <div className="container-wide">
          <Breadcrumbs items={breadcrumbs} />
          <div className="grid gap-4 sm:grid-cols-2">
            {comparisons.map((c) => (
              <Link key={c.slug} href={`/compare/${c.slug}`} className="nav-card group">
                <h2 className="font-display text-lg font-bold text-gray-900 group-hover:text-coastal-800">
                  {getComparisonDisplayTitle(c)}
                </h2>
                <p className="mt-2 text-sm text-gray-600">{c.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
