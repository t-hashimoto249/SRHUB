import type { ReportAttachment, AttachmentKind } from "@/types/content";
import type { Palette, DisplayFont } from "./design-tokens";

const KIND_META: Record<AttachmentKind, { label: string; glyph: string }> = {
  spreadsheet: { label: "Spreadsheet", glyph: "▦" },
  document: { label: "Document", glyph: "▤" },
  photos: { label: "Photos", glyph: "▣" },
  video: { label: "Video", glyph: "▶" },
  other: { label: "Link", glyph: "↗" },
};

export function AttachmentList({
  attachments,
  palette,
  displayFont,
}: {
  attachments: ReportAttachment[];
  palette: Palette;
  displayFont: DisplayFont;
}) {
  if (!attachments.length) return null;
  return (
    <div>
      <div
        style={{
          fontFamily: "ui-monospace, monospace",
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: palette.inkSoft,
          marginBottom: 16,
        }}
      >
        Attachments — 寄稿者の参考資料
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
        {attachments.map((a, i) => {
          const meta = KIND_META[a.kind ?? "other"];
          return (
            <a
              key={i}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                gap: 16,
                padding: 18,
                border: `1px solid ${palette.rule}`,
                background: palette.paper,
                color: palette.ink,
                textDecoration: "none",
                transition: "border-color 0.15s ease",
              }}
            >
              <div
                style={{
                  flex: "0 0 44px",
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: palette.bgAlt,
                  color: palette.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: displayFont.stack,
                  fontSize: 22,
                  fontWeight: 600,
                }}
              >
                {meta.glyph}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: displayFont.stack,
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: palette.accent,
                    marginBottom: 4,
                  }}
                >
                  {meta.label}
                </div>
                <div
                  style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: 15,
                    fontWeight: 600,
                    color: palette.ink,
                    lineHeight: 1.4,
                  }}
                >
                  {a.title}
                </div>
                {a.description && (
                  <div style={{ fontSize: 12, color: palette.inkSoft, marginTop: 6, lineHeight: 1.6 }}>
                    {a.description}
                  </div>
                )}
                <div
                  style={{
                    marginTop: 10,
                    fontFamily: "ui-monospace, monospace",
                    fontSize: 10,
                    color: palette.inkSoft,
                    letterSpacing: "0.04em",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {a.url} ↗
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
