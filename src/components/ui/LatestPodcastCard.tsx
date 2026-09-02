"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Leaf, Play } from "lucide-react";
import { shortTitle, watchUrl, type Episode } from "@/lib/feed";

interface LatestPodcastCardProps {
  className?: string;
  latest: Episode;
}

// Hero "latest episode" card styled as a piece of compostable packaging —
// recycled-paper cream + a stamped certification seal (the signature element).
export function LatestPodcastCard({ className = "", latest }: LatestPodcastCardProps) {
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
          src={latest.thumbnail || "/images/episodes/latest.png"}
          alt={latest.title}
          fill
          sizes="330px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/25" />
        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.15em] text-[#0d6e4e]">
          <Leaf className="h-3 w-3" /> Latest Episode
        </span>
        <a
          href={watchUrl(latest)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Watch the latest episode on YouTube"
          className="absolute bottom-3 right-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#0d6e4e] text-white shadow-lg transition-transform group-hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <Play className="ml-0.5 h-5 w-5 fill-current" />
        </a>
      </div>

      {/* Meta */}
      <p className="mb-1 font-sans text-[10px] font-black uppercase tracking-[0.25em] text-[#636b58]">
        {latest.ep ? `Episode ${latest.ep}` : latest.date}
      </p>
      <h3 className="font-serif text-2xl leading-[1.05] tracking-tight text-[#038f90]">
        {latest.title.split(/\s+(?:with|With|\|)\s+/)[0]}
      </h3>

      <div className="mt-3 flex items-center justify-between border-t border-dashed border-[#0d6e4e]/20 pt-3">
        <span className="font-sans text-xs font-bold text-[#636b58]">{latest.guest}</span>
        <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#038f90]/50">{latest.duration}</span>
      </div>
    </motion.div>
  );
}
