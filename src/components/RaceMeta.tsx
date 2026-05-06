import type { Race } from "@/types/content";
import type { Palette, DisplayFont } from "./design-tokens";

export function RaceMeta({
  race,
  palette,
  displayFont,
  layout = "row",
}: {
  race: Race;
  palette: Palette;
  displayFont: DisplayFont;
  layout?: "row" | "col";
}) {
  const items = [
    { k: "Distance", v: `${race.distance_km} km` },
    { k: "Stages", v: `${race.stages} days` },
    { k: "Country", v: race.country },
    { k: "Continent", v: race.continent },
    { k: "Terrain", v: race.terrain.join(" / ") },
    { k: "Support", v: race.support === "self" ? "Self-support" : "Full-support" },
  ];
  return (
    <dl
      style={{
        margin: 0,
        display: layout === "row" ? "grid" : "flex",
        gridTemplateColumns: layout === "row" ? `repeat(${items.length}, 1fr)` : undefined,
        flexDirection: layout === "col" ? "column" : undefined,
        gap: layout === "col" ? 14 : 0,
        borderTop: `1px solid ${palette.rule}`,
        borderBottom: layout === "row" ? `1px solid ${palette.rule}` : "none",
      }}
    >
      {items.map((it, i) => (
        <div
          key={it.k}
          style={{
            padding: layout === "row" ? "14px 14px" : "0",
            borderRight: layout === "row" && i < items.length - 1 ? `1px solid ${palette.rule}` : "none",
          }}
        >
          <dt
            style={{
              fontFamily: displayFont.stack,
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: palette.inkSoft,
              marginBottom: 4,
            }}
          >
            {it.k}
          </dt>
          <dd
            style={{
              margin: 0,
              fontFamily: displayFont.stack,
              fontWeight: 500,
              fontSize: 18,
              color: palette.ink,
              letterSpacing: "0.02em",
            }}
          >
            {it.v}
          </dd>
        </div>
      ))}
    </dl>
  );
}
