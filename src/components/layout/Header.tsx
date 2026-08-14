import Link from "next/link";
import { getTopNav } from "@/config/navigation";
import { getSiteConfig } from "@/config/site";
import { getTechConfig } from "@/config/tech";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileNav } from "@/components/layout/MobileNav";
import { SearchDialog } from "@/components/ui/SearchDialog";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { Logo } from "@/components/icons/Logo";
import { Wordmark } from "@/components/icons/Wordmark";
import { getEnAvailability } from "@/lib/i18n/en-availability";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Tech } from "@/lib/tech/config";

export async function Header({
  locale,
  tech,
  dict,
}: {
  locale: Locale;
  tech: Tech;
  dict: Dictionary;
}) {
  const enAvailable = await getEnAvailability(tech);
  const siteConfig = getSiteConfig(locale);
  const techConfig = getTechConfig(tech, locale);
  const topNav = getTopNav(locale, tech, dict);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 sm:gap-4">
        <MobileNav locale={locale} tech={tech} dict={dict} />
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={`/${locale}/home`}
            aria-label={siteConfig.shortName}
            className="group flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text)] sm:text-base"
          >
            <Logo className="text-[var(--color-accent)]" />
            <span className="hidden sm:inline">
              <Wordmark />
            </span>
          </Link>
          <Link
            href={`/${locale}/home`}
            aria-label={dict.trackSwitcher.backToSelector}
            className="rounded-full border border-[var(--color-border)] px-2 py-0.5 text-xs text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            {techConfig.shortName}
          </Link>
        </div>
        <nav aria-label={dict.header.mainNavLabel} className="hidden flex-1 lg:block">
          <ul className="flex items-center gap-1 text-sm">
            {topNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-md px-3 py-2 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <SearchDialog tech={tech} locale={locale} dict={dict} />
          <LocaleSwitcher locale={locale} tech={tech} dict={dict} enAvailable={enAvailable} />
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={dict.header.githubLabel}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--color-border)] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.58 2 12.17c0 4.49 2.87 8.3 6.84 9.64.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.61-3.37-1.2-3.37-1.2-.45-1.18-1.11-1.49-1.11-1.49-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.55 2.36 1.1 2.94.84.09-.66.35-1.1.64-1.36-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.4 9.4 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.17C22 6.58 17.52 2 12 2Z" />
            </svg>
          </a>
          <ThemeToggle dict={dict} />
        </div>
      </div>
    </header>
  );
}
