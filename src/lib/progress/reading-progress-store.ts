"use client";

export const STORAGE_KEY = "kafka-ebook:progress:v1";

export type ReadingProgress = {
  visited: string[];
  completed: string[];
  lastVisited?: string;
};

const EMPTY_PROGRESS: ReadingProgress = { visited: [], completed: [] };
const listeners = new Set<() => void>();

let cachedRaw: string | null = null;
let cachedSnapshot: ReadingProgress = EMPTY_PROGRESS;

// Confia no shape salvo sem checar poderia consumir um formato de versão antiga (a chave é
// versionada com :v1, mas só na convenção — nada força o bump) como se fosse válido, produzindo
// erro silencioso na UI em vez de cair pro estado vazio.
function isReadingProgress(value: unknown): value is ReadingProgress {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    Array.isArray(v.visited) &&
    v.visited.every((s) => typeof s === "string") &&
    Array.isArray(v.completed) &&
    v.completed.every((s) => typeof s === "string") &&
    (v.lastVisited === undefined || typeof v.lastVisited === "string")
  );
}

function readSnapshot(): ReadingProgress {
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return EMPTY_PROGRESS;
  }
  if (raw === cachedRaw) return cachedSnapshot;
  cachedRaw = raw;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : EMPTY_PROGRESS;
    cachedSnapshot = isReadingProgress(parsed) ? parsed : EMPTY_PROGRESS;
  } catch {
    cachedSnapshot = EMPTY_PROGRESS;
  }
  return cachedSnapshot;
}

function write(progress: ReadingProgress) {
  cachedSnapshot = progress;
  cachedRaw = JSON.stringify(progress);
  try {
    localStorage.setItem(STORAGE_KEY, cachedRaw);
  } catch {
    // localStorage indisponível (modo privado, quota excedida) — segue só para a sessão atual.
  }
  for (const listener of listeners) listener();
}

export function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function getSnapshot(): ReadingProgress {
  return readSnapshot();
}

export function getServerSnapshot(): ReadingProgress {
  return EMPTY_PROGRESS;
}

export function markVisited(slug: string) {
  const current = readSnapshot();
  if (current.visited.includes(slug) && current.lastVisited === slug) return;
  write({
    ...current,
    visited: current.visited.includes(slug) ? current.visited : [...current.visited, slug],
    lastVisited: slug,
  });
}

export function toggleCompleted(slug: string) {
  const current = readSnapshot();
  const isCompleted = current.completed.includes(slug);
  write({
    ...current,
    completed: isCompleted
      ? current.completed.filter((s) => s !== slug)
      : [...current.completed, slug],
  });
}
