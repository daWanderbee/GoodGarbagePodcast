import { getEpisodes } from "@/lib/get-episodes";
import { AboutClient } from "./AboutClient";

export default async function AboutPage() {
  const episodes = await getEpisodes();
  return <AboutClient episodeCount={episodes.length} />;
}
