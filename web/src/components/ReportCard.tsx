import Link from "next/link";
import type { Report } from "@/types/content";
import type { Palette, DisplayFont } from "./design-tokens";
import { PurposeBadge } from "./PurposeBadge";

export function ReportCard({
  report,
  palette,
  displayFont,
}: {
  report: Report;
  palette: Palette;
  displayFont: DisplayFont;
}) {
  return (
    <Link
      href={`/races/${report.race_slug}/reports/${report.slug}`}
      style={{
        display: "grid",
        gridTemplateColumns: "180px 1fr",
        gap: 20,
        cursor: "pointer",
        borderTop: `1px solid ${palette.rule}`,
        paddingTop: 20,
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          aspectRatio: "4/5",
          backgroundImage: report.hero_image ? `url(${report.hero_image})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          background: report.hero_image ? undefined : palette.bgAlt,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: 12 }}>
          <PurposeBadge purpose={report.purpose} displayFont={displayFont} />
        </div>
        <h4
          style={{
            fontFamily: '"Noto Serif JP", serif',
            fontSize: 19,
            lineHeight: 1.5,
            fontWeight: 600,
            margin: 0,
            color: palette.ink,
          }}
        >
          {report.title}
        </h4>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: palette.inkSoft, marginTop: 10, marginBottom: "auto" }}>
          {report.summary}
        </p>
        <div
          style={{
            marginTop: 12,
            fontSize: 11,
            color: palette.inkSoft,
            fontFamily: "ui-monospace, monospace",
            letterSpacing: "0.1em",
          }}
        >
          @{report.contributor} · {report.date}
        </div>
      </div>
    </Link>
  );
}
