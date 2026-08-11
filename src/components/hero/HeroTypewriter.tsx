"use client";

import { useTypewriter } from "@/lib/hooks/useTypewriter";

export function HeroTypewriter({ label, words }: { label: string; words: string[] }) {
  const typed = useTypewriter(words);

  return (
    <p className="mt-2 text-sm text-[var(--color-text-muted)]">
      {label}: <span className="font-medium text-[var(--color-text)]">{typed}</span>
    </p>
  );
}
