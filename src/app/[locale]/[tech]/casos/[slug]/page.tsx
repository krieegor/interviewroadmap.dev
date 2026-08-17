import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCaseStudies, getCaseStudyBySlug } from "@/lib/content/case-studies";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { CopyLinkButton } from "@/components/ui/CopyLinkButton";
import { getTechConfig } from "@/config/tech";
import { getTechBreadcrumb } from "@/config/navigation";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isTech, techsWithContent, type Tech } from "@/lib/tech/config";
import { buildAlternates } from "@/lib/seo";

// Gera a tupla completa (locale+tech+slug) "de baixo pra cima", em vez de depender dos params do
// segmento pai — quando o retorno varia entre vazio (techs sem conteúdo) e não-vazio (kafka) por
// combinação de pai, o Next 16 falha silenciosamente e não gera NENHUMA página para essa rota,
// nem as combinações válidas (confirmado empiricamente; ver specs/architecture.md seção 14).
export async function generateStaticParams() {
  const params: Array<{ locale: Locale; tech: Tech; slug: string }> = [];
  for (const locale of locales) {
    for (const tech of techsWithContent) {
      const caseStudies = await getAllCaseStudies(tech, locale);
      for (const caseStudy of caseStudies) {
        params.push({ locale, tech, slug: caseStudy.slug });
      }
    }
  }
  return params;
}

// Conjunto fechado (todo slug válido já está em `params` acima) — ver nota em
// src/app/[locale]/layout.tsx sobre por que isso importa para o deploy em Cloudflare Workers.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tech: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, tech: rawTech, slug } = await params;
  if (!isLocale(rawLocale) || !isTech(rawTech)) return {};
  const caseStudy = await getCaseStudyBySlug(rawTech, slug, rawLocale);
  if (!caseStudy) return {};
  return {
    title: caseStudy.frontmatter.title,
    description: caseStudy.frontmatter.description,
    alternates: buildAlternates(rawLocale, `/${rawTech}/casos/${slug}`),
  };
}

export default async function CaseStudyPage({
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
  const caseStudy = await getCaseStudyBySlug(tech, slug, locale);
  if (!caseStudy) notFound();

  const { Content, frontmatter } = caseStudy;
  const breadcrumbItems = [
    ...getTechBreadcrumb(locale, tech, techConfig.name, dict),
    { label: dict.nav.casos, href: `/${locale}/${tech}/casos` },
    { label: frontmatter.title, href: `/${locale}/${tech}/casos/${frontmatter.slug}` },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Breadcrumbs items={breadcrumbItems} locale={locale} ariaLabel={dict.breadcrumbs.ariaLabel} />
      <h1 className="text-3xl font-semibold text-[var(--color-text)]">{frontmatter.title}</h1>
      <p className="mt-3 text-[var(--color-text-muted)]">{frontmatter.description}</p>
      <div className="mt-4">
        <CopyLinkButton path={`/${locale}/${tech}/casos/${frontmatter.slug}`} dict={dict} />
      </div>
      <div className="prose-content mt-8">
        <Content />
      </div>

      {frontmatter.relatedChapters.length > 0 ? (
        <div className="mt-10 rounded-md border border-[var(--color-border)] p-4">
          <p className="text-sm font-medium text-[var(--color-text)]">
            {dict.casoDetail.relatedChapters}
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
  );
}
