"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  getServerSnapshot,
  getSnapshot,
  markVisited,
  subscribe,
  toggleCompleted,
  type ReadingProgress,
} from "./reading-progress-store";

export type { ReadingProgress };

export function useReadingProgress(currentSlug?: string) {
  const progress = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (currentSlug) markVisited(currentSlug);
  }, [currentSlug]);

  return { progress, toggleCompleted };
}
