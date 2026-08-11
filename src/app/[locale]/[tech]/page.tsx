import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllChapters } from "@/lib/content/chapters";
import { getTechConfig } from "@/config/tech";
import { siteConfig as platformConfig } from "@/config/site";
import { ReadingProgressCard } from "@/components/home/ReadingProgressCard";
import { KafkaHero } from "@/components/hero/KafkaHero";
import { ComingSoon } from "@/components/content/ComingSoon";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isTech, techsWithContent, type Tech } from "@/lib/tech/config";

export default async function TechHome({
  params,
}: {
  params: Promise<{ locale: string; tech: string }>;
}) {
  const { locale: rawLocale, tech: rawTech } = await params;
  if (!isLocale(rawLocale) || !isTech(rawTech)) notFound();
  const locale: Locale = rawLocale;
  const tech: Tech = rawTech;
  const dict = getDictionary(locale);
  const techConfig = getTechConfig(tech, locale);

  if (!techsWithContent.includes(tech)) {
    return <ComingSoon tech={tech} locale={locale} dict={dict} />;
  }

  const chapters = await getAllChapters(tech, locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-[var(--color-accent)]">
        {dict.home.badge}
      </p>
      <h1 className="mt-3 text-4xl font-semibold leading-tight text-[var(--color-text)]">
        {techConfig.name}
      </h1>
      <p className="mt-4 max-w-prose text-lg text-[var(--color-text-muted)]">
        {techConfig.description}
      </p>

      <p className="mt-6 max-w-prose text-[var(--color-text-muted)]">{dict.home.intro}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={`/${locale}/${tech}/livro`}
          className="rounded-md bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-white"
        >
          {dict.home.ctaStart}
        </Link>
        <Link
          href={`/${locale}/${tech}/perguntas`}
          className="rounded-md border border-[var(--color-border)] px-5 py-2.5 text-sm font-medium text-[var(--color-text)] hover:border-[var(--color-accent)]"
        >
          {dict.home.ctaQuestions}
        </Link>
        <Link
          href={`/${locale}/${tech}/simulador`}
          className="rounded-md border border-[var(--color-border)] px-5 py-2.5 text-sm font-medium text-[var(--color-text)] hover:border-[var(--color-accent)]"
        >
          {dict.home.ctaSimulate}
        </Link>
      </div>

      <ReadingProgressCard totalChapters={chapters.length} locale={locale} tech={tech} dict={dict} />

      {/* Modelo Producer/Partitions/Consumer Group é específico do Kafka — não faz sentido reaproveitar
          pra Java/Elastic/etc. quando ganharem conteúdo real. */}
      {tech === "kafka" ? <KafkaHero dict={dict} /> : null}

      <section className="mt-16">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
          {dict.home.summaryTitle}
        </h2>
        <ul className="mt-4 flex flex-col gap-2">
          {chapters.slice(0, 6).map((chapter) => (
            <li key={chapter.slug}>
              <Link
                href={`/${locale}/${tech}/livro/${chapter.slug}`}
                className="block rounded-md border border-[var(--color-border)] p-3 text-sm transition-colors hover:border-[var(--color-accent)]"
              >
                <span className="font-medium text-[var(--color-text)]">{chapter.title}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href={`/${locale}/${tech}/livro`}
          className="mt-3 inline-block text-sm text-[var(--color-accent)] hover:underline"
        >
          {dict.home.seeSummary}
        </Link>
      </section>

      <section className="mt-16">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
          {dict.home.conceptsTitle}
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {dict.home.coreConcepts.map((concept) => (
            <span
              key={concept}
              className="rounded-full border border-[var(--color-border)] px-3 py-1 text-sm text-[var(--color-text-muted)]"
            >
              {concept}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <p className="text-sm text-[var(--color-text-muted)]">{dict.home.openSourceText}</p>
        <a
          href={platformConfig.githubUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-sm font-medium text-[var(--color-accent)] hover:underline"
        >
          {dict.home.githubCta}
        </a>
      </section>
    </div>
  );
}
