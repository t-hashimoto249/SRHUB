import {
  PALETTES,
  DISPLAY_FONTS,
  SELECTED_PALETTE_KEY,
  SELECTED_FONT_KEY,
} from "@/components/design-tokens";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import styles from "../static-pages.module.css";
import formStyles from "./contact.module.css";
import { ContactForm } from "./ContactForm";

export const metadata = {
  title: "Contact — Stage Race",
  description:
    "ステージレースに関する記事の補足、誤りの報告、装備パートナーやレース主催者からのご連絡など、編集部へのお問い合わせ窓口。",
};

export default function ContactPage() {
  const palette = PALETTES[SELECTED_PALETTE_KEY];
  const displayFont = DISPLAY_FONTS[SELECTED_FONT_KEY];

  return (
    <div style={{ background: palette.bg, color: palette.ink, fontFamily: '"Noto Sans JP", sans-serif' }}>
      <SiteHeader palette={palette} displayFont={displayFont} variant="A" />

      <section className={styles.heroSection}>
        <div className={styles.heroLabel} style={{ color: palette.inkSoft }}>
          Contact
        </div>
        <h1 className={styles.heroTitleMd} style={{ fontFamily: displayFont.stack }}>
          Write to the<br />
          <span style={{ color: palette.accent }}>editorial desk.</span>
        </h1>
      </section>

      <section className={styles.section}>
        <div
          className={formStyles.formGrid}
          style={{ borderTop: `1px solid ${palette.rule}` }}
        >
          <div>
            <div
              className={formStyles.sectionLabel}
              style={{ color: palette.inkSoft, fontFamily: displayFont.stack }}
            >
              About this form
            </div>
            <p className={formStyles.intro} style={{ color: palette.ink }}>
              レポートの補足や誤りの指摘、装備パートナー・レース主催者からのご連絡、取材・寄稿のご相談などを受け付けています。
            </p>
            <ul className={formStyles.metaList} style={{ color: palette.ink }}>
              <li>
                <span className={formStyles.metaKey} style={{ color: palette.inkSoft }}>
                  Response
                </span>
                <span style={{ color: palette.inkSoft }}>通常 3〜7 日</span>
              </li>
              <li>
                <span className={formStyles.metaKey} style={{ color: palette.inkSoft }}>
                  Language
                </span>
                <span style={{ color: palette.inkSoft }}>日本語 / English</span>
              </li>
              <li>
                <span className={formStyles.metaKey} style={{ color: palette.inkSoft }}>
                  Privacy
                </span>
                <span style={{ color: palette.inkSoft }}>
                  ご記入いただいた内容は返信目的のみに使用します。
                </span>
              </li>
            </ul>
          </div>

          <ContactForm palette={palette} displayFont={displayFont} />
        </div>
      </section>

      <SiteFooter palette={palette} displayFont={displayFont} />
    </div>
  );
}
