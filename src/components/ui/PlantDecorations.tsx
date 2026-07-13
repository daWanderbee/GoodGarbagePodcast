"use client";

import { motion } from "framer-motion";

interface DecorationProps {
  className?: string;
  rotate?: number;
}

// ponytail: flat multi-shape SVGs in the same palette as the tree decorations —
// simple clip-art style, not photo cutouts. rotate is baked into the animation
// because framer-motion owns the transform (a tailwind rotate-* class won't stick).

const reveal = (rotate: number) => ({
  initial: { opacity: 0, scale: 0.8, y: 20, rotate },
  whileInView: { opacity: 1, scale: 1, y: 0, rotate },
  transition: { duration: 0.8 },
  viewport: { once: true },
});

export function DecorationMushroom({ className = "", rotate = 0 }: DecorationProps) {
  return (
    <motion.div {...reveal(rotate)} className={`absolute pointer-events-none z-50 ${className}`}>
      <svg width="100" height="120" viewBox="0 0 100 120" className="w-full h-full drop-shadow-lg">
        {/* stem */}
        <path d="M40 58 h20 v36 a10 12 0 0 1 -20 0 z" fill="#f0e6d2" />
        {/* gills under the cap */}
        <ellipse cx="50" cy="60" rx="42" ry="8" fill="#c9744a" />
        {/* cap dome */}
        <path d="M8 62 a42 40 0 0 1 84 0 z" fill="#e0855a" />
        {/* spots */}
        <ellipse cx="34" cy="42" rx="8" ry="6" fill="#fbeee0" />
        <ellipse cx="60" cy="34" rx="6" ry="5" fill="#fbeee0" />
        <ellipse cx="70" cy="50" rx="5" ry="4" fill="#fbeee0" />
      </svg>
    </motion.div>
  );
}

export function DecorationSugarcane({ className = "", rotate = 0 }: DecorationProps) {
  return (
    <motion.div {...reveal(rotate)} className={`absolute pointer-events-none z-50 ${className}`}>
      <svg width="90" height="180" viewBox="0 0 90 180" className="w-full h-full drop-shadow-lg">
        {/* long blade leaves */}
        <path d="M46 66 C18 46 8 24 30 8 C40 32 54 50 46 66 Z" fill="#4a8c5c" />
        <path d="M46 66 C74 46 84 24 62 8 C52 32 38 50 46 66 Z" fill="#3d7a4f" />
        <path d="M46 78 C22 62 12 40 32 26 C42 48 56 64 46 78 Z" fill="#5a9e6a" />
        {/* stalks */}
        <rect x="36" y="60" width="11" height="118" rx="5.5" fill="#6ab07a" />
        <rect x="49" y="70" width="9" height="108" rx="4.5" fill="#5a9e6a" />
        {/* node lines */}
        <line x1="36" y1="92" x2="47" y2="92" stroke="#3d7a4f" strokeWidth="3" />
        <line x1="36" y1="120" x2="47" y2="120" stroke="#3d7a4f" strokeWidth="3" />
        <line x1="36" y1="148" x2="47" y2="148" stroke="#3d7a4f" strokeWidth="3" />
        <line x1="49" y1="100" x2="58" y2="100" stroke="#3d7a4f" strokeWidth="3" />
        <line x1="49" y1="132" x2="58" y2="132" stroke="#3d7a4f" strokeWidth="3" />
        <line x1="49" y1="162" x2="58" y2="162" stroke="#3d7a4f" strokeWidth="3" />
      </svg>
    </motion.div>
  );
}

// A field of tilted plants spread across the parent. Drop into any `relative`
// section. Set `tone="light"` on light backgrounds to dial opacity down a touch.
// mushrooms only, spaced so they never overlap
const SCATTER = [
  { C: DecorationMushroom, pos: "left-[5%] top-[10%]",      size: "w-20 h-24 md:w-28 md:h-32", rot: -16 },
  { C: DecorationMushroom, pos: "right-[6%] top-[12%]",     size: "w-16 h-20 md:w-24 md:h-28", rot: 18 },
  { C: DecorationMushroom, pos: "left-[10%] bottom-[8%]",   size: "w-16 h-20 md:w-24 md:h-28", rot: 12 },
] as const;

export function PlantScatter({ tone = "dark", max = SCATTER.length }: { tone?: "dark" | "light"; max?: number }) {
  const opacity = tone === "light" ? "opacity-60" : "opacity-70";
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${opacity}`}>
      {SCATTER.slice(0, max).map(({ C, pos, size, rot }, i) => (
        <C key={i} rotate={rot} className={`${pos} ${size}`} />
      ))}
    </div>
  );
}

export function DecorationSeaweed({ className = "", rotate = 0 }: DecorationProps) {
  return (
    <motion.div {...reveal(rotate)} className={`absolute pointer-events-none z-50 ${className}`}>
      <svg width="100" height="140" viewBox="0 0 100 140" className="w-full h-full drop-shadow-lg">
        <path d="M30 138 C22 100 40 96 30 60 C26 38 40 26 34 8" fill="none" stroke="#3d7a4f" strokeWidth="10" strokeLinecap="round" />
        <path d="M52 138 C46 90 58 84 50 48 C46 28 56 18 52 6" fill="none" stroke="#4a8c5c" strokeWidth="12" strokeLinecap="round" />
        <path d="M70 138 C64 104 78 96 70 66 C66 46 76 38 72 22" fill="none" stroke="#5a9e6a" strokeWidth="9" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
}
