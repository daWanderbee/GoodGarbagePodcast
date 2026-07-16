"use client";

import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import Image from "next/image";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  accent?: string;
  subtitle?: string;
  lowerCurveColor?: string;
  curveVariant?: "wave" | "swell" | "crest" | "arch";
}

// Shared botanical page header — embeds the barn/countryside background (`ghibli_bg.png`) across all headers
export function PageHero({
  eyebrow,
  title,
  accent,
  subtitle,
  lowerCurveColor = "#f2ede4",
  curveVariant = "wave",
}: PageHeroProps) {
  // 4 distinct organic, inconsistent hand-drawn curve paths for every page leaving home (`make this curve for header inconsistent throughout`)
  const curvePaths: Record<string, string> = {
    wave: "M0 70 L 0 35 C 320 5, 680 58, 1020 22 C 1240 -2, 1360 40, 1440 28 L 1440 70 Z",
    swell: "M0 70 L 0 45 C 240 65, 520 10, 800 48 C 1080 82, 1280 12, 1440 38 L 1440 70 Z",
    crest: "M0 70 L 0 22 C 360 -10, 720 62, 1080 18 C 1260 2, 1380 48, 1440 32 L 1440 70 Z",
    arch: "M0 70 L 0 38 Q 400 -18, 920 42 T 1440 24 L 1440 70 Z",
  };

  return (
    <section className="relative bg-[#012620] px-6 md:px-12 pt-36 pb-24 md:pt-44 md:pb-36 overflow-visible z-10 sm:min-h-[440px] flex flex-col justify-center">
      {/* Barn / Studio Ghibli Countryside Background (`make all headers have this barn image`) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src="/images/hero/ghibli_bg.png"
          alt="Painted Barn Studio Ghibli Countryside Landscape"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105"
        />
        {/* High-contrast WCAG AAA botanical dark overlay so header typography & navbar stand out crisply */}
        <div className="absolute inset-0 bg-[#012620]/68 backdrop-blur-[1px]" />
      </div>

      <div className="max-w-7xl mx-auto text-center lg:text-left relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center lg:justify-start gap-2 mb-5 text-white/90"
        >
          <Leaf className="w-4 h-4 text-[#d4eedf]" />
          <span className="uppercase text-[10px] md:text-[11px] tracking-[0.3em] font-bold font-sans">{eyebrow}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="text-4xl md:text-7xl font-serif text-white tracking-tighter leading-[0.95]"
        >
          {title}
          {accent && <span className="italic text-[#d4eedf]"> {accent}</span>}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 max-w-2xl mx-auto lg:mx-0 font-serif text-base md:text-xl leading-[1.6] text-white/90"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* Lower Curve arching across subpages with un-clipped 3px overlap to eliminate subpixel crease lines */}
      <div className="absolute -bottom-[3px] left-0 w-full pointer-events-none z-20 leading-none overflow-visible">
        <svg viewBox="0 0 1440 75" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10 sm:h-14 md:h-20 lg:h-24 block overflow-visible">
          <path d={(curvePaths[curveVariant] || curvePaths.wave).replace("L 1440 70 Z", "L 1440 75 L 0 75 Z")} fill={lowerCurveColor} />
        </svg>
      </div>
    </section>
  );
}
