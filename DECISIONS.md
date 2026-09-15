---
title: GoodGarbagePodcast Decisions
created: 2026-09-14
tags: [decisions, log]
aliases: [GoodGarbagePodcast Decisions]
---

# GoodGarbagePodcast — Decisions

Every decision taken about **GoodGarbagePodcast** — what was chosen, **why**, what was rejected, and what it costs. Source of truth for this project's history. Folder: `Apps\Websites\GoodGarbagePodcast`.

Rolled up into `Apps\Main Brain\_brain\decisions.xlsx` — see [[site-changelogs]] for
the convention. Never type into the Excel, it is regenerated from these notes:

```
python "Apps\Main Brain\_brain\tools\site_changelog_xlsx.py"
```

## How to add a row

A decision is anything a future reader could reasonably ask "why is it like
this?" about: a stack choice, a data model, a vendor, a deliberate omission, a
workaround kept on purpose. A change goes in `CHANGELOG.md`; the *reasoning*
behind it goes here. Append at the **bottom**, newest last.

`Why` is the whole point of this file. If you cannot fill it in, you are
recording a change, not a decision — put it in the changelog instead.

| Column | What goes in it |
|--------|-----------------|
| `Date` | `YYYY-MM-DD` the decision was taken |
| `Time` | `HH:MM` 24-hour IST |
| `Status` | `active`, `superseded`, `reversed`, or `proposed` |
| `Decision` | What was chosen, in one plain sentence |
| `Why` | The reason it was chosen. Constraints, evidence, who asked. Never "it seemed best" |
| `Rejected` | The alternatives considered and why they lost. `-` if there genuinely were none |
| `Consequence` | What this now costs or locks in — the bill that comes later |
| `By` | Who decided |
| `Ref` | File, URL, commit, meeting, ticket |

## Log

| Date | Time | Status | Decision | Why | Rejected | Consequence | By | Ref |
|------|------|--------|----------|-----|----------|-------------|----|-----|
| 2026-09-14 | 10:29 | active | Decision log started | Changes were recorded but the reasoning behind them was not, so old choices looked arbitrary | Folding decisions into CHANGELOG.md — rejected, different cadence and different columns | One more note per project to keep current | Claude | this note |
| 2026-09-15 | 15:20 | active | Grass and birds are generated SVG, not new artwork; sugarcane reuses the existing FG_cane_l.png | No grass or bird asset existed in the repo, and the reference is flat vector art that SVG matches exactly. Cane already existed, so drawing one would have been duplicate work | Commissioning/asking for PNG cutouts — rejected, SVG scales, tiles and weighs less than a photo cutout; a second cane asset — rejected, the left one mirrors | Grass is a 122KB SVG tiled with background-repeat-x, so reshaping the meadow means re-running the generator, not editing paths by hand | Claude | public/images/hero/parallax/grass.svg |
| 2026-09-15 | 15:20 | superseded | Hero foreground stripped entirely (e8015f6, 2026-09-05) | Fifteen drifting images crowded the headline | - | Reversed below | Claude | e8015f6 |
| 2026-09-15 | 15:20 | active | Foreground restored, but only at the edges and the floor | The earlier strip removed clutter by removing everything; the reference keeps plants strictly to the frame. Canes sit at the two bottom corners, grass along the bottom edge, birds top-right — the headline column stays empty, which is what the 2026-09-05 note actually objected to | Restoring all fifteen elements — rejected, that is the clutter that was removed; leaving the hero bare — rejected, Asmita asked for the parallax back | Three foreground images instead of fifteen, so the hero keeps its parallax at a fraction of the weight | Claude | src/components/Hero.tsx |
| 2026-09-15 | 15:40 | active | Each side of the hero gets its own cane image, neither mirrored | The two supplied files are already a left/right pair whose crowns fan inward. Mirroring either one would throw its leaves off-screen, which is why the old single-asset version needed -scale-x-100 and this one does not | Reusing one file flipped — rejected, the supplied pair is drawn for this; deleting the old FG_cane_*.png — rejected, not mine to remove | Two cane files to keep in sync instead of one | Claude | src/components/Hero.tsx |
| 2026-09-15 | 15:40 | active | Grass stays generated SVG while cane and birds use supplied PNGs | No grass asset was supplied, and the generated meadow already tiles at any width without the seams a cutout photo would show | Waiting for grass artwork before shipping — rejected, the hero reads complete as is | If grass art arrives later it is a one-line swap of the background-image url | Claude | public/images/hero/parallax/grass.svg |
