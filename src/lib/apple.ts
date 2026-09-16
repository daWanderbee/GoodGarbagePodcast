/**
 * Per-episode Apple Podcasts links, from Apple's own lookup endpoint. No key, no account.
 *
 * Nothing in the RSS points at Apple, so without this the only Apple link on the site is the
 * show-level one in PlatformLinks/Footer, and the per-episode links stop at the committed
 * scrape in youtube-episodes.ts (April 2026). This is the same arrangement as the YouTube
 * channel feed: a live list matched to episodes by title and date, falling back to whatever
 * was committed if the call fails.
 */
export const APPLE_SHOW_ID = "1613337676";
export const APPLE_SHOW_URL = `https://podcasts.apple.com/us/podcast/good-garbage-with-ved-krishna/id${APPLE_SHOW_ID}`;

// 200 is the endpoint's own ceiling, and the show is at ~105 episodes.
const LOOKUP = `https://itunes.apple.com/lookup?id=${APPLE_SHOW_ID}&media=podcast&entity=podcastEpisode&limit=200`;

export type AppleEpisode = {
  title: string;
  /** ISO date, to disambiguate the recurring segments that share a title. */
  date: string;
  url: string;
};

export async function fetchAppleEpisodes(): Promise<AppleEpisode[]> {
  try {
    const res = await fetch(LOOKUP, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`apple lookup responded ${res.status}`);
    const body = (await res.json()) as {
      results?: { wrapperType?: string; trackName?: string; releaseDate?: string; trackViewUrl?: string }[];
    };

    // The first result is the show itself, not an episode — filter by wrapperType rather
    // than slicing, in case Apple ever reorders.
    return (body.results ?? [])
      .filter((r) => r.wrapperType === "podcastEpisode" && r.trackName && r.trackViewUrl)
      .map((r) => ({
        title: r.trackName!.trim(),
        date: (r.releaseDate ?? "").slice(0, 10),
        url: r.trackViewUrl!,
      }));
  } catch (err) {
    console.error("[apple] lookup failed, episodes keep their committed links:", err);
    return [];
  }
}
