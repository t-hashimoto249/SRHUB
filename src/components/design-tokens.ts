export type PaletteKey = "desert" | "mountain" | "polar";

export interface Palette {
  bg: string;
  bgAlt: string;
  paper: string;
  ink: string;
  inkSoft: string;
  rule: string;
  accent: string;
  accentDeep: string;
  sand: string;
}

export const PALETTES: Record<PaletteKey, Palette> = {
  desert: {
    bg: "#F5F0E6",
    bgAlt: "#EDE5D4",
    paper: "#FBF8F1",
    ink: "#2A2218",
    inkSoft: "#5C4F3C",
    rule: "rgba(42,34,24,0.18)",
    accent: "#B8763A",
    accentDeep: "#7A4A1F",
    sand: "#D9C8A6",
  },
  mountain: {
    bg: "#EEEEF0",
    bgAlt: "#DCDCE0",
    paper: "#F7F7F8",
    ink: "#1E2329",
    inkSoft: "#4A5260",
    rule: "rgba(30,35,41,0.15)",
    accent: "#5A7088",
    accentDeep: "#2F3D4F",
    sand: "#B8C0CA",
  },
  polar: {
    bg: "#F4F4F2",
    bgAlt: "#E6E6E2",
    paper: "#FFFFFF",
    ink: "#16181A",
    inkSoft: "#4A4D52",
    rule: "rgba(22,24,26,0.14)",
    accent: "#3B6E8F",
    accentDeep: "#1B2E3F",
    sand: "#CFD3D6",
  },
};

export type DisplayFontKey = "oswald" | "bebas" | "barlow" | "archivo";

export interface DisplayFont {
  name: string;
  stack: string;
  google: string;
}

export const DISPLAY_FONTS: Record<DisplayFontKey, DisplayFont> = {
  oswald: { name: "Oswald", stack: '"Oswald", "Noto Sans JP", sans-serif', google: "Oswald:wght@400;500;600;700" },
  bebas: { name: "Bebas Neue", stack: '"Bebas Neue", "Noto Sans JP", sans-serif', google: "Bebas+Neue" },
  barlow: { name: "Barlow Condensed", stack: '"Barlow Condensed", "Noto Sans JP", sans-serif', google: "Barlow+Condensed:wght@400;500;600;700;800" },
  archivo: { name: "Archivo Narrow", stack: '"Archivo Narrow", "Noto Sans JP", sans-serif', google: "Archivo+Narrow:wght@400;500;600;700" },
};

export const SELECTED_PALETTE_KEY: PaletteKey = "desert";
export const SELECTED_FONT_KEY: DisplayFontKey = "oswald";

export const MONTH_LABELS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export interface TerrainMeta {
  color: string;
  label: string;
  glyph: string;
}

export const TERRAIN_META: Record<string, TerrainMeta> = {
  砂漠: { color: "#D9A24C", label: "Desert", glyph: "◢◣" },
  山岳: { color: "#5A7A5C", label: "Alpine", glyph: "▲▲" },
  極地: { color: "#7AA2C0", label: "Polar", glyph: "❄" },
  ジャングル: { color: "#3F6B3A", label: "Jungle", glyph: "✦" },
  その他: { color: "#8C7A66", label: "Mixed", glyph: "◆" },
};

export const PURPOSE_META: Record<string, { label: string; en: string; color: string }> = {
  completion: { label: "完走志向", en: "Finish", color: "#7A4A1F" },
  competitive: { label: "上位志向", en: "Compete", color: "#B8763A" },
  personal: { label: "マイペース志向", en: "Personal", color: "#5C4F3C" },
};

export function googleFontsHref() {
  const fams = [
    "Noto+Sans+JP:wght@300;400;500;600;700",
    "Noto+Serif+JP:wght@400;600",
    ...Object.values(DISPLAY_FONTS).map((f) => f.google),
  ];
  return `https://fonts.googleapis.com/css2?${fams.map((f) => `family=${f}`).join("&")}&display=swap`;
}
