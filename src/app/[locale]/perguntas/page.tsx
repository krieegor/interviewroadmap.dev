import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllQuestions } from "@/lib/content/questions";
import { QuestionCard } from "@/components/interview/QuestionCard";
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
    title: dict.perguntasIndex.title,
    description: formatTemplate(dict.perguntasIndex.description, { siteName: siteConfig.name }),
  };
}

export default async function PerguntasPage({
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
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-[var(--color-text)]">{dict.perguntasIndex.title}</h1>
      <p className="mt-3 max-w-prose text-[var(--color-text-muted)]">{dict.perguntasIndex.intro}</p>

      {questions.length === 0 ? (
        <p className="mt-8 text-sm text-[var(--color-text-muted)]">{dict.perguntasIndex.empty}</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {questions.map((question) => (
            <QuestionCard key={question.slug} question={question} locale={locale} dict={dict} />
          ))}
        </div>
      )}
    </div>
  );
}
