import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllQuestions } from "@/lib/content/questions";
import { Simulator } from "@/components/interview/Simulator";
import { SimulatorHistory } from "@/components/interview/SimulatorHistory";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const dict = getDictionary(rawLocale);
  return {
    title: dict.simuladorPage.title,
    description: dict.simuladorPage.description,
  };
}

export default async function SimuladorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const questions = await getAllQuestions(locale);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-[var(--color-text)]">{dict.simuladorPage.title}</h1>
      <p className="mt-3 text-[var(--color-text-muted)]">{dict.simuladorPage.intro}</p>
      <div className="mt-8">
        <Simulator questions={questions} locale={locale} dict={dict} />
      </div>

      <SimulatorHistory locale={locale} dict={dict} />
    </div>
  );
}
