"use client";

import { motion, useTransform, MotionValue } from "framer-motion";
import Image from "next/image";
import { PodcastButton } from "./ui/PodcastButton";

interface HeroProps {
  rawScroll: MotionValue<number>;
  smoothScroll: MotionValue<number>;
  isMobile: boolean;
}

export function Hero({ rawScroll, smoothScroll, isMobile }: HeroProps) {
  // Tree Animation (Using smoothScroll for inertia)
  const treeScale = useTransform(smoothScroll, [0, 0.8], [1, 12]);
  const treeOpacity = useTransform(smoothScroll, [0.5, 0.7], [1, 0]);
  const treeLeftX = useTransform(smoothScroll, [0, 0.8], ["0%", "-30%"]);
  const treeRightX = useTransform(smoothScroll, [0, 0.8], ["0%", "30%"]);
  const treeY = useTransform(smoothScroll, [0, 0.8], ["0%", "-20%"]);

  // Bush Animation (Using smoothScroll for inertia)
  const bushScale = useTransform(smoothScroll, [0, 0.8], [1, 15]);
  const bushOpacity = useTransform(smoothScroll, [0.5, 0.7], [1, 0]);

  // Background Animation (Using smoothScroll for inertia)
  const bgScale = useTransform(smoothScroll, [0, 0.8], [1, 2]);
  const bgOpacity = useTransform(smoothScroll, [0.5, 0.7], [1, 0]);

  // Text Animation (Now using smoothScroll for consistent inertia)
  const textScale = useTransform(smoothScroll, [0, 0.6], [1, 2]);
  const textOpacity = useTransform(smoothScroll, [0, 0.4, 0.6], [1, 1, 0]);
  const textY = 0; // Removed offset to ensure perfect vertical centering on all devices

  return (
    <div className="sticky top-0 h-screen w-full overflow-hidden">
      {/* Background Layer */}
      <motion.div
        style={{ scale: bgScale, opacity: bgOpacity }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="/images/hero/bg.png"
          alt="Misty Forest Background"
          fill
          className="object-cover opacity-80"
        />
      </motion.div>

      {/* Center Content: GOOD GARBAGE PODCAST */}
      <motion.div
        style={{
          scale: textScale,
          opacity: textOpacity,
          y: textY
        }}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4"
      >
        <div className="p-main-world__logo__inner -inview -stable flex flex-col items-center">
          <h1 className="text-4xl md:text-7xl font-serif text-black tracking-tighter leading-none mb-4 drop-shadow-sm">
            Good Garbage <br />
            <span className="opacity-70">Podcast</span>
          </h1>
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-2 mt-2">
            <div className="flex items-center gap-2">
              <span className="font-sans text-black font-black text-sm uppercase tracking-widest">50+ Episodes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-sans text-black font-black text-sm uppercase tracking-widest">1000+ Listeners</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-sans text-black font-black text-sm uppercase tracking-widest">35+ Guests</span>
            </div>
          </div>

          <PodcastButton episodeName="The Hidden Value of Waste" />
        </div>
      </motion.div>

      {/* Mid-ground: Trees (Left & Right) */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <div className="relative w-full h-full">
          <motion.div
            style={{
              scale: treeScale,
              opacity: treeOpacity,
              x: isMobile ? treeLeftX : 0,
              y: isMobile ? treeY : 0
            }}
            className="absolute left-[-99%] md:left-[-70%] lg:left-[-25%] top-[-90px] h-[120%] w-auto"
          >
            <Image
              src="/images/hero/treeLeft.png"
              alt="Tree Left"
              width={800}
              height={1080}
              className="h-full w-auto object-contain object-left"
            />
          </motion.div>
          <motion.div
            style={{
              scale: treeScale,
              opacity: treeOpacity,
              x: isMobile ? treeRightX : 0,
              y: isMobile ? treeY : 0
            }}
            className="absolute right-[-99%] md:right-[-70%] lg:right-[-25%] top-[-90px] h-[120%] w-auto"
          >
            <Image
              src="/images/hero/treeRight.png"
              alt="Tree Right"
              width={800}
              height={1080}
              className="h-full w-auto object-contain object-right"
            />
          </motion.div>
        </div>
      </div>

      {/* Foreground: Bushes (Left & Right) */}
      <motion.div
        style={{ scale: bushScale, opacity: bushOpacity }}
        className="absolute inset-0 z-40 pointer-events-none"
      >
        <div className="relative w-full h-full">
          <Image
            src="/images/hero/BushLeft.png"
            alt="Bush Left"
            width={1000}
            height={500}
            className="absolute left-[-15%] bottom-[-20%] w-[60%] h-auto object-contain object-bottom-left"
          />
          <Image
            src="/images/hero/BushRight.png"
            alt="Bush Right"
            width={1000}
            height={500}
            className="absolute right-[-15%] bottom-[-20%] w-[60%] h-auto object-contain object-bottom-right"
          />
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        style={{ opacity: useTransform(rawScroll, [0, 0.1], [1, 0]) }}
        className="absolute bottom-10 left-10 z-50 flex flex-col items-start gap-4"
      >
        <div className="w-[1px] h-24 bg-black/20 relative overflow-hidden">
          <motion.div
            animate={{ y: [0, 100] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-1/2 bg-black"
          />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-black vertical-rl">Scroll to start</span>
      </motion.div>
    </div>
  );
}
