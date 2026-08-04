"use client";

import { useReadingProgress } from "@/lib/progress/reading-progress";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

export function ChapterProgressButton({ slug, dict }: { slug: string; dict: Dictionary }) {
  const { progress, toggleCompleted } = useReadingProgress(slug);
  const isCompleted = progress.completed.includes(slug);

  return (
    <button
      type="button"
      onClick={() => toggleCompleted(slug)}
      aria-pressed={isCompleted}
      className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
        isCompleted
          ? "border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)]"
          : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
      {isCompleted ? dict.chapterProgress.completed : dict.chapterProgress.markCompleted}
    </button>
  );
}
