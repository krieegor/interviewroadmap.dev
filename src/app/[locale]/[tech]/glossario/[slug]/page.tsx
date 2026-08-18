import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllTerms, getTermBySlug } from "@/lib/content/glossary";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { CopyLinkButton } from "@/components/ui/CopyLinkButton";
import { getSiteConfig } from "@/config/site";
import { getTechConfig } from "@/config/tech";
import { getTechBreadcrumb } from "@/config/navigation";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isTech, techsWithContent, type Tech } from "@/lib/tech/config";
import { buildAlternates, buildOpenGraph, techOpengraphImageUrl } from "@/lib/seo";

// Gera a tupla completa (locale+tech+slug) "de baixo pra cima": ver nota em casos/[slug]/page.tsx
// e specs/architecture.md seção 14 sobre o bug do Next 16 com retorno vazio por combinação de pai.
export async function generateStaticParams() {
  const params: Array<{ locale: Locale; tech: Tech; slug: string }> = [];
  for (const locale of locales) {
    for (const tech of techsWithContent) {
      const terms = await getAllTerms(tech, locale);
      for (const term of terms) {
        params.push({ locale, tech, slug: term.slug });
      }
    }
  }
  return params;
}

// Conjunto fechado, ver nota em src/app/[locale]/layout.tsx.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tech: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, tech: rawTech, slug } = await params;
  if (!isLocale(rawLocale) || !isTech(rawTech)) return {};
  const term = await getTermBySlug(rawTech, slug, rawLocale);
  if (!term) return {};
  const siteConfig = getSiteConfig(rawLocale);
  const path = `/${rawTech}/glossario/${slug}`;
  return {
    title: term.frontmatter.term,
    description: term.frontmatter.shortDefinition,
    alternates: buildAlternates(rawLocale, path),
    openGraph: buildOpenGraph({
      siteConfig,
      locale: rawLocale,
      pathWithoutLocale: path,
      title: term.frontmatter.term,
      description: term.frontmatter.shortDefinition,
      imageUrl: techOpengraphImageUrl(siteConfig, rawLocale, rawTech),
    }),
  };
}

export default async function GlossaryTermPage({
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
  const term = await getTermBySlug(tech, slug, locale);
  if (!term) notFound();

  const allTerms = await getAllTerms(tech, locale);
  const allSlugs = allTerms.map((t) => t.slug);
  const index = allTerms.findIndex((t) => t.slug === slug);
  const previous = index > 0 ? (allTerms[index - 1] ?? null) : null;
  const next = index < allTerms.length - 1 ? (allTerms[index + 1] ?? null) : null;

  const { Content, frontmatter } = term;
  const relatedTerms = frontmatter.relatedTerms.filter((r) => allSlugs.includes(r));
  const breadcrumbItems = [
    ...getTechBreadcrumb(locale, tech, techConfig.name, dict),
    { label: dict.nav.glossario, href: `/${locale}/${tech}/glossario` },
    { label: frontmatter.term, href: `/${locale}/${tech}/glossario/${frontmatter.slug}` },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Breadcrumbs items={breadcrumbItems} locale={locale} ariaLabel={dict.breadcrumbs.ariaLabel} />
      <h1 className="text-3xl font-semibold text-[var(--color-text)]">{frontmatter.term}</h1>
      <p className="mt-3 text-sm font-medium text-[var(--color-text-muted)]">
        {frontmatter.shortDefinition}
      </p>

      <div className="mt-4">
        <CopyLinkButton path={`/${locale}/${tech}/glossario/${frontmatter.slug}`} dict={dict} />
      </div>

      <div className="prose-content mt-8">
        <Content />
      </div>

      {relatedTerms.length > 0 || frontmatter.relatedChapters.length > 0 ? (
        <div className="mt-10 flex flex-col gap-4">
          {relatedTerms.length > 0 ? (
            <div className="rounded-md border border-[var(--color-border)] p-4">
              <p className="text-sm font-medium text-[var(--color-text)]">
                {dict.glossarioDetail.relatedTerms}
              </p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {relatedTerms.map((relatedSlug) => {
                  const relatedTerm = allTerms.find((t) => t.slug === relatedSlug);
                  return (
                    <li key={relatedSlug}>
                      <Link
                        href={`/${locale}/${tech}/glossario/${relatedSlug}`}
                        className="inline-block rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                      >
                        {relatedTerm?.term ?? relatedSlug}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          {frontmatter.relatedChapters.length > 0 ? (
            <div className="rounded-md border border-[var(--color-border)] p-4">
              <p className="text-sm font-medium text-[var(--color-text)]">
                {dict.glossarioDetail.relatedChapters}
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
        </div>
      ) : null}

      {previous || next ? (
        <nav
          aria-label={dict.glossarioIndex.indexAriaLabel}
          className="mt-10 grid grid-cols-1 gap-4 border-t border-[var(--color-border)] pt-6 sm:grid-cols-2"
        >
          <div>
            {previous ? (
              <Link
                href={`/${locale}/${tech}/glossario/${previous.slug}`}
                className="group flex flex-col rounded-md border border-[var(--color-border)] p-4 transition-colors hover:border-[var(--color-accent)]"
              >
                <span className="text-xs text-[var(--color-text-muted)]">
                  {dict.glossarioDetail.previous}
                </span>
                <span className="font-medium text-[var(--color-text)] group-hover:text-[var(--color-accent)]">
                  {previous.term}
                </span>
              </Link>
            ) : null}
          </div>
          <div>
            {next ? (
              <Link
                href={`/${locale}/${tech}/glossario/${next.slug}`}
                className="group flex flex-col rounded-md border border-[var(--color-border)] p-4 text-right transition-colors hover:border-[var(--color-accent)]"
              >
                <span className="text-xs text-[var(--color-text-muted)]">
                  {dict.glossarioDetail.next}
                </span>
                <span className="font-medium text-[var(--color-text)] group-hover:text-[var(--color-accent)]">
                  {next.term}
                </span>
              </Link>
            ) : null}
          </div>
        </nav>
      ) : null}
    </div>
  );
}
