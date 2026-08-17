import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllQuestions } from "@/lib/content/questions";
import { QuestionCard } from "@/components/interview/QuestionCard";
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
  const title = dict.perguntasIndex.title;
  const description = formatTemplate(dict.perguntasIndex.description, { siteName: techConfig.name });
  return {
    title,
    description,
    alternates: buildAlternates(rawLocale, `/${rawTech}/perguntas`),
    openGraph: buildOpenGraph({
      siteConfig,
      locale: rawLocale,
      pathWithoutLocale: `/${rawTech}/perguntas`,
      title,
      description,
      imageUrl: techOpengraphImageUrl(siteConfig, rawLocale, rawTech),
    }),
  };
}

export default async function PerguntasPage({
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
  const questions = await getAllQuestions(tech, locale);
  const breadcrumbItems = [
    ...getTechBreadcrumb(locale, tech, techConfig.name, dict),
    { label: dict.nav.perguntas, href: `/${locale}/${tech}/perguntas` },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Breadcrumbs items={breadcrumbItems} locale={locale} ariaLabel={dict.breadcrumbs.ariaLabel} />
      <h1 className="text-3xl font-semibold text-[var(--color-text)]">{dict.perguntasIndex.title}</h1>
      <p className="mt-3 max-w-prose text-[var(--color-text-muted)]">{dict.perguntasIndex.intro}</p>

      {questions.length === 0 ? (
        <p className="mt-8 text-sm text-[var(--color-text-muted)]">{dict.perguntasIndex.empty}</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {questions.map((question) => (
            <QuestionCard key={question.slug} question={question} locale={locale} tech={tech} dict={dict} />
          ))}
        </div>
      )}
    </div>
  );
}
