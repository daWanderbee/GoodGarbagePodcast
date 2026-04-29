"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "glass" | "accent";

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export function Button({ 
  children, 
  variant = "primary", 
  onClick, 
  className = "", 
  icon,
  fullWidth = false
}: ButtonProps) {
  
  const variants = {
    primary: "bg-primary text-white hover:bg-opacity-90 shadow-lg",
    secondary: "bg-secondary text-white hover:bg-opacity-90 shadow-md",
    accent: "bg-accent text-white hover:brightness-110 shadow-xl",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    ghost: "text-primary hover:bg-primary/5",
    glass: "bg-white/10 backdrop-blur-md border border-white/20 text-black hover:bg-white/20 shadow-xl"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98, y: 0 }}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-3 px-8 py-4 
        rounded-full font-sans font-bold uppercase tracking-wider text-xs md:text-sm
        transition-all duration-300 ease-out
        ${variants[variant]}
        ${fullWidth ? "w-full" : "w-fit"}
        ${className}
      `}
    >
      {children}
      {icon && <span className="opacity-80 group-hover:translate-x-1 transition-transform">{icon}</span>}
    </motion.button>
  );
}
