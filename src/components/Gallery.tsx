import type { GalleryItem } from "@/types/content";
import type { Palette, DisplayFont } from "./design-tokens";

export function Gallery({
  items,
  palette,
  displayFont,
}: {
  items: GalleryItem[];
  palette: Palette;
  displayFont: DisplayFont;
}) {
  if (!items.length) return null;
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
        Gallery — 写真と動画
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 16,
        }}
      >
        {items.map((it, i) => (
          <GalleryCell key={i} item={it} palette={palette} displayFont={displayFont} />
        ))}
      </div>
    </div>
  );
}

function GalleryCell({
  item,
  palette,
  displayFont,
}: {
  item: GalleryItem;
  palette: Palette;
  displayFont: DisplayFont;
}) {
  return (
    <figure
      style={{
        margin: 0,
        background: palette.paper,
        border: `1px solid ${palette.rule}`,
      }}
    >
      <div
        style={{
          aspectRatio: "16/9",
          overflow: "hidden",
          background: palette.bgAlt,
          position: "relative",
        }}
      >
        {item.kind === "youtube" ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(item.src)}`}
            title={item.caption ?? `YouTube video ${item.src}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            style={{ width: "100%", height: "100%", border: 0, display: "block" }}
          />
        ) : (
          <a
            href={item.src}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.alt ?? item.caption ?? "image"}
            style={{ display: "block", width: "100%", height: "100%" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.src}
              alt={item.alt ?? item.caption ?? ""}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </a>
        )}
      </div>
      {item.caption && (
        <figcaption
          style={{
            padding: "12px 14px",
            fontSize: 12,
            lineHeight: 1.6,
            color: palette.inkSoft,
            fontFamily: '"Noto Sans JP", sans-serif',
            display: "flex",
            gap: 8,
            alignItems: "baseline",
          }}
        >
          <span
            style={{
              fontFamily: displayFont.stack,
              fontSize: 9,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: palette.accent,
              flex: "0 0 auto",
            }}
          >
            {item.kind === "youtube" ? "Video" : "Photo"}
          </span>
          <span style={{ flex: 1 }}>{item.caption}</span>
        </figcaption>
      )}
    </figure>
  );
}
