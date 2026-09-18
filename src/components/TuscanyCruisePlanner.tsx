"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { jsPDF } from "jspdf";
import {
  generateTuscanyPlan,
  INTEREST_OPTIONS,
  type PlannerInput,
  type PlannerResult,
} from "@/data/planner";
import { getScheduleEntries } from "@/data/schedules";
import { getEntriesForDate } from "@/lib/schedule-utils";
import type { ScheduleEntry } from "@/data/types";

function Section({ title, links }: { title: string; links: PlannerResult["excursions"] }) {
  if (!links.length) return null;
  return (
    <section>
      <h3 className="section-title text-xl mb-4">{title}</h3>
      <div className="grid gap-3">
        {links.map((l) => (
          <Link key={l.href + l.label} href={l.href} className="card-editorial group block p-5">
            <p className="font-display text-base font-bold text-gray-900 group-hover:text-coastal-800">{l.label}</p>
            <p className="mt-1 text-sm text-gray-600">{l.why}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function realTime(value: string | undefined): string {
  const v = (value || "").trim();
  if (!v || v === "00:00" || v === "0:00") return "";
  return v;
}

export function TuscanyCruisePlanner() {
  const schedule = useMemo(() => getScheduleEntries("livorno"), []);
  const dates = useMemo(
    () => [...new Set(schedule.map((e) => e.date))].sort(),
    [schedule],
  );

  const [callDate, setCallDate] = useState("");
  const [shipName, setShipName] = useState("");
  const [manualTimes, setManualTimes] = useState(false);
  const [arrivalTime, setArrivalTime] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [adults, setAdults] = useState("2");
  const [children, setChildren] = useState("0");
  const [interests, setInterests] = useState<string[]>(["florence", "coastal"]);
  const [mobility, setMobility] = useState<PlannerInput["mobility"]>("full");
  const [budget, setBudget] = useState<PlannerInput["budget"]>("mid");
  const [travelStyle, setTravelStyle] = useState<PlannerInput["travelStyle"]>("guided");
  const [plan, setPlan] = useState<PlannerResult | null>(null);

  const shipsOnDate: ScheduleEntry[] = useMemo(() => {
    if (!callDate) return [];
    return getEntriesForDate(schedule, callDate);
  }, [schedule, callDate]);

  function applyShipSelection(date: string, ship: string) {
    setCallDate(date);
    setShipName(ship);
    const matches = getEntriesForDate(schedule, date).filter((e) => e.ship === ship);
    if (matches.length === 1) {
      const a = realTime(matches[0].arrival);
      const d = realTime(matches[0].departure);
      setArrivalTime(a);
      setDepartureTime(d);
      setManualTimes(!(a && d));
    } else if (matches.length > 1) {
      // Multiple windows same ship/date — leave choose / manual
      setArrivalTime("");
      setDepartureTime("");
      setManualTimes(true);
    } else {
      setArrivalTime("");
      setDepartureTime("");
      setManualTimes(true);
    }
  }

  function onDateChange(date: string) {
    setCallDate(date);
    setShipName("");
    setArrivalTime("");
    setDepartureTime("");
    setPlan(null);
    const matches = date ? getEntriesForDate(schedule, date) : [];
    if (matches.length === 1) {
      applyShipSelection(date, matches[0].ship);
    } else if (matches.length === 0) {
      setManualTimes(true);
    } else {
      setManualTimes(false);
    }
  }

  function onShipChange(ship: string) {
    if (!callDate) return;
    if (!ship) {
      setShipName("");
      setArrivalTime("");
      setDepartureTime("");
      setManualTimes(true);
      return;
    }
    applyShipSelection(callDate, ship);
  }

  function toggleInterest(id: string) {
    setInterests((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  }

  function generate() {
    setPlan(
      generateTuscanyPlan({
        arrivalTime: realTime(arrivalTime) || undefined,
        departureTime: realTime(departureTime) || undefined,
        adults: Number(adults) || 1,
        children: Number(children) || 0,
        interests,
        mobility,
        budget,
        travelStyle,
      }),
    );
  }

  function downloadPdf() {
    if (!plan) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(plan.headline, 20, 20);
    doc.setFontSize(10);
    let y = 30;
    const write = (text: string, indent = 20) => {
      const lines = doc.splitTextToSize(text, 200 - indent);
      doc.text(lines, indent, y);
      y += lines.length * 5 + 2;
      if (y > 275) {
        doc.addPage();
        y = 20;
      }
    };
    write(plan.summary);
    y += 2;
    const block = (title: string, items: { label: string; why: string }[]) => {
      if (!items.length) return;
      doc.setFont("helvetica", "bold");
      write(title);
      doc.setFont("helvetica", "normal");
      items.forEach((item) => write(`• ${item.label} — ${item.why}`, 24));
    };
    block("Excursions", plan.excursions);
    block("Transfers", plan.transfers);
    block("Logistics", plan.logistics);
    doc.setFont("helvetica", "bold");
    write("Your day plan");
    doc.setFont("helvetica", "normal");
    plan.dayPlan.forEach((s) => write(`${s.time}: ${s.text}`, 24));
    doc.save("tuscany-cruise-plan.pdf");
  }

  const noMatch = Boolean(callDate) && shipsOnDate.length === 0;

  return (
    <div className="card-feature">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Port call date</label>
          <input
            type="date"
            value={callDate}
            onChange={(e) => onDateChange(e.target.value)}
            list="livorno-call-dates"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <datalist id="livorno-call-dates">
            {dates.map((d) => (
              <option key={d} value={d} />
            ))}
          </datalist>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ship</label>
          <select
            value={shipName}
            onChange={(e) => onShipChange(e.target.value)}
            disabled={!callDate || shipsOnDate.length === 0}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-50"
          >
            <option value="">
              {!callDate
                ? "Choose a date first"
                : shipsOnDate.length === 0
                  ? "No published match — enter times manually"
                  : shipsOnDate.length === 1
                    ? shipsOnDate[0].ship
                    : "Choose your ship"}
            </option>
            {shipsOnDate.map((e) => (
              <option key={`${e.date}-${e.ship}`} value={e.ship}>
                {e.ship} ({e.cruiseLine})
              </option>
            ))}
          </select>
        </div>

        {(manualTimes || noMatch || !callDate) && (
          <div className="sm:col-span-2 rounded-lg border border-amber-100 bg-amber-50/80 px-3 py-2 text-xs text-amber-950">
            {noMatch
              ? "No published ship for that date — enter arrival and departure manually."
              : manualTimes && shipName
                ? "Published times are incomplete for this call — enter times manually or confirm with your cruise line."
                : "Select your date and ship to pre-fill published times, or enter times manually."}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Arrival time (local)</label>
          <input
            type="time"
            value={arrivalTime}
            onChange={(e) => {
              setArrivalTime(e.target.value);
              setManualTimes(true);
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Departure / all-aboard time</label>
          <input
            type="time"
            value={departureTime}
            onChange={(e) => {
              setDepartureTime(e.target.value);
              setManualTimes(true);
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
          <input type="number" min={1} max={20} value={adults} onChange={(e) => setAdults(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
          <input type="number" min={0} max={20} value={children} onChange={(e) => setChildren(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => toggleInterest(o.id)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${interests.includes(o.id) ? "bg-coastal-800 text-white" : "bg-white text-coastal-800 border border-coastal-200 hover:bg-coastal-50"}`}
                aria-pressed={interests.includes(o.id)}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mobility</label>
          <select value={mobility} onChange={(e) => setMobility(e.target.value as PlannerInput["mobility"])} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option value="full">Happy to walk a lot</option>
            <option value="some">Some walking is fine</option>
            <option value="limited">Limited mobility</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
          <select value={budget} onChange={(e) => setBudget(e.target.value as PlannerInput["budget"])} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option value="budget">Budget</option>
            <option value="mid">Mid-range</option>
            <option value="premium">Premium</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">DIY or guided?</label>
          <select value={travelStyle} onChange={(e) => setTravelStyle(e.target.value as PlannerInput["travelStyle"])} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option value="guided">Prefer guided</option>
            <option value="diy">Prefer DIY / independent</option>
          </select>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={generate} className="btn-primary">Build my Tuscany plan</button>
        {plan && <button type="button" onClick={downloadPdf} className="btn-secondary">Download PDF</button>}
        <Link href="/ship-schedules/livorno" className="btn-secondary">Browse ship schedules</Link>
      </div>

      {plan && (
        <div className="mt-8 space-y-8">
          <div className="rounded-xl border border-coastal-200 bg-coastal-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-maple-600">Editorial recommendation</p>
            <h3 className="font-display text-xl font-bold text-gray-900 mt-1">{plan.headline}</h3>
            <p className="mt-2 text-sm text-gray-700 leading-relaxed">{plan.summary}</p>
          </div>
          <Section title="Recommended shore excursions" links={plan.excursions} />
          {plan.transfers.length > 0 && <Section title="Port & transport" links={plan.transfers} />}
          <Section title="Keep planning" links={plan.logistics} />
          <section>
            <h3 className="section-title text-xl mb-4">Your day plan</h3>
            <ol className="relative space-y-4 border-l border-coastal-200 pl-6">
              {plan.dayPlan.map((s, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-coastal-600" aria-hidden="true" />
                  <p className="text-xs font-semibold uppercase tracking-wide text-coastal-700">{s.time}</p>
                  <p className="mt-1 text-sm text-gray-700">{s.text}</p>
                </li>
              ))}
            </ol>
          </section>
          <p className="text-xs text-gray-500">Guidance is indicative — always confirm your ship&apos;s all-aboard time and build a 60–90 minute return buffer. Summer motorway traffic from Florence can add 20–30 minutes.</p>
        </div>
      )}
    </div>
  );
}
