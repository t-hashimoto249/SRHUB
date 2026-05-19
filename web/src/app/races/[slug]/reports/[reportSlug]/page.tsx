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
import { LikeButton } from "@/components/LikeButton";
import type { Contact, ContactMethod } from "@/types/content";
import styles from "./page.module.css";

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
      <section className={styles.titleSection}>
        <div className={styles.breadcrumb} style={{ color: palette.inkSoft }}>
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

        <div style={{ marginBottom: 20 }}>
          <PurposeBadge purpose={report.purpose} displayFont={displayFont} size="lg" />
        </div>

        <h1 className={styles.title} style={{ color: palette.ink }}>
          {report.title}
        </h1>

        <div className={styles.metaRow} style={{ color: palette.inkSoft }}>
          <span>@{report.contributor}</span>
          <span>{report.date}</span>
          <span>
            {race.country} · {MONTH_LABELS[race.start_month]} {race.duration_days}d
          </span>
        </div>

        <div style={{ marginTop: 20 }}>
          <LikeButton slug={report.slug} palette={palette} displayFont={displayFont} />
        </div>
      </section>

      {report.hero_image && (
        <section className={styles.heroSection}>
          <div
            className={styles.heroImage}
            style={{ backgroundImage: `url(${report.hero_image})` }}
          />
        </section>
      )}

      <section className={styles.calloutSection}>
        <p
          className={styles.callout}
          style={{ color: palette.ink, borderLeft: `3px solid ${purposeMeta.color}` }}
        >
          {report.summary}
        </p>
      </section>

      {report.attachments && report.attachments.length > 0 && (
        <section className={styles.attachmentSection}>
          <AttachmentList attachments={report.attachments} palette={palette} displayFont={displayFont} />
        </section>
      )}

      <section className={styles.bodySection}>
        <article
          className="report-body"
          style={{
            fontFamily: '"Noto Sans JP", sans-serif',
            fontSize: 15,
            lineHeight: 1.95,
            color: palette.ink,
          }}
          dangerouslySetInnerHTML={{ __html: report.contentHtml }}
        />
        <style>{`
          .report-body { font-size: 15px; }
          @media (min-width: 768px) { .report-body { font-size: 16px; } }
          .report-body h2 {
            font-family: ${displayFont.stack};
            font-size: 22px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: -0.005em;
            margin: 48px 0 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid ${palette.rule};
            color: ${palette.ink};
          }
          @media (min-width: 768px) {
            .report-body h2 { font-size: 28px; margin: 64px 0 20px; }
          }
          .report-body h3 {
            font-family: ${displayFont.stack};
            font-size: 16px;
            font-weight: 600;
            letter-spacing: 0.04em;
            margin: 28px 0 10px;
            color: ${palette.accentDeep};
          }
          @media (min-width: 768px) {
            .report-body h3 { font-size: 18px; margin: 36px 0 12px; }
          }
          .report-body p { margin: 16px 0; }
          .report-body ul { padding-left: 1.4em; margin: 16px 0; }
          .report-body li { margin: 6px 0; }
          .report-body a {
            color: ${palette.accent};
            text-decoration: underline;
            text-underline-offset: 3px;
          }
          .report-body strong { color: ${palette.accentDeep}; }
          .report-body .report-media {
            margin: 28px auto;
            max-width: 720px;
          }
          .report-body .report-media video,
          .report-body .report-media img {
            display: block;
            width: 100%;
            max-height: 70vh;
            object-fit: contain;
            background: #000;
            border: 1px solid ${palette.rule};
          }
          .report-body .report-media-photo img {
            background: ${palette.bgAlt};
          }
          .report-body .report-media-iframe-wrap {
            position: relative;
            width: 100%;
            padding-top: 56.25%;
            background: #000;
            border: 1px solid ${palette.rule};
          }
          .report-body .report-media-iframe-wrap iframe {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            border: 0;
          }
          .report-body .report-media a {
            display: block;
            text-decoration: none;
            border: 0;
          }
          .report-body .report-media figcaption {
            margin-top: 8px;
            text-align: center;
            font-size: 12px;
            color: ${palette.inkSoft};
          }
        `}</style>
      </section>

      {report.gallery && report.gallery.length > 0 && (
        <section className={styles.gallerySection}>
          <Gallery items={report.gallery} palette={palette} displayFont={displayFont} />
        </section>
      )}

      {contributor && (
        <section className={styles.contributorSection}>
          <div
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: palette.inkSoft,
              marginBottom: 14,
            }}
          >
            About the contributor
          </div>
          <article
            className={styles.contributorCard}
            style={{
              border: `1px solid ${palette.rule}`,
              background: palette.paper,
            }}
          >
            <div
              className={styles.contributorAvatar}
              style={{
                backgroundImage: contributor.avatar ? `url(${contributor.avatar})` : undefined,
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
              <h3
                className={styles.contributorName}
                style={{ fontFamily: displayFont.stack, color: palette.ink }}
              >
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

      {relatedReports.length > 0 && (
        <section className={styles.relatedSection}>
          <div
            className={styles.relatedHeader}
            style={{ borderBottom: `1px solid ${palette.rule}` }}
          >
            <h2 className={styles.relatedTitle} style={{ fontFamily: displayFont.stack }}>
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
          <div className={styles.relatedGrid}>
            {relatedReports.map((r) => (
              <ReportCard key={r.slug} report={r} palette={palette} displayFont={displayFont} />
            ))}
          </div>
        </section>
      )}

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
            Back to race
          </div>
          <div className={styles.ctaTitle} style={{ fontFamily: displayFont.stack }}>
            {race.title_en ?? race.title}
          </div>
        </div>
        <Link
          href={`/races/${race.slug}`}
          className={styles.ctaButton}
          style={{ background: palette.bg, color: palette.ink, fontFamily: displayFont.stack }}
        >
          Race Page →
        </Link>
      </section>

      <SiteFooter palette={palette} displayFont={displayFont} />
    </div>
  );
}
