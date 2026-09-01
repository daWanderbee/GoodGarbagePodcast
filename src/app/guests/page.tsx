import { getEpisodes } from "@/lib/get-episodes";
import { GuestsClient } from "./GuestsClient";

export default async function GuestsPage() {
  return <GuestsClient episodes={await getEpisodes()} />;
}
