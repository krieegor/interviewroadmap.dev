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
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isTech, techsWithContent, type Tech } from "@/lib/tech/config";

// Gera a tupla completa (locale+tech+slug) "de baixo pra cima" — ver nota em casos/[slug]/page.tsx
// e specs/architecture.md seção 14 sobre o bug do Next 16 com retorno vazio por combinação de pai.
export async function generateStaticParams() {
  const params: Array<{ locale: Locale; tech: Tech; slug: string[] }> = [];
  for (const locale of locales) {
    for (const tech of techsWithContent) {
      const chapters = await getAllChapters(tech, locale);
      for (const chapter of chapters) {
        params.push({ locale, tech, slug: [chapter.slug] });
      }
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tech: string; slug: string[] }>;
}): Promise<Metadata> {
  const { locale: rawLocale, tech: rawTech, slug } = await params;
  if (!isLocale(rawLocale) || !isTech(rawTech)) return {};
  const chapter = await getChapterBySlug(rawTech, slug.join("/"), rawLocale);
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
  params: Promise<{ locale: string; tech: string; slug: string[] }>;
}) {
  const { locale: rawLocale, tech: rawTech, slug: slugParts } = await params;
  if (!isLocale(rawLocale) || !isTech(rawTech) || !techsWithContent.includes(rawTech)) notFound();
  const locale: Locale = rawLocale;
  const tech: Tech = rawTech;
  const dict = getDictionary(locale);
  const slug = slugParts.join("/");
  const chapter = await getChapterBySlug(tech, slug, locale);
  if (!chapter) notFound();

  const [parts, { previous, next }, headings] = await Promise.all([
    getChaptersByPart(tech, locale),
    getAdjacentChapters(tech, slug, locale),
    getChapterHeadings(tech, slug, locale),
  ]);

  const { Content, frontmatter } = chapter;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr] xl:grid-cols-[240px_1fr_220px]">
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <BookSidebar
              parts={parts}
              currentSlug={frontmatter.slug}
              locale={locale}
              tech={tech}
              dict={dict}
            />
          </div>
        </aside>

        <div>
          <details className="mb-6 rounded-md border border-[var(--color-border)] lg:hidden">
            <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-[var(--color-text)]">
              {dict.bookSidebar.mobileSummary}
            </summary>
            <div className="border-t border-[var(--color-border)] p-4">
              <BookSidebar
                parts={parts}
                currentSlug={frontmatter.slug}
                locale={locale}
                tech={tech}
                dict={dict}
              />
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
              <CopyLinkButton path={`/${locale}/${tech}/livro/${frontmatter.slug}`} dict={dict} />
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

          <ChapterPager previous={previous} next={next} locale={locale} tech={tech} dict={dict} />
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
