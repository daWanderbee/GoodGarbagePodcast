import { parseVideoId, studioKeyValid, writeOverride } from "@/lib/overrides";

// The override store is a JSON file. On a read-only serverless filesystem that write throws,
// and an unhandled throw is a 500 with no explanation. Say what actually went wrong instead.
const READ_ONLY =
  "This host's filesystem is read-only, so the change was not saved. Set OVERRIDES_PATH to a writable location, or run the studio locally and commit data/episode-overrides.json.";

async function save(episodeId: string, videoId: string | null): Promise<Response | null> {
  try {
    await writeOverride(episodeId, videoId);
    return null;
  } catch (err) {
    console.error("[studio] could not save override", err);
    return Response.json({ error: READ_ONLY }, { status: 503 });
  }
}

// Same key as the studio page. The page's secret URL would be pointless if this were open.
export async function POST(req: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!studioKeyValid(key)) return new Response("Not found", { status: 404 });

  const body = (await req.json().catch(() => null)) as
    | { episodeId?: unknown; video?: unknown }
    | null;

  const episodeId = typeof body?.episodeId === "string" ? body.episodeId.trim() : "";
  const raw = typeof body?.video === "string" ? body.video.trim() : "";
  if (!episodeId) return Response.json({ error: "Which episode?" }, { status: 400 });

  // Empty input clears the override and hands the episode back to the feeds.
  if (!raw) {
    return (await save(episodeId, null)) ?? Response.json({ ok: true, videoId: null });
  }

  const videoId = parseVideoId(raw);
  if (!videoId) {
    return Response.json(
      { error: "Not a YouTube link or video id. Paste the watch URL, or the 11-character id." },
      { status: 400 }
    );
  }

  const failed = await save(episodeId, videoId);
  if (failed) return failed;
  console.log(`[studio] ${episodeId} -> ${videoId}`);
  return Response.json({ ok: true, videoId });
}
