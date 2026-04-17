"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { Hero } from "@/components/Hero";
import { LatestEpisode } from "@/components/LatestEpisode";
import { PlatformLinks } from "@/components/PlatformLinks";
import { Button } from "@/components/ui/Button";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: rawScroll } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

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

  // Section 2: Latest Episode (0.3 - 1.0)
  const latestOpacity = useTransform(smoothScroll, [0.3, 0.5, 0.9, 1.0], [0, 1, 1, 1]);
  const latestScale = useTransform(smoothScroll, [0.3, 0.5], [0.95, 1]);

  return (
    <div className="bg-background">
      <div ref={containerRef} className="relative h-[350vh]">
        {/* Hero Section Component */}
        <Hero
          rawScroll={rawScroll}
          smoothScroll={smoothScroll}
          isMobile={isMobile}
        />

        {/* Latest Episode Section Component */}
        <LatestEpisode 
          opacity={latestOpacity}
          scale={latestScale}
          smoothScroll={smoothScroll}
        />
      </div>

      {/* Scroll Progress Indicator (Right Side) */}
      <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 h-40 w-[2px] bg-black/10 z-[100] overflow-hidden rounded-full">
        <motion.div 
          style={{ scaleY: rawScroll }}
          className="w-full h-full bg-black origin-top"
        />
      </div>

      {/* Platform Links Section Component (Standard Scroll) */}
      <PlatformLinks />
    </div>
  );
}
