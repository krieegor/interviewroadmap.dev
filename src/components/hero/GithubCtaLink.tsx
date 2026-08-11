"use client";

import { motion, useReducedMotion } from "motion/react";

export function GithubCtaLink({ href, label }: { href: string; label: string }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      whileHover={prefersReducedMotion ? undefined : { x: 2 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
      className="mt-3 inline-block text-sm font-medium text-[var(--color-accent)] hover:underline"
    >
      {label}
    </motion.a>
  );
}
