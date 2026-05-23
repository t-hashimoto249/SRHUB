import { notFound } from "next/navigation";
import {
  getAllRaces,
  getRaceBySlug,
  getReportsByRace,
  getAllOrganizers,
  resolveOrganizerForRace,
} from "@/lib/content";
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
import { PvPing } from "@/components/PvPing";
import styles from "./page.module.css";

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

  const [reports, organizers] = await Promise.all([
    getReportsByRace(slug),
    getAllOrganizers(),
  ]);
  const organizerId = resolveOrganizerForRace(race, organizers)?.id ?? null;
  const palette = PALETTES[SELECTED_PALETTE_KEY];
  const displayFont = DISPLAY_FONTS[SELECTED_FONT_KEY];

  return (
    <div style={{ background: palette.bg, color: palette.ink, fontFamily: '"Noto Sans JP", sans-serif' }}>
      <PvPing scope="race" id={race.slug} />
      {/* フルブリードヒーロー */}
      <section className={styles.hero}>
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
        <div className={styles.heroContent}>
          <div className={styles.heroLabel}>
            {race.continent} · {race.country} · {MONTH_LABELS[race.start_month]} {race.duration_days}d
          </div>
          <h1 className={styles.heroTitle} style={{ fontFamily: displayFont.stack }}>
            {race.title_en ?? race.title}
          </h1>
          <div className={styles.heroSub} style={{ fontFamily: '"Noto Serif JP", serif' }}>
            {race.title}
          </div>
        </div>
      </section>

      {/* メタバー */}
      <section className={styles.metaSection} style={{ background: palette.paper }}>
        <RaceMeta race={race} palette={palette} displayFont={displayFont} layout="row" />
      </section>

      {/* チャプターナビ + チャプター本体（クライアントコンポーネント） */}
      <RaceDetailChapters
        race={race}
        reports={reports}
        palette={palette}
        displayFont={displayFont}
        organizerId={organizerId}
      />

      {/* CTA */}
      <section
        className={styles.cta}
        style={{ background: palette.accentDeep, color: palette.bg }}
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
            className={styles.ctaTitle}
            style={{ fontFamily: displayFont.stack }}
          >
            Apply for {race.title_en ?? race.title}
          </div>
        </div>
        <a
          href={race.official_url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.ctaButton}
          style={{ background: palette.bg, color: palette.ink, fontFamily: displayFont.stack }}
        >
          Visit Site →
        </a>
      </section>

      <SiteFooter palette={palette} displayFont={displayFont} />
    </div>
  );
}
