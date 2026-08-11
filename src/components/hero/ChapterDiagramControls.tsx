"use client";

export function DiagramStepArrows({
  step,
  onGoTo,
  prevLabel,
  nextLabel,
}: {
  step: number;
  onGoTo: (index: number) => void;
  prevLabel: string;
  nextLabel: string;
}) {
  return (
    <>
      <button
        type="button"
        onClick={() => onGoTo(step - 1)}
        aria-label={prevLabel}
        className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg)]/80 text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
      >
        <span aria-hidden="true">‹</span>
      </button>
      <button
        type="button"
        onClick={() => onGoTo(step + 1)}
        aria-label={nextLabel}
        className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg)]/80 text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
      >
        <span aria-hidden="true">›</span>
      </button>
    </>
  );
}

export function DiagramStepDots({
  step,
  stepLabels,
  onGoTo,
  goToLabel,
}: {
  step: number;
  stepLabels: string[];
  onGoTo: (index: number) => void;
  goToLabel: string;
}) {
  return (
    <div className="mt-4 flex items-center justify-center gap-2">
      {stepLabels.map((label, index) => (
        <button
          key={label}
          type="button"
          onClick={() => onGoTo(index)}
          aria-label={`${goToLabel}: ${label}`}
          aria-current={index === step ? "true" : undefined}
          className={`h-2 w-2 rounded-full transition-colors ${
            index === step ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]"
          }`}
        />
      ))}
    </div>
  );
}
