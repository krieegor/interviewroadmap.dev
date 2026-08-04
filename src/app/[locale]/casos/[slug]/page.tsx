import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCaseStudies, getCaseStudyBySlug } from "@/lib/content/case-studies";
import { CopyLinkButton } from "@/components/ui/CopyLinkButton";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) return [];
  const caseStudies = await getAllCaseStudies(params.locale);
  return caseStudies.map((caseStudy) => ({ slug: caseStudy.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) return {};
  const caseStudy = await getCaseStudyBySlug(slug, rawLocale);
  if (!caseStudy) return {};
  return {
    title: caseStudy.frontmatter.title,
    description: caseStudy.frontmatter.description,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const caseStudy = await getCaseStudyBySlug(slug, locale);
  if (!caseStudy) notFound();

  const { Content, frontmatter } = caseStudy;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-[var(--color-text)]">{frontmatter.title}</h1>
      <p className="mt-3 text-[var(--color-text-muted)]">{frontmatter.description}</p>
      <div className="mt-4">
        <CopyLinkButton path={`/${locale}/casos/${frontmatter.slug}`} dict={dict} />
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
    </div>
  );
}
