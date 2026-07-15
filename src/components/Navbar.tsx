"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X, Leaf } from "lucide-react";
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
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  // Hide the nav logo only over the home hero (top of page); the hero shows its own logo.
  const hideLogo = pathname === "/" && !isScrolled;
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  // Lock body scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const textColorClass = isScrolled ? "text-black" : "text-white";
  const borderColorClass = isScrolled ? "border-black" : "border-white";
  const bgIconClass = isScrolled ? "bg-black" : "bg-white";

  return (
    <>
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-[100] px-4 md:px-8 lg:px-10 py-4 flex items-center justify-between pointer-events-none transition-colors duration-300 font-bold ${textColorClass}`}
    >
      {/* Logo — hidden over the hero (top of page), shown once scrolled */}
      <Link
        href="/"
        aria-hidden={hideLogo}
        className={`group pointer-events-auto shrink-0 flex items-center transition-opacity duration-300 ${hideLogo ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <Image
          src="/images/logo.png"
          alt="Good Garbage Podcast"
          width={525}
          height={214}
          priority
          className={`h-7 md:h-9 w-auto transition-all duration-300 ${isScrolled ? "brightness-0" : "brightness-0 invert"}`}
        />
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
        <Link href="/contact">
          <Button
            variant="glass"
            className={`flex items-center gap-1.5 md:gap-2 !py-1.5 !px-3 md:!py-2 md:!px-4 !text-[9px] md:!text-xs h-7 md:h-9 lg:h-10 border-current font-black whitespace-nowrap transition-all duration-300 shadow-md hover:scale-105 ${textColorClass} ${borderColorClass}`}
          >
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#1DB954] animate-pulse shadow-[0_0_8px_#1DB954]" />
            <span>Collaborate with our Team</span>
          </Button>
        </Link>
        
        {/* Mobile/Tablet Menu Icon - Visible on all screens below xl */}
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="xl:hidden flex flex-col gap-1 p-2 shrink-0"
        >
          <div className={`w-5 h-[2px] transition-colors duration-300 ${bgIconClass}`} />
          <div className={`w-5 h-[2px] opacity-60 transition-colors duration-300 ${bgIconClass}`} />
          <div className={`w-5 h-[2px] opacity-40 transition-colors duration-300 ${bgIconClass}`} />
        </button>
      </div>
    </motion.nav>

    {/* Glass mobile drawer */}
    <AnimatePresence>
      {menuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-[110] bg-black/30 backdrop-blur-sm xl:hidden pointer-events-auto"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="fixed top-0 right-0 z-[120] h-full w-[80%] max-w-xs xl:hidden pointer-events-auto bg-[#038f90]/55 backdrop-blur-2xl border-l border-white/20 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/15">
              <Image
                src="/images/logo.png"
                alt="Good Garbage Podcast"
                width={525}
                height={214}
                className="h-7 w-auto brightness-0 invert"
              />
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="text-white/80 hover:text-white p-1">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col px-6 py-8 gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-3 font-serif text-2xl text-white/90 hover:text-white hover:translate-x-1 transition-all"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mt-auto px-6 py-8 border-t border-white/15">
              <Link href="/contact" onClick={() => setMenuOpen(false)}>
                <Button variant="glass" className="w-full flex items-center justify-center gap-2.5 !text-white border-white/40 !h-12 !text-xs font-black uppercase tracking-widest shadow-xl hover:bg-white/10">
                  <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse shadow-[0_0_8px_#1DB954]" />
                  ⚡ Collaborate with our Team
                </Button>
              </Link>
              <p className="mt-5 flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.25em] text-white/50">
                <Leaf className="w-3.5 h-3.5" /> A podcast by Pakka
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
    </>
  );
}
