import type { Metadata } from "next";
import { googleFontsHref, PALETTES, SELECTED_PALETTE_KEY } from "@/components/design-tokens";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stage Race — World Edition",
  description:
    "世界中のステージレース（複数日かけて走る長距離マラソン）を、日本人ウルトラランナーに届けるための紹介と参加レポート。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const palette = PALETTES[SELECTED_PALETTE_KEY];
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={googleFontsHref()} />
      </head>
      <body style={{ background: palette.bg, color: palette.ink, margin: 0 }}>{children}</body>
    </html>
  );
}
