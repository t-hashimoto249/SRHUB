import type { Race } from "@/types/content";
import type { Palette, DisplayFont } from "./design-tokens";
import styles from "./RaceMeta.module.css";

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

  if (layout === "col") {
    return (
      <dl
        style={{
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          borderTop: `1px solid ${palette.rule}`,
        }}
      >
        {items.map((it) => (
          <div key={it.k}>
            <dt
              className={styles.dt}
              style={{ fontFamily: displayFont.stack, color: palette.inkSoft }}
            >
              {it.k}
            </dt>
            <dd
              className={styles.dd}
              style={{ fontFamily: displayFont.stack, color: palette.ink }}
            >
              {it.v}
            </dd>
          </div>
        ))}
      </dl>
    );
  }

  return (
    <dl
      className={styles.row}
      style={{
        borderTop: `1px solid ${palette.rule}`,
        borderBottom: `1px solid ${palette.rule}`,
        ["--rm-rule" as string]: palette.rule,
      } as React.CSSProperties}
    >
      {items.map((it) => (
        <div key={it.k} className={styles.cell}>
          <dt
            className={styles.dt}
            style={{ fontFamily: displayFont.stack, color: palette.inkSoft }}
          >
            {it.k}
          </dt>
          <dd
            className={styles.dd}
            style={{ fontFamily: displayFont.stack, color: palette.ink }}
          >
            {it.v}
          </dd>
        </div>
      ))}
    </dl>
  );
}
