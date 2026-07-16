"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Footer } from "@/components/Footer";
import { CollaborationCTA } from "@/components/CollaborationCTA";
import { DecorationBush } from "@/components/ui/DecorationBush";
import { DecorationTree } from "@/components/ui/DecorationTree";
import { DecorationTreeTwo } from "@/components/ui/DecorationTreeTwo";
import { EPISODES, Episode } from "@/lib/episodes";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
}

// Brand palette tints for circular profile pics
const avatarTints = ["#0d6e4e", "#038f90", "#636b58", "#b06a2c"];

function GuestCard({ guest, index }: { guest: Episode; index: number }) {
  const tint = avatarTints[index % avatarTints.length];

  return (
    <motion.article
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
      className="group flex flex-col items-center text-center rounded-[32px] bg-white p-8 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-black/5 h-full"
    >
      {/* Just a circular profile pic */}
      <div
        className="w-24 h-24 rounded-full shadow-lg flex items-center justify-center font-serif text-3xl font-bold text-white mb-6 shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform duration-300"
        style={{ backgroundColor: tint }}
      >
        <div className="absolute inset-0 bg-black/10" />
        <span className="relative z-10 tracking-tight">{initials(guest.guest)}</span>
      </div>

      {/* Card Content */}
      <div className="flex flex-col justify-between flex-1 w-full">
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#038f90] group-hover:text-[#0d6e4e] transition-colors leading-tight">
            {guest.guest}
          </h3>
          <p className="font-sans text-xs font-bold text-[#b06a2c] uppercase tracking-wider mt-1.5 mb-4">
            {guest.role}
          </p>
          <p className="font-sans text-xs text-[#636b58]/90 line-clamp-3 leading-relaxed">
            &ldquo;{guest.description}&rdquo;
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-black/5 flex items-center justify-between w-full">
          <span className="font-mono text-[11px] font-bold text-[#038f90]/70 uppercase tracking-widest">
            EP {guest.ep}
          </span>
          <Link
            href="/episodes"
            className="inline-flex items-center gap-1 font-sans text-xs text-[#0d6e4e] font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform"
          >
            Listen <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function GuestsPage() {
  const firstHalf = EPISODES.slice(0, 6);
  const secondHalf = EPISODES.slice(6, 12);

  return (
    <main className="min-h-screen overflow-x-hidden">
      {/* Zone 1: Hero (`PageHero` with Barn Image `ghibli_bg.png`) */}
      <div className="relative">
        <PageHero
          eyebrow="Voices of Regeneration"
          title="Our"
          accent="Guests"
          subtitle="Biomaterials scientists, packaging founders, policy changemakers, and environmental artists from across the world — the people proving regeneration isn't a future promise. It's already underway."
          lowerCurveColor="#d4eedf"
          curveVariant="crest"
        />
      </div>

      {/* Zone 2: Biomaterials & Science Pioneers against Mint Background (#d4eedf) */}
      <section className="px-6 md:px-12 py-16 md:py-24 bg-[#d4eedf] relative z-10 overflow-visible">
        <DecorationBush className="right-4 md:right-12 -top-6 w-16 h-16 md:w-20 md:h-20 opacity-80" />
        <DecorationTree className="left-4 md:left-10 bottom-2 w-12 h-24 md:w-16 md:h-32 opacity-75" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-12 text-center md:text-left">
            <span className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] text-[#038f90] justify-center md:justify-start mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Biomaterials & Science Pioneers
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-[#038f90] tracking-tight">
              Leading the Materials Shift
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {firstHalf.map((e, i) => (
              <GuestCard key={e.ep} guest={e} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Wave: Mint (#d4eedf) -> Cream (#f2ede4) */}
      <div className="w-full block leading-none bg-[#d4eedf]">
        <svg className="w-full h-12 md:h-20 block" viewBox="0 0 1440 80" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,50 C300,10 600,75 900,25 C1150,0 1300,60 1440,30 L1440,80 L0,80 Z" fill="#f2ede4" />
        </svg>
      </div>

      {/* Zone 3: Systems & Policy Founders against Cream Background (#f2ede4) */}
      <section className="px-6 md:px-12 pt-16 pb-24 md:pb-32 bg-[#f2ede4] relative z-10 overflow-visible">
        <DecorationTreeTwo className="right-6 md:right-16 top-6 w-14 h-20 md:w-18 md:h-28 opacity-80" />
        <DecorationBush className="left-6 md:left-14 bottom-4 w-14 h-14 md:w-16 md:h-16 opacity-80" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-12 text-center md:text-left">
            <span className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] text-[#b06a2c] justify-center md:justify-start mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Systems & Policy Founders
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-[#038f90] tracking-tight">
              Changemakers & Global Activists
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {secondHalf.map((e, i) => (
              <GuestCard key={e.ep} guest={e} index={i + 2} />
            ))}
          </div>
        </div>
      </section>

      {/* Collaborate / Be a Guest Section with Cream Top Curve over Ghibli background */}
      <CollaborationCTA topCurveColor="#f2ede4" />

      <Footer />
    </main>
  );
}
