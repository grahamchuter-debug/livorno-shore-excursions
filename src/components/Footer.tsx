import Link from "next/link";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-coastal-100 bg-coastal-900 text-white">
      <div className="container-wide px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-display text-lg font-semibold">{SITE.name}</p>
            <p className="mt-2 text-sm text-white/70">{SITE.tagline}</p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/60">Plan</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/shore-excursions" className="hover:text-white">Shore excursions</Link></li>
              <li><Link href="/ship-schedules/livorno" className="hover:text-white">Ship schedules</Link></li>
              <li><Link href="/cruise-planner" className="hover:text-white">Cruise planner</Link></li>
              <li><Link href="/cruise-port-guide" className="hover:text-white">Port guide</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/60">Site</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/enquire" className="hover:text-white">Enquire</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
            </ul>
          </div>
        </div>
        <p className="mt-8 text-xs text-white/50">© {new Date().getFullYear()} {SITE.name}. Independent cruise planning guidance for Livorno.</p>
      </div>
    </footer>
  );
}
