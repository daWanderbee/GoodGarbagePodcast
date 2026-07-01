"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "./ui/Button";


export function CollaborationCTA() {
  return (
    <section className="pt-24 md:pt-32 pb-0 bg-primary relative overflow-hidden z-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-16 md:pb-24 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-24">
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

      {/* Wave: Teal (#038f90) -> Mint (#d4eedf) */}
      <div className="w-full block leading-none bg-[#038f90]">
        <svg className="w-full h-12 md:h-20 block" viewBox="0 0 1440 80" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 C320,80 640,10 960,60 C1200,80 1350,20 1440,45 L1440,80 L0,80 Z" fill="#d4eedf" />
        </svg>
      </div>
    </section>
  );
}
