import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { TuscanyCruisePlanner } from "@/components/TuscanyCruisePlanner";

const path = "/cruise-planner";
const description = 'Plan Tuscany from Livorno around your hours ashore.';

export const metadata = buildMetadata({
  title: 'Livorno Cruise Planner',
  description,
  path,
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: 'Livorno Cruise Planner', path },
];

export default function CruisePlannerPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema(breadcrumbs), webPageSchema({ title: 'Livorno Cruise Planner', description, path })]} />
      <PageHero title={'Livorno Cruise Planner'} subtitle={description} compact />
      <section className="section-padding">
        <div className="container-wide max-w-3xl">
          <Breadcrumbs items={breadcrumbs} />
          <TuscanyCruisePlanner />
        </div>
      </section>
    </>
  );
}
