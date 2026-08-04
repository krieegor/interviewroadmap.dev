import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import type { ChapterFrontmatter, MDXModule } from "@/types/content";
import type { Locale } from "@/lib/i18n/config";

const CHAPTERS_DIR = path.join(process.cwd(), "src/content/chapters");

function chapterFiles(locale: Locale): string[] {
  const dir = path.join(CHAPTERS_DIR, locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .sort();
}

async function loadChapter(locale: Locale, file: string): Promise<MDXModule<ChapterFrontmatter>> {
  return import(`../../content/chapters/${locale}/${file}`);
}

const cache = new Map<
  Locale,
  Promise<Array<{ file: string; module: MDXModule<ChapterFrontmatter> }>>
>();

function loadAll(locale: Locale) {
  let entry = cache.get(locale);
  if (!entry) {
    entry = Promise.all(
      chapterFiles(locale).map(async (file) => ({ file, module: await loadChapter(locale, file) })),
    );
    cache.set(locale, entry);
  }
  return entry;
}

function sortChapters(a: ChapterFrontmatter, b: ChapterFrontmatter) {
  return a.partOrder - b.partOrder || a.chapterOrder - b.chapterOrder;
}

export async function getAllChapters(locale: Locale): Promise<ChapterFrontmatter[]> {
  const all = await loadAll(locale);
  return all.map(({ module }) => module.frontmatter).sort(sortChapters);
}

export type ChapterPart = {
  part: string;
  partOrder: number;
  chapters: ChapterFrontmatter[];
};

export async function getChaptersByPart(locale: Locale): Promise<ChapterPart[]> {
  const chapters = await getAllChapters(locale);
  const map = new Map<string, ChapterPart>();
  for (const chapter of chapters) {
    const existing = map.get(chapter.part);
    if (existing) {
      existing.chapters.push(chapter);
    } else {
      map.set(chapter.part, {
        part: chapter.part,
        partOrder: chapter.partOrder,
        chapters: [chapter],
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => a.partOrder - b.partOrder);
}

export async function getChapterBySlug(slug: string, locale: Locale) {
  const all = await loadAll(locale);
  const entry = all.find(({ module }) => module.frontmatter.slug === slug);
  if (!entry) return null;
  return {
    frontmatter: entry.module.frontmatter,
    Content: entry.module.default,
  };
}

export async function getAdjacentChapters(slug: string, locale: Locale) {
  const chapters = await getAllChapters(locale);
  const index = chapters.findIndex((chapter) => chapter.slug === slug);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: index > 0 ? (chapters[index - 1] ?? null) : null,
    next: index < chapters.length - 1 ? (chapters[index + 1] ?? null) : null,
  };
}

export type ChapterHeading = { depth: 2 | 3; text: string; id: string };

// Assume plain-text headings (no inline `code`/**bold**/links) — rehype-slug in next.config.ts
// slugifies the rendered text, so markdown syntax here would desync the ids from the DOM anchors.
const headingLinePattern = /^(#{2,3})\s+(.+)$/;

export async function getChapterHeadings(slug: string, locale: Locale): Promise<ChapterHeading[]> {
  const all = await loadAll(locale);
  const entry = all.find(({ module }) => module.frontmatter.slug === slug);
  if (!entry) return [];

  const filePath = path.join(CHAPTERS_DIR, locale, entry.file);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { content } = matter(raw);

  const slugger = new GithubSlugger();
  const headings: ChapterHeading[] = [];
  for (const line of content.split("\n")) {
    const match = headingLinePattern.exec(line.trim());
    if (!match) continue;
    const [, hashes, text] = match;
    const depth = hashes!.length as 2 | 3;
    headings.push({ depth, text: text!.trim(), id: slugger.slug(text!.trim()) });
  }
  return headings;
}
