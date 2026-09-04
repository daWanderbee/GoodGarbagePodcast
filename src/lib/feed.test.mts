// Run: node --test --experimental-strip-types src/lib/feed.test.mts
import test from "node:test";
import assert from "node:assert/strict";
import { parseFeed, watchUrl } from "./feed.ts";
import { EPISODE_VIDEOS } from "./episode-videos.ts";

const item = (title: string, extra = "") => `
  <item>
    <title><![CDATA[${title}]]></title>
    <description><![CDATA[<p>Ved sits down with Jane Doe, Founder of Acme, to talk compost and recycling.</p>]]></description>
    <pubDate>Mon, 04 Jan 1999 03:30:01 GMT</pubDate>
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
  assert.equal(e.date, "Jan 1999");
  assert.equal(e.published, "1999-01-04");
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

test("every play link goes to YouTube, exact video or channel search", () => {
  const [withVideo] = parseFeed(`<rss>${item("Composting Works with Jane Doe | #42")}</rss>`, [
    { videoId: "abc123", titles: ["Composting Works with Jane Doe"], thumbnail: "", date: "1999-01-04", apple: null },
  ]);
  assert.equal(withVideo.watch, "https://www.youtube.com/watch?v=abc123");
  assert.equal(watchUrl(withVideo), "https://www.youtube.com/watch?v=abc123");

  // No video: Spotify plays the actual episode, so it beats a YouTube search for something
  // that is not on the channel.
  const [noVideo] = parseFeed(`<rss>${item("Composting Works with Jane Doe | #42")}</rss>`);
  assert.equal(noVideo.watch, "");
  assert.equal(watchUrl(noVideo), "https://example.com/ep");

  // Nothing at all to link to — last resort is the channel's own search.
  assert.match(
    watchUrl({ title: "Composting Works with Jane Doe", watch: "", listen: "" }),
    /^https:\/\/www\.youtube\.com\/@GoodGarbage\/search\?query=/
  );
});

test("a short video title cannot claim an unrelated episode", () => {
  // The channel's own trailer is called "Good Garbage" — it must not match every episode
  // whose title happens to contain the show name.
  const [e] = parseFeed(`<rss>${item("Good Garbage Live with Jane Doe")}</rss>`, [
    { videoId: "trailer", titles: ["Good Garbage"], thumbnail: "", date: "2020-01-01", apple: null },
  ]);
  assert.equal(e.watch, "");
});

test("episodes sharing a title do not all claim the same video", () => {
  // The twelve monthly segments share a title and only some have a video. The title here is
  // invented: a real one would be found in EPISODE_VIDEOS and answered from there instead,
  // which is right in production but would not exercise the runtime matcher.
  const TITLE = "Orbiting the Moons of Packaging with Alex Moore";
  const xml = `<rss>
    ${item(TITLE)}
    ${item(TITLE).replace("Mon, 04 Jan 1999", "Tue, 04 Aug 1998")}
  </rss>`;
  const eps = parseFeed(xml, [
    { videoId: "onlyone", titles: [TITLE], thumbnail: "", date: "1999-01-04", apple: null },
  ]);
  const claimed = eps.filter((e) => e.watch === "https://www.youtube.com/watch?v=onlyone");
  assert.equal(claimed.length, 1);
  assert.equal(claimed[0].published, "1999-01-04");
});

test("the committed lookup table beats a runtime guess", () => {
  // Every back-catalogue episode is answered from EPISODE_VIDEOS, which was matched against
  // the whole channel and audited. A runtime guess must not be able to overwrite it, or a
  // stray title collision in the 15-video channel feed would relink an old episode.
  const [id, known] = Object.entries(EPISODE_VIDEOS)[0];
  const title = id.replace(/-/g, " ");
  const [e] = parseFeed(`<rss>${item(title)}</rss>`, [
    { videoId: "wrongvideo", titles: [title], thumbnail: "", date: "1999-01-04", apple: null },
  ]);
  assert.equal(e.id, id, "fixture must reproduce the table's slug");
  assert.equal(e.watch, `https://www.youtube.com/watch?v=${known.videoId}`);
});
