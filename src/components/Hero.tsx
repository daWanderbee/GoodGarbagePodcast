"use client";

import { motion, useTransform, useReducedMotion, MotionValue } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Leaf } from "lucide-react";
import { PodcastButton } from "./ui/PodcastButton";
import { Button } from "./ui/Button";
import { LatestPodcastCard } from "./ui/LatestPodcastCard";
import { shortTitle, watchUrl, type Episode } from "@/lib/feed";

interface HeroProps {
  episodes: Episode[];
  rawScroll: MotionValue<number>;
  smoothScroll: MotionValue<number>;
  isMobile: boolean;
}

export function Hero({ rawScroll, smoothScroll, isMobile, episodes }: HeroProps) {
  // Concept A: real episode titles drifting under the headline (proves the mission)
  const EPISODE_TITLES = episodes.slice(0, 7).map((e) => shortTitle(e.title));
  // Parallax scene: each depth plane rises AND scales up as you scroll
  // (deeper = slower + smaller growth, foreground = faster + larger growth)
  // Zoom completes within the first viewport (~0.16 of page scroll), since the
  // fixed hero is covered by the next section after roughly one screen of scroll.
  const prefersReduced = useReducedMotion();
  const yGrass = useTransform(smoothScroll, [0, 0.16], [0, -70]);
  // Side sugarcane: grows/zooms but rises only gently so its (off-screen) base
  // never lifts into view — reads as edge framing, not plants pulled from the land.
  const yCane = useTransform(smoothScroll, [0, 0.16], [0, -45]);
  const sCane = useTransform(smoothScroll, [0, 0.16], [1, 1.45]);
  const yBirds = useTransform(smoothScroll, [0, 0.16], [0, -25]);
  const sceneOpacity = useTransform(smoothScroll, [0.1, 0.17], [1, 0]);
  // Mobile sugarcane parallax: grows and lifts gently as the page scrolls over the pinned hero.
  const yCaneMobile = useTransform(smoothScroll, [0, 0.16], [0, -24]);
  const sCaneMobile = useTransform(smoothScroll, [0, 0.16], [1, 1.4]);
  const pv = (mv: MotionValue<number>) => (prefersReduced ? undefined : mv);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#038f90]">
      {/* Flat brand ground */}
      <div className="absolute inset-0 z-0 bg-[#038f90]" />

      {/* Modern Hero Content Container - Overlapping Layout with Site-Wide Alignment */}
      <div className="relative z-10 lg:h-full w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center px-6 md:px-12 overflow-visible">

        {/* navbar spacer on mobile */}
        <div className="lg:hidden h-[26vh] sm:h-[24vh] w-full" />

        {/* Text Section: High-contrast white typography with crisp drop shadows */}
        <div className="relative z-20 flex flex-col items-center lg:items-start text-center lg:text-left -mt-4 lg:mt-0 pt-3 pb-24 md:pt-10 md:pb-32 lg:py-0 w-full lg:max-w-3xl">
          {/* Brand Heading (Logo inverted to pure white across all devices) */}
          <h1 className="mb-3 lg:mb-6">
            <Image
              src="/images/logo.png"
              alt="Good Garbage Podcast"
              width={525}
              height={214}
              priority
              sizes="(max-width: 768px) 320px, (max-width: 1024px) 384px, 480px"
              className="w-64 sm:w-80 md:w-96 lg:w-[30rem] h-auto brightness-0 invert drop-shadow-[0_4px_20px_rgba(0,0,0,0.65)]"
            />
          </h1>

          {/* Bold, not medium: this sits on a photograph, and weight is what keeps it legible
              over the busy parts of the image. The background itself is untouched. */}
          <p className="max-w-xl font-serif leading-[1.6] text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl tracking-normal mb-6 lg:mb-8 px-4 lg:px-0 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
            <span className="block font-sans font-black uppercase tracking-[0.18em] text-xs sm:text-sm md:text-base mb-2 text-[#aeddd9]">
              Let&apos;s talk trash!
            </span>
            Join us and our host, <em>Ved Krishna</em>, as we connect with the people and the ideas regenerating our planet, in search of the answer to one question: what is <em>Good Garbage</em>?
          </p>

          {/* Concept A: kinetic episode marquee (High contrast white) */}
          <div
            className="marquee-mask relative w-full max-w-xl mb-6 lg:mb-12 overflow-hidden"
            style={{
              // A scrolling strip always cuts a word at its edges. The only thing that
              // decides whether that reads as motion or as a rendering fault is how much
              // room the fade has to finish in, so give it a quarter of the width.
              maskImage:
                'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.55) 12%, black 26%, black 74%, rgba(0,0,0,0.55) 88%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.55) 12%, black 26%, black 74%, rgba(0,0,0,0.55) 88%, transparent 100%)',
            }}
          >
            <div className="marquee-track flex w-max items-center gap-6">
              {[...EPISODE_TITLES, ...EPISODE_TITLES].map((title, i) => (
                <span key={i} className="flex shrink-0 items-center gap-6">
                  <span className="whitespace-nowrap font-sans text-[11px] md:text-xs font-bold uppercase tracking-[0.15em] text-white/95 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
                    {title}
                  </span>
                  <Leaf className="w-3.5 h-3.5 shrink-0 text-[#aeddd9] drop-shadow-sm" />
                </span>
              ))}
            </div>
          </div>

          <div className="pointer-events-auto flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3.5 sm:gap-4 w-full max-w-sm sm:max-w-none mx-auto lg:mx-0">
            <PodcastButton
              episodeName="Listen Now"
              href={watchUrl(episodes[0])}
              className="!h-13 sm:!h-14 md:!h-15 px-6 sm:px-7 w-full sm:w-auto justify-center shrink-0 shadow-2xl transition-all hover:scale-[1.03]"
            />

            <Link href="/episodes" className="shrink-0 w-full sm:w-auto">
              <Button variant="glass" className="!text-white bg-white/10 hover:bg-white/20 border-white/50 backdrop-blur-md px-6 sm:px-7 !h-13 sm:!h-14 md:!h-15 w-full sm:w-auto rounded-full flex items-center justify-center shadow-2xl font-bold text-sm sm:text-base transition-all hover:scale-[1.03]">
                View Archive
              </Button>
            </Link>
          </div>


        </div>


      </div>

      {/* Foreground: sugarcane rooted off both bottom corners with a hemp bouquet tucked in
          beside each, a seaweed bed along the bottom edge and a flock top-right. Everything
          rises and grows on scroll, then fades out as the next section covers the pinned hero.
          Only the edges and the floor are occupied — the headline column stays clear, which is
          what crowded it last time. */}
      <motion.div
        style={{ opacity: prefersReduced ? 1 : sceneOpacity }}
        className="pointer-events-none absolute inset-0 z-[6] overflow-hidden"
      >
        {/* Flock. Scroll parallax on the wrapper, idle drift on the image — framer-motion
            would drop the `style` y if `animate` also moved y on the same element. */}
        <motion.div style={{ y: pv(yBirds) }} className="absolute top-[13%] right-[4%] w-[40%] sm:w-[30%] lg:w-[22%]">
          <motion.img
            src="/images/hero/parallax/birds.png"
            alt=""
            animate={prefersReduced ? undefined : { x: [0, 28, 0], y: [0, -12, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-auto opacity-90"
          />
        </motion.div>

        {/* Sugarcane, one supplied pair per side. Neither is mirrored — the artwork already
            fans its crown inward, so a flip would point the leaves off-screen.
            Sized by height rather than width. Each stalk base sits 42-58% across its own
            image, so at a flush left-0/right-0 the leaves reach the corner but the trunk stands
            well inside it — desktop pushes each plant out by 22% of its width to put the trunk
            in the corner instead. Below 1024px the shift is half the width, because two full
            canes cover most of a phone screen. The shift uses motion's own x — a Tailwind -translate-x class
            would be overwritten by the transform framer-motion composes from y/scale/rotate. */}
        <motion.img
          src="/images/hero/parallax/cane_right.png"
          alt=""
          loading="lazy"
          style={{ x: isMobile ? "-50%" : "-22%", y: pv(isMobile ? yCaneMobile : yCane), scale: pv(isMobile ? sCaneMobile : sCane) }}
          animate={prefersReduced ? undefined : { rotate: [-1.4, 1.8, -1.4] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 h-[60vh] sm:h-[60vh] w-auto max-w-none origin-bottom drop-shadow-xl"
        />
        <motion.img
          src="/images/hero/parallax/cane_left.png"
          alt=""
          loading="lazy"
          style={{ x: isMobile ? "50%" : "22%", y: pv(isMobile ? yCaneMobile : yCane), scale: pv(isMobile ? sCaneMobile : sCane) }}
          animate={prefersReduced ? undefined : { rotate: [1.4, -0.9, 1.4] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 right-0 h-[60vh] sm:h-[60vh] w-auto max-w-none origin-bottom drop-shadow-xl"
        />

        {/* Seaweed bed, replacing the generated grass. The same clump on three tiled layers,
            every one at the art's own 436x202 ratio (auto width) — nothing is squeezed. A layer
            cannot overlap itself, since background-repeat lays tiles edge to edge, so the gap
            between clumps is closed by offsetting the other two layers into it: at a 25vh band
            the tile is ~54vh wide, so 18vh and 36vh land on the thirds. The back two are a
            little shorter, which scales their width to match and gives the bed some depth.
            Drawn last, so the bed closes over the stems of everything standing in it. */}
        <motion.div
          style={{
            y: pv(yGrass),
            backgroundImage:
              "url(/images/hero/parallax/seaweed_tile.png), url(/images/hero/parallax/seaweed_tile.png), url(/images/hero/parallax/seaweed_tile.png)",
            backgroundRepeat: "repeat-x",
            backgroundPosition: "left bottom, 18vh bottom, 36vh bottom",
            backgroundSize: "auto 100%, auto 92%, auto 84%",
          }}
          className="absolute -bottom-px inset-x-0 h-[21vh] lg:h-[25vh]"
        />
        {/* Hemp, one bouquet beside each cane, in the same corner rather than inset from it —
            at 11% it stood between the cane and the headline instead of reading as part of the
            corner planting. Drawn after the bed so it stands in front of the seaweed rather
            than behind it, and wedged into the bottom corner — a couple of vh below the floor
            and a few percent past the side, so it is cropped by both edges and reads as stuck
            in the corner rather than placed near it. Each rocks against its cane rather than
            with it, so the pair does not read as one rigid block. */}
        <motion.img
          src="/images/hero/parallax/hemp_left.png"
          alt=""
          loading="lazy"
          style={{ y: pv(isMobile ? yCaneMobile : yCane), scale: pv(isMobile ? sCaneMobile : sCane) }}
          animate={prefersReduced ? undefined : { rotate: [1.2, -1.2, 1.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-2vh] lg:bottom-[-3vh] left-[-3%] lg:left-[-2%] h-[16vh] lg:h-[22vh] w-auto max-w-none origin-bottom drop-shadow-lg"
        />
        <motion.img
          src="/images/hero/parallax/hemp_right.png"
          alt=""
          loading="lazy"
          style={{ y: pv(isMobile ? yCaneMobile : yCane), scale: pv(isMobile ? sCaneMobile : sCane) }}
          animate={prefersReduced ? undefined : { rotate: [-1.2, 1.2, -1.2] }}
          transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-2vh] lg:bottom-[-3vh] right-[-3%] lg:right-[-2%] h-[16vh] lg:h-[22vh] w-auto max-w-none origin-bottom drop-shadow-lg"
        />
      </motion.div>

      {/* DESKTOP: latest episode card, vertically centered, pulled in toward the text */}
      <LatestPodcastCard latest={episodes[0]} className="pointer-events-auto hidden lg:block absolute right-[13%] top-1/2 -translate-y-1/2 z-30" />

      {/* Simplified Static Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 lg:left-12 lg:translate-x-0 z-30 hidden lg:flex flex-col items-center lg:items-start gap-2">
        <div className="w-[1px] h-10 bg-white/20 relative overflow-hidden">
          <motion.div
            animate={{ y: [0, 40] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-1/2 bg-white/60"
          />
        </div>
        <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/40">Scroll</span>
      </div>
    </div>
  );
}
