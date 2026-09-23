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

test("takes the Apple link from the lookup, matched by title and date", () => {
  const apple = [
    { title: "#42 Composting Works with Jane Doe", date: "1999-01-04", url: "https://podcasts.apple.com/ep42" },
    { title: "Some Other Show Entirely", date: "1999-01-04", url: "https://podcasts.apple.com/nope" },
  ];
  const [e] = parseFeed(`<rss>${item("Composting Works with Jane Doe | #42")}</rss>`, [], apple);
  assert.equal(e.apple, "https://podcasts.apple.com/ep42");
});

test("no Apple link rather than a wrong one", () => {
  // Right title, published years apart: that is a different episode of a recurring segment.
  const apple = [{ title: "Composting Works with Jane Doe", date: "2005-06-01", url: "https://podcasts.apple.com/wrong" }];
  const [e] = parseFeed(`<rss>${item("Composting Works with Jane Doe | #42")}</rss>`, [], apple);
  assert.equal(e.apple, "");
});

test("the monthly round-up has no guest — its presenters are not guests", () => {
  const xml = `<rss>${item("Around the World of Packaging with Sargam & Kumar | August 2026")}${item("Around The World of Packaging with Alex Moore")}</rss>`;
  for (const e of parseFeed(xml)) {
    assert.equal(e.guest, "");
    assert.equal(e.portrait, "");
  }
});

test("the numbered upload beats the Short cut from it", () => {
  // The channel publishes both on the same day; the Short takes the episode's title verbatim,
  // so on title alone it scores an exact match and the episode only scores containment.
  const videos = [
    { videoId: "short1", titles: ["Branding as Being with Raphael Bemporad"], thumbnail: "t/short", date: "1999-01-04", apple: null },
    { videoId: "full1", titles: ["#42 Branding as Being with Raphael Bemporad"], thumbnail: "t/full", date: "1999-01-04", apple: null },
  ];
  const [e] = parseFeed(`<rss>${item("Branding as Being with Raphael Bemporad | #42")}</rss>`, videos);
  assert.equal(e.watch, "https://www.youtube.com/watch?v=full1");
  assert.equal(e.thumbnail, "t/full");
});

const roundup = (title: string, date: string) => `
  <item>
    <title><![CDATA[${title}]]></title>
    <description><![CDATA[<p>Monthly packaging news.</p>]]></description>
    <pubDate>${date}</pubDate>
    <itunes:duration>00:12:57</itunes:duration>
    <itunes:episodeType>full</itunes:episodeType>
    <link>https://example.com/ep</link>
  </item>`;

test("the round-up finds its upload despite a completely different title", () => {
  const videos = [
    { videoId: "news", titles: ["Sustainable Packaging News, August 2026 | Sargam & Kumar"], thumbnail: "t/news", date: "2026-09-10", apple: null },
    { videoId: "short", titles: ["Is Ethical Capitalism the Future?"], thumbnail: "t/short", date: "2026-09-10", apple: null },
  ];
  const [e] = parseFeed(
    `<rss>${roundup("Around the World of Packaging with Sargam & Kumar | August 2026", "Thu, 10 Sep 2026 04:30:00 GMT")}</rss>`,
    videos,
  );
  assert.equal(e.watch, "https://www.youtube.com/watch?v=news");
  assert.equal(e.thumbnail, "t/news");
});

test("the round-up prefers the month it covers over a same-day upload by the same presenter", () => {
  const videos = [
    { videoId: "july", titles: ["Sustainable Packaging News, July 2026 | Sargam & Kumar"], thumbnail: "t/july", date: "2026-09-10", apple: null },
    { videoId: "august", titles: ["Sustainable Packaging News, August 2026 | Sargam & Kumar"], thumbnail: "t/august", date: "2026-09-12", apple: null },
  ];
  const [e] = parseFeed(
    `<rss>${roundup("Around the World of Packaging with Sargam & Kumar | August 2026", "Thu, 10 Sep 2026 04:30:00 GMT")}</rss>`,
    videos,
  );
  assert.equal(e.watch, "https://www.youtube.com/watch?v=august");
});

test("no video at all rather than a coin flip between same-day uploads", () => {
  const videos = [
    { videoId: "a", titles: ["Something Unrelated"], thumbnail: "t/a", date: "1999-01-04", apple: null },
    { videoId: "b", titles: ["Also Unrelated"], thumbnail: "t/b", date: "1999-01-04", apple: null },
  ];
  const [e] = parseFeed(`<rss>${item("Composting Works with Jane Doe | #42")}</rss>`, videos);
  assert.equal(e.watch, "");
});

test("a lone same-day upload is still taken", () => {
  const videos = [{ videoId: "only", titles: ["Something Unrelated"], thumbnail: "t/only", date: "1999-01-04", apple: null }];
  const [e] = parseFeed(`<rss>${item("Composting Works with Jane Doe | #42")}</rss>`, videos);
  assert.equal(e.watch, "https://www.youtube.com/watch?v=only");
});

test("a retitled upload is still found by the guest's surname", () => {
  // Both went up the same day, neither title survived the rename, and only the full episode
  // kept the guest's name — which is the whole signal left.
  const videos = [
    { videoId: "short", titles: ["Branding isn't marketing. It's who you are."], thumbnail: "t/short", date: "1999-01-04", apple: null },
    { videoId: "full", titles: ["Purpose-Driven Branding: Why Sustainable Brands Win | Jane Doe"], thumbnail: "t/full", date: "1999-01-04", apple: null },
  ];
  const [e] = parseFeed(`<rss>${item("Composting Works with Jane Doe | #42")}</rss>`, videos);
  assert.equal(e.watch, "https://www.youtube.com/watch?v=full");
  assert.equal(e.thumbnail, "t/full");
});

test("a guest name alone never beats a real title match", () => {
  const videos = [
    { videoId: "namedrop", titles: ["Some Other Episode Mentioning Jane Doe"], thumbnail: "t/name", date: "1999-01-04", apple: null },
    { videoId: "real", titles: ["Composting Works with Jane Doe"], thumbnail: "t/real", date: "1999-01-04", apple: null },
  ];
  const [e] = parseFeed(`<rss>${item("Composting Works with Jane Doe | #42")}</rss>`, videos);
  assert.equal(e.watch, "https://www.youtube.com/watch?v=real");
});
