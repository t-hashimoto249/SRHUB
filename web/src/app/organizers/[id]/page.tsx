import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllOrganizers,
  getOrganizerById,
  getAllRaces,
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
import { Stars } from "@/components/Brand";
import { TerrainIcon } from "@/components/TerrainTags";
import type { RaceListItem } from "@/types/content";
import staticStyles from "../../static-pages.module.css";

export async function generateStaticParams() {
  const organizers = await getAllOrganizers();
  return organizers.map((o) => ({ id: o.id }));
}

interface OrganizerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrganizerDetailPage({ params }: OrganizerDetailPageProps) {
  const { id } = await params;
  const [organizer, organizers, races] = await Promise.all([
    getOrganizerById(id),
    getAllOrganizers(),
    getAllRaces(),
  ]);
  if (!organizer) notFound();

  const palette = PALETTES[SELECTED_PALETTE_KEY];
  const displayFont = DISPLAY_FONTS[SELECTED_FONT_KEY];

  const myRaces = races
    .filter((r) => resolveOrganizerForRace(r, organizers)?.id === organizer.id)
    .sort((a, b) => a.start_month - b.start_month);

  return (
    <div style={{ background: palette.bg, color: palette.ink, fontFamily: '"Noto Sans JP", sans-serif' }}>
      <SiteHeader palette={palette} displayFont={displayFont} variant="A" current="organizers" />

      <section className={staticStyles.heroSection}>
        <div className={staticStyles.heroLabel} style={{ color: palette.inkSoft }}>
          Organizer · {organizer.country ?? "—"}
        </div>
        <h1 className={staticStyles.heroTitleMd} style={{ fontFamily: displayFont.stack }}>
          {organizer.name_en ?? organizer.name}
        </h1>
        {organizer.name_en && organizer.name_en !== organizer.name && (
          <div
            style={{
              marginTop: 8,
              fontFamily: '"Noto Serif JP", serif',
              fontSize: 16,
              color: palette.inkSoft,
            }}
          >
            {organizer.name}
          </div>
        )}
        {organizer.summary && (
          <p className={staticStyles.heroLead} style={{ color: palette.inkSoft }}>
            {organizer.summary}
          </p>
        )}

        <dl
          style={{
            marginTop: 28,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 16,
            borderTop: `1px solid ${palette.rule}`,
            paddingTop: 18,
          }}
        >
          <MetaCell label="Races" value={String(myRaces.length)} palette={palette} displayFont={displayFont} />
          {organizer.country && (
            <MetaCell label="Country" value={organizer.country} palette={palette} displayFont={displayFont} />
          )}
          {organizer.founded && (
            <MetaCell
              label="Founded"
              value={String(organizer.founded)}
              palette={palette}
              displayFont={displayFont}
            />
          )}
          {organizer.url && (
            <MetaCell
              label="Website"
              value={
                <a
                  href={organizer.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: palette.accentDeep, textDecoration: "underline" }}
                >
                  Visit ↗
                </a>
              }
              palette={palette}
              displayFont={displayFont}
            />
          )}
        </dl>
      </section>

      {organizer.contentHtml && organizer.contentHtml.trim() !== "" && (
        <section className={staticStyles.section}>
          <article
            style={{
              fontFamily: '"Noto Serif JP", serif',
              fontSize: 15,
              lineHeight: 1.95,
              color: palette.ink,
              maxWidth: 760,
            }}
            dangerouslySetInnerHTML={{ __html: organizer.contentHtml }}
          />
        </section>
      )}

      <section className={staticStyles.section}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 16,
            borderBottom: `1px solid ${palette.rule}`,
            paddingBottom: 12,
            marginBottom: 22,
          }}
        >
          <h2
            style={{
              fontFamily: displayFont.stack,
              fontSize: "clamp(20px, 5vw, 28px)",
              fontWeight: 600,
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            Races
          </h2>
          <span
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 10,
              letterSpacing: "0.2em",
              color: palette.inkSoft,
              textTransform: "uppercase",
            }}
          >
            {myRaces.length} total
          </span>
        </div>

        {myRaces.length === 0 ? (
          <div
            style={{
              padding: "32px 20px",
              textAlign: "center",
              border: `1px dashed ${palette.rule}`,
              color: palette.inkSoft,
              fontSize: 14,
            }}
          >
            この主催者が運営するレースはまだ登録されていません。
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 14,
            }}
          >
            {myRaces.map((r) => (
              <RaceMiniCard key={r.slug} race={r} palette={palette} displayFont={displayFont} />
            ))}
          </div>
        )}
      </section>

      <SiteFooter palette={palette} displayFont={displayFont} />
    </div>
  );
}

function MetaCell({
  label,
  value,
  palette,
  displayFont,
}: {
  label: string;
  value: React.ReactNode;
  palette: import("@/components/design-tokens").Palette;
  displayFont: import("@/components/design-tokens").DisplayFont;
}) {
  return (
    <div>
      <dt
        style={{
          fontFamily: displayFont.stack,
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: palette.inkSoft,
          marginBottom: 6,
        }}
      >
        {label}
      </dt>
      <dd
        style={{
          margin: 0,
          fontFamily: displayFont.stack,
          fontSize: 18,
          color: palette.ink,
        }}
      >
        {value}
      </dd>
    </div>
  );
}

function RaceMiniCard({
  race,
  palette,
  displayFont,
}: {
  race: RaceListItem;
  palette: import("@/components/design-tokens").Palette;
  displayFont: import("@/components/design-tokens").DisplayFont;
}) {
  return (
    <Link
      href={`/races/${race.slug}`}
      style={{
        display: "flex",
        flexDirection: "column",
        background: palette.paper,
        border: `1px solid ${palette.rule}`,
        textDecoration: "none",
        color: palette.ink,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          aspectRatio: "16/9",
          backgroundImage: race.hero_image ? `url(${race.hero_image})` : undefined,
          background: race.hero_image ? undefined : palette.bgAlt,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div style={{ padding: 16 }}>
        <div
          style={{
            fontFamily: "ui-monospace, monospace",
            fontSize: 10,
            letterSpacing: "0.18em",
            color: palette.inkSoft,
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          {race.country} · {MONTH_LABELS[race.start_month]}
        </div>
        <h3
          style={{
            fontFamily: displayFont.stack,
            fontSize: 20,
            fontWeight: 600,
            margin: 0,
            textTransform: "uppercase",
            letterSpacing: "-0.005em",
            lineHeight: 1.15,
          }}
        >
          {race.title_en ?? race.title}
        </h3>
        <div style={{ fontSize: 12, color: palette.inkSoft, marginTop: 4 }}>{race.title}</div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 12,
            paddingTop: 10,
            borderTop: `1px solid ${palette.rule}`,
            fontSize: 12,
            color: palette.inkSoft,
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span>{race.distance_km}km</span>
            <span style={{ display: "inline-flex", gap: 4 }}>
              {race.terrain.map((t) => (
                <TerrainIcon key={t} terrain={t} size={12} />
              ))}
            </span>
          </span>
          <span style={{ color: palette.accent }}>
            <Stars n={race.difficulty} />
          </span>
        </div>
      </div>
    </Link>
  );
}
