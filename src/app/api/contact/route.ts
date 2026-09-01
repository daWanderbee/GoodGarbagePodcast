import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { validate } from "@/lib/contact";
import { createLead, splitName, zohoConfigured } from "@/lib/zoho";

// Contact form intake. Order matters: the submission is written to disk BEFORE any
// network call, so a Zoho or Resend outage can never lose someone's message.
// Env: ZOHO_* (see src/lib/zoho.ts), optional RESEND_API_KEY, CONTACT_TO, CONTACT_FROM,
// CONTACT_LOG_PATH (default ./data/contact-submissions.jsonl).

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

async function emailNotification(r: { name: string; email: string; topic: string; message: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM ?? "Good Garbage <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO ?? "hello@goodgarbage.eco"],
        reply_to: r.email,
        subject: `[${r.topic}] ${r.name}`,
        text: `${r.name} <${r.email}>\nTopic: ${r.topic}\n\n${r.message}`,
      }),
    });
    if (!res.ok) console.error("[contact] resend failed", res.status, await res.text());
  } catch (err) {
    console.error("[contact] resend threw", err);
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
      leadId = await createLead({
        ...splitName(name),
        Email: email,
        Company: `Good Garbage enquiry — ${topic}`,
        Lead_Source: LEAD_SOURCE,
        Lead_Status: "Fresh Lead",
        Description: `Topic: ${topic}\n\n${message}`,
      });
    } catch (err) {
      zohoError = err instanceof Error ? err.message : String(err);
      console.error("[contact] zoho lead failed", zohoError);
    }
  } else {
    zohoError = "ZOHO_* env vars not set";
    console.error("[contact] zoho not configured — lead not created for", email);
  }

  await emailNotification({ name, email, topic, message });

  // Only a genuine loss — nothing stored anywhere — is an error for the visitor.
  if (!saved && !leadId) return Response.json({ error: "Could not save your message." }, { status: 502 });
  return Response.json({ ok: true });
}
