// Adds "GoodGarbageContact" to the Leads → Lead Source picklist in Zoho CRM.
// Zoho rejects lead writes carrying a picklist value that doesn't exist, so this has to
// run once before the contact form can create leads.
//
//   node --env-file=.env.local scripts/zoho-add-lead-source.mjs --dry   # show current values
//   node --env-file=.env.local scripts/zoho-add-lead-source.mjs         # add the value
//
// Needs a refresh token with ZohoCRM.settings.fields.ALL (the read-only tokens used by
// the other Pakka projects are not enough). Safe to re-run: it exits early if the value
// is already there, and always resends the existing values so none are dropped.

import { readFileSync, writeFileSync } from "node:fs";

const VALUE = process.env.LEAD_SOURCE_VALUE ?? "GoodGarbageContact";
const DRY = process.argv.includes("--dry");
const dc = process.env.ZOHO_DATA_CENTER ?? "in";

// Credentials come either from the environment, or from an existing Zoho token cache
// elsewhere in the tree (ZOHO_TOKEN_FILE=…/Apps/Chuk/zoho_token.json) so that a working
// refresh token doesn't have to be copied into this project.
let creds = {
  client_id: process.env.ZOHO_CLIENT_ID,
  client_secret: process.env.ZOHO_CLIENT_SECRET,
  refresh_token: process.env.ZOHO_REFRESH_TOKEN,
};
if (process.env.ZOHO_TOKEN_FILE) {
  const f = JSON.parse(readFileSync(process.env.ZOHO_TOKEN_FILE, "utf8"));
  creds = { client_id: f.client_id, client_secret: f.client_secret, refresh_token: f.refresh_token };
}

const missing = Object.entries(creds).filter(([, v]) => !v).map(([k]) => k);
if (missing.length) {
  console.error(`Missing credentials: ${missing.join(", ")}.`);
  console.error("Pass --env-file=.env.local, or set ZOHO_TOKEN_FILE to a zoho_token.json.");
  process.exit(1);
}

const tokenRes = await fetch(`https://accounts.zoho.${dc}/oauth/v2/token`, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ grant_type: "refresh_token", ...creds }).toString(),
});
const token = await tokenRes.json();
if (!token.access_token) {
  console.error("Token refresh failed:", token.error ?? JSON.stringify(token).slice(0, 200));
  process.exit(1);
}
const auth = { Authorization: `Zoho-oauthtoken ${token.access_token}` };
const api = `https://www.zohoapis.${dc}/crm/v3/settings/fields`;

const fieldsRes = await fetch(`${api}?module=Leads`, { headers: auth });
const fieldsBody = await fieldsRes.json().catch(() => null);
if (!fieldsRes.ok) {
  console.error(`Could not read Leads fields (${fieldsRes.status}):`, JSON.stringify(fieldsBody).slice(0, 300));
  console.error("A 401/OAUTH_SCOPE_MISMATCH here means the token lacks ZohoCRM.settings.fields.READ.");
  process.exit(1);
}

const field = fieldsBody.fields?.find((f) => f.api_name === "Lead_Source");
if (!field) {
  console.error("No Lead_Source field on the Leads module.");
  process.exit(1);
}

const existing = field.pick_list_values ?? [];
console.log(`Lead Source currently has ${existing.length} values:`);
console.log("  " + existing.map((v) => v.display_value).join(" | "));

if (existing.some((v) => v.display_value === VALUE || v.actual_value === VALUE)) {
  console.log(`\n"${VALUE}" already exists — nothing to do.`);
  process.exit(0);
}
if (DRY) {
  console.log(`\n--dry: would add "${VALUE}" as value ${existing.length + 1}.`);
  process.exit(0);
}

// Omitting an existing value from the PATCH deletes it, so back the list up first.
const backup = `zoho-lead-source-backup-${new Date().toISOString().slice(0, 10)}.json`;
writeFileSync(backup, JSON.stringify(existing, null, 1));
console.log(`\nBacked up the current ${existing.length} values to ${backup}`);

// Resend every existing value (with its id, so Zoho updates rather than recreates them)
// plus the new one.
const pick_list_values = [
  ...existing.map((v) => ({ id: v.id, display_value: v.display_value, actual_value: v.actual_value })),
  { display_value: VALUE, actual_value: VALUE },
];

const patchRes = await fetch(`${api}/${field.id}?module=Leads`, {
  method: "PATCH",
  headers: { ...auth, "Content-Type": "application/json" },
  body: JSON.stringify({ fields: [{ id: field.id, pick_list_values }] }),
});
const patchBody = await patchRes.json().catch(() => null);
const row = patchBody?.fields?.[0];
if (!patchRes.ok || row?.code !== "SUCCESS") {
  console.error(`\nPATCH failed (${patchRes.status}):`, JSON.stringify(patchBody).slice(0, 400));
  console.error("OAUTH_SCOPE_MISMATCH here means the token lacks ZohoCRM.settings.fields.ALL.");
  process.exit(1);
}

console.log(`\nAdded "${VALUE}" to Lead Source.`);
