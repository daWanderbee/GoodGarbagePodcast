"use client";

import { motion, useTransform, useReducedMotion, MotionValue } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { PodcastButton } from "./ui/PodcastButton";
import { Button } from "./ui/Button";
import { LatestPodcastCard } from "./ui/LatestPodcastCard";
import { watchUrl, type Episode } from "@/lib/feed";

interface HeroProps {
  episodes: Episode[];
  rawScroll: MotionValue<number>;
  smoothScroll: MotionValue<number>;
  isMobile: boolean;
}

export function Hero({ rawScroll, smoothScroll, isMobile, episodes }: HeroProps) {
  // Parallax scene: each depth plane rises AND scales up as you scroll
  // (deeper = slower + smaller growth, foreground = faster + larger growth)
  // Zoom completes within the first viewport (~0.16 of page scroll), since the
  // fixed hero is covered by the next section after roughly one screen of scroll.
  const prefersReduced = useReducedMotion();
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
          <p className="max-w-xl font-serif leading-[1.6] text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl tracking-normal mb-8 lg:mb-10 px-4 lg:px-0 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
            <span className="block font-sans font-black uppercase tracking-[0.18em] text-xs sm:text-sm md:text-base mb-2 text-[#aeddd9]">
              Let&apos;s talk trash!
            </span>
            Join us and our host, <em>Ved Krishna</em>, as we connect with the people and the ideas regenerating our planet, in search of the answer to one question: what is <em>Good Garbage</em>?
          </p>

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

      {/* Foreground: a sugarcane clump in each bottom corner and a flock top-right. Both rise
          and grow on scroll, then fade out as the next section covers the pinned hero. Only the
          corners are occupied — the headline column stays clear, which is what crowded it the
          first time round. */}
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

        {/* Sugarcane, one supplied clump per side, each drawn for its own corner — no
            mirroring, which would light the plant from the wrong side, and no sway: the art
            includes the soil the plant stands in, so rocking it tilts the ground with it.
            Sized by height rather than width. Each stalk base sits 42-58% across its own
            image, so at a flush left-0/right-0 the leaves reach the corner but the trunk stands
            well inside it — desktop pushes each plant out by 22% of its width to put the trunk
            in the corner instead. Below 1024px the shift is half the width, because two full
            canes cover most of a phone screen. The shift uses motion's own x — a Tailwind -translate-x class
            would be overwritten by the transform framer-motion composes from y/scale/rotate. */}
        <motion.img
          src="/images/hero/parallax/sugarcane_left.webp"
          alt=""
          loading="lazy"
          style={{ x: isMobile ? "-60%" : "-22%", y: pv(isMobile ? yCaneMobile : yCane), scale: pv(isMobile ? sCaneMobile : sCane) }}
          className="absolute bottom-0 left-0 h-[60vh] sm:h-[60vh] w-auto max-w-none origin-bottom drop-shadow-xl"
        />
        <motion.img
          src="/images/hero/parallax/sugarcane_right.webp"
          alt=""
          loading="lazy"
          style={{ x: isMobile ? "70%" : "22%", y: pv(isMobile ? yCaneMobile : yCane), scale: pv(isMobile ? sCaneMobile : sCane) }}
          className="absolute bottom-0 right-0 h-[60vh] sm:h-[60vh] w-auto max-w-none origin-bottom drop-shadow-xl"
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
