import {
  PALETTES,
  DISPLAY_FONTS,
  SELECTED_PALETTE_KEY,
  SELECTED_FONT_KEY,
} from "@/components/design-tokens";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import styles from "../static-pages.module.css";

export const metadata = {
  title: "Disclosure — Stage Race",
  description:
    "アフィリエイト・スポンサー提携・送客リンクに関する開示。景品表示法および「ステマ規制」への対応方針を記載しています。",
};

export default function DisclosurePage() {
  const palette = PALETTES[SELECTED_PALETTE_KEY];
  const displayFont = DISPLAY_FONTS[SELECTED_FONT_KEY];

  return (
    <div style={{ background: palette.bg, color: palette.ink, fontFamily: '"Noto Sans JP", sans-serif' }}>
      <SiteHeader palette={palette} displayFont={displayFont} variant="A" />

      {/* Hero */}
      <section className={styles.heroSection} style={{ maxWidth: 880 }}>
        <div className={styles.heroLabel} style={{ color: palette.inkSoft }}>
          Disclosure
        </div>
        <h1 className={styles.heroTitleMd} style={{ fontFamily: displayFont.stack }}>
          Affiliate &amp;<br />
          Sponsorship<br />
          <span style={{ color: palette.accent }}>Disclosure.</span>
        </h1>
      </section>

      {/* Content */}
      <section className={styles.section} style={{ maxWidth: 760 }}>
        <Body palette={palette} displayFont={displayFont} />
      </section>

      <SiteFooter palette={palette} displayFont={displayFont} />
    </div>
  );
}

function Body({
  palette,
  displayFont,
}: {
  palette: import("@/components/design-tokens").Palette;
  displayFont: import("@/components/design-tokens").DisplayFont;
}) {
  const sections: { n: string; t: string; body: string[] }[] = [
    {
      n: "01",
      t: "リンクに含まれる送客の種類",
      body: [
        "本サイトには、装備メーカー・販売店・大会主催者・旅行手配会社などへのリンクが含まれます。これらのリンクには次のいずれかの形態が含まれることがあります。",
        "・アフィリエイトリンク（リンク経由の購入で本サイトに紹介料が支払われるもの）",
        "・スポンサー提携先へのリンク（提携契約に基づき送客するもの）",
        "・編集判断のみで掲載している通常のリンク（金銭の授受はないもの）",
        "アフィリエイトおよびスポンサー提携を含むリンクには、可能な限り「Affiliate」または「Sponsored」の表示を付しています。",
      ],
    },
    {
      n: "02",
      t: "編集判断との独立性",
      body: [
        "金銭的な提携の有無は、レースやレポートの紹介順序・評価に影響を与えません。掲載するパートナーや装備の選定は、実際にステージレースを走ったランナーの判断と編集部の判断に基づきます。",
        "提携先からの「肯定的な紹介に書き換えてほしい」「ネガティブな記述を削除してほしい」といった依頼には応じません。",
      ],
    },
    {
      n: "03",
      t: "法令遵守について",
      body: [
        "本サイトは、景品表示法および 2023 年 10 月施行の「一般消費者が事業者の表示であることを判別することが困難である表示」（いわゆるステルスマーケティング規制）への対応として、商業的提携を含むリンクおよび記事に明示的な表示を行います。",
        "また、薬機法や著作権法など、関連する法令に従って情報を掲載します。",
      ],
    },
    {
      n: "04",
      t: "誤りに気付いた場合",
      body: [
        "リンクの状態（リンク切れ・誤った提携表示など）や記事内容に誤りを見つけた場合は、サイト下部の連絡先からご報告ください。確認のうえ、速やかに修正します。",
      ],
    },
    {
      n: "05",
      t: "改定について",
      body: [
        "本ポリシーは、提携の状況や法令の変更に応じて改定されることがあります。重要な変更があった場合はサイト上で告知します。",
      ],
    },
  ];

  return (
    <div>
      {sections.map((s) => (
        <article key={s.n} style={{ marginBottom: 56 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
            <span
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: 11,
                letterSpacing: "0.2em",
                color: palette.inkSoft,
              }}
            >
              {s.n}
            </span>
            <h2
              style={{
                fontFamily: displayFont.stack,
                fontSize: "clamp(18px, 4.5vw, 24px)",
                fontWeight: 600,
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: "-0.005em",
                lineHeight: 1.25,
              }}
            >
              {s.t}
            </h2>
          </div>
          {s.body.map((p, i) => (
            <p
              key={i}
              style={{
                fontFamily: '"Noto Sans JP", sans-serif',
                fontSize: 15,
                lineHeight: 2,
                color: palette.ink,
                margin: "0 0 12px",
                whiteSpace: "pre-wrap",
              }}
            >
              {p}
            </p>
          ))}
        </article>
      ))}
      <div
        style={{
          marginTop: 64,
          padding: "20px 24px",
          background: palette.bgAlt,
          fontSize: 12,
          color: palette.inkSoft,
          fontFamily: "ui-monospace, monospace",
          letterSpacing: "0.04em",
        }}
      >
        最終更新：2026-05-06
      </div>
    </div>
  );
}
