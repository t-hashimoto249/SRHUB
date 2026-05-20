import Link from "next/link";
import {
  getAllOrganizers,
  getAllRaces,
  countRacesByOrganizer,
  resolveOrganizerForRace,
} from "@/lib/content";
import {
  PALETTES,
  DISPLAY_FONTS,
  SELECTED_PALETTE_KEY,
  SELECTED_FONT_KEY,
} from "@/components/design-tokens";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { Organizer } from "@/types/content";
import styles from "../static-pages.module.css";

export default async function OrganizersPage() {
  const [organizers, races] = await Promise.all([getAllOrganizers(), getAllRaces()]);
  const palette = PALETTES[SELECTED_PALETTE_KEY];
  const displayFont = DISPLAY_FONTS[SELECTED_FONT_KEY];

  const counts = countRacesByOrganizer(races, organizers);
  const orphanRaces = races.filter((r) => !resolveOrganizerForRace(r, organizers));

  return (
    <div style={{ background: palette.bg, color: palette.ink, fontFamily: '"Noto Sans JP", sans-serif' }}>
      <SiteHeader palette={palette} displayFont={displayFont} variant="A" current="organizers" />

      <section className={styles.heroSection}>
        <div className={styles.heroLabel} style={{ color: palette.inkSoft }}>
          Organizers · {organizers.length} groups
        </div>
        <h1 className={styles.heroTitleLg} style={{ fontFamily: displayFont.stack }}>
          The people
          <br />
          <span style={{ color: palette.accent }}>behind the race.</span>
        </h1>
        <p className={styles.heroLead} style={{ color: palette.inkSoft }}>
          コースを引き、ロジを組み、ランナーを砂漠や山岳へと送り出す主催者たち。各団体ごとに開催レースをまとめています。
        </p>
      </section>

      <section className={styles.section}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {organizers.map((o) => (
            <OrganizerCard
              key={o.id}
              organizer={o}
              raceCount={counts.get(o.id) ?? 0}
              palette={palette}
              displayFont={displayFont}
            />
          ))}
        </div>

        {organizers.length === 0 && (
          <div
            style={{
              padding: "48px 20px",
              textAlign: "center",
              border: `1px dashed ${palette.rule}`,
              color: palette.inkSoft,
              fontSize: 14,
              lineHeight: 1.8,
            }}
          >
            主催者情報は準備中です。
          </div>
        )}

        {orphanRaces.length > 0 && (
          <div
            style={{
              marginTop: 32,
              padding: "16px 18px",
              borderLeft: `3px solid ${palette.rule}`,
              background: palette.bgAlt,
              fontSize: 12,
              lineHeight: 1.8,
              color: palette.inkSoft,
            }}
          >
            未登録の主催者: {orphanRaces.map((r) => r.organizer || `(${r.title})`).join(" / ")}
          </div>
        )}
      </section>

      <SiteFooter palette={palette} displayFont={displayFont} />
    </div>
  );
}

function OrganizerCard({
  organizer,
  raceCount,
  palette,
  displayFont,
}: {
  organizer: Organizer;
  raceCount: number;
  palette: import("@/components/design-tokens").Palette;
  displayFont: import("@/components/design-tokens").DisplayFont;
}) {
  return (
    <Link
      href={`/organizers/${organizer.id}`}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        padding: 20,
        border: `1px solid ${palette.rule}`,
        background: palette.paper,
        color: palette.ink,
        textDecoration: "none",
      }}
    >
      <div
        style={{
          fontFamily: displayFont.stack,
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: palette.inkSoft,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>{organizer.country ?? "—"}</span>
        <span>
          {raceCount} race{raceCount === 1 ? "" : "s"}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {organizer.logo && (
          <div
            style={{
              width: 44,
              height: 44,
              backgroundImage: `url(${organizer.logo})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              flex: "0 0 44px",
            }}
          />
        )}
        <h3
          style={{
            fontFamily: displayFont.stack,
            fontSize: "clamp(18px, 3.4vw, 22px)",
            fontWeight: 600,
            margin: 0,
            textTransform: "uppercase",
            letterSpacing: "-0.005em",
            lineHeight: 1.15,
          }}
        >
          {organizer.name_en ?? organizer.name}
        </h3>
      </div>
      {organizer.name_en && organizer.name_en !== organizer.name && (
        <div style={{ fontSize: 12, color: palette.inkSoft, marginTop: -6 }}>{organizer.name}</div>
      )}
      {organizer.summary && (
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.8, color: palette.inkSoft }}>
          {organizer.summary}
        </p>
      )}
      <div
        style={{
          marginTop: "auto",
          fontFamily: displayFont.stack,
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: palette.accentDeep,
          borderTop: `1px solid ${palette.rule}`,
          paddingTop: 12,
        }}
      >
        View Races →
      </div>
    </Link>
  );
}
