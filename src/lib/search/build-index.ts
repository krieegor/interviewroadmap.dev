import { getAllChapters } from "@/lib/content/chapters";
import { getAllQuestions } from "@/lib/content/questions";
import { getAllTerms } from "@/lib/content/glossary";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Tech } from "@/lib/tech/config";

export type SearchEntry = {
  type: string;
  title: string;
  excerpt: string;
  href: string;
};

export async function buildSearchIndex(
  tech: Tech,
  locale: Locale,
  dict: Dictionary,
): Promise<SearchEntry[]> {
  const [chapters, questions, terms] = await Promise.all([
    getAllChapters(tech, locale),
    getAllQuestions(tech, locale),
    getAllTerms(tech, locale),
  ]);

  const chapterEntries: SearchEntry[] = chapters.map((chapter) => ({
    type: dict.search.typeChapter,
    title: chapter.title,
    excerpt: chapter.description,
    href: `/${locale}/${tech}/livro/${chapter.slug}`,
  }));

  const questionEntries: SearchEntry[] = questions.map((question) => ({
    type: dict.search.typeQuestion,
    title: question.title,
    excerpt: question.shortAnswer,
    href: `/${locale}/${tech}/perguntas/${question.slug}`,
  }));

  const termEntries: SearchEntry[] = terms.map((term) => ({
    type: dict.search.typeTerm,
    title: term.term,
    excerpt: term.shortDefinition,
    href: `/${locale}/${tech}/glossario/${term.slug}`,
  }));

  return [...chapterEntries, ...questionEntries, ...termEntries];
}
