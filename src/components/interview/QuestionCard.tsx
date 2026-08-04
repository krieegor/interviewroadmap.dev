import Link from "next/link";
import type { QuestionFrontmatter } from "@/types/content";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { formatTemplate } from "@/lib/i18n/format";
import { LevelBadge } from "./LevelBadge";

export function QuestionCard({
  question,
  locale,
  dict,
}: {
  question: QuestionFrontmatter;
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <Link
      href={`/${locale}/perguntas/${question.slug}`}
      className="flex flex-col gap-2 rounded-md border border-[var(--color-border)] p-4 transition-colors hover:border-[var(--color-accent)]"
    >
      <span className="text-xs font-medium text-[var(--color-text-muted)]">
        {formatTemplate(dict.perguntasIndex.questionLabel, { id: question.id })}
      </span>
      <span className="font-medium text-[var(--color-text)]">{question.title}</span>
      <div className="flex flex-wrap gap-1.5">
        {question.level.map((level) => (
          <LevelBadge key={level} level={level} dict={dict} />
        ))}
      </div>
    </Link>
  );
}
