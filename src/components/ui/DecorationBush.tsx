"use client";

import { motion } from "framer-motion";

interface DecorationBushProps {
  className?: string;
}

export function DecorationBush({ className = "" }: DecorationBushProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1 }}
      viewport={{ once: true }}
      className={`absolute pointer-events-none z-40 ${className}`}
    >
      <svg width="100" height="100" viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        <ellipse cx="50" cy="72" rx="46" ry="22" fill="#2d6644"></ellipse>
        <ellipse cx="22" cy="60" rx="22" ry="28" fill="#3d7a4f"></ellipse>
        <ellipse cx="78" cy="58" rx="20" ry="26" fill="#336644"></ellipse>
        <ellipse cx="50" cy="48" rx="28" ry="30" fill="#4a8c5c"></ellipse>
        <ellipse cx="35" cy="55" rx="18" ry="22" fill="#5a9e6a"></ellipse>
        <ellipse cx="64" cy="52" rx="16" ry="20" fill="#5a9e6a"></ellipse>
        <ellipse cx="50" cy="38" rx="20" ry="22" fill="#4a8c5c"></ellipse>
      </svg>
    </motion.div>
  );
}
