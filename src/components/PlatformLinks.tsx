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
  { name: "Spotify", icon: <Music size={24} />, color: "#1DB954" },
  { name: "Apple Podcasts", icon: <Podcast size={24} />, color: "#A341FF" },
  { name: "YouTube", icon: <Youtube size={24} />, color: "#FF0000" },
  { name: "Amazon Music", icon: <Play size={24} />, color: "#00A8E1" },
];

export function PlatformLinks() {
  return (
    <div className="relative w-full bg-[#0A2F28] py-20 overflow-hidden border-t border-white/5">
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
        <h2 className="text-2xl md:text-3xl font-serif tracking-tighter text-white">
          Listen on <span className="opacity-40 italic ml-2 text-white/70">Platforms</span>
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
                <p className="text-[10px] md:text-[11px] font-bold text-white tracking-wide">{platform.name}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
