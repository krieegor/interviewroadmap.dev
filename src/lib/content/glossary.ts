import fs from "node:fs";
import path from "node:path";
import type { GlossaryFrontmatter, MDXModule } from "@/types/content";
import type { Locale } from "@/lib/i18n/config";
import type { Tech } from "@/lib/tech/config";

function glossaryDir(tech: Tech): string {
  return path.join(process.cwd(), "src/content", tech, "glossary");
}

function glossaryFiles(tech: Tech, locale: Locale): string[] {
  const dir = path.join(glossaryDir(tech), locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .sort();
}

async function loadTerm(
  tech: Tech,
  locale: Locale,
  file: string,
): Promise<MDXModule<GlossaryFrontmatter>> {
  return import(`../../content/${tech}/glossary/${locale}/${file}`);
}

const cache = new Map<
  string,
  Promise<Array<{ file: string; module: MDXModule<GlossaryFrontmatter> }>>
>();

function loadAll(tech: Tech, locale: Locale) {
  const key = `${tech}:${locale}`;
  let entry = cache.get(key);
  if (!entry) {
    entry = Promise.all(
      glossaryFiles(tech, locale).map(async (file) => ({
        file,
        module: await loadTerm(tech, locale, file),
      })),
    );
    cache.set(key, entry);
  }
  return entry;
}

export async function getAllTerms(tech: Tech, locale: Locale): Promise<GlossaryFrontmatter[]> {
  const all = await loadAll(tech, locale);
  const collator = locale === "pt" ? "pt-BR" : "en-US";
  return all
    .map(({ module }) => module.frontmatter)
    .sort((a, b) => a.term.localeCompare(b.term, collator));
}

export async function getAllTermsFull(
  tech: Tech,
  locale: Locale,
): Promise<Array<{ frontmatter: GlossaryFrontmatter; Content: MDXModule<GlossaryFrontmatter>["default"] }>> {
  const all = await loadAll(tech, locale);
  const collator = locale === "pt" ? "pt-BR" : "en-US";
  return all
    .map(({ module }) => ({ frontmatter: module.frontmatter, Content: module.default }))
    .sort((a, b) => a.frontmatter.term.localeCompare(b.frontmatter.term, collator));
}

export async function getTermBySlug(tech: Tech, slug: string, locale: Locale) {
  const all = await loadAll(tech, locale);
  const entry = all.find(({ module }) => module.frontmatter.slug === slug);
  if (!entry) return null;
  return {
    frontmatter: entry.module.frontmatter,
    Content: entry.module.default,
  };
}
