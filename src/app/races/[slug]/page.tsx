import { notFound } from "next/navigation";
import { getAllRaces, getRaceBySlug, getReportsByRace } from "@/lib/content";
import {
  PALETTES,
  DISPLAY_FONTS,
  SELECTED_PALETTE_KEY,
  SELECTED_FONT_KEY,
  MONTH_LABELS,
} from "@/components/design-tokens";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { RaceMeta } from "@/components/RaceMeta";
import { RaceDetailChapters } from "@/components/RaceDetailChapters";

export async function generateStaticParams() {
  const races = await getAllRaces();
  return races.map((race) => ({ slug: race.slug }));
}

interface RaceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function RaceDetailPage({ params }: RaceDetailPageProps) {
  const { slug } = await params;
  const race = await getRaceBySlug(slug);
  if (!race) notFound();

  const reports = await getReportsByRace(slug);
  const palette = PALETTES[SELECTED_PALETTE_KEY];
  const displayFont = DISPLAY_FONTS[SELECTED_FONT_KEY];

  return (
    <div style={{ background: palette.bg, color: palette.ink, fontFamily: '"Noto Sans JP", sans-serif' }}>
      {/* フルブリードヒーロー */}
      <section style={{ position: "relative", height: 640, overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: race.hero_image ? `url(${race.hero_image})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            background: race.hero_image ? undefined : palette.accentDeep,
            filter: race.hero_image ? "brightness(0.65)" : undefined,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.5) 100%)",
          }}
        />
        <SiteHeader palette={palette} displayFont={displayFont} variant="B" current="races" />
        <div style={{ position: "absolute", left: 48, right: 48, bottom: 48, color: "#fff" }}>
          <div
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 11,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              marginBottom: 16,
              opacity: 0.85,
            }}
          >
            {race.continent} · {race.country} · {MONTH_LABELS[race.start_month]} {race.duration_days}d
          </div>
          <h1
            style={{
              fontFamily: displayFont.stack,
              fontSize: 124,
              fontWeight: 600,
              margin: 0,
              lineHeight: 0.88,
              textTransform: "uppercase",
              letterSpacing: "-0.015em",
            }}
          >
            {race.title_en ?? race.title}
          </h1>
          <div style={{ marginTop: 16, fontSize: 17, fontFamily: '"Noto Serif JP", serif', opacity: 0.95 }}>
            {race.title}
          </div>
        </div>
      </section>

      {/* メタバー */}
      <section style={{ padding: "0 48px", marginTop: -1, background: palette.paper }}>
        <RaceMeta race={race} palette={palette} displayFont={displayFont} layout="row" />
      </section>

      {/* チャプターナビ + チャプター本体（クライアントコンポーネント） */}
      <RaceDetailChapters race={race} reports={reports} palette={palette} displayFont={displayFont} />

      {/* CTA */}
      <section
        style={{
          background: palette.accentDeep,
          color: palette.bg,
          padding: "80px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 10,
              letterSpacing: "0.24em",
              opacity: 0.7,
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Official site
          </div>
          <div
            style={{
              fontFamily: displayFont.stack,
              fontSize: 36,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "-0.005em",
            }}
          >
            Apply for {race.title_en ?? race.title}
          </div>
        </div>
        <a
          href={race.official_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "18px 32px",
            background: palette.bg,
            color: palette.ink,
            fontFamily: displayFont.stack,
            fontWeight: 600,
            fontSize: 14,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          Visit Site →
        </a>
      </section>

      <SiteFooter palette={palette} displayFont={displayFont} />
    </div>
  );
}
