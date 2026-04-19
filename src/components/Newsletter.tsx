"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/Button";
import { DecorationTreeTwo } from "./ui/DecorationTreeTwo";
import { DecorationBush } from "./ui/DecorationBush";

export function Newsletter() {
  return (
    <section className="py-24 md:py-32 bg-[#B0DDD0] relative overflow-visible z-20">
      {/* 1. Soft Bubbly Wave Divider (Transition from Teal) */}
      <div className="absolute top-0 left-0 w-full -translate-y-[98%] pointer-events-none">
        <svg viewBox="0 0 1440 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 140L60 128.3C120 116.7 240 93.3 360 81.7C480 70 600 70 720 81.7C840 93.3 960 116.7 1080 122.5C1200 128.3 1320 116.7 1380 110.8L1440 105V140H1380C1320 140 1200 140 1080 140C960 140 840 140 720 140C600 140 480 140 360 140C240 140 120 140 60 140H0V140Z" fill="#B0DDD0" />
        </svg>
      </div>

      {/* 2. BOTANICAL ELEMENTS: Clustered species at the far left edge */}
      <DecorationTreeTwo className="top-0 left-[2%] -translate-y-[95%] w-14 md:w-28 z-50 rotate-[-5deg]" />
      <DecorationBush className="top-0 left-[8%] -translate-y-[85%] w-10 md:w-20 z-40 rotate-[5deg] opacity-70" />



      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
          <div className="max-w-xl space-y-4 text-center lg:text-left">
            <h2 className="text-4xl md:text-6xl font-serif text-black tracking-tighter leading-tight">
              Never Miss <br className="hidden md:block" /> an <span className="italic opacity-60">Episode</span>
            </h2>
            <p className="text-sm md:text-lg text-[#1C7767]/70 font-sans font-medium">
              Join 5,000+ sustainability enthusiasts. Get the latest episodes and creative waste solutions delivered to your inbox.
            </p>
          </div>
          <div className="w-full max-w-md">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="relative flex flex-row gap-2 p-1.5 md:p-2 bg-white/30 backdrop-blur-sm rounded-2xl md:rounded-full border border-white/50 shadow-xl items-center"
            >
              <input
                type="email"
                placeholder="yourname@email.com"
                className="flex-1 px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-full bg-white text-black font-sans text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#1C7767]/20 transition-all placeholder:text-black/30 min-w-0"
                required
              />
              <Button
                variant="accent"
                className="!px-4 md:!px-8 !h-10 md:!h-14 !text-[10px] md:!text-sm uppercase tracking-widest whitespace-nowrap !rounded-xl md:!rounded-full shrink-0"
              >
                Subscribe Now
              </Button>
            </form>

            <p className="mt-4 text-[10px] md:text-xs text-[#1C7767]/50 text-center lg:text-left">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
