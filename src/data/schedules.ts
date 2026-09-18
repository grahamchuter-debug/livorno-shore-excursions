import type { ScheduleEntry, ShipSchedulePort } from "./types";
import {
  filterEntriesByMonth,
  filterEntriesByYear,
  getMonthsWithEntries,
  type ScheduleYear,
} from "@/lib/schedule-utils";
import livornoSchedule from "./imported-schedules/livorno.json";
import {
  FUTURE_2028_SCHEDULE_NOTE,
  PARTIAL_YEAR_SCHEDULE_NOTE,
  SCHEDULE_COVERAGE_NOTE,
} from "./schedule-wording";

const SCHEDULE_FAQS = [
  {
    question: "How accurate are Livorno cruise ship schedules?",
    answer:
      "Schedules are compiled from published itineraries and updated as new calls are confirmed. Times can change — always confirm with your cruise line before booking excursions.",
  },
  {
    question: "Should I treat published times as final?",
    answer:
      "No. Confirm arrival, departure and all-aboard with your cruise line before locking transfers or long excursions.",
  },
];

const SCHEDULE_TIPS = [
  "Confirm published arrival and departure times with your cruise line before locking plans",
  "Check how many ships share your port day before booking popular excursions",
  "Leave a sensible return buffer to the ship — do not plan to the published sailing minute",
];

export const schedulePorts: ShipSchedulePort[] = [
  {
    slug: "livorno",
    name: "Livorno",
    country: "Italy",
    seoTitle: "Livorno Cruise Ship Schedule — Tuscany Port Calls",
    metaDescription: "Livorno cruise ship schedule — plan Florence, Pisa and Tuscany shore excursions around published arrival and departure times.",
    intro: "Livorno is a primary Tuscany cruise gateway. Check scheduled arrivals and departures before booking Florence or countryside excursions.",
    description: "Tuscany cruise gateway — Florence, Pisa, Lucca and wine country from the Livorno terminals.",
    scheduleOverview: "Schedule data will be synced from authority. Verified rows appear here once imported.",
    planningTips: SCHEDULE_TIPS,
    faqs: SCHEDULE_FAQS,
  },
];

export { FUTURE_2028_SCHEDULE_NOTE, PARTIAL_YEAR_SCHEDULE_NOTE, SCHEDULE_COVERAGE_NOTE };

const scheduleData: Record<string, ScheduleEntry[]> = {
  "livorno": livornoSchedule as ScheduleEntry[],
};

export function getSchedulePortBySlug(slug: string): ShipSchedulePort | undefined {
  return schedulePorts.find((p) => p.slug === slug);
}

export function getAllSchedulePortSlugs(): string[] {
  return schedulePorts.map((p) => p.slug);
}

export function getScheduleEntries(slug: string): ScheduleEntry[] {
  return scheduleData[slug] ?? [];
}

export function getScheduleEntryCount(slug: string): number {
  return getScheduleEntries(slug).length;
}

export function getScheduleEntriesForYear(slug: string, year: ScheduleYear): ScheduleEntry[] {
  return filterEntriesByYear(getScheduleEntries(slug), year);
}

export function getScheduleEntriesForMonth(slug: string, monthKey: string): ScheduleEntry[] {
  return filterEntriesByMonth(getScheduleEntries(slug), monthKey);
}

export function getVerifiedMonthKeys(slug: string): string[] {
  return getMonthsWithEntries(getScheduleEntries(slug));
}

export function searchSchedulesByShip(query: string): { portSlug: string; entries: ScheduleEntry[] }[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: { portSlug: string; entries: ScheduleEntry[] }[] = [];
  for (const port of schedulePorts) {
    const matches = getScheduleEntries(port.slug).filter(
      (e) =>
        e.ship.toLowerCase().includes(q) ||
        e.cruiseLine.toLowerCase().includes(q) ||
        e.date.includes(q),
    );
    if (matches.length) results.push({ portSlug: port.slug, entries: matches });
  }
  return results;
}

export function getTodayTomorrowEntries(slug: string): { today: ScheduleEntry[]; tomorrow: ScheduleEntry[] } {
  const entries = getScheduleEntries(slug);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return {
    today: entries.filter((e) => e.date === fmt(today)),
    tomorrow: entries.filter((e) => e.date === fmt(tomorrow)),
  };
}
