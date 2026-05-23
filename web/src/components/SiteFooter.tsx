import Link from "next/link";
import { Mark } from "./Brand";
import type { Palette, DisplayFont } from "./design-tokens";
import { VisitorCounter } from "./VisitorCounter";
import styles from "./SiteFooter.module.css";

interface FooterItem {
  label: string;
  href?: string;
  external?: boolean;
}

export function SiteFooter({ palette, displayFont }: { palette: Palette; displayFont: DisplayFont }) {
  return (
    <footer
      className={styles.footer}
      style={{
        borderTop: `1px solid ${palette.rule}`,
        background: palette.bgAlt,
        color: palette.ink,
      }}
    >
      <div className={styles.cols}>
        <div className={styles.brandLead}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Mark color={palette.ink} size={26} />
            <div
              style={{
                fontFamily: displayFont.stack,
                fontWeight: 600,
                letterSpacing: "0.06em",
                fontSize: 16,
                textTransform: "uppercase",
              }}
            >
              Stage Race
            </div>
          </div>
          <p style={{ fontSize: 12, lineHeight: 1.7, color: palette.inkSoft, maxWidth: 320 }}>
            世界中のステージレースを、日本人ウルトラランナーに届ける記録庫。レポートと装備の情報、参加までの道筋を扱います。
          </p>
        </div>
        {(
          [
            {
              h: "Explore",
              items: [
                { label: "Races", href: "/races" } as FooterItem,
                { label: "Partners", href: "/partners" } as FooterItem,
              ],
            },
            {
              h: "About",
              items: [
                { label: "このサイトについて", href: "/about" } as FooterItem,
                { label: "Contact", href: "/contact" } as FooterItem,
                { label: "Disclosure", href: "/disclosure" } as FooterItem,
              ],
            },
            {
              h: "Connect",
              items: [
                { label: "X / Twitter" } as FooterItem,
                { label: "Instagram" } as FooterItem,
                { label: "Newsletter" } as FooterItem,
              ],
            },
          ] as { h: string; items: FooterItem[] }[]
        ).map((col) => (
          <div key={col.h}>
            <div
              style={{
                fontFamily: displayFont.stack,
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: palette.inkSoft,
                marginBottom: 12,
              }}
            >
              {col.h}
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {col.items.map((i) => (
                <li key={i.label} style={{ fontSize: 13, color: palette.ink }}>
                  {i.href ? (
                    <Link href={i.href} style={{ color: palette.ink, textDecoration: "none" }}>
                      {i.label}
                    </Link>
                  ) : (
                    <span style={{ color: palette.inkSoft }}>{i.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div
        className={styles.bottom}
        style={{ color: palette.inkSoft, borderTop: `1px solid ${palette.rule}` }}
      >
        <span>© 2026 Stage Race Archive</span>
        <VisitorCounter color={palette.inkSoft} />
        <span style={{ fontFamily: displayFont.stack, letterSpacing: "0.18em", textTransform: "uppercase" }}>
          Run · Endure · Return
        </span>
      </div>
    </footer>
  );
}
