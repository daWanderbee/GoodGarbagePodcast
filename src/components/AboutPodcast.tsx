"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Button } from "./ui/Button";

export function AboutPodcast() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Enhanced drifting effect: more noticeable movement and rotation
  const imageX = useTransform(scrollYProgress, [0, 1], ["80px", "-80px"]);
  const imageRotate = useTransform(scrollYProgress, [0, 1], [8, -8]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-[#f2ede4] relative overflow-visible">
      {/* Hand-drawn Irregular Wave Divider */}
      <div className="absolute top-0 left-0 w-full -translate-y-[98%] pointer-events-none">
        <svg viewBox="0 0 1440 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 160L48 144C96 128 192 96 288 96C384 96 480 128 576 138.7C672 149.3 768 138.7 864 122.7C960 106.7 1056 85.3 1152 74.7C1248 64 1344 64 1392 64H1440V160H1392C1344 160 1248 160 1152 160C1056 160 960 160 864 160C768 160 672 160 576 160C480 160 384 160 288 160C192 160 96 160 48 160H0V160Z" fill="#f2ede4" />
        </svg>
      </div>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-24 items-center">

          {/* Content Side */}
          <div className="space-y-6 order-2 lg:order-1">
            <div className="space-y-6">
              <span className="text-[10px] md:text-[11px] uppercase font-black tracking-[0.4em] text-[#038f90]/70 block mb-4">Value Proposition</span>
              <h2 className="text-2xl md:text-5xl font-serif text-[#038f90] leading-[0.95] tracking-tighter">
                Making the world bright <br /> with <span className="italic opacity-50">"Good Garbage"</span>
              </h2>
            </div>

            <div className="space-y-4 text-black/80 max-w-lg">
              <p className="text-base md:text-lg font-medium leading-relaxed">
                The Good Garbage Podcast started with a simple belief: that sustainability doesn't have to be boring—it can be a celebration.
              </p>
              <p className="text-xs md:text-[15px] leading-relaxed">
                Proudly sponsored by <span className="font-bold text-accent">Pakka</span>, we explore how discarded materials and "messy" ideas can be transformed into high-value resources. From global climate experts to grassroots activists, our guests share stories that inspire a cleaner, more creative future.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-background overflow-hidden flex-shrink-0">
                  <Image
                    src="/images/hero/host_mobile.png"
                    alt="Host"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-black text-black">A friendly voice on sustainability</p>
                  <p className="text-[9px] uppercase font-bold text-black/40 tracking-wider">Host & Guide</p>
                </div>
              </div>
            </div>

            <div className="flex flex-row items-center gap-2 md:gap-3 pt-4">
              <Button variant="accent" className="!px-4 md:!px-6 !h-10 md:!h-12 !text-[9px] md:!text-xs shrink-0">
                Visit Pakka.com
              </Button>
              <Button variant="outline" className="!px-4 md:!px-6 !h-10 md:!h-12 border-black/10 hover:bg-black/5 bg-transparent !text-[9px] md:!text-xs shrink-0 whitespace-nowrap">
                Meet the Host
              </Button>
            </div>
          </div>

          {/* Drifting Image Side - Enlarged on Desktop */}
          <motion.div
            style={{ x: imageX, rotate: imageRotate, scale: imageScale }}
            className="relative aspect-square lg:aspect-[3/4] order-1 lg:order-2 flex items-center justify-center lg:scale-110"
          >
            <div className="relative h-full w-full">
              <Image
                src="/images/about_art.png"
                alt="About the Podcast Art"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-contain"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
