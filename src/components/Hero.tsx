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
  // Tree Animation (Reduced scale and tighter movement)
  const treeScale = useTransform(smoothScroll, [0, 1.0], [1, 2.8]);
  const treeOpacity = useTransform(smoothScroll, [0.8, 1.0], [1, 0]);
  const treeLeftX = useTransform(smoothScroll, [0, 1.0], ["0%", "-20%"]);
  const treeRightX = useTransform(smoothScroll, [0, 1.0], ["0%", "20%"]);
  const treeY = useTransform(smoothScroll, [0, 1.0], ["0%", "-15%"]);

  // Bush Animation (Reduced scale)
  const bushScale = useTransform(smoothScroll, [0, 1.0], [1, 3.5]);
  const bushOpacity = useTransform(smoothScroll, [0.8, 1.0], [1, 0]);

  // Background Animation
  const bgScale = useTransform(smoothScroll, [0, 1.0], [1, 1.4]);
  const bgOpacity = useTransform(smoothScroll, [0.8, 1.0], [1, 0]);

  // Text Animation
  const textScale = useTransform(smoothScroll, [0, 0.8], [1, 1.5]);
  const textOpacity = useTransform(smoothScroll, [0, 0.6, 1.0], [1, 1, 0]);

  return (
    <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#B0DDD0]">
      {/* Background Layer (90% Sky) */}
      <motion.div
        style={{ scale: bgScale, opacity: bgOpacity }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="/images/hero/bg_mint.png"
          alt="Mint Aesthetic Sky"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </motion.div>

      {/* Center Content: GOOD GARBAGE PODCAST */}
      {/* Center Content: Centered Flex Group */}
      <motion.div
        style={{
          scale: textScale,
          opacity: textOpacity,
        }}
        className="absolute inset-0 z-20 flex items-center justify-center px-4 md:px-12"
      >
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-4 max-w-7xl">
          {/* Text Container - Centered on Heading Pivot */}
          <div className="p-main-world__logo__inner -inview -stable flex flex-col items-center lg:items-start text-center lg:text-left relative">
            {/* Mobile/Tablet Host Image (Pivoted above heading) */}
            <div className="lg:hidden absolute bottom-full left-1/2 -translate-x-1/2 w-36 h-36 md:w-56 md:h-56 mb-12">
              <Image
                src="/images/hero/host_mobile.png"
                alt="Podcast Host"
                width={250}
                height={250}
                className="w-full h-full object-contain filter drop-shadow-xl"
                priority
              />
            </div>

            <h1 className="text-[10vw] lg:text-[6vw] font-serif text-black tracking-tighter leading-[0.85] drop-shadow-sm">
              Good Garbage <br />
              <span className="opacity-70 italic">Talk</span>
            </h1>

            {/* Mobile/Tablet Byline (Pivoted below heading) */}
            <div className="lg:static absolute top-[105%] left-0 w-full flex flex-col items-center lg:items-start lg:mt-6">
              <div className="flex flex-wrap items-center lg:items-start justify-center lg:justify-start gap-y-2 mb-0 lg:mb-10 w-full max-w-xl">
                <span className="font-serif leading-[1.4] text-black/80 font-normal text-[2.5vw] md:text-[1.8vw] lg:text-[1.1vw] tracking-tight">
                  Here at the good garbage podcast we are making the world brighter with the power of garbage. This podcast is a celebration of all things garbage and the people who make it happen.
                </span>
              </div>

              <div className="lg:self-start mt-0">
                <PodcastButton episodeName="A Fresh Start" size="sm" />
              </div>
            </div>
          </div>

          {/* Host Face Art (Fluid Sizing) - Brining closer */}
          <div className="hidden lg:block w-[24vw] h-[24vw] relative shrink-0">
            <Image
              src="/images/hero/host.png"
              alt="Podcast Host"
              width={600}
              height={600}
              className="w-full h-full object-contain filter drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </motion.div>



      {/* Foreground: Bushes (Pinned to Corners) */}
      <motion.div
        style={{ scale: bushScale, opacity: bushOpacity }}
        className="absolute inset-0 z-40 pointer-events-none flex justify-between items-end p-0"
      >
        <Image
          src="/images/hero/BushLeft.png"
          alt="Bush Left"
          width={600}
          height={300}
          className="w-[35%] h-auto object-contain object-bottom-left"
          priority
        />
        <Image
          src="/images/hero/BushRight.png"
          alt="Bush Right"
          width={600}
          height={300}
          className="w-[35%] h-auto object-contain object-bottom-right"
          priority
        />
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
