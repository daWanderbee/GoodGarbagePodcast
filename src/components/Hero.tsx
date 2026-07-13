"use client";

import { motion, useTransform, useReducedMotion, MotionValue } from "framer-motion";
import Image from "next/image";
import { Leaf } from "lucide-react";
import { PodcastButton } from "./ui/PodcastButton";
import { Button } from "./ui/Button";
import { LatestPodcastCard } from "./ui/LatestPodcastCard";

// Concept A: real episode titles drifting under the headline (proves the mission)
const EPISODE_TITLES = [
  "Can Seaweed Replace Plastic?",
  "Packaging You Can Eat",
  "Why Composting Is Having a Revolution",
  "This Artist Is Cleaning the Planet",
  "From Petroleum to Purpose",
  "The Myth of Recycling",
  "From Greenhouse Gas to Green Polymers",
];

interface HeroProps {
  rawScroll: MotionValue<number>;
  smoothScroll: MotionValue<number>;
  isMobile: boolean;
}

export function Hero({ rawScroll, smoothScroll, isMobile }: HeroProps) {
  // Parallax scene: each depth plane rises AND scales up as you scroll
  // (deeper = slower + smaller growth, foreground = faster + larger growth)
  // Zoom completes within the first viewport (~0.16 of page scroll), since the
  // fixed hero is covered by the next section after roughly one screen of scroll.
  const prefersReduced = useReducedMotion();
  const yMid = useTransform(smoothScroll, [0, 0.16], [0, -110]);
  const sMid = useTransform(smoothScroll, [0, 0.16], [1, 1.35]);
  // Side sugarcane: grows/zooms but rises only gently so its (off-screen) base
  // never lifts into view — reads as edge framing, not plants pulled from the land.
  const yCane = useTransform(smoothScroll, [0, 0.16], [0, -45]);
  const sCane = useTransform(smoothScroll, [0, 0.16], [1, 1.45]);
  const yCanopy = useTransform(smoothScroll, [0, 0.16], [0, -25]);
  const sCanopy = useTransform(smoothScroll, [0, 0.16], [1, 1.12]);
  const sceneOpacity = useTransform(smoothScroll, [0.1, 0.17], [1, 0]);
  // Mobile sugarcane parallax: grows and lifts gently as the page scrolls over the pinned hero.
  const yCaneMobile = useTransform(smoothScroll, [0, 0.16], [0, -24]);
  const sCaneMobile = useTransform(smoothScroll, [0, 0.16], [1, 1.4]);
  const pv = (mv: MotionValue<number>) => (prefersReduced ? undefined : mv);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#038f90]">
      {/* Backdrop: soft Ghibli-style mint sky + distant countryside */}
      <div className="absolute inset-0 z-0">
        <img src="/images/hero/bg_mint.png" alt="" className="absolute inset-0 h-full w-full object-cover object-bottom" />
        {/* teal wash keeps the white text legible over the light sky */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a8d83]/45 via-[#1f9a86]/12 to-transparent" />
      </div>

      {/* DESKTOP: soft scrim keeping the left-hand text legible over the scene */}
      <div
        className="hidden lg:block absolute inset-y-0 left-0 w-[58%] z-[8] pointer-events-none"
        style={{ background: "linear-gradient(to right, rgba(3,143,144,0) 0%, rgba(3,143,144,0.45) 20%, rgba(3,143,144,0.35) 55%, transparent 100%)" }}
      />

      {/* MOBILE + TABLET: sugarcane rooted at the bottom, parallax-rising + growing on scroll */}
      <motion.div
        style={{ y: pv(yCaneMobile), scale: pv(sCaneMobile) }}
        className="lg:hidden pointer-events-none absolute bottom-0 inset-x-0 z-[6] origin-bottom"
      >
        <img
          src="/images/hero/parallax/FG_cane_l.png"
          alt=""
          className="absolute bottom-0 left-[-10%] w-[58%] sm:w-[46%] h-auto drop-shadow-lg"
        />
        <img
          src="/images/hero/parallax/FG_cane_l.png"
          alt=""
          className="absolute bottom-0 right-[-10%] w-[58%] sm:w-[46%] h-auto -scale-x-100 drop-shadow-lg"
        />
      </motion.div>

      {/* Modern Hero Content Container - Overlapping Layout with Site-Wide Alignment */}
      <div className="relative z-10 lg:h-full w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center px-6 md:px-12 overflow-visible">

        {/* MOBILE + TABLET: small vine accents tucked into the very top corners */}
        <div className="lg:hidden pointer-events-none absolute top-0 inset-x-0 z-0">
          <Image
            src="/images/hero/treeRight.png"
            alt=""
            width={679}
            height={429}
            className="absolute top-0 right-0 w-[34%] sm:w-[28%] h-auto opacity-90"
            priority
          />
          <Image
            src="/images/hero/treeRight.png"
            alt=""
            width={679}
            height={429}
            className="absolute top-0 left-0 w-[34%] sm:w-[28%] h-auto -scale-x-100 opacity-90"
          />
        </div>

        {/* navbar spacer on mobile */}
        <div className="lg:hidden h-[26vh] sm:h-[24vh] w-full" />

        {/* Text Section: Indented to align with other sections, overlapping image on desktop */}
        <div className="relative z-20 flex flex-col items-center lg:items-start text-center lg:text-left -mt-4 lg:mt-0 pt-3 pb-24 md:pt-10 md:pb-32 lg:py-0 w-full lg:max-w-3xl">
          {/* Brand Heading */}
          <h1 className="mb-3 lg:mb-8">
            <Image
              src="/images/logo.png"
              alt="Good Garbage Podcast"
              width={525}
              height={214}
              priority
              sizes="(max-width: 768px) 320px, (max-width: 1024px) 384px, 480px"
              className="w-64 sm:w-80 md:w-96 lg:w-[30rem] h-auto lg:brightness-0 lg:invert drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
            />
          </h1>

          <p className="max-w-xl font-serif leading-[1.5] text-black/90 font-medium text-sm sm:text-base md:text-lg lg:text-xl tracking-normal mb-4 lg:mb-8 px-4 lg:px-0">
            Conversations on turning what the world throws away into what brings it back to life — biomaterials, composting, and the people regenerating our planet.
          </p>

          {/* Concept A: kinetic episode marquee */}
          <div
            className="marquee-mask relative w-full max-w-xl mb-5 lg:mb-12 overflow-hidden"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
            }}
          >
            <div className="marquee-track flex w-max items-center gap-6">
              {[...EPISODE_TITLES, ...EPISODE_TITLES].map((title, i) => (
                <span key={i} className="flex shrink-0 items-center gap-6">
                  <span className="whitespace-nowrap font-sans text-[11px] md:text-xs font-bold uppercase tracking-[0.15em] text-black/80">
                    {title}
                  </span>
                  <Leaf className="w-3 h-3 shrink-0 text-black/50" />
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 lg:gap-6">
            <PodcastButton episodeName="A Fresh Start" size={isMobile ? "sm" : "lg"} className="min-w-[200px] lg:min-w-[280px] !h-14 lg:!h-16 shadow-2xl" />
            <Button variant="glass" className="!text-black lg:!text-white border-black/40 lg:border-white/40 backdrop-blur-md min-w-[200px] lg:min-w-[280px] !h-14 lg:!h-16 !py-0 flex items-center justify-center shadow-2xl">
              View Archive
            </Button>
          </div>

          {/* Trust strip */}
          <div className="mt-5 lg:mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-x-3 gap-y-1.5 font-sans text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-black/70 lg:text-white/60">
            <span>Sponsored by Pakka</span>
            <span className="w-1 h-1 rounded-full bg-black/40 lg:bg-white/40" />
            <span>49 Episodes</span>
            <span className="w-1 h-1 rounded-full bg-black/40 lg:bg-white/40" />
            <span>Spotify · Apple · YouTube</span>
          </div>

        </div>


      </div>

      {/* DESKTOP: grounded parallax landscape that rises + zooms on scroll */}
      <motion.div
        style={{ opacity: prefersReduced ? 1 : sceneOpacity }}
        className="hidden lg:block absolute inset-0 z-[5] overflow-hidden pointer-events-none"
      >
        {/* Children planting — moved to the side (south, right of centre) */}
        <motion.img
          src="/images/hero/parallax/05_people.png"
          alt="Children planting a tree"
          loading="lazy"
          style={{ y: pv(yMid), scale: pv(sMid) }}
          className="absolute bottom-[16px] left-[54%] w-[15%] origin-bottom drop-shadow-md"
        />

        {/* SUGARCANE — big at the middle of each side */}
        <motion.img
          src="/images/hero/parallax/FG_cane_l.png"
          alt=""
          loading="lazy"
          style={{ y: pv(yCane), scale: pv(sCane) }}
          animate={prefersReduced ? undefined : { rotate: [-1.4, 1.4, -1.4] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[20px] left-[-4%] w-[24%] origin-bottom drop-shadow-xl"
        />
        <motion.img
          src="/images/hero/parallax/FG_cane_l.png"
          alt=""
          loading="lazy"
          style={{ y: pv(yCane), scale: pv(sCane) }}
          animate={prefersReduced ? undefined : { rotate: [1.4, -1.4, 1.4] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[20px] right-[-4%] w-[25%] origin-bottom drop-shadow-xl -scale-x-100"
        />

        {/* SUGARCANE — small bundle at each bottom corner grouped closely away from double-stacking */}
        <motion.img
          src="/images/hero/parallax/FG_cane_r.png"
          alt=""
          loading="lazy"
          style={{ y: pv(yCane), scale: pv(sCane) }}
          animate={prefersReduced ? undefined : { rotate: [1, -1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10px] left-[8%] w-[12%] origin-bottom drop-shadow-lg"
        />
        <motion.img
          src="/images/hero/parallax/FG_cane_r.png"
          alt=""
          loading="lazy"
          style={{ y: pv(yCane), scale: pv(sCane) }}
          animate={prefersReduced ? undefined : { rotate: [-1, 1, -1] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10px] right-[8%] w-[12%] origin-bottom drop-shadow-lg -scale-x-100"
        />

        {/* Sustainable props grouped comfortably without clutter */}
        <motion.img
          src="/images/hero/parallax/bagasse.png"
          alt=""
          loading="lazy"
          style={{ y: pv(yMid), scale: pv(sMid) }}
          className="absolute bottom-[40px] left-[18%] w-[9%] origin-bottom drop-shadow-md"
        />

        {/* Mushroom cluster on the left ground */}
        <motion.img
          src="/images/hero/parallax/mushroom.png"
          alt=""
          loading="lazy"
          style={{ y: pv(yMid), scale: pv(sMid) }}
          className="absolute bottom-[34px] left-[27%] w-[9%] origin-bottom drop-shadow-md"
        />

        {/* Hemp plant, right of centre */}
        <motion.img
          src="/images/hero/parallax/hemp.png"
          alt=""
          loading="lazy"
          style={{ y: pv(yMid), scale: pv(sMid) }}
          className="absolute bottom-[34px] right-[26%] w-[8%] origin-bottom drop-shadow-md"
        />

        {/* Seaweed near the right sugarcane */}
        <motion.img
          src="/images/hero/parallax/seaweed.png"
          alt=""
          loading="lazy"
          style={{ y: pv(yMid), scale: pv(sMid) }}
          className="absolute bottom-[36px] right-[18%] w-[7%] origin-bottom drop-shadow-md"
        />

        {/* Canopy vines draping from the top-right */}
        <motion.img
          src="/images/hero/treeRight.png"
          alt=""
          loading="lazy"
          style={{ y: pv(yCanopy), scale: pv(sCanopy) }}
          animate={prefersReduced ? undefined : { rotate: [0, 1, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[34%] origin-top-right drop-shadow-xl"
        />
      </motion.div>

      {/* DESKTOP: latest episode card, vertically centered, pulled in toward the text */}
      <LatestPodcastCard className="hidden lg:block absolute right-[13%] top-1/2 -translate-y-1/2 z-30" />

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
