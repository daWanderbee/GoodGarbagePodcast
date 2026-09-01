export type ContactInput = { name: string; email: string; topic: string; message: string };

const LIMITS = { name: 100, email: 200, topic: 60, message: 5000 };

export function validate(body: unknown): { data: ContactInput } | { error: string } {
  if (typeof body !== "object" || body === null) return { error: "Invalid body" };
  const raw = body as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const [field, max] of Object.entries(LIMITS)) {
    const v = raw[field];
    if (typeof v !== "string" || !v.trim()) return { error: `Missing ${field}` };
    if (v.length > max) return { error: `${field} is too long` };
    out[field] = v.trim();
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(out.email)) return { error: "Invalid email" };
  return { data: out as ContactInput };
}
