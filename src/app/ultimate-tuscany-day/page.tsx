import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE } from "@/lib/site";
import { defaultOpenGraph } from "@/lib/seo";

const TITLE = "🏆 Ultimate Tuscany Day";
const BODY = "Florence and Pisa in one unhurried day \u2014 the experience our editors would genuinely recommend to a first-time cruise passenger wanting the very best of Tuscany.";

export const metadata = {
  title: TITLE + " | " + SITE.name,
  description: "Our Signature Experience for Livorno cruise passengers — Florence and Pisa in one carefully planned day, maximum 8 guests, timed for your ship with return-to-ship confidence.",
  alternates: { canonical: `${SITE.url}/ultimate-tuscany-day` },
  openGraph: { ...defaultOpenGraph, url: `${SITE.url}/ultimate-tuscany-day` },
};

export default function Page() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: TITLE, path: "/ultimate-tuscany-day" },
  ];
  return (
    <section className="section-padding">
      <div className="container-wide max-w-4xl">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="mt-2 font-display text-4xl font-semibold text-coastal-900">{TITLE}</h1>
        <div className="prose-body mt-6">
          <p>{BODY}</p>
        </div>
      </div>
    </section>
  );
}
