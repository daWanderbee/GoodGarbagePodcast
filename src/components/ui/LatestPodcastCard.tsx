"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Leaf, Play } from "lucide-react";

interface LatestPodcastCardProps {
  className?: string;
}

// Hero "latest episode" card styled as a piece of compostable packaging —
// recycled-paper cream + a stamped certification seal (the signature element).
export function LatestPodcastCard({ className = "" }: LatestPodcastCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className={`w-[380px] max-w-[calc(100vw-2.5rem)] rounded-[28px] bg-[#f2ede4] p-5 shadow-2xl ring-1 ring-[#0d6e4e]/10 ${className}`}
    >
      {/* Brand header */}
      <div className="mb-3 flex items-center gap-2 px-1">
        <Leaf className="h-4 w-4 text-[#0d6e4e]" />
        <span className="font-serif text-base tracking-tight text-[#038f90]">Good Garbage Podcast</span>
      </div>

      {/* Thumbnail: recycled glass + regrowth (garbage made beautiful) */}
      <div className="group relative mb-4 aspect-[16/10] overflow-hidden rounded-2xl">
        <Image
          src="/images/episodes/latest.png"
          alt="Latest episode artwork"
          fill
          sizes="330px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/25" />
        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.15em] text-[#0d6e4e]">
          <Leaf className="h-3 w-3" /> Latest Episode
        </span>
        <button
          aria-label="Play latest episode"
          className="absolute bottom-3 right-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#0d6e4e] text-white shadow-lg transition-transform group-hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <Play className="ml-0.5 h-5 w-5 fill-current" />
        </button>
      </div>

      {/* Meta */}
      <p className="mb-1 font-sans text-[10px] font-black uppercase tracking-[0.25em] text-[#636b58]">
        Episode 49
      </p>
      <h3 className="font-serif text-2xl leading-[1.05] tracking-tight text-[#038f90]">
        The Hidden Value of <span className="italic opacity-60">Waste</span>
      </h3>

      <div className="mt-3 flex items-center justify-between border-t border-dashed border-[#0d6e4e]/20 pt-3">
        <span className="font-sans text-xs font-bold text-[#636b58]">Dr. Sarah Jenkins</span>
        <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#038f90]/50">45 min</span>
      </div>
    </motion.div>
  );
}
