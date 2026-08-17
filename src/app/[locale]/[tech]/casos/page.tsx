import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCaseStudies } from "@/lib/content/case-studies";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { getTechConfig } from "@/config/tech";
import { getTechBreadcrumb } from "@/config/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { formatTemplate } from "@/lib/i18n/format";
import { isTech, techsWithContent, type Tech } from "@/lib/tech/config";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tech: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, tech: rawTech } = await params;
  if (!isLocale(rawLocale) || !isTech(rawTech)) return {};
  const dict = getDictionary(rawLocale);
  const techConfig = getTechConfig(rawTech, rawLocale);
  return {
    title: dict.casosIndex.title,
    description: formatTemplate(dict.casosIndex.description, { siteName: techConfig.name }),
    alternates: buildAlternates(rawLocale, `/${rawTech}/casos`),
  };
}

export default async function CasosPage({
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
  const caseStudies = await getAllCaseStudies(tech, locale);
  const breadcrumbItems = [
    ...getTechBreadcrumb(locale, tech, techConfig.name, dict),
    { label: dict.nav.casos, href: `/${locale}/${tech}/casos` },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Breadcrumbs items={breadcrumbItems} locale={locale} ariaLabel={dict.breadcrumbs.ariaLabel} />
      <h1 className="text-3xl font-semibold text-[var(--color-text)]">{dict.casosIndex.title}</h1>
      <p className="mt-3 text-[var(--color-text-muted)]">{dict.casosIndex.intro}</p>

      {caseStudies.length === 0 ? (
        <p className="mt-8 text-sm text-[var(--color-text-muted)]">{dict.casosIndex.empty}</p>
      ) : (
        <ul className="mt-8 flex flex-col gap-3">
          {caseStudies.map((caseStudy) => (
            <li key={caseStudy.slug}>
              <Link
                href={`/${locale}/${tech}/casos/${caseStudy.slug}`}
                className="block rounded-md border border-[var(--color-border)] p-4 transition-colors hover:border-[var(--color-accent)]"
              >
                <span className="font-medium text-[var(--color-text)]">{caseStudy.title}</span>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  {caseStudy.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
