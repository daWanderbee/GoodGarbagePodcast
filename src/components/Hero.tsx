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
    <div className="relative h-screen w-full overflow-hidden bg-[#012620]">
      {/* Studio Ghibli Painted Countryside Backdrop (Rolling green hills, deep shadow forest, dirt road & sky) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img src="/images/hero/ghibli_bg.png" alt="Studio Ghibli Countryside Landscape" className="absolute inset-0 h-full w-full object-cover object-center" />
        
        {/* Overall darkening wash. Raised from /30 — with the foreground gone this is the
            only thing separating the headline from the painted hills. */}
        <div className="absolute inset-0 bg-[#012620]/55 pointer-events-none" />

        {/* A slight blur takes the detail out of the landscape without flattening it, so the
            hills stop competing with the type. This is the "less busy" half of the note. */}
        <div className="absolute inset-0 backdrop-blur-[2px] pointer-events-none" />

        {/* Reading panel: deepest under the text, clearing toward the episode card. Runs
            down on mobile, across on desktop, following where the copy sits. */}
        <div className="absolute inset-y-0 left-0 w-full lg:w-[72%] bg-gradient-to-b lg:bg-gradient-to-r from-[#011a15]/95 via-[#012620]/85 to-transparent pointer-events-none" />
        
        {/* Bottom Grounding Gradient connecting to the sections below */}
        <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-[#012620] to-transparent pointer-events-none opacity-90" />
      </div>

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

          {/* Trust strip (High contrast white) */}
          <div className="mt-6 lg:mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-x-3 gap-y-1.5 font-sans text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
            <span>Sponsored by Pakka</span>
            <span className="w-1 h-1 rounded-full bg-white/80" />
            <span>{episodes.length} Episodes</span>
            <span className="w-1 h-1 rounded-full bg-white/80" />
            <span>YouTube · Spotify · Apple</span>
          </div>

        </div>


      </div>

      {/* The foreground layer lived here: sugarcane, children planting, bagasse, mushrooms,
          hemp, seaweed and a canopy vine, all drifting on scroll. It crowded the headline
          and was the "less busy" half of the review note. The painted landscape carries the
          hero on its own. */}

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
