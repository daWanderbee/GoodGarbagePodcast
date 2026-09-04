// Matches every podcast episode to its YouTube video and writes src/lib/episode-videos.ts.
//
//   node scripts/scrape-channel.mjs        # refresh scripts/channel-videos.json first
//   node --experimental-strip-types scripts/match-videos.mjs [--dry]
//
// The runtime matcher in feed.ts is deliberately conservative: it only has the 15 videos
// from the channel RSS to work with and must never mislabel a live episode. This script
// has the whole 370-video channel and can afford to be thorough, so the expensive matching
// happens once, here, and ships as a committed lookup table.
//
// Three signals, because no single one is reliable on its own:
//   surname  — the guest's name in the video title. Strongest, but Sian Sutherland has
//              two parts and Alex Moore has twelve monthly segments.
//   duration — the episode's runtime vs the video's. Separates a 90-minute episode from
//              the 60-second short cut out of it. Strongest disambiguator by far.
//   date     — publish dates, which for scraped videos are approximate ("9 months ago").
import { readFileSync, writeFileSync } from "node:fs";
import { FEED_URL, parseFeed } from "../src/lib/feed.ts";

const DRY = process.argv.includes("--dry");
const videos = JSON.parse(readFileSync("scripts/channel-videos.json", "utf8"));

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();

/** "1:49:31" / "12:05" -> seconds. */
const vidSecs = (s) => {
  const p = String(s).split(":").map(Number);
  if (p.some(Number.isNaN) || !p.length) return 0;
  return p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : p.length === 2 ? p[0] * 60 + p[1] : p[0];
};
/** parseFeed formats runtimes as "1h 50m" or "45 min"; read it back to seconds. */
const epSecs = (s) => {
  const h = /(\d+)\s*h/.exec(s)?.[1] ?? 0;
  const m = /(\d+)\s*m/.exec(s)?.[1] ?? 0;
  return (Number(h) * 3600 + Number(m) * 60) || 0;
};

const STOP = new Set(
  ("the a an and or of to in on for with is are be at by from as it its this that good garbage " +
   "podcast episode ep part pt how why what when who your you we our i s t")
    .split(" ")
);
const tokens = (s) => norm(s).split(" ").filter((w) => w.length > 2 && !STOP.has(w));

// Inverse document frequency over the video corpus: a word in 200 titles proves nothing,
// a word in two titles nearly identifies the episode.
const df = new Map();
for (const v of videos) for (const w of new Set(tokens(v.title))) df.set(w, (df.get(w) ?? 0) + 1);
const idf = (w) => Math.log(videos.length / ((df.get(w) ?? 0) + 1));

const surnameOf = (guest) => {
  const parts = norm(guest).split(" ").filter((w) => !["dr", "mr", "ms", "mrs", "prof"].includes(w));
  return parts.length ? parts[parts.length - 1] : "";
};


const MONTHS = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];

/**
 * The twelve "Around the World of Packaging" episodes share one title and differ only by
 * the month in it, and the scraped dates all collapse onto the same day ("1 year ago"), so
 * the month printed in the title is the only thing that tells them apart.
 */
function period(title) {
  const t = norm(title);
  const months = new Set();
  for (let i = 0; i < 12; i++) {
    if (new RegExp(String.raw`\b${MONTHS[i]}[a-z]*`).test(t)) months.add(i);
  }
  const years = new Set();
  for (const m of t.matchAll(/\b(?:20)?(\d{2})\b/g)) {
    const y = Number(m[1]);
    if (y >= 20 && y <= 30) years.add(y);
  }
  return { months, years };
}

const overlaps = (a, b) => [...a].some((x) => b.has(x));

function score(ep, v) {
  const vt = norm(v.title);
  const vtok = new Set(tokens(v.title));
  let s = 0;

  // Shared distinctive words.
  for (const w of new Set(tokens(ep.title))) if (vtok.has(w)) s += idf(w);

  // Guest surname, and the full name when it is two distinctive words.
  const sur = surnameOf(ep.guest);
  if (sur.length >= 3 && vt.includes(sur)) s += 6;
  const first = norm(ep.guest).split(" ")[0];
  if (first.length >= 3 && sur.length >= 3 && vt.includes(`${first} ${sur}`)) s += 4;

  // Runtime. A full episode and the short cut from it share every word in the title, so
  // without this the short frequently wins.
  const a = epSecs(ep.duration), b = vidSecs(v.length);
  if (a && b) {
    const ratio = Math.min(a, b) / Math.max(a, b);
    if (ratio > 0.95) s += 8;
    else if (ratio > 0.8) s += 3;
    else if (ratio < 0.35) s -= 7; // a clip, not the episode
  } else if (a > 1500 && !b) {
    s -= 2; // no length badge usually means a short
  }

  // Publish date. Scraped dates are approximate, so this nudges rather than decides.
  const gap = Math.abs(Date.parse(v.date) - Date.parse(ep.published)) / 86_400_000;
  if (Number.isFinite(gap)) {
    if (gap <= 21) s += 4;
    else if (gap <= 75) s += 2;
    else if (gap > 400) s -= 4;
  }

  // Month and year printed in the title. Decisive for the monthly segments, silent for
  // everything else (most titles name no month at all).
  const pe = period(ep.title), pv = period(v.title);
  if (pe.months.size && pv.months.size) s += overlaps(pe.months, pv.months) ? 10 : -25;
  if (pe.years.size && pv.years.size) s += overlaps(pe.years, pv.years) ? 6 : -18;

  return s;
}

const eps = parseFeed(await (await fetch(FEED_URL)).text(), []);

// Score every pair, then assign greedily from the best score down, so a video can only be
// claimed once and the most confident episode gets first refusal.
const pairs = [];
for (const ep of eps) for (const v of videos) {
  const s = score(ep, v);
  if (s >= 8) pairs.push({ ep, v, s });
}
pairs.sort((a, b) => b.s - a.s);

const MIN = 11; // below this the evidence is one weak signal; leave it unmatched
const takenEp = new Set(), takenVid = new Set(), assigned = new Map();
for (const { ep, v, s } of pairs) {
  if (s < MIN || takenEp.has(ep.id) || takenVid.has(v.videoId)) continue;
  takenEp.add(ep.id); takenVid.add(v.videoId);
  assigned.set(ep.id, { videoId: v.videoId, score: s, title: v.title });
}

const missed = eps.filter((e) => !assigned.has(e.id));
console.error(`matched ${assigned.size}/${eps.length} episodes to a video`);
if (missed.length) {
  console.error(`\nunmatched (${missed.length}):`);
  for (const e of missed) console.error("   ", e.date.padEnd(9), e.title.slice(0, 68));
}

const body = [...assigned.entries()]
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(([id, m]) => `  ${JSON.stringify(id)}: { videoId: ${JSON.stringify(m.videoId)}, title: ${JSON.stringify(m.title)} },`)
  .join("\n");

const out = `// GENERATED by scripts/match-videos.mjs — do not hand-edit.
// Episode slug -> the YouTube video for it, matched against the full ${videos.length}-video
// channel listing by guest surname, runtime and publish date. Regenerate with:
//
//   node scripts/scrape-channel.mjs
//   node --experimental-strip-types scripts/match-videos.mjs
//
// The video's own title is kept, not just its id, so portraitFor() can still check that the
// guest's surname appears in it. Matching on a title we invented would make that guard
// vacuous, and the guard is what stops a crop being filed under the wrong person.
//
// Live episodes published after this ran are still matched at runtime from the channel RSS;
// this table only has to cover the back catalogue that RSS no longer lists.
export const EPISODE_VIDEOS: Record<string, { videoId: string; title: string }> = {
${body}
};
`;

if (DRY) {
  console.error("\n--dry: nothing written");
  for (const [id, m] of [...assigned].slice(0, 8)) console.error(`  ${id}\n    -> ${m.title.slice(0, 70)} (${m.score.toFixed(1)})`);
} else {
  writeFileSync("src/lib/episode-videos.ts", out, "utf8");
  console.error(`\nwrote src/lib/episode-videos.ts (${assigned.size} entries)`);
}
