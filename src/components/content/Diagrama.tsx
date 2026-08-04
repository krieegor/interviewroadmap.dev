import type { ReactNode } from "react";

export function Diagrama({ legenda, children }: { legenda: string; children: ReactNode }) {
  return (
    <figure className="my-8 overflow-x-auto rounded-md border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-6">
      {children}
      <figcaption className="mt-4 text-center text-sm text-[var(--color-text-muted)]">
        {legenda}
      </figcaption>
    </figure>
  );
}
