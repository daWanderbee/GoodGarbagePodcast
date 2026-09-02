"use client";

import { useMemo, useState } from "react";
import type { Episode } from "@/lib/feed";
import type { Overrides } from "@/lib/overrides";

type Row = { state: "idle" | "saving" | "saved" | "error"; message?: string; videoId?: string | null };

export function StudioClient({
  studioKey,
  episodes,
  overrides,
}: {
  studioKey: string;
  episodes: Episode[];
  overrides: Overrides;
}) {
  const [query, setQuery] = useState("");
  const [onlyMissing, setOnlyMissing] = useState(true);
  const [rows, setRows] = useState<Record<string, Row>>({});

  const missingCount = episodes.filter((e) => !e.watch).length;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return episodes.filter((e) => {
      if (onlyMissing && e.watch) return false;
      return !q || e.title.toLowerCase().includes(q) || e.guest.toLowerCase().includes(q);
    });
  }, [episodes, query, onlyMissing]);

  async function save(episodeId: string, video: string) {
    setRows((r) => ({ ...r, [episodeId]: { state: "saving" } }));
    try {
      const res = await fetch(`/api/studio/${studioKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ episodeId, video }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? `Save failed (${res.status})`);
      setRows((r) => ({
        ...r,
        [episodeId]: {
          state: "saved",
          videoId: data.videoId,
          message: data.videoId ? "Saved" : "Cleared — back to the feed",
        },
      }));
    } catch (err) {
      setRows((r) => ({
        ...r,
        [episodeId]: { state: "error", message: err instanceof Error ? err.message : "Save failed" },
      }));
    }
  }

  return (
    <main className="min-h-screen bg-[#f2ede4] px-6 py-12 font-sans text-[#038f90]">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-serif text-4xl tracking-tight">Episode studio</h1>
        <p className="mt-2 max-w-2xl text-sm text-black/60">
          Episodes come from the podcast RSS feed and new YouTube uploads link themselves, both
          refreshed hourly. Use this only to attach a video the feeds can&apos;t find — usually an
          older episode. Paste a YouTube link or video id; leave a box empty and save to clear it.
        </p>
        <p className="mt-2 text-sm font-bold">
          {episodes.length} episodes · {missingCount} without a video ·{" "}
          {Object.keys(overrides).length} set by hand
        </p>

        <div className="sticky top-0 z-10 -mx-2 mt-6 flex flex-wrap items-center gap-4 bg-[#f2ede4]/95 px-2 py-4 backdrop-blur">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or guest…"
            className="min-w-[16rem] flex-1 rounded-xl bg-white px-4 py-3 text-sm shadow-inner ring-1 ring-[#038f90]/15 focus:outline-none focus:ring-2 focus:ring-[#038f90]/40"
          />
          <label className="flex items-center gap-2 text-sm font-bold">
            <input
              type="checkbox"
              checked={onlyMissing}
              onChange={(e) => setOnlyMissing(e.target.checked)}
              className="h-4 w-4 accent-[#0d6e4e]"
            />
            Only episodes without a video
          </label>
        </div>

        <ul className="mt-4 space-y-3">
          {visible.map((e) => {
            const row = rows[e.id] ?? { state: "idle" as const };
            const current = row.videoId !== undefined ? row.videoId : overrides[e.id]?.videoId ?? null;
            return (
              <li key={e.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#038f90]/10">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#0d6e4e]">
                    {e.ep > 0 ? `EP ${e.ep}` : e.date}
                  </span>
                  <h2 className="font-serif text-lg leading-tight">{e.title}</h2>
                </div>
                <p className="mt-1 text-xs text-black/50">
                  {e.published}
                  {e.guest && ` · ${e.guest}`}
                  {e.watch ? (
                    <>
                      {" · "}
                      <a
                        href={e.watch}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-[#0d6e4e] underline"
                      >
                        current video
                      </a>
                      {current && " (set by hand)"}
                    </>
                  ) : (
                    " · no video — falls back to a channel search"
                  )}
                </p>

                <form
                  className="mt-3 flex flex-wrap gap-2"
                  onSubmit={(ev) => {
                    ev.preventDefault();
                    const input = ev.currentTarget.elements.namedItem("video") as HTMLInputElement;
                    save(e.id, input.value);
                  }}
                >
                  <input
                    name="video"
                    defaultValue={current ?? ""}
                    placeholder="https://www.youtube.com/watch?v=… or the 11-character id"
                    className="min-w-[18rem] flex-1 rounded-xl bg-[#f2ede4] px-4 py-2.5 text-sm ring-1 ring-[#038f90]/15 focus:outline-none focus:ring-2 focus:ring-[#038f90]/40"
                  />
                  <button
                    type="submit"
                    disabled={row.state === "saving"}
                    className="rounded-xl bg-[#038f90] px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white disabled:opacity-60"
                  >
                    {row.state === "saving" ? "Saving…" : "Save"}
                  </button>
                  {row.message && (
                    <span
                      className={`self-center text-xs font-bold ${
                        row.state === "error" ? "text-red-600" : "text-[#0d6e4e]"
                      }`}
                    >
                      {row.message}
                    </span>
                  )}
                </form>
              </li>
            );
          })}
        </ul>

        {visible.length === 0 && (
          <p className="mt-10 rounded-2xl bg-white p-10 text-center text-sm text-black/50">
            Nothing matches. Every episode may already have a video.
          </p>
        )}

        <p className="mt-10 text-xs text-black/40">
          Saved changes show on the site within the hour, when the page revalidates.
        </p>
      </div>
    </main>
  );
}
