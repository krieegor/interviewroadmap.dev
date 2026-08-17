"use client";

import { useSimulatorHistory } from "@/lib/progress/simulator-progress";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { formatDuration } from "@/lib/simulator/session";

function formatDate(iso: string, locale: Locale): string {
  return new Date(iso).toLocaleString(locale === "pt" ? "pt-BR" : "en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SimulatorHistory({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const history = useSimulatorHistory();

  if (history.length === 0) return null;

  function levelLabel(level: string): string {
    if (level === "todos") return dict.simulatorHistory.allLevels;
    return dict.simulator.levelLabels[level as keyof typeof dict.simulator.levelLabels] ?? level;
  }

  function topicLabel(topic: string): string {
    return topic === "todos" ? dict.simulatorHistory.allTopics : topic;
  }

  const totalPerguntas = history.reduce((sum, r) => sum + r.total, 0);
  const totalAcertos = history.reduce((sum, r) => sum + r.correct, 0);
  const acuraciaGeral = totalPerguntas > 0 ? Math.round((totalAcertos / totalPerguntas) * 100) : 0;

  const porAssunto = new Map<string, { total: number; correct: number }>();
  for (const result of history) {
    const atual = porAssunto.get(result.topic) ?? { total: 0, correct: 0 };
    atual.total += result.total;
    atual.correct += result.correct;
    porAssunto.set(result.topic, atual);
  }
  const assuntos = Array.from(porAssunto.entries()).sort((a, b) => b[1].total - a[1].total);

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold text-[var(--color-text)]">{dict.simulatorHistory.title}</h2>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-md border border-[var(--color-border)] p-4 text-center">
          <p className="text-2xl font-semibold text-[var(--color-text)]">{history.length}</p>
          <p className="text-xs text-[var(--color-text-muted)]">{dict.simulatorHistory.testsDone}</p>
        </div>
        <div className="rounded-md border border-[var(--color-border)] p-4 text-center">
          <p className="text-2xl font-semibold text-[var(--color-text)]">{totalPerguntas}</p>
          <p className="text-xs text-[var(--color-text-muted)]">
            {dict.simulatorHistory.questionsAnswered}
          </p>
        </div>
        <div className="rounded-md border border-[var(--color-border)] p-4 text-center">
          <p className="text-2xl font-semibold text-[var(--color-accent)]">{acuraciaGeral}%</p>
          <p className="text-xs text-[var(--color-text-muted)]">
            {dict.simulatorHistory.overallAccuracy}
          </p>
        </div>
      </div>

      {assuntos.length > 0 ? (
        <div className="mt-4 rounded-md border border-[var(--color-border)] p-4">
          <p className="text-sm font-medium text-[var(--color-text)]">{dict.simulatorHistory.byTopic}</p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {assuntos.map(([topic, stats]) => {
              const percent = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
              return (
                <li
                  key={topic}
                  className="flex items-center justify-between text-sm text-[var(--color-text-muted)]"
                >
                  <span>{topicLabel(topic)}</span>
                  <span>
                    {stats.correct}/{stats.total} ({percent}%)
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <div className="mt-4 flex flex-col divide-y divide-[var(--color-border)] rounded-md border border-[var(--color-border)]">
        {history.map((result, index) => (
          <div
            key={`${result.date}-${index}`}
            className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm"
          >
            <div>
              <p className="font-medium text-[var(--color-text)]">
                {levelLabel(result.level)} · {topicLabel(result.topic)} · {dict.simulator.modeLabels[result.mode]}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {formatDate(result.date, locale)} · {formatDuration(result.totalTimeMs)}
              </p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="text-emerald-600">
                {result.correct} {dict.simulatorHistory.correctSuffix}
              </span>
              {result.mode === "aberta" ? (
                <span className="text-amber-600">
                  {result.partial} {dict.simulatorHistory.partialSuffix}
                </span>
              ) : null}
              <span className="text-red-500">
                {result.unknown} {dict.simulatorHistory.unknownSuffix}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
