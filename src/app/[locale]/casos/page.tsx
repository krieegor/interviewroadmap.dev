import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCaseStudies } from "@/lib/content/case-studies";
import { getSiteConfig } from "@/config/site";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { formatTemplate } from "@/lib/i18n/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const dict = getDictionary(rawLocale);
  const siteConfig = getSiteConfig(rawLocale);
  return {
    title: dict.casosIndex.title,
    description: formatTemplate(dict.casosIndex.description, { siteName: siteConfig.name }),
  };
}

export default async function CasosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const caseStudies = await getAllCaseStudies(locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-[var(--color-text)]">{dict.casosIndex.title}</h1>
      <p className="mt-3 text-[var(--color-text-muted)]">{dict.casosIndex.intro}</p>

      {caseStudies.length === 0 ? (
        <p className="mt-8 text-sm text-[var(--color-text-muted)]">{dict.casosIndex.empty}</p>
      ) : (
        <ul className="mt-8 flex flex-col gap-3">
          {caseStudies.map((caseStudy) => (
            <li key={caseStudy.slug}>
              <Link
                href={`/${locale}/casos/${caseStudy.slug}`}
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
