import Link from "next/link";
import type { ChapterPart } from "@/lib/content/chapters";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Tech } from "@/lib/tech/config";

export function BookSidebar({
  parts,
  currentSlug,
  locale,
  tech,
  dict,
  className = "",
}: {
  parts: ChapterPart[];
  currentSlug?: string;
  locale: Locale;
  tech: Tech;
  dict: Dictionary;
  className?: string;
}) {
  return (
    <nav aria-label={dict.bookSidebar.ariaLabel} className={className}>
      <ul className="flex flex-col gap-6">
        {parts.map((part) => (
          <li key={part.part}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
              {part.part}
            </p>
            <ul className="flex flex-col gap-0.5 border-l border-[var(--color-border)]">
              {part.chapters.map((chapter) => {
                const isActive = chapter.slug === currentSlug;
                return (
                  <li key={chapter.slug}>
                    <Link
                      href={`/${locale}/${tech}/livro/${chapter.slug}`}
                      aria-current={isActive ? "page" : undefined}
                      className={`-ml-px block border-l-2 py-1.5 pl-3 text-sm transition-colors ${
                        isActive
                          ? "border-[var(--color-accent)] font-medium text-[var(--color-accent)]"
                          : "border-transparent text-[var(--color-text-muted)] hover:border-[var(--color-border)] hover:text-[var(--color-text)]"
                      }`}
                    >
                      {chapter.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}
