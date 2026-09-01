import { EPISODES } from "./episodes";
import { FEED_URL, parseFeed, type Episode } from "./feed";

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
    const res = await fetch(FEED_URL, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`feed responded ${res.status}`);
    const episodes = parseFeed(await res.text());
    if (episodes.length < 10) throw new Error(`feed parsed to only ${episodes.length} episodes`);
    return episodes;
  } catch (err) {
    console.error("[episodes] live feed failed, serving the committed snapshot:", err);
    return EPISODES;
  }
}
