import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTechConfig } from "@/config/tech";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { TechIcon } from "@/components/icons/TechIcon";
import { Logo } from "@/components/icons/Logo";
import { Wordmark } from "@/components/icons/Wordmark";
import { AnimatedWordmark } from "@/components/hero/AnimatedWordmark";
import { HeroTypewriter } from "@/components/hero/HeroTypewriter";
import { GithubCtaLink } from "@/components/hero/GithubCtaLink";
import { Reveal } from "@/components/motion/Reveal";
import { RevealGroup, RevealItem } from "@/components/motion/RevealGroup";
import { HoverLift } from "@/components/motion/HoverLift";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { formatTemplate } from "@/lib/i18n/format";
import { techs, techsWithContent } from "@/lib/tech/config";
import { buildAlternates } from "@/lib/seo";
import { getSiteVersion } from "@/lib/version";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  return { alternates: buildAlternates(rawLocale, "/home") };
}

export default async function LocaleHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const version = getSiteVersion();
  const publishedAt = version
    ? new Date(version.publishedAt).toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

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
        <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text)] sm:text-base">
          <Logo className="text-[var(--color-accent)]" />
          <span className="hidden sm:inline">
            <Wordmark />
          </span>
        </span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs">
            {locales.map((target) => (
              <Link
                key={target}
                href={`/${target}/home`}
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
          <Reveal>
            <Logo className="h-20 w-20 text-[var(--color-accent)]" />
          </Reveal>
          <Reveal delay={0.08} className="mt-4">
            <p className="text-sm font-medium uppercase tracking-wide text-[var(--color-accent)]">
              {dict.trackSelector.badge}
            </p>
          </Reveal>
          <Reveal delay={0.16} className="mt-3">
            <h1 className="text-3xl font-semibold text-[var(--color-text)] sm:text-4xl">
              <AnimatedWordmark />
            </h1>
          </Reveal>
          <Reveal delay={0.24} className="mt-4 max-w-2xl">
            <p className="text-[var(--color-text-muted)]">{dict.trackSelector.heroIntro}</p>
          </Reveal>
          <Reveal delay={0.32}>
            <HeroTypewriter
              label={dict.trackSelector.tracksLabel}
              words={techs.map((tech) => getTechConfig(tech, locale).shortName)}
            />
          </Reveal>
        </div>

        <section className="mt-16">
          <Reveal>
            <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
              {dict.trackSelector.howItWorksTitle}
            </h2>
          </Reveal>
          <RevealGroup className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <RevealItem key={feature.title} className="h-full">
                <HoverLift className="flex h-full flex-col rounded-md border border-[var(--color-border)] p-4 transition-colors hover:border-[var(--color-accent)]">
                  <p className="font-medium text-[var(--color-text)]">{feature.title}</p>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">{feature.description}</p>
                </HoverLift>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>

        <section className="mt-16">
          <Reveal>
            <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
              {dict.trackSelector.title}
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="mt-2">
            <p className="text-center text-[var(--color-text-muted)]">{dict.trackSelector.intro}</p>
          </Reveal>

          <RevealGroup className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
            {techs.map((tech) => {
              const techConfig = getTechConfig(tech, locale);
              const hasContent = techsWithContent.includes(tech);
              return (
                <RevealItem key={tech} className="h-full">
                  <Link
                    href={`/${locale}/${tech}`}
                    data-tech={tech}
                    className="flex h-full flex-col rounded-md border border-[var(--color-border)] transition-colors hover:border-[var(--color-accent)] active:scale-[0.99]"
                  >
                    <HoverLift className="flex h-full flex-col gap-2 p-6 text-left">
                      <TechIcon tech={tech} className="text-[var(--color-accent)]" />
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-[var(--color-text)]">
                          {techConfig.shortName}
                        </span>
                        <span
                          className={
                            hasContent
                              ? "rounded-full border border-emerald-600/40 bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-400"
                              : "rounded-full border border-[var(--color-border)] px-2 py-0.5 text-xs text-[var(--color-text-muted)]"
                          }
                        >
                          {hasContent ? (
                            dict.trackSelector.availableBadge
                          ) : (
                            <>
                              <span className="text-red-600 dark:text-red-400">
                                {dict.trackSelector.unavailableBadge}
                              </span>{" "}
                              · {dict.trackSelector.unavailableBadgeSuffix}
                            </>
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--color-text-muted)]">{techConfig.description}</p>
                    </HoverLift>
                  </Link>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </section>

        <Reveal className="mt-16 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center">
          <p className="text-sm text-[var(--color-text-muted)]">{dict.trackSelector.openSourceText}</p>
          <GithubCtaLink href={siteConfig.githubUrl} label={dict.trackSelector.githubCta} />
        </Reveal>
      </main>

      <footer className="border-t border-[var(--color-border)] py-10">
        <div className="mx-auto max-w-4xl px-4">
          <p className="text-sm font-semibold text-[var(--color-text)]">{dict.sobre.authorTitle}</p>
          <div className="mt-3 flex flex-col gap-4 text-sm text-[var(--color-text-muted)] sm:flex-row sm:items-center">
            {siteConfig.author.avatar ? (
              <Image
                src={siteConfig.author.avatar}
                alt={siteConfig.author.name}
                width={64}
                height={64}
                className="h-16 w-16 shrink-0 rounded-full border border-[var(--color-border)] object-cover"
              />
            ) : null}
            <div>
              <p className="font-medium text-[var(--color-text)]">{siteConfig.author.name}</p>
              {siteConfig.author.bio ? <p className="mt-1">{siteConfig.author.bio}</p> : null}
              <div className="mt-2 flex flex-wrap gap-4">
                {siteConfig.author.linkedin ? (
                  <a
                    href={siteConfig.author.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--color-accent)] hover:underline"
                  >
                    {dict.sobre.linkedin}
                  </a>
                ) : null}
                {siteConfig.author.github ? (
                  <a
                    href={siteConfig.author.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--color-accent)] hover:underline"
                  >
                    {dict.sobre.github}
                  </a>
                ) : null}
                {siteConfig.author.website ? (
                  <a
                    href={siteConfig.author.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--color-accent)] hover:underline"
                  >
                    {dict.sobre.personalSite}
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          {version && publishedAt ? (
            <div className="mt-6 border-t border-[var(--color-border)] pt-4 text-center text-xs text-[var(--color-text-muted)]">
              <a
                href={version.url}
                target="_blank"
                rel="noreferrer"
                title={formatTemplate(dict.footer.viewRelease, { tag: version.tag })}
                className="hover:text-[var(--color-accent)]"
              >
                {version.tag} · {formatTemplate(dict.footer.publishedOn, { date: publishedAt })}
              </a>
            </div>
          ) : null}
        </div>
      </footer>
    </div>
  );
}
