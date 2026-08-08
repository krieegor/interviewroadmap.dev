import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllChapters, getChapterBySlug, getChaptersByPart } from "@/lib/content/chapters";
import { getSiteConfig } from "@/config/site";
import { getTechConfig } from "@/config/tech";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { isTech, techsWithContent, type Tech } from "@/lib/tech/config";

export const metadata: Metadata = {
  title: "Versão para impressão",
  robots: { index: false, follow: false },
};

export default async function LivroImpressaoPage({
  params,
}: {
  params: Promise<{ locale: string; tech: string }>;
}) {
  const { locale: rawLocale, tech: rawTech } = await params;
  if (!isLocale(rawLocale) || !isTech(rawTech) || !techsWithContent.includes(rawTech)) notFound();
  const locale: Locale = rawLocale;
  const tech: Tech = rawTech;
  const siteConfig = getSiteConfig(locale);
  const techConfig = getTechConfig(tech, locale);
  const [parts, chapters] = await Promise.all([
    getChaptersByPart(tech, locale),
    getAllChapters(tech, locale),
  ]);
  const fullChapters = await Promise.all(
    chapters.map((chapter) => getChapterBySlug(tech, chapter.slug, locale)),
  );

  const geradoEm = new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="pdf-book mx-auto max-w-3xl px-10 py-10">
      <section className="pdf-cover flex min-h-[80vh] flex-col justify-center text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-accent)]">
          {locale === "pt" ? "E-book gratuito e open source" : "Free & open source e-book"}
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-[var(--color-text)]">{techConfig.name}</h1>
        <p className="mx-auto mt-6 max-w-xl text-[var(--color-text-muted)]">
          {techConfig.description}
        </p>

        <div className="mt-12 flex flex-col items-center gap-3">
          <Image
            src={siteConfig.author.avatar}
            alt={siteConfig.author.name}
            width={72}
            height={72}
            className="h-[72px] w-[72px] rounded-full border border-[var(--color-border)] object-cover"
          />
          <p className="font-medium text-[var(--color-text)]">{siteConfig.author.name}</p>
          <p className="text-sm text-[var(--color-text-muted)]">
            {locale === "pt" ? `Versão de ${geradoEm}` : `Version ${geradoEm}`}
          </p>
        </div>

        <div className="mx-auto mt-10 w-full max-w-sm rounded-md border border-[var(--color-border)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            {locale === "pt" ? "Contribuidores desta versão" : "Contributors to this version"}
          </p>
          <ul className="mt-2 flex flex-col gap-1">
            {siteConfig.contributors.map((contributor) => (
              <li key={contributor.name} className="text-sm text-[var(--color-text)]">
                {contributor.url ? (
                  <a href={contributor.url} className="text-[var(--color-accent)]">
                    {contributor.name}
                  </a>
                ) : (
                  contributor.name
                )}
              </li>
            ))}
          </ul>
        </div>

        <p className="mx-auto mt-16 max-w-md text-xs text-[var(--color-text-muted)]">
          {locale === "pt" ? (
            <>
              Este material não possui vínculo oficial com a Apache Software Foundation, com o Apache
              Kafka, com a Confluent, com a Elastic NV, com a Oracle, com a Amazon Web Services ou com o
              Google Cloud. &ldquo;Apache Kafka&rdquo; e &ldquo;Kafka&rdquo; são marcas da Apache Software
              Foundation; &ldquo;Elasticsearch&rdquo; é marca da Elastic NV; &ldquo;Java&rdquo; e
              &ldquo;Oracle&rdquo; são marcas da Oracle Corporation; &ldquo;AWS&rdquo; e &ldquo;Amazon Web
              Services&rdquo; são marcas da Amazon.com, Inc.; &ldquo;Google Cloud&rdquo; e &ldquo;GCP&rdquo;
              são marcas do Google LLC. Versão completa e atualizada sempre disponível em{" "}
              {siteConfig.url}.
            </>
          ) : (
            <>
              This material has no official affiliation with the Apache Software Foundation, Apache
              Kafka, Confluent, Elastic NV, Oracle, Amazon Web Services, or Google Cloud. &ldquo;Apache
              Kafka&rdquo; and &ldquo;Kafka&rdquo; are trademarks of the Apache Software Foundation;
              &ldquo;Elasticsearch&rdquo; is a trademark of Elastic NV; &ldquo;Java&rdquo; and
              &ldquo;Oracle&rdquo; are trademarks of Oracle Corporation; &ldquo;AWS&rdquo; and &ldquo;Amazon
              Web Services&rdquo; are trademarks of Amazon.com, Inc.; &ldquo;Google Cloud&rdquo; and
              &ldquo;GCP&rdquo; are trademarks of Google LLC. The full, up-to-date version is always
              available at {siteConfig.url}.
            </>
          )}
        </p>
      </section>

      <section className="pdf-toc">
        <h2 className="text-2xl font-semibold text-[var(--color-text)]">
          {locale === "pt" ? "Sumário" : "Contents"}
        </h2>
        <div className="mt-6 flex flex-col gap-8">
          {parts.map((part) => (
            <div key={part.part}>
              <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-accent)]">
                {part.part}
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {part.chapters.map((chapter) => (
                  <li key={chapter.slug}>
                    <a href={`#${chapter.slug}`} className="text-[var(--color-text)]">
                      {chapter.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {fullChapters.map((chapter) => {
        if (!chapter) return null;
        const { frontmatter, Content } = chapter;
        return (
          <section key={frontmatter.slug} id={frontmatter.slug} className="pdf-chapter">
            <p className="text-sm font-medium uppercase tracking-wide text-[var(--color-accent)]">
              {frontmatter.part}
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-[var(--color-text)]">
              {frontmatter.title}
            </h2>
            <div className="prose-content mt-6">
              <Content />
            </div>
          </section>
        );
      })}
    </div>
  );
}
