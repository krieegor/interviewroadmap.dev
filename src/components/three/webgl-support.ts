"use client";

import { useSyncExternalStore } from "react";

export function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

// Suporte a WebGL não muda em runtime — não precisa de subscribe real, só de uma leitura
// segura entre servidor (sempre `false`) e cliente, sem cair no padrão setState-em-effect.
function subscribe() {
  return () => {};
}

function getServerSnapshot() {
  return false;
}

export function useHasWebGL(): boolean {
  return useSyncExternalStore(subscribe, hasWebGL, getServerSnapshot);
}
