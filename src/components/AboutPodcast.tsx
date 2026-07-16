"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Button } from "./ui/Button";

export function AboutPodcast() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Enhanced drifting effect: more noticeable movement and rotation
  const imageX = useTransform(scrollYProgress, [0, 1], ["80px", "-80px"]);
  const imageRotate = useTransform(scrollYProgress, [0, 1], [8, -8]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

  return (
    <section ref={sectionRef} className="pt-20 md:pt-32 pb-0 bg-[#f2ede4] relative overflow-visible -mt-8 sm:-mt-14 md:-mt-20 z-[30]">
      {/* Seamless Unbroken Cream Arch right above VALUE PROPOSITION with 2px downward overlap */}
      <div className="absolute top-0 left-0 w-full translate-y-[calc(-100%+2px)] pointer-events-none z-[35] overflow-visible leading-none">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-12 sm:h-20 md:h-28 lg:h-36 block">
          <path d="M0 120 Q 720 -30, 1440 120 L 1440 124 L 0 124 Z" fill="#f2ede4" />
        </svg>
      </div>
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-24 items-center">
          {/* Content Side */}
          <div className="space-y-6 order-2 lg:order-1">
            <div className="space-y-6">
              <span className="text-[10px] md:text-[11px] uppercase font-black tracking-[0.4em] text-[#038f90]/70 block mb-4">Value Proposition</span>
              <h2 className="text-2xl md:text-5xl font-serif text-[#038f90] leading-[0.95] tracking-tighter">
                Making the world bright <br /> with <span className="italic opacity-50">Good Garbage</span>
              </h2>
            </div>

            <div className="space-y-4 text-black/80 max-w-lg">
              <p className="text-base md:text-lg font-medium leading-relaxed">
                The Good Garbage Podcast started with a simple belief: sustainability doesn&apos;t have to be grim — it can be a genuine celebration of what human ingenuity and natural systems can do together.
              </p>
              <p className="text-xs md:text-[15px] leading-relaxed">
                Proudly sponsored by <span className="font-bold text-accent">Pakka</span> — pioneers of compostable packaging and a plastic-free future — we sit down each week with the scientists, founders, and activists turning discarded materials into high-value resources. From biomaterials labs to grassroots movements, these are the stories that prove regeneration is already happening.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-11 h-11 rounded-full bg-background overflow-hidden flex-shrink-0 border-2 border-[#038f90]/30 shadow-md">
                  <Image
                    src="/images/hero/host_mobile.png"
                    alt="Ved Krishna - Host"
                    width={44}
                    height={44}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-black text-[#038f90]">Ved Krishna &amp; Production Team</p>
                  <p className="text-[10px] uppercase font-bold text-black/50 tracking-wider">Host, Producers &amp; Pakka Innovators</p>
                </div>
              </div>
            </div>

            <div className="flex flex-row flex-wrap items-center gap-2.5 md:gap-3 pt-4">
              <a href="https://pakka.com" target="_blank" rel="noopener noreferrer">
                <Button variant="accent" className="!px-5 md:!px-6 !h-11 md:!h-12 !text-[10px] md:!text-xs shrink-0 font-bold shadow-md">
                  Visit Pakka.com ↗
                </Button>
              </a>
              <a href="/about">
                <Button variant="outline" className="!px-5 md:!px-6 !h-11 md:!h-12 border-[#038f90]/30 hover:bg-[#038f90]/5 bg-transparent !text-[10px] md:!text-xs shrink-0 whitespace-nowrap font-bold text-[#038f90]">
                  Meet our Team &amp; Host →
                </Button>
              </a>
            </div>
          </div>

          {/* Drifting Image Side - Enlarged on Desktop */}
          <motion.div
            style={{ x: imageX, rotate: imageRotate, scale: imageScale }}
            className="relative aspect-square lg:aspect-[3/4] order-1 lg:order-2 flex items-center justify-center lg:scale-110"
          >
            <div className="relative h-full w-full">
              <Image
                src="/images/composter.webp"
                alt="About the Podcast Art"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-contain drop-shadow-xl"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave bridging Cream into Dark Green Platform Links */}
      <div className="absolute bottom-0 left-0 w-full translate-y-[99%] pointer-events-none z-[30]">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
          <path d="M0 0C240 45 480 45 720 25C960 5 1200 45 1440 0H0Z" fill="#f2ede4" />
        </svg>
      </div>
    </section>
  );
}
