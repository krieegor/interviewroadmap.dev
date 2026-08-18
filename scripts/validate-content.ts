import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { z } from "zod";
import { techs, type Tech } from "../src/lib/tech/config";
import {
  caseStudySchema,
  chapterSchema,
  glossarySchema,
  questionSchema,
} from "./content-schemas";

const ROOT = process.cwd();
const LOCALES = ["pt", "en"] as const;
type ContentLocale = (typeof LOCALES)[number];
const TECHS = techs;
type ContentTech = Tech;

type ContentDefinition = {
  label: string;
  dirName: string;
  schema: z.ZodTypeAny;
};

const contentTypes: ContentDefinition[] = [
  { label: "capítulos", dirName: "chapters", schema: chapterSchema },
  { label: "perguntas", dirName: "questions", schema: questionSchema },
  { label: "glossário", dirName: "glossary", schema: glossarySchema },
  { label: "estudos de caso", dirName: "case-studies", schema: caseStudySchema },
];

let hasErrors = false;

function emptySlugsByTechLocale(): Record<ContentTech, Record<ContentLocale, Set<string>>> {
  const result = {} as Record<ContentTech, Record<ContentLocale, Set<string>>>;
  for (const tech of TECHS) {
    result[tech] = { pt: new Set(), en: new Set() };
  }
  return result;
}

const knownChapterSlugs = emptySlugsByTechLocale();
const knownGlossarySlugs = emptySlugsByTechLocale();

function collectSlugs(
  tech: ContentTech,
  dirName: string,
  locale: ContentLocale,
  key: string,
): Set<string> {
  const slugs = new Set<string>();
  const fullDir = path.join(ROOT, "src/content", tech, dirName, locale);
  if (!fs.existsSync(fullDir)) return slugs;
  for (const file of fs.readdirSync(fullDir)) {
    if (!file.endsWith(".mdx")) continue;
    const raw = fs.readFileSync(path.join(fullDir, file), "utf-8");
    const { data } = matter(raw);
    if (typeof data[key] === "string") slugs.add(data[key]);
  }
  return slugs;
}

function validateContentType(tech: ContentTech, { label, dirName, schema }: ContentDefinition) {
  for (const locale of LOCALES) {
    const relDir = `src/content/${tech}/${dirName}`;
    const fullDir = path.join(ROOT, relDir, locale);
    if (!fs.existsSync(fullDir)) {
      console.log(`- ${label} (${tech}/${locale}): diretório não encontrado (${relDir}/${locale}), pulando.`);
      continue;
    }

    const files = fs.readdirSync(fullDir).filter((f) => f.endsWith(".mdx"));
    const slugsSeen = new Set<string>();

    for (const file of files) {
      const filePath = path.join(fullDir, file);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);

      const result = schema.safeParse(data);
      if (!result.success) {
        hasErrors = true;
        console.error(`\n[FRONTMATTER INVÁLIDO] ${relDir}/${locale}/${file}`);
        for (const issue of result.error.issues) {
          console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
        }
        continue;
      }

      const slug = (result.data as { slug: string }).slug;
      if (slugsSeen.has(slug)) {
        hasErrors = true;
        console.error(
          `\n[SLUG DUPLICADO] ${relDir}/${locale}/${file}: slug "${slug}" já usado por outro arquivo.`,
        );
      }
      slugsSeen.add(slug);

      const relatedChapters = (result.data as { relatedChapters?: string[] }).relatedChapters ?? [];
      for (const chapterSlug of relatedChapters) {
        if (!knownChapterSlugs[tech][locale].has(chapterSlug)) {
          hasErrors = true;
          console.error(
            `\n[LINK QUEBRADO] ${relDir}/${locale}/${file}: relatedChapters aponta para capítulo inexistente: "${chapterSlug}"`,
          );
        }
      }

      const internalLinkPattern = new RegExp(
        `\\]\\(/(pt|en)/(${TECHS.join("|")})/(livro|perguntas|glossario|casos)/([a-z0-9-]+)`,
        "g",
      );
      let match: RegExpExecArray | null;
      while ((match = internalLinkPattern.exec(content))) {
        const [, linkLocale, linkTech, section, targetSlug] = match;
        const locSlugs =
          section === "glossario"
            ? knownGlossarySlugs[linkTech as ContentTech][linkLocale as ContentLocale]
            : knownChapterSlugs[linkTech as ContentTech][linkLocale as ContentLocale];
        if ((section === "livro" || section === "glossario") && !locSlugs.has(targetSlug!)) {
          hasErrors = true;
          console.error(
            `\n[LINK QUEBRADO] ${relDir}/${locale}/${file}: link para "${section}" inexistente: "/${linkLocale}/${linkTech}/${section}/${targetSlug}"`,
          );
        }
      }
    }

    console.log(`- ${label} (${tech}/${locale}): ${files.length} arquivo(s) validado(s).`);
  }
}

// Primeira passada: capítulos e glossário, para conhecermos os slugs válidos antes de checar links.
for (const tech of TECHS) {
  for (const locale of LOCALES) {
    knownChapterSlugs[tech][locale] = collectSlugs(tech, "chapters", locale, "slug");
    knownGlossarySlugs[tech][locale] = collectSlugs(tech, "glossary", locale, "slug");
  }
}

console.log("Validando conteúdo...\n");
for (const tech of TECHS) {
  for (const contentType of contentTypes) {
    validateContentType(tech, contentType);
  }
}

if (hasErrors) {
  console.error("\nValidação de conteúdo falhou.");
  process.exit(1);
} else {
  console.log("\nTodo o conteúdo é válido.");
}
