import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { absoluteUrl } from "@/lib/paths";
import { getAllExcursionSlugs } from "@/data/excursions";
import { getAllSchedulePortSlugs, getVerifiedMonthKeys } from "@/data/schedules";
import { SCHEDULE_YEARS, portYearPath, portMonthPath } from "@/lib/schedule-utils";
import { getAllGuideSlugs } from "@/lib/guides";
import { getAllComparisonSlugs } from "@/data/comparisons";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = ["/","/shore-excursions","/guides","/compare","/cruise-port-guide","/cruise-planner","/ship-schedules","/ultimate-tuscany-day","/faq","/about","/enquire","/privacy","/terms"];

  const dynamicPages = [
    ...getAllExcursionSlugs().map((s) => `/shore-excursions/${s}`),
    ...getAllGuideSlugs().map((s) => `/guides/${s}`),
    ...getAllComparisonSlugs().map((s) => `/compare/${s}`),
    ...getAllSchedulePortSlugs().map((s) => `/ship-schedules/${s}`),
    ...getAllSchedulePortSlugs().flatMap((s) => SCHEDULE_YEARS.map((y) => portYearPath(s, y))),
    ...getAllSchedulePortSlugs().flatMap((s) =>
      getVerifiedMonthKeys(s).map((mk) => portMonthPath(s, mk)),
    ),
  ];

  return [...staticPages, ...dynamicPages].map((path) => ({
    url: absoluteUrl(SITE.url, path).replace(/\/?$/, "/"),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));
}
