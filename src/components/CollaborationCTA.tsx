"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Mic, Sparkles, TrendingUp, Package, HeartHandshake, Cpu, ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "./ui/Button";

const COLLAB_TYPES = [
  { name: "Product Dev", desc: "Circular packaging & biomaterials", icon: <Package className="w-5 h-5 text-[#aeddd9]" /> },
  { name: "Funding", desc: "Strategic investment & grants", icon: <TrendingUp className="w-5 h-5 text-[#aeddd9]" /> },
  { name: "Guest", desc: "Share your story on the podcast", icon: <Mic className="w-5 h-5 text-[#aeddd9]" /> },
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
        <div className="absolute inset-0 bg-[#012620]/65 pointer-events-none" />
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
              <span className="text-[11px] uppercase font-black tracking-[0.3em] text-[#aeddd9] block">
                Open Call For Collaborations
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white tracking-tighter leading-[1.08] drop-shadow-sm">
                Collaborate across <br className="hidden lg:block" /> 6 key areas
              </h2>
            </div>

            <p className="text-sm sm:text-base text-white/95 font-sans leading-relaxed max-w-md">
              Whether you are building circular biomaterials, looking for strategic alignment, or want to bring your story to a growing global audience — our team is open to co-creation. Pick your entry point below.
            </p>

            {/* Integrated Host & Production Team Pill (High contrast dark card) */}
            <div className="flex items-center gap-4 p-3 sm:p-3.5 bg-[#013536] rounded-2xl border border-white/20 shadow-md max-w-md">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#012829] shrink-0 border border-white/30 shadow-inner group">
                <Image
                  src="/images/hero/ved_dt.png"
                  alt="Ved Krishna - Host & Collaborator"
                  fill
                  sizes="56px"
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div>
                <h4 className="font-black text-sm text-white tracking-wide">Ved Krishna &amp; Production Team</h4>
                <p className="text-[11px] text-[#aeddd9] font-bold mt-0.5">Host, Producers &amp; Pakka Innovators</p>
              </div>
            </div>
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
                  className="group relative rounded-2xl p-4 sm:p-5 bg-[#013536] hover:bg-[#012627] border border-white/20 hover:border-[#aeddd9] transition-all duration-300 flex items-center justify-between gap-3 shadow-md hover:shadow-2xl hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#aeddd9] group-hover:text-[#013536] transition-all duration-300">
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
                  <span>Apply for Collaboration</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/about" className="sm:w-auto">
                <Button
                  variant="glass"
                  className="w-full sm:w-auto !h-12 sm:!h-14 !px-6 !text-xs sm:!text-sm bg-[#013536] hover:bg-[#012627] border-white/40 hover:border-white !text-white uppercase tracking-widest rounded-xl flex items-center justify-center font-bold shadow-lg"
                >
                  Meet our Team &amp; Host
                </Button>
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

