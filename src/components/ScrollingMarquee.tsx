"use client";

import { motion } from "framer-motion";

export function ScrollingMarquee() {
  const words = "Let's Talk Sustainability • ";
  const repeatedText = words.repeat(10);

  return (
    <div className="w-full bg-[#d4eedf] relative z-[70]">
      {/* Remove previous top curve as it's now matching the above section */}

      <div className="w-full py-6 md:py-10 overflow-hidden">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex whitespace-nowrap relative z-[70]"
        >
          <span className="text-4xl md:text-5xl font-serif font-black text-[#038f90] uppercase px-4 tracking-tighter opacity-80">
            {repeatedText}{repeatedText}
          </span>
        </motion.div>
      </div>

      {/* SUBTLE SPROUTING CURVE: Now using the matching light green to bulge into the next section */}
      <div className="absolute bottom-0 left-0 w-full translate-y-[99%] pointer-events-none z-[60]">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path 
            d="M0 0C160 45 320 45 480 25C640 5 800 65 960 25C1120 -15 1280 45 1440 0H0Z" 
            fill="#d4eedf" 
          />
        </svg>
      </div>



    </div>

  );
}
