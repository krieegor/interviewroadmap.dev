"use client";

import { THEME_STORAGE_KEY } from "./theme-script";

const listeners = new Set<() => void>();

export function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

export function getSnapshot(): boolean {
  return document.documentElement.classList.contains("dark");
}

export function getServerSnapshot(): boolean {
  return false;
}

export function setTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, dark ? "dark" : "light");
  } catch {
    // localStorage indisponível — o tema muda apenas para a sessão atual, sem persistência.
  }
  for (const listener of listeners) listener();
}
