import Link from "next/link";
import { getAllPartners } from "@/lib/content";
import {
  PALETTES,
  DISPLAY_FONTS,
  SELECTED_PALETTE_KEY,
  SELECTED_FONT_KEY,
} from "@/components/design-tokens";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { Partner, PartnerCategory } from "@/types/content";

const CATEGORY_ORDER: PartnerCategory[] = [
  "装備",
  "販売店・EC",
  "主催・大会運営",
  "旅行・現地手配",
  "メディア・教育",
  "その他",
];

export default async function PartnersPage() {
  const partners = await getAllPartners();
  const palette = PALETTES[SELECTED_PALETTE_KEY];
  const displayFont = DISPLAY_FONTS[SELECTED_FONT_KEY];

  const featured = partners.filter((p) => p.featured);
  const grouped = new Map<PartnerCategory, Partner[]>();
  for (const cat of CATEGORY_ORDER) grouped.set(cat, []);
  for (const p of partners.filter((p) => !p.featured)) {
    if (!grouped.has(p.category)) grouped.set(p.category, []);
    grouped.get(p.category)!.push(p);
  }

  return (
    <div style={{ background: palette.bg, color: palette.ink, fontFamily: '"Noto Sans JP", sans-serif' }}>
      <SiteHeader palette={palette} displayFont={displayFont} variant="A" current="partners" />

      {/* Hero */}
      <section style={{ padding: "96px 48px 48px", maxWidth: 1100 }}>
        <div
          style={{
            fontFamily: "ui-monospace, monospace",
            fontSize: 10,
            letterSpacing: "0.24em",
            color: palette.inkSoft,
            marginBottom: 20,
            textTransform: "uppercase",
          }}
        >
          Partners
        </div>
        <h1
          style={{
            fontFamily: displayFont.stack,
            fontSize: 80,
            fontWeight: 600,
            margin: 0,
            lineHeight: 0.92,
            textTransform: "uppercase",
            letterSpacing: "-0.015em",
          }}
        >
          The gear, the
          <br />
          <span style={{ color: palette.accent }}>people, the path.</span>
        </h1>
        <p
          style={{
            fontFamily: '"Noto Serif JP", serif',
            fontSize: 18,
            lineHeight: 1.95,
            color: palette.inkSoft,
            marginTop: 28,
            maxWidth: 760,
          }}
        >
          ステージレースを走るとき、頼れるのは過去に走った人と、それを支えた装備・主催者・販売店です。このページではサイトが信頼してリンクしているパートナーをまとめています。
        </p>
        <div
          style={{
            marginTop: 24,
            padding: "14px 18px",
            borderLeft: `3px solid ${palette.accent}`,
            background: palette.bgAlt,
            fontSize: 13,
            lineHeight: 1.8,
            color: palette.inkSoft,
            maxWidth: 760,
          }}
        >
          一部のリンクはアフィリエイト・スポンサー提携を含みます。詳細は{" "}
          <Link href="/disclosure" style={{ color: palette.accentDeep, textDecoration: "underline" }}>
            Disclosure
          </Link>
          {" "}をご覧ください。評価と紹介順序は実際に使ったランナーの判断を優先します。
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section style={{ padding: "0 48px 64px", maxWidth: 1100 }}>
          <SectionHeading n="Featured" palette={palette} displayFont={displayFont} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 20 }}>
            {featured.map((p) => (
              <PartnerCard key={p.id} partner={p} palette={palette} displayFont={displayFont} large />
            ))}
          </div>
        </section>
      )}

      {/* Grouped by category */}
      {[...grouped.entries()]
        .filter(([, list]) => list.length > 0)
        .map(([cat, list]) => (
          <section key={cat} style={{ padding: "0 48px 64px", maxWidth: 1100 }}>
            <SectionHeading n={cat} palette={palette} displayFont={displayFont} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
              {list.map((p) => (
                <PartnerCard key={p.id} partner={p} palette={palette} displayFont={displayFont} />
              ))}
            </div>
          </section>
        ))}

      {partners.length === 0 && (
        <section style={{ padding: "0 48px 120px", maxWidth: 1100 }}>
          <div
            style={{
              padding: "60px 24px",
              textAlign: "center",
              border: `1px dashed ${palette.rule}`,
              color: palette.inkSoft,
              fontSize: 14,
              lineHeight: 1.8,
            }}
          >
            パートナーは準備中です。
            <br />
            装備・主催者・販売店との提携が決まり次第、こちらに追加していきます。
          </div>
        </section>
      )}

      {/* CTA */}
      <section
        style={{
          background: palette.ink,
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
              opacity: 0.6,
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Want to partner with us?
          </div>
          <div
            style={{
              fontFamily: displayFont.stack,
              fontSize: 32,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "-0.005em",
            }}
          >
            Contact editorial.
          </div>
        </div>
        <Link
          href="/about"
          style={{
            padding: "14px 24px",
            border: `1px solid ${palette.bg}`,
            fontFamily: displayFont.stack,
            fontWeight: 600,
            fontSize: 13,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: palette.bg,
            textDecoration: "none",
          }}
        >
          About →
        </Link>
      </section>

      <SiteFooter palette={palette} displayFont={displayFont} />
    </div>
  );
}

function SectionHeading({
  n,
  palette,
  displayFont,
}: {
  n: string;
  palette: import("@/components/design-tokens").Palette;
  displayFont: import("@/components/design-tokens").DisplayFont;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 16,
        borderBottom: `1px solid ${palette.rule}`,
        paddingBottom: 14,
        marginBottom: 28,
      }}
    >
      <h2
        style={{
          fontFamily: displayFont.stack,
          fontSize: 28,
          fontWeight: 600,
          margin: 0,
          textTransform: "uppercase",
          letterSpacing: "-0.005em",
        }}
      >
        {n}
      </h2>
    </div>
  );
}

function PartnerCard({
  partner,
  palette,
  displayFont,
  large = false,
}: {
  partner: Partner;
  palette: import("@/components/design-tokens").Palette;
  displayFont: import("@/components/design-tokens").DisplayFont;
  large?: boolean;
}) {
  return (
    <a
      href={partner.url}
      target="_blank"
      rel={partner.affiliate ? "noopener noreferrer sponsored" : "noopener noreferrer"}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: large ? 28 : 22,
        border: `1px solid ${palette.rule}`,
        background: large ? palette.paper : "transparent",
        color: palette.ink,
        textDecoration: "none",
        borderLeft: large ? `3px solid ${palette.accent}` : `1px solid ${palette.rule}`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div
          style={{
            fontFamily: displayFont.stack,
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: palette.inkSoft,
          }}
        >
          {partner.category}
        </div>
        {partner.affiliate && (
          <span
            style={{
              fontFamily: displayFont.stack,
              fontSize: 9,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: palette.accent,
              border: `1px solid ${palette.accent}`,
              padding: "2px 6px",
            }}
          >
            Affiliate
          </span>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {partner.logo && (
          <div
            style={{
              width: 56,
              height: 56,
              backgroundImage: `url(${partner.logo})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              flex: "0 0 56px",
            }}
          />
        )}
        <h3
          style={{
            fontFamily: displayFont.stack,
            fontSize: large ? 28 : 22,
            fontWeight: 600,
            margin: 0,
            color: palette.ink,
            textTransform: "uppercase",
            letterSpacing: "-0.005em",
            lineHeight: 1.15,
          }}
        >
          {partner.name}
        </h3>
      </div>
      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.8, color: palette.inkSoft }}>{partner.description}</p>
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
        Visit Site ↗
      </div>
    </a>
  );
}
