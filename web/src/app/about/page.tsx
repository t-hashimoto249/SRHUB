import Link from "next/link";
import { getAllContributors } from "@/lib/content";
import {
  PALETTES,
  DISPLAY_FONTS,
  SELECTED_PALETTE_KEY,
  SELECTED_FONT_KEY,
} from "@/components/design-tokens";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import styles from "../static-pages.module.css";

export default async function AboutPage() {
  const contributors = await getAllContributors();
  const palette = PALETTES[SELECTED_PALETTE_KEY];
  const displayFont = DISPLAY_FONTS[SELECTED_FONT_KEY];

  return (
    <div style={{ background: palette.bg, color: palette.ink, fontFamily: '"Noto Sans JP", sans-serif' }}>
      <SiteHeader palette={palette} displayFont={displayFont} variant="A" current="about" />

      {/* Hero copy */}
      <section className={styles.heroSectionXL}>
        <div className={styles.heroLabel} style={{ color: palette.inkSoft }}>
          About this site
        </div>
        <h1 className={styles.heroTitleXL} style={{ fontFamily: displayFont.stack }}>
          For those who
          <br />
          <span style={{ color: palette.accent }}>
            run further
            <br />
            than the finish.
          </span>
        </h1>
      </section>

      {/* Mission */}
      <section className={styles.section}>
        <div className={styles.missionGrid} style={{ borderTop: `1px solid ${palette.rule}` }}>
          <div
            style={{
              fontFamily: displayFont.stack,
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: palette.inkSoft,
            }}
          >
            Mission
          </div>
          <div>
            <p className={styles.missionLead} style={{ color: palette.ink }}>
              ステージレースは、一晩では理解できない競技です。装備、エントリーの段取り、現地の気候、過去の参加者の声——必要な情報は分散しています。
            </p>
            <p className={styles.missionBody} style={{ color: palette.inkSoft }}>
              このサイトは、世界中のステージレースに関する一次情報を、日本語で集約することを目的としています。完走者のレポート、装備リスト、エントリーまでの実装的な道筋。走る人たちの記録に、実際に役立つ装備・販売店・主催者へのリンクを添えて届けます。
            </p>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className={styles.sectionWide} style={{ background: palette.bgAlt }}>
        <div
          style={{
            fontFamily: displayFont.stack,
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: palette.inkSoft,
            marginBottom: 48,
          }}
        >
          Editorial Principles
        </div>
        <div className={styles.principlesGrid}>
          {[
            {
              n: "01",
              t: "Primary sources only",
              d: "主催者の公式情報と、実際に走った人の言葉のみを扱います。要約された二次情報は載せません。",
            },
            {
              n: "02",
              t: "Practical over poetic",
              d: "装備の重さ、レースの距離、現地の気温——意思決定に使える具体的な数字を優先します。",
            },
            {
              n: "03",
              t: "Trusted partners",
              d: "装備メーカー・主催者・販売店へのリンクを積極的に掲載し、読者の装備選びとエントリー手続きを後押しします。アフィリエイトやスポンサー提携を含む場合でも、評価と紹介順序は実際に走ったランナーの判断を優先します。",
            },
          ].map((p) => (
            <div key={p.n} style={{ borderTop: `2px solid ${palette.accent}`, paddingTop: 18 }}>
              <div
                style={{
                  fontFamily: "ui-monospace, monospace",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  color: palette.inkSoft,
                  marginBottom: 14,
                }}
              >
                {p.n}
              </div>
              <h3 className={styles.principleTitle} style={{ fontFamily: displayFont.stack }}>
                {p.t}
              </h3>
              <p style={{ marginTop: 12, fontSize: 14, lineHeight: 1.85, color: palette.inkSoft }}>{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contributors */}
      {contributors.length > 0 && (
        <section className={styles.sectionWideTall}>
          <div
            className={styles.contributorsHeader}
            style={{ borderBottom: `1px solid ${palette.rule}` }}
          >
            <h2 className={styles.contributorsTitle} style={{ fontFamily: displayFont.stack }}>
              Contributors
            </h2>
            <div
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: 11,
                color: palette.inkSoft,
                letterSpacing: "0.16em",
              }}
            >
              {contributors.length} runners
            </div>
          </div>
          <div className={styles.contributorsGrid}>
            {contributors.map((c) => (
              <article key={c.id} className={styles.contributorCard}>
                <div
                  className={styles.contributorAvatar}
                  style={{
                    backgroundImage: c.avatar ? `url(${c.avatar})` : undefined,
                    background: c.avatar ? undefined : palette.bgAlt,
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
                    @{c.id}
                  </div>
                  <h3 className={styles.contributorName} style={{ fontFamily: displayFont.stack, color: palette.ink }}>
                    {c.name}
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.8, color: palette.inkSoft, marginTop: 10 }}>{c.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Contribute CTA */}
      <section className={styles.cta} style={{ background: palette.ink, color: palette.bg }}>
        <div>
          <div
            style={{
              fontFamily: displayFont.stack,
              fontSize: 11,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              opacity: 0.6,
              marginBottom: 12,
            }}
          >
            Have you run one?
          </div>
          <div className={styles.ctaTitle} style={{ fontFamily: displayFont.stack }}>
            Share your report.
          </div>
        </div>
        <Link
          href="/contact"
          className={styles.ctaButton}
          style={{
            border: `1px solid ${palette.bg}`,
            fontFamily: displayFont.stack,
            color: palette.bg,
          }}
        >
          Contact Editorial →
        </Link>
      </section>

      <SiteFooter palette={palette} displayFont={displayFont} />
    </div>
  );
}
