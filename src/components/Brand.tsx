import type { Palette } from "./design-tokens";

export function Mark({ color, size = 28 }: { color: string; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `1.5px solid ${color}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: '"Oswald", sans-serif',
        fontWeight: 600,
        fontSize: size * 0.42,
        color,
        letterSpacing: "0.05em",
      }}
    >
      SR
    </div>
  );
}

export function Stars({ n, color }: { n: number; color?: string }) {
  return (
    <span style={{ letterSpacing: "0.08em", color: color || "currentColor", fontSize: "0.9em" }}>
      {"★".repeat(n)}
      <span style={{ opacity: 0.25 }}>{"★".repeat(5 - n)}</span>
    </span>
  );
}

export function Placeholder({
  label,
  ratio = "16/9",
  tone = "sand",
}: {
  label: string;
  ratio?: string;
  tone?: "sand" | "dark";
}) {
  return (
    <div
      style={{
        aspectRatio: ratio,
        width: "100%",
        background: `repeating-linear-gradient(135deg, ${tone === "dark" ? "#3a3024" : "#d9c8a6"} 0 8px, ${tone === "dark" ? "#2a2218" : "#cfb98c"} 8px 16px)`,
        color: tone === "dark" ? "#d9c8a6" : "#5C4F3C",
        fontFamily: "ui-monospace, monospace",
        fontSize: 11,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      [{label}]
    </div>
  );
}

export type { Palette };
