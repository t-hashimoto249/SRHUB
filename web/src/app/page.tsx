import Link from "next/link";
import { getAllRaces, getAllReports, getAllContributors } from "@/lib/content";
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
import { WorldMap } from "@/components/WorldMap";
import { REPORT_PURPOSE_LABEL, type Race, type Report, type Contributor } from "@/types/content";
import styles from "./page.module.css";

export default async function HomePage() {
  const [races, reports, contributors] = await Promise.all([
    getAllRaces(),
    getAllReports(),
    getAllContributors(),
  ]);
  const palette = PALETTES[SELECTED_PALETTE_KEY];
  const displayFont = DISPLAY_FONTS[SELECTED_FONT_KEY];
  const FEATURED_SLUGS = [
    "ultra-africa-race",
    "ultra-bolivia-race",
    "the-coastal-challenge",
    "marathon-des-sables",
  ];
  const featured = FEATURED_SLUGS
    .map((slug) => races.find((r) => r.slug === slug))
    .filter((r): r is Race => Boolean(r));
  const latestReports = reports.slice(0, 4);
  const contributorMap = new Map(contributors.map((c) => [c.id, c]));
  const racesForMap = races.map((race) => {
    const { contentHtml: _contentHtml, ...rest } = race;
    void _contentHtml;
    return rest;
  });

  return (
    <div style={{ background: palette.bg, color: palette.ink, fontFamily: '"Noto Sans JP", sans-serif' }}>
      <SiteHeader palette={palette} displayFont={displayFont} variant="A" current="home" />

      <section className={styles.heroSection}>
        <div className={styles.heroGrid}>
          <div>
            <div className={styles.heroIssue} style={{ color: palette.inkSoft }}>
              Issue 01 / Spring 2026
            </div>
            <h1 className={styles.heroTitle} style={{ fontFamily: displayFont.stack }}>
              Several
              <br />
              <span style={{ color: palette.accent }}>Days</span>
              <br />
              On Foot.
            </h1>
          </div>
          <div>
            <p className={styles.heroIntro} style={{ color: palette.ink }}>
              一日では終わらない。数日かけて走り続ける。砂漠から極地まで、世界中で開催されているステージレースの中から、日本人ランナーが知るべきレースを集め、参加レポートと装備の知見を共有する場所です。
            </p>
            <div className={styles.heroStats}>
              <StatCell label="Races covered" value={races.length} palette={palette} displayFont={displayFont} />
              <StatCell
                label="Continents"
                value={new Set(races.map((r) => r.continent)).size}
                palette={palette}
                displayFont={displayFont}
              />
              <StatCell label="Reports" value={reports.length} palette={palette} displayFont={displayFont} />
            </div>
          </div>
        </div>
      </section>

      {featured.length > 0 && <FourSplitHero races={featured} palette={palette} displayFont={displayFont} />}

      {latestReports.length > 0 && (
        <section className={styles.fieldSection}>
          <div className={styles.fieldGrid} style={{ borderTop: `1px solid ${palette.rule}` }}>
            <div>
              <div className={styles.fieldLabel} style={{ fontFamily: displayFont.stack, color: palette.inkSoft }}>
                From
                <br />
                The
                <br />
                Field
              </div>
            </div>
            {latestReports.map((r) => (
              <ReportCard
                key={r.slug}
                report={r}
                contributor={contributorMap.get(r.contributor)}
                palette={palette}
                displayFont={displayFont}
              />
            ))}
          </div>
        </section>
      )}

      <ExploreSection palette={palette} displayFont={displayFont} />

      <section className={styles.atlasSection}>
        <div className={styles.atlasHeader}>
          <div>
            <div
              className={styles.atlasKicker}
              style={{ color: palette.inkSoft, fontFamily: displayFont.stack }}
            >
              Atlas · {racesForMap.length} races
            </div>
            <h2
              className={styles.atlasTitle}
              style={{ fontFamily: displayFont.stack, color: palette.ink }}
            >
              世界のレースを地図で探す
            </h2>
          </div>
          <div
            className={styles.atlasNote}
            style={{ color: palette.inkSoft, fontFamily: '"Noto Serif JP", serif' }}
          >
            ピンにカーソルを合わせると概要 · クリックで詳細へ
          </div>
        </div>
        <WorldMap races={racesForMap} palette={palette} displayFont={displayFont} height={500} />
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
        className={styles.statValue}
        style={{ fontFamily: displayFont.stack, color: palette.accentDeep }}
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
    <section className={styles.fourSplit}>
      <div className={styles.fourSplitGrid}>
        <Link href={`/races/${races[0].slug}`} className={styles.fourSplitMain}>
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
              top: 16,
              left: 18,
              fontFamily: "ui-monospace, monospace",
              fontSize: 10,
              color: "rgba(255,255,255,0.85)",
              letterSpacing: "0.18em",
            }}
          >
            COVER · {races[0].country.toUpperCase()}
          </div>
          <div style={{ position: "absolute", left: 18, right: 18, bottom: 22, color: "#fff" }}>
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
            <h2 className={styles.fourSplitMainTitle} style={{ fontFamily: displayFont.stack }}>
              {races[0].title_en ?? races[0].title}
            </h2>
            <p style={{ fontSize: 13, marginTop: 14, maxWidth: 480, lineHeight: 1.7, opacity: 0.92 }}>
              {races[0].summary}
            </p>
          </div>
        </Link>
        {races.slice(1).map((r) => (
          <Link key={r.slug} href={`/races/${r.slug}`} className={styles.fourSplitSide}>
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
            <div style={{ position: "absolute", left: 16, right: 16, bottom: 16, color: "#fff" }}>
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

function ExploreSection({
  palette,
  displayFont,
}: {
  palette: Palette;
  displayFont: DisplayFont;
}) {
  const cards = [
    {
      href: "/races",
      kicker: "Index 01",
      title: "All Races",
      lead: "大陸・距離・地形・難易度・開催月などからステージレースを横断的に検索できます。",
    },
    {
      href: "/reports",
      kicker: "Index 02",
      title: "All Reports",
      lead: "作成者・レース・目的・作成時期・開催月から、走った人のレポートを検索できます。",
    },
  ];
  return (
    <section className={styles.exploreSection}>
      <div className={styles.exploreLabel} style={{ color: palette.inkSoft, fontFamily: displayFont.stack }}>
        Explore the archive
      </div>
      <h2 className={styles.exploreHeading} style={{ fontFamily: displayFont.stack, color: palette.ink }}>
        Find your next stage.
      </h2>
      <div className={styles.exploreGrid}>
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className={styles.exploreCard}
            style={{
              border: `1px solid ${palette.rule}`,
              background: palette.paper,
              color: palette.ink,
            }}
          >
            <div>
              <div className={styles.exploreCardKicker} style={{ color: palette.inkSoft }}>
                {c.kicker}
              </div>
              <h3
                className={styles.exploreCardTitle}
                style={{ fontFamily: displayFont.stack, color: palette.ink }}
              >
                {c.title}
              </h3>
              <p className={styles.exploreCardLead} style={{ color: palette.inkSoft }}>
                {c.lead}
              </p>
            </div>
            <div
              className={styles.exploreCardArrow}
              style={{ fontFamily: displayFont.stack, color: palette.accentDeep }}
            >
              Browse →
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ReportCard({
  report,
  contributor,
  palette,
  displayFont,
}: {
  report: Report;
  contributor: Contributor | undefined;
  palette: Palette;
  displayFont: DisplayFont;
}) {
  const href = `/races/${report.race_slug}/reports/${report.slug}`;
  const authorLabel = contributor?.name ?? `@${report.contributor}`;
  return (
    <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
      <article>
        <div
          style={{
            aspectRatio: "4/3",
            backgroundImage: report.hero_image ? `url(${report.hero_image})` : undefined,
            backgroundColor: report.hero_image ? undefined : palette.bgAlt,
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
          {REPORT_PURPOSE_LABEL[report.purpose]}
        </div>
        <h3
          style={{
            fontFamily: '"Noto Serif JP", serif',
            fontSize: 18,
            lineHeight: 1.4,
            margin: 0,
            color: palette.ink,
            fontWeight: 600,
          }}
        >
          {report.title}
        </h3>
        <div style={{ marginTop: 12, fontSize: 12, color: palette.inkSoft }}>
          {authorLabel} · {report.date}
        </div>
      </article>
    </Link>
  );
}
