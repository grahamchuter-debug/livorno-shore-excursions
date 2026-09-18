import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { SITE } from "@/lib/site";

const path = "/privacy";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: `Privacy policy for ${SITE.name} — how we handle information submitted through our enquiry form and site analytics.`,
  path,
  noindex: true,
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Privacy Policy", path },
];

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema(breadcrumbs), webPageSchema({ title: "Privacy Policy", description: `Privacy policy for ${SITE.name}.`, path })]} />
      <section className="section-padding">
        <div className="container-wide max-w-3xl">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="section-title mt-8">Privacy Policy</h1>
          <div className="mt-6 space-y-4 text-gray-700 leading-relaxed">
            <p>{SITE.name} ({SITE.url}) is an independent Tuscany cruise planning resource. This policy explains what information we collect and how we use it.</p>
            <p>When you submit our enquiry form, we receive your name, email address and message content solely to respond to your request. We do not sell personal data to third parties.</p>
            <p>Like most websites, we may use standard analytics to understand how visitors use our guides. You can contact us at {SITE.email} with any privacy questions.</p>
          </div>
        </div>
      </section>
    </>
  );
}
