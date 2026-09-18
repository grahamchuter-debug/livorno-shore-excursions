"use client";

import Link from "next/link";
import { subjectImages } from "@/lib/images";
import { ResponsiveImage } from "@/components/ResponsiveImage";

const CHOOSE_CARDS = [
  {
    slug: "florence",
    emoji: "🎨",
    title: "Renaissance Florence",
    tagline: "Duomo, Uffizi, Ponte Vecchio — the art capital of the world, one unforgettable day from your ship.",
    highlights: [
      "Florence Cathedral & Brunelleschi's dome",
      "Piazza della Signoria & Palazzo Vecchio",
      "Ponte Vecchio & the Arno",
      "Renaissance art and architecture",
      "Expert-guided or independent options",
    ],
    cta: "Discover Florence",
    href: "/guides/florence-from-livorno",
    imageKey: "florence",
    wide: true,
  },
  {
    slug: "cinque-terre",
    emoji: "🌈",
    title: "Cinque Terre",
    tagline: "Five colourful villages clinging to the Ligurian cliffs — Manarola, Vernazza and the coastal path of your dreams.",
    highlights: [
      "Manarola & Vernazza harbours",
      "Coastal train through the villages",
      "Cliffside walking paths",
      "Fresh seafood and local wine",
      "Photography at every turn",
    ],
    cta: "Discover Cinque Terre",
    href: "/guides/cinque-terre-from-livorno",
    imageKey: "cinque-terre",
    wide: false,
  },
  {
    slug: "pisa",
    emoji: "🗼",
    title: "Pisa",
    tagline: "The Leaning Tower, Piazza dei Miracoli and a compact medieval city — Tuscany's most iconic snapshot.",
    highlights: [
      "Leaning Tower of Pisa",
      "Piazza dei Miracoli UNESCO site",
      "Pisa Cathedral & Baptistery",
      "Medieval city centre stroll",
      "Easy half-day from Livorno",
    ],
    cta: "Discover Pisa",
    href: "/guides/pisa-from-livorno",
    imageKey: "pisa",
    wide: false,
  },
] as const;

export function ChooseYourTuscany() {
  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <p className="section-eyebrow">Choose Your Tuscany</p>
        <h2 className="section-title mt-2 max-w-3xl">
          Which unforgettable Italian experience are you dreaming of?
        </h2>
        <p className="section-subtitle">
          Livorno is not the attraction — it is your gateway. Passengers do not dream of a cruise terminal;
          they dream of Renaissance masterpieces, cliffside villages and the Leaning Tower. Choose the
          experience that inspires you before you browse excursions.
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {CHOOSE_CARDS.map((card) => {
            const image = subjectImages[card.imageKey] ?? subjectImages.florence;
            return (
              <Link
                key={card.slug}
                href={card.href}
                className={`card-editorial group flex h-full flex-col overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
                  card.wide ? "md:col-span-2" : ""
                }`}
              >
                <div
                  className={`relative overflow-hidden ${card.wide ? "aspect-[21/9]" : "aspect-[16/10]"}`}
                >
                  <ResponsiveImage
                    image={image}
                    role="card"
                    imgClassName="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-coastal-900/80 via-coastal-900/25 to-transparent"
                    aria-hidden="true"
                  />
                  <span className="absolute left-5 top-5 text-3xl" aria-hidden="true">
                    {card.emoji}
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
                    <h3 className="font-display text-2xl font-semibold text-white sm:text-3xl">
                      {card.title}
                    </h3>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-7 sm:p-8">
                  <p className="text-base leading-relaxed text-gray-600 italic">
                    &ldquo;{card.tagline}&rdquo;
                  </p>
                  <ul className="mt-5 space-y-2 border-t border-gray-100 pt-5">
                    {card.highlights.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="h-1 w-1 shrink-0 rounded-full bg-maple-500" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-6 text-sm font-semibold tracking-wide text-maple-600 group-hover:text-maple-500">
                    {card.cta} →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
