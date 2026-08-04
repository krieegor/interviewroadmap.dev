import Link from "next/link";
import { getSiteConfig } from "@/config/site";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const siteConfig = getSiteConfig(locale);

  return (
    <footer className="border-t border-[var(--color-border)] py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 text-sm text-[var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between">
        <p>
          {siteConfig.name} {dict.footer.disclaimer}
        </p>
        <div className="flex items-center gap-4">
          <Link href={`/${locale}/sobre`} className="hover:text-[var(--color-accent)]">
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
