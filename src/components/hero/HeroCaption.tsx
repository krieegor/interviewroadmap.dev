"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import type { CSSProperties } from "react";

export function HeroCaption({
  text,
  progress,
  range,
  style,
}: {
  text: string;
  progress: MotionValue<number>;
  range: [number, number, number, number];
  style: CSSProperties;
}) {
  const opacity = useTransform(progress, range, [0, 1, 1, 0]);
  const y = useTransform(progress, range, [8, 0, 0, -8]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute rounded-full border border-[var(--color-border)] bg-[var(--color-bg)]/90 px-3 py-1 text-xs font-medium text-[var(--color-text)] shadow-sm"
      style={{ ...style, opacity, y }}
    >
      {text}
    </motion.div>
  );
}
