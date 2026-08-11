"use client";

import { useEffect, useState } from "react";

export function useStepCarousel(stepCount: number, autoplay: boolean, intervalMs: number) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!autoplay || stepCount <= 1) return;
    const id = setInterval(() => {
      setStep((s) => (s + 1) % stepCount);
    }, intervalMs);
    return () => clearInterval(id);
  }, [step, autoplay, stepCount, intervalMs]);

  function goTo(index: number) {
    setStep(((index % stepCount) + stepCount) % stepCount);
  }

  return { step, goTo, next: () => goTo(step + 1), prev: () => goTo(step - 1) };
}
