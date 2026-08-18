"use client";

import { useMemo, useState } from "react";
import type { InterviewLevel, QuestionFrontmatter } from "@/types/content";
import { saveSimulatorResult } from "@/lib/progress/simulator-progress";
import { getQuestionWeight, readQuestionProgress, recordQuestionAnswer } from "@/lib/progress/question-progress";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Tech } from "@/lib/tech/config";
import {
  type Answer,
  type Mode,
  type QuestionCount,
  type ShuffledQuiz,
  scoreAnswers,
  selectByWeight,
  shuffleQuiz,
} from "@/lib/simulator/session";
import { SimulatorConfig } from "./SimulatorConfig";
import { SimulatorQuestion } from "./SimulatorQuestion";
import { SimulatorResult } from "./SimulatorResult";

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
  const [questionCount, setQuestionCount] = useState<QuestionCount>(10);
  const [session, setSession] = useState<QuestionFrontmatter[] | null>(null);
  const [quizByIndex, setQuizByIndex] = useState<ShuffledQuiz[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [answerPanelOpen, setAnswerPanelOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [questionStartedAt, setQuestionStartedAt] = useState(() => Date.now());
  const [times, setTimes] = useState<number[]>([]);

  function start() {
    const filtered = questions.filter(
      (q) =>
        (level === "todos" || q.level.includes(level)) &&
        (topic === "todos" || q.topics.includes(topic)),
    );
    // Prioriza perguntas nunca vistas ou erradas nas rodadas anteriores (ver
    // src/lib/progress/question-progress.ts), sem excluir as demais nem perder aleatoriedade dentro do
    // mesmo nível de prioridade.
    const progress = readQuestionProgress();
    const selected = selectByWeight(
      filtered,
      (q) => getQuestionWeight(progress, tech, q.slug),
      questionCount,
    );
    setSession(selected);
    setQuizByIndex(selected.map(shuffleQuiz));
    setIndex(0);
    setRevealed(false);
    setAnswerPanelOpen(false);
    setSelectedOption(null);
    setAnswers([]);
    setTimes([]);
    setQuestionStartedAt(Date.now());
  }

  function recordAnswer(value: Answer) {
    const next = [...answers, value];
    setAnswers(next);
    setRevealed(false);
    setAnswerPanelOpen(false);
    setSelectedOption(null);

    const nextTimes = [...times, Date.now() - questionStartedAt];
    setTimes(nextTimes);

    if (!session) return;
    const current = session[index];
    if (current) recordQuestionAnswer(tech, current.slug, value);
    if (index + 1 < session.length) {
      setIndex(index + 1);
      setQuestionStartedAt(Date.now());
    } else {
      saveSimulatorResult({
        date: new Date().toISOString(),
        level,
        topic,
        mode,
        total: next.length,
        totalTimeMs: nextTimes.reduce((sum, t) => sum + t, 0),
        ...scoreAnswers(next),
      });
      setIndex(session.length);
    }
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
    setTimes([]);
  }

  if (!session) {
    return (
      <SimulatorConfig
        topics={topics}
        level={level}
        topic={topic}
        mode={mode}
        questionCount={questionCount}
        onLevelChange={setLevel}
        onTopicChange={setTopic}
        onModeChange={setMode}
        onQuestionCountChange={setQuestionCount}
        onStart={start}
        dict={dict}
      />
    );
  }

  if (session.length === 0) {
    return (
      <div className="rounded-md border border-[var(--color-border)] p-6 text-sm text-[var(--color-text-muted)]">
        {dict.simulator.noQuestionsFound}
        <button type="button" onClick={restart} className="ml-2 text-[var(--color-accent)] underline">
          {dict.simulator.back}
        </button>
      </div>
    );
  }

  const finished = index >= session.length;

  if (finished) {
    return (
      <SimulatorResult
        total={session.length}
        level={level}
        mode={mode}
        totalTimeMs={times.reduce((sum, t) => sum + t, 0)}
        {...scoreAnswers(answers)}
        onRestart={restart}
        dict={dict}
      />
    );
  }

  const current = session[index];
  if (!current) return null;

  return (
    <SimulatorQuestion
      current={current}
      index={index}
      total={session.length}
      mode={mode}
      questionStartedAt={questionStartedAt}
      revealed={revealed}
      onReveal={() => setRevealed(true)}
      onAnswer={recordAnswer}
      quiz={quizByIndex[index]}
      selectedOption={selectedOption}
      onSelectOption={setSelectedOption}
      onAnswerQuiz={answerQuiz}
      answerPanelOpen={answerPanelOpen}
      onAnswerPanelOpenChange={setAnswerPanelOpen}
      locale={locale}
      tech={tech}
      dict={dict}
    />
  );
}
