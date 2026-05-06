import Link from "next/link";
import type { Palette, DisplayFont } from "./design-tokens";
import { Mark } from "./Brand";

interface SiteHeaderProps {
  palette: Palette;
  displayFont: DisplayFont;
  current?: "home" | "races" | "reports" | "partners" | "about";
  variant?: "A" | "B";
}

export function SiteHeader({ palette, displayFont, current = "home", variant = "A" }: SiteHeaderProps) {
  const isB = variant === "B";
  return (
    <header
      style={{
        position: "relative",
        zIndex: 10,
        borderBottom: isB ? "none" : `1px solid ${palette.rule}`,
        background: isB ? "transparent" : palette.paper,
        color: palette.ink,
        padding: isB ? "20px 32px" : "16px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
        <Mark color={isB ? "#fff" : palette.ink} size={28} />
        <div style={{ lineHeight: 1.1 }}>
          <div
            style={{
              fontFamily: displayFont.stack,
              fontWeight: 600,
              letterSpacing: "0.04em",
              fontSize: 17,
              color: isB ? "#fff" : palette.ink,
              textTransform: "uppercase",
            }}
          >
            STAGE&nbsp;RACE
          </div>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.18em",
              color: isB ? "rgba(255,255,255,0.7)" : palette.inkSoft,
              textTransform: "uppercase",
            }}
          >
            World Edition · 日本語
          </div>
        </div>
      </Link>
      <nav style={{ display: "flex", gap: 28, alignItems: "center" }}>
        {[
          { id: "home", label: "Home", href: "/" },
          { id: "races", label: "Races", href: "/races" },
          { id: "partners", label: "Partners", href: "/partners" },
          { id: "about", label: "About", href: "/about" },
        ].map((item) => (
          <Link
            key={item.id}
            href={item.href}
            style={{
              fontFamily: displayFont.stack,
              fontWeight: 500,
              fontSize: 13,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: isB ? "#fff" : palette.ink,
              opacity: current === item.id ? 1 : 0.6,
              borderBottom:
                current === item.id ? `1.5px solid ${isB ? "#fff" : palette.accent}` : "1.5px solid transparent",
              paddingBottom: 2,
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
