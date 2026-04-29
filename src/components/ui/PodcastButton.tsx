"use client";

import { motion } from "framer-motion";

interface PodcastButtonProps {
  episodeName: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PodcastButton({ episodeName, size = "md", className = "" }: PodcastButtonProps) {
  const sizeClasses = {
    sm: "px-3 py-1.5 h-10 md:h-12",
    md: "px-5 py-2.5 h-12",
    lg: "px-6 py-4 h-14 lg:h-16"
  };

  const textClasses = {
    sm: "text-[11px]",
    md: "text-[13px]",
    lg: "text-base"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-3 bg-white text-[#038f90] rounded-full shadow-2xl ${sizeClasses[size]} ${className}`}
    >
      <div className={`${size === "sm" ? "w-6 h-6" : "w-7 h-7"} flex items-center justify-center bg-[#038f90]/10 rounded-full shrink-0`}>
        <div className={`w-0 h-0 border-l-[8px] border-l-[#038f90] border-y-[5px] border-y-transparent ${size === "sm" ? "ml-1" : "ml-1"}`} />
      </div>
      <div className="flex flex-col items-start leading-none text-left">
        <span className={`${size === "sm" ? "text-[7px]" : "text-[8px]"} uppercase tracking-widest opacity-60 font-bold mb-1`}>Latest Episode</span>
        <span className={`${textClasses[size]} font-bold truncate max-w-[120px] md:max-w-[200px]`}>{episodeName}</span>
      </div>

      
      {/* Visual Soundwave */}
      <div className={`flex items-center gap-[3px] ${size === "sm" ? "h-3" : "h-4"} ml-2`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            animate={{ height: ["40%", "100%", "40%"] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
            className={`${size === "sm" ? "w-[2px]" : "w-[3px]"} bg-[#038f90] rounded-full opacity-50`}
          />
        ))}
      </div>

    </motion.button>
  );
}
