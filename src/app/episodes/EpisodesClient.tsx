"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Search, Play, Leaf } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Footer } from "@/components/Footer";
import { CATEGORIES, watchUrl, type Episode } from "@/lib/feed";

const tagColor: Record<string, string> = {
  Business: "bg-[#0d6e4e] text-white",
  Environment: "bg-[#038f90] text-white",
  Science: "bg-[#636b58] text-white",
  Activism: "bg-[#b06a2c] text-white",
};

export function EpisodesClient({ episodes }: { episodes: Episode[] }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>("All");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return episodes.filter((e) => {
      const matchesCat = active === "All" || e.category === active;
      const matchesText =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.guest.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q);
      return matchesCat && matchesText;
    });
  }, [episodes, query, active]);

  return (
    <main className="bg-[#f2ede4] min-h-screen relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative">
        <PageHero
          eyebrow="The Archive"
          title="Episodes"
          subtitle={`Listen to over ${Math.floor(episodes.length / 10) * 10} unique definitions of what Good Garbage is, from our incredible guests. Filter by theme, or search for the one you half-remember.`}
          curveVariant="swell"
        />
      </div>

      {/* Curvy Floating Search & Filter Section */}
      <section className="px-6 md:px-12 -mt-6 relative z-30">
        <div className="max-w-7xl mx-auto rounded-[36px] bg-white/90 backdrop-blur-md shadow-2xl ring-1 ring-[#038f90]/15 p-5 md:p-7 flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between border border-white/60">
          <label className="flex items-center gap-3.5 flex-1 rounded-full bg-[#f2ede4]/80 px-6 py-4 shadow-inner border border-[#038f90]/10 focus-within:ring-2 focus-within:ring-[#038f90]/30 transition-all">
            <Search className="w-5 h-5 text-[#038f90]/60 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search episodes by topic, guest, or keyword…"
              className="w-full bg-transparent text-sm md:text-base text-[#038f90] placeholder:text-[#038f90]/40 focus:outline-none font-sans font-medium"
            />
          </label>
          <div className="flex flex-wrap gap-2.5 items-center justify-center lg:justify-end">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 shadow-sm ${
                  active === c
                    ? "bg-[#038f90] text-white scale-105 shadow-md"
                    : "bg-[#038f90]/5 text-[#038f90] hover:bg-[#038f90]/15 hover:scale-102"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Episode listing */}
      <section className="px-6 md:px-12 py-16 md:py-24 relative z-20 overflow-visible">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2.5">
              <Leaf className="w-4 h-4 text-[#0d6e4e]" />
              <p className="text-xs uppercase font-black tracking-[0.25em] text-[#038f90]/70 font-sans">
                Showing {results.length} of {episodes.length} episodes
              </p>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="rounded-[40px] bg-white/80 p-20 text-center text-[#038f90]/70 font-sans shadow-lg ring-1 ring-[#038f90]/10">
              <p className="text-lg font-serif mb-2 text-[#038f90]">No episodes found</p>
              <p className="text-sm">Try searching for a different keyword or selecting another category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
              {results.map((e, i) => (
                <motion.article
                  key={e.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                  className="group flex flex-col rounded-[36px] bg-white p-6 shadow-md ring-1 ring-[#038f90]/10 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 relative overflow-hidden"
                >
                  {/* Curvy Thumbnail Area */}
                  <div className="relative mb-5 aspect-[16/10] w-full overflow-hidden rounded-[26px] bg-[#038f90]/10 shrink-0">
                    <Image
                      src={e.thumbnail || "/images/episodes/latest.png"}
                      alt={e.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    />
                    <div className="absolute inset-0 bg-black/35" />
                    
                    {/* Floating Category Badge inside Thumbnail */}
                    <span
                      className={`absolute top-3.5 left-3.5 px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] shadow-md ${tagColor[e.category]}`}
                    >
                      {e.category}
                    </span>

                    {/* Episode Number Badge inside Thumbnail */}
                    {e.ep > 0 && (
                      <span className="absolute bottom-3.5 left-3.5 font-sans text-[11px] font-black uppercase tracking-[0.2em] text-white/90 drop-shadow">
                        EP {e.ep}
                      </span>
                    )}

                    {/* Curvy Play Action Button inside Thumbnail */}
                    <a
                      href={watchUrl(e)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Watch ${e.title} on YouTube`}
                      className="absolute bottom-3.5 right-3.5 flex h-12 w-12 items-center justify-center rounded-full bg-[#0d6e4e] text-white shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-[#0a583e] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#aeddd9]"
                    >
                      <Play className="ml-0.5 h-5 w-5 fill-current" />
                    </a>
                  </div>

                  {/* Card Content */}
                  <div className="flex flex-col flex-1 px-1">
                    <h3 className="font-serif text-xl md:text-2xl leading-[1.15] tracking-tight text-[#038f90] group-hover:text-[#0d6e4e] transition-colors">
                      {e.title}
                    </h3>
                    
                    <p className="mt-3 flex-1 font-sans text-sm leading-relaxed text-black/70 line-clamp-3">
                      {e.description}
                    </p>

                    <div className="mt-6 pt-4 border-t border-dashed border-[#038f90]/15 flex items-center justify-between">
                      <div>
                        <p className="font-sans text-sm font-bold text-[#038f90]">{e.guest}</p>
                        <p className="font-sans text-[11px] font-medium text-[#636b58]">{e.role}</p>
                        {e.location && (
                          <p className="font-sans text-[11px] font-medium text-[#636b58]/70">{e.location}</p>
                        )}
                      </div>
                      <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#038f90]/50 bg-[#f2ede4] px-3 py-1.5 rounded-full">
                        {e.duration}
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Small Sponsor Note with Plant Motif */}
      <section className="px-6 md:px-12 pb-20 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 text-xs uppercase font-black tracking-[0.25em] text-[#038f90]/50 bg-white/50 rounded-full py-4 px-8 max-w-md border border-[#038f90]/10">
          <Leaf className="w-4 h-4 text-[#0d6e4e]" />
          <span>A podcast by Pakka Limited</span>
        </div>
      </section>

      <Footer />
    </main>
  );
}
