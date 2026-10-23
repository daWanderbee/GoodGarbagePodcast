// Zoho Campaigns list subscription for the newsletter — the same Zoho Campaigns account that
// sends Pakka Maitri. Same Self Client as the CRM token (client id/secret from zoho.ts), but a
// separate refresh token, because the CRM one carries no Campaigns scope.
//
// Env: ZOHO_CAMPAIGNS_REFRESH_TOKEN (scope ZohoCampaigns.contact.ALL, made with
// scripts/zoho-campaigns-token.mjs), plus the ZOHO_* credentials zoho.ts reads.
import { credentials } from "./zoho";

const dc = () => process.env.ZOHO_DATA_CENTER ?? "in";
let tokenCache: { value: string; expiresAt: number } | null = null;

export function campaignsConfigured(): boolean {
  return Boolean(process.env.ZOHO_CAMPAIGNS_REFRESH_TOKEN && credentials());
}

async function accessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt - 60_000) return tokenCache.value;
  const creds = credentials();
  const refresh_token = process.env.ZOHO_CAMPAIGNS_REFRESH_TOKEN;
  if (!creds || !refresh_token) throw new Error("Zoho Campaigns credentials are not configured");

  const res = await fetch(`https://accounts.zoho.${dc()}/oauth/v2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    cache: "no-store",
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: creds.client_id,
      client_secret: creds.client_secret,
      refresh_token,
    }).toString(),
  });
  const data = (await res.json()) as { access_token?: string; error?: string; expires_in?: number };
  if (!data.access_token) throw new Error(`Zoho Campaigns token refresh failed: ${data.error ?? "no access_token"}`);

  tokenCache = { value: data.access_token, expiresAt: Date.now() + Number(data.expires_in ?? 3600) * 1000 };
  return data.access_token;
}

/**
 * Adds the email to a mailing list. On a private list Zoho adds it straight away, with no
 * confirmation mail; re-subscribing an address already on the list also succeeds.
 */
export async function subscribe(listKey: string, email: string, source: string): Promise<void> {
  const q = new URLSearchParams({
    resfmt: "JSON",
    listkey: listKey,
    contactinfo: JSON.stringify({ "Contact Email": email }),
    source,
  });
  const res = await fetch(`https://campaigns.zoho.${dc()}/api/v1.1/json/listsubscribe?${q}`, {
    method: "POST",
    cache: "no-store",
    headers: { Authorization: `Zoho-oauthtoken ${await accessToken()}` },
  });
  const body = (await res.json().catch(() => null)) as { status?: string; code?: string; message?: string } | null;
  if (!res.ok || body?.status !== "success") {
    throw new Error(`Zoho Campaigns subscribe ${res.status}: ${body?.code ?? ""} ${body?.message ?? ""}`);
  }
}
