"use client";

import { useSyncExternalStore } from "react";
import type { Answer } from "@/lib/simulator/session";
import type { Tech } from "@/lib/tech/config";

export const STORAGE_KEY = "kafka-ebook:question-progress:v1";

export type QuestionProgressEntry = {
  lastAnswer: Answer;
  lastSeenAt: string;
  timesSeen: number;
};

export type QuestionProgress = Record<string, QuestionProgressEntry>;

const EMPTY_PROGRESS: QuestionProgress = {};

const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedProgress: QuestionProgress = EMPTY_PROGRESS;

function questionKey(tech: Tech, slug: string): string {
  return `${tech}:${slug}`;
}

function isQuestionProgressEntry(value: unknown): value is QuestionProgressEntry {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    (v.lastAnswer === "acertei" || v.lastAnswer === "parcial" || v.lastAnswer === "nao-sabia") &&
    typeof v.lastSeenAt === "string" &&
    typeof v.timesSeen === "number"
  );
}

function isQuestionProgress(value: unknown): value is QuestionProgress {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return Object.values(value).every(isQuestionProgressEntry);
}

function readSnapshot(): QuestionProgress {
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return EMPTY_PROGRESS;
  }
  if (raw === cachedRaw) return cachedProgress;
  cachedRaw = raw;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : EMPTY_PROGRESS;
    cachedProgress = isQuestionProgress(parsed) ? parsed : EMPTY_PROGRESS;
  } catch {
    cachedProgress = EMPTY_PROGRESS;
  }
  return cachedProgress;
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getServerSnapshot(): QuestionProgress {
  return EMPTY_PROGRESS;
}

export function readQuestionProgress(): QuestionProgress {
  if (typeof window === "undefined") return EMPTY_PROGRESS;
  return readSnapshot();
}

export function recordQuestionAnswer(tech: Tech, slug: string, answer: Answer) {
  const current = readSnapshot();
  const key = questionKey(tech, slug);
  const previous = current[key];
  const next: QuestionProgress = {
    ...current,
    [key]: {
      lastAnswer: answer,
      lastSeenAt: new Date().toISOString(),
      timesSeen: (previous?.timesSeen ?? 0) + 1,
    },
  };
  cachedProgress = next;
  cachedRaw = JSON.stringify(next);
  try {
    localStorage.setItem(STORAGE_KEY, cachedRaw);
  } catch {
    // localStorage indisponível: a seleção da próxima rodada cai de volta pro peso "nunca visto".
  }
  for (const listener of listeners) listener();
}

// Prioriza perguntas nunca vistas ou erradas nas rodadas anteriores, sem excluir as demais. 3 = nunca
// visto ou "não sabia" na última vez; 2 = "parcial"; 1 = "acertei". Usado para ordenar a seleção do
// simulado, não pra filtrar: toda pergunta do filtro atual (nível/assunto) continua elegível.
export function getQuestionWeight(progress: QuestionProgress, tech: Tech, slug: string): number {
  const entry = progress[questionKey(tech, slug)];
  if (!entry) return 3;
  if (entry.lastAnswer === "nao-sabia") return 3;
  if (entry.lastAnswer === "parcial") return 2;
  return 1;
}

export function useQuestionProgress(): QuestionProgress {
  return useSyncExternalStore(subscribe, readSnapshot, getServerSnapshot);
}
