// Parser for the Good Garbage RSS feed. Used at runtime by getEpisodes() and at build
// time by scripts/build-episodes.mjs, so the live data and the committed snapshot in
// episodes.ts can never drift apart.
// Explicit .ts extension so `node --experimental-strip-types` can resolve this too —
// scripts/build-episodes.mjs imports this module directly.
import { YOUTUBE_VIDEOS } from "./youtube-episodes.ts";
import { GUEST_PORTRAITS } from "./guest-portraits.ts";

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
  listen?: string;
  watch?: string;
  audio?: string;
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
  const t = stripEpisodeNumber(title);
  // Take the LAST "with": titles like "Building a Brand with a Purpose with Maddie Hamann"
  // put the guest after the second one.
  const withs = [...t.matchAll(/(?:\bwith|\bWith|\bfeaturing|\bfeat\.?)\s+/g)];
  const last = withs[withs.length - 1];
  let cand = last ? t.slice(last.index + last[0].length) : undefined;
  if (!cand) cand = t.match(/\|\s*([^|]+?)\s+on\s+/)?.[1];
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
function matchYoutube(title: string, published: string) {
  const t = norm(title);
  const contains = YOUTUBE_VIDEOS.find((v) =>
    v.titles.some((y) => {
      const n = norm(y);
      return n === t || n.includes(t) || t.includes(n);
    })
  );
  if (contains) return contains;

  const head = t.slice(0, 20);
  const byPhrase =
    head.length === 20 &&
    YOUTUBE_VIDEOS.find((v) => v.titles.some((y) => norm(y).includes(head)));
  return byPhrase || YOUTUBE_VIDEOS.find((v) => v.date === published);
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

/** Short display title: drops the guest clause and the trailing "| #12". */
export function shortTitle(title: string) {
  return title.split(/\s+(?:with|With|\|)\s+/)[0];
}

export function parseFeed(xml: string): Episode[] {
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
      const yt = matchYoutube(clean, iso);
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
        thumbnail: yt?.thumbnail || attr(item, "itunes:image", "href"),
        portrait: portraitFor(yt, guest),
        listen: tag(item, "link"),
        watch: yt ? `https://www.youtube.com/watch?v=${yt.videoId}` : "",
        audio: attr(item, "enclosure", "url"),
        type: tag(item, "itunes:episodeType"),
      };
    })
    .filter((e) => e.title && e.published && e.type === "full")
    .sort((a, b) => b.published.localeCompare(a.published));

  // The recurring "Around the World of Packaging" segments share a title, so slugs collide.
  const seen = new Set<string>();
  for (const e of episodes) {
    if (seen.has(e.id)) e.id = `${e.id}-${e.published}`;
    seen.add(e.id);
  }

  return episodes.map(({ type: _type, ...e }) => e);
}
