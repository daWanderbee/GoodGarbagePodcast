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
}

export function Hero({ rawScroll, smoothScroll, episodes }: HeroProps) {
  // Parallax scene: each depth plane rises AND scales up as you scroll
  // (deeper = slower + smaller growth, foreground = faster + larger growth)
  // Zoom completes within the first viewport (~0.16 of page scroll), since the
  // fixed hero is covered by the next section after roughly one screen of scroll.
  const prefersReduced = useReducedMotion();
  // Three planes, one per plant: the cane stands furthest back and barely moves, the hemp
  // sits mid-ground, the mushrooms are nearest so they rise fastest and grow into frame.
  const yCane = useTransform(smoothScroll, [0, 0.16], [0, -30]);
  const yHemp = useTransform(smoothScroll, [0, 0.16], [0, -52]);
  const yMush = useTransform(smoothScroll, [0, 0.16], [0, -84]);
  const sMush = useTransform(smoothScroll, [0, 0.16], [1, 1.07]);
  const sceneOpacity = useTransform(smoothScroll, [0.1, 0.17], [1, 0]);
  const pv = (mv: MotionValue<number>) => (prefersReduced ? undefined : mv);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#067e7d]">
      {/* Flat brand ground */}
      <div className="absolute inset-0 z-0 bg-[#067e7d]" />

      {/* Modern Hero Content Container - Overlapping Layout with Site-Wide Alignment */}
      <div className="relative z-10 h-full w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center lg:justify-start px-6 md:px-12 overflow-visible">

        {/* Text Section: High-contrast white typography with crisp drop shadows */}
        <div className="relative z-20 flex flex-col items-center lg:items-start text-center lg:text-left pt-16 lg:pt-0 w-full lg:max-w-3xl">
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
            <em>Ved Krishna</em> meets the people regenerating our planet.
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

      {/* Foreground: three plants along the bottom edge — hemp bottom left, sugarcane and
          mushrooms together in the bottom right. Small enough to read as a border, so the
          headline and the episode card keep the whole middle of the frame. */}
      <motion.div
        style={{ opacity: prefersReduced ? 1 : sceneOpacity }}
        className="pointer-events-none absolute inset-0 z-[6] overflow-hidden"
      >
        {/* eslint-disable @next/next/no-img-element -- line art with its own alpha, already the
            size it renders at. next/image would re-encode drawings that have nothing left to
            compress, and its fill mode fights percentage placement inside a transformed tree. */}
        {/* Sugarcane, bottom right: stood on the floor of the frame with its tips running
            off the right edge rather than hanging from the top. */}
        <motion.div style={{ y: pv(yCane) }} className="absolute inset-0">
          <img src="/images/hero/frame/cane.webp" alt="" className="absolute -bottom-[2%] right-[-8%] sm:right-[-4%] lg:right-0 h-[44%] sm:h-[40%] lg:h-[52%] w-auto max-w-none" />
        </motion.div>

        {/* Hemp, bottom left */}
        <motion.div style={{ y: pv(yHemp) }} className="absolute inset-0">
          <img src="/images/hero/frame/hemp.webp" alt="" loading="lazy" className="absolute -bottom-[2%] left-[-8%] sm:left-[-3%] lg:left-0 h-[28%] sm:h-[26%] lg:h-[32%] w-auto max-w-none" />
        </motion.div>

        {/* Mushrooms, bottom right and nearest the viewer: they rise fastest and grow. Sat at
            the foot of the cane, so the right corner reads as one clump front to back. */}
        <motion.div style={{ y: pv(yMush), scale: pv(sMush) }} className="absolute inset-x-0 bottom-0 origin-bottom">
          <img src="/images/hero/frame/mushrooms.webp" alt="" loading="lazy" className="absolute -bottom-[1%] right-[1%] sm:right-[2%] lg:right-[3%] w-[28%] sm:w-[15%] lg:w-[11%] h-auto" />
        </motion.div>
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
