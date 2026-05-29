"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import type { DisplayFont, Palette } from "./design-tokens";
import { MONTH_LABELS } from "./design-tokens";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import styles from "./VideoListExplorer.module.css";

export interface VideoItem {
  id: string;
  title?: string;
  channel?: string;
  channelUrl?: string;
  raceSlug: string;
  raceTitle: string;
  raceTitleEn?: string;
  country: string;
  continent: string;
  startMonth: number;
}

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

export function VideoListExplorer({
  videos,
  palette,
  displayFont,
}: {
  videos: VideoItem[];
  palette: Palette;
  displayFont: DisplayFont;
}) {
  const raceOptions = useMemo(() => {
    const map = new Map<string, { slug: string; label: string }>();
    for (const v of videos) {
      if (!map.has(v.raceSlug)) {
        map.set(v.raceSlug, { slug: v.raceSlug, label: v.raceTitleEn ?? v.raceTitle });
      }
    }
    return [...map.values()].sort((a, b) => a.label.localeCompare(b.label, "ja"));
  }, [videos]);

  const continentOptions = useMemo(() => {
    const set = new Set<string>();
    for (const v of videos) if (v.continent) set.add(v.continent);
    return [...set].sort((a, b) => a.localeCompare(b, "ja"));
  }, [videos]);

  const [keyword, setKeyword] = useState("");
  const [raceSlug, setRaceSlug] = useState<string>("all");
  const [continent, setContinent] = useState<string>("all");
  const [raceMonths, setRaceMonths] = useState<number[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);

  const activeFilterCount =
    (keyword ? 1 : 0) +
    (raceSlug !== "all" ? 1 : 0) +
    (continent !== "all" ? 1 : 0) +
    (raceMonths.length ? 1 : 0);

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return videos.filter((v) => {
      if (raceSlug !== "all" && v.raceSlug !== raceSlug) return false;
      if (continent !== "all" && v.continent !== continent) return false;
      if (raceMonths.length && !raceMonths.includes(v.startMonth)) return false;
      if (kw) {
        const haystack = [
          v.title,
          v.channel,
          v.raceTitle,
          v.raceTitleEn,
          v.country,
          v.continent,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(kw)) return false;
      }
      return true;
    });
  }, [videos, raceSlug, continent, raceMonths, keyword]);

  const resetFilters = () => {
    setKeyword("");
    setRaceSlug("all");
    setContinent("all");
    setRaceMonths([]);
  };

  return (
    <div style={{ background: palette.bg, color: palette.ink, fontFamily: '"Noto Sans JP", sans-serif' }}>
      <SiteHeader palette={palette} displayFont={displayFont} variant="A" current="videos" />

      <section className={styles.heroSection}>
        <div className={styles.heroLabel} style={{ color: palette.inkSoft }}>
          Index · {filtered.length} of {videos.length} videos
        </div>
        <h1 className={styles.heroTitle} style={{ fontFamily: displayFont.stack }}>
          Videos
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
          コースの雰囲気やレース当日の空気感を、映像で。各ステージレースに紐づく動画をまとめて視聴できます。
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
                  placeholder="タイトル・チャンネル・レース名など"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className={styles.searchInput}
                  style={{
                    border: `1px solid ${palette.rule}`,
                    color: palette.ink,
                  }}
                />
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
                    label={r.label}
                    active={raceSlug === r.slug}
                    onClick={() => setRaceSlug(r.slug)}
                    palette={palette}
                    displayFont={displayFont}
                  />
                ))}
              </FilterGroup>

              <FilterGroup label="Continent" palette={palette} displayFont={displayFont}>
                <FilterChip
                  label="すべて"
                  active={continent === "all"}
                  onClick={() => setContinent("all")}
                  palette={palette}
                  displayFont={displayFont}
                />
                {continentOptions.map((c) => (
                  <FilterChip
                    key={c}
                    label={c}
                    active={continent === c}
                    onClick={() => setContinent(c)}
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

        <div className={styles.videoGrid}>
          {filtered.map((v) => (
            <article key={`${v.raceSlug}-${v.id}`}>
              <div className={styles.videoFrame} style={{ background: palette.ink }}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.id)}`}
                  title={v.title ?? `YouTube video ${v.id}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  loading="lazy"
                />
              </div>
              {v.title && (
                <h3 className={styles.videoTitle} style={{ color: palette.ink }}>
                  {v.title}
                </h3>
              )}
              <div className={styles.videoMeta} style={{ color: palette.inkSoft }}>
                <Link
                  href={`/races/${v.raceSlug}`}
                  style={{ color: palette.inkSoft, textDecoration: "underline" }}
                >
                  {v.raceTitleEn ?? v.raceTitle}
                </Link>
                <span>·</span>
                <span>
                  {v.country} / {MONTH_LABELS[v.startMonth]}
                </span>
                {v.channel && (
                  <>
                    <span>·</span>
                    {v.channelUrl ? (
                      <a
                        href={v.channelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: palette.inkSoft, textDecoration: "underline" }}
                      >
                        {v.channel}
                      </a>
                    ) : (
                      <span>{v.channel}</span>
                    )}
                  </>
                )}
              </div>
            </article>
          ))}
          {!filtered.length && (
            <div className={styles.empty} style={{ color: palette.inkSoft }}>
              該当する動画がありません
            </div>
          )}
        </div>
      </section>

      <SiteFooter palette={palette} displayFont={displayFont} />
    </div>
  );
}
