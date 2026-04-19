"use client";

import { motion } from "framer-motion";

export function ScrollingMarquee() {
  const words = "Let's Talk Sustainability • ";
  const repeatedText = words.repeat(10);

  return (
    <div className="w-full bg-[#B0DDD0] relative z-[70]">
      {/* Surgical Addition: Small curve above to transition from the previous section */}
      <div className="absolute top-0 left-0 w-full -translate-y-[98%] pointer-events-none z-[60]">
        <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 40C360 0 1080 0 1440 40V40H0V40Z" fill="#B0DDD0" />
        </svg>
      </div>

      <div className="w-full py-6 md:py-10 overflow-hidden">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex whitespace-nowrap relative z-[70]"
        >
          <span className="text-4xl md:text-5xl font-serif font-black text-black uppercase px-4 tracking-tighter">
            {repeatedText}{repeatedText}
          </span>
        </motion.div>
      </div>

      {/* SUBTLE SPROUTING CURVE: Light Green bulge into the next section */}
      <div className="absolute bottom-0 left-0 w-full translate-y-[99%] pointer-events-none z-[60]">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path 
            d="M0 0C160 45 320 45 480 25C640 5 800 65 960 25C1120 -15 1280 45 1440 0H0Z" 
            fill="#B0DDD0" 
          />
        </svg>
      </div>



    </div>

  );
}
