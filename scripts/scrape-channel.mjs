// Enumerates EVERY video on the @GoodGarbage channel and writes scripts/channel-videos.json.
//
// Why this exists: the channel RSS only carries the 15 most recent uploads, and the old
// committed scrape stopped at April 2026, so two thirds of the back catalogue had no video
// link. This walks YouTube's own paginated browse endpoint the way the website does — no
// API key, no dependency, just the continuation tokens the page already hands out.
//
//   node scripts/scrape-channel.mjs [--tab videos|streams] [--out path]
import { writeFileSync } from "node:fs";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const CHANNEL_ID = "UC2OX-djWv6Fg5hu-3JUn1Sw";

const argOf = (name, dflt) => {
  const i = process.argv.indexOf(name);
  return i > -1 ? process.argv[i + 1] : dflt;
};
const OUT = argOf("--out", "scripts/channel-videos.json");

async function html(url) {
  const res = await fetch(url, { headers: { "user-agent": UA, "accept-language": "en-US,en" } });
  if (!res.ok) throw new Error(`${url} responded ${res.status}`);
  return res.text();
}

/** ytInitialData is assigned inline in the page; take the balanced object after the "=". */
function initialData(page) {
  const at = page.indexOf("ytInitialData");
  if (at < 0) throw new Error("no ytInitialData — YouTube may have served a consent page");
  const start = page.indexOf("{", at);
  let depth = 0, inStr = false, esc = false;
  for (let i = start; i < page.length; i++) {
    const c = page[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
    } else if (c === '"') inStr = true;
    else if (c === "{") depth++;
    else if (c === "}" && --depth === 0) return JSON.parse(page.slice(start, i + 1));
  }
  throw new Error("ytInitialData never closed");
}

/** Depth-first walk yielding every object that has the given key. */
function* findAll(node, key) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) { for (const v of node) yield* findAll(v, key); return; }
  if (key in node) yield node;
  for (const v of Object.values(node)) yield* findAll(v, key);
}

/**
 * "3 years ago" / "9d ago" is all the grid gives. Coarse, but the podcast feed already
 * carries exact dates — this only has to be close enough to disambiguate two episodes with
 * similar titles, so an approximate date beats no date.
 */
function approxDate(label) {
  const m = /(\d+)\s*(s|sec|second|m|min|minute|h|hour|d|day|w|week|mo|month|y|year)/i.exec(label ?? "");
  if (!m) return "";
  const unit = m[2].toLowerCase();
  const days =
    unit.startsWith("y") ? 365.25 :
    unit.startsWith("mo") || unit === "month" ? 30.44 :
    unit.startsWith("w") ? 7 :
    unit.startsWith("d") ? 1 : 0;
  if (!days) return new Date().toISOString().slice(0, 10);
  return new Date(Date.now() - Number(m[1]) * days * 86400_000).toISOString().slice(0, 10);
}

/**
 * YouTube replaced videoRenderer with lockupViewModel on channel grids. Read both: the old
 * shape still turns up on some surfaces, and falling back costs nothing.
 */
function harvest(data, into) {
  for (const holder of findAll(data, "lockupViewModel")) {
    const lm = holder.lockupViewModel;
    const videoId = lm?.contentId;
    const meta = lm?.metadata?.lockupMetadataViewModel;
    if (!videoId || !/^[\w-]{11}$/.test(videoId) || !meta || into.has(videoId)) continue;

    const parts = (meta.metadata?.contentMetadataViewModel?.metadataRows ?? [])
      .flatMap((r) => r.metadataParts ?? []);
    const ago = parts.map((p) => p.accessibilityLabel ?? p.text?.content ?? "").find((t) => /ago/i.test(t));
    const badge = [...findAll(lm.contentImage ?? {}, "thumbnailBadgeViewModel")]
      .map((b) => b.thumbnailBadgeViewModel?.text ?? "")
      .find((t) => /^\d+:\d/.test(t));

    into.set(videoId, {
      videoId,
      title: (meta.title?.content ?? "").trim(),
      date: approxDate(ago),
      length: badge ?? "",
    });
  }

  for (const holder of findAll(data, "videoRenderer")) {
    const v = holder.videoRenderer;
    if (!v?.videoId || into.has(v.videoId)) continue;
    const txt = (t) => t?.simpleText ?? (t?.runs ?? []).map((r) => r.text).join("") ?? "";
    into.set(v.videoId, {
      videoId: v.videoId,
      title: txt(v.title).trim(),
      date: approxDate(txt(v.publishedTimeText)),
      length: txt(v.lengthText),
    });
  }

  // The token is only useful from the LAST continuation item on the page.
  let token = "";
  for (const holder of findAll(data, "continuationItemRenderer")) {
    const t = holder.continuationItemRenderer?.continuationEndpoint?.continuationCommand?.token;
    if (t) token = t;
  }
  if (!token) {
    // Some responses carry the token loose in a continuationCommand instead.
    for (const holder of findAll(data, "continuationCommand")) {
      const t = holder.continuationCommand?.token;
      if (t && t.length > 50) token = t;
    }
  }
  return token;
}

// The uploads playlist (UC… -> UU…) lists the WHOLE back catalogue 100 at a time. The
// channel's own /videos grid only yields 30 and its continuation token belongs to the
// featured shelf, which walks off into the wrong feed.
const UPLOADS = "UU" + CHANNEL_ID.slice(2);
const page = await html(`https://www.youtube.com/playlist?list=${UPLOADS}`);
const apiKey = /"INNERTUBE_API_KEY":"(.*?)"/.exec(page)?.[1];
const clientVersion = /"INNERTUBE_CONTEXT_CLIENT_VERSION":"(.*?)"/.exec(page)?.[1] ?? "2.20240101.00.00";
if (!apiKey) throw new Error("could not find INNERTUBE_API_KEY on the channel page");

const videos = new Map();
let token = harvest(initialData(page), videos);
console.error(`page 1: ${videos.size} videos`);

for (let page_n = 2; token && page_n < 60; page_n++) {
  const res = await fetch(`https://www.youtube.com/youtubei/v1/browse?key=${apiKey}`, {
    method: "POST",
    headers: { "content-type": "application/json", "user-agent": UA },
    body: JSON.stringify({
      context: { client: { clientName: "WEB", clientVersion, hl: "en", gl: "US" } },
      continuation: token,
    }),
  });
  if (!res.ok) { console.error(`continuation ${page_n} responded ${res.status}, stopping`); break; }
  const before = videos.size;
  token = harvest(await res.json(), videos);
  console.error(`page ${page_n}: ${videos.size} videos (+${videos.size - before})`);
  if (videos.size === before) break; // nothing new: stop rather than spin
}

const out = [...videos.values()].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
writeFileSync(OUT, JSON.stringify(out, null, 1), "utf8");
console.error(`\nwrote ${out.length} videos to ${OUT}`);
