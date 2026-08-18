"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { EnAvailability } from "@/lib/i18n/en-availability";
import type { Tech } from "@/lib/tech/config";

const SECTIONS_ALWAYS_AVAILABLE = new Set(["livro", "perguntas", "glossario", "casos", "simulador", "sobre"]);

function resolveHref(
  pathname: string,
  target: Locale,
  tech: Tech,
  enAvailable: EnAvailability,
): string {
  // Descarta locale e tech do path atual (ambos já são conhecidos): o que sobra é
  // seção/slug dentro da trilha.
  const segments = pathname.split("/").filter(Boolean).slice(2);
  if (segments.length === 0) return `/${target}/${tech}`;

  const [section, slug] = segments;
  if (!section || !SECTIONS_ALWAYS_AVAILABLE.has(section)) return `/${target}/${tech}`;
  if (!slug) return `/${target}/${tech}/${section}`;

  // pt -> en into a detail page: only link directly if that slug exists in the en pilot
  // (case studies have no en content at all), otherwise fall back to the section index.
  if (target === "en") {
    const available = section in enAvailable ? enAvailable[section as keyof EnAvailability] : [];
    return available.includes(slug) ? `/${target}/${tech}/${section}/${slug}` : `/${target}/${tech}/${section}`;
  }

  return `/${target}/${tech}/${section}/${slug}`;
}

export function LocaleSwitcher({
  locale,
  tech,
  dict,
  enAvailable,
}: {
  locale: Locale;
  tech: Tech;
  dict: Dictionary;
  enAvailable: EnAvailability;
}) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 text-xs" aria-label={dict.localeSwitcher.label}>
      {locales.map((target) => (
        <Link
          key={target}
          href={resolveHref(pathname, target, tech, enAvailable)}
          aria-current={target === locale ? "true" : undefined}
          className={`rounded-md px-2 py-1 font-medium uppercase transition-colors ${
            target === locale
              ? "text-[var(--color-accent)]"
              : "text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
          }`}
        >
          {target}
        </Link>
      ))}
    </div>
  );
}
