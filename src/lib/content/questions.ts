import fs from "node:fs";
import path from "node:path";
import type { MDXModule, QuestionFrontmatter } from "@/types/content";
import type { Locale } from "@/lib/i18n/config";
import type { Tech } from "@/lib/tech/config";

function questionsDir(tech: Tech): string {
  return path.join(process.cwd(), "src/content", tech, "questions");
}

function questionFiles(tech: Tech, locale: Locale): string[] {
  const dir = path.join(questionsDir(tech), locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .sort();
}

async function loadQuestion(
  tech: Tech,
  locale: Locale,
  file: string,
): Promise<MDXModule<QuestionFrontmatter>> {
  return import(`../../content/${tech}/questions/${locale}/${file}`);
}

const cache = new Map<
  string,
  Promise<Array<{ file: string; module: MDXModule<QuestionFrontmatter> }>>
>();

function loadAll(tech: Tech, locale: Locale) {
  const key = `${tech}:${locale}`;
  let entry = cache.get(key);
  if (!entry) {
    entry = Promise.all(
      questionFiles(tech, locale).map(async (file) => ({
        file,
        module: await loadQuestion(tech, locale, file),
      })),
    );
    cache.set(key, entry);
  }
  return entry;
}

export async function getAllQuestions(tech: Tech, locale: Locale): Promise<QuestionFrontmatter[]> {
  const all = await loadAll(tech, locale);
  return all.map(({ module }) => module.frontmatter).sort((a, b) => a.id - b.id);
}

export async function getQuestionBySlug(tech: Tech, slug: string, locale: Locale) {
  const all = await loadAll(tech, locale);
  const entry = all.find(({ module }) => module.frontmatter.slug === slug);
  if (!entry) return null;
  return {
    frontmatter: entry.module.frontmatter,
    Content: entry.module.default,
  };
}

export async function getQuestionsByTopic(
  tech: Tech,
  topic: string,
  locale: Locale,
): Promise<QuestionFrontmatter[]> {
  const all = await getAllQuestions(tech, locale);
  return all.filter((question) => question.topics.includes(topic));
}

export async function getQuestionsByLevel(
  tech: Tech,
  level: string,
  locale: Locale,
): Promise<QuestionFrontmatter[]> {
  const all = await getAllQuestions(tech, locale);
  return all.filter((question) =>
    question.level.includes(level as QuestionFrontmatter["level"][number]),
  );
}
