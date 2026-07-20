"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Globe, Instagram, Youtube, Leaf, type LucideIcon } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { DecorationBush } from "@/components/ui/DecorationBush";
import { DecorationTree } from "@/components/ui/DecorationTree";
import { DecorationTreeTwo } from "@/components/ui/DecorationTreeTwo";

const TALK_OPTIONS = [
  { value: "Product Dev", label: "Product Dev — Circular packaging & biomaterials" },
  { value: "Funding", label: "Funding — Strategic investment & grants" },
  { value: "Guest", label: "Guest — Share your story on the podcast" },
  { value: "Sponsorship", label: "Sponsorship — Brand alignment & co-creation" },
  { value: "Technology", label: "Technology — Regenerative systems & R&D" },
  { value: "Other", label: "Other — Custom ideas & partnerships" },
];

function ContactFormInner() {
  const [sent, setSent] = useState(false);
  const searchParams = useSearchParams();
  const topicParam = searchParams?.get("topic") || "";
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  useEffect(() => {
    if (topicParam && TALK_OPTIONS.some((o) => o.value === topicParam)) {
      setSelectedTopic(topicParam);
    }
  }, [topicParam]);

  if (sent) {
    return (
      <div className="py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-[#0d6e4e]/10 text-[#0d6e4e] flex items-center justify-center mx-auto mb-4">
          <Leaf className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-2xl text-[#038f90]">Thanks — message received.</h3>
        <p className="mt-2 text-sm text-black/60">We will get back to you soon. In the meantime, explore the archive.</p>
        <Link href="/episodes" className="mt-6 inline-block text-[#0d6e4e] font-bold text-sm">Explore Episodes →</Link>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full name" name="name" placeholder="Your name" required />
        <Field label="Email" name="email" type="email" placeholder="you@email.com" required />
      </div>
      <label className="block">
        <span className="block mb-1.5 text-[10px] uppercase font-black tracking-[0.2em] text-[#038f90]/60">What are you building?</span>
        <select
          required
          name="topic"
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="w-full rounded-xl bg-[#f2ede4] px-4 py-3 text-sm text-[#038f90] font-sans focus:outline-none focus:ring-2 focus:ring-[#038f90]/20"
        >
          <option value="" disabled>Select what you're building…</option>
          {TALK_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="block mb-1.5 text-[10px] uppercase font-black tracking-[0.2em] text-[#038f90]/60">Message</span>
        <textarea
          required
          rows={4}
          name="message"
          placeholder="Tell us about you or your idea…"
          className="w-full rounded-xl bg-[#f2ede4] px-4 py-3 text-sm text-[#038f90] font-sans focus:outline-none focus:ring-2 focus:ring-[#038f90]/20 resize-none placeholder:text-[#038f90]/30"
        />
      </label>
      <Button variant="accent" className="w-full bg-[#038f90] !text-white !h-14 !text-xs uppercase tracking-widest shadow-lg">
        Send Message
      </Button>
    </form>
  );
}

function ContactForm() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-[#038f90]/60 font-bold">Loading form…</div>}>
      <ContactFormInner />
    </Suspense>
  );
}

export default function ContactPage() {
  return (
    <main className="bg-[#f2ede4] min-h-screen">
      <div className="relative">
        <PageHero
          eyebrow="Contact"
          title="Get in"
          accent="touch"
          subtitle="Come on as a guest, partner on a project, or talk to Pakka directly. We're looking for people building a better relationship between what gets discarded and what gets built."
          curveVariant="arch"
        />
      </div>

      {/* 1. Join as guest / partner */}
      <section className="px-6 md:px-12 py-16 md:py-24 relative overflow-visible">
        <DecorationBush className="right-6 md:right-16 -top-6 w-16 h-16 md:w-20 md:h-20 opacity-80 pointer-events-none" />
        <DecorationTree className="left-4 md:left-12 bottom-4 w-12 h-24 md:w-16 md:h-32 opacity-75 pointer-events-none" />
        <DecorationTreeTwo className="right-10 md:right-24 bottom-10 w-14 h-20 md:w-16 md:h-24 opacity-80 pointer-events-none" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-24 items-start relative z-10">
          <div className="space-y-5">
            <span className="text-[10px] uppercase font-black tracking-[0.4em] text-[#038f90]/60">Get Involved</span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#038f90] leading-[1.0] tracking-tighter">
              What are you <br /> <span className="italic opacity-70">building?</span>
            </h2>
            <p className="text-base text-black/70 leading-relaxed max-w-md">
              Product development, a guest application, funding, a sponsorship — or something we haven't thought of. We read every message. Tell us what you're building and where you're stuck.
            </p>
            <div className="flex items-center gap-2 pt-2 text-[#038f90]/60 text-sm">
              <Mail className="w-4 h-4" /> hello@goodgarbage.eco
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 md:p-8 shadow-xl ring-1 ring-[#038f90]/10">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Wave transition from Cream into Teal Connect Section (#038f90) with 3px downward overlap */}
      <div className="w-full block leading-none bg-[#f2ede4] -mb-[3px] relative z-20 overflow-visible">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-12 md:h-16 block overflow-visible" suppressHydrationWarning>
          <path d="M0 60L100 35C320 8 540 42 760 30C980 18 1200 45 1360 20L1440 10V65H0Z" fill="#038f90" suppressHydrationWarning />
        </svg>
      </div>

      {/* 2. Connect with Pakka */}
      <section className="px-6 md:px-12 py-16 md:py-24 bg-[#038f90] relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="space-y-5">
            <span className="flex items-center gap-2 text-[11px] uppercase font-black tracking-[0.3em] text-[#aeddd9] mb-2">
              <Leaf className="w-3.5 h-3.5" /> The Sponsor
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tighter leading-[1.0]">
              Talk to <span className="italic text-white/70">Pakka</span>
            </h2>
            <p className="text-base md:text-lg text-white/85 leading-relaxed max-w-lg">
              Pakka makes compostable packaging that replaces single-use plastic: Chuk for tableware, flexC for flexible packaging. If you want to buy, partner, or sponsor the show, Pakka is the right conversation to start.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PakkaLink icon={Globe} label="pakka.com" href="https://pakka.com" />
            <PakkaLink icon={Mail} label="Email Pakka" href="mailto:info@pakka.com" />
            <PakkaLink icon={Instagram} label="Instagram" href="#" />
            <PakkaLink icon={Youtube} label="YouTube" href="https://www.youtube.com/@GoodGarbage" />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Field({ label, name, type = "text", placeholder, required }: { label: string; name: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="block mb-1.5 text-[10px] uppercase font-black tracking-[0.2em] text-[#038f90]/60">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl bg-[#f2ede4] px-4 py-3 text-sm text-[#038f90] font-sans focus:outline-none focus:ring-2 focus:ring-[#038f90]/20 placeholder:text-[#038f90]/30"
      />
    </label>
  );
}

function PakkaLink({ icon: Icon, label, href }: { icon: LucideIcon; label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/15 px-5 py-4 text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span className="font-sans text-sm font-bold">{label}</span>
    </a>
  );
}
