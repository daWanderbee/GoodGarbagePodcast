import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { timingSafeEqual } from "node:crypto";
import type { Episode } from "./feed";

/**
 * Manual corrections layered on top of the RSS feed, edited from the studio page.
 *
 * Only for what the feeds can't supply: a YouTube video id for an older episode the
 * channel RSS no longer lists. Everything else — titles, dates, descriptions, new episodes
 * — comes from the feed and must not be duplicated here, or the two will drift.
 *
 * ponytail: a JSON file, no database. Needs a persistent disk; on a serverless host with an
 * ephemeral filesystem these edits vanish on redeploy and this becomes a Postgres table.
 */
export type Override = { videoId?: string };
export type Overrides = Record<string, Override>;

const FILE = () =>
  process.env.OVERRIDES_PATH ?? path.join(process.cwd(), "data", "episode-overrides.json");

export async function readOverrides(): Promise<Overrides> {
  try {
    return JSON.parse(await readFile(FILE(), "utf8")) as Overrides;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error("[overrides] could not read, ignoring:", err);
    }
    return {};
  }
}

/** Pass null to clear the override and hand the episode back to the feeds. */
export async function writeOverride(episodeId: string, videoId: string | null): Promise<Overrides> {
  const all = await readOverrides();
  if (videoId) all[episodeId] = { videoId };
  else delete all[episodeId];

  const file = FILE();
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(all, null, 2), "utf8");
  return all;
}

/** Accepts a bare id, a watch URL, a youtu.be link or an embed URL. */
export function parseVideoId(input: string): string | null {
  const s = input.trim();
  if (!s) return null;
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  const m =
    s.match(/[?&]v=([A-Za-z0-9_-]{11})/) ??
    s.match(/youtu\.be\/([A-Za-z0-9_-]{11})/) ??
    s.match(/\/(?:embed|shorts|live)\/([A-Za-z0-9_-]{11})/);
  return m?.[1] ?? null;
}

export function applyOverrides(episodes: Episode[], overrides: Overrides): Episode[] {
  if (!Object.keys(overrides).length) return episodes;
  return episodes.map((e) => {
    const videoId = overrides[e.id]?.videoId;
    if (!videoId) return e;
    return {
      ...e,
      watch: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnail: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    };
  });
}

/**
 * The studio has no login: its URL is the credential. So the same key has to gate the
 * write endpoint too — a secret page in front of an open API protects nothing. Fails
 * closed when STUDIO_KEY is unset, so a misconfigured deploy is locked, not wide open.
 */
export function studioKeyValid(key: string | undefined): boolean {
  const expected = process.env.STUDIO_KEY;
  if (!expected || expected.length < 16 || !key) return false;
  const a = Buffer.from(key);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
