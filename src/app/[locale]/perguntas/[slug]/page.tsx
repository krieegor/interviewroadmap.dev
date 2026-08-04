import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllQuestions, getQuestionBySlug } from "@/lib/content/questions";
import { LevelBadge } from "@/components/interview/LevelBadge";
import { CopyLinkButton } from "@/components/ui/CopyLinkButton";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { formatTemplate } from "@/lib/i18n/format";

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) return [];
  const questions = await getAllQuestions(params.locale);
  return questions.map((question) => ({ slug: question.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) return {};
  const question = await getQuestionBySlug(slug, rawLocale);
  if (!question) return {};
  return {
    title: question.frontmatter.title,
    description: question.frontmatter.shortAnswer,
    openGraph: {
      title: question.frontmatter.title,
      description: question.frontmatter.shortAnswer,
    },
  };
}

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const question = await getQuestionBySlug(slug, locale);
  if (!question) notFound();

  const all = await getAllQuestions(locale);
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <p className="text-sm font-medium text-[var(--color-text-muted)]">
        {formatTemplate(dict.perguntaDetail.questionOf, { id: frontmatter.id })}
      </p>
      <h1 className="mt-2 text-3xl font-semibold text-[var(--color-text)]">{frontmatter.title}</h1>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {frontmatter.level.map((level) => (
          <LevelBadge key={level} level={level} dict={dict} />
        ))}
        <div className="ml-auto">
          <CopyLinkButton path={`/${locale}/perguntas/${frontmatter.slug}`} dict={dict} />
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
                  href={`/${locale}/livro/${chapterSlug}`}
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
              href={`/${locale}/perguntas/${previous.slug}`}
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
              href={`/${locale}/perguntas/${next.slug}`}
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
