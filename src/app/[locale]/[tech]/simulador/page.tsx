import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllQuestions } from "@/lib/content/questions";
import { Simulator } from "@/components/interview/Simulator";
import { SimulatorHistory } from "@/components/interview/SimulatorHistory";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { getTechConfig } from "@/config/tech";
import { getTechBreadcrumb } from "@/config/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
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
  return {
    title: dict.simuladorPage.title,
    description: dict.simuladorPage.description,
    alternates: buildAlternates(rawLocale, `/${rawTech}/simulador`),
  };
}

export default async function SimuladorPage({
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
    { label: dict.nav.simulador, href: `/${locale}/${tech}/simulador` },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Breadcrumbs items={breadcrumbItems} locale={locale} ariaLabel={dict.breadcrumbs.ariaLabel} />
      <h1 className="text-3xl font-semibold text-[var(--color-text)]">{dict.simuladorPage.title}</h1>
      <p className="mt-3 text-[var(--color-text-muted)]">{dict.simuladorPage.intro}</p>
      <div className="mt-8">
        <Simulator questions={questions} locale={locale} tech={tech} dict={dict} />
      </div>

      <SimulatorHistory locale={locale} dict={dict} />
    </div>
  );
}
