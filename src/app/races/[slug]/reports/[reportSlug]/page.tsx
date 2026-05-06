import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllReports,
  getRaceBySlug,
  getReportBySlug,
  getReportsByRace,
  getContributorById,
} from "@/lib/content";
import {
  PALETTES,
  DISPLAY_FONTS,
  SELECTED_PALETTE_KEY,
  SELECTED_FONT_KEY,
  PURPOSE_META,
  MONTH_LABELS,
} from "@/components/design-tokens";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PurposeBadge } from "@/components/PurposeBadge";
import { ReportCard } from "@/components/ReportCard";
import { AttachmentList } from "@/components/AttachmentList";
import { Gallery } from "@/components/Gallery";
import type { Contact, ContactMethod } from "@/types/content";

export async function generateStaticParams() {
  const reports = await getAllReports();
  return reports.map((r) => ({ slug: r.race_slug, reportSlug: r.slug }));
}

const CONTACT_LABEL: Record<ContactMethod, string> = {
  email: "Email",
  x: "X / Twitter",
  instagram: "Instagram",
  youtube: "YouTube",
  facebook: "Facebook",
  website: "Website",
};

function contactHref(c: Contact): string {
  if (c.method === "email" && !c.value.startsWith("mailto:")) return `mailto:${c.value}`;
  return c.value;
}

interface PageProps {
  params: Promise<{ slug: string; reportSlug: string }>;
}

export default async function ReportDetailPage({ params }: PageProps) {
  const { slug, reportSlug } = await params;
  const report = await getReportBySlug(reportSlug);
  if (!report || report.race_slug !== slug) notFound();

  const race = await getRaceBySlug(slug);
  if (!race) notFound();

  const contributor = await getContributorById(report.contributor);
  const allReportsForRace = await getReportsByRace(slug);
  const relatedReports = allReportsForRace.filter((r) => r.slug !== report.slug).slice(0, 3);

  const palette = PALETTES[SELECTED_PALETTE_KEY];
  const displayFont = DISPLAY_FONTS[SELECTED_FONT_KEY];
  const purposeMeta = PURPOSE_META[report.purpose];

  return (
    <div style={{ background: palette.bg, color: palette.ink, fontFamily: '"Noto Sans JP", sans-serif' }}>
      <SiteHeader palette={palette} displayFont={displayFont} variant="A" current="races" />

      {/* タイトルブロック */}
      <section style={{ padding: "64px 48px 48px", maxWidth: 1100 }}>
        {/* breadcrumb */}
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            fontFamily: "ui-monospace, monospace",
            fontSize: 11,
            letterSpacing: "0.16em",
            color: palette.inkSoft,
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          <Link href="/races" style={{ color: palette.inkSoft, textDecoration: "none" }}>
            Races
          </Link>
          <span>›</span>
          <Link href={`/races/${race.slug}`} style={{ color: palette.inkSoft, textDecoration: "none" }}>
            {race.title_en ?? race.title}
          </Link>
          <span>›</span>
          <span style={{ color: palette.ink }}>Report</span>
        </div>

        {/* purpose badge */}
        <div style={{ marginBottom: 20 }}>
          <PurposeBadge purpose={report.purpose} displayFont={displayFont} size="lg" />
        </div>

        {/* title */}
        <h1
          style={{
            fontFamily: '"Noto Serif JP", serif',
            fontSize: 48,
            fontWeight: 600,
            lineHeight: 1.35,
            margin: 0,
            color: palette.ink,
            letterSpacing: "0.01em",
          }}
        >
          {report.title}
        </h1>

        {/* meta */}
        <div
          style={{
            marginTop: 28,
            display: "flex",
            gap: 24,
            alignItems: "baseline",
            fontFamily: "ui-monospace, monospace",
            fontSize: 12,
            letterSpacing: "0.1em",
            color: palette.inkSoft,
          }}
        >
          <span>@{report.contributor}</span>
          <span>{report.date}</span>
          <span>
            {race.country} · {MONTH_LABELS[race.start_month]} {race.duration_days}d
          </span>
        </div>
      </section>

      {/* hero image */}
      {report.hero_image && (
        <section style={{ padding: "0 48px 48px" }}>
          <div
            style={{
              aspectRatio: "16/7",
              backgroundImage: `url(${report.hero_image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </section>
      )}

      {/* summary callout */}
      <section style={{ padding: "0 48px 48px", maxWidth: 1100 }}>
        <p
          style={{
            fontFamily: '"Noto Serif JP", serif',
            fontSize: 22,
            lineHeight: 1.85,
            margin: 0,
            color: palette.ink,
            paddingLeft: 24,
            borderLeft: `3px solid ${purposeMeta.color}`,
          }}
        >
          {report.summary}
        </p>
      </section>

      {/* attachments */}
      {report.attachments && report.attachments.length > 0 && (
        <section style={{ padding: "0 48px 64px", maxWidth: 1100 }}>
          <AttachmentList attachments={report.attachments} palette={palette} displayFont={displayFont} />
        </section>
      )}

      {/* body */}
      <section style={{ padding: "0 48px 80px", maxWidth: 880 }}>
        <article
          className="report-body"
          style={{
            fontFamily: '"Noto Sans JP", sans-serif',
            fontSize: 16,
            lineHeight: 1.95,
            color: palette.ink,
          }}
          dangerouslySetInnerHTML={{ __html: report.contentHtml }}
        />
        <style>{`
          .report-body h2 {
            font-family: ${displayFont.stack};
            font-size: 28px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: -0.005em;
            margin: 64px 0 20px;
            padding-bottom: 12px;
            border-bottom: 1px solid ${palette.rule};
            color: ${palette.ink};
          }
          .report-body h3 {
            font-family: ${displayFont.stack};
            font-size: 18px;
            font-weight: 600;
            letter-spacing: 0.04em;
            margin: 36px 0 12px;
            color: ${palette.accentDeep};
          }
          .report-body p {
            margin: 16px 0;
          }
          .report-body ul {
            padding-left: 1.4em;
            margin: 16px 0;
          }
          .report-body li {
            margin: 6px 0;
          }
          .report-body a {
            color: ${palette.accent};
            text-decoration: underline;
            text-underline-offset: 3px;
          }
          .report-body strong {
            color: ${palette.accentDeep};
          }
        `}</style>
      </section>

      {/* gallery */}
      {report.gallery && report.gallery.length > 0 && (
        <section style={{ padding: "0 48px 80px", maxWidth: 1100 }}>
          <Gallery items={report.gallery} palette={palette} displayFont={displayFont} />
        </section>
      )}

      {/* contributor card */}
      {contributor && (
        <section style={{ padding: "0 48px 80px", maxWidth: 1100 }}>
          <div
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: palette.inkSoft,
              marginBottom: 16,
            }}
          >
            About the contributor
          </div>
          <article
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr",
              gap: 24,
              padding: "28px 24px",
              border: `1px solid ${palette.rule}`,
              background: palette.paper,
            }}
          >
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                backgroundImage: contributor.avatar ? `url(${contributor.avatar})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
                background: contributor.avatar ? undefined : palette.bgAlt,
                filter: contributor.avatar ? "grayscale(0.4)" : undefined,
              }}
            />
            <div>
              <div
                style={{
                  fontFamily: "ui-monospace, monospace",
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  color: palette.inkSoft,
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                @{contributor.id}
              </div>
              <h3 style={{ fontFamily: displayFont.stack, fontSize: 26, fontWeight: 600, margin: 0, color: palette.ink }}>
                {contributor.name}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.85, color: palette.inkSoft, margin: "10px 0 16px", whiteSpace: "pre-wrap" }}>
                {contributor.bio}
              </p>
              {contributor.contacts?.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                  {contributor.contacts.map((c, i) => (
                    <a
                      key={i}
                      href={contactHref(c)}
                      target={c.method === "email" ? undefined : "_blank"}
                      rel={c.method === "email" ? undefined : "noopener noreferrer"}
                      style={{
                        fontFamily: displayFont.stack,
                        fontSize: 11,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: palette.accentDeep,
                        borderBottom: `1px solid ${palette.accentDeep}`,
                        paddingBottom: 1,
                        textDecoration: "none",
                      }}
                    >
                      {CONTACT_LABEL[c.method]} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>
          </article>
        </section>
      )}

      {/* related reports */}
      {relatedReports.length > 0 && (
        <section style={{ padding: "0 48px 100px", maxWidth: 1100 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 24,
              borderBottom: `1px solid ${palette.rule}`,
              paddingBottom: 16,
            }}
          >
            <h2
              style={{
                fontFamily: displayFont.stack,
                fontSize: 28,
                fontWeight: 600,
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: "0.02em",
              }}
            >
              Other Reports for This Race
            </h2>
            <Link
              href={`/races/${race.slug}`}
              style={{
                fontFamily: displayFont.stack,
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: palette.accentDeep,
                borderBottom: `1px solid ${palette.accentDeep}`,
                paddingBottom: 1,
                textDecoration: "none",
              }}
            >
              View All →
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
            {relatedReports.map((r) => (
              <ReportCard key={r.slug} report={r} palette={palette} displayFont={displayFont} />
            ))}
          </div>
        </section>
      )}

      {/* back to race CTA */}
      <section
        style={{
          background: palette.accentDeep,
          color: palette.bg,
          padding: "60px 48px",
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
            Back to race
          </div>
          <div
            style={{
              fontFamily: displayFont.stack,
              fontSize: 28,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "-0.005em",
            }}
          >
            {race.title_en ?? race.title}
          </div>
        </div>
        <Link
          href={`/races/${race.slug}`}
          style={{
            padding: "16px 28px",
            background: palette.bg,
            color: palette.ink,
            fontFamily: displayFont.stack,
            fontWeight: 600,
            fontSize: 13,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          Race Page →
        </Link>
      </section>

      <SiteFooter palette={palette} displayFont={displayFont} />
    </div>
  );
}
