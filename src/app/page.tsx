"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Hero } from "@/components/Hero";
import { LatestEpisode } from "@/components/LatestEpisode";
import { ScrollingMarquee } from "@/components/ScrollingMarquee";
import { AboutPodcast } from "@/components/AboutPodcast";
import { PlatformLinks } from "@/components/PlatformLinks";
import { CollaborationCTA } from "@/components/CollaborationCTA";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";

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

  return (
    <div className="bg-background relative">
      {/* 1. Hero Container: Tightened scroll-jacking height for a seamless transition */}
      <div ref={containerRef} className="relative h-[150vh]">
        <Hero
          rawScroll={rawScroll}
          smoothScroll={smoothScroll}
          isMobile={isMobile}
        />
      </div>

      {/* 2. Latest Episode Section (Normal Vertical Flow) */}
      <LatestEpisode />

      {/* 3. Scrolling Marquee Section (Normal Flow) */}
      <ScrollingMarquee />

      {/* 4. Platform Links Section Component (Standard Scroll) */}
      <PlatformLinks />

      {/* 5. About the Podcast Section */}
      <AboutPodcast />

      {/* 6. Collaboration CTA Section */}
      <CollaborationCTA />

      {/* 7. Newsletter Section */}
      <Newsletter />

      {/* 8. Simple Footer Section */}
      <Footer />

      {/* Scroll Progress Indicator (Right Side) */}
      <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 h-40 w-[2px] bg-black/10 z-[100] overflow-hidden rounded-full">
        <motion.div 
          style={{ scaleY: rawScroll }}
          className="w-full h-full bg-black origin-top"
        />
      </div>
    </div>
  );
}
