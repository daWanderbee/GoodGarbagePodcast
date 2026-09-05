"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Sparkles, Play } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Footer } from "@/components/Footer";
import { CollaborationCTA } from "@/components/CollaborationCTA";
import { watchUrl, type Episode } from "@/lib/feed";

function GuestCard({ guest, index }: { guest: Episode; index: number }) {

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
          src={guest.portrait as string} 
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
          {guest.role ? guest.role.split(',')[0] : `Good Garbage${guest.ep ? ` · Ep ${guest.ep}` : ""}`}
        </p>

        {/* Was three dead social icons. They pointed nowhere, and even filled in they would
            have implied these were the guest's own accounts. Their episode is the thing a
            visitor actually wants from this card. */}
        <a
          href={watchUrl(guest)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] text-[#5e6679] hover:text-[#2b2353] transition-colors"
        >
          <Play className="w-3.5 h-3.5 fill-current" strokeWidth={0} />
          Watch episode
        </a>
      </div>
    </motion.article>
  );
}

export function GuestsClient({ episodes }: { episodes: Episode[] }) {
  // A page of faces needs a face: only episodes with a verified guest portrait.
  const named = episodes.filter((e) => e.guest && e.portrait);

  // This used to be slice(0,6) and slice(6,12), which showed twelve guests no matter how
  // many existed and sorted nobody — the two headings were decoration. Split by the
  // episode's own category so each heading describes what is actually under it, and show
  // everyone.
  const isMaterials = (e: Episode) => e.category === "Science" || e.category === "Environment";
  const pioneers = named.filter(isMaterials);
  const changemakers = named.filter((e) => !isMaterials(e));

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
            {pioneers.map((e, i) => (
              <GuestCard key={e.id} guest={e} index={i} />
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
            {changemakers.map((e, i) => (
              <GuestCard key={e.id} guest={e} index={i} />
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
