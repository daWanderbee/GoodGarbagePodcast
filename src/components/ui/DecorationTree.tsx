"use client";

import { motion } from "framer-motion";

interface DecorationTreeProps {
  className?: string;
}

export function DecorationTree({ className = "" }: DecorationTreeProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className={`absolute pointer-events-none z-50 ${className}`}
    >
      <svg width="80" height="160" viewBox="0 0 80 160" className="w-full h-full drop-shadow-lg">
        <rect x="36" y="100" width="9" height="60" fill="#d4c9b0" rx="2"></rect>
        <rect x="37" y="108" width="2" height="5" fill="#b8a890" rx="1"></rect>
        <rect x="41" y="118" width="2" height="5" fill="#b8a890" rx="1"></rect>
        <rect x="37" y="128" width="2" height="5" fill="#b8a890" rx="1"></rect>
        <ellipse cx="40" cy="72" rx="26" ry="36" fill="#3d7a4f"></ellipse>
        <ellipse cx="28" cy="84" rx="16" ry="22" fill="#336644"></ellipse>
        <ellipse cx="52" cy="80" rx="18" ry="24" fill="#4a8c5c"></ellipse>
        <ellipse cx="40" cy="52" rx="20" ry="28" fill="#4a8c5c"></ellipse>
        <ellipse cx="33" cy="62" rx="12" ry="18" fill="#5a9e6a"></ellipse>
      </svg>
    </motion.div>
  );
}
