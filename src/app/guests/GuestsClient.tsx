"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Sparkles, Facebook, Instagram, Twitter } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Footer } from "@/components/Footer";
import { CollaborationCTA } from "@/components/CollaborationCTA";
import { DecorationBush } from "@/components/ui/DecorationBush";
import { DecorationTree } from "@/components/ui/DecorationTree";
import { DecorationTreeTwo } from "@/components/ui/DecorationTreeTwo";
import { EPISODES, Episode } from "@/lib/episodes";

function GuestCard({ guest, index }: { guest: Episode; index: number }) {
  // Use modulo to cycle through the 3 images we generated
  const imageIndex = (index % 3) + 1;
  const imageSrc = `/images/guests/${imageIndex}.png`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
      className="group flex flex-col items-center text-center rounded-[24px] bg-[#f8f9fa] p-10 h-full w-full transition-all duration-300 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.06)] hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1"
    >
      <div className="w-32 h-32 rounded-full overflow-hidden mb-6 relative shadow-sm group-hover:scale-105 transition-transform duration-300">
        <Image 
          src={imageSrc} 
          alt={guest.guest} 
          fill 
          sizes="128px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col items-center w-full">
        <h3 className="font-serif text-[22px] md:text-2xl font-bold text-[#2b2353] leading-tight mb-1 transition-colors">
          {guest.guest}
        </h3>
        <p className="font-sans text-[13px] md:text-sm font-medium text-[#888b94] mb-8">
          {guest.role.split(',')[0]}
        </p>

        <div className="flex items-center gap-5 text-[#5e6679]">
          <a href="#" className="hover:text-[#2b2353] transition-colors"><Facebook className="w-[18px] h-[18px]" strokeWidth={2.5} /></a>
          <a href="#" className="hover:text-[#2b2353] transition-colors"><Instagram className="w-[18px] h-[18px]" strokeWidth={2.5} /></a>
          <a href="#" className="hover:text-[#2b2353] transition-colors"><Twitter className="w-[18px] h-[18px]" fill="currentColor" strokeWidth={0} /></a>
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
          subtitle="Biomaterials scientists, packaging founders, policy changemakers and environmental artists — from a dozen-plus countries. Founders from Notpla, TerraCycle, Mango Materials, A Plastic Planet, TIPA. Packaging is a global problem. These are the people solving it, wherever they are."
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
