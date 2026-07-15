"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Leaf, Users, Sprout, Rocket, LineChart, Play, Award } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { DecorationTreeTwo } from "@/components/ui/DecorationTreeTwo";
import { DecorationBush } from "@/components/ui/DecorationBush";

const audience = [
  { 
    icon: Sprout, 
    title: "Sustainability Enthusiasts", 
    text: "Actively seeking content on environmental issues, the circular economy, and regenerative design practices.",
    badgeColor: "bg-[#0d6e4e]/10 text-[#0d6e4e]",
    borderColor: "hover:border-[#0d6e4e]/40"
  },
  { 
    icon: Users, 
    title: "Students & Researchers", 
    text: "Early-career people in biomaterials and material science, passionate about climate action and purpose-driven work.",
    badgeColor: "bg-[#038f90]/10 text-[#038f90]",
    borderColor: "hover:border-[#038f90]/40"
  },
  { 
    icon: Rocket, 
    title: "Climate Startups & Founders", 
    text: "Innovators building compostable packaging and circular businesses, looking for visibility and collaboration.",
    badgeColor: "bg-[#b06a2c]/10 text-[#b06a2c]",
    borderColor: "hover:border-[#b06a2c]/40"
  },
  { 
    icon: LineChart, 
    title: "Investors & Advocates", 
    text: "VCs, angel investors, and policy advocates tracking high-value opportunities and emerging climate tech.",
    badgeColor: "bg-[#636b58]/15 text-[#636b58]",
    borderColor: "hover:border-[#636b58]/40"
  },
];

export default function AboutPage() {
  return (
    <main className="bg-[#f2ede4] min-h-screen relative overflow-hidden">
      {/* 1. Hero Section */}
      <div className="relative">
        <PageHero
          eyebrow="About Our Mission"
          title="Good Garbage"
          accent="Podcast"
          subtitle="A vibrant celebration exploring garbage in ways you've never thought of — turning what we throw away into what brings the world back to life."
        />
      </div>

      {/* 2. Mission Section overlapping smoothly right over the PageHero bottom edge */}
      <section className="px-6 md:px-12 py-16 md:py-24 bg-[#f2ede4] rounded-t-[36px] md:rounded-t-[64px] -mt-10 md:-mt-16 relative z-30 shadow-2xl overflow-visible">
        <DecorationBush className="right-6 md:right-16 -top-6 w-16 h-16 md:w-20 md:h-20 opacity-80" />
        <DecorationTreeTwo className="left-4 md:left-12 bottom-4 w-14 h-20 md:w-16 md:h-24 opacity-75" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_1.1fr] gap-12 lg:gap-20 items-center relative z-10">
          <div className="space-y-6">
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#636b58] block">
              Our Core Belief
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#038f90] leading-[1.05] tracking-tighter">
              Garbage is not trash — it's a <span className="italic text-[#0d6e4e]">resource</span> waiting to regenerate.
            </h2>
            <p className="text-base md:text-lg text-black/75 leading-relaxed">
              Good Garbage started with a simple philosophy: that sustainability doesn't have to be grim or preachy—it can be a vibrant celebration of human ingenuity and natural growth.
            </p>
            <p className="text-sm md:text-base text-black/65 leading-relaxed">
              Each week we sit down with biomaterials scientists, USDA researchers, packaging founders, and environmental artists. We explore how discarded materials, seaweed, and agricultural residue are transformed into premium, living solutions.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white shadow-sm ring-1 ring-[#038f90]/10">
                <Award className="w-4 h-4 text-[#b06a2c]" />
                <span className="text-xs font-bold text-[#038f90]">No Greenwashing</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white shadow-sm ring-1 ring-[#038f90]/10">
                <Leaf className="w-4 h-4 text-[#0d6e4e]" />
                <span className="text-xs font-bold text-[#038f90]">100% Circular Focus</span>
              </div>
            </div>
          </div>

          {/* Curvy Multi-Image Collage */}
          <div className="relative grid grid-cols-2 gap-4 md:gap-6 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[4/5] rounded-[36px] overflow-hidden bg-white shadow-xl ring-1 ring-[#038f90]/15 p-4 flex items-center justify-center group"
            >
              <Image
                src="/images/composter.webp"
                alt="Regenerative Illustration"
                fill
                sizes="(max-width: 768px) 45vw, 300px"
                className="object-contain p-2 transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute bottom-3 left-3 bg-[#038f90] text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow">
                Growth Arc
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative aspect-[4/5] rounded-[36px] overflow-hidden bg-[#0d6e4e]/10 shadow-xl ring-1 ring-[#0d6e4e]/20 group mt-8 lg:mt-12"
            >
              <Image
                src="/images/episodes/latest.png"
                alt="Compostable Materials Artwork"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/35" />
              <span className="absolute bottom-3 left-3 bg-[#0d6e4e] text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow">
                Biomaterials
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Meet the Team & Host Section */}
      <section className="px-6 md:px-12 py-12 md:py-20 relative z-20">
        <div className="max-w-7xl mx-auto rounded-[44px] md:rounded-[52px] bg-[#038f90] text-white p-8 md:p-14 lg:p-16 shadow-2xl relative overflow-hidden border border-white/20">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#f2ede4_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-10 lg:gap-16 items-center relative z-10">
            {/* Host Portrait Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col max-w-md mx-auto lg:mx-0 w-full rounded-[36px] overflow-hidden bg-[#013e3f] ring-2 ring-white/25 shadow-2xl group"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/20">
                <Image
                  src="/images/hero/ved_dt.png"
                  alt="Ved Krishna - Host of Good Garbage Podcast"
                  fill
                  sizes="(max-width: 768px) 90vw, 450px"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="bg-[#013536] p-5 border-t border-white/15 z-10 flex flex-col items-start gap-1">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#aeddd9] block">
                  Host &amp; Production Team
                </span>
                <p className="font-serif text-2xl text-white tracking-tight">Ved Krishna &amp; Team</p>
                <p className="font-sans text-xs text-white/80">Producers &amp; Pakka Circular Innovators</p>
              </div>
            </motion.div>

            {/* Host & Team Bio */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6 text-center lg:text-left"
            >
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-black tracking-[0.4em] text-[#aeddd9] block">
                  The Voices &amp; Team Behind The Show
                </span>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-white leading-[1.0] tracking-tighter">
                  Ved Krishna &amp; Team
                </h2>
                <p className="font-serif italic text-lg md:text-xl text-[#aeddd9]">
                  "Decay is simply the first step toward growth."
                </p>
              </div>

              <div className="space-y-4 font-sans text-sm md:text-base text-white/90 leading-relaxed max-w-xl mx-auto lg:mx-0">
                <p>
                  Ved Krishna is on a lifelong mission to transform discarded materials into high-value resources. As a regenerative pioneer and sustainability advocate, he champions agricultural residue packaging and circular innovation.
                </p>
                <p>
                  Through the <span className="font-bold text-[#aeddd9]">Good Garbage Podcast</span>, Ved sits down with global changemakers to bridge the gap between scientific depth and human optimism—proving that when we work together, we can bring the planet back to life.
                </p>
              </div>

              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link href="/episodes">
                  <Button variant="accent" className="bg-[#0d6e4e] hover:bg-[#0a583e] !text-white !px-8 !h-14 !text-xs rounded-full shadow-xl flex items-center gap-2">
                    <Play className="w-4 h-4 fill-current" /> Listen to Ved's Episodes
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="glass" className="!text-white border-white/30 hover:bg-white/10 !px-8 !h-14 !text-xs rounded-full">
                    Connect with Ved
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Irregular Terraced Contour bridging Cream (#f2ede4) into Mint (#d4eedf) */}
      <div className="w-full relative z-10 pointer-events-none leading-none -mb-3">
        <svg viewBox="0 0 1440 55" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
          <path d="M0 65L80 40C260 10 440 48 620 38C800 28 980 5 1160 22C1340 39 1400 48 1440 35V65H0Z" fill="#d4eedf" />
        </svg>
      </div>

      {/* 4. Who It's For Section (Colorful Curvy Cards) */}
      <section className="px-6 md:px-12 py-16 md:py-24 bg-[#d4eedf] relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 text-center lg:text-left">
            <span className="text-[11px] uppercase font-black tracking-[0.3em] text-[#038f90] block mb-3">
              Who It's For
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#038f90] tracking-tighter">
              Made for the <span className="italic opacity-60">curious & committed</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {audience.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={`rounded-[36px] bg-white p-7 ring-1 ring-[#038f90]/10 shadow-md hover:shadow-2xl transition-all duration-300 border border-transparent ${a.borderColor} flex flex-col justify-between`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${a.badgeColor}`}>
                    <a.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl text-[#038f90] leading-tight mb-3">{a.title}</h3>
                  <p className="font-sans text-sm text-black/70 leading-relaxed">{a.text}</p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-dashed border-[#038f90]/15 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-black tracking-widest text-[#038f90]/50">Community</span>
                  <span className="w-2 h-2 rounded-full bg-[#0d6e4e]" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Irregular Fluid Ridge bridging Mint (#d4eedf) into Teal Sponsor Section (#038f90) */}
      <div className="w-full relative z-10 pointer-events-none leading-none -mb-3 bg-[#d4eedf]">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
          <path d="M0 70L50 48C180 16 380 52 580 44C780 36 980 8 1180 16C1380 24 1420 45 1440 50V70H0Z" fill="#038f90" />
        </svg>
      </div>

      {/* 5. Sponsor Brand Integration Section */}
      <section className="px-6 md:px-12 py-20 md:py-28 bg-[#038f90] relative overflow-hidden z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-center relative z-10">
          <div className="space-y-6 text-center lg:text-left">
            <span className="flex items-center gap-2 text-[11px] uppercase font-black tracking-[0.3em] text-[#aeddd9] justify-center lg:justify-start mb-2">
              <Leaf className="w-3.5 h-3.5 text-[#aeddd9]" /> Proudly Powered by
            </span>
            <h2 className="text-4xl md:text-6xl font-serif text-white tracking-tighter leading-[1.0]">
              A Podcast by <br /> <span className="italic text-[#aeddd9]">PAKKA Limited</span>
            </h2>
            <p className="text-base md:text-lg text-white/85 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Good Garbage is proudly sponsored by Pakka — pioneering regenerative innovation through compostable packaging, agricultural residue feedstocks, and a plastic-free future.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
              <Link href="/contact">
                <Button variant="accent" className="bg-white !text-[#038f90] hover:bg-[#aeddd9] !px-8 !h-14 !text-xs rounded-full shadow-2xl font-bold">
                  Join the Community / Sponsor
                </Button>
              </Link>
              <a href="https://pakka.com" target="_blank" rel="noopener noreferrer">
                <Button variant="glass" className="!text-white border-white/35 hover:bg-white/10 !px-8 !h-14 !text-xs rounded-full">
                  Explore Pakka Products
                </Button>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {[
              { k: "49+", v: "Episodes released" },
              { k: "100%", v: "Compostable mission" },
              { k: "3", v: "Continents of guests" },
              { k: "1", v: "Shared goal: regenerate" },
            ].map((s) => (
              <motion.div
                key={s.v}
                whileHover={{ y: -4 }}
                className="rounded-[32px] bg-white/10 border border-white/15 hover:bg-white/15 hover:border-white/30 p-6 md:p-8 backdrop-blur-md shadow-xl transition-all"
              >
                <p className="font-serif text-4xl md:text-5xl text-white tracking-tighter font-bold">{s.k}</p>
                <p className="mt-2 font-sans text-[11px] uppercase tracking-widest text-[#aeddd9] font-bold">{s.v}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
