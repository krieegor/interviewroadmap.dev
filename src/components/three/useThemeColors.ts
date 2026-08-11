"use client";

import { useMemo, useSyncExternalStore } from "react";
import * as THREE from "three";
import { getServerSnapshot, getSnapshot, subscribe } from "@/lib/theme-store";

function readColor(varName: string): THREE.Color {
  const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return new THREE.Color(value || "#000000");
}

export type SceneColors = {
  bg: THREE.Color;
  accent: THREE.Color;
  accentSubtle: THREE.Color;
  border: THREE.Color;
  surface: THREE.Color;
  text: THREE.Color;
  textMuted: THREE.Color;
};

export function useThemeColors(): SceneColors {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return useMemo(
    () => ({
      bg: readColor("--color-bg"),
      accent: readColor("--color-accent"),
      accentSubtle: readColor("--color-accent-subtle"),
      border: readColor("--color-border"),
      surface: readColor("--color-surface"),
      text: readColor("--color-text"),
      textMuted: readColor("--color-text-muted"),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- isDark fully determines every --color-* token
    [isDark],
  );
}
