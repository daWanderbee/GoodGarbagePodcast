"use client";

import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  accent?: string;
  subtitle?: string;
}

// Shared dark-teal page header — keeps the white navbar legible and sets the tone.
export function PageHero({ eyebrow, title, accent, subtitle }: PageHeroProps) {
  return (
    <section className="relative bg-[#038f90] px-6 md:px-12 pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center lg:text-left">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center lg:justify-start gap-2 mb-5 text-white/75"
        >
          <Leaf className="w-4 h-4" />
          <span className="uppercase text-[10px] md:text-[11px] tracking-[0.3em] font-bold font-sans">{eyebrow}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="text-4xl md:text-7xl font-serif text-white tracking-tighter leading-[0.95] drop-shadow-xl"
        >
          {title}
          {accent && <span className="italic text-white/60"> {accent}</span>}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 max-w-2xl mx-auto lg:mx-0 font-serif text-base md:text-xl leading-[1.6] text-white/90"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
