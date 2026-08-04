import fs from "node:fs";
import path from "node:path";
import type { CaseStudyFrontmatter, MDXModule } from "@/types/content";
import type { Locale } from "@/lib/i18n/config";

const CASE_STUDIES_DIR = path.join(process.cwd(), "src/content/case-studies");

function caseStudyFiles(locale: Locale): string[] {
  const dir = path.join(CASE_STUDIES_DIR, locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .sort();
}

async function loadCaseStudy(locale: Locale, file: string): Promise<MDXModule<CaseStudyFrontmatter>> {
  return import(`../../content/case-studies/${locale}/${file}`);
}

const cache = new Map<
  Locale,
  Promise<Array<{ file: string; module: MDXModule<CaseStudyFrontmatter> }>>
>();

function loadAll(locale: Locale) {
  let entry = cache.get(locale);
  if (!entry) {
    entry = Promise.all(
      caseStudyFiles(locale).map(async (file) => ({ file, module: await loadCaseStudy(locale, file) })),
    );
    cache.set(locale, entry);
  }
  return entry;
}

export async function getAllCaseStudies(locale: Locale): Promise<CaseStudyFrontmatter[]> {
  const all = await loadAll(locale);
  return all.map(({ module }) => module.frontmatter).sort((a, b) => a.order - b.order);
}

export async function getCaseStudyBySlug(slug: string, locale: Locale) {
  const all = await loadAll(locale);
  const entry = all.find(({ module }) => module.frontmatter.slug === slug);
  if (!entry) return null;
  return {
    frontmatter: entry.module.frontmatter,
    Content: entry.module.default,
  };
}
