"use client";

const STORAGE_KEY = "kafka-ebook:progress:v1";

export type ReadingProgress = {
  visited: string[];
  completed: string[];
  lastVisited?: string;
};

const EMPTY_PROGRESS: ReadingProgress = { visited: [], completed: [] };
const listeners = new Set<() => void>();

let cachedRaw: string | null = null;
let cachedSnapshot: ReadingProgress = EMPTY_PROGRESS;

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
    cachedSnapshot = raw ? (JSON.parse(raw) as ReadingProgress) : EMPTY_PROGRESS;
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
