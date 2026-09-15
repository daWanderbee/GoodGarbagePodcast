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
