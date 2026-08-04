import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const ROOT = process.cwd();
const LOCALES = ["pt", "en"] as const;
type ContentLocale = (typeof LOCALES)[number];

const chapterSchema = z.object({
  title: z.string().min(1),
  part: z.string().min(1),
  partOrder: z.number(),
  chapterOrder: z.number(),
  slug: z.string().min(1),
  description: z.string().min(1),
});

const questionSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  slug: z.string().min(1),
  level: z.array(z.enum(["pleno", "senior", "tech-lead"])).min(1),
  topics: z.array(z.string()).min(1),
  relatedChapters: z.array(z.string()),
  shortAnswer: z.string().min(1),
  quiz: z
    .object({
      options: z.array(z.string().min(1)).length(4),
      correctIndex: z.number().int().min(0).max(3),
    })
    .refine((q) => new Set(q.options).size === q.options.length, {
      message: "quiz.options contém alternativas duplicadas",
    }),
});

const glossarySchema = z.object({
  term: z.string().min(1),
  slug: z.string().min(1),
  shortDefinition: z.string().min(1),
  relatedTerms: z.array(z.string()),
  relatedChapters: z.array(z.string()),
});

const caseStudySchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  order: z.number(),
  description: z.string().min(1),
  relatedChapters: z.array(z.string()),
});

type ContentDefinition = {
  label: string;
  dir: string;
  schema: z.ZodTypeAny;
};

const contentTypes: ContentDefinition[] = [
  { label: "capítulos", dir: "src/content/chapters", schema: chapterSchema },
  { label: "perguntas", dir: "src/content/questions", schema: questionSchema },
  { label: "glossário", dir: "src/content/glossary", schema: glossarySchema },
  { label: "estudos de caso", dir: "src/content/case-studies", schema: caseStudySchema },
];

let hasErrors = false;
const knownChapterSlugs: Record<ContentLocale, Set<string>> = { pt: new Set(), en: new Set() };
const knownGlossarySlugs: Record<ContentLocale, Set<string>> = { pt: new Set(), en: new Set() };

function collectSlugs(dir: string, locale: ContentLocale, key: string): Set<string> {
  const slugs = new Set<string>();
  const fullDir = path.join(ROOT, dir, locale);
  if (!fs.existsSync(fullDir)) return slugs;
  for (const file of fs.readdirSync(fullDir)) {
    if (!file.endsWith(".mdx")) continue;
    const raw = fs.readFileSync(path.join(fullDir, file), "utf-8");
    const { data } = matter(raw);
    if (typeof data[key] === "string") slugs.add(data[key]);
  }
  return slugs;
}

function validateContentType({ label, dir, schema }: ContentDefinition) {
  for (const locale of LOCALES) {
    const fullDir = path.join(ROOT, dir, locale);
    if (!fs.existsSync(fullDir)) {
      console.log(`- ${label} (${locale}): diretório não encontrado (${dir}/${locale}), pulando.`);
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
        console.error(`\n[FRONTMATTER INVÁLIDO] ${dir}/${locale}/${file}`);
        for (const issue of result.error.issues) {
          console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
        }
        continue;
      }

      const slug = (result.data as { slug: string }).slug;
      if (slugsSeen.has(slug)) {
        hasErrors = true;
        console.error(
          `\n[SLUG DUPLICADO] ${dir}/${locale}/${file} — slug "${slug}" já usado por outro arquivo.`,
        );
      }
      slugsSeen.add(slug);

      const relatedChapters = (result.data as { relatedChapters?: string[] }).relatedChapters ?? [];
      for (const chapterSlug of relatedChapters) {
        if (!knownChapterSlugs[locale].has(chapterSlug)) {
          hasErrors = true;
          console.error(
            `\n[LINK QUEBRADO] ${dir}/${locale}/${file} — relatedChapters aponta para capítulo inexistente: "${chapterSlug}"`,
          );
        }
      }

      const internalLinkPattern = /\]\(\/(pt|en)\/(livro|perguntas|glossario|casos)\/([a-z0-9-]+)/g;
      let match: RegExpExecArray | null;
      while ((match = internalLinkPattern.exec(content))) {
        const [, linkLocale, section, targetSlug] = match;
        const locSlugs =
          section === "glossario"
            ? knownGlossarySlugs[linkLocale as ContentLocale]
            : knownChapterSlugs[linkLocale as ContentLocale];
        if ((section === "livro" || section === "glossario") && !locSlugs.has(targetSlug!)) {
          hasErrors = true;
          console.error(
            `\n[LINK QUEBRADO] ${dir}/${locale}/${file} — link para "${section}" inexistente: "/${linkLocale}/${section}/${targetSlug}"`,
          );
        }
      }
    }

    console.log(`- ${label} (${locale}): ${files.length} arquivo(s) validado(s).`);
  }
}

// Primeira passada: capítulos e glossário, para conhecermos os slugs válidos antes de checar links.
for (const locale of LOCALES) {
  knownChapterSlugs[locale] = collectSlugs("src/content/chapters", locale, "slug");
  knownGlossarySlugs[locale] = collectSlugs("src/content/glossary", locale, "slug");
}

console.log("Validando conteúdo...\n");
for (const contentType of contentTypes) {
  validateContentType(contentType);
}

if (hasErrors) {
  console.error("\nValidação de conteúdo falhou.");
  process.exit(1);
} else {
  console.log("\nTodo o conteúdo é válido.");
}
