import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { excursions } from "@/data/excursions";
import { getExcursionImage, excursionsHubImage } from "@/lib/images";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { SignatureTuscanyFeature } from "@/components/SignatureTuscanyFeature";

export const metadata = buildMetadata({
  title: "Livorno Shore Excursions — Tuscany & Cinque Terre from Your Cruise Ship",
  description:
    "Premium Livorno shore excursions — Florence, Cinque Terre, Pisa and Tuscan food tours, all timed around your ship with return-to-ship confidence.",
  path: "/shore-excursions",
  image: excursionsHubImage.src,
  imageAlt: excursionsHubImage.alt,
  keywords: [
    "Livorno shore excursions",
    "Florence from Livorno",
    "Cinque Terre shore excursions",
    "Pisa from Livorno cruise",
  ],
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Shore Excursions", path: "/shore-excursions" },
];

export default function ShoreExcursionsPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbs),
          webPageSchema({
            title: "Livorno Shore Excursions",
            description: "Premium Tuscany shore excursions from Livorno cruise port.",
            path: "/shore-excursions",
          }),
        ]}
      />
      <PageHero
        image={excursionsHubImage}
        title="Livorno Shore Excursions"
        subtitle="Cruise-timed tours for your chosen Tuscany — Florence, Cinque Terre, Pisa and food experiences with reliable return-to-ship timing. Browse after you've decided which experience suits your day."
        compact
      />
      <section className="section-padding">
        <div className="container-wide">
          <Breadcrumbs items={breadcrumbs} />
          <p className="mt-6 text-gray-600">
            Not sure which destination? Start with our{" "}
            <Link href="/compare/florence-vs-cinque-terre" className="font-semibold text-coastal-700 hover:underline">
              Florence or Cinque Terre comparison
            </Link>{" "}
            or the{" "}
            <Link href="/compare/best-tuscany-shore-excursion" className="font-semibold text-coastal-700 hover:underline">
              best excursion guide
            </Link>
            .
          </p>
          <div className="mt-8">
            <SignatureTuscanyFeature embedded />
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {excursions.map((e) => {
              const image = getExcursionImage(e.slug);
              const isEditorsChoice = e.slug === "florence-highlights";
              return (
                <Link key={e.slug} href={`/shore-excursions/${e.slug}`} className="card-editorial group overflow-hidden">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <ResponsiveImage
                      image={image}
                      role="card"
                      imgClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-coastal-900/55 via-transparent to-transparent"
                      aria-hidden="true"
                    />
                    {isEditorsChoice ? (
                      <span className="absolute left-3 top-3 badge-editors-choice">⭐ Editor&apos;s Choice</span>
                    ) : (
                      <span className="absolute left-3 top-3 pill bg-white/90">{e.category}</span>
                    )}
                  </div>
                  <div className="p-6">
                    <h2 className="font-display text-lg font-bold text-gray-900 group-hover:text-coastal-800">
                      {e.title}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">{e.tagline}</p>
                    <p className="mt-3 text-xs font-medium text-coastal-700">
                      {e.duration} · {e.pace}
                    </p>
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
