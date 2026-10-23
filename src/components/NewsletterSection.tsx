"use client";

import { NewsletterForm } from "./NewsletterForm";

// Homepage newsletter block: same signup as the navbar modal, inline on the teal brand colour.
export function NewsletterSection() {
  return (
    <section id="newsletter" className="relative w-full bg-[#038f90] text-white py-20 md:py-28 overflow-hidden">
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#aeddd9]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 max-w-md mx-auto px-6">
        <NewsletterForm />
      </div>
    </section>
  );
}
