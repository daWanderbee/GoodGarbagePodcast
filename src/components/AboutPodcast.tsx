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
              <h2 className="text-2xl md:text-5xl font-serif text-[#038f90] leading-[0.95] tracking-tighter">
                Sustainability doesn&apos;t <br className="hidden lg:block" /> have to be <span className="italic opacity-50">grim</span>
              </h2>
            </div>

            <div className="space-y-4 text-black/80 max-w-lg">
              <p className="text-base md:text-lg font-medium leading-relaxed">
                That&apos;s the belief this whole show runs on. Waste isn&apos;t a lecture — it&apos;s a design problem, and design problems get solved. Each episode, Ved Krishna sits down with the people solving them: biomaterials scientists, packaging founders, policy changemakers, artists. Garbage isn&apos;t inherently bad — with the right people guiding the movement forward, it can even be good.
              </p>
              <p className="text-xs md:text-[15px] leading-relaxed">
                Sponsored by <span className="font-bold text-accent">Pakka</span>, making packaging from sugarcane residue since 1981.
              </p>
              {/* One control, not a label that looks like one. This used to be a static name tag
                  sitting next to a "Meet our Team & Host" button, so it read as clickable and did
                  nothing. Now the card itself is the link and the button is gone. */}
              <a href="/about" className="flex items-center gap-3 pt-2 group w-fit">
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
                  <p className="text-sm font-black text-[#038f90] group-hover:underline underline-offset-4 decoration-1">
                    Ved Krishna <span className="opacity-60 font-bold">→</span>
                  </p>
                  <p className="text-[10px] uppercase font-bold text-black/50 tracking-wider">Host · Meet him</p>
                </div>
              </a>
            </div>

            <div className="flex flex-row flex-wrap items-center gap-2.5 md:gap-3 pt-4">
              <a href="https://pakka.com" target="_blank" rel="noopener noreferrer">
                <Button variant="accent" className="!px-5 md:!px-6 !h-11 md:!h-12 !text-[10px] md:!text-xs shrink-0 font-bold shadow-md">
                  Visit Pakka.com ↗
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
