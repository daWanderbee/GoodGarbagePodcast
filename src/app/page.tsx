"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Hero } from "@/components/Hero";
import { LatestEpisode } from "@/components/LatestEpisode";
import { ScrollingMarquee } from "@/components/ScrollingMarquee";
import { AboutPodcast } from "@/components/AboutPodcast";
import { PlatformLinks } from "@/components/PlatformLinks";
import { CollaborationCTA } from "@/components/CollaborationCTA";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";

export default function Home() {
  const { scrollYProgress: rawScroll } = useScroll();

  // Create a smoothed scroll progress for parallax elements (inertia effect)
  const smoothScroll = useSpring(rawScroll, {
    stiffness: 80,
    damping: 40,
    restDelta: 0.001
  });

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="bg-background relative">
      {/* 1. Hero Layer: Fixed in the background for a cinematic slide-over effect */}
      <div className="fixed inset-0 h-screen w-full z-0 pointer-events-none">
        <Hero
          rawScroll={rawScroll}
          smoothScroll={smoothScroll}
          isMobile={isMobile}
        />
      </div>

      {/* 2. Content Stack: Starts immediately after the hero viewport height */}
      <div className="relative z-10 mt-[100vh]">
        {/* The sections now slide directly over the fixed Hero */}
        <LatestEpisode />
        <ScrollingMarquee />
        <PlatformLinks />
        <AboutPodcast />
        <CollaborationCTA />
        <Newsletter />
        <Footer />
      </div>

      {/* Floating Glass Scroll Indicator (Premium Rail) */}
      <div className="fixed right-[4px] top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-[100] group">
        {/* Progress Percentage - Subtle Reveal */}
        <motion.span 
          style={{ opacity: useTransform(rawScroll, [0, 0.05], [0, 0.6]) }}
          className="text-[9px] uppercase font-black tracking-widest text-[#038f90] rotate-90 origin-center mb-4 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
        >
          Progress
        </motion.span>

        <div className="relative h-48 w-[3px] bg-[#038f90]/5 backdrop-blur-sm rounded-full overflow-hidden border border-[#038f90]/5">
          {/* Static Track Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#038f90]/5 to-transparent" />
          
          {/* Animated Liquid Progress Fill */}
          <motion.div 
            style={{ 
              scaleY: rawScroll,
              backgroundColor: "#038f90"
            }}
            className="w-full h-full origin-top relative shadow-[0_0_15px_rgba(3,143,144,0.3)]"
          />
        </div>

        {/* Dynamic Marker Dot */}
        <motion.div
           style={{ opacity: useTransform(rawScroll, [0, 0.05], [0, 1]) }}
           className="w-1.5 h-1.5 rounded-full bg-[#038f90] shadow-[0_0_10px_rgba(3,143,144,0.5)]"
        />
      </div>
    </div>
  );
}
