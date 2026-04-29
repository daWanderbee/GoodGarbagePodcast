"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { Button } from "./ui/Button";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Episodes", href: "/episodes" },
  { name: "About", href: "/about" },
  { name: "Guests", href: "/guests" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  const textColorClass = isScrolled ? "text-black" : "text-white";
  const borderColorClass = isScrolled ? "border-black" : "border-white";
  const bgIconClass = isScrolled ? "bg-black" : "bg-white";

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-[100] px-4 md:px-8 lg:px-10 py-4 flex items-center justify-between pointer-events-none transition-colors duration-300 font-bold ${textColorClass}`}
    >
      {/* Logo */}
      <Link href="/" className="group pointer-events-auto shrink-0 flex items-center">
        <span className="font-serif text-lg md:text-xl tracking-tighter">
          Good <span className="opacity-60 group-hover:opacity-100 transition-opacity">Garbage</span>
        </span>
      </Link>

      {/* Menu Links - Using xl for safer horizontal space */}
      <div className="hidden xl:flex items-center gap-4 xl:gap-6 pointer-events-auto">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
          >
            <span className="text-[10px] uppercase tracking-[0.15em] opacity-80 hover:opacity-100 transition-all cursor-pointer whitespace-nowrap">
              {link.name}
            </span>
          </Link>
        ))}
      </div>

      {/* CTA Button & Mobile Trigger */}
      <div className="flex items-center gap-2 md:gap-4 pointer-events-auto">
        <Button 
          variant="glass" 
          className={`hidden md:flex !py-2 !px-4 !text-[9px] h-8 lg:h-9 border-current font-black whitespace-nowrap transition-colors duration-300 ${textColorClass} ${borderColorClass}`}
        >
          Listen Now
        </Button>
        
        {/* Mobile/Tablet Menu Icon - Visible on all screens below xl */}
        <button className="xl:hidden flex flex-col gap-1 p-2 shrink-0">
          <div className={`w-5 h-[2px] transition-colors duration-300 ${bgIconClass}`} />
          <div className={`w-5 h-[2px] opacity-60 transition-colors duration-300 ${bgIconClass}`} />
          <div className={`w-5 h-[2px] opacity-40 transition-colors duration-300 ${bgIconClass}`} />
        </button>
      </div>
    </motion.nav>
  );
}
