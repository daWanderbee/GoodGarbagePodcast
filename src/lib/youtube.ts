import type { YoutubeVideo } from "./youtube-episodes.ts";

export const CHANNEL_ID = "UC2OX-djWv6Fg5hu-3JUn1Sw";
export const CHANNEL_URL = "https://www.youtube.com/@GoodGarbage";
const CHANNEL_FEED = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

/**
 * The 15 most recent uploads, straight from YouTube's per-channel RSS. No API key needed.
 *
 * This is what keeps new episodes linked without anyone touching the repo: the committed
 * scrape in youtube-episodes.ts stops at April 2026, so without this every new episode
 * would publish with no video link. The feed includes shorts and clips as well as full
 * episodes, so entries are matched to episodes by title/date like any other video rather
 * than assumed to be episodes.
 */
export async function fetchChannelVideos(): Promise<YoutubeVideo[]> {
  try {
    const res = await fetch(CHANNEL_FEED, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`channel feed responded ${res.status}`);
    const xml = await res.text();

    return (xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? []).flatMap((entry) => {
      const videoId = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1];
      const rawTitle = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1];
      const published = entry.match(/<published>(.*?)<\/published>/)?.[1];
      if (!videoId || !rawTitle) return [];

      const title = rawTitle
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;|&apos;/g, "'")
        .replace(/&amp;/g, "&")
        .trim();

      return [{
        videoId,
        titles: [title],
        thumbnail: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
        date: (published ?? "").slice(0, 10),
        apple: null,
      }];
    });
  } catch (err) {
    console.error("[youtube] channel feed failed, using the committed list only:", err);
    return [];
  }
}
