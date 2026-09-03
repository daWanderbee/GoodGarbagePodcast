import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
import { validate } from "@/lib/contact";
import { createLead, splitName, zohoConfigured } from "@/lib/zoho";

// Contact form intake. Order matters: the submission is written to disk BEFORE the Zoho
// call, so a CRM outage can never lose someone's message.
//
// This route sends no mail of any kind. Submissions reach people through the CRM and the
// disk log only.
//
// Env: ZOHO_* (see src/lib/zoho.ts), CONTACT_LOG_PATH
// (default ./data/contact-submissions.jsonl).

const LEAD_SOURCE = "GoodGarbageContact";

/**
 * Append-only JSONL, no DB. Fine on a persistent disk; on a serverless host the project
 * directory is read-only and /tmp is wiped between invocations, so this is best-effort
 * there and the CRM is the real store.
 */
async function saveToDisk(record: object): Promise<boolean> {
  const candidates = [
    process.env.CONTACT_LOG_PATH,
    path.join(process.cwd(), "data", "contact-submissions.jsonl"),
    path.join(tmpdir(), "contact-submissions.jsonl"),
  ].filter((p): p is string => Boolean(p));

  for (const file of candidates) {
    try {
      await mkdir(path.dirname(file), { recursive: true });
      await appendFile(file, JSON.stringify(record) + "\n", "utf8");
      return true;
    } catch {
      // Try the next location; only the last failure is worth reporting.
    }
  }
  console.error("[contact] no writable location for the submission log");
  return false;
}

export async function POST(req: Request) {
  const parsed = validate(await req.json().catch(() => null));
  if ("error" in parsed) return Response.json({ error: parsed.error }, { status: 400 });
  const { name, email, topic, message } = parsed.data;

  const saved = await saveToDisk({ at: new Date().toISOString(), source: LEAD_SOURCE, name, email, topic, message });

  let leadId = "";
  let zohoError = "";
  if (zohoConfigured()) {
    try {
      const lead = await createLead(
        {
          ...splitName(name),
          Email: email,
          Company: `Good Garbage enquiry — ${topic}`,
          Lead_Source: LEAD_SOURCE,
          Lead_Status: "Fresh Lead",
          Description: `Topic: ${topic}\n\n${message}`,
        },
        {
          email,
          title: `Good Garbage contact form — ${topic}`,
          // No angle brackets: Zoho renders note content as markup and would swallow
          // "<name@host>" as a tag.
          body: `From: ${name} (${email})\nTopic: ${topic}\n\n${message}`,
        },
        LEAD_SOURCE
      );
      leadId = lead.id;
      console.log(`[contact] zoho lead ${lead.created ? "created" : "already existed, noted"}: ${lead.id}`);
    } catch (err) {
      zohoError = err instanceof Error ? err.message : String(err);
      console.error("[contact] zoho lead failed", zohoError);
    }
  } else {
    zohoError = "ZOHO_* env vars not set";
    console.error("[contact] zoho not configured — lead not created for", email);
  }


  // Last resort: if neither the disk nor the CRM took it, put the whole submission in the
  // platform log, where it is still recoverable. Losing someone's message because a host
  // has a read-only filesystem is not an acceptable outcome.
  if (!saved && !leadId) {
    console.error(
      "[contact] NOT STORED — recover from this log line:",
      JSON.stringify({ at: new Date().toISOString(), name, email, topic, message })
    );
  }
  return Response.json({ ok: true });
}
