"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/Button";

export function LatestEpisode() {
  return (
    <section className="relative w-full py-24 md:py-32 bg-[#d4eedf] flex items-center justify-center p-6 md:p-12 overflow-hidden rounded-t-[40px] md:rounded-t-[80px] -mt-12 md:-mt-20 z-[30]">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center text-[#038f90]">

        {/* Left Side: Large Title and Featured Image */}
        <div className="space-y-8 md:space-y-12">
          <div className="relative">
            <h2 className="text-4xl md:text-8xl font-serif leading-[0.9] tracking-tighter text-[#038f90]">
              Latest <br /> <span className="opacity-40 italic">Episode</span>
            </h2>
          </div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative aspect-video lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl group"
          >
            <Image
              src="/images/episodes/latest.png"
              alt="Latest Episode Thumbnail"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </motion.div>
        </div>

        {/* Right Side: Content and CTA */}
        <div className="space-y-8 lg:pt-24">
          <div className="space-y-4 md:space-y-6">
            <div className="inline-block px-3 py-1 rounded-full border border-[#038f90]/20 text-[10px] uppercase font-black tracking-widest bg-[#038f90]/5">
              New Release
            </div>
            <h3 className="text-3xl md:text-6xl font-serif leading-tight tracking-tight text-[#038f90]">
              The Hidden Value <br /> of <span className="italic opacity-60">Waste</span>
            </h3>
            <p className="text-sm md:text-xl text-[#038f90]/80 leading-relaxed max-w-lg font-sans">
              Exploring how discarded materials can be transformed into high-value resources and sustainable creative solutions.
            </p>
          </div>

          <div className="space-y-6 pt-8 border-t border-[#038f90]/10">
            <div className="flex items-center gap-12 md:gap-16">
              <div>
                <p className="text-[10px] uppercase font-bold text-[#038f90]/40 mb-2 tracking-widest">Guest</p>
                <p className="text-sm md:text-lg font-black text-[#038f90]">Dr. Sarah Jenkins</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-[#038f90]/40 mb-2 tracking-widest">Duration</p>
                <p className="text-sm md:text-lg font-black text-[#038f90]">45 mins</p>
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Button 
                variant="accent" 
                className="!px-10 !h-14 md:!h-16 !text-xs md:!text-sm uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all bg-[#038f90] !text-white"
              >
                Play Episode
                <span className="ml-3">▶</span>
              </Button>
              
              <Link href="/episodes">
                <Button 
                  variant="outline" 
                  className="!px-10 !h-14 md:!h-16 !text-xs md:!text-sm border-[#038f90]/30 text-[#038f90] hover:bg-[#038f90]/5 uppercase tracking-widest"
                >
                  View All Episodes
                </Button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
