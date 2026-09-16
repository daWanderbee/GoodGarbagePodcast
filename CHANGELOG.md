---
title: Good Garbage Changelog
created: 2026-09-11
tags: [changelog, log, goodgarbagepodcast]
aliases: [Good Garbage Change Log, goodgarbagepodcast changelog]
---

# Good Garbage — Changelog

Every change made to **ggpodcast.vercel.app** (Good Garbage podcast site — Next.js), with the date and time it was made.
Source of truth for this site's history. Folder: `Apps\Websites\GoodGarbagePodcast`.

Rolled up into `Apps\Main Brain\_brain\site-changelog.xlsx` — see
[[site-changelogs]] for the convention. Never type into the Excel, it is
regenerated from these notes:

```
python "Apps\Main Brain\_brain\tools\site_changelog_xlsx.py"
```

## How to add a row

Append at the **bottom** — newest last, so the file reads as history.
Absolute dates (`YYYY-MM-DD`), 24-hour local time (`HH:MM`, IST), never
"today" or "just now".

| Column | What goes in it |
|--------|-----------------|
| `Date` | `YYYY-MM-DD` the change was made |
| `Time` | `HH:MM` 24-hour IST |
| `Area` | Where it landed — `content`, `theme`, `plugin`, `code`, `deploy`, `SEO`, `schema`, `form`, `config`, `data` |
| `Change` | What actually changed. Old -> new where it matters |
| `Why` | The reason. This is the column future-you reads |
| `By` | Who made it — `Asmita`, `Claude`, a name |
| `Impact` | What downstream breaks or changes. `-` if nothing |
| `Ref` | File, URL, commit, ticket. Backticks for paths |

## Log

| Date | Time | Area | Change | Why | By | Impact | Ref |
|------|------|------|--------|-----|----|--------|-----|
| 2026-09-11 | 00:00 | config | Changelog started | No per-site record of changes existed | Claude | - | this note |
| 2026-09-15 | 15:20 | hero | Painted landscape replaced with flat #012620; sugarcane, a generated grass meadow and a bird flock added back as a scroll-parallax foreground | Reference image supplied by Asmita: flat deep-green ground, plants framing the edges, birds top-right | Claude | Hero.tsx, new grass.svg + birds.svg in public/images/hero/parallax | Hero.tsx |
| 2026-09-15 | 15:40 | hero | Supplied artwork swapped in: cane_left.png / cane_right.png replace the old FG_cane_l.png pair, birds.png replaces the hand-drawn birds.svg (deleted) | Asmita supplied the actual elements from the reference in Downloads\Site | Claude | Hero.tsx, three new PNGs in public/images/hero/parallax | Hero.tsx |
| 2026-09-15 | 15:50 | hero | Grass band raised (20/24vh to 26/29vh) and mobile sugarcane widened to 56% a side, tucked in to -5% | Asmita: grass slightly higher, canes on mobile should read about half the width each | Claude | Hero.tsx only, desktop cane size untouched | Hero.tsx |
| 2026-09-15 | 16:00 | hero | Sugarcane sized by height (60vh, all breakpoints) and pushed half off its own edge via motion x -50%/50% instead of percentage left/right offsets | Asmita: each cane half visible, 60vh tall | Claude | Hero.tsx; responsive width classes dropped, one size now serves every screen | Hero.tsx |
| 2026-09-15 | 16:05 | hero | Sugarcane height split by breakpoint: 48vh on mobile, 60vh from sm up | 60vh of cane crowded the headline on a phone | Claude | Hero.tsx | Hero.tsx |
| 2026-09-15 | 16:15 | hero | Desktop grass scaled up: band 29vh to 34vh and the tile forced to 1700px wide against a 1200px source | Blades read as thin stubble on a wide monitor at native tile size | Claude | Hero.tsx; mobile grass untouched | Hero.tsx |
| 2026-09-15 | 16:25 | hero | Whole sugarcane in frame on desktop (x shift now conditional on isMobile); desktop grass band 34vh to 28vh and tile stretch 1700px to 1350px | Asmita: show the full cane, blades had gone fat, desktop grass too tall | Claude | Hero.tsx; mobile keeps the half-off cane and its own grass size | Hero.tsx |
| 2026-09-15 | 16:35 | deploy | Hero foreground shipped to production: pushed 91e4744 + 3238845 to main, Vercel git integration builds prj_Hgk9YVPBmDzRWAipd06y2n8WqgMW | Asmita asked to deploy | Claude | Live site; also carried Asmita's pending contact-copy and navbar-dot edits | 3238845 |
| 2026-09-15 | 16:50 | episodes | Every YouTube thumbnail frame set to aspect-video: latest-episode section (was aspect-video lg:4/3), hero latest card and archive cards (both 16/10) | Asmita: thumbnails should be sized as YouTube thumbnails; 4/3 and 16/10 frames cropped a 16:9 source | Claude | LatestEpisode.tsx, ui/LatestPodcastCard.tsx, episodes/EpisodesClient.tsx | - |
| 2026-09-16 | 12:30 | theme | Hero section background updated from #012620 to #038f90; removed painted Ghibli countryside image from PageHero and CollaborationCTA and set solid #038f90 | Asmita: use #038f90 as hero bg and remove the landscape image everywhere | Antigravity | - | `Hero.tsx`, `PageHero.tsx`, `CollaborationCTA.tsx` |



| 2026-09-16 | 11:05 | hero | Generated grass.svg deleted and replaced by the supplied seaweed clump tiled along the bottom (14/17vh); a hemp bouquet added beside each sugarcane | Asmita supplied hemp and seaweed artwork and asked for seaweed in place of grass, hemp at the sides | Claude | Hero.tsx; also removed tropical_red/tropical_yellow/foliage_clump, byte-identical copies of the same three images | Hero.tsx |
| 2026-09-16 | 11:20 | hero | Desktop sugarcane pushed out by 22% of its own width instead of sitting flush at left-0/right-0 | Asmita: canes not in the corner on desktop. The art has no transparent padding, but each stalk base sits 42-58% across its image, so flush placement left the trunk ~180px inside the edge | Claude | Hero.tsx; mobile shift unchanged at 50% | Hero.tsx |
| 2026-09-16 | 11:30 | hero | Hemp bouquets moved into the corners with the cane: inset 6%/11% down to 1%/3% | Asmita: hemp should sit together with the sugarcane. After the cane moved out by 22%, hemp at 11% stood between it and the headline | Claude | Hero.tsx | Hero.tsx |
| 2026-09-16 | 11:45 | hero | Seaweed bed doubled and compressed: two tiled layers, back one at 74% height offset 4vw, tiles set to 24vh/19vh against a natural ~30-37vh width so clumps overlap | Asmita: overlap and tighten the seaweed. A single row at natural width read as separate clumps in a line | Claude | Hero.tsx; band height unchanged | Hero.tsx |
| 2026-09-16 | 11:55 | hero | Seaweed enlarged and squeezed harder: band 14/17vh to 21/25vh, tiles 24/19vh to 30/24vh (about 40% under natural width), back layer offset 4vw to 2.5vw | Asmita: not looking good, tighten more and increase the size | Claude | Hero.tsx | Hero.tsx |
| 2026-09-16 | 12:05 | hero | Seaweed back to its own 436x202 ratio (auto width on all layers); gap closed with a third layer instead, offsets at 18vh and 36vh against a ~54vh tile | Asmita: only the gap between clumps was meant to close, not the seaweed's proportions | Claude | Hero.tsx; band size kept at 21/25vh | Hero.tsx |
| 2026-09-16 | 12:15 | hero | Hemp moved after the seaweed bed in DOM order so it paints in front of it | Asmita: bring the hemp in front. Nothing else changed - position, size and sway are as they were | Claude | Hero.tsx | Hero.tsx |
| 2026-09-16 | 12:25 | hero | Hemp wedged into the bottom corners: bottom 7/9vh to -2/-3vh, sides 1%/3% to -3%/-2%, so both edges crop it | Asmita: put the hemps in the lower edges, very stuck | Claude | Hero.tsx | Hero.tsx |
| 2026-09-16 | 12:40 | deploy | Pushed 9a04e39 (seaweed + hemp hero) and 0aa269a (flat teal page headers and open call) to main; Vercel builds production | Asmita asked to deploy | Claude | Live site | 0aa269a |
| 2026-09-16 | 15:25 | hero | Removed trust strip ("Sponsored by Pakka • 117 Episodes • YouTube · Spotify · Apple") below hero CTA buttons | Asmita: remove the trust strip | Antigravity | - | `Hero.tsx` |

| 2026-09-16 | 13:10 | hero | Foreground cut back to the reference composition: hemp bouquets removed, seaweed top edge faded into the background, cane sway slowed to 11/12.5s at under one degree | Asmita: the foreground reads cluttery. Six competing objects at four sway speeds, and tropical red/yellow bouquets in a two-tone green scene | Claude | Hero.tsx; hemp art left in place, unreferenced | Hero.tsx |
| 2026-09-16 | 15:35 | hero | Foreground art redrawn in-house: cane_a/cane_b, reeds and flock SVGs replace the supplied PNGs, generator kept at scripts/hero-art.js | Asmita: same layout, source the images yourself. SVG holds the exact palette, keeps real alpha and tiles seamlessly | Claude | Hero.tsx; supplied PNGs left in place, now unreferenced; bed back to a single layer | scripts/hero-art.js |
| 2026-09-16 | 15:50 | hero | Declutter pass reverted: hemp back in both corners in front of the reed bed, cane sway back to 7/7.5s at 1.4-1.8 degrees. Generated SVG art kept | Asmita asked to revert, choosing to undo the declutter only | Claude | Hero.tsx; horizon fade left in place | Hero.tsx |
| 2026-09-16 | 15:42 | hero | Removed dark gradient horizon fade overlay (from-transparent via-[#012620]/30 to-[#012620]/85) from the reed bed | Asmita: remove this shadow | Antigravity | - | `Hero.tsx` |

| 2026-09-16 | 16:10 | hero | Hemp up from 16/22vh to 22/30vh; second cane pair added behind the corner plants (cane_c/cane_d, new from the same generator, transparent SVG), at 36/42vh and 80% opacity on the slow plane | Asmita: bigger hemp, more sugarcane, artwork made here with no background | Claude | Hero.tsx, scripts/hero-art.js; mid-ground pair hidden below sm | scripts/hero-art.js |
| 2026-09-16 | 16:45 | hero | Hero.tsx restored from 9a04e39, the deployed version: supplied cane and hemp PNGs, three-layer seaweed bed, birds.png, 7/7.5s sway. Drops the in-house SVG plants, the mid-ground cane pair and the horizon fade | Asmita asked to go back to the deployed hero | Claude | Hero.tsx only; generated SVGs and scripts/hero-art.js left on disk, unreferenced | 9a04e39 |
| 2026-09-16 | 16:14 | content | Copy adjustments: added comma after 'Each episode', changed 'something that has new value' to 'resources with new value', and 'real science and plain talk' in AboutClient; rephrased 'Garbage is not inherently bad and with the right people...' in AboutPodcast | Feedback from screenshot: copy adjustments for MK approval | Antigravity | - | `AboutClient.tsx`, `AboutPodcast.tsx` |

| 2026-09-16 | 17:20 | episodes | Per-episode Apple Podcasts links now fetched live from itunes.apple.com/lookup (new src/lib/apple.ts), matched to episodes by title and date, with the committed scrape as fallback. Latest-episode section gained direct Spotify and Apple links | The RSS carries no Apple link at all, so per-episode Apple links stopped at the April 2026 scrape. Verified live: 117/117 episodes now resolve | Claude | apple.ts, feed.ts, get-episodes.ts, LatestEpisode.tsx, feed.test.mts | src/lib/apple.ts |
| 2026-09-16 | 17:55 | episodes | The monthly "Around the World of Packaging" round-up no longer derives a guest | Asmita: Sargam is not the guest. The title takes the interview shape, so the parser cut "with Sargam & Kumar" at the ampersand and put "Sargam" - a first name, no surname - on 13 episodes and on the guests page | Claude | feed.ts, feed.test.mts; also clears Alex Moore from 12 older segments | src/lib/feed.ts |
| 2026-09-16 | 17:55 | episodes | Latest-episode buttons share one row from sm up and go full width when stacked; Spotify/Apple links became chips instead of underlined sentences | Asmita: the two links should not look like that, and the buttons should share a line or be full width | Claude | LatestEpisode.tsx | LatestEpisode.tsx |
| 2026-09-16 | 18:05 | hero | Seaweed bed removed from the hero, along with the now-unused yGrass transform | Asmita asked to remove it | Claude | Hero.tsx; leaves cane, hemp and the flock. seaweed_tile.png left on disk, unreferenced | Hero.tsx |
