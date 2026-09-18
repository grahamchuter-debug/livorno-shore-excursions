import Link from "next/link";
import type { EditorialRecommendation } from "@/data/types";
import { getEditorialLabel } from "@/data/editorial";
import { SignatureExperienceBadge } from "@/components/SignatureExperienceBadge";

export function EditorialRecommendations({
  recommendations,
  title = "Editorial recommendations",
}: {
  recommendations: EditorialRecommendation[];
  title?: string;
}) {
  if (!recommendations.length) return null;
  return (
    <section className="mt-10">
      <h2 className="section-title text-2xl mb-6">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {recommendations.map((rec) => {
          const cardClass = rec.signature
            ? "card-signature group block"
            : "card-accent group block p-5";

          return (
            <Link key={rec.href + rec.title} href={rec.href} className={cardClass}>
              {rec.signature ? (
                <SignatureExperienceBadge showEditorsChoice />
              ) : (
                <p className="text-xs font-semibold uppercase tracking-wide text-maple-600">
                  {getEditorialLabel(rec.category)}
                </p>
              )}
              <h3 className={`font-display text-base font-bold text-gray-900 group-hover:text-coastal-800 ${rec.signature ? "mt-4" : "mt-1"}`}>
                {rec.title}
              </h3>
              <p className={`text-sm text-gray-600 ${rec.signature ? "mt-2" : "mt-2"}`}>{rec.description}</p>
              {rec.signature && (
                <span className="mt-4 inline-block text-sm font-semibold text-maple-600 group-hover:text-maple-500">
                  View Signature Experience →
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
