import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import type { QuestionFrontmatter } from "@/types/content";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Tech } from "@/lib/tech/config";
import { formatTemplate } from "@/lib/i18n/format";
import { formatDuration, type Answer, type Mode, type ShuffledQuiz } from "@/lib/simulator/session";

function useElapsedMs(startedAt: number): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  return Math.max(0, now - startedAt);
}

export function SimulatorQuestion({
  current,
  index,
  total,
  mode,
  questionStartedAt,
  revealed,
  onReveal,
  onAnswer,
  quiz,
  selectedOption,
  onSelectOption,
  onAnswerQuiz,
  answerPanelOpen,
  onAnswerPanelOpenChange,
  locale,
  tech,
  dict,
}: {
  current: QuestionFrontmatter;
  index: number;
  total: number;
  mode: Mode;
  questionStartedAt: number;
  revealed: boolean;
  onReveal: () => void;
  onAnswer: (value: Answer) => void;
  quiz: ShuffledQuiz | undefined;
  selectedOption: number | null;
  onSelectOption: (index: number) => void;
  onAnswerQuiz: () => void;
  answerPanelOpen: boolean;
  onAnswerPanelOpenChange: (open: boolean) => void;
  locale: Locale;
  tech: Tech;
  dict: Dictionary;
}) {
  const elapsedMs = useElapsedMs(questionStartedAt);

  return (
    <div className="rounded-md border border-[var(--color-border)] p-6">
      <p className="text-xs font-medium text-[var(--color-text-muted)]">
        {formatTemplate(dict.simulator.questionOf, { index: index + 1, total })}
        {" · "}
        {formatDuration(elapsedMs)}
      </p>
      <h2 className="mt-2 text-lg font-semibold text-[var(--color-text)]">{current.title}</h2>

      {mode === "aberta" ? (
        <>
          {revealed ? (
            <div className="mt-4 rounded-md bg-[var(--color-surface)] p-4 text-sm text-[var(--color-text-muted)]">
              {current.shortAnswer}{" "}
              <button
                type="button"
                onClick={() => onAnswerPanelOpenChange(true)}
                className="text-[var(--color-accent)] hover:underline"
              >
                {dict.simulator.seeFullAnswer}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onReveal}
              className="mt-4 rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text)] hover:border-[var(--color-accent)]"
            >
              {dict.simulator.revealAnswer}
            </button>
          )}

          {revealed ? (
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onAnswer("acertei")}
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
              >
                {dict.simulator.correct}
              </button>
              <button
                type="button"
                onClick={() => onAnswer("parcial")}
                className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white"
              >
                {dict.simulator.partial}
              </button>
              <button
                type="button"
                onClick={() => onAnswer("nao-sabia")}
                className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white"
              >
                {dict.simulator.unknown}
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <>
          <div className="mt-4 flex flex-col gap-2">
            {quiz?.options.map((opt, i) => {
              const isSelected = selectedOption === i;
              const isCorrectOpt = i === quiz.correctIndex;
              const isRevealed = selectedOption !== null;
              const colorClass = isRevealed
                ? isCorrectOpt
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : isSelected
                    ? "border-red-500 bg-red-500 text-white"
                    : "border-[var(--color-border)] text-[var(--color-text)]"
                : "border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-accent)]";
              return (
                <button
                  key={i}
                  type="button"
                  disabled={isRevealed}
                  onClick={() => onSelectOption(i)}
                  className={`rounded-md border px-4 py-2 text-left text-sm font-medium disabled:cursor-not-allowed ${colorClass}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {selectedOption !== null ? (
            <button
              type="button"
              onClick={onAnswerQuiz}
              className="mt-4 rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white"
            >
              {dict.simulator.nextQuestion}
            </button>
          ) : null}
        </>
      )}

      <Dialog.Root open={answerPanelOpen} onOpenChange={onAnswerPanelOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
          <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col bg-[var(--color-bg)] shadow-xl outline-none">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] p-4">
              <Dialog.Title className="text-sm font-semibold text-[var(--color-text)]">
                {current.title}
              </Dialog.Title>
              <Dialog.Close
                aria-label={dict.simulator.closeAnswerPanel}
                className="rounded-md border border-[var(--color-border)] px-3 py-1 text-sm text-[var(--color-text)] hover:border-[var(--color-accent)]"
              >
                {dict.simulator.closeAnswerPanel}
              </Dialog.Close>
            </div>
            {answerPanelOpen ? (
              <iframe
                src={`/${locale}/${tech}/perguntas/${current.slug}`}
                title={current.title}
                className="h-full w-full flex-1 border-0"
              />
            ) : null}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
