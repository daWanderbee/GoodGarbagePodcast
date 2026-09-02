import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
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

async function saveToDisk(record: object): Promise<boolean> {
  // ponytail: append-only JSONL, no DB. Needs a persistent disk — swap for Postgres
  // if this ever runs on a serverless host with an ephemeral filesystem.
  const file = process.env.CONTACT_LOG_PATH ?? path.join(process.cwd(), "data", "contact-submissions.jsonl");
  try {
    await mkdir(path.dirname(file), { recursive: true });
    await appendFile(file, JSON.stringify(record) + "\n", "utf8");
    return true;
  } catch (err) {
    console.error("[contact] could not write", file, err);
    return false;
  }
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


  // Only a genuine loss — nothing stored anywhere — is an error for the visitor.
  if (!saved && !leadId) return Response.json({ error: "Could not save your message." }, { status: 502 });
  return Response.json({ ok: true });
}
