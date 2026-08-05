import Link from "next/link";
import { notFound } from "next/navigation";
import { getTechConfig } from "@/config/tech";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { TechIcon } from "@/components/icons/TechIcon";
import { Logo } from "@/components/icons/Logo";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { techs, techsWithContent } from "@/lib/tech/config";

export default async function LocaleHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);

  const features = [
    { title: dict.trackSelector.featureBookTitle, description: dict.trackSelector.featureBookDescription },
    {
      title: dict.trackSelector.featureQuestionsTitle,
      description: dict.trackSelector.featureQuestionsDescription,
    },
    {
      title: dict.trackSelector.featureGlossaryTitle,
      description: dict.trackSelector.featureGlossaryDescription,
    },
    {
      title: dict.trackSelector.featureSimulatorTitle,
      description: dict.trackSelector.featureSimulatorDescription,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text)]">
          <Logo className="text-[var(--color-accent)]" />
          {siteConfig.shortName}
        </span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs">
            {locales.map((target) => (
              <Link
                key={target}
                href={`/${target}`}
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
          <ThemeToggle dict={dict} />
        </div>
      </div>

      <main id="conteudo-principal" className="mx-auto w-full max-w-4xl flex-1 px-4 py-16">
        <div className="flex flex-col items-center text-center">
          <Logo className="h-12 w-12 text-[var(--color-accent)]" />
          <p className="mt-4 text-sm font-medium uppercase tracking-wide text-[var(--color-accent)]">
            {dict.trackSelector.badge}
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-[var(--color-text)]">
            {dict.trackSelector.heroTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-[var(--color-text-muted)]">
            {dict.trackSelector.heroIntro}
          </p>
        </div>

        <section className="mt-16">
          <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            {dict.trackSelector.howItWorksTitle}
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-md border border-[var(--color-border)] p-4"
              >
                <p className="font-medium text-[var(--color-text)]">{feature.title}</p>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            {dict.trackSelector.title}
          </h2>
          <p className="mt-2 text-center text-[var(--color-text-muted)]">{dict.trackSelector.intro}</p>

          <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
            {techs.map((tech) => {
              const techConfig = getTechConfig(tech, locale);
              const hasContent = techsWithContent.includes(tech);
              return (
                <Link
                  key={tech}
                  href={`/${locale}/${tech}`}
                  className="flex flex-col gap-2 rounded-md border border-[var(--color-border)] p-6 text-left transition-colors hover:border-[var(--color-accent)]"
                >
                  <TechIcon tech={tech} className="text-[var(--color-accent)]" />
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-[var(--color-text)]">
                      {techConfig.shortName}
                    </span>
                    {!hasContent ? (
                      <span className="rounded-full border border-[var(--color-border)] px-2 py-0.5 text-xs text-[var(--color-text-muted)]">
                        {dict.trackSelector.comingSoonBadge}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)]">{techConfig.description}</p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-16 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center">
          <p className="text-sm text-[var(--color-text-muted)]">{dict.trackSelector.openSourceText}</p>
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-sm font-medium text-[var(--color-accent)] hover:underline"
          >
            {dict.trackSelector.githubCta}
          </a>
        </section>
      </main>
    </div>
  );
}
