import type { ReactNode } from "react";

export function Comparacao({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="comparacao-card my-6 overflow-x-auto rounded-md border border-[var(--color-border)]">
      {title ? (
        <p className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-2 text-sm font-semibold text-[var(--color-text)]">
          {title}
        </p>
      ) : null}
      <div className="[&_table]:my-0 [&_table]:border-0 [&_td]:border-0 [&_th]:border-0 [&_tr:not(:last-child)]:border-b [&_tr]:border-[var(--color-border)]">
        {children}
      </div>
    </div>
  );
}
