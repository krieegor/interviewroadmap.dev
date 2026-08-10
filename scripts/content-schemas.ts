import { z } from "zod";

// Fonte única de verdade pro formato de frontmatter — usado tanto por validate-content.ts (valida
// todo o conteúdo) quanto por build-search-index.ts (extrai campos pro índice de busca). Os dois
// scripts leem .mdx fora do pipeline de build do Next (não podem reaproveitar src/lib/content/**,
// que faz import() dinâmico — só funciona com o loader MDX do Next).
export const chapterSchema = z.object({
  title: z.string().min(1),
  part: z.string().min(1),
  partOrder: z.number(),
  chapterOrder: z.number(),
  slug: z.string().min(1),
  description: z.string().min(1),
});

export const questionSchema = z.object({
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

export const glossarySchema = z.object({
  term: z.string().min(1),
  slug: z.string().min(1),
  shortDefinition: z.string().min(1),
  relatedTerms: z.array(z.string()),
  relatedChapters: z.array(z.string()),
});

export const caseStudySchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  order: z.number(),
  description: z.string().min(1),
  relatedChapters: z.array(z.string()),
});
