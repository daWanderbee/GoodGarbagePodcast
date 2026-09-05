"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mic, Sparkles, TrendingUp, Package, HeartHandshake, Cpu, ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "./ui/Button";

// "Become a Guest" leads, because it is what most people arrive wanting, and the longer
// name keeps it from reading as a link to past guests.
const COLLAB_TYPES = [
  { name: "Become a Guest", desc: "Share your story on the podcast", icon: <Mic className="w-5 h-5 text-[#aeddd9]" /> },
  { name: "Product Dev", desc: "Circular packaging & biomaterials", icon: <Package className="w-5 h-5 text-[#aeddd9]" /> },
  { name: "Funding", desc: "Strategic investment & grants", icon: <TrendingUp className="w-5 h-5 text-[#aeddd9]" /> },
  { name: "Sponsorship", desc: "Brand alignment & co-creation", icon: <HeartHandshake className="w-5 h-5 text-[#aeddd9]" /> },
  { name: "Technology", desc: "Regenerative systems & R&D", icon: <Cpu className="w-5 h-5 text-[#aeddd9]" /> },
  { name: "Other", desc: "Custom ideas & partnerships", icon: <Sparkles className="w-5 h-5 text-[#aeddd9]" /> },
];

interface CollaborationCTAProps {
  topCurveColor?: string;
}

export function CollaborationCTA({ topCurveColor }: CollaborationCTAProps = {}) {
  return (
    <section 
      id="collaborate" 
      className="min-h-screen lg:h-screen lg:max-h-[880px] w-full bg-[#012620] relative overflow-visible z-20 flex items-center justify-center py-16 md:py-20 px-6 sm:px-8 md:px-12"
    >
      {/* Studio Ghibli Painted Countryside Backdrop (Rolling green hills, deep shadow forest & dirt road) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img src="/images/hero/ghibli_bg.png" alt="Studio Ghibli Countryside Landscape" className="absolute inset-0 h-full w-full object-cover object-center" />

        {/* Deep Forest Shadow Overlay to guarantee pristine WCAG AAA legibility for cards and typography */}
        <div className="absolute inset-0 bg-[#012620]/45 pointer-events-none" />

        {/* Reading panel under the headline and paragraph only. */}
        <div className="absolute inset-y-0 left-0 w-full lg:w-[58%] bg-gradient-to-b lg:bg-gradient-to-r from-[#012620]/90 via-[#012620]/60 to-transparent pointer-events-none" />
      </div>

      {/* Top Curve arching down over the Studio Ghibli countryside clouds painting with un-clipped 3px upward overlap to eliminate subpixel crease lines */}
      {topCurveColor && (
        <div className="absolute -top-[3px] left-0 w-full pointer-events-none z-20 leading-none overflow-visible">
          <svg viewBox="0 -10 1440 75" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-8 sm:h-12 md:h-18 block overflow-visible">
            <path d="M0 -10 L 1440 -10 L 1440 25 Q 720 65 0 25 Z" fill={topCurveColor} />
          </svg>
        </div>
      )}

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Clean Editorial Typography & Compact Host Preview (Zero Cranky Boxes) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6 lg:space-y-8 text-left"
          >
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white tracking-tighter leading-[1.08] drop-shadow-sm">
                Become part of <br className="hidden lg:block" /> our community
              </h2>
            </div>

            <p className="text-sm sm:text-base text-white/95 font-sans leading-relaxed max-w-md">
              If you want your story to reach an audience that actually cares, you are in the right place. Are you building circular biomaterials? Or maybe you are looking for strategic alignment? Send us a message — we read each one.
            </p>
          </motion.div>

          {/* Right Column: High-Contrast Interactive Grid & Action Bar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col justify-between space-y-8 lg:space-y-10 w-full min-w-0"
          >
            {/* 2x3 Choice Grid: Crisp, high-contrast dark tiles instead of hazy low-opacity boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {COLLAB_TYPES.map((type) => (
                <Link
                  key={type.name}
                  href={`/contact?topic=${encodeURIComponent(type.name)}`}
                  className="group relative rounded-2xl p-4 sm:p-5 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 hover:border-[#aeddd9] transition-all duration-300 flex items-center justify-between gap-3 shadow-lg hover:shadow-2xl hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#aeddd9]/20 border border-[#aeddd9]/40 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#aeddd9] group-hover:text-[#013536] transition-all duration-300">
                      {type.icon}
                    </div>
                    <div className="min-w-0 text-left">
                      <h3 className="font-bold text-sm sm:text-base text-white tracking-wide truncate group-hover:text-[#aeddd9] transition-colors">
                        {type.name}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-white/85 truncate mt-0.5 font-sans">
                        {type.desc}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/60 group-hover:text-[#aeddd9] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                </Link>
              ))}
            </div>

            {/* High-Contrast Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link href="/contact" className="flex-1">
                <Button
                  variant="accent"
                  className="w-full !h-12 sm:!h-14 !px-6 !text-xs sm:!text-sm uppercase tracking-widest bg-white !text-[#013536] hover:bg-[#aeddd9] transition-all duration-300 rounded-xl shadow-xl font-black flex items-center justify-center gap-2.5 group border border-transparent"
                >
                  <span>Apply to collaborate</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/about" className="sm:w-auto">
                <Button
                  variant="glass"
                  className="w-full sm:w-auto !h-12 sm:!h-14 !px-6 !text-xs sm:!text-sm bg-white/10 hover:bg-white/20 backdrop-blur-md border-white/40 hover:border-white !text-white uppercase tracking-widest rounded-xl flex items-center justify-center font-bold shadow-lg"
                >
                  Meet the host
                </Button>
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

