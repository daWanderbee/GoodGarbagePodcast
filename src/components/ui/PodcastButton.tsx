"use client";

import { motion } from "framer-motion";

interface PodcastButtonProps {
  episodeName: string;
}

export function PodcastButton({ episodeName }: PodcastButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="mt-6 flex items-center gap-3 bg-[#136B46] text-white px-5 py-2.5 rounded-full shadow-2xl h-11"
    >
      <div className="w-7 h-7 flex items-center justify-center bg-white/20 rounded-full">
        <div className="w-0 h-0 border-l-[8px] border-l-white border-y-[5px] border-y-transparent ml-1" />
      </div>
      <div className="flex flex-col items-start leading-none text-left">
        <span className="text-[8px] uppercase tracking-widest opacity-60 font-bold mb-1">Latest Episode</span>
        <span className="text-[13px] font-bold truncate max-w-[150px] md:max-w-[200px]">{episodeName}</span>
      </div>
      
      {/* Visual Soundwave */}
      <div className="flex items-center gap-[3px] h-4 ml-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            animate={{ height: ["40%", "100%", "40%"] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
            className="w-[3px] bg-white rounded-full opacity-50"
          />
        ))}
      </div>
    </motion.button>
  );
}
