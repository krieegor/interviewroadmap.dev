import Link from "next/link";
import { getSiteConfig } from "@/config/site";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { formatTemplate } from "@/lib/i18n/format";
import type { Tech } from "@/lib/tech/config";
import { getSiteVersion } from "@/lib/version";

export function Footer({
  locale,
  tech,
  dict,
}: {
  locale: Locale;
  tech: Tech;
  dict: Dictionary;
}) {
  const siteConfig = getSiteConfig(locale);
  const version = getSiteVersion();
  const publishedAt = version
    ? new Date(version.publishedAt).toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

  return (
    <footer className="border-t border-[var(--color-border)] py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 text-sm text-[var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between">
        <p>
          {siteConfig.shortName} {dict.footer.disclaimer}
        </p>
        <div className="flex items-center gap-4">
          {version && publishedAt ? (
            <a
              href={version.url}
              target="_blank"
              rel="noreferrer"
              title={formatTemplate(dict.footer.viewRelease, { tag: version.tag })}
              className="hover:text-[var(--color-accent)]"
            >
              {version.tag} · {publishedAt}
            </a>
          ) : null}
          <Link href={`/${locale}/${tech}/sobre`} className="hover:text-[var(--color-accent)]">
            {dict.footer.sobre}
          </Link>
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-[var(--color-accent)]"
          >
            {dict.footer.github}
          </a>
        </div>
      </div>
    </footer>
  );
}
