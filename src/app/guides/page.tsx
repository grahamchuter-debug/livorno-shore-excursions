import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { highlights } from "@/data/highlights";
import { experiencePages } from "@/data/experiences";
import { getHighlightImage, getGuideImage, guidesHubImage } from "@/lib/images";
import { ResponsiveImage } from "@/components/ResponsiveImage";

const path = "/guides";
const description =
  "Tuscany cruise planning guides from Livorno — Florence, Cinque Terre, Pisa, Portovenere, food and passenger-type advice with realistic timings.";

export const metadata = buildMetadata({
  title: "Tuscany Cruise Planning Guides from Livorno",
  description,
  path,
  keywords: [
    "Livorno cruise port guide",
    "Florence from Livorno",
    "Cinque Terre from Livorno",
    "Pisa from Livorno",
    "Portovenere from Livorno",
  ],
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Planning Guides", path },
];

export default function GuidesHubPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbs),
          webPageSchema({ title: "Tuscany Cruise Planning Guides from Livorno", description, path }),
        ]}
      />
      <PageHero
        title="Tuscany Cruise Planning Guides"
        subtitle="Your gateway to Tuscany and Cinque Terre — Florence, coastal villages, Pisa, Portovenere and practical advice for every type of cruise passenger arriving into Livorno."
        image={guidesHubImage}
        compact
      />
      <section className="section-padding">
        <div className="container-wide">
          <Breadcrumbs items={breadcrumbs} />

          <h2 className="section-title mt-8">Places &amp; experiences</h2>
          <p className="section-subtitle">Authority guides to Tuscany&apos;s highlights with transfer times and return-to-ship advice.</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((h) => {
              const img = getHighlightImage(h.slug);
              return (
                <Link key={h.slug} href={`/guides/${h.slug}`} className="card-editorial group overflow-hidden">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <ResponsiveImage
                      image={img}
                      role="card"
                      imgClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-lg font-bold text-gray-900 group-hover:text-coastal-800">{h.attractionName}</h3>
                    <p className="mt-2 text-sm text-gray-600">{h.tagline}</p>
                    <p className="mt-3 text-xs font-medium text-coastal-700">{h.travelTime}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          <h2 className="section-title mt-16">Passenger guides</h2>
          <p className="section-subtitle">Editorial advice for first-timers, families, food lovers and independent explorers.</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {experiencePages.map((g) => {
              const img = getGuideImage(g.imageKey);
              return (
                <Link key={g.slug} href={`/guides/${g.slug}`} className="card-editorial group overflow-hidden">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <ResponsiveImage
                      image={img}
                      role="card"
                      imgClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-lg font-bold text-gray-900 group-hover:text-coastal-800">{g.title}</h3>
                    <p className="mt-2 text-sm text-gray-600">{g.tagline}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
