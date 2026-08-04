import type { ChapterHeading } from "@/lib/content/chapters";

export function TableOfContents({
  headings,
  title,
}: {
  headings: ChapterHeading[];
  title: string;
}) {
  if (headings.length === 0) return null;

  return (
    <nav aria-label={title}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
        {title}
      </p>
      <ul className="flex flex-col gap-1.5 border-l border-[var(--color-border)] text-sm">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.depth === 3 ? "pl-6" : "pl-3"}>
            <a
              href={`#${heading.id}`}
              className="-ml-px block border-l-2 border-transparent py-0.5 text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-border)] hover:text-[var(--color-text)]"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
