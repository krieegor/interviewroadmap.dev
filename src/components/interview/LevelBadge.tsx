import type { InterviewLevel } from "@/types/content";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

export function LevelBadge({ level, dict }: { level: InterviewLevel; dict: Dictionary }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-0.5 text-xs font-medium text-[var(--color-text-muted)]">
      {dict.simulator.levelLabels[level]}
    </span>
  );
}
