import { getEpisodes } from "@/lib/get-episodes";
import { EpisodesClient } from "./EpisodesClient";

export default async function EpisodesPage() {
  return <EpisodesClient episodes={await getEpisodes()} />;
}
