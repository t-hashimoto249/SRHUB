import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import type {
  Race,
  RaceFrontmatter,
  RaceVideo,
  Report,
  ReportFrontmatter,
  Contributor,
  ContributorFrontmatter,
  GearEntry,
  Partner,
  PartnerFrontmatter,
} from "@/types/content";

const CONTENT_DIR = path.join(process.cwd(), "content");

const oembedCache = new Map<string, Promise<{ title?: string; channel?: string; channelUrl?: string }>>();

async function fetchYouTubeOEmbed(
  id: string,
): Promise<{ title?: string; channel?: string; channelUrl?: string }> {
  const cached = oembedCache.get(id);
  if (cached) return cached;
  const promise = (async () => {
    try {
      const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(
        `https://www.youtube.com/watch?v=${id}`,
      )}&format=json`;
      const res = await fetch(url);
      if (!res.ok) return {};
      const data = (await res.json()) as {
        title?: string;
        author_name?: string;
        author_url?: string;
      };
      return { title: data.title, channel: data.author_name, channelUrl: data.author_url };
    } catch {
      return {};
    }
  })();
  oembedCache.set(id, promise);
  return promise;
}

async function resolveRaceVideos(
  videos: RaceVideo[] | undefined,
): Promise<RaceVideo[] | undefined> {
  if (!videos?.length) return videos;
  return Promise.all(
    videos.map(async (v) => {
      if (v.title && v.channel) return v;
      const fetched = await fetchYouTubeOEmbed(v.id);
      return {
        ...v,
        title: v.title ?? fetched.title,
        channel: v.channel ?? fetched.channel,
        channelUrl: v.channelUrl ?? fetched.channelUrl,
      };
    }),
  );
}

const MEDIA_MARKER_RE = /\[(動画|写真)[：:]\s*([^\]]+?)\]:?/g;

function normalizeMediaPath(raw: string): string {
  let p = raw.trim();
  p = p.replace(/^\.?\/?web\/public\//, "/");
  p = p.replace(/^public\//, "/");
  if (!/^https?:\/\//.test(p) && !p.startsWith("/")) p = "/" + p;
  return p;
}

function captionFromPath(p: string): string {
  let base = p.split("/").pop() ?? "";
  try {
    base = decodeURIComponent(base);
  } catch {
    // 既にデコード済みなどで失敗した場合はそのまま
  }
  return base.replace(/\.[^.]+$/, "");
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderMediaHtml(kind: "動画" | "写真", src: string, caption: string): string {
  const safeSrc = escapeAttr(src);
  const safeCap = escapeHtml(caption);
  if (kind === "動画") {
    return (
      `<figure class="report-media report-media-video">` +
      `<video controls preload="metadata" playsinline>` +
      `<source src="${safeSrc}">` +
      `お使いのブラウザでは動画を再生できません。` +
      `</video>` +
      `<figcaption>${safeCap}</figcaption>` +
      `</figure>`
    );
  }
  return (
    `<figure class="report-media report-media-photo">` +
    `<a href="${safeSrc}" target="_blank" rel="noopener noreferrer">` +
    `<img src="${safeSrc}" alt="${safeCap}" loading="lazy">` +
    `</a>` +
    `<figcaption>${safeCap}</figcaption>` +
    `</figure>`
  );
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractMediaMarkers(body: string): {
  body: string;
  replacements: Map<string, string>;
} {
  const replacements = new Map<string, string>();
  let i = 0;
  const out = body.replace(MEDIA_MARKER_RE, (_match, kind: string, rawPath: string) => {
    const token = `MEDIAPLACEHOLDER${i++}TOKEN`;
    const src = normalizeMediaPath(rawPath);
    const caption = captionFromPath(src);
    replacements.set(token, renderMediaHtml(kind as "動画" | "写真", src, caption));
    return token;
  });
  return { body: out, replacements };
}

function applyMediaReplacements(htmlOut: string, replacements: Map<string, string>): string {
  if (replacements.size === 0) return htmlOut;
  const tokens = Array.from(replacements.keys()).map(escapeRegExp).join("|");
  // 連続するプレースホルダのみを含む <p>...</p> は囲みを外して block 化する
  const paragraphRE = new RegExp(
    `<p>\\s*((?:(?:${tokens})(?:\\s|<br\\s*/?>)*)+)</p>`,
    "g",
  );
  let out = htmlOut.replace(paragraphRE, (_, inner: string) => inner);
  for (const [token, replacement] of replacements) {
    out = out.split(token).join(replacement);
  }
  return out;
}

async function renderMarkdown(body: string): Promise<string> {
  const { body: prepared, replacements } = extractMediaMarkers(body);
  const processed = await remark().use(html).process(prepared);
  return applyMediaReplacements(processed.toString(), replacements);
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
      const { gear, videos, ...rest } = data;
      const resolvedVideos = await resolveRaceVideos(videos);
      return {
        ...rest,
        gear: normalizeGear(gear),
        videos: resolvedVideos,
        contentHtml,
      } as Race;
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
