import Link from "next/link";
import { SITE } from "@/lib/site";
import { siteUrl } from "@/lib/paths";
import { excursions } from "@/data/excursions";

export const metadata = {
  alternates: { canonical: siteUrl("/") },
};

export default function HomePage() {
  return (
    <main>
      <section className="section-padding bg-gradient-to-b from-coastal-50 to-white">
        <div className="container-wide max-w-4xl">
          <p className="text-sm uppercase tracking-[0.14em] text-coastal-600">{SITE.tagline}</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-coastal-900 sm:text-5xl">{SITE.name}</h1>
          <p className="mt-4 text-lg text-gray-700">{SITE.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/cruise-planner" className="btn-accent">Plan My Day</Link>
            <Link href="/shore-excursions" className="btn-secondary">Shore Excursions</Link>
            <Link href="/ship-schedules/livorno">Ship Schedules</Link>
          </div>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-wide max-w-4xl">
          <h2 className="font-display text-2xl font-semibold text-coastal-900">Shore excursions</h2>
          <ul className="mt-6 space-y-2">
            {excursions.map((e) => (
              <li key={e.slug}>
                <Link href={`/shore-excursions/${e.slug}`} className="underline text-coastal-800">{e.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
