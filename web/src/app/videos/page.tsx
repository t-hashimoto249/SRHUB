import type { Metadata } from "next";
import { getAllRaces } from "@/lib/content";
import {
  PALETTES,
  DISPLAY_FONTS,
  SELECTED_PALETTE_KEY,
  SELECTED_FONT_KEY,
} from "@/components/design-tokens";
import { VideoListExplorer, type VideoItem } from "@/components/VideoListExplorer";

export const metadata: Metadata = {
  title: "Videos | Stage Race Hub",
  description:
    "ステージレースの動画一覧。レース・大陸・開催月で絞り込み、コースの雰囲気を映像で確認できます。",
};

export default async function VideoListPage() {
  const races = await getAllRaces();
  const palette = PALETTES[SELECTED_PALETTE_KEY];
  const displayFont = DISPLAY_FONTS[SELECTED_FONT_KEY];

  const videos: VideoItem[] = races.flatMap((race) =>
    (race.videos ?? []).map((v) => ({
      id: v.id,
      title: v.title,
      channel: v.channel,
      channelUrl: v.channelUrl,
      raceSlug: race.slug,
      raceTitle: race.title,
      raceTitleEn: race.title_en,
      country: race.country,
      continent: race.continent,
      startMonth: race.start_month,
    })),
  );

  return (
    <VideoListExplorer videos={videos} palette={palette} displayFont={displayFont} />
  );
}
