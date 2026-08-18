import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import matter from "gray-matter";
import { locales, type Locale } from "../src/lib/i18n/config";
import { getDictionary } from "../src/lib/i18n/get-dictionary";
import { techsWithContent, type Tech } from "../src/lib/tech/config";
import type { SearchEntry } from "../src/types/content";
import { chapterSchema, glossarySchema, questionSchema } from "./content-schemas";

// Não reaproveita src/lib/content/** (getAllChapters etc.) porque esses loaders fazem `import()`
// dinâmico de .mdx: só funciona dentro do pipeline de build do Next (loader MDX registrado via
// @next/mdx), não num script `tsx` solto. Lê frontmatter direto com gray-matter, igual
// scripts/validate-content.ts, e valida com o mesmo schema, pra não confiar em cast sem checagem.
const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, "public", "search-index");

export function readFrontmatter(dir: string): Record<string, unknown>[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => matter(fs.readFileSync(path.join(dir, file), "utf-8")).data);
}

export function buildIndex(tech: Tech, locale: Locale, typeLabels: { chapter: string; question: string; term: string }): SearchEntry[] {
  const base = path.join(ROOT, "src/content", tech);

  const chapters = readFrontmatter(path.join(base, "chapters", locale)).map((raw): SearchEntry => {
    const data = chapterSchema.parse(raw);
    return {
      type: typeLabels.chapter,
      title: data.title,
      excerpt: data.description,
      href: `/${locale}/${tech}/livro/${data.slug}`,
    };
  });

  const questions = readFrontmatter(path.join(base, "questions", locale)).map((raw): SearchEntry => {
    const data = questionSchema.parse(raw);
    return {
      type: typeLabels.question,
      title: data.title,
      excerpt: data.shortAnswer,
      href: `/${locale}/${tech}/perguntas/${data.slug}`,
    };
  });

  const terms = readFrontmatter(path.join(base, "glossary", locale)).map((raw): SearchEntry => {
    const data = glossarySchema.parse(raw);
    return {
      type: typeLabels.term,
      title: data.term,
      excerpt: data.shortDefinition,
      href: `/${locale}/${tech}/glossario/${data.slug}`,
    };
  });

  return [...chapters, ...questions, ...terms];
}

function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const locale of locales) {
    const dict = getDictionary(locale);
    const typeLabels = {
      chapter: dict.search.typeChapter,
      question: dict.search.typeQuestion,
      term: dict.search.typeTerm,
    };
    for (const tech of techsWithContent) {
      const index = buildIndex(tech, locale, typeLabels);
      const filePath = path.join(OUTPUT_DIR, `${tech}-${locale}.json`);
      fs.writeFileSync(filePath, JSON.stringify(index));
      console.log(`Índice de busca gerado: public/search-index/${tech}-${locale}.json (${index.length} itens).`);
    }
  }
}

// Só roda o build ao executar `tsx scripts/build-search-index.ts` diretamente: permite importar
// buildIndex/readFrontmatter em teste sem disparar o efeito colateral de escrever arquivos.
const isMainModule = process.argv[1] ? import.meta.url === pathToFileURL(process.argv[1]).href : false;
if (isMainModule) {
  main();
}
