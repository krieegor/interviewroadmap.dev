import type { ReactNode } from "react";

type CalloutTone = "neutral" | "amber" | "accent" | "red" | "emerald";

const toneClasses: Record<CalloutTone, string> = {
  neutral: "border-l-[var(--color-text-muted)]",
  amber: "border-l-amber-500",
  accent: "border-l-[var(--color-accent)]",
  red: "border-l-red-500",
  emerald: "border-l-emerald-500",
};

export function Callout({
  title,
  tone = "neutral",
  icon,
  children,
}: {
  title: string;
  tone?: CalloutTone;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      className={`my-6 rounded-r-md border-l-4 bg-[var(--color-surface)] px-4 py-3 ${toneClasses[tone]}`}
      role="note"
    >
      <p className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[var(--color-text)]">
        {icon}
        {title}
      </p>
      <div className="text-sm leading-relaxed text-[var(--color-text-muted)] [&>p]:my-1.5 [&_a]:text-[var(--color-accent)]">
        {children}
      </div>
    </div>
  );
}
