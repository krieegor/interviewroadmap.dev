import fs from "node:fs";
import path from "node:path";
import type { MDXModule, QuestionFrontmatter } from "@/types/content";
import type { Locale } from "@/lib/i18n/config";

const QUESTIONS_DIR = path.join(process.cwd(), "src/content/questions");

function questionFiles(locale: Locale): string[] {
  const dir = path.join(QUESTIONS_DIR, locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .sort();
}

async function loadQuestion(locale: Locale, file: string): Promise<MDXModule<QuestionFrontmatter>> {
  return import(`../../content/questions/${locale}/${file}`);
}

const cache = new Map<
  Locale,
  Promise<Array<{ file: string; module: MDXModule<QuestionFrontmatter> }>>
>();

function loadAll(locale: Locale) {
  let entry = cache.get(locale);
  if (!entry) {
    entry = Promise.all(
      questionFiles(locale).map(async (file) => ({ file, module: await loadQuestion(locale, file) })),
    );
    cache.set(locale, entry);
  }
  return entry;
}

export async function getAllQuestions(locale: Locale): Promise<QuestionFrontmatter[]> {
  const all = await loadAll(locale);
  return all.map(({ module }) => module.frontmatter).sort((a, b) => a.id - b.id);
}

export async function getQuestionBySlug(slug: string, locale: Locale) {
  const all = await loadAll(locale);
  const entry = all.find(({ module }) => module.frontmatter.slug === slug);
  if (!entry) return null;
  return {
    frontmatter: entry.module.frontmatter,
    Content: entry.module.default,
  };
}

export async function getQuestionsByTopic(topic: string, locale: Locale): Promise<QuestionFrontmatter[]> {
  const all = await getAllQuestions(locale);
  return all.filter((question) => question.topics.includes(topic));
}

export async function getQuestionsByLevel(level: string, locale: Locale): Promise<QuestionFrontmatter[]> {
  const all = await getAllQuestions(locale);
  return all.filter((question) =>
    question.level.includes(level as QuestionFrontmatter["level"][number]),
  );
}
