# Status — Homepage / Hero work

_Last updated: 2026-07-09_

## Summary of changes

### 1. Navbar logo (`src/components/Navbar.tsx`)
- Nav logo ("Good Garbage" text) is **hidden over the home hero** and fades in on scroll.
- Uses `usePathname()`: only hidden when `pathname === "/"` and not scrolled. Shows on all other pages and once scrolled.

### 2. Hero (`src/components/Hero.tsx`)
- **Logo image** replaces the old "Good Garbage Podcast" text heading (`/images/logo.png`).
- Logo rendered **white** via `brightness-0 invert` + a drop-shadow so it stays legible on the light sky.
- **Mobile sugarcane**: two `FG_cane_l.png` stalks framing the bottom corners (mobile/tablet only), sized `w-[58%] sm:w-[46%]` (enlarged on request).
- **Mobile legibility**: "View Archive" button text and the trust strip (Sponsored by Pakka · 49 Episodes · …) are **dark on mobile** (`text-black`), white on desktop (`lg:text-white`).
- Hero root changed to `h-screen overflow-hidden` (was `min-h-screen lg:h-screen overflow-x-hidden`) so it pins on every breakpoint.

### 3. Sticky hero on mobile (`src/app/page.tsx`)
- Hero layer is now `fixed inset-0` on **all** breakpoints (was desktop-only).
- Content stack starts at `mt-[100vh]` on all breakpoints, so the next section scrolls up **over** the fixed hero on mobile too (matching desktop).

### 4. Plant decorations (added then removed)
- Added `src/components/ui/PlantDecorations.tsx` — flat clip-art SVGs: `DecorationMushroom`, `DecorationSugarcane`, `DecorationSeaweed`, plus a `PlantScatter` field component (tilt baked into the framer-motion animation; `max` prop to trim count).
- Iterated: scatter across sections → fewer/bigger → mushrooms only.
- **Final state: all scatter removed** from `CollaborationCTA` and `Newsletter`. Those sections no longer render any plant decorations.
- `PlantDecorations.tsx` is now **unused/orphaned** (kept in case plants are wanted back — safe to delete otherwise).
- The old SVG decorations (`DecorationTree/Bush/TreeTwo`) were removed from the homepage sections but are **still used** on about/contact/episodes/guests pages.

## New / untracked files
- `public/images/logo.png` — hero logo (copied from `~/Downloads/GGP-LOgo.png`).
- `src/components/ui/PlantDecorations.tsx` — currently unused.

## Notes / open questions
- `PlantDecorations.tsx` orphaned — delete or keep?
- Other pages (about/contact/episodes/guests) still use the old SVG tree/bush decorations — not yet unified with the homepage.
- Nothing committed yet; all changes are in the working tree.

## Dev server
- Chrome extension can't reach `localhost` (org policy) — used headless Chrome CLI for screenshots.
- A dev server is running on `http://localhost:3000` (started earlier; survived a task kill). Clean restart: `taskkill /PID <pid> /F` then `npm run dev`.
