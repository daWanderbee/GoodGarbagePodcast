"use client";

import { motion, useScroll, useTransform } from "framer-motion";
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
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full z-[100] px-6 py-4 md:px-12 flex items-center justify-between pointer-events-none text-black font-black"
    >
      {/* Logo */}
      <Link href="/" className="group pointer-events-auto">
        <span className="font-serif text-xl md:text-2xl tracking-tighter">
          Good <span className="opacity-60 group-hover:opacity-100 transition-opacity">Garbage</span>
        </span>
      </Link>

      {/* Menu Links */}
      <div className="hidden md:flex items-center gap-8 pointer-events-auto">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
          >
            <span className="text-[11px] uppercase tracking-[0.25em] opacity-100 hover:opacity-60 transition-all cursor-pointer">
              {link.name}
            </span>
          </Link>
        ))}
      </div>

      {/* CTA Button */}
      <div className="flex items-center gap-6 pointer-events-auto">
        <Button 
          variant="glass" 
          className="hidden sm:flex !py-2 !px-6 !text-[10px] h-10 border-black font-black text-black"
        >
          Listen Now
        </Button>
        
        {/* Mobile Menu Icon */}
        <button className="md:hidden flex flex-col gap-1.5 p-2">
          <div className="w-6 h-[2px] bg-black" />
          <div className="w-6 h-[2px] bg-black opacity-60" />
        </button>
      </div>
    </motion.nav>
  );
}
