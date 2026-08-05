import { getAllChapters } from "@/lib/content/chapters";
import { getAllQuestions } from "@/lib/content/questions";
import { getAllTerms } from "@/lib/content/glossary";
import type { Tech } from "@/lib/tech/config";

export type EnAvailability = {
  livro: string[];
  perguntas: string[];
  glossario: string[];
};

// English content is a pilot subset (see specs/roadmap.md) — used by LocaleSwitcher to avoid
// linking to an untranslated detail page when switching from pt to en.
export async function getEnAvailability(tech: Tech): Promise<EnAvailability> {
  const [chapters, questions, terms] = await Promise.all([
    getAllChapters(tech, "en"),
    getAllQuestions(tech, "en"),
    getAllTerms(tech, "en"),
  ]);
  return {
    livro: chapters.map((c) => c.slug),
    perguntas: questions.map((q) => q.slug),
    glossario: terms.map((t) => t.slug),
  };
}
