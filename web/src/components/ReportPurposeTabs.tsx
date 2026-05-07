"use client";

import { useState } from "react";
import type { Report, ReportPurpose } from "@/types/content";
import { PURPOSE_META, type Palette, type DisplayFont } from "./design-tokens";
import { ReportCard } from "./ReportCard";

const PURPOSES: ReportPurpose[] = ["completion", "competitive", "personal"];

const PURPOSE_DESCRIPTION: Record<ReportPurpose, string> = {
  completion:
    "制限時間内に走り切ることを目標にしたランナーのレポート。装備・食事・ペース配分は「確実に完走するため」の知見に寄せています。",
  competitive:
    "タイム・順位を狙う経験豊富なランナーのレポート。最軽量装備、攻めの補給、現地での駆け引きまで踏み込んだ内容。",
  personal:
    "自分なりのテーマを持って楽しむランナーのレポート。写真、観光、テントメイトとの交流——順位以外の体験の記録。",
};

export function ReportPurposeTabs({
  reports,
  palette,
  displayFont,
}: {
  reports: Report[];
  palette: Palette;
  displayFont: DisplayFont;
}) {
  const [purpose, setPurpose] = useState<ReportPurpose | "all">("all");
  const counts: Record<string, number> = Object.fromEntries(PURPOSES.map((p) => [p, reports.filter((r) => r.purpose === p).length]));
  counts.all = reports.length;

  const filtered = purpose === "all" ? reports : reports.filter((r) => r.purpose === purpose);

  type TabSpec = { k: ReportPurpose | "all"; en: string; ja: string };
  const tabs: TabSpec[] = [
    { k: "all", en: "All", ja: "すべて" },
    ...PURPOSES.map<TabSpec>((p) => ({ k: p, en: PURPOSE_META[p].en, ja: PURPOSE_META[p].label })),
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 0,
          borderBottom: `1px solid ${palette.rule}`,
          marginBottom: 32,
          flexWrap: "wrap",
        }}
      >
        {tabs.map(({ k, en, ja }) => {
          const isActive = purpose === k;
          const m = k === "all" ? null : PURPOSE_META[k];
          return (
            <button
              key={k}
              onClick={() => setPurpose(k)}
              style={{
                padding: "16px 24px 14px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                borderBottom: isActive ? `2px solid ${m ? m.color : palette.ink}` : "2px solid transparent",
                marginBottom: -1,
                display: "flex",
                alignItems: "baseline",
                gap: 10,
                color: isActive ? palette.ink : palette.inkSoft,
              }}
            >
              {m && <span style={{ width: 8, height: 8, borderRadius: "50%", background: m.color, alignSelf: "center" }} />}
              <span
                style={{
                  fontFamily: displayFont.stack,
                  fontSize: 13,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                {en}
              </span>
              <span style={{ fontSize: 13, color: palette.inkSoft }}>{ja}</span>
              <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, color: palette.inkSoft }}>
                ({counts[k]})
              </span>
            </button>
          );
        })}
      </div>

      {purpose !== "all" && (
        <div
          style={{
            padding: "14px 18px",
            marginBottom: 28,
            background: palette.bgAlt,
            borderLeft: `3px solid ${PURPOSE_META[purpose].color}`,
            fontSize: 13,
            lineHeight: 1.7,
            color: palette.inkSoft,
          }}
        >
          {PURPOSE_DESCRIPTION[purpose]}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
        {filtered.map((r) => (
          <ReportCard key={r.slug} report={r} palette={palette} displayFont={displayFont} />
        ))}
        {!filtered.length && (
          <div
            style={{
              gridColumn: "span 2",
              padding: "60px 0",
              textAlign: "center",
              color: palette.inkSoft,
              fontSize: 14,
            }}
          >
            このカテゴリのレポートはまだありません
          </div>
        )}
      </div>
    </div>
  );
}
