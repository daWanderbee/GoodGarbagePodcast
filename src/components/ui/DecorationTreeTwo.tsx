"use client";

import { motion } from "framer-motion";

interface DecorationTreeTwoProps {
  className?: string;
}

export function DecorationTreeTwo({ className = "" }: DecorationTreeTwoProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className={`absolute pointer-events-none z-50 ${className}`}
    >
      <svg width="100" height="140" viewBox="0 0 100 140" className="w-full h-full drop-shadow-xl">
        <rect x="44" y="95" width="12" height="45" fill="#b09070" rx="2"></rect>
        <line x1="50" y1="95" x2="26" y2="75" stroke="#b09070" strokeWidth="5" strokeLinecap="round"></line>
        <line x1="50" y1="95" x2="74" y2="72" stroke="#b09070" strokeWidth="5" strokeLinecap="round"></line>
        <ellipse cx="50" cy="65" rx="44" ry="32" fill="#4a8c5c"></ellipse>
        <ellipse cx="24" cy="72" rx="22" ry="20" fill="#3d7a4f"></ellipse>
        <ellipse cx="76" cy="68" rx="20" ry="18" fill="#3d7a4f"></ellipse>
        <ellipse cx="50" cy="48" rx="28" ry="22" fill="#5a9e6a"></ellipse>
        <ellipse cx="36" cy="58" rx="16" ry="14" fill="#5a9e6a"></ellipse>
        <ellipse cx="62" cy="55" rx="14" ry="12" fill="#4a8c5c"></ellipse>
      </svg>
    </motion.div>
  );
}
