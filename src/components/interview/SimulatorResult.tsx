import type { InterviewLevel } from "@/types/content";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { formatTemplate } from "@/lib/i18n/format";
import { formatDuration, type Mode } from "@/lib/simulator/session";

export function SimulatorResult({
  total,
  level,
  mode,
  totalTimeMs,
  correct,
  partial,
  unknown,
  onRestart,
  dict,
}: {
  total: number;
  level: InterviewLevel | "todos";
  mode: Mode;
  totalTimeMs: number;
  correct: number;
  partial: number;
  unknown: number;
  onRestart: () => void;
  dict: Dictionary;
}) {
  const showPartial = mode === "aberta";

  return (
    <div className="rounded-md border border-[var(--color-border)] p-6">
      <h2 className="text-lg font-semibold text-[var(--color-text)]">{dict.simulator.resultTitle}</h2>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">
        {formatTemplate(dict.simulator.questionsCount, { count: total })}{" "}
        {level === "todos" ? dict.simulator.allLevelsResult : dict.simulator.levelLabels[level]}
        {" · "}
        {dict.simulator.modeLabels[mode]}
        {" · "}
        {formatTemplate(dict.simulator.totalTime, { time: formatDuration(totalTimeMs) })}
      </p>
      <div className={`mt-4 grid gap-3 text-center ${showPartial ? "grid-cols-3" : "grid-cols-2"}`}>
        <div className="rounded-md bg-[var(--color-surface)] p-3">
          <p className="text-2xl font-semibold text-emerald-600">{correct}</p>
          <p className="text-xs text-[var(--color-text-muted)]">{dict.simulator.correct}</p>
        </div>
        {showPartial ? (
          <div className="rounded-md bg-[var(--color-surface)] p-3">
            <p className="text-2xl font-semibold text-amber-600">{partial}</p>
            <p className="text-xs text-[var(--color-text-muted)]">{dict.simulator.partial}</p>
          </div>
        ) : null}
        <div className="rounded-md bg-[var(--color-surface)] p-3">
          <p className="text-2xl font-semibold text-red-500">{unknown}</p>
          <p className="text-xs text-[var(--color-text-muted)]">{dict.simulator.unknown}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onRestart}
        className="mt-6 rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text)] hover:border-[var(--color-accent)]"
      >
        {dict.simulator.restart}
      </button>
    </div>
  );
}
