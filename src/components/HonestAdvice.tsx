import Link from "next/link";

export function HonestAdvice() {
  return (
    <section className="section-padding bg-white">
      <div className="container-wide max-w-4xl">
        <p className="section-eyebrow">Honest advice</p>
        <h2 className="section-title mt-2">Florence or Cinque Terre?</h2>
        <p className="section-subtitle">
          The question every Livorno cruise passenger asks. There is no wrong answer — we help you choose
          the Tuscany that suits your day.
        </p>

        <div className="mt-10 space-y-8">
          <div className="card-feature">
            <h3 className="font-display text-xl font-bold text-gray-900">
              If you have never seen Florence, it deserves serious consideration
            </h3>
            <p className="mt-3 text-gray-700 leading-relaxed">
              Florence is the cradle of the Renaissance — a city where art, architecture and history collide
              on every corner. For many cruise passengers, this is the once-in-a-lifetime day:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-maple-600 mt-0.5">→</span>
                <span>
                  <strong>UNESCO World Heritage centre</strong> — Duomo, Baptistery and Piazza della Signoria
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-maple-600 mt-0.5">→</span>
                <span>
                  <strong>Renaissance masterpieces</strong> — the Uffizi, Ponte Vecchio and centuries of art
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-maple-600 mt-0.5">→</span>
                <span>
                  <strong>Ideal for first-time visitors</strong> — a destination worth the coach journey inland
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-maple-600 mt-0.5">→</span>
                <span>
                  <strong>Combine with Pisa</strong> — Florence &amp; Pisa in one day is possible on longer calls
                </span>
              </li>
            </ul>
          </div>

          <div className="card-accent">
            <h3 className="font-display text-xl font-bold text-gray-900">
              But Cinque Terre can be every bit as magical
            </h3>
            <p className="mt-3 text-gray-700 leading-relaxed">
              Five villages clinging to the Ligurian cliffs — colourful, coastal and utterly unlike anywhere
              else in Italy. If you prefer scenery over museums, Cinque Terre delivers brilliantly:
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-coastal-600">✓</span> Manarola &amp; Vernazza harbours
              </li>
              <li className="flex items-center gap-2">
                <span className="text-coastal-600">✓</span> Coastal train through the villages
              </li>
              <li className="flex items-center gap-2">
                <span className="text-coastal-600">✓</span> Cliffside walking paths
              </li>
              <li className="flex items-center gap-2">
                <span className="text-coastal-600">✓</span> Fresh seafood and local Sciacchetrà wine
              </li>
              <li className="flex items-center gap-2">
                <span className="text-coastal-600">✓</span> Photography at every turn
              </li>
              <li className="flex items-center gap-2">
                <span className="text-coastal-600">✓</span> Closer to Livorno than Florence
              </li>
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              On a standard 8-hour call, Cinque Terre is often the more relaxed choice — less coach time,
              more time on the coast. We say that because it is true.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/compare/florence-vs-cinque-terre" className="btn-secondary text-sm">
            Florence or Cinque Terre?
          </Link>
          <Link href="/compare/is-pisa-worth-visiting" className="btn-secondary text-sm">
            Is Pisa worth visiting?
          </Link>
          <Link href="/compare/florence-and-pisa-in-one-day" className="btn-secondary text-sm">
            Florence &amp; Pisa in one day?
          </Link>
        </div>
      </div>
    </section>
  );
}
