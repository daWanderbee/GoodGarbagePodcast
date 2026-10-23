"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { NewsletterForm } from "./NewsletterForm";

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // The form unmounts when the modal closes, so its state resets on its own.
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 pointer-events-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
            className="relative w-full max-w-md bg-[#038f90] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 z-10 overflow-hidden"
          >
            {/* Background subtle glow effect */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#aeddd9]/20 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-5 right-5 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <NewsletterForm onDone={onClose} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
