"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import {
  REPORT_PURPOSE_LABEL,
  type ReportFrontmatter,
  type ReportPurpose,
} from "@/types/content";
import type { DisplayFont, Palette } from "./design-tokens";
import { MONTH_LABELS } from "./design-tokens";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { PurposeBadge } from "./PurposeBadge";
import styles from "./ReportListExplorer.module.css";

interface RaceLite {
  slug: string;
  title: string;
  title_en?: string;
  country: string;
  continent: string;
  start_month: number;
}

interface ContributorLite {
  id: string;
  name: string;
  avatar?: string;
}

const PURPOSES: ReportPurpose[] = ["completion", "competitive", "personal"];
const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function FilterGroup({
  label,
  palette,
  displayFont,
  children,
}: {
  label: string;
  palette: Palette;
  displayFont: DisplayFont;
  children: ReactNode;
}) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div
        style={{
          fontFamily: displayFont.stack,
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: palette.inkSoft,
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{children}</div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  palette,
  displayFont,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  palette: Palette;
  displayFont: DisplayFont;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "6px 12px",
        fontSize: 12,
        fontFamily: displayFont.stack,
        letterSpacing: "0.04em",
        border: `1px solid ${active ? palette.ink : palette.rule}`,
        background: active ? palette.ink : "transparent",
        color: active ? palette.paper : palette.ink,
        cursor: "pointer",
        borderRadius: 0,
      }}
    >
      {label}
    </button>
  );
}

export function ReportListExplorer({
  reports,
  races,
  contributors,
  palette,
  displayFont,
}: {
  reports: ReportFrontmatter[];
  races: RaceLite[];
  contributors: ContributorLite[];
  palette: Palette;
  displayFont: DisplayFont;
}) {
  const raceMap = useMemo(() => new Map(races.map((r) => [r.slug, r])), [races]);
  const contributorMap = useMemo(
    () => new Map(contributors.map((c) => [c.id, c])),
    [contributors],
  );

  const reportYears = useMemo(() => {
    const set = new Set<number>();
    for (const r of reports) {
      const y = Number(r.date?.slice(0, 4));
      if (Number.isFinite(y)) set.add(y);
    }
    return [...set].sort((a, b) => b - a);
  }, [reports]);

  const usedRaceSlugs = useMemo(() => {
    const set = new Set<string>();
    for (const r of reports) if (r.race_slug) set.add(r.race_slug);
    return set;
  }, [reports]);

  const usedContributorIds = useMemo(() => {
    const set = new Set<string>();
    for (const r of reports) if (r.contributor) set.add(r.contributor);
    return set;
  }, [reports]);

  const raceOptions = useMemo(
    () => races.filter((r) => usedRaceSlugs.has(r.slug)),
    [races, usedRaceSlugs],
  );
  const contributorOptions = useMemo(
    () => contributors.filter((c) => usedContributorIds.has(c.id)),
    [contributors, usedContributorIds],
  );

  const [keyword, setKeyword] = useState("");
  const [contributor, setContributor] = useState<string>("all");
  const [raceSlug, setRaceSlug] = useState<string>("all");
  const [purpose, setPurpose] = useState<ReportPurpose | "all">("all");
  const [reportYear, setReportYear] = useState<number | "all">("all");
  const [raceMonths, setRaceMonths] = useState<number[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);

  const activeFilterCount =
    (keyword ? 1 : 0) +
    (contributor !== "all" ? 1 : 0) +
    (raceSlug !== "all" ? 1 : 0) +
    (purpose !== "all" ? 1 : 0) +
    (reportYear !== "all" ? 1 : 0) +
    (raceMonths.length ? 1 : 0);

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return reports.filter((r) => {
      if (contributor !== "all" && r.contributor !== contributor) return false;
      if (raceSlug !== "all" && r.race_slug !== raceSlug) return false;
      if (purpose !== "all" && r.purpose !== purpose) return false;
      if (reportYear !== "all") {
        const y = Number(r.date?.slice(0, 4));
        if (y !== reportYear) return false;
      }
      if (raceMonths.length) {
        const race = raceMap.get(r.race_slug);
        if (!race || !raceMonths.includes(race.start_month)) return false;
      }
      if (kw) {
        const race = raceMap.get(r.race_slug);
        const contrib = contributorMap.get(r.contributor);
        const haystack = [
          r.title,
          r.summary,
          race?.title,
          race?.title_en,
          race?.country,
          contrib?.name,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(kw)) return false;
      }
      return true;
    });
  }, [reports, contributor, raceSlug, purpose, reportYear, raceMonths, keyword, raceMap, contributorMap]);

  const resetFilters = () => {
    setKeyword("");
    setContributor("all");
    setRaceSlug("all");
    setPurpose("all");
    setReportYear("all");
    setRaceMonths([]);
  };

  return (
    <div style={{ background: palette.bg, color: palette.ink, fontFamily: '"Noto Sans JP", sans-serif' }}>
      <SiteHeader palette={palette} displayFont={displayFont} variant="A" current="reports" />

      <section className={styles.heroSection}>
        <div className={styles.heroLabel} style={{ color: palette.inkSoft }}>
          Index · {filtered.length} of {reports.length} reports
        </div>
        <h1 className={styles.heroTitle} style={{ fontFamily: displayFont.stack }}>
          Reports
        </h1>
        <p
          style={{
            margin: "16px 0 0",
            maxWidth: 640,
            fontSize: 14,
            lineHeight: 1.8,
            color: palette.inkSoft,
          }}
        >
          完走、上位入賞、自分なりのテーマ。実際に走ったランナーが残した参加レポートを横断的に検索できます。
        </p>
      </section>

      <section className={styles.body}>
        <aside>
          <button
            type="button"
            className={styles.filterToggle}
            onClick={() => setFilterOpen((v) => !v)}
            style={{
              border: `1px solid ${palette.rule}`,
              color: palette.ink,
              fontFamily: displayFont.stack,
            }}
          >
            <span>Filter{activeFilterCount > 0 ? ` · ${activeFilterCount}` : ""}</span>
            <span style={{ fontSize: 16 }}>{filterOpen ? "−" : "+"}</span>
          </button>
          <div className={filterOpen ? "" : styles.filterPanelClosed}>
            <div
              className={styles.filterPanelInner}
              style={{ borderTop: `1px solid ${palette.rule}` }}
            >
              <FilterGroup label="Keyword" palette={palette} displayFont={displayFont}>
                <input
                  type="search"
                  placeholder="タイトル・要約・国名など"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className={styles.searchInput}
                  style={{
                    border: `1px solid ${palette.rule}`,
                    color: palette.ink,
                  }}
                />
              </FilterGroup>

              <FilterGroup label="Contributor" palette={palette} displayFont={displayFont}>
                <FilterChip
                  label="すべて"
                  active={contributor === "all"}
                  onClick={() => setContributor("all")}
                  palette={palette}
                  displayFont={displayFont}
                />
                {contributorOptions.map((c) => (
                  <FilterChip
                    key={c.id}
                    label={c.name}
                    active={contributor === c.id}
                    onClick={() => setContributor(c.id)}
                    palette={palette}
                    displayFont={displayFont}
                  />
                ))}
              </FilterGroup>

              <FilterGroup label="Race" palette={palette} displayFont={displayFont}>
                <FilterChip
                  label="すべて"
                  active={raceSlug === "all"}
                  onClick={() => setRaceSlug("all")}
                  palette={palette}
                  displayFont={displayFont}
                />
                {raceOptions.map((r) => (
                  <FilterChip
                    key={r.slug}
                    label={r.title_en ?? r.title}
                    active={raceSlug === r.slug}
                    onClick={() => setRaceSlug(r.slug)}
                    palette={palette}
                    displayFont={displayFont}
                  />
                ))}
              </FilterGroup>

              <FilterGroup label="Purpose" palette={palette} displayFont={displayFont}>
                <FilterChip
                  label="すべて"
                  active={purpose === "all"}
                  onClick={() => setPurpose("all")}
                  palette={palette}
                  displayFont={displayFont}
                />
                {PURPOSES.map((p) => (
                  <FilterChip
                    key={p}
                    label={REPORT_PURPOSE_LABEL[p]}
                    active={purpose === p}
                    onClick={() => setPurpose(p)}
                    palette={palette}
                    displayFont={displayFont}
                  />
                ))}
              </FilterGroup>

              <FilterGroup label="Report year" palette={palette} displayFont={displayFont}>
                <FilterChip
                  label="すべて"
                  active={reportYear === "all"}
                  onClick={() => setReportYear("all")}
                  palette={palette}
                  displayFont={displayFont}
                />
                {reportYears.map((y) => (
                  <FilterChip
                    key={y}
                    label={String(y)}
                    active={reportYear === y}
                    onClick={() => setReportYear(y)}
                    palette={palette}
                    displayFont={displayFont}
                  />
                ))}
              </FilterGroup>

              <FilterGroup label="Race month" palette={palette} displayFont={displayFont}>
                {MONTHS.map((m) => (
                  <FilterChip
                    key={m}
                    label={MONTH_LABELS[m]}
                    active={raceMonths.includes(m)}
                    onClick={() =>
                      setRaceMonths((s) =>
                        s.includes(m) ? s.filter((x) => x !== m) : [...s, m],
                      )
                    }
                    palette={palette}
                    displayFont={displayFont}
                  />
                ))}
              </FilterGroup>

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  style={{
                    fontFamily: displayFont.stack,
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    background: "transparent",
                    border: "none",
                    color: palette.inkSoft,
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  ↺ Reset filters
                </button>
              )}
            </div>
          </div>
        </aside>

        <div className={styles.reportGrid}>
          {filtered.map((r, i) => {
            const race = raceMap.get(r.race_slug);
            const contrib = contributorMap.get(r.contributor);
            return (
              <Link
                key={r.slug}
                href={`/races/${r.race_slug}/reports/${r.slug}`}
                className={styles.reportRow}
                style={{
                  borderTop: i === 0 ? `1px solid ${palette.rule}` : undefined,
                  borderBottom: `1px solid ${palette.rule}`,
                }}
              >
                <div
                  className={styles.reportThumb}
                  style={{
                    backgroundImage: r.hero_image ? `url(${r.hero_image})` : undefined,
                    background: r.hero_image ? undefined : palette.bgAlt,
                  }}
                />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ marginBottom: 12 }}>
                    <PurposeBadge purpose={r.purpose} displayFont={displayFont} />
                  </div>
                  <h3 className={styles.reportTitle} style={{ color: palette.ink }}>
                    {r.title}
                  </h3>
                  <p className={styles.reportSummary} style={{ color: palette.inkSoft }}>
                    {r.summary}
                  </p>
                  <div className={styles.reportMeta} style={{ color: palette.inkSoft, marginTop: "auto" }}>
                    <span>@{contrib?.name ?? r.contributor}</span>
                    <span>·</span>
                    <span>{race?.title_en ?? race?.title ?? r.race_slug}</span>
                    {race && (
                      <>
                        <span>·</span>
                        <span>
                          {race.country} / {MONTH_LABELS[race.start_month]}
                        </span>
                      </>
                    )}
                    <span>·</span>
                    <span>{r.date}</span>
                  </div>
                </div>
              </Link>
            );
          })}
          {!filtered.length && (
            <div className={styles.empty} style={{ color: palette.inkSoft }}>
              該当するレポートがありません
            </div>
          )}
        </div>
      </section>

      <SiteFooter palette={palette} displayFont={displayFont} />
    </div>
  );
}
