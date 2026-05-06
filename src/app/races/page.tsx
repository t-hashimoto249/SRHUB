import Link from "next/link";
import { getAllRaces } from "@/lib/content";
import {
  PALETTES,
  DISPLAY_FONTS,
  SELECTED_PALETTE_KEY,
  SELECTED_FONT_KEY,
  MONTH_LABELS,
} from "@/components/design-tokens";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { TerrainIcon } from "@/components/TerrainTags";
import { Stars } from "@/components/Brand";
import { WorldMap } from "@/components/WorldMap";

export default async function RaceListPage() {
  const races = await getAllRaces();
  const palette = PALETTES[SELECTED_PALETTE_KEY];
  const displayFont = DISPLAY_FONTS[SELECTED_FONT_KEY];

  // MVP: ソートは難易度順（高い順）で固定
  const sorted = [...races].sort((a, b) => b.difficulty - a.difficulty);

  return (
    <div style={{ background: palette.bg, color: palette.ink, fontFamily: '"Noto Sans JP", sans-serif' }}>
      <SiteHeader palette={palette} displayFont={displayFont} variant="A" current="races" />

      <section style={{ padding: "64px 48px 24px", borderBottom: `1px solid ${palette.rule}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <h1
            style={{
              fontFamily: displayFont.stack,
              fontSize: 80,
              fontWeight: 600,
              margin: 0,
              textTransform: "uppercase",
              lineHeight: 0.9,
              letterSpacing: "-0.01em",
            }}
          >
            Race Index
          </h1>
          <div
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 11,
              letterSpacing: "0.16em",
              color: palette.inkSoft,
            }}
          >
            {sorted.length} ENTRIES
          </div>
        </div>
      </section>

      <section style={{ padding: "0 48px 80px" }}>
        {sorted.map((r, i) => (
          <Link
            key={r.slug}
            href={`/races/${r.slug}`}
            style={{ textDecoration: "none", color: "inherit", display: "block" }}
          >
            <article
              style={{
                display: "grid",
                gridTemplateColumns: "60px 280px 1fr 120px 120px 100px",
                gap: 32,
                padding: "24px 0",
                alignItems: "center",
                borderBottom: `1px solid ${palette.rule}`,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  fontFamily: "ui-monospace, monospace",
                  fontSize: 11,
                  color: palette.inkSoft,
                  letterSpacing: "0.1em",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div
                style={{
                  aspectRatio: "4/3",
                  backgroundImage: r.hero_image ? `url(${r.hero_image})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  background: r.hero_image ? undefined : palette.bgAlt,
                }}
              />
              <div>
                <div
                  style={{
                    fontFamily: displayFont.stack,
                    fontSize: 11,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: palette.inkSoft,
                    marginBottom: 4,
                  }}
                >
                  {r.country} · {r.continent}
                </div>
                <h3
                  style={{
                    fontFamily: displayFont.stack,
                    fontSize: 32,
                    fontWeight: 600,
                    margin: 0,
                    textTransform: "uppercase",
                    letterSpacing: "-0.005em",
                  }}
                >
                  {r.title_en ?? r.title}
                </h3>
                <div style={{ fontSize: 12, color: palette.inkSoft, marginTop: 4 }}>{r.title}</div>
              </div>
              <div style={{ fontFamily: displayFont.stack, fontSize: 22, fontWeight: 500 }}>
                {r.distance_km}
                <span style={{ fontSize: 11, color: palette.inkSoft, letterSpacing: "0.1em" }}>&nbsp;KM</span>
              </div>
              <div style={{ fontSize: 12, color: palette.inkSoft }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                  {r.terrain.map((t) => (
                    <TerrainIcon key={t} terrain={t} size={14} />
                  ))}
                </div>
                <div>
                  {MONTH_LABELS[r.start_month]} · {r.duration_days}d
                </div>
              </div>
              <div style={{ color: palette.accent, fontSize: 16 }}>
                <Stars n={r.difficulty} />
              </div>
            </article>
          </Link>
        ))}
      </section>

      <SiteFooter palette={palette} displayFont={displayFont} />
    </div>
  );
}
