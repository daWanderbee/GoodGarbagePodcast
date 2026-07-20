"use client";

import { motion, useTransform, MotionValue } from "framer-motion";
import Image from "next/image";
import { Youtube, Music, Podcast, Play } from "lucide-react";
import { Button } from "./ui/Button";


interface PlatformLinksProps {
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
}

const platforms = [
  { name: "YouTube", icon: <Youtube size={24} />, color: "#FF0000" },
  { name: "Spotify", icon: <Music size={24} />, color: "#1DB954" },
  { name: "Apple Podcasts", icon: <Podcast size={24} />, color: "#A341FF" },
  { name: "Amazon Music", icon: <Play size={24} />, color: "#00A8E1" },
];

export function PlatformLinks() {
  return (
    <div className="relative w-full bg-[#1a4d34] py-24 md:py-32 overflow-visible">

      {/* Watercolor Texture Overlay */}
      <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-soft-light">
        <Image
          src="/images/textures/watercolor.png"
          alt="Watercolor Paper Texture"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      <div className="max-w-6xl w-full mx-auto flex flex-col items-center text-center space-y-12 relative z-10 px-6">
        <h2 className="text-2xl md:text-3xl font-serif tracking-tighter text-[#d4eedf]">
          Listen <span className="opacity-40 italic ml-2 text-white/70">wherever you already listen</span>
        </h2>

        <div className="flex flex-row items-center justify-center gap-6 md:gap-16 w-full overflow-x-auto pb-4 no-scrollbar">
          {platforms.map((platform) => (
            <motion.a
              key={platform.name}
              href="#"
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-3 cursor-pointer group no-underline min-w-max"
            >
              <div className="text-white/60 group-hover:text-white transition-all duration-500 scale-100 md:scale-125">
                {platform.icon}
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] md:text-[11px] font-bold text-[#d4eedf] tracking-wide">{platform.name}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Mint footer curve rising into the dark platforms (matches the site's light-into-dark transitions) */}
      <div className="absolute bottom-0 left-0 w-full translate-y-[3px] pointer-events-none z-[20] leading-none">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
          <path d="M0 60 C240 15 480 15 720 30 C960 45 1200 15 1440 60 L1440 60 L0 60 Z" fill="#d4eedf" />
        </svg>
      </div>
    </div>
  );
}
