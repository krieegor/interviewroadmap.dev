import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllQuestions, getQuestionBySlug } from "@/lib/content/questions";
import { LevelBadge } from "@/components/interview/LevelBadge";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { CopyLinkButton } from "@/components/ui/CopyLinkButton";
import { getSiteConfig } from "@/config/site";
import { getTechConfig } from "@/config/tech";
import { getTechBreadcrumb } from "@/config/navigation";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { formatTemplate } from "@/lib/i18n/format";
import { isTech, techsWithContent, type Tech } from "@/lib/tech/config";
import { buildAlternates, buildOpenGraph, techOpengraphImageUrl } from "@/lib/seo";

// Gera a tupla completa (locale+tech+slug) "de baixo pra cima" — ver nota em casos/[slug]/page.tsx
// e specs/architecture.md seção 14 sobre o bug do Next 16 com retorno vazio por combinação de pai.
export async function generateStaticParams() {
  const params: Array<{ locale: Locale; tech: Tech; slug: string }> = [];
  for (const locale of locales) {
    for (const tech of techsWithContent) {
      const questions = await getAllQuestions(tech, locale);
      for (const question of questions) {
        params.push({ locale, tech, slug: question.slug });
      }
    }
  }
  return params;
}

// Conjunto fechado — ver nota em src/app/[locale]/layout.tsx.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tech: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, tech: rawTech, slug } = await params;
  if (!isLocale(rawLocale) || !isTech(rawTech)) return {};
  const question = await getQuestionBySlug(rawTech, slug, rawLocale);
  if (!question) return {};
  const siteConfig = getSiteConfig(rawLocale);
  const path = `/${rawTech}/perguntas/${slug}`;
  return {
    title: question.frontmatter.title,
    description: question.frontmatter.shortAnswer,
    alternates: buildAlternates(rawLocale, path),
    openGraph: buildOpenGraph({
      siteConfig,
      locale: rawLocale,
      pathWithoutLocale: path,
      title: question.frontmatter.title,
      description: question.frontmatter.shortAnswer,
      imageUrl: techOpengraphImageUrl(siteConfig, rawLocale, rawTech),
    }),
  };
}

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ locale: string; tech: string; slug: string }>;
}) {
  const { locale: rawLocale, tech: rawTech, slug } = await params;
  if (!isLocale(rawLocale) || !isTech(rawTech) || !techsWithContent.includes(rawTech)) notFound();
  const locale: Locale = rawLocale;
  const tech: Tech = rawTech;
  const dict = getDictionary(locale);
  const techConfig = getTechConfig(tech, locale);
  const question = await getQuestionBySlug(tech, slug, locale);
  if (!question) notFound();

  const all = await getAllQuestions(tech, locale);
  const index = all.findIndex((q) => q.slug === slug);
  const previous = index > 0 ? (all[index - 1] ?? null) : null;
  const next = index < all.length - 1 ? (all[index + 1] ?? null) : null;

  const { Content, frontmatter } = question;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: frontmatter.title,
        acceptedAnswer: {
          "@type": "Answer",
          text: frontmatter.shortAnswer,
        },
      },
    ],
  };

  const breadcrumbItems = [
    ...getTechBreadcrumb(locale, tech, techConfig.name, dict),
    { label: dict.nav.perguntas, href: `/${locale}/${tech}/perguntas` },
    { label: frontmatter.title, href: `/${locale}/${tech}/perguntas/${frontmatter.slug}` },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <JsonLdScript data={jsonLd} />
      <Breadcrumbs items={breadcrumbItems} locale={locale} ariaLabel={dict.breadcrumbs.ariaLabel} />

      <p className="text-sm font-medium text-[var(--color-text-muted)]">
        {formatTemplate(dict.perguntaDetail.questionOf, { id: frontmatter.id })}
      </p>
      <h1 className="mt-2 text-3xl font-semibold text-[var(--color-text)]">{frontmatter.title}</h1>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {frontmatter.level.map((level) => (
          <LevelBadge key={level} level={level} dict={dict} />
        ))}
        <div className="ml-auto">
          <CopyLinkButton path={`/${locale}/${tech}/perguntas/${frontmatter.slug}`} dict={dict} />
        </div>
      </div>

      <div className="prose-content mt-8">
        <Content />
      </div>

      {frontmatter.relatedChapters.length > 0 ? (
        <div className="mt-10 rounded-md border border-[var(--color-border)] p-4">
          <p className="text-sm font-medium text-[var(--color-text)]">
            {dict.perguntaDetail.relatedChapters}
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {frontmatter.relatedChapters.map((chapterSlug) => (
              <li key={chapterSlug}>
                <Link
                  href={`/${locale}/${tech}/livro/${chapterSlug}`}
                  className="inline-block rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                >
                  {chapterSlug}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <nav
        aria-label={dict.perguntaDetail.paginationAriaLabel}
        className="mt-10 grid grid-cols-1 gap-4 border-t border-[var(--color-border)] pt-6 sm:grid-cols-2"
      >
        <div>
          {previous ? (
            <Link
              href={`/${locale}/${tech}/perguntas/${previous.slug}`}
              className="group flex flex-col rounded-md border border-[var(--color-border)] p-4 transition-colors hover:border-[var(--color-accent)]"
            >
              <span className="text-xs text-[var(--color-text-muted)]">
                {dict.perguntaDetail.previous}
              </span>
              <span className="font-medium text-[var(--color-text)] group-hover:text-[var(--color-accent)]">
                {previous.title}
              </span>
            </Link>
          ) : null}
        </div>
        <div>
          {next ? (
            <Link
              href={`/${locale}/${tech}/perguntas/${next.slug}`}
              className="group flex flex-col rounded-md border border-[var(--color-border)] p-4 text-right transition-colors hover:border-[var(--color-accent)]"
            >
              <span className="text-xs text-[var(--color-text-muted)]">{dict.perguntaDetail.next}</span>
              <span className="font-medium text-[var(--color-text)] group-hover:text-[var(--color-accent)]">
                {next.title}
              </span>
            </Link>
          ) : null}
        </div>
      </nav>
    </div>
  );
}
