"use client";

import { motion, useTransform, MotionValue } from "framer-motion";
import Image from "next/image";
import { PodcastButton } from "./ui/PodcastButton";
import { Button } from "./ui/Button";

interface HeroProps {
  rawScroll: MotionValue<number>;
  smoothScroll: MotionValue<number>;
  isMobile: boolean;
}

export function Hero({ rawScroll, smoothScroll, isMobile }: HeroProps) {
  // Background Parallax
  const bgScale = useTransform(smoothScroll, [0, 1.0], [1, 1.1]);
  const bgOpacity = useTransform(smoothScroll, [0.8, 1.0], [1, 0]);

  // Host Image Parallax
  const hostScale = useTransform(smoothScroll, [0, 1.0], [1, 1.15]);
  const hostY = useTransform(smoothScroll, [0, 1.0], ["0%", "5%"]);

  // Text Parallax
  const textScale = useTransform(smoothScroll, [0, 0.8], [1, 1.05]);
  const textY = useTransform(smoothScroll, [0, 0.8], ["0%", "-5%"]);
  const textOpacity = useTransform(smoothScroll, [0, 0.6, 1.0], [1, 1, 0]);

  return (
    <div className="sticky top-0 h-screen w-full overflow-x-hidden bg-[#038f90]">
      {/* Static Background layer */}
      <div className="absolute inset-0 z-0 bg-[#038f90]" />

      {/* Modern Hero Content Container - Overlapping Layout with Site-Wide Alignment */}
      <div className="relative z-10 h-full w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center px-6 md:px-12 overflow-visible">
        
        {/* MOBILE ONLY: Navbar Spacer & Sequential Image Stack */}
        <div className="lg:hidden w-full flex flex-col pt-24 -mx-6 w-[calc(100%+3rem)]">
          <div className="relative w-full h-[33vh] overflow-hidden rounded-t-[40px] mb-0 shadow-xl" style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }}>
            <Image
              src="/images/hero/ved_mb.png"
              alt="Ved - Podcast Host"
              fill
              className="object-cover object-top"
              priority
            />
          </div>
        </div>

        {/* Text Section: Indented to align with other sections, overlapping image on desktop */}
        <div className="relative z-20 flex flex-col items-center lg:items-start text-center lg:text-left -mt-8 lg:mt-0 py-6 md:py-12 lg:py-0 w-full lg:max-w-3xl">
          {/* Brand Heading - Balanced sizing for site-wide consistency */}
          <h1 className="text-4xl md:text-8xl font-serif text-white tracking-tighter leading-[0.95] mb-6 lg:mb-10 drop-shadow-2xl">
            Good Garbage <br />
            <span className="opacity-70 italic text-white/80">Talk</span>
          </h1>

          <p className="max-w-xl font-serif leading-[1.6] text-white/90 font-normal text-base md:text-xl tracking-normal mb-8 lg:mb-14 px-4 lg:px-0 drop-shadow-md">
            Here at the good garbage podcast we are making the world brighter with the power of garbage. <br className="hidden lg:block" />
            This podcast is a celebration of all things garbage and the people who make it happen.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 lg:gap-6">
            <PodcastButton episodeName="A Fresh Start" size={isMobile ? "sm" : "lg"} className="min-w-[200px] lg:min-w-[280px] !h-14 lg:!h-16 shadow-2xl" />
            <Button variant="glass" className="!text-white border-white/40 backdrop-blur-md min-w-[200px] lg:min-w-[280px] !h-14 lg:!h-16 !py-0 flex items-center justify-center shadow-2xl">
              View Archive
            </Button>
          </div>
        </div>
      </div>

      {/* DESKTOP ONLY Host Image Section: Absolute Background Layer - Not Indented, stretches to the edge */}
      <div className="hidden lg:block absolute top-0 right-0 h-full w-[70%] overflow-hidden pointer-events-none">
        {/* Desktop Image: Unified gradient mask with 70% opaque start for wide overlap */}
        <div className="relative w-full h-full translate-x-[5%]" style={{ maskImage: 'linear-gradient(to left, black 70%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to left, black 70%, transparent 100%)' }}>
          <Image
            src="/images/hero/ved_dt.png"
            alt="Ved - Podcast Host"
            fill
            className="object-cover object-right"
            priority
            sizes="70vw"
          />
        </div>

        {/* Subtle Color Overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#038f90]/10 pointer-events-none" />

        {/* Host Name Overlay - Desktop Extreme Right */}
        <div className="absolute bottom-32 right-12 z-30 flex flex-col items-end gap-1">
           <p className="text-white/60 font-serif italic text-xs tracking-[0.2em] uppercase">The Host</p>
           <h4 className="text-white font-serif text-3xl md:text-5xl tracking-tighter title-case font-black">Ved Krishna</h4>
           <div className="h-[2px] w-16 bg-white/40 mt-1" />
        </div>
      </div>

      {/* Simplified Static Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 lg:left-12 lg:translate-x-0 z-30 flex flex-col items-center lg:items-start gap-2">
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
