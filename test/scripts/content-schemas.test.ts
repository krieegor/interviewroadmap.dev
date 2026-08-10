import { describe, it, expect } from "vitest";
import {
  caseStudySchema,
  chapterSchema,
  glossarySchema,
  questionSchema,
} from "../../scripts/content-schemas";

describe("content-schemas", () => {
  it("chapterSchema aceita frontmatter válido e rejeita campo faltando", () => {
    const valid = {
      title: "Capítulo X",
      part: "Parte I",
      partOrder: 1,
      chapterOrder: 1,
      slug: "capitulo-x",
      description: "Descrição.",
    };
    expect(chapterSchema.safeParse(valid).success).toBe(true);
    expect(chapterSchema.safeParse({ ...valid, title: undefined }).success).toBe(false);
  });

  it("questionSchema rejeita quiz com alternativas duplicadas", () => {
    const valid = {
      id: 1,
      title: "Pergunta X",
      slug: "pergunta-x",
      level: ["pleno"],
      topics: ["fundamentos"],
      relatedChapters: [],
      shortAnswer: "Resposta.",
      quiz: { options: ["A", "B", "C", "D"], correctIndex: 0 },
    };
    expect(questionSchema.safeParse(valid).success).toBe(true);
    expect(
      questionSchema.safeParse({
        ...valid,
        quiz: { options: ["A", "A", "C", "D"], correctIndex: 0 },
      }).success,
    ).toBe(false);
  });

  it("glossarySchema e caseStudySchema aceitam frontmatter válido", () => {
    expect(
      glossarySchema.safeParse({
        term: "Broker",
        slug: "broker",
        shortDefinition: "Definição.",
        relatedTerms: [],
        relatedChapters: [],
      }).success,
    ).toBe(true);
    expect(
      caseStudySchema.safeParse({
        title: "Caso X",
        slug: "caso-x",
        order: 1,
        description: "Descrição.",
        relatedChapters: [],
      }).success,
    ).toBe(true);
  });
});
