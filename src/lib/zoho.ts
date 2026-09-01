// Zoho CRM lead creation. Same self-client refresh-token flow as Apps/ZohoCommunications,
// same Lead field names as Chuk's woo_zoho_snippet.php (Pakka org, India DC).
// Env: ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN, ZOHO_DATA_CENTER (default "in").

let tokenCache: { value: string; expiresAt: number } | null = null;

const dc = () => process.env.ZOHO_DATA_CENTER ?? "in";

export function zohoConfigured(): boolean {
  return Boolean(
    process.env.ZOHO_CLIENT_ID && process.env.ZOHO_CLIENT_SECRET && process.env.ZOHO_REFRESH_TOKEN
  );
}

async function accessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt - 60_000) return tokenCache.value;

  const res = await fetch(`https://accounts.zoho.${dc()}/oauth/v2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    cache: "no-store",
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.ZOHO_CLIENT_ID ?? "",
      client_secret: process.env.ZOHO_CLIENT_SECRET ?? "",
      refresh_token: process.env.ZOHO_REFRESH_TOKEN ?? "",
    }).toString(),
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

export async function createLead(fields: Record<string, string>): Promise<string> {
  const token = await accessToken();
  const res = await fetch(`https://www.zohoapis.${dc()}/crm/v2/Leads`, {
    method: "POST",
    headers: { Authorization: `Zoho-oauthtoken ${token}`, "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({ data: [fields], trigger: ["workflow"] }),
  });

  const body = (await res.json().catch(() => null)) as
    | { data?: { code?: string; details?: { id?: string }; message?: string }[] }
    | null;
  const row = body?.data?.[0];
  if (!res.ok || row?.code !== "SUCCESS") {
    throw new Error(`Zoho ${res.status}: ${row?.code ?? ""} ${row?.message ?? JSON.stringify(body).slice(0, 200)}`);
  }
  return row.details?.id ?? "";
}
