import { getAllChapters } from "@/lib/content/chapters";
import { getAllQuestions } from "@/lib/content/questions";
import { getAllTerms } from "@/lib/content/glossary";

export type EnAvailability = {
  livro: string[];
  perguntas: string[];
  glossario: string[];
};

// English content is a pilot subset (see specs/roadmap.md) — used by LocaleSwitcher to avoid
// linking to an untranslated detail page when switching from pt to en.
export async function getEnAvailability(): Promise<EnAvailability> {
  const [chapters, questions, terms] = await Promise.all([
    getAllChapters("en"),
    getAllQuestions("en"),
    getAllTerms("en"),
  ]);
  return {
    livro: chapters.map((c) => c.slug),
    perguntas: questions.map((q) => q.slug),
    glossario: terms.map((t) => t.slug),
  };
}
