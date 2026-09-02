import type { MetadataRoute } from "next";

// The studio has no login — its URL is the credential — so keep it out of search indexes.
// This is a courtesy to well-behaved crawlers, not a security control.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/studio/", "/api/"] }],
  };
}
