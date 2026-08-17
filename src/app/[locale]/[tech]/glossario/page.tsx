import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllTermsFull } from "@/lib/content/glossary";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { getSiteConfig } from "@/config/site";
import { getTechConfig } from "@/config/tech";
import { getTechBreadcrumb } from "@/config/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { formatTemplate } from "@/lib/i18n/format";
import { isTech, techsWithContent, type Tech } from "@/lib/tech/config";
import { buildAlternates, buildOpenGraph, techOpengraphImageUrl } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tech: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, tech: rawTech } = await params;
  if (!isLocale(rawLocale) || !isTech(rawTech)) return {};
  const dict = getDictionary(rawLocale);
  const siteConfig = getSiteConfig(rawLocale);
  const techConfig = getTechConfig(rawTech, rawLocale);
  const title = dict.glossarioIndex.title;
  const description = formatTemplate(dict.glossarioIndex.description, { siteName: techConfig.name });
  return {
    title,
    description,
    alternates: buildAlternates(rawLocale, `/${rawTech}/glossario`),
    openGraph: buildOpenGraph({
      siteConfig,
      locale: rawLocale,
      pathWithoutLocale: `/${rawTech}/glossario`,
      title,
      description,
      imageUrl: techOpengraphImageUrl(siteConfig, rawLocale, rawTech),
    }),
  };
}

export default async function GlossarioPage({
  params,
}: {
  params: Promise<{ locale: string; tech: string }>;
}) {
  const { locale: rawLocale, tech: rawTech } = await params;
  if (!isLocale(rawLocale) || !isTech(rawTech) || !techsWithContent.includes(rawTech)) notFound();
  const locale: Locale = rawLocale;
  const tech: Tech = rawTech;
  const dict = getDictionary(locale);
  const techConfig = getTechConfig(tech, locale);
  const terms = await getAllTermsFull(tech, locale);
  const allSlugs = terms.map((t) => t.frontmatter.slug);
  const breadcrumbItems = [
    ...getTechBreadcrumb(locale, tech, techConfig.name, dict),
    { label: dict.nav.glossario, href: `/${locale}/${tech}/glossario` },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Breadcrumbs items={breadcrumbItems} locale={locale} ariaLabel={dict.breadcrumbs.ariaLabel} />
      <h1 className="text-3xl font-semibold text-[var(--color-text)]">{dict.glossarioIndex.title}</h1>
      <p className="mt-3 text-[var(--color-text-muted)]">{dict.glossarioIndex.intro}</p>

      {terms.length > 0 ? (
        <nav aria-label={dict.glossarioIndex.indexAriaLabel} className="mt-8 flex flex-wrap gap-2">
          {terms.map(({ frontmatter }) => (
            <a
              key={frontmatter.slug}
              href={`#${frontmatter.slug}`}
              className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              {frontmatter.term}
            </a>
          ))}
        </nav>
      ) : (
        <p className="mt-8 text-sm text-[var(--color-text-muted)]">{dict.glossarioIndex.empty}</p>
      )}

      <div className="mt-10 flex flex-col divide-y divide-[var(--color-border)]">
        {terms.map(({ frontmatter, Content }) => (
          <section key={frontmatter.slug} id={frontmatter.slug} className="scroll-mt-20 py-6">
            <h2 className="text-xl font-semibold text-[var(--color-text)]">
              <Link
                href={`/${locale}/${tech}/glossario/${frontmatter.slug}`}
                className="hover:text-[var(--color-accent)] hover:underline"
              >
                {frontmatter.term}
              </Link>
            </h2>
            <p className="mt-1 text-sm font-medium text-[var(--color-text-muted)]">
              {frontmatter.shortDefinition}
            </p>
            <div className="prose-content mt-3 max-w-none text-sm">
              <Content />
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-xs">
              {frontmatter.relatedTerms.filter((r) => allSlugs.includes(r)).length > 0 ? (
                <p className="text-[var(--color-text-muted)]">
                  {dict.glossarioIndex.relatedLabel}{" "}
                  {frontmatter.relatedTerms
                    .filter((r) => allSlugs.includes(r))
                    .map((r, i, arr) => (
                      <span key={r}>
                        <a href={`#${r}`} className="text-[var(--color-accent)] hover:underline">
                          {r}
                        </a>
                        {i < arr.length - 1 ? ", " : ""}
                      </span>
                    ))}
                </p>
              ) : null}
              {frontmatter.relatedChapters.map((chapterSlug) => (
                <Link
                  key={chapterSlug}
                  href={`/${locale}/${tech}/livro/${chapterSlug}`}
                  className="text-[var(--color-accent)] hover:underline"
                >
                  {dict.glossarioIndex.seeChapter}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
