"use client";

import { motion, useTransform, MotionValue } from "framer-motion";
import Image from "next/image";
import { Button } from "./ui/Button";

interface LatestEpisodeProps {
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
  smoothScroll: MotionValue<number>;
}

export function LatestEpisode({ opacity, scale, smoothScroll }: LatestEpisodeProps) {
  return (
    <motion.div 
      style={{ 
        opacity, 
        scale,
        pointerEvents: useTransform(smoothScroll, (v) => (v > 0.3 && v < 0.7) ? "auto" : "none")
      }}
      className="sticky top-0 h-screen w-full z-50 bg-background flex items-center justify-center p-6 md:p-12 overflow-hidden"
    >
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-24 items-center mt-12 md:mt-0">
        
        {/* Left Side: Large Title and Featured Image */}
        <div className="space-y-4 md:space-y-8">
          <div className="relative">
            <h2 className="text-3xl md:text-8xl font-serif text-black leading-[0.9] tracking-tighter">
              Latest <br /> <span className="opacity-40 italic">Episode</span>
            </h2>
          </div>
          
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            className="relative aspect-video lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-xl group max-h-[25vh] lg:max-h-none"
          >
            <Image 
              src="/images/episodes/latest.png"
              alt="Latest Episode Thumbnail"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </motion.div>
        </div>

        {/* Right Side: Content and CTA */}
        <div className="space-y-6 lg:pt-12">
          <div className="space-y-2 md:space-y-4">
            <span className="text-[9px] uppercase font-black tracking-[0.3em] text-accent">Feature Section</span>
            <h3 className="text-2xl md:text-5xl font-serif text-black leading-tight">The Hidden Value <br /> of Waste</h3>
            <p className="text-xs md:text-lg text-black/70 leading-relaxed max-w-lg">
              Exploring how discarded materials can be transformed into high-value resources.
            </p>
          </div>

          <div className="space-y-4 md:space-y-6 pt-4 border-t border-black/5">
            <div className="flex items-center gap-8 md:gap-12">
              <div>
                <p className="text-[8px] uppercase font-bold text-black/40 mb-1">Guest</p>
                <p className="text-[11px] md:text-[13px] font-black text-black">Dr. Sarah Jenkins</p>
              </div>
              <div>
                <p className="text-[8px] uppercase font-bold text-black/40 mb-1">Duration</p>
                <p className="text-[11px] md:text-[13px] font-black text-black">45 mins</p>
              </div>
            </div>

            <div className="pt-2">
              <Button variant="accent" className="!px-8 !h-11 md:!h-14 group !text-[10px] md:!text-sm">
                Play Episode
                <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center bg-white/20 rounded-full ml-3">
                  <div className="w-0 h-0 border-l-[6px] md:border-l-[8px] border-l-white border-y-[4px] md:border-y-[5px] border-y-transparent ml-1" />
                </div>
              </Button>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
