import { getEpisodes } from "@/lib/get-episodes";
import { HomeClient } from "./HomeClient";

export default async function Home() {
  return <HomeClient episodes={await getEpisodes()} />;
}
