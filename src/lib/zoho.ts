// Zoho CRM lead creation. Same self-client refresh-token flow as Apps/ZohoCommunications,
// same Lead field names as Chuk's woo_zoho_snippet.php (Pakka org, India DC).
//
// Credentials: ZOHO_CLIENT_ID / ZOHO_CLIENT_SECRET / ZOHO_REFRESH_TOKEN, or ZOHO_TOKEN_FILE
// pointing at an existing zoho_token.json elsewhere on the machine. The file route exists
// so local development doesn't need a second copy of a long-lived refresh token on disk;
// deployments should use the env vars.
// Also: ZOHO_DATA_CENTER (default "in").
import { readFileSync } from "node:fs";

let tokenCache: { value: string; expiresAt: number } | null = null;

const dc = () => process.env.ZOHO_DATA_CENTER ?? "in";

type Creds = { client_id: string; client_secret: string; refresh_token: string };

function credentials(): Creds | null {
  const { ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN, ZOHO_TOKEN_FILE } = process.env;
  if (ZOHO_CLIENT_ID && ZOHO_CLIENT_SECRET && ZOHO_REFRESH_TOKEN) {
    return {
      client_id: ZOHO_CLIENT_ID,
      client_secret: ZOHO_CLIENT_SECRET,
      refresh_token: ZOHO_REFRESH_TOKEN,
    };
  }
  if (ZOHO_TOKEN_FILE) {
    try {
      const f = JSON.parse(readFileSync(ZOHO_TOKEN_FILE, "utf8"));
      if (f.client_id && f.client_secret && f.refresh_token) {
        return { client_id: f.client_id, client_secret: f.client_secret, refresh_token: f.refresh_token };
      }
      console.error("[zoho] ZOHO_TOKEN_FILE is missing client_id/client_secret/refresh_token");
    } catch (err) {
      console.error("[zoho] could not read ZOHO_TOKEN_FILE:", err);
    }
  }
  return null;
}

export function zohoConfigured(): boolean {
  return credentials() !== null;
}

async function accessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt - 60_000) return tokenCache.value;

  const creds = credentials();
  if (!creds) throw new Error("Zoho credentials are not configured");

  const res = await fetch(`https://accounts.zoho.${dc()}/oauth/v2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    cache: "no-store",
    body: new URLSearchParams({ grant_type: "refresh_token", ...creds }).toString(),
  });

  const data = (await res.json()) as { access_token?: string; error?: string; expires_in?: number };
  if (!data.access_token) throw new Error(`Zoho token refresh failed: ${data.error ?? "no access_token"}`);

  tokenCache = { value: data.access_token, expiresAt: Date.now() + Number(data.expires_in ?? 3600) * 1000 };
  return data.access_token;
}

/** Zoho requires Last_Name and Company on a Lead, so both always get a value. */
export function splitName(full: string): { First_Name?: string; Last_Name: string } {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { Last_Name: parts[0] };
  return { First_Name: parts.slice(0, -1).join(" "), Last_Name: parts[parts.length - 1] };
}

async function api(path: string, init?: RequestInit) {
  const token = await accessToken();
  return fetch(`https://www.zohoapis.${dc()}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
}

type Row = { code?: string; details?: { id?: string }; message?: string };

async function findLeadByEmail(email: string): Promise<string | null> {
  const criteria = encodeURIComponent(`(Email:equals:${email})`);
  const res = await api(`/crm/v2/Leads/search?criteria=${criteria}`);
  if (res.status === 204) return null; // Zoho's "no matches"
  if (!res.ok) throw new Error(`Zoho search ${res.status}: ${(await res.text()).slice(0, 160)}`);
  const body = (await res.json().catch(() => null)) as { data?: { id?: string }[] } | null;
  return body?.data?.[0]?.id ?? null;
}

async function addNote(leadId: string, title: string, content: string): Promise<void> {
  const res = await api(`/crm/v2/Leads/${leadId}/Notes`, {
    method: "POST",
    body: JSON.stringify({ data: [{ Note_Title: title, Note_Content: content }] }),
  });
  const row = ((await res.json().catch(() => null)) as { data?: Row[] } | null)?.data?.[0];
  if (!res.ok || row?.code !== "SUCCESS") {
    throw new Error(`Zoho note ${res.status}: ${row?.code ?? ""} ${row?.message ?? ""}`);
  }
}

/**
 * Puts an existing lead back in the queue. A note on a lead sitting at "Junk Lead" or
 * "Closed" is recorded but nobody ever sees it — and someone who just filled in the
 * contact form is, by definition, a live enquiry again.
 *
 * Only Lead_Status is touched. Lead_Source stays as it was, so the original attribution
 * survives. Failure here is not fatal: the note is already saved, which is the record
 * that matters.
 */
const REOPEN_STATUS = "Fresh Lead";

/**
 * Pakka's Leads module runs a Blueprint, which owns Lead_Status: a plain field write comes
 * back RECORD_IN_BLUEPRINT for any record currently in the process — i.e. exactly the leads
 * somebody is working. Fall back to executing the blueprint transition that leads to
 * "Fresh Lead", which is what the UI does.
 */
async function transitionToFresh(leadId: string): Promise<boolean> {
  const res = await api(`/crm/v2/Leads/${leadId}/actions/blueprint`);
  if (!res.ok) return false;
  const body = (await res.json().catch(() => null)) as
    | { blueprint?: { transitions?: { id: string; next_field_value?: string }[] } }
    | null;
  const move = body?.blueprint?.transitions?.find((t) => t.next_field_value === REOPEN_STATUS);
  if (!move) return false;

  const put = await api(`/crm/v2/Leads/${leadId}/actions/blueprint`, {
    method: "PUT",
    body: JSON.stringify({ blueprint: [{ transition_id: move.id, data: {} }] }),
  });
  return put.ok;
}

async function reopen(leadId: string): Promise<void> {
  try {
    const res = await api(`/crm/v2/Leads/${leadId}`, {
      method: "PUT",
      body: JSON.stringify({ data: [{ id: leadId, Lead_Status: REOPEN_STATUS }] }),
    });
    const row = ((await res.json().catch(() => null)) as { data?: Row[] } | null)?.data?.[0];
    if (res.ok && row?.code === "SUCCESS") return;

    if (row?.code === "RECORD_IN_BLUEPRINT" && (await transitionToFresh(leadId))) return;

    console.error(`[zoho] could not reopen lead ${leadId}: ${row?.code ?? res.status} ${row?.message ?? ""}`);
  } catch (err) {
    console.error(`[zoho] could not reopen lead ${leadId}:`, err);
  }
}

/**
 * Tags the lead so form submitters stay findable.
 *
 * Lead_Source alone can't answer "who contacted us through the site": someone already in
 * the CRM keeps their original source (a lead won at Paperex stays Paperex), so filtering
 * on Lead_Source = GoodGarbageContact silently misses every returning contact. A tag is
 * additive, applies to new and existing leads alike, and is filterable in list views.
 */
async function addTag(leadId: string, tag: string): Promise<void> {
  try {
    const res = await api(
      `/crm/v2/Leads/${leadId}/actions/add_tags?tag_names=${encodeURIComponent(tag)}`,
      { method: "POST" }
    );
    const row = ((await res.json().catch(() => null)) as { data?: Row[] } | null)?.data?.[0];
    if (!res.ok || row?.code !== "SUCCESS") {
      console.error(`[zoho] could not tag lead ${leadId}: ${row?.code ?? res.status} ${row?.message ?? ""}`);
    }
  } catch (err) {
    console.error(`[zoho] could not tag lead ${leadId}:`, err);
  }
}

export type LeadOutcome = { id: string; created: boolean };

/**
 * Creates the lead, or — when someone who is already in the CRM writes in — attaches the
 * enquiry to their existing lead as a Note.
 *
 * Deliberately does NOT update the existing record: overwriting Lead_Source would destroy
 * the original attribution (a lead won at Paperex would silently become a website lead),
 * and overwriting Description would drop whatever was already there. A note preserves both,
 * and stacks up if the same person writes in more than once.
 */
export async function createLead(
  fields: Record<string, string>,
  onDuplicate: { email: string; title: string; body: string },
  tag: string
): Promise<LeadOutcome> {
  const res = await api("/crm/v2/Leads", {
    method: "POST",
    body: JSON.stringify({ data: [fields], trigger: ["workflow"] }),
  });
  const row = ((await res.json().catch(() => null)) as { data?: Row[] } | null)?.data?.[0];

  if (row?.code === "SUCCESS") {
    const id = row.details?.id ?? "";
    await addTag(id, tag);
    return { id, created: true };
  }

  if (row?.code === "DUPLICATE_DATA") {
    const existing = row.details?.id ?? (await findLeadByEmail(onDuplicate.email));
    if (!existing) throw new Error("Zoho reported a duplicate lead but would not identify it");
    await addNote(existing, onDuplicate.title, onDuplicate.body);
    await reopen(existing);
    await addTag(existing, tag);
    return { id: existing, created: false };
  }

  throw new Error(`Zoho ${res.status}: ${row?.code ?? ""} ${row?.message ?? ""}`);
}
