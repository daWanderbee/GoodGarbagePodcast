"use client";

import Link from "next/link";
import { Youtube, Music, Podcast, Play, Instagram, Twitter } from "lucide-react";

const footerLinks = {
  podcast: [
    { name: "Spotify", href: "#", icon: <Music size={16} /> },
    { name: "Apple Podcasts", href: "#", icon: <Podcast size={16} /> },
    { name: "YouTube", href: "#", icon: <Youtube size={16} /> },
    { name: "Amazon Music", href: "#", icon: <Play size={16} /> },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "#" },
    { name: "Press Kit", href: "#" },
    { name: "Contact", href: "/contact" },
  ],
  resources: [
    { name: "Episodes", href: "/episodes" },
    { name: "Guest Guide", href: "#" },
    { name: "Media Assets", href: "#" },
    { name: "Newsletter", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#B0DDD0] pt-20 pb-10 px-6 md:px-12 border-t border-black/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 mb-20">
          {/* Logo Section */}
          <div className="space-y-6">
            <Link href="/" className="group inline-block">
              <span className="font-serif text-2xl md:text-3xl tracking-tighter text-black">
                Good <span className="opacity-60 group-hover:opacity-100 transition-opacity underline decoration-1 underline-offset-4">Garbage</span>
              </span>
            </Link>
            <p className="text-sm text-black/60 max-w-xs font-sans leading-relaxed">
              Exploring the beauty in the discarded and the value in the "messy" side of sustainability.
            </p>
            <div className="flex items-center gap-4 text-black/40">
              <Link href="#" className="hover:text-black transition-colors"><Instagram size={20} /></Link>
              <Link href="#" className="hover:text-black transition-colors"><Twitter size={20} /></Link>
            </div>
          </div>

          {/* Podcast Links */}
          <div className="space-y-6">
            <h4 className="text-[10px] uppercase font-black tracking-[0.3em] text-black opacity-40">Podcast Channels</h4>
            <ul className="space-y-3">
              {footerLinks.podcast.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="flex items-center gap-3 text-[11px] uppercase tracking-widest text-black font-black hover:opacity-60 transition-opacity">
                    <span className="opacity-40">{link.icon}</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-6">
            <h4 className="text-[10px] uppercase font-black tracking-[0.3em] text-black opacity-40">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[11px] uppercase tracking-widest text-black font-black hover:opacity-60 transition-opacity block">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resource Links */}
          <div className="space-y-6">
            <h4 className="text-[10px] uppercase font-black tracking-[0.3em] text-black opacity-40">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[11px] uppercase tracking-widest text-black font-black hover:opacity-60 transition-opacity block">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[9px] uppercase tracking-[0.2em] font-bold text-black/40">
          <p>© 2024 Good Garbage Podcast. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <Link href="#" className="hover:text-black transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-black transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
