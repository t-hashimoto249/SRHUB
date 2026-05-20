import {
  getAllRaces,
  getAllOrganizers,
  resolveOrganizerForRace,
} from "@/lib/content";
import { PALETTES, DISPLAY_FONTS, SELECTED_PALETTE_KEY, SELECTED_FONT_KEY } from "@/components/design-tokens";
import { RaceListExplorer, type OrganizerOption } from "@/components/RaceListExplorer";

export default async function RaceListPage() {
  const [races, organizers] = await Promise.all([getAllRaces(), getAllOrganizers()]);
  const palette = PALETTES[SELECTED_PALETTE_KEY];
  const displayFont = DISPLAY_FONTS[SELECTED_FONT_KEY];

  const racesForClient = races.map((race) => {
    const { contentHtml, ...rest } = race;
    void contentHtml;
    const org = resolveOrganizerForRace(race, organizers);
    return { ...rest, organizer_id: org?.id ?? null };
  });

  const organizerOptions: OrganizerOption[] = organizers
    .map((o) => ({
      id: o.id,
      name: o.name_en ?? o.name,
      count: racesForClient.filter((r) => r.organizer_id === o.id).length,
    }))
    .filter((o) => o.count > 0)
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "ja"));

  return (
    <RaceListExplorer
      races={racesForClient}
      organizerOptions={organizerOptions}
      palette={palette}
      displayFont={displayFont}
    />
  );
}
