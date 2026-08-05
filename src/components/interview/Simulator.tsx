"use client";

import { useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import type { InterviewLevel, QuestionFrontmatter } from "@/types/content";
import { saveSimulatorResult } from "@/lib/progress/simulator-progress";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Tech } from "@/lib/tech/config";
import { formatTemplate } from "@/lib/i18n/format";

type Answer = "acertei" | "parcial" | "nao-sabia";
type Mode = "aberta" | "multipla-escolha";
type ShuffledQuiz = { options: string[]; correctIndex: number };

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = temp;
  }
  return copy;
}

export function Simulator({
  questions,
  locale,
  tech,
  dict,
}: {
  questions: QuestionFrontmatter[];
  locale: Locale;
  tech: Tech;
  dict: Dictionary;
}) {
  const topics = useMemo(
    () => Array.from(new Set(questions.flatMap((q) => q.topics))).sort(),
    [questions],
  );

  const [level, setLevel] = useState<InterviewLevel | "todos">("todos");
  const [topic, setTopic] = useState<string>("todos");
  const [mode, setMode] = useState<Mode>("aberta");
  const [session, setSession] = useState<QuestionFrontmatter[] | null>(null);
  const [quizByIndex, setQuizByIndex] = useState<ShuffledQuiz[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [answerPanelOpen, setAnswerPanelOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);

  function shuffleQuiz(q: QuestionFrontmatter): ShuffledQuiz {
    const order = shuffle(q.quiz.options.map((_, i) => i));
    return {
      options: order.map((i) => q.quiz.options[i]!),
      correctIndex: order.indexOf(q.quiz.correctIndex),
    };
  }

  function start() {
    const filtered = questions.filter(
      (q) =>
        (level === "todos" || q.level.includes(level)) &&
        (topic === "todos" || q.topics.includes(topic)),
    );
    const shuffled = shuffle(filtered);
    setSession(shuffled);
    setQuizByIndex(shuffled.map(shuffleQuiz));
    setIndex(0);
    setRevealed(false);
    setAnswerPanelOpen(false);
    setSelectedOption(null);
    setAnswers([]);
  }

  function recordAnswer(value: Answer) {
    const next = [...answers, value];
    setAnswers(next);
    setRevealed(false);
    setAnswerPanelOpen(false);
    setSelectedOption(null);

    if (!session) return;
    if (index + 1 < session.length) {
      setIndex(index + 1);
    } else {
      saveSimulatorResult({
        date: new Date().toISOString(),
        level,
        topic,
        total: next.length,
        correct: next.filter((a) => a === "acertei").length,
        partial: next.filter((a) => a === "parcial").length,
        unknown: next.filter((a) => a === "nao-sabia").length,
      });
      setIndex(session.length);
    }
  }

  function answer(value: Answer) {
    recordAnswer(value);
  }

  function answerQuiz() {
    if (selectedOption === null) return;
    const correct = selectedOption === quizByIndex[index]?.correctIndex;
    recordAnswer(correct ? "acertei" : "nao-sabia");
  }

  function restart() {
    setSession(null);
    setIndex(0);
    setRevealed(false);
    setAnswerPanelOpen(false);
    setSelectedOption(null);
    setAnswers([]);
  }

  if (!session) {
    return (
      <div className="rounded-md border border-[var(--color-border)] p-6">
        <h2 className="text-lg font-semibold text-[var(--color-text)]">
          {dict.simulator.configureTitle}
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-[var(--color-text)]">{dict.simulator.levelLabel}</span>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as InterviewLevel | "todos")}
              className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2"
            >
              <option value="todos">{dict.simulator.allLevels}</option>
              <option value="pleno">{dict.simulator.levelLabels.pleno}</option>
              <option value="senior">{dict.simulator.levelLabels.senior}</option>
              <option value="tech-lead">{dict.simulator.levelLabels["tech-lead"]}</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-[var(--color-text)]">{dict.simulator.topicLabel}</span>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2"
            >
              <option value="todos">{dict.simulator.allTopics}</option>
              {topics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        </div>
        <fieldset className="mt-4">
          <legend className="text-sm font-medium text-[var(--color-text)]">
            {dict.simulator.modeLabel}
          </legend>
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(["aberta", "multipla-escolha"] as const).map((m) => (
              <label
                key={m}
                className={`cursor-pointer rounded-md border p-3 text-sm ${
                  mode === m ? "border-[var(--color-accent)]" : "border-[var(--color-border)]"
                }`}
              >
                <input
                  type="radio"
                  name="mode"
                  className="sr-only"
                  checked={mode === m}
                  onChange={() => setMode(m)}
                />
                <span className="font-medium text-[var(--color-text)]">
                  {dict.simulator.modeLabels[m]}
                </span>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  {dict.simulator.modeDescriptions[m]}
                </p>
              </label>
            ))}
          </div>
        </fieldset>
        <button
          type="button"
          onClick={start}
          className="mt-6 rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white"
        >
          {dict.simulator.startButton}
        </button>
      </div>
    );
  }

  if (session.length === 0) {
    return (
      <div className="rounded-md border border-[var(--color-border)] p-6 text-sm text-[var(--color-text-muted)]">
        {dict.simulator.noQuestionsFound}
        <button
          type="button"
          onClick={restart}
          className="ml-2 text-[var(--color-accent)] underline"
        >
          {dict.simulator.back}
        </button>
      </div>
    );
  }

  const finished = index >= session.length;

  if (finished) {
    const correct = answers.filter((a) => a === "acertei").length;
    const partial = answers.filter((a) => a === "parcial").length;
    const unknown = answers.filter((a) => a === "nao-sabia").length;

    return (
      <div className="rounded-md border border-[var(--color-border)] p-6">
        <h2 className="text-lg font-semibold text-[var(--color-text)]">{dict.simulator.resultTitle}</h2>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          {formatTemplate(dict.simulator.questionsCount, { count: session.length })}{" "}
          {level === "todos" ? dict.simulator.allLevelsResult : dict.simulator.levelLabels[level]}
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-md bg-[var(--color-surface)] p-3">
            <p className="text-2xl font-semibold text-emerald-600">{correct}</p>
            <p className="text-xs text-[var(--color-text-muted)]">{dict.simulator.correct}</p>
          </div>
          <div className="rounded-md bg-[var(--color-surface)] p-3">
            <p className="text-2xl font-semibold text-amber-600">{partial}</p>
            <p className="text-xs text-[var(--color-text-muted)]">{dict.simulator.partial}</p>
          </div>
          <div className="rounded-md bg-[var(--color-surface)] p-3">
            <p className="text-2xl font-semibold text-red-500">{unknown}</p>
            <p className="text-xs text-[var(--color-text-muted)]">{dict.simulator.unknown}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={restart}
          className="mt-6 rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text)] hover:border-[var(--color-accent)]"
        >
          {dict.simulator.restart}
        </button>
      </div>
    );
  }

  const current = session[index];
  if (!current) return null;

  return (
    <div className="rounded-md border border-[var(--color-border)] p-6">
      <p className="text-xs font-medium text-[var(--color-text-muted)]">
        {formatTemplate(dict.simulator.questionOf, { index: index + 1, total: session.length })}
      </p>
      <h2 className="mt-2 text-lg font-semibold text-[var(--color-text)]">{current.title}</h2>

      {mode === "aberta" ? (
        <>
          {revealed ? (
            <div className="mt-4 rounded-md bg-[var(--color-surface)] p-4 text-sm text-[var(--color-text-muted)]">
              {current.shortAnswer}{" "}
              <button
                type="button"
                onClick={() => setAnswerPanelOpen(true)}
                className="text-[var(--color-accent)] hover:underline"
              >
                {dict.simulator.seeFullAnswer}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="mt-4 rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text)] hover:border-[var(--color-accent)]"
            >
              {dict.simulator.revealAnswer}
            </button>
          )}

          {revealed ? (
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => answer("acertei")}
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
              >
                {dict.simulator.correct}
              </button>
              <button
                type="button"
                onClick={() => answer("parcial")}
                className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white"
              >
                {dict.simulator.partial}
              </button>
              <button
                type="button"
                onClick={() => answer("nao-sabia")}
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
            {quizByIndex[index]?.options.map((opt, i) => {
              const isSelected = selectedOption === i;
              const isCorrectOpt = i === quizByIndex[index]?.correctIndex;
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
                  onClick={() => setSelectedOption(i)}
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
              onClick={answerQuiz}
              className="mt-4 rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white"
            >
              {dict.simulator.nextQuestion}
            </button>
          ) : null}
        </>
      )}

      <Dialog.Root open={answerPanelOpen} onOpenChange={setAnswerPanelOpen}>
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
