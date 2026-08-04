export type InterviewLevel = "pleno" | "senior" | "tech-lead";

export type ChapterFrontmatter = {
  title: string;
  part: string;
  partOrder: number;
  chapterOrder: number;
  slug: string;
  description: string;
};

export type QuestionFrontmatter = {
  id: number;
  title: string;
  slug: string;
  level: InterviewLevel[];
  topics: string[];
  relatedChapters: string[];
  /** Versão em texto puro da resposta rápida, usada em metadata e JSON-LD (FAQPage). */
  shortAnswer: string;
  /** 4 alternativas estilo Enem (1 correta + 3 distratores) para o modo múltipla escolha do simulador. */
  quiz: {
    options: [string, string, string, string];
    correctIndex: 0 | 1 | 2 | 3;
  };
};

export type GlossaryFrontmatter = {
  term: string;
  slug: string;
  shortDefinition: string;
  relatedTerms: string[];
  relatedChapters: string[];
};

export type CaseStudyFrontmatter = {
  title: string;
  slug: string;
  order: number;
  description: string;
  relatedChapters: string[];
};

export type MDXModule<Frontmatter> = {
  default: React.ComponentType;
  frontmatter: Frontmatter;
};
