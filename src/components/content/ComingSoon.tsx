import Link from "next/link";
import { getTechConfig } from "@/config/tech";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Tech } from "@/lib/tech/config";

export function ComingSoon({
  tech,
  locale,
  dict,
}: {
  tech: Tech;
  locale: Locale;
  dict: Dictionary;
}) {
  const techConfig = getTechConfig(tech, locale);

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-[var(--color-accent)]">
        {techConfig.name}
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-[var(--color-text)]">
        {dict.comingSoon.title}
      </h1>
      <p className="mt-4 text-[var(--color-text-muted)]">{dict.comingSoon.message}</p>
      <Link
        href={`/${locale}/home`}
        className="mt-8 inline-block text-sm font-medium text-[var(--color-accent)] hover:underline"
      >
        {dict.comingSoon.backToSelector}
      </Link>
    </div>
  );
}
