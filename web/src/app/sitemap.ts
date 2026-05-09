import type { MetadataRoute } from "next";
import { getAllRaces, getAllReports } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticPaths: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/about", priority: 0.8 },
    { path: "/disclosure", priority: 0.5 },
    { path: "/partners", priority: 0.6 },
    { path: "/races", priority: 0.9 },
    { path: "/reports", priority: 0.8 },
  ];

  const [races, reports] = await Promise.all([getAllRaces(), getAllReports()]);

  return [
    ...staticPaths.map(({ path, priority }) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority,
    })),
    ...races.map((r) => ({
      url: `${base}/races/${r.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...reports
      .filter((rep) => rep.race_slug && rep.slug)
      .map((rep) => ({
        url: `${base}/races/${rep.race_slug}/reports/${rep.slug}`,
        lastModified: rep.date ? new Date(`${rep.date}T00:00:00Z`) : now,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
  ];
}
