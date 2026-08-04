import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAdjacentChapters,
  getAllChapters,
  getChapterBySlug,
  getChapterHeadings,
  getChaptersByPart,
} from "@/lib/content/chapters";
import { BookSidebar } from "@/components/navigation/BookSidebar";
import { ChapterPager } from "@/components/navigation/ChapterPager";
import { ChapterProgressButton } from "@/components/navigation/ChapterProgressButton";
import { TableOfContents } from "@/components/navigation/TableOfContents";
import { CopyLinkButton } from "@/components/ui/CopyLinkButton";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) return [];
  const chapters = await getAllChapters(params.locale);
  return chapters.map((chapter) => ({ slug: [chapter.slug] }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) return {};
  const chapter = await getChapterBySlug(slug.join("/"), rawLocale);
  if (!chapter) return {};
  return {
    title: chapter.frontmatter.title,
    description: chapter.frontmatter.description,
    openGraph: {
      title: chapter.frontmatter.title,
      description: chapter.frontmatter.description,
    },
  };
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const { locale: rawLocale, slug: slugParts } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const slug = slugParts.join("/");
  const chapter = await getChapterBySlug(slug, locale);
  if (!chapter) notFound();

  const [parts, { previous, next }, headings] = await Promise.all([
    getChaptersByPart(locale),
    getAdjacentChapters(slug, locale),
    getChapterHeadings(slug, locale),
  ]);

  const { Content, frontmatter } = chapter;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr] xl:grid-cols-[240px_1fr_220px]">
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <BookSidebar parts={parts} currentSlug={frontmatter.slug} locale={locale} dict={dict} />
          </div>
        </aside>

        <div>
          <details className="mb-6 rounded-md border border-[var(--color-border)] lg:hidden">
            <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-[var(--color-text)]">
              {dict.bookSidebar.mobileSummary}
            </summary>
            <div className="border-t border-[var(--color-border)] p-4">
              <BookSidebar parts={parts} currentSlug={frontmatter.slug} locale={locale} dict={dict} />
            </div>
          </details>

          <article>
            <p className="text-sm font-medium uppercase tracking-wide text-[var(--color-accent)]">
              {frontmatter.part}
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-[var(--color-text)]">
              {frontmatter.title}
            </h1>
            <p className="mt-3 text-[var(--color-text-muted)]">{frontmatter.description}</p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <ChapterProgressButton slug={frontmatter.slug} dict={dict} />
              <CopyLinkButton path={`/${locale}/livro/${frontmatter.slug}`} dict={dict} />
            </div>

            {headings.length > 0 ? (
              <details className="mt-6 rounded-md border border-[var(--color-border)] xl:hidden">
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-[var(--color-text)]">
                  {dict.toc.mobileTitle}
                </summary>
                <div className="border-t border-[var(--color-border)] p-4">
                  <TableOfContents headings={headings} title={dict.toc.mobileTitle} />
                </div>
              </details>
            ) : null}

            <div className="prose-content mt-8">
              <Content />
            </div>
          </article>

          <ChapterPager previous={previous} next={next} locale={locale} dict={dict} />
        </div>

        <aside className="hidden xl:block">
          <div className="sticky top-20">
            <TableOfContents headings={headings} title={dict.toc.title} />
          </div>
        </aside>
      </div>
    </div>
  );
}
