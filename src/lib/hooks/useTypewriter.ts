"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type TypewriterPhase = "typing" | "pausing" | "deleting";

type TypewriterOptions = {
  typingMs?: number;
  deletingMs?: number;
  pauseMs?: number;
};

export function useTypewriter(words: string[], options?: TypewriterOptions): string {
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay] = useState("");
  const stateRef = useRef({ wordIndex: 0, charIndex: 0, phase: "typing" as TypewriterPhase });

  // `words`/`options` são lidos via ref (sincronizado em efeito próprio, sem dependências —
  // roda a cada commit) em vez de entrarem nas deps do efeito do timer: um array/objeto novo por
  // render (comum quando o chamador passa um literal inline) não pode reiniciar a cadeia de timers
  // no meio de uma pausa/exclusão.
  const wordsRef = useRef(words);
  const optionsRef = useRef(options);
  useEffect(() => {
    wordsRef.current = words;
    optionsRef.current = options;
  });

  useEffect(() => {
    if (prefersReducedMotion || wordsRef.current.length === 0) {
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout>;

    function tick() {
      const { typingMs = 60, deletingMs = 30, pauseMs = 1400 } = optionsRef.current ?? {};
      const words = wordsRef.current;
      const s = stateRef.current;
      const word = words[s.wordIndex % words.length]!;

      if (s.phase === "typing") {
        s.charIndex++;
        setDisplay(word.slice(0, s.charIndex));
        if (s.charIndex === word.length) {
          s.phase = "pausing";
          timeoutId = setTimeout(tick, pauseMs);
        } else {
          timeoutId = setTimeout(tick, typingMs);
        }
      } else if (s.phase === "pausing") {
        s.phase = "deleting";
        timeoutId = setTimeout(tick, deletingMs);
      } else {
        s.charIndex--;
        setDisplay(word.slice(0, s.charIndex));
        if (s.charIndex === 0) {
          s.phase = "typing";
          s.wordIndex++;
        }
        timeoutId = setTimeout(tick, deletingMs);
      }
    }

    timeoutId = setTimeout(tick, optionsRef.current?.typingMs ?? 60);
    return () => clearTimeout(timeoutId);
  }, [prefersReducedMotion]);

  if (prefersReducedMotion || words.length === 0) {
    return words[0] ?? "";
  }
  return display;
}
