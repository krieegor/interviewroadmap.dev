"use client";

import { useSyncExternalStore } from "react";

export const STORAGE_KEY = "kafka-ebook:simulator:v1";
const MAX_HISTORY = 10;

export type SimulatorResult = {
  date: string;
  level: string;
  topic: string;
  total: number;
  correct: number;
  partial: number;
  unknown: number;
};

const EMPTY_HISTORY: SimulatorResult[] = [];

const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedHistory: SimulatorResult[] = EMPTY_HISTORY;

function isSimulatorResult(value: unknown): value is SimulatorResult {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.date === "string" &&
    typeof v.level === "string" &&
    typeof v.topic === "string" &&
    typeof v.total === "number" &&
    typeof v.correct === "number" &&
    typeof v.partial === "number" &&
    typeof v.unknown === "number"
  );
}

function isSimulatorHistory(value: unknown): value is SimulatorResult[] {
  return Array.isArray(value) && value.every(isSimulatorResult);
}

function readSnapshot(): SimulatorResult[] {
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return EMPTY_HISTORY;
  }
  if (raw === cachedRaw) return cachedHistory;
  cachedRaw = raw;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : EMPTY_HISTORY;
    cachedHistory = isSimulatorHistory(parsed) ? parsed : EMPTY_HISTORY;
  } catch {
    cachedHistory = EMPTY_HISTORY;
  }
  return cachedHistory;
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getServerSnapshot(): SimulatorResult[] {
  return EMPTY_HISTORY;
}

export function readSimulatorHistory(): SimulatorResult[] {
  if (typeof window === "undefined") return EMPTY_HISTORY;
  return readSnapshot();
}

export function saveSimulatorResult(result: SimulatorResult) {
  const history = [result, ...readSnapshot()].slice(0, MAX_HISTORY);
  cachedHistory = history;
  cachedRaw = JSON.stringify(history);
  try {
    localStorage.setItem(STORAGE_KEY, cachedRaw);
  } catch {
    // localStorage indisponível — resultado não persiste, mas a sessão atual continua funcionando.
  }
  for (const listener of listeners) listener();
}

export function useSimulatorHistory(): SimulatorResult[] {
  return useSyncExternalStore(subscribe, readSnapshot, getServerSnapshot);
}
