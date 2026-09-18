import Link from "next/link";
import { experienceCards } from "@/data/homepage";
import { subjectImages } from "@/lib/images";
import { ResponsiveImage } from "@/components/ResponsiveImage";

const CARD_EMOJI: Record<string, string> = {
  "signature-tuscany": "⭐",
  florence: "🎨",
  "cinque-terre": "🌈",
  pisa: "🗼",
  "food-wine": "🍷",
  "wow-collection": "✨",
};

export function ExperienceSelector() {
  return (
    <section className="section-padding bg-coastal-50 border-b border-coastal-100">
      <div className="container-wide">
        <p className="section-eyebrow">Explore Tuscany</p>
        <h2 className="section-title mt-2">How would you like to experience Tuscany?</h2>
        <p className="section-subtitle">
          Choose the path that fits your port day, interests and travel style — each card leads to the most relevant planning guides.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {experienceCards.map((card) => {
            const image = subjectImages[card.imageKey] ?? subjectImages.florence;
            return (
              <Link
                key={card.slug}
                href={card.href}
                className="card-editorial group flex h-full flex-col overflow-hidden"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <ResponsiveImage
                    image={image}
                    role="card"
                    imgClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-coastal-900/60 via-transparent to-transparent" aria-hidden="true" />
                  <span className="absolute left-3 top-3 text-2xl" aria-hidden="true">
                    {CARD_EMOJI[card.slug] ?? "🌄"}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg font-bold text-gray-900 group-hover:text-coastal-800">
                    {card.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{card.description}</p>
                  <span className="mt-4 text-sm font-semibold text-maple-600">{card.cta} →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
