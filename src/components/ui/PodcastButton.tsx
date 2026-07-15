"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

interface PodcastButtonProps {
  episodeName: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PodcastButton({ episodeName, size = "md", className = "" }: PodcastButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`group inline-flex items-center justify-between gap-3.5 bg-white hover:bg-[#f2ede4] text-[#038f90] rounded-full px-6 h-13 sm:h-14 md:h-15 shadow-2xl border border-white/80 transition-all duration-300 ${className}`}
    >
      {/* Solid teal play circle with crisp white triangle icon */}
      <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#038f90] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 group-hover:bg-[#024a4b] transition-all">
        <Play className="w-4 h-4 md:w-4.5 md:h-4.5 fill-current ml-0.5" />
      </div>

      {/* Episode Title & Label */}
      <div className="flex flex-col items-start leading-tight text-left min-w-0 pr-1">
        <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] opacity-65 font-black mb-0.5 text-[#038f90]">
          Latest Episode
        </span>
        <span className="text-sm md:text-base font-bold text-[#038f90] tracking-tight truncate max-w-[150px] sm:max-w-[200px]">
          {episodeName}
        </span>
      </div>

      {/* Visual Soundwave separator & animation */}
      <div className="flex items-center gap-[3px] h-5 pl-3 border-l border-[#038f90]/15 shrink-0 ml-auto">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            animate={{ height: ["30%", "100%", "30%"] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}
            className="w-[2.5px] bg-[#038f90] rounded-full opacity-70"
          />
        ))}
      </div>
    </motion.button>
  );
}
