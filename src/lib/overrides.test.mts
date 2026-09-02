// Run: node --test --experimental-strip-types src/lib/overrides.test.mts
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { applyOverrides, parseVideoId, readOverrides, studioKeyValid, writeOverride } from "./overrides.ts";
import type { Episode } from "./feed.ts";

process.env.OVERRIDES_PATH = join(mkdtempSync(join(tmpdir(), "ggp-")), "overrides.json");

test("reads the id out of whatever form gets pasted", () => {
  const id = "dQw4w9WgXcQ";
  for (const input of [
    id,
    `  ${id}  `,
    `https://www.youtube.com/watch?v=${id}`,
    `https://www.youtube.com/watch?v=${id}&t=42s`,
    `https://youtu.be/${id}`,
    `https://www.youtube.com/embed/${id}`,
    `https://www.youtube.com/shorts/${id}`,
  ]) {
    assert.equal(parseVideoId(input), id, input);
  }
  for (const bad of ["", "   ", "not a link", "https://vimeo.com/12345", "https://www.youtube.com/@GoodGarbage"]) {
    assert.equal(parseVideoId(bad), null, bad);
  }
});

test("saving then clearing leaves nothing behind", async () => {
  await writeOverride("ep-one", "dQw4w9WgXcQ");
  assert.deepEqual(await readOverrides(), { "ep-one": { videoId: "dQw4w9WgXcQ" } });

  // Regression: the first version merged the old value back in, so clearing did nothing.
  await writeOverride("ep-one", null);
  assert.deepEqual(await readOverrides(), {});
  assert.equal(readFileSync(process.env.OVERRIDES_PATH!, "utf8").includes("dQw4w9WgXcQ"), false);
});

test("an override replaces the video and its thumbnail, nothing else", () => {
  const episode = {
    id: "ep-one",
    ep: 1,
    title: "A Title",
    description: "d",
    guest: "G",
    role: "",
    category: "Environment",
    duration: "1h",
    date: "Jan 1999",
    published: "1999-01-04",
    thumbnail: "https://example.com/old.jpg",
    watch: "",
  } as Episode;

  const [out] = applyOverrides([episode], { "ep-one": { videoId: "dQw4w9WgXcQ" } });
  assert.equal(out.watch, "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  assert.equal(out.thumbnail, "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg");
  assert.equal(out.title, "A Title");
  assert.deepEqual(applyOverrides([episode], {}), [episode]);
});

test("the studio key fails closed", () => {
  const saved = process.env.STUDIO_KEY;

  delete process.env.STUDIO_KEY;
  assert.equal(studioKeyValid("anything"), false, "no key configured must reject everything");

  process.env.STUDIO_KEY = "short";
  assert.equal(studioKeyValid("short"), false, "a too-short key is not a credential");

  process.env.STUDIO_KEY = "QHIhRjs-J-4QJQarkhBf9zHa";
  assert.equal(studioKeyValid("QHIhRjs-J-4QJQarkhBf9zHa"), true);
  assert.equal(studioKeyValid("QHIhRjs-J-4QJQarkhBf9zH"), false);
  assert.equal(studioKeyValid(""), false);
  assert.equal(studioKeyValid(undefined), false);

  process.env.STUDIO_KEY = saved;
});
