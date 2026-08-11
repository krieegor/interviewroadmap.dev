"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export function HeroCaption({ text }: { text: string }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={text}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg)]/90 px-3 py-1 text-xs font-medium text-[var(--color-text)] shadow-sm"
        >
          {text}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
