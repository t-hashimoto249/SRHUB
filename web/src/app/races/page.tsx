import { getAllRaces } from "@/lib/content";
import { PALETTES, DISPLAY_FONTS, SELECTED_PALETTE_KEY, SELECTED_FONT_KEY } from "@/components/design-tokens";
import { RaceListExplorer } from "@/components/RaceListExplorer";

export default async function RaceListPage() {
  const races = await getAllRaces();
  const palette = PALETTES[SELECTED_PALETTE_KEY];
  const displayFont = DISPLAY_FONTS[SELECTED_FONT_KEY];

  const racesForClient = races.map((race) => {
    const { contentHtml, ...rest } = race;
    void contentHtml;
    return rest;
  });

  return <RaceListExplorer races={racesForClient} palette={palette} displayFont={displayFont} />;
}
