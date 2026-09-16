"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/Button";
import { watchUrl, type Episode } from "@/lib/feed";

export function LatestEpisode({ latest }: { latest: Episode }) {
  const [lead, ...rest] = latest.title.split(/[:|]/);
  const tail = rest.join(" ").trim();

  return (
    <section className="relative w-full py-24 md:py-32 bg-[#d4eedf] flex items-center justify-center p-6 md:p-12 overflow-hidden rounded-t-[40px] md:rounded-t-[80px] -mt-12 md:-mt-20 z-[30]">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center text-[#038f90]">

        {/* Left Side: Large Title and Featured Image */}
        <div className="space-y-8 md:space-y-12">
          <div className="relative">
            <h2 className="text-4xl md:text-8xl font-serif leading-[0.9] tracking-tighter text-[#038f90]">
              Latest <br /> <span className="opacity-40 italic">Episode</span>
            </h2>
          </div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group"
          >
            <Image
              src={latest.thumbnail || "/images/episodes/latest.png"}
              alt={latest.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </motion.div>
        </div>

        {/* Right Side: Content and CTA */}
        <div className="space-y-8 lg:pt-24">
          <div className="space-y-4 md:space-y-6">
            <span className="text-[11px] uppercase font-black tracking-[0.3em] text-[#038f90]/70 block">
              New Release
            </span>
            <h3 className="text-3xl md:text-6xl font-serif leading-tight tracking-tight text-[#038f90]">
              {lead}
              {tail && (
                <>
                  <br /> <span className="italic opacity-60">{tail}</span>
                </>
              )}
            </h3>
            <p className="text-sm md:text-xl text-[#038f90]/80 leading-relaxed max-w-lg font-sans">
              {latest.description}
            </p>
          </div>

          <div className="space-y-6 pt-8 border-t border-[#038f90]/10">
            <div className="flex items-center gap-12 md:gap-16">
              <div>
                <p className="text-[10px] uppercase font-bold text-[#038f90]/40 mb-2 tracking-widest">Guest</p>
                <p className="text-sm md:text-lg font-black text-[#038f90]">
                  {[latest.guest, latest.role].filter(Boolean).join(" · ")}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-[#038f90]/40 mb-2 tracking-widest">Duration</p>
                <p className="text-sm md:text-lg font-black text-[#038f90]">{latest.duration}</p>
              </div>
            </div>

            {/* One row from sm up; stacked and full width on a phone, where two
                content-width buttons left a ragged edge under a full-width paragraph. */}
            <div className="pt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <a href={watchUrl(latest)} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button
                  variant="accent"
                  className="w-full justify-center !px-10 !h-14 md:!h-16 !text-xs md:!text-sm uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all bg-[#038f90] !text-white"
                >
                  Play Episode
                  <span className="ml-3">▶</span>
                </Button>
              </a>

              <Link href="/episodes" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full justify-center !px-10 !h-14 md:!h-16 !text-xs md:!text-sm border-[#038f90]/30 text-[#038f90] hover:bg-[#038f90]/5 uppercase tracking-widest"
                >
                  View All Episodes
                </Button>
              </Link>
            </div>

            {/* Straight to this episode on the other two platforms — chips rather than
                underlined sentences, which read as body copy that happened to be a link.
                Each is rendered only when that link is known: Apple's comes from a live
                lookup that can be down, and the show's front page is not the same promise. */}
            {(latest.listen || latest.apple) && (
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <span className="font-sans text-[10px] font-black uppercase tracking-[0.2em] text-[#038f90]/45">
                  This episode
                </span>
                {latest.listen && (
                  <a
                    href={latest.listen}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-[#038f90]/25 px-4 py-2 font-sans text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] text-[#038f90]/80 transition-colors hover:border-[#038f90]/50 hover:bg-[#038f90]/5 hover:text-[#038f90]"
                  >
                    Spotify
                  </a>
                )}
                {latest.apple && (
                  <a
                    href={latest.apple}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-[#038f90]/25 px-4 py-2 font-sans text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] text-[#038f90]/80 transition-colors hover:border-[#038f90]/50 hover:bg-[#038f90]/5 hover:text-[#038f90]"
                  >
                    Apple Podcasts
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
