import Link from "next/link";
import type { ChapterFrontmatter } from "@/types/content";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Tech } from "@/lib/tech/config";

export function ChapterPager({
  previous,
  next,
  locale,
  tech,
  dict,
}: {
  previous: ChapterFrontmatter | null;
  next: ChapterFrontmatter | null;
  locale: Locale;
  tech: Tech;
  dict: Dictionary;
}) {
  if (!previous && !next) return null;

  return (
    <nav
      aria-label={dict.chapterPager.ariaLabel}
      className="mt-12 grid grid-cols-1 gap-4 border-t border-[var(--color-border)] pt-6 sm:grid-cols-2"
    >
      <div>
        {previous ? (
          <Link
            href={`/${locale}/${tech}/livro/${previous.slug}`}
            className="group flex flex-col rounded-md border border-[var(--color-border)] p-4 transition-colors hover:border-[var(--color-accent)]"
          >
            <span className="text-xs text-[var(--color-text-muted)]">{dict.chapterPager.previous}</span>
            <span className="font-medium text-[var(--color-text)] group-hover:text-[var(--color-accent)]">
              {previous.title}
            </span>
          </Link>
        ) : null}
      </div>
      <div>
        {next ? (
          <Link
            href={`/${locale}/${tech}/livro/${next.slug}`}
            className="group flex flex-col rounded-md border border-[var(--color-border)] p-4 text-right transition-colors hover:border-[var(--color-accent)]"
          >
            <span className="text-xs text-[var(--color-text-muted)]">{dict.chapterPager.next}</span>
            <span className="font-medium text-[var(--color-text)] group-hover:text-[var(--color-accent)]">
              {next.title}
            </span>
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
