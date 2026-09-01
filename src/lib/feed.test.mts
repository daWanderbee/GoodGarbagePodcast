// Run: node --test --experimental-strip-types src/lib/feed.test.mts
import test from "node:test";
import assert from "node:assert/strict";
import { parseFeed } from "./feed.ts";

const item = (title: string, extra = "") => `
  <item>
    <title><![CDATA[${title}]]></title>
    <description><![CDATA[<p>Ved sits down with Jane Doe, Founder of Acme, to talk compost and recycling.</p>]]></description>
    <pubDate>Thu, 30 Apr 2026 03:30:01 GMT</pubDate>
    <itunes:duration>01:09:07</itunes:duration>
    <itunes:episodeType>full</itunes:episodeType>
    <link>https://example.com/ep</link>
    ${extra}
  </item>`;

test("pulls the fields the site renders", () => {
  const [e] = parseFeed(`<rss>${item("Composting Works with Jane Doe | #42")}</rss>`);
  assert.equal(e.ep, 42);
  assert.equal(e.title, "Composting Works with Jane Doe");
  assert.equal(e.guest, "Jane Doe");
  assert.equal(e.role, "Founder of Acme");
  assert.equal(e.duration, "1h 9m");
  assert.equal(e.date, "Apr 2026");
  assert.equal(e.published, "2026-04-30");
  assert.equal(e.category, "Environment");
});

test("unnumbered episodes get ep 0 rather than an invented number", () => {
  const [e] = parseFeed(`<rss>${item("Around the World of Packaging with Alex Moore")}</rss>`);
  assert.equal(e.ep, 0);
});

test("ids stay unique when repeat segments share a title", () => {
  const xml = `<rss>${item("Around the World of Packaging with Alex Moore")}${item(
    "Around the World of Packaging with Alex Moore"
  )}</rss>`;
  const ids = parseFeed(xml).map((e) => e.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("drops trailers and anything unparseable", () => {
  assert.deepEqual(parseFeed("not xml at all"), []);
  assert.deepEqual(parseFeed(""), []);
  const trailer = item("A Trailer").replace("<itunes:episodeType>full", "<itunes:episodeType>trailer");
  assert.deepEqual(parseFeed(`<rss>${trailer}</rss>`), []);
});
