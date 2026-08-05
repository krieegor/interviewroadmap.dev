import fs from "node:fs";
import path from "node:path";
import type { CaseStudyFrontmatter, MDXModule } from "@/types/content";
import type { Locale } from "@/lib/i18n/config";
import type { Tech } from "@/lib/tech/config";

function caseStudiesDir(tech: Tech): string {
  return path.join(process.cwd(), "src/content", tech, "case-studies");
}

function caseStudyFiles(tech: Tech, locale: Locale): string[] {
  const dir = path.join(caseStudiesDir(tech), locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .sort();
}

async function loadCaseStudy(
  tech: Tech,
  locale: Locale,
  file: string,
): Promise<MDXModule<CaseStudyFrontmatter>> {
  return import(`../../content/${tech}/case-studies/${locale}/${file}`);
}

const cache = new Map<
  string,
  Promise<Array<{ file: string; module: MDXModule<CaseStudyFrontmatter> }>>
>();

function loadAll(tech: Tech, locale: Locale) {
  const key = `${tech}:${locale}`;
  let entry = cache.get(key);
  if (!entry) {
    entry = Promise.all(
      caseStudyFiles(tech, locale).map(async (file) => ({
        file,
        module: await loadCaseStudy(tech, locale, file),
      })),
    );
    cache.set(key, entry);
  }
  return entry;
}

export async function getAllCaseStudies(tech: Tech, locale: Locale): Promise<CaseStudyFrontmatter[]> {
  const all = await loadAll(tech, locale);
  return all.map(({ module }) => module.frontmatter).sort((a, b) => a.order - b.order);
}

export async function getCaseStudyBySlug(tech: Tech, slug: string, locale: Locale) {
  const all = await loadAll(tech, locale);
  const entry = all.find(({ module }) => module.frontmatter.slug === slug);
  if (!entry) return null;
  return {
    frontmatter: entry.module.frontmatter,
    Content: entry.module.default,
  };
}
