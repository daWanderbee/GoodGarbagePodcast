import { EPISODES } from "./episodes";
import { FEED_URL, parseFeed, type Episode } from "./feed";
import { fetchChannelVideos } from "./youtube";
import { applyOverrides, readOverrides } from "./overrides";

/**
 * Episodes straight from the show's RSS feed, refetched hourly. Pages calling this stay
 * statically rendered — Next revalidates them in the background — so a new episode appears
 * without a deploy and without costing anyone a request to Anchor.
 *
 * The committed snapshot in episodes.ts is the fallback: if the feed is unreachable or
 * returns something unparseable, the site shows the last known-good list rather than an
 * empty archive.
 */
export async function getEpisodes(): Promise<Episode[]> {
  try {
    // The channel feed supplies video ids for episodes published since the committed
    // scrape, so new episodes get a working YouTube link with nobody touching the repo.
    const [res, channelVideos] = await Promise.all([
      fetch(FEED_URL, { next: { revalidate: 3600 } }),
      fetchChannelVideos(),
    ]);
    if (!res.ok) throw new Error(`feed responded ${res.status}`);
    const episodes = parseFeed(await res.text(), channelVideos);
    if (episodes.length < 10) throw new Error(`feed parsed to only ${episodes.length} episodes`);
    return applyOverrides(episodes, await readOverrides());
  } catch (err) {
    console.error("[episodes] live feed failed, serving the committed snapshot:", err);
    return applyOverrides(EPISODES, await readOverrides());
  }
}
