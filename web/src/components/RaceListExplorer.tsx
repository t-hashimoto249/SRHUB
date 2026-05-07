"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import type { Continent, RaceListItem, Terrain } from "@/types/content";
import type { DisplayFont, Palette } from "./design-tokens";
import { MONTH_LABELS } from "./design-tokens";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { TerrainIcon } from "./TerrainTags";
import { Stars } from "./Brand";
import { WorldMap } from "./WorldMap";

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
  palette,
  displayFont,
  cardStyle = "overlay",
}: {
  races: RaceListItem[];
  palette: Palette;
  displayFont: DisplayFont;
  cardStyle?: CardStyle;
}) {
  const [continent, setContinent] = useState<(typeof CONTINENTS)[number]>("すべて");
  const [difficulty, setDifficulty] = useState(0);
  const [terrains, setTerrains] = useState<Terrain[]>([]);

  const filtered = useMemo(() => {
    const out = races.filter((r) => {
      if (continent !== "すべて" && r.continent !== continent) return false;
      if (difficulty && r.difficulty < difficulty) return false;
      if (terrains.length && !terrains.some((t) => r.terrain.includes(t))) return false;
      return true;
    });
    return out.sort((a, b) => b.difficulty - a.difficulty);
  }, [races, continent, difficulty, terrains]);

  return (
    <div style={{ background: palette.bg, color: palette.ink, fontFamily: '"Noto Sans JP", sans-serif' }}>
      <SiteHeader palette={palette} displayFont={displayFont} variant="A" current="races" />

      <section style={{ padding: "64px 48px 24px" }}>
        <div
          style={{
            fontFamily: "ui-monospace, monospace",
            fontSize: 10,
            letterSpacing: "0.24em",
            color: palette.inkSoft,
            marginBottom: 16,
            textTransform: "uppercase",
          }}
        >
          Index · {filtered.length} of {races.length} races
        </div>
        <h1
          style={{
            fontFamily: displayFont.stack,
            fontSize: 92,
            fontWeight: 600,
            margin: 0,
            lineHeight: 0.9,
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
          }}
        >
          All Races
        </h1>
      </section>

      <section style={{ padding: "0 48px 48px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
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
            <h2
              style={{
                fontFamily: displayFont.stack,
                fontSize: 28,
                fontWeight: 600,
                margin: "8px 0 0",
                textTransform: "uppercase",
                letterSpacing: "0.02em",
              }}
            >
              世界のレースを地図で探す
            </h2>
          </div>
          <div style={{ fontSize: 11, color: palette.inkSoft, fontFamily: '"Noto Serif JP", serif' }}>
            ピンにカーソルを合わせると概要 · クリックで詳細へ
          </div>
        </div>
        <WorldMap races={filtered} palette={palette} displayFont={displayFont} height={500} />
      </section>

      <section style={{ padding: "0 48px 80px", display: "grid", gridTemplateColumns: "240px 1fr", gap: 48 }}>
        <aside
          style={{
            position: "sticky",
            top: 24,
            alignSelf: "start",
            borderTop: `1px solid ${palette.rule}`,
            paddingTop: 20,
          }}
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
        </aside>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
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
                gridColumn: "span 2",
                padding: "80px 0",
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
