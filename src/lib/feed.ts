// Parser for the Good Garbage RSS feed. Used at runtime by getEpisodes() and at build
// time by scripts/build-episodes.mjs, so the live data and the committed snapshot in
// episodes.ts can never drift apart.
// Explicit .ts extension so `node --experimental-strip-types` can resolve this too —
// scripts/build-episodes.mjs imports this module directly.
import { YOUTUBE_VIDEOS, type YoutubeVideo } from "./youtube-episodes.ts";
import { GUEST_PORTRAITS } from "./guest-portraits.ts";
import { EPISODE_VIDEOS } from "./episode-videos.ts";

export const FEED_URL = "https://anchor.fm/s/b9b9b52c/podcast/rss";

export type Category = "Business" | "Environment" | "Science" | "Activism";

export interface Episode {
  id: string;
  /** The show's own episode number, or 0 for the unnumbered "Around the World" segments. */
  ep: number;
  title: string;
  description: string;
  guest: string;
  role: string;
  location?: string;
  category: Category;
  duration: string;
  date: string;
  published: string;
  thumbnail?: string;
  /** Square headshot of the guest, cropped from the episode thumbnail. "" when unverified. */
  portrait?: string;
  /** YouTube video URL. Empty when no video has been matched to this episode yet. */
  watch?: string;
  /** The episode on Spotify, straight from the feed. Always present; used when watch is not. */
  listen?: string;
}

export const CATEGORIES: ("All" | Category)[] = ["All", "Business", "Environment", "Science", "Activism"];

const decode = (s: string) =>
  s
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");

const tag = (item: string, name: string) => {
  const m = item.match(new RegExp(String.raw`<${name}>([^]*?)</${name}>`));
  return m ? decode(m[1]).trim() : "";
};

const attr = (item: string, name: string, a: string) => {
  const m = item.match(new RegExp(String.raw`<${name}[^>]*\s${a}="([^"]*)"`));
  return m ? decode(m[1]) : "";
};

/** "1:09:07" / "45:12" / "2712" -> "1h 9m" / "45 min" */
function duration(v: string) {
  const p = v.split(":").map(Number);
  const secs = p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : p.length === 2 ? p[0] * 60 + p[1] : Number(v) || 0;
  const h = Math.floor(secs / 3600);
  const m = Math.round((secs % 3600) / 60);
  return h ? `${h}h ${m}m` : `${m} min`;
}

// The show numbers episodes two ways: "Title | #42" early on, "#42 Title" later.
const EP_SUFFIX = /\s*\|\s*#(\d+)\s*$/;
const EP_PREFIX = /^\s*#(\d+)\s+/;

export function episodeNumber(title: string) {
  return Number(title.match(EP_SUFFIX)?.[1] ?? title.match(EP_PREFIX)?.[1] ?? 0);
}

export function stripEpisodeNumber(title: string) {
  return title.replace(EP_SUFFIX, "").replace(EP_PREFIX, "").trim();
}

/** Guest name lives in the title: "… with Jane Doe", "… | Jane Doe on X", "… featuring Jane Doe". */
function guestFrom(title: string) {
  // "… with Sian Sutherland Part 2" — the part number belongs to the episode, not the
  // person. Left in, it becomes the surname and every name-based check downstream fails.
  const t = stripEpisodeNumber(title).replace(/\s+(?:Part|Pt\.?)\s*\d+\s*$/i, "");
  // Take the LAST "with": titles like "Building a Brand with a Purpose with Maddie Hamann"
  // put the guest after the second one.
  const withs = [...t.matchAll(/(?:\bwith|\bWith|\bfeaturing|\bfeat\.?)\s+/g)];
  const last = withs[withs.length - 1];
  let cand = last ? t.slice(last.index + last[0].length) : undefined;
  if (!cand) cand = t.match(/\|\s*([^|]+?)\s+on\s+/)?.[1];
  // "The Impatient Entrepreneur: Lessons from Alvin Lim" — no "with" anywhere.
  if (!cand) cand = t.match(/\b(?:lessons|stories|insights)\s+from\s+(.+)$/i)?.[1];
  // "Some Title Pt.2 | Dr. Ramani Narayan" — a trailing segment that is only a name.
  // "… | Part 1" and "… | #89" fail the all-words-capitalised test below.
  if (!cand) {
    const trailing = t.match(/\|\s*([^|]+)$/)?.[1]?.trim();
    const words = trailing?.split(/\s+/) ?? [];
    if (words.length >= 2 && words.length <= 4 && words.every((w) => /^[A-Z][a-zA-Z.'-]*$/.test(w))) cand = trailing;
  }
  if (!cand) return "";
  cand = cand.split(/\s*\|\s*/)[0];
  if (cand.includes(",")) cand = cand.split(",").pop() as string; // "the Italian Stallion, Frank Franciosi"
  cand = cand.replace(/^(the|our|special guest)\s+/i, "").trim();
  // Drop a leading company possessive: "TerraSafe's Scott Bolin", "Pacha's Maddie Hamann".
  const words = cand.split(/\s+/);
  while (words.length > 2 && /['’]s$/.test(words[0])) words.shift();
  words.splice(4);
  while (words.length && !/^[A-Z]/.test(words[0])) words.shift();
  const name = words.join(" ").replace(/[.,:;!?]+$/, "").trim();
  return /^[A-Z]/.test(name) && name.split(/\s+/).length <= 4 ? name : "";
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Role from the description: "with Jane Doe, Founder of Acme, to explore…" */
function roleFrom(desc: string, guest: string) {
  if (!guest) return "";
  const parts = guest.split(/\s+/).filter((w) => w.length > 2 && !/^(dr|mr|ms|mrs|prof)\.?$/i.test(w));
  for (const name of [parts[parts.length - 1], parts[0]].filter(Boolean)) {
    const re = new RegExp(
      String.raw`${escapeRe(name)}\s*[^,.]{0,25},\s*([^.,][^.]{2,90}?)\s*(?:,|\.|\sand\s|\sto\s|\swho\s)`,
      "i"
    );
    const role = desc.match(re)?.[1]?.replace(/\s+/g, " ").trim() ?? "";
    // A role is a noun phrase — reject sentences that merely mention the guest.
    const isSentence = / (is|was|are|has|have|will) /i.test(role) || parts.some((p) => role.includes(p));
    if (role.length > 4 && /[a-z]/.test(role) && !isSentence && !/^(who|and|as|the host|is|has)\b/i.test(role)) {
      return role.replace(/^(the|a|an)\s+/i, "").replace(/\s+(and|of|at|in)$/i, "");
    }
  }
  return "";
}

const CATEGORY_WORDS: Record<Category, string[]> = {
  Science: ["material", "science", "bioplastic", "biomimicry", "nanotech", "polymer", "chemistry", "research", "lab", "seaweed", "mycelium", "enzyme", "molecul", "biotech"],
  // "founder"/"CEO" deliberately excluded — every guest bio has them, so they carry no signal.
  Business: ["business", "brand", "scaling", "startup", "market", "investor", "supply chain", "retail", "growth", "economy", "manufactur", "profit", "customer"],
  Activism: ["activis", "protest", "movement", "campaign", "policy", "advocacy", "art", "artist", "community", "awareness", "petition", "regulat"],
  Environment: ["compost", "recycl", "waste", "climate", "ocean", "plastic pollution", "soil", "carbon", "circular", "biodivers", "landfill", "regenerat"],
};

function categoryFrom(text: string): Category {
  const hay = text.toLowerCase();
  let best: Category = "Environment";
  let score = 0;
  for (const [cat, words] of Object.entries(CATEGORY_WORDS) as [Category, string[]][]) {
    const n = words.reduce((acc, w) => acc + (hay.split(w).length - 1), 0);
    if (n > score) {
      score = n;
      best = cat;
    }
  }
  return best;
}

const slug = (s: string) =>
  s.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70);

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");

// The feed's itunes:image is show art, not per-episode, so prefer the YouTube thumbnail.
// YouTube titles wrap the episode name in boilerplate ("Good Garbage with Ved Krishna: …",
// "… | Good Garbage Podcast") and sometimes slip a company name in mid-title, so plain
// containment misses; falling back to a shared opening phrase catches those.
/**
 * A containment match only means something if the shared text is long enough to be
 * distinctive — otherwise the channel's short "Good Garbage" clips match any episode whose
 * own title contains the show name.
 */
const DISTINCTIVE = 24;

/**
 * A title match this far from the episode's own publish date is not the same thing. Set
 * generously because YouTube uploads lag the podcast release by weeks on some episodes;
 * the one-video-one-episode pass below is what actually enforces uniqueness.
 */
const MAX_DAYS_APART = 120;

const daysApart = (a: string, b: string) =>
  a && b ? Math.abs(Date.parse(a) - Date.parse(b)) / 86_400_000 : Infinity;

/**
 * How well a video title matches an episode title. Higher wins.
 *
 * This exists because the channel publishes a Short alongside most episodes, cut from it and
 * named after it — "Recycling the Unrecyclable!" next to "Recycling the Unrecyclable | A
 * World 'Without' with Anish Malpani". Both share the episode's opening words, both are
 * published the same day, so title-plus-date alone cannot separate them and the Short would
 * win on feed order alone.
 *
 * The build-time matcher settles this with runtime, which the channel RSS does not carry.
 * What survives is the shape of the title: the real episode reproduces the podcast title in
 * full, while a clip keeps the hook and drops the guest clause.
 */
function titleRank(episodeTitle: string, videoTitle: string): number {
  const t = norm(episodeTitle);
  const n = norm(videoTitle);
  if (!t || !n) return 0;

  if (n === t) return 4; // same title
  if (Math.min(n.length, t.length) >= DISTINCTIVE && (n.includes(t) || t.includes(n))) {
    // One fully contains the other, and enough of it to mean something. A video title that
    // is a small fraction of the episode's is a clip, not the episode.
    return n.length / t.length >= 0.55 ? 3 : 1;
  }
  const head = t.slice(0, 20);
  if (head.length === 20 && n.includes(head)) {
    // Shares only the opening phrase — the weakest evidence there is, and exactly what a
    // Short looks like. Never let it beat a fuller match.
    return n.length / t.length >= 0.55 ? 2 : 1;
  }
  return 0;
}

function matchYoutube(title: string, published: string, videos: YoutubeVideo[]) {
  const candidates = videos
    .map((v) => ({
      v,
      rank: Math.max(...v.titles.map((y) => titleRank(title, y))),
      gap: daysApart(v.date, published),
    }))
    .filter((c) => c.rank > 0);

  // Best title match first; among equals, the one published nearest the episode. Twelve
  // episodes share the title "Around The World of Packaging with Alex Moore", and only the
  // one published alongside the video should claim it.
  const nearest = candidates.sort((a, b) => b.rank - a.rank || a.gap - b.gap)[0];

  if (nearest && nearest.gap <= MAX_DAYS_APART) return nearest.v;

  return videos.find((v) => v.date === published);
}

/**
 * A portrait is only safe to show if the video really is this guest's episode — a wrong
 * match would put a stranger's face under their name. Requiring the guest's surname in the
 * video title is a much stronger check than the title-similarity used for thumbnails.
 */
function portraitFor(video: { videoId: string; titles: string[] } | undefined, guest: string) {
  if (!video || !guest || !GUEST_PORTRAITS.has(video.videoId)) return "";
  const surname = norm(guest.split(/\s+/).filter((w) => !/^(dr|mr|ms|mrs|prof)\.?$/i.test(w)).pop() ?? "");
  if (surname.length < 3) return "";
  return video.titles.some((y) => norm(y).includes(surname)) ? `/images/guests/${video.videoId}.jpg` : "";
}

/**
 * Where a play button goes. Always YouTube, never Spotify.
 *
 * Exact video when we have one. Otherwise the channel's own search, pre-filled with the
 * episode title — which lands the visitor on the right channel with the episode surfaced,
 * rather than on a dead button. Roughly half the back catalogue has no known video id yet:
 * the committed scrape covers 2024-05 to 2026-04, and the live channel feed only carries
 * the 15 most recent uploads.
 */
export function watchUrl(episode: Pick<Episode, "watch" | "title" | "listen">): string {
  if (episode.watch) return episode.watch;
  // No video for this one — two of the monthly segments were never uploaded. Spotify plays
  // the actual episode, which beats dropping the listener on a search page for something
  // that is not there.
  if (episode.listen) return episode.listen;
  return `https://www.youtube.com/@GoodGarbage/search?query=${encodeURIComponent(stripEpisodeNumber(episode.title))}`;
}

/** Short display title: drops the guest clause and the trailing "| #12". */
export function shortTitle(title: string) {
  return title.split(/\s+(?:with|With|\|)\s+/)[0];
}

export function parseFeed(xml: string, extraVideos: YoutubeVideo[] = []): Episode[] {
  // Live channel entries first: for a recent episode they are the only source of a video id.
  const videos = [...extraVideos, ...YOUTUBE_VIDEOS];
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];

  const episodes = items
    .map((item) => {
      const title = tag(item, "title");
      const html = tag(item, "description");
      const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      const published = new Date(tag(item, "pubDate"));
      const guest = guestFrom(title);
      const clean = stripEpisodeNumber(title);
      const iso = Number.isNaN(published.valueOf()) ? "" : published.toISOString().slice(0, 10);
      const yt = matchYoutube(clean, iso, videos);
      return {
        ep: episodeNumber(title),
        id: slug(clean),
        title: clean,
        description: text.length > 260 ? text.slice(0, 257).replace(/\s+\S*$/, "") + "…" : text,
        guest,
        role: roleFrom(text, guest),
        category: categoryFrom(`${title} ${text}`),
        duration: duration(tag(item, "itunes:duration")),
        date: iso ? published.toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "",
        published: iso,
        fallbackArt: attr(item, "itunes:image", "href"),
        video: yt,
        listen: tag(item, "link"),
        type: tag(item, "itunes:episodeType"),
      };
    })
    .filter((e) => e.title && e.published && e.type === "full")
    .sort((a, b) => b.published.localeCompare(a.published));

  // One video, one episode. Twelve monthly "Around the World of Packaging" episodes share a
  // title and only one has a video, so without this they would all link to the same upload.
  // The episode published closest to the video wins; the rest fall back to a channel search.
  const bestClaim = new Map<string, (typeof episodes)[number]>();
  for (const e of episodes) {
    if (!e.video) continue;
    const held = bestClaim.get(e.video.videoId);
    if (!held || daysApart(e.video.date, e.published) < daysApart(held.video!.date, held.published)) {
      bestClaim.set(e.video.videoId, e);
    }
  }
  for (const e of episodes) {
    if (e.video && bestClaim.get(e.video.videoId) !== e) e.video = undefined;
  }

  // The recurring segments share a title, so slugs collide too.
  const seen = new Set<string>();
  for (const e of episodes) {
    if (seen.has(e.id)) e.id = `${e.id}-${e.published}`;
    seen.add(e.id);
  }

  // The committed lookup table wins. It was built against the whole channel and audited,
  // where matchYoutube() above only ever sees the 15 videos in the channel RSS and has to
  // guess conservatively. Ids are only stable after the dedup pass, so this runs here.
  const fromTable = new Set<string>();
  for (const e of episodes) {
    const known = EPISODE_VIDEOS[e.id];
    if (!known) continue;
    e.video = {
      videoId: known.videoId,
      titles: [known.title],
      thumbnail: `https://i.ytimg.com/vi/${known.videoId}/maxresdefault.jpg`,
      date: e.published,
      apple: null,
    };
    fromTable.add(known.videoId);
  }
  // A runtime guess that lands on a video the table already gave to a different episode is
  // wrong by definition — drop it rather than link two episodes to one video.
  for (const e of episodes) {
    if (e.video && !EPISODE_VIDEOS[e.id] && fromTable.has(e.video.videoId)) e.video = undefined;
  }

  return episodes.map(({ type: _type, fallbackArt, video, ...e }) => ({
    ...e,
    thumbnail: video?.thumbnail || fallbackArt,
    portrait: portraitFor(video, e.guest),
    watch: video ? `https://www.youtube.com/watch?v=${video.videoId}` : "",
  }));
}
