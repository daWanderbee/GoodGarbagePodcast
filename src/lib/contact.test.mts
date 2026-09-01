// Run: node --test --experimental-strip-types src/lib/contact.test.mts
import test from "node:test";
import assert from "node:assert/strict";
import { validate } from "./contact.ts";

const ok = { name: "Ada", email: "ada@example.com", topic: "Guest", message: "hi" };

test("accepts and trims a good submission", () => {
  const r = validate({ ...ok, name: "  Ada  " });
  assert.deepEqual(r, { data: { ...ok, name: "Ada" } });
});

test("rejects bad input", () => {
  for (const bad of [
    null,
    { ...ok, email: "nope" },
    { ...ok, message: "   " },
    { ...ok, topic: undefined },
    { ...ok, message: "x".repeat(5001) },
  ]) {
    assert.ok("error" in validate(bad), `should reject ${JSON.stringify(bad)}`);
  }
});
