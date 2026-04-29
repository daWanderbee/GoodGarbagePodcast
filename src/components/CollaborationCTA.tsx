"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "./ui/Button";
import { DecorationTree } from "./ui/DecorationTree";
import { DecorationTreeTwo } from "./ui/DecorationTreeTwo";
import { DecorationBush } from "./ui/DecorationBush";

export function CollaborationCTA() {
  return (
    <section className="py-24 md:py-32 bg-primary relative overflow-visible z-20">
      {/* 1. Large Smooth Arc Divider (Transition from beige) */}
      <div className="absolute top-0 left-0 w-full -translate-y-[98%] pointer-events-none">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          {/* Broad, gentle curve representing the 'land' peak */}
          <path d="M0 80C240 40 480 20 720 20C960 20 1200 40 1440 80V100H0V80Z" fill="#038f90" />
        </svg>
      </div>

      {/* 2. BOTANICAL ELEMENTS: Clustered species at the far edges */}
      <DecorationTreeTwo className="top-0 right-[5%] -translate-y-[95%] w-14 md:w-28 z-50 rotate-[4deg]" />
      <DecorationBush className="top-0 right-[2%] -translate-y-[85%] w-8 md:w-16 z-40 rotate-[15deg] opacity-60" />
      <DecorationTree className="top-0 left-[5%] -translate-y-[94%] w-8 md:w-16 z-50 rotate-[3deg] opacity-80" />
      <DecorationBush className="top-0 left-[8%] -translate-y-[85%] w-8 md:w-16 z-40 rotate-[-10deg] opacity-60" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-24">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="space-y-6 flex-1 text-left"
        >
          <div className="space-y-4">
            <div className="inline-block px-4 py-1 rounded-full border border-white/20 text-white text-[10px] uppercase font-black tracking-widest bg-white/5">
              Collaboration
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tighter leading-[1.1]">
              Want to be featured <br /> or <span className="italic font-normal text-white/50">collaborate?</span>
            </h2>
            <p className="text-md md:text-lg text-white/80 font-sans leading-relaxed max-w-lg">
              Share your story with our community. We're looking for guests, activists, and dreamers to build a brighter future together.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative shrink-0"
        >
          {/* Creative Button Wrapper */}
          <div className="absolute inset-0 bg-background/10 blur-2xl rounded-full" />
          <Link href="/contact" className="relative block group">
            <Button
              variant="accent"
              className="!px-10 !h-12 md:!h-16 !text-xs md:!text-base bg-white !text-[#038f90] hover:bg-[#aeddd9] transition-all duration-500 rounded-2xl group-hover:rotate-1 shadow-2xl"
            >
              Let's Talk Garbage
              <span className="ml-3 group-hover:translate-x-2 transition-transform duration-300">→</span>
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
