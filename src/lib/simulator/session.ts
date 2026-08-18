import type { QuestionFrontmatter } from "@/types/content";

export type Answer = "acertei" | "parcial" | "nao-sabia";
export type Mode = "aberta" | "multipla-escolha";
export type ShuffledQuiz = { options: string[]; correctIndex: number };

export const QUESTION_COUNT_OPTIONS = [5, 10, 15, 20, 30, 50] as const;
export type QuestionCount = (typeof QUESTION_COUNT_OPTIONS)[number];

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = temp;
  }
  return copy;
}

// Agrupa por peso (maior primeiro) e embaralha dentro de cada grupo, em vez de embaralhar tudo junto:
// dá pra priorizar perguntas nunca vistas/erradas (peso maior) sem excluir as demais nem perder a
// aleatoriedade entre perguntas do mesmo peso. Usado pela seleção do simulado (ver getQuestionWeight em
// src/lib/progress/question-progress.ts).
export function selectByWeight<T>(items: T[], getWeight: (item: T) => number, count: number): T[] {
  const groups = new Map<number, T[]>();
  for (const item of items) {
    const weight = getWeight(item);
    const group = groups.get(weight) ?? [];
    group.push(item);
    groups.set(weight, group);
  }
  const orderedWeights = Array.from(groups.keys()).sort((a, b) => b - a);
  const ordered = orderedWeights.flatMap((weight) => shuffle(groups.get(weight)!));
  return ordered.slice(0, count);
}

export function shuffleQuiz(question: QuestionFrontmatter): ShuffledQuiz {
  const order = shuffle(question.quiz.options.map((_, i) => i));
  return {
    options: order.map((i) => question.quiz.options[i]!),
    correctIndex: order.indexOf(question.quiz.correctIndex),
  };
}

export function scoreAnswers(answers: Answer[]) {
  return {
    correct: answers.filter((a) => a === "acertei").length,
    partial: answers.filter((a) => a === "parcial").length,
    unknown: answers.filter((a) => a === "nao-sabia").length,
  };
}

export function formatDuration(totalMs: number): string {
  const totalSeconds = Math.max(0, Math.round(totalMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
