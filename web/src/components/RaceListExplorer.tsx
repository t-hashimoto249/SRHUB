"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import type { Continent, RaceListItem, SupportType, Terrain } from "@/types/content";

export interface OrganizerOption {
  id: string;
  name: string;
  count: number;
}

export type RaceListItemWithOrganizer = RaceListItem & { organizer_id?: string | null };
import type { DisplayFont, Palette } from "./design-tokens";
import { MONTH_LABELS } from "./design-tokens";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { TerrainIcon } from "./TerrainTags";
import { Stars } from "./Brand";
import { WorldMap } from "./WorldMap";
import styles from "./RaceListExplorer.module.css";

const CONTINENTS: (Continent | "すべて")[] = [
  "すべて",
  "アフリカ",
  "アジア",
  "ヨーロッパ",
  "北アメリカ",
  "南アメリカ",
  "オセアニア",
  "南極",
];

const TERRAIN_FILTERS: Terrain[] = ["砂漠", "山岳", "極地", "ジャングル", "その他"];

type DistanceBin = "all" | "u150" | "u250" | "u350" | "o350";

const DISTANCE_BINS: { key: DistanceBin; label: string; test: (km: number) => boolean }[] = [
  { key: "all", label: "すべて", test: () => true },
  { key: "u150", label: "〜150km", test: (km) => km < 150 },
  { key: "u250", label: "150〜249km", test: (km) => km >= 150 && km < 250 },
  { key: "u350", label: "250〜349km", test: (km) => km >= 250 && km < 350 },
  { key: "o350", label: "350km+", test: (km) => km >= 350 },
];

const SUPPORT_FILTERS: { key: SupportType | "all"; label: string }[] = [
  { key: "all", label: "すべて" },
  { key: "self", label: "セルフサポート" },
  { key: "full", label: "フルサポート" },
];

const MONTHS: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

type CardStyle = "overlay" | "split" | "minimal";

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

function RaceCard({
  race,
  palette,
  displayFont,
  style = "overlay",
  index,
}: {
  race: RaceListItem;
  palette: Palette;
  displayFont: DisplayFont;
  style?: CardStyle;
  index: number;
}) {
  const titleEn = race.title_en ?? race.title;
  const hero = race.hero_image
    ? { backgroundImage: `url(${race.hero_image})` as const }
    : { background: palette.bgAlt };

  if (style === "split") {
    return (
      <Link href={`/races/${race.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
        <article
          style={{
            display: "flex",
            flexDirection: "column",
            cursor: "pointer",
            background: palette.paper,
            border: `1px solid ${palette.rule}`,
            height: "100%",
          }}
        >
          <div
            style={{
              position: "relative",
              aspectRatio: "4/3",
              backgroundSize: "cover",
              backgroundPosition: "center",
              ...hero,
            }}
          >
            <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 4 }}>
              {race.terrain.map((t) => (
                <TerrainIcon key={t} terrain={t} size={20} />
              ))}
            </div>
          </div>
          <div style={{ padding: 20 }}>
            <div
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: 10,
                letterSpacing: "0.18em",
                color: palette.inkSoft,
                marginBottom: 8,
                textTransform: "uppercase",
              }}
            >
              {race.country} · {MONTH_LABELS[race.start_month]}
            </div>
            <h3
              style={{
                fontFamily: displayFont.stack,
                fontSize: 28,
                fontWeight: 600,
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: "-0.005em",
              }}
            >
              {titleEn}
            </h3>
            <div style={{ fontSize: 13, color: palette.inkSoft, marginTop: 4, marginBottom: 14 }}>{race.title}</div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: `1px solid ${palette.rule}`,
                paddingTop: 12,
              }}
            >
              <div style={{ fontFamily: displayFont.stack, fontSize: 15 }}>
                <span style={{ fontWeight: 600 }}>{race.distance_km}</span>
                <span style={{ fontSize: 11, color: palette.inkSoft, letterSpacing: "0.1em" }}>
                  &nbsp;KM · {race.duration_days}d
                </span>
              </div>
              <div style={{ color: palette.accent, fontSize: 14 }}>
                <Stars n={race.difficulty} />
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  if (style === "minimal") {
    return (
      <Link href={`/races/${race.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
        <article
          style={{
            display: "flex",
            flexDirection: "column",
            cursor: "pointer",
            borderTop: `1px solid ${palette.rule}`,
            paddingTop: 20,
            height: "100%",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <div
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: 10,
                letterSpacing: "0.18em",
                color: palette.inkSoft,
                textTransform: "uppercase",
              }}
            >
              № {String(index + 1).padStart(2, "0")} · {race.continent}
            </div>
            <div style={{ color: palette.accent, fontSize: 13 }}>
              <Stars n={race.difficulty} />
            </div>
          </div>
          <h3
            style={{
              fontFamily: displayFont.stack,
              fontSize: 36,
              fontWeight: 600,
              margin: 0,
              lineHeight: 1,
              textTransform: "uppercase",
              letterSpacing: "-0.01em",
            }}
          >
            {titleEn}
          </h3>
          <div style={{ fontSize: 13, color: palette.inkSoft, marginTop: 6, marginBottom: 16 }}>
            {race.title} · {race.country}
          </div>
          <div
            style={{
              aspectRatio: "16/9",
              backgroundSize: "cover",
              backgroundPosition: "center",
              ...hero,
            }}
          />
          <div
            style={{
              display: "flex",
              gap: 18,
              marginTop: 14,
              fontSize: 12,
              color: palette.inkSoft,
              alignItems: "center",
            }}
          >
            <span>{race.distance_km}km</span>
            <span>{race.stages} stages</span>
            <span style={{ display: "inline-flex", gap: 4 }}>
              {race.terrain.map((t) => (
                <TerrainIcon key={t} terrain={t} size={14} />
              ))}
            </span>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/races/${race.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
      <article style={{ position: "relative", cursor: "pointer", overflow: "hidden", aspectRatio: "4/5" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: race.hero_image ? "saturate(0.92)" : undefined,
            ...hero,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 25%, transparent 55%, rgba(0,0,0,0.85) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            right: 16,
            display: "flex",
            justifyContent: "space-between",
            color: "rgba(255,255,255,0.92)",
            fontFamily: "ui-monospace, monospace",
            fontSize: 10,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          <span>№ {String(index + 1).padStart(3, "0")}</span>
          <span>{race.continent}</span>
        </div>
        <div style={{ position: "absolute", left: 20, right: 20, bottom: 20, color: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            {race.terrain.map((t) => (
              <TerrainIcon key={t} terrain={t} size={14} />
            ))}
            <span
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                opacity: 0.85,
              }}
            >
              {race.country} · {MONTH_LABELS[race.start_month]}
            </span>
          </div>
          <h3
            style={{
              fontFamily: displayFont.stack,
              fontSize: 36,
              fontWeight: 600,
              margin: 0,
              lineHeight: 0.95,
              textTransform: "uppercase",
              letterSpacing: "-0.01em",
            }}
          >
            {titleEn}
          </h3>
          <div style={{ fontSize: 12, opacity: 0.85, marginTop: 6 }}>{race.title}</div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 14,
              paddingTop: 12,
              borderTop: "1px solid rgba(255,255,255,0.25)",
            }}
          >
            <div style={{ fontFamily: displayFont.stack, fontSize: 15 }}>
              <span style={{ fontWeight: 600 }}>{race.distance_km}</span>
              <span style={{ fontSize: 11, opacity: 0.7, letterSpacing: "0.1em" }}>
                &nbsp;KM · {race.duration_days}d
              </span>
            </div>
            <Stars n={race.difficulty} color={palette.sand} />
          </div>
        </div>
      </article>
    </Link>
  );
}

export function RaceListExplorer({
  races,
  organizerOptions = [],
  palette,
  displayFont,
  cardStyle = "overlay",
}: {
  races: RaceListItemWithOrganizer[];
  organizerOptions?: OrganizerOption[];
  palette: Palette;
  displayFont: DisplayFont;
  cardStyle?: CardStyle;
}) {
  const [continent, setContinent] = useState<(typeof CONTINENTS)[number]>("すべて");
  const [difficulty, setDifficulty] = useState(0);
  const [terrains, setTerrains] = useState<Terrain[]>([]);
  const [distance, setDistance] = useState<DistanceBin>("all");
  const [months, setMonths] = useState<number[]>([]);
  const [support, setSupport] = useState<SupportType | "all">("all");
  const [organizers, setOrganizers] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);

  const activeFilterCount =
    (continent !== "すべて" ? 1 : 0) +
    (difficulty ? 1 : 0) +
    (terrains.length ? 1 : 0) +
    (distance !== "all" ? 1 : 0) +
    (months.length ? 1 : 0) +
    (support !== "all" ? 1 : 0) +
    (organizers.length ? 1 : 0);

  const filtered = useMemo(() => {
    const distanceTest = DISTANCE_BINS.find((b) => b.key === distance)!.test;
    const out = races.filter((r) => {
      if (continent !== "すべて" && r.continent !== continent) return false;
      if (difficulty && r.difficulty < difficulty) return false;
      if (terrains.length && !terrains.some((t) => r.terrain.includes(t))) return false;
      if (!distanceTest(r.distance_km)) return false;
      if (months.length && !months.includes(r.start_month)) return false;
      if (support !== "all" && r.support !== support) return false;
      if (organizers.length && (!r.organizer_id || !organizers.includes(r.organizer_id))) return false;
      return true;
    });
    return out.sort((a, b) => b.difficulty - a.difficulty);
  }, [races, continent, difficulty, terrains, distance, months, support, organizers]);

  return (
    <div style={{ background: palette.bg, color: palette.ink, fontFamily: '"Noto Sans JP", sans-serif' }}>
      <SiteHeader palette={palette} displayFont={displayFont} variant="A" current="races" />

      <section className={styles.heroSection}>
        <div className={styles.heroLabel} style={{ color: palette.inkSoft }}>
          Index · {filtered.length} of {races.length} races
        </div>
        <h1 className={styles.heroTitle} style={{ fontFamily: displayFont.stack }}>
          All Races
        </h1>
      </section>

      <section className={styles.mapSection}>
        <div className={styles.mapHeader}>
          <div>
            <div
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: 10,
                letterSpacing: "0.24em",
                color: palette.inkSoft,
                textTransform: "uppercase",
              }}
            >
              02 · Atlas
            </div>
            <h2 className={styles.mapTitle} style={{ fontFamily: displayFont.stack }}>
              世界のレースを地図で探す
            </h2>
          </div>
          <div style={{ fontSize: 11, color: palette.inkSoft, fontFamily: '"Noto Serif JP", serif' }}>
            ピンにカーソルを合わせると概要 · クリックで詳細へ
          </div>
        </div>
        <WorldMap races={filtered} palette={palette} displayFont={displayFont} height={500} />
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
            <span>
              Filter{activeFilterCount > 0 ? ` · ${activeFilterCount}` : ""}
            </span>
            <span style={{ fontSize: 16 }}>{filterOpen ? "−" : "+"}</span>
          </button>
          <div
            className={`${filterOpen ? "" : styles.filterPanelClosed}`}
          >
            <div
              className={styles.filterPanelInner}
              style={{ borderTop: `1px solid ${palette.rule}` }}
            >
          <FilterGroup label="Continent" palette={palette} displayFont={displayFont}>
            {CONTINENTS.map((c) => (
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
          <FilterGroup label="Distance" palette={palette} displayFont={displayFont}>
            {DISTANCE_BINS.map((b) => (
              <FilterChip
                key={b.key}
                label={b.label}
                active={distance === b.key}
                onClick={() => setDistance(b.key)}
                palette={palette}
                displayFont={displayFont}
              />
            ))}
          </FilterGroup>
          <FilterGroup label="Month" palette={palette} displayFont={displayFont}>
            {MONTHS.map((m) => (
              <FilterChip
                key={m}
                label={MONTH_LABELS[m]}
                active={months.includes(m)}
                onClick={() =>
                  setMonths((s) => (s.includes(m) ? s.filter((x) => x !== m) : [...s, m]))
                }
                palette={palette}
                displayFont={displayFont}
              />
            ))}
          </FilterGroup>
          <FilterGroup label="Terrain" palette={palette} displayFont={displayFont}>
            {TERRAIN_FILTERS.map((t) => (
              <FilterChip
                key={t}
                label={t}
                active={terrains.includes(t)}
                onClick={() =>
                  setTerrains((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]))
                }
                palette={palette}
                displayFont={displayFont}
              />
            ))}
          </FilterGroup>
          <FilterGroup label="Min difficulty" palette={palette} displayFont={displayFont}>
            <div style={{ display: "flex", gap: 6 }}>
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setDifficulty(n)}
                  style={{
                    flex: 1,
                    padding: "6px 0",
                    fontFamily: displayFont.stack,
                    fontWeight: 600,
                    fontSize: 13,
                    border: `1px solid ${palette.rule}`,
                    background: difficulty === n ? palette.ink : "transparent",
                    color: difficulty === n ? palette.paper : palette.ink,
                    cursor: "pointer",
                  }}
                >
                  {n === 0 ? "—" : n}
                </button>
              ))}
            </div>
          </FilterGroup>
          <FilterGroup label="Support" palette={palette} displayFont={displayFont}>
            {SUPPORT_FILTERS.map((s) => (
              <FilterChip
                key={s.key}
                label={s.label}
                active={support === s.key}
                onClick={() => setSupport(s.key)}
                palette={palette}
                displayFont={displayFont}
              />
            ))}
          </FilterGroup>
          {organizerOptions.length > 0 && (
            <FilterGroup label="Organizer" palette={palette} displayFont={displayFont}>
              {organizerOptions.map((o) => (
                <FilterChip
                  key={o.id}
                  label={`${o.name} (${o.count})`}
                  active={organizers.includes(o.id)}
                  onClick={() =>
                    setOrganizers((s) =>
                      s.includes(o.id) ? s.filter((x) => x !== o.id) : [...s, o.id],
                    )
                  }
                  palette={palette}
                  displayFont={displayFont}
                />
              ))}
            </FilterGroup>
          )}
            </div>
          </div>
        </aside>

        <div className={styles.raceGrid}>
          {filtered.map((r, i) => (
            <RaceCard
              key={r.slug}
              race={r}
              palette={palette}
              displayFont={displayFont}
              style={cardStyle}
              index={i}
            />
          ))}
          {!filtered.length && (
            <div
              style={{
                gridColumn: "1 / -1",
                padding: "60px 0",
                textAlign: "center",
                color: palette.inkSoft,
                fontSize: 14,
              }}
            >
              該当するレースがありません
            </div>
          )}
        </div>
      </section>

      <SiteFooter palette={palette} displayFont={displayFont} />
    </div>
  );
}
