import { PURPOSE_META, type DisplayFont } from "./design-tokens";
import type { ReportPurpose } from "@/types/content";

export function PurposeBadge({
  purpose,
  displayFont,
  size = "sm",
}: {
  purpose: ReportPurpose;
  displayFont: DisplayFont;
  size?: "sm" | "lg";
}) {
  const m = PURPOSE_META[purpose];
  if (!m) return null;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: size === "lg" ? "5px 10px" : "3px 8px",
        border: `1px solid ${m.color}`,
        color: m.color,
        fontFamily: displayFont.stack,
        fontSize: size === "lg" ? 11 : 10,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: m.color }} />
      {m.label}
    </span>
  );
}
