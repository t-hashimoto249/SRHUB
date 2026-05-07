import Link from "next/link";
import { getAllRaces } from "@/lib/content";
import {
  PALETTES,
  DISPLAY_FONTS,
  SELECTED_PALETTE_KEY,
  SELECTED_FONT_KEY,
  type Palette,
  type DisplayFont,
} from "@/components/design-tokens";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { Race } from "@/types/content";

export default async function HomePage() {
  const races = await getAllRaces();
  const palette = PALETTES[SELECTED_PALETTE_KEY];
  const displayFont = DISPLAY_FONTS[SELECTED_FONT_KEY];
  const featured = races.slice(0, 4);

  return (
    <div style={{ background: palette.bg, color: palette.ink, fontFamily: '"Noto Sans JP", sans-serif' }}>
      <SiteHeader palette={palette} displayFont={displayFont} variant="A" current="home" />

      <section style={{ padding: "80px 48px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "end" }}>
          <div>
            <div
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: 10,
                letterSpacing: "0.24em",
                color: palette.inkSoft,
                marginBottom: 24,
                textTransform: "uppercase",
              }}
            >
              Issue 01 / Spring 2026
            </div>
            <h1
              style={{
                fontFamily: displayFont.stack,
                fontSize: 132,
                lineHeight: 0.86,
                margin: 0,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
              }}
            >
              Several
              <br />
              <span style={{ color: palette.accent }}>Days</span>
              <br />
              On Foot.
            </h1>
          </div>
          <div style={{ paddingBottom: 12 }}>
            <p
              style={{
                fontFamily: '"Noto Serif JP", serif',
                fontSize: 17,
                lineHeight: 2,
                color: palette.ink,
                margin: 0,
              }}
            >
              一日では終わらない。数日かけて走り続ける。砂漠から極地まで、世界中で開催されているステージレースの中から、日本人ランナーが知るべきレースを集め、参加レポートと装備の知見を共有する場所です。
            </p>
            <div style={{ marginTop: 32, display: "flex", gap: 24 }}>
              <StatCell label="Races covered" value={races.length} palette={palette} displayFont={displayFont} />
              <StatCell
                label="Continents"
                value={new Set(races.map((r) => r.continent)).size}
                palette={palette}
                displayFont={displayFont}
              />
              <StatCell label="Reports" value={0} palette={palette} displayFont={displayFont} />
            </div>
          </div>
        </div>
      </section>

      {featured.length > 0 && <FourSplitHero races={featured} palette={palette} displayFont={displayFont} />}

      <section style={{ padding: "100px 48px" }}>
        <div
          style={{
            borderTop: `1px solid ${palette.rule}`,
            paddingTop: 32,
            display: "grid",
            gridTemplateColumns: "180px 1fr 1fr 1fr",
            gap: 32,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: displayFont.stack,
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: palette.inkSoft,
                lineHeight: 1.6,
              }}
            >
              From
              <br />
              The
              <br />
              Field
            </div>
          </div>
          {[
            {
              tag: "Editorial",
              title: "ステージレースとは何か—— 1日では終わらない走りの文化",
              author: "編集部",
              img: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
            },
            {
              tag: "Guide",
              title: "初めての海外ステージレース、装備選びのスタート地点",
              author: "編集部",
              img: "https://images.unsplash.com/photo-1547234935-80c7145ec969?w=800&q=80",
            },
            {
              tag: "Interview",
              title: "完走者に聞いた、サハラの夜に持っていきたいもの",
              author: "編集部",
              img: "https://images.unsplash.com/photo-1517783999520-f068d7431a60?w=800&q=80",
            },
          ].map((p) => (
            <article key={p.title}>
              <div
                style={{
                  aspectRatio: "4/3",
                  backgroundImage: `url(${p.img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  marginBottom: 14,
                }}
              />
              <div
                style={{
                  fontFamily: displayFont.stack,
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: palette.accentDeep,
                  marginBottom: 8,
                }}
              >
                {p.tag}
              </div>
              <h3
                style={{
                  fontFamily: '"Noto Serif JP", serif',
                  fontSize: 20,
                  lineHeight: 1.4,
                  margin: 0,
                  color: palette.ink,
                  fontWeight: 600,
                }}
              >
                {p.title}
              </h3>
              <div style={{ marginTop: 12, fontSize: 12, color: palette.inkSoft }}>{p.author}</div>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter palette={palette} displayFont={displayFont} />
    </div>
  );
}

function StatCell({
  label,
  value,
  palette,
  displayFont,
}: {
  label: string;
  value: number;
  palette: Palette;
  displayFont: DisplayFont;
}) {
  return (
    <div>
      <div
        style={{
          fontFamily: displayFont.stack,
          fontSize: 36,
          fontWeight: 600,
          color: palette.accentDeep,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: palette.inkSoft }}>
        {label}
      </div>
    </div>
  );
}

function FourSplitHero({
  races,
  palette,
  displayFont,
}: {
  races: Race[];
  palette: Palette;
  displayFont: DisplayFont;
}) {
  return (
    <section style={{ padding: "0 48px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gridTemplateRows: "420px 240px",
          gap: 12,
          height: 672,
        }}
      >
        <Link
          href={`/races/${races[0].slug}`}
          style={{ gridRow: "span 2", position: "relative", overflow: "hidden", textDecoration: "none" }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: races[0].hero_image ? `url(${races[0].hero_image})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
              background: races[0].hero_image ? undefined : palette.accentDeep,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.75) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 20,
              left: 24,
              fontFamily: "ui-monospace, monospace",
              fontSize: 10,
              color: "rgba(255,255,255,0.85)",
              letterSpacing: "0.18em",
            }}
          >
            COVER · {races[0].country.toUpperCase()}
          </div>
          <div style={{ position: "absolute", left: 24, right: 24, bottom: 28, color: "#fff" }}>
            <div
              style={{
                fontFamily: displayFont.stack,
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                opacity: 0.85,
                marginBottom: 8,
              }}
            >
              {races[0].continent}
            </div>
            <h2
              style={{
                fontFamily: displayFont.stack,
                fontSize: 64,
                fontWeight: 600,
                margin: 0,
                textTransform: "uppercase",
                lineHeight: 0.95,
                letterSpacing: "-0.01em",
              }}
            >
              {races[0].title_en ?? races[0].title}
            </h2>
            <p style={{ fontSize: 13, marginTop: 16, maxWidth: 480, lineHeight: 1.7, opacity: 0.92 }}>
              {races[0].summary}
            </p>
          </div>
        </Link>
        {[races[1], races[2]].filter(Boolean).map((r) => (
          <Link
            key={r.slug}
            href={`/races/${r.slug}`}
            style={{ position: "relative", overflow: "hidden", textDecoration: "none" }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: r.hero_image ? `url(${r.hero_image})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
                background: r.hero_image ? undefined : palette.accentDeep,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.75) 100%)",
              }}
            />
            <div style={{ position: "absolute", left: 18, right: 18, bottom: 18, color: "#fff" }}>
              <div
                style={{
                  fontFamily: "ui-monospace, monospace",
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  opacity: 0.8,
                  marginBottom: 4,
                }}
              >
                {r.continent}
              </div>
              <div
                style={{
                  fontFamily: displayFont.stack,
                  fontSize: 22,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  lineHeight: 1.1,
                }}
              >
                {r.title_en ?? r.title}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
