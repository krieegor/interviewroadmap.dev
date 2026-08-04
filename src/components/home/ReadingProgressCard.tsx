"use client";

import Link from "next/link";
import { useReadingProgress } from "@/lib/progress/reading-progress";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { formatTemplate } from "@/lib/i18n/format";

export function ReadingProgressCard({
  totalChapters,
  locale,
  dict,
}: {
  totalChapters: number;
  locale: Locale;
  dict: Dictionary;
}) {
  const { progress } = useReadingProgress();

  if (progress.visited.length === 0 || totalChapters === 0) return null;

  const percent = Math.round((progress.completed.length / totalChapters) * 100);

  return (
    <div className="mt-10 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <p className="text-sm font-medium text-[var(--color-text)]">{dict.readingProgress.yourProgress}</p>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--color-border)]">
        <div className="h-full bg-[var(--color-accent)]" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-2 text-xs text-[var(--color-text-muted)]">
        {formatTemplate(dict.readingProgress.chaptersCompleted, {
          completed: progress.completed.length,
          total: totalChapters,
          percent,
        })}
      </p>
      {progress.lastVisited ? (
        <Link
          href={`/${locale}/livro/${progress.lastVisited}`}
          className="mt-3 inline-block text-sm font-medium text-[var(--color-accent)] hover:underline"
        >
          {dict.readingProgress.continueReading}
        </Link>
      ) : null}
    </div>
  );
}
