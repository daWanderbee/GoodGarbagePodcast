// Turns a Zoho Self Client grant code into a Zoho Campaigns refresh token and writes it to
// .env.local as ZOHO_CAMPAIGNS_REFRESH_TOKEN. The token is never printed.
//
//   node --env-file=.env.local scripts/zoho-campaigns-token.mjs <grant-code>
//
// Generate the code in api-console.zoho.in → the existing Self Client → Generate Code, with
// scope ZohoCampaigns.contact.UPDATE,ZohoCampaigns.campaign.READ. It expires in minutes, so
// run this straight away. Uses the same client id/secret as the CRM token (ZOHO_TOKEN_FILE
// or ZOHO_CLIENT_ID/ZOHO_CLIENT_SECRET).

import { readFileSync, writeFileSync } from "node:fs";

const code = process.argv[2];
if (!code) {
  console.error("Usage: node --env-file=.env.local scripts/zoho-campaigns-token.mjs <grant-code>");
  process.exit(1);
}

let { ZOHO_CLIENT_ID: client_id, ZOHO_CLIENT_SECRET: client_secret } = process.env;
if (process.env.ZOHO_TOKEN_FILE) {
  ({ client_id, client_secret } = JSON.parse(readFileSync(process.env.ZOHO_TOKEN_FILE, "utf8")));
}
if (!client_id || !client_secret) {
  console.error("No Zoho client id/secret: set ZOHO_TOKEN_FILE or ZOHO_CLIENT_ID/ZOHO_CLIENT_SECRET.");
  process.exit(1);
}

const dc = process.env.ZOHO_DATA_CENTER ?? "in";
const res = await fetch(`https://accounts.zoho.${dc}/oauth/v2/token`, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ grant_type: "authorization_code", code, client_id, client_secret }),
});
const data = await res.json();
if (!data.refresh_token) {
  console.error(`No refresh token: ${data.error ?? res.status}. Codes expire fast and work once; generate a new one.`);
  process.exit(1);
}

const line = `ZOHO_CAMPAIGNS_REFRESH_TOKEN=${data.refresh_token}`;
const env = readFileSync(".env.local", "utf8");
const next = /^ZOHO_CAMPAIGNS_REFRESH_TOKEN=.*$/m.test(env)
  ? env.replace(/^ZOHO_CAMPAIGNS_REFRESH_TOKEN=.*$/m, line)
  : env.replace(/\n?$/, "\n") + line + "\n";
writeFileSync(".env.local", next);
console.log(`Saved ZOHO_CAMPAIGNS_REFRESH_TOKEN to .env.local (scope: ${data.scope ?? "not returned"}).`);
