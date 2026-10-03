import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE } from "@/lib/site";
import { defaultOpenGraph } from "@/lib/seo";

export const metadata = {
  title: "About",
  description: SITE.description,
  alternates: { canonical: `${SITE.url}/about` },
  openGraph: { ...defaultOpenGraph, url: `${SITE.url}/about` },
};

export default function AboutPage() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ];
  return (
    <section className="section-padding">
      <div className="container-wide max-w-3xl">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="mt-2 font-display text-4xl font-semibold text-coastal-900">About {SITE.name}</h1>
        <div className="prose-body mt-6">
          <p>{SITE.description}</p>
          <p>Independent cruise planning guidance. We help passengers choose the best version of their day ashore.</p>
        </div>
      </div>
    </section>
  );
}
