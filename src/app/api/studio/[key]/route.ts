import { parseVideoId, studioKeyValid, writeOverride } from "@/lib/overrides";

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
    await writeOverride(episodeId, null);
    return Response.json({ ok: true, videoId: null });
  }

  const videoId = parseVideoId(raw);
  if (!videoId) {
    return Response.json(
      { error: "Not a YouTube link or video id. Paste the watch URL, or the 11-character id." },
      { status: 400 }
    );
  }

  await writeOverride(episodeId, videoId);
  console.log(`[studio] ${episodeId} -> ${videoId}`);
  return Response.json({ ok: true, videoId });
}
