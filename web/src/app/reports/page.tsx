import type { Metadata } from "next";
import { getAllContributors, getAllRaces, getAllReports } from "@/lib/content";
import {
  PALETTES,
  DISPLAY_FONTS,
  SELECTED_PALETTE_KEY,
  SELECTED_FONT_KEY,
} from "@/components/design-tokens";
import { ReportListExplorer } from "@/components/ReportListExplorer";

export const metadata: Metadata = {
  title: "Reports | Stage Race Hub",
  description:
    "ステージレースの参加レポート一覧。作成者・レース・目的・作成時期・レース開催月で絞り込めます。",
};

export default async function ReportListPage() {
  const [reports, races, contributors] = await Promise.all([
    getAllReports(),
    getAllRaces(),
    getAllContributors(),
  ]);
  const palette = PALETTES[SELECTED_PALETTE_KEY];
  const displayFont = DISPLAY_FONTS[SELECTED_FONT_KEY];

  const reportsForClient = reports.map((report) => {
    const { contentHtml, ...rest } = report;
    void contentHtml;
    return rest;
  });

  const racesForClient = races.map(
    ({ slug, title, title_en, country, continent, start_month, editions }) => ({
      slug,
      title,
      title_en,
      country,
      continent,
      start_month,
      edition_countries: editions
        ? Array.from(new Set(editions.map((e) => e.country).filter(Boolean)))
        : undefined,
    }),
  );

  const contributorsForClient = contributors.map(({ id, name, avatar }) => ({
    id,
    name,
    avatar,
  }));

  return (
    <ReportListExplorer
      reports={reportsForClient}
      races={racesForClient}
      contributors={contributorsForClient}
      palette={palette}
      displayFont={displayFont}
    />
  );
}
