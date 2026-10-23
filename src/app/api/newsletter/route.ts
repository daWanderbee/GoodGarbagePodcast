import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
import { campaignsConfigured, subscribe } from "@/lib/zoho-campaigns";

const LEAD_SOURCE = "GoodGarbageNewsletter";
// Zoho Campaigns list "Good Garbage Newsletter" (private), sent the way Pakka Maitri is.
// No CRM lead: subscribers are not enquiries, and a CRM lead lands in the sales queue.
const LIST_KEY = "3z12c1c4cb8bc9de81b94d1343485fc2803959d35425bf5a7ca6ce229fef9a467e";

async function saveToDisk(record: object): Promise<boolean> {
  const candidates = [
    process.env.NEWSLETTER_LOG_PATH,
    path.join(process.cwd(), "data", "newsletter-subscribers.jsonl"),
    path.join(tmpdir(), "newsletter-subscribers.jsonl"),
  ].filter((p): p is string => Boolean(p));

  for (const file of candidates) {
    try {
      await mkdir(path.dirname(file), { recursive: true });
      await appendFile(file, JSON.stringify(record) + "\n", "utf8");
      return true;
    } catch {
      // Try next location
    }
  }
  console.error("[newsletter] no writable location for newsletter subscription log");
  return false;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return Response.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    await saveToDisk({
      at: new Date().toISOString(),
      source: LEAD_SOURCE,
      email,
    });

    if (campaignsConfigured()) {
      try {
        await subscribe(LIST_KEY, email, "Good Garbage website");
      } catch (err) {
        // On Vercel the disk log is /tmp and does not survive, so Zoho is the only record:
        // tell the visitor to retry rather than claim a subscription nobody kept.
        console.error("[newsletter] zoho campaigns subscribe failed", err);
        return Response.json({ error: "Could not subscribe right now, please try again" }, { status: 502 });
      }
    } else {
      // Same reason as above: without Zoho the /tmp log is the only record, and it is lost.
      console.error("[newsletter] zoho campaigns not configured, subscriber not saved");
      return Response.json({ error: "Could not subscribe right now, please try again" }, { status: 503 });
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("[newsletter] error processing request", error);
    return Response.json({ error: "Failed to process subscription" }, { status: 500 });
  }
}
