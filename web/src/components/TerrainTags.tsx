import { TERRAIN_META } from "./design-tokens";
import type { DisplayFont } from "./design-tokens";

export function TerrainIcon({ terrain, size = 18 }: { terrain: string; size?: number }) {
  const m = TERRAIN_META[terrain] || TERRAIN_META["その他"];
  return (
    <span
      title={terrain}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: "50%",
        background: m.color,
        color: "#fff",
        fontSize: size * 0.5,
        fontFamily: "ui-monospace, monospace",
        lineHeight: 1,
      }}
    >
      {m.glyph}
    </span>
  );
}

export function TerrainTags({
  terrain,
  displayFont,
}: {
  terrain: string[];
  displayFont: DisplayFont;
}) {
  return (
    <span style={{ display: "inline-flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
      {terrain.map((t) => {
        const m = TERRAIN_META[t] || TERRAIN_META["その他"];
        return (
          <span
            key={t}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "3px 8px 3px 6px",
              border: `1px solid ${m.color}`,
              color: m.color,
              fontFamily: displayFont.stack,
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            <TerrainIcon terrain={t} size={14} />
            {t}
          </span>
        );
      })}
    </span>
  );
}
