"use client";

import Link from "next/link";
import { Youtube, Music, Podcast, Play, Instagram, Linkedin } from "lucide-react";
import { CHANNEL_URL } from "@/lib/youtube";

// Nothing in this footer is allowed to be a "#".
//
// It previously shipped eleven of them — Spotify, Apple, Amazon, Guest Guide, Media Assets,
// Newsletter, Instagram, Twitter, Privacy, Terms — every one of which looked like a link and
// went nowhere. A dead link costs more trust than a missing one, so anything without a real
// destination is simply absent until someone supplies the URL.
//
// To restore one: put its URL in the entry below and it appears. There is no other step.
const SOCIALS: { name: string; href: string; icon: React.ReactNode }[] = [
  { name: "Instagram", href: "https://www.instagram.com/goodgarbagepodcast/", icon: <Instagram size={20} /> },
  { name: "LinkedIn", href: "https://www.linkedin.com/showcase/goodgarbagepodcast/", icon: <Linkedin size={20} /> },
];

const LISTEN: { name: string; href: string; icon: React.ReactNode }[] = [
  { name: "YouTube", href: CHANNEL_URL, icon: <Youtube size={16} /> },
  { name: "Spotify", href: "https://open.spotify.com/show/5F6NiNSdyoLBsl0H42sqyY", icon: <Music size={16} /> },
  {
    name: "Apple Podcasts",
    href: "https://podcasts.apple.com/us/podcast/good-garbage-with-ved-krishna/id1613337676",
    icon: <Podcast size={16} />,
  },
  { name: "Amazon Music", href: "https://music.amazon.com/podcasts/6a28536b-c1b5-4d1a-8381-87a61799189a/good-garbage-with-ved-krishna", icon: <Play size={16} /> },
];

const EXPLORE: { name: string; href: string }[] = [
  { name: "Episodes", href: "/episodes" },
  { name: "Guests", href: "/guests" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Footer() {
  const socials = SOCIALS.filter((s) => s.href);

  return (
    <footer className="bg-[#d4eedf] relative pt-16 pb-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24 mb-20">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="group inline-block">
              <span className="font-serif text-2xl md:text-3xl tracking-tighter text-[#038f90]">
                Good <span className="opacity-60 group-hover:opacity-100 transition-opacity underline decoration-1 underline-offset-4">Garbage</span>
              </span>
            </Link>
            <p className="text-sm text-[#038f90]/60 max-w-xs font-sans leading-relaxed">
              Exploring the beauty in the discarded.
            </p>
            {socials.length > 0 && (
              <div className="flex items-center gap-4 text-[#038f90]/40">
                {socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="hover:text-[#038f90] transition-colors"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Listen */}
          <div className="space-y-6">
            <h4 className="text-[10px] uppercase font-black tracking-[0.3em] text-[#038f90] opacity-40">Listen</h4>
            <ul className="space-y-3">
              {LISTEN.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-[11px] uppercase tracking-widest text-[#038f90] font-black hover:opacity-60 transition-opacity"
                  >
                    <span className="opacity-40">{link.icon}</span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div className="space-y-6">
            <h4 className="text-[10px] uppercase font-black tracking-[0.3em] text-[#038f90] opacity-40">Explore</h4>
            <ul className="space-y-3">
              {EXPLORE.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[11px] uppercase tracking-widest text-[#038f90] font-black hover:opacity-60 transition-opacity block">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#038f90]/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[9px] uppercase tracking-[0.2em] font-bold text-[#038f90]/40">
          <p>© 2026 Good Garbage Podcast · An initiative by Pakka Limited</p>
        </div>
      </div>
    </footer>
  );
}
