import Link from "next/link";
import { editorsCollectionItems } from "@/data/editorial";

export function EditorsCollection() {
  return (
    <section className="section-padding bg-coastal-50">
      <div className="container-wide">
        <p className="section-eyebrow">Editor&apos;s Collection</p>
        <h2 className="section-title mt-2">The best excursion for your kind of traveller</h2>
        <p className="section-subtitle">
          Not every passenger wants the same Tuscany. Our editorial team recommends the strongest option
          for each traveller type — honest picks, not catalogue listings.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {editorsCollectionItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`group flex h-full flex-col rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                item.comingSoon
                  ? "border-dashed border-coastal-200 bg-white/60"
                  : item.signature
                    ? "card-signature"
                    : item.id === "editors-choice"
                      ? "border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-white"
                      : "border-gray-100 bg-white shadow-md"
              }`}
            >
              <span className="text-2xl" aria-hidden="true">
                {item.emoji}
              </span>
              <h3 className="mt-3 font-display text-lg font-bold text-gray-900 group-hover:text-coastal-800">
                {item.label}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{item.description}</p>
              {item.comingSoon ? (
                <span className="mt-4 text-xs font-semibold uppercase tracking-wider text-coastal-600">
                  In preparation
                </span>
              ) : (
                <span className="mt-4 text-sm font-semibold text-maple-600 group-hover:text-maple-500">
                  {item.cta} →
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
