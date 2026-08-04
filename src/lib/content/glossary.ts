import fs from "node:fs";
import path from "node:path";
import type { GlossaryFrontmatter, MDXModule } from "@/types/content";
import type { Locale } from "@/lib/i18n/config";

const GLOSSARY_DIR = path.join(process.cwd(), "src/content/glossary");

function glossaryFiles(locale: Locale): string[] {
  const dir = path.join(GLOSSARY_DIR, locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .sort();
}

async function loadTerm(locale: Locale, file: string): Promise<MDXModule<GlossaryFrontmatter>> {
  return import(`../../content/glossary/${locale}/${file}`);
}

const cache = new Map<
  Locale,
  Promise<Array<{ file: string; module: MDXModule<GlossaryFrontmatter> }>>
>();

function loadAll(locale: Locale) {
  let entry = cache.get(locale);
  if (!entry) {
    entry = Promise.all(
      glossaryFiles(locale).map(async (file) => ({ file, module: await loadTerm(locale, file) })),
    );
    cache.set(locale, entry);
  }
  return entry;
}

export async function getAllTerms(locale: Locale): Promise<GlossaryFrontmatter[]> {
  const all = await loadAll(locale);
  const collator = locale === "pt" ? "pt-BR" : "en-US";
  return all
    .map(({ module }) => module.frontmatter)
    .sort((a, b) => a.term.localeCompare(b.term, collator));
}

export async function getAllTermsFull(
  locale: Locale,
): Promise<Array<{ frontmatter: GlossaryFrontmatter; Content: MDXModule<GlossaryFrontmatter>["default"] }>> {
  const all = await loadAll(locale);
  const collator = locale === "pt" ? "pt-BR" : "en-US";
  return all
    .map(({ module }) => ({ frontmatter: module.frontmatter, Content: module.default }))
    .sort((a, b) => a.frontmatter.term.localeCompare(b.frontmatter.term, collator));
}

export async function getTermBySlug(slug: string, locale: Locale) {
  const all = await loadAll(locale);
  const entry = all.find(({ module }) => module.frontmatter.slug === slug);
  if (!entry) return null;
  return {
    frontmatter: entry.module.frontmatter,
    Content: entry.module.default,
  };
}
