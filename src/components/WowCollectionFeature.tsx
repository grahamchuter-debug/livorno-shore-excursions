import Link from "next/link";
import { subjectImages } from "@/lib/images";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { WOW_COLLECTION_PATH } from "@/data/wow-collection";

export function WowCollectionFeature() {
  const image = subjectImages["cinque-terre"];

  return (
    <section className="section-padding bg-coastal-900 text-white">
      <div className="container-wide">
        <div className="card-signature grid gap-0 overflow-hidden border-white/10 bg-white/5 lg:grid-cols-2">
          <div className="relative min-h-[280px] lg:min-h-full">
            <ResponsiveImage
              image={image}
              role="card"
              className="absolute inset-0 block h-full w-full"
              imgClassName="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-coastal-900/80 via-coastal-900/40 to-transparent lg:bg-gradient-to-t lg:from-coastal-900/70 lg:via-transparent lg:to-transparent"
              aria-hidden="true"
            />
            <span className="absolute left-6 top-6 inline-flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-amber-400/10 px-3 py-1 text-xs font-semibold tracking-wide text-amber-300">
              ✨ In preparation
            </span>
          </div>

          <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
            <p className="section-eyebrow text-coastal-200">A brand within your brand</p>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl mt-1">
              The Wow Collection
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/85 italic">
              &ldquo;A hand-picked collection of exclusive small-group shore excursions designed from scratch
              with local experts. Smaller groups. Better experiences. Available only through our network.&rdquo;
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Not just a single tour — a curated collection built for passengers who want Tuscany and
              Cinque Terre done properly. Every Wow Collection experience is designed with local experts,
              capped at small group sizes, and timed around your ship with return-to-ship confidence built in.
            </p>

            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {[
                { emoji: "👥", text: "Maximum 8 guests per departure" },
                { emoji: "🎯", text: "Designed from scratch with local experts" },
                { emoji: "⏰", text: "Cruise-timed with explicit return buffers" },
                { emoji: "🔒", text: "Exclusive to our partner network" },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-2 text-sm text-white/80">
                  <span aria-hidden="true">{item.emoji}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={WOW_COLLECTION_PATH} className="btn-accent">
                Explore The Wow Collection →
              </Link>
              <Link
                href="/enquire"
                className="btn-secondary border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                Register interest
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
