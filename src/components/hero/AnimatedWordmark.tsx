"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTypewriter } from "@/lib/hooks/useTypewriter";

const FULL_TEXT = "InterviewRoadmap.dev";
const SPLIT = "InterviewRoadmap".length;

// Versão animada do Wordmark, só pro H1 do hero da home — digita o nome uma vez ao montar (não cicla
// como o typewriter de "Trilhas: X" logo abaixo) e desliza um traço sob ".dev" ao terminar. O texto
// completo vive sempre em `sr-only` (não depende do estado da animação nem de JS ter rodado); a versão
// visível/animada é `aria-hidden`.
export function AnimatedWordmark({ className }: { className?: string }) {
  const prefersReducedMotion = useReducedMotion();
  const typed = useTypewriter([FULL_TEXT], { once: true, typingMs: 55 });
  const done = typed.length >= FULL_TEXT.length;
  const name = typed.slice(0, SPLIT);
  const tld = typed.slice(SPLIT);

  return (
    <span className={className}>
      <span className="sr-only">{FULL_TEXT}</span>
      <span aria-hidden="true">
        {name}
        <span className="relative font-normal text-[var(--color-accent)]">
          {tld}
          <motion.span
            className="absolute -bottom-0.5 left-0 h-0.5 w-full bg-[var(--color-accent)]"
            style={{ transformOrigin: "left" }}
            initial={prefersReducedMotion ? false : { scaleX: 0 }}
            animate={done ? { scaleX: 1 } : undefined}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </span>
        {!done && !prefersReducedMotion ? (
          <span className="ml-0.5 inline-block h-[0.85em] w-0.5 -translate-y-[0.05em] animate-pulse bg-[var(--color-accent)]" />
        ) : null}
      </span>
    </span>
  );
}
