This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contact form

`POST /api/contact` validates the submission, then:

1. appends it to `data/contact-submissions.jsonl` (gitignored — personal data),
2. creates a Zoho CRM Lead with `Lead_Source = GoodGarbageContact` — or, if that email is
   already a lead, attaches the enquiry to it as a **Note** and sets `Lead_Status` back to
   `Fresh Lead` so it resurfaces in the queue. `Lead_Source` is never overwritten: doing so
   would destroy the original attribution.
   Either way the lead is **tagged `GoodGarbageContact`**. Filter by that tag to list
   everyone who used the form — `Lead_Source` won't do it, because a returning contact
   keeps whatever source originally won them.
   The Leads module runs a Blueprint that owns `Lead_Status`, so when a direct write is
   refused with `RECORD_IN_BLUEPRINT` the code executes the blueprint transition instead.

This route sends no mail. Submissions reach people through the CRM and the disk log only.

The disk write happens first, so a CRM outage can never lose a message.
The visitor only sees an error if nothing was stored at all.

Set in `.env.local` (and in the host's env for production):

```
ZOHO_CLIENT_ID=...
ZOHO_CLIENT_SECRET=...
ZOHO_REFRESH_TOKEN=...
ZOHO_DATA_CENTER=in                  # Pakka's org is on the India DC

# Local dev alternative to the three above — read them from an existing token cache
# instead of keeping a second copy of the refresh token in this project:
ZOHO_TOKEN_FILE=C:/Users/Asmita/Documents/Asmita/Apps/Chuk/zoho_token.json

CONTACT_LOG_PATH=                    # optional, defaults to ./data/contact-submissions.jsonl
```

Zoho scopes needed: `ZohoCRM.modules.leads.CREATE` plus notes and tags for the form, and
`ZohoCRM.settings.fields.ALL` for the one-off picklist setup below. Of the token stores in
this tree only `Apps\Chuk\zoho_token.json` has them (`ZohoCRM.modules.ALL
ZohoCRM.settings.ALL`); `Apps\ZohoCommunications`'s refresh token is expired and
`Apps\CHukOrderPortal` is Zoho Books only.

### One-off: create the Lead Source value — done 2026-09-01

`GoodGarbageContact` was added to the Leads → Lead Source picklist (value 90 of 90) on
2026-09-01. Kept here because Zoho rejects a lead carrying a picklist value that doesn't
exist, so this has to be re-run against any other Zoho org:

```
node --env-file=.env.local scripts/zoho-add-lead-source.mjs --dry   # show current values
node --env-file=.env.local scripts/zoho-add-lead-source.mjs         # add it
```

Credentials can also come from an existing token cache elsewhere in the tree instead of
being copied into this project. `Apps\Chuk\zoho_token.json` is the only store with enough
scope (`ZohoCRM.modules.ALL ZohoCRM.settings.ALL`); `Apps\ZohoCommunications` has an
expired refresh token and `Apps\CHukOrderPortal` is Zoho Books only:

```
ZOHO_TOKEN_FILE=".../Apps/Chuk/zoho_token.json" node scripts/zoho-add-lead-source.mjs
```

Before patching it writes `zoho-lead-source-backup-<date>.json`, because Zoho deletes any
picklist value omitted from the update.

Note: the picklist already contains a separate **"Good Garbage Podcast"** value used
elsewhere in the Pakka CRM. `GoodGarbageContact` is deliberately distinct — it marks
submissions from this site's contact form specifically.

Safe to re-run — it exits early if the value already exists, and always resends the
existing values so none get dropped. The equivalent by hand is Setup → Customization →
Modules and Fields → Leads → Lead Source → Edit Properties → add the value.

Until it exists, the form still works: the submission is written to disk and the failed
lead is logged, so nothing is lost.

Validator check: `node --test --experimental-strip-types src/lib/contact.test.mts`


## Episode data

The site reads the show's RSS feed **live**, revalidated hourly, so a new episode appears
without a deploy:

- `src/lib/feed.ts` — the parser.
- `src/lib/get-episodes.ts` — fetches the feed with `next: { revalidate: 3600 }`.
- `src/lib/episodes.ts` — a committed snapshot, used **only** as the fallback when the
  feed is unreachable or returns something unparseable. Generated, do not hand-edit.

Pages showing episodes are server components (`page.tsx`) that await `getEpisodes()` and
pass the result to the client component beside them — `EpisodesClient`, `GuestsClient`,
`HomeClient`, `AboutClient`. They stay statically rendered and Next revalidates in the
background, so this costs nothing per visitor.

Refresh the fallback snapshot when episodes are added:

```
node --experimental-strip-types scripts/build-episodes.mjs           # from the live feed
node --experimental-strip-types scripts/build-episodes.mjs feed.xml  # or a local copy
node --experimental-strip-types scripts/build-episodes.mjs --dry     # report only
```

### Where play buttons go

Always YouTube, never Spotify. `watchUrl()` in `src/lib/feed.ts` returns the exact video
when the episode has one, otherwise `youtube.com/@GoodGarbage/search?query=<title>` so the
visitor still lands on the right channel with the episode surfaced. Every play affordance
uses it: the archive cards, the homepage CTA, the hero card, the platform strip's YouTube
tile.

New episodes link themselves: `src/lib/youtube.ts` reads the channel's own RSS (no API key)
for the 15 most recent uploads, which is what the committed scrape can't cover. A video is
claimed by exactly one episode — the one published nearest it — because the monthly
"Around the World of Packaging" episodes all share a title.

Title, description, date and duration are verbatim from the feed
(115 published episodes as of 2026-09-01). YouTube video IDs and thumbnails are merged
from `src/lib/youtube-episodes.ts` (scraped from `@GoodGarbage`, covers 56 of 115) because
the feed's `itunes:image` is show art rather than per-episode. **Guest, role and category
are derived** by parsing titles and descriptions — the feed does not carry them as fields,
so treat those three as best-effort and fix them by improving `src/lib/feed.ts`, never by
editing generated output.

Checks: `node --test --experimental-strip-types src/lib/feed.test.mts src/lib/contact.test.mts`

## Guest portraits

`/guests` shows real headshots, cropped out of each episode's YouTube thumbnail and
committed to `public/images/guests/<videoId>.jpg` (32 portraits, ~700 KB).

There is no headshot source anywhere in this tree, and the thumbnails are the only place
the guests' faces appear. That makes the crop box the risky part: the show has used four
thumbnail templates and the host is **not always on the same side**, so a single rule
would put Ved's face under a guest's name. The crop boxes in
`scripts/crop-guest-portraits.ps1` are therefore keyed by publish date from a map checked
by eye, and episodes whose thumbnail is a raw video-call grid are excluded rather than
guessed at.

To regenerate or extend:

```
powershell scripts/fetch-thumbnails.ps1  -OutDir tmp/thumbs
powershell scripts/contact-sheet.ps1     -InDir tmp/thumbs -OutDir tmp/sheets   # eyeball, classify
powershell scripts/crop-guest-portraits.ps1 -InDir tmp/thumbs -OutDir public/images/guests
powershell scripts/contact-sheet.ps1     -InDir public/images/guests -OutDir tmp/check
```

Then rebuild the id list that `src/lib/feed.ts` reads:

```
node scripts/build-guest-portraits.mjs
```

A portrait is only attached to an episode when the guest's **surname appears in that
video's title** (`portraitFor` in `feed.ts`). Title similarity alone is good enough to pick
a thumbnail; it is not good enough to put a name on a face.

## Studio (the back page)

An unlisted editing page at `/studio/<STUDIO_KEY>`. **No login — the URL is the password.**

```
STUDIO_KEY=<24+ random characters>   # in .env.local and the host's env; never commit
```

It exists for one job: attaching a YouTube video to an episode the feeds can't match —
almost always an older one. Everything else stays automatic:

| | |
|---|---|
| New episode published | appears by itself (podcast RSS, hourly) |
| New YouTube upload | links by itself (channel RSS, hourly) |
| Older episode with no video | **the studio** |

Paste a watch URL, `youtu.be` link, embed/shorts URL or the bare 11-character id. Saving an
empty box clears the override and hands the episode back to the feeds. Changes appear on
the site within the hour, when pages revalidate.

Overrides are stored in `data/episode-overrides.json` (gitignored). They only ever replace
the video and its thumbnail — never titles, dates or descriptions, which stay owned by the
feed so the two can't drift.

### What "no login" costs

The key gates **both** the page and `POST /api/studio/[key]`; a secret page in front of an
open endpoint would protect nothing. It fails closed — no `STUDIO_KEY`, or one shorter than
16 characters, and everything 404s. `robots.ts` disallows `/studio/` and `/api/`.

None of that is authentication. Anyone who gets the URL — a shared screen, a browser
history, a referrer header, a support ticket — can edit episode links. Rotate the key by
changing `STUDIO_KEY` and restarting. If this ever needs to be more than one trusted person
editing occasionally, it needs real auth.

Checks: `node --test --experimental-strip-types src/lib/overrides.test.mts`
