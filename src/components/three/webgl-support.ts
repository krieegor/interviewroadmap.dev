"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";

export function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

// Suporte a WebGL não muda em runtime: não precisa de subscribe real, só de uma leitura
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

function isPrintMedia(): boolean {
  return typeof window !== "undefined" && window.matchMedia("print").matches;
}

// A geração do PDF do livro (scripts/generate-pdf.ts) renderiza a mesma página via Playwright/
// Chromium headless com `page.emulateMedia({ media: "print" })`. O canvas WebGL dos diagramas 3D
// não sobrevive a essa captura de impressão (sai em branco, e os rótulos <Html> do drei somem);
// forçar o fallback SVG sob `@media print` evita diagramas quebrados no PDF.
function subscribePrintMedia(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("print");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getPrintServerSnapshot() {
  return false;
}

export function usePrintMedia(): boolean {
  return useSyncExternalStore(subscribePrintMedia, isPrintMedia, getPrintServerSnapshot);
}

export function useShouldRender3D(): boolean {
  const prefersReducedMotion = useReducedMotion();
  const supportsWebGL = useHasWebGL();
  const isPrint = usePrintMedia();
  return supportsWebGL && !prefersReducedMotion && !isPrint;
}
