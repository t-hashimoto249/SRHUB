import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import type {
  Race,
  RaceFrontmatter,
  Report,
  ReportFrontmatter,
  Contributor,
  ContributorFrontmatter,
  GearEntry,
  Partner,
  PartnerFrontmatter,
} from "@/types/content";

const CONTENT_DIR = path.join(process.cwd(), "content");

async function renderMarkdown(body: string): Promise<string> {
  const processed = await remark().use(html).process(body);
  return processed.toString();
}

async function listMarkdownFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir);
  return entries.filter(
    (name) =>
      (name.endsWith(".md") || name.endsWith(".mdx")) && !name.startsWith("_"),
  );
}

async function readMarkdown<T>(filePath: string): Promise<{ data: T; body: string }> {
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = matter(raw);
  return { data: parsed.data as T, body: parsed.content };
}

function normalizeGear(raw: unknown): GearEntry[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  return raw.map((item): GearEntry => {
    if (typeof item === "string") {
      const trimmed = item.trim();
      const mandatory = trimmed.startsWith("必携");
      return { name: trimmed.replace(/^(必携|推奨)：\s*/, ""), mandatory };
    }
    return item as GearEntry;
  });
}

function normalizeDate(value: unknown): string {
  if (value instanceof Date) {
    const y = value.getUTCFullYear();
    const m = String(value.getUTCMonth() + 1).padStart(2, "0");
    const d = String(value.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return String(value ?? "");
}

export async function getAllRaces(): Promise<Race[]> {
  const dir = path.join(CONTENT_DIR, "races");
  const files = await listMarkdownFiles(dir);
  const races = await Promise.all(
    files.map(async (file) => {
      const { data, body } = await readMarkdown<RaceFrontmatter>(path.join(dir, file));
      const contentHtml = await renderMarkdown(body);
      const { gear, ...rest } = data;
      return { ...rest, gear: normalizeGear(gear), contentHtml } as Race;
    }),
  );
  return races.sort((a, b) => a.title.localeCompare(b.title, "ja"));
}

export async function getRaceBySlug(slug: string): Promise<Race | null> {
  const races = await getAllRaces();
  return races.find((race) => race.slug === slug) ?? null;
}

export async function getAllReports(): Promise<Report[]> {
  const dir = path.join(CONTENT_DIR, "reports");
  const files = await listMarkdownFiles(dir);
  const reports = await Promise.all(
    files.map(async (file) => {
      const { data, body } = await readMarkdown<ReportFrontmatter>(path.join(dir, file));
      const contentHtml = await renderMarkdown(body);
      return {
        ...data,
        race_slug: data.race_slug?.trim(),
        contributor: data.contributor?.trim(),
        slug: data.slug?.trim(),
        date: normalizeDate(data.date),
        contentHtml,
      };
    }),
  );
  return reports.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getReportsByRace(raceSlug: string): Promise<Report[]> {
  const reports = await getAllReports();
  return reports.filter((report) => report.race_slug === raceSlug);
}

export async function getReportBySlug(slug: string): Promise<Report | null> {
  const reports = await getAllReports();
  return reports.find((r) => r.slug === slug) ?? null;
}

export async function getAllContributors(): Promise<Contributor[]> {
  const dir = path.join(CONTENT_DIR, "contributors");
  const files = await listMarkdownFiles(dir);
  const contributors = await Promise.all(
    files.map(async (file) => {
      const { data, body } = await readMarkdown<ContributorFrontmatter>(path.join(dir, file));
      const contentHtml = await renderMarkdown(body);
      return { ...data, contentHtml };
    }),
  );
  return contributors;
}

export async function getContributorById(id: string): Promise<Contributor | null> {
  const contributors = await getAllContributors();
  return contributors.find((c) => c.id === id) ?? null;
}

export async function getAllPartners(): Promise<Partner[]> {
  const dir = path.join(CONTENT_DIR, "partners");
  let files: string[];
  try {
    files = await listMarkdownFiles(dir);
  } catch {
    return [];
  }
  const partners = await Promise.all(
    files.map(async (file) => {
      const { data, body } = await readMarkdown<PartnerFrontmatter>(path.join(dir, file));
      const contentHtml = await renderMarkdown(body);
      return { ...data, contentHtml };
    }),
  );
  // featured を先頭、その後カテゴリと名前で安定ソート
  return partners.sort((a, b) => {
    if (!!a.featured !== !!b.featured) return a.featured ? -1 : 1;
    if (a.category !== b.category) return a.category.localeCompare(b.category, "ja");
    return a.name.localeCompare(b.name, "ja");
  });
}
