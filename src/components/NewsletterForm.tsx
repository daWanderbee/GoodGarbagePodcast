"use client";

import { useId, useState } from "react";
import { Mail, Leaf, Check, Loader2 } from "lucide-react";
import { Button } from "./ui/Button";

// Shared by NewsletterModal (navbar) and NewsletterSection (homepage). Posts to /api/newsletter.
export function NewsletterForm({ onDone }: { onDone?: () => void }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const inputId = useId(); // modal + homepage section can both be mounted

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Subscription failed. Please try again.");
      }

      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-white/20 flex items-center justify-center text-white shadow-inner">
          <Check className="w-7 h-7 text-[#aeddd9]" />
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl text-white font-bold tracking-tight">
          You&apos;re subscribed!
        </h3>
        <p className="text-sm text-white/80 max-w-xs mx-auto leading-relaxed font-sans">
          Thank you for joining our community. We&apos;ll keep you posted with our latest episodes and circular economy updates.
        </p>
        {onDone && (
          <div className="pt-2">
            <Button
              onClick={onDone}
              variant="glass"
              className="!text-white border-white/40 hover:bg-white/20 !px-8 !py-3 !text-xs font-black uppercase tracking-wider"
            >
              Done
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-white/70 text-[10px] uppercase font-bold tracking-[0.25em]">
        <Leaf className="w-3.5 h-3.5 text-[#aeddd9]" />
        <span>Good Garbage Dispatch</span>
      </div>

      <div className="space-y-2">
        <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
          Subscribe for Newsletter
        </h3>
        <p className="text-xs sm:text-sm text-white/85 font-sans leading-relaxed">
          Get regular updates on our latest podcast episodes, biomaterials, and conversations with circular pioneers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 pt-2">
        <div>
          <label htmlFor={inputId} className="sr-only">Email address</label>
          <input
            id={inputId}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full rounded-2xl bg-white/10 border border-white/25 px-4 py-3.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#aeddd9] focus:bg-white/15 transition-all"
          />
        </div>

        {status === "error" && (
          <p className="text-xs text-red-200 bg-red-900/40 border border-red-400/40 rounded-xl px-3 py-2">
            {errorMessage || "Failed to subscribe. Please try again."}
          </p>
        )}

        <Button
          type="submit"
          variant="glass"
          disabled={status === "loading"}
          className="w-full !h-12 !text-xs font-black uppercase tracking-widest !text-white bg-white/20 hover:bg-white/30 border-white/40 shadow-xl flex items-center justify-center gap-2"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Subscribing…</span>
            </>
          ) : (
            <>
              <Mail className="w-4 h-4" />
              <span>Subscribe</span>
            </>
          )}
        </Button>
      </form>

      <p className="text-[10px] text-white/50 text-center tracking-wide font-sans">
        No spam, ever. Unsubscribe at any time.
      </p>
    </div>
  );
}
