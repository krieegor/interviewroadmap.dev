import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();

const IGNORED_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  "out",
  ".wrangler",
  "coverage",
  "test-results",
  "playwright-report",
  "blob-report",
  ".turbo",
  // conteúdo de terceiros instalado via `npx skills add`, gerenciado pela ferramenta, não é código/prosa
  // do projeto (mesmo tratamento do .gitignore e do eslint.config.mjs).
  ".agents",
  ".claude",
]);

// Extensões de arquivo de texto/prosa relevantes pra regra do CLAUDE.md ("Regras de ouro" §1). Binários
// (imagens, PDF, fontes) não entram na varredura.
const TEXT_EXTENSIONS = new Set([
  ".md",
  ".mdx",
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".css",
  ".yml",
  ".yaml",
  ".txt",
]);

const DASH_PATTERN = /[—–]/;

// Este próprio arquivo contém os caracteres de travessão como dado (allowlist, regex, mensagens de erro),
// não como prosa: teria centenas de "violações" contra si mesmo se entrasse na varredura.
const IGNORED_FILES = new Set(["scripts/check-no-dashes.ts"]);

// Cada exceção é (arquivo, linha, trecho exato da linha no momento em que foi revisada e justificada).
// Se a linha mudar, o trecho não vai mais bater e a ocorrência passa a ser tratada como nova (precisa de
// nova revisão), em vez de silenciosamente continuar liberada. Ver CLAUDE.md "Regras de ouro" §1 pela
// regra completa e specs/roadmap.md pelo histórico da limpeza que gerou esta lista.
const ALLOWLIST: { file: string; line: number; snippet: string }[] = [
  {
    file: "README.md",
    line: 61,
    snippet: "├── app/            # rotas (App Router) — /[locale]/[tech]/...",
  },
  {
    file: "CLAUDE.md",
    line: 26,
    snippet:
      "- Do not use em dashes (—) or en dashes (–) as punctuation in generated prose. Rewrite the sentence using",
  },
  {
    file: "docs/content-authoring.md",
    line: 47,
    snippet: '   part: "Parte II — Arquitetura"',
  },
  {
    file: "docs/content-authoring.md",
    line: 80,
    snippet: '       - "Distrator 1 — idealmente adaptado de uma <Pegadinha> desta mesma pergunta."',
  },
  {
    file: "docs/content-authoring.md",
    line: 81,
    snippet: '       - "Distrator 2 — confusão com conceito adjacente."',
  },
  {
    file: "docs/content-authoring.md",
    line: 82,
    snippet: '       - "Distrator 3 — generalização ou escopo errado."',
  },
  {
    file: "docs/adding-a-tech.md",
    line: 42,
    snippet: '    description: "Trilha de preparação para entrevistas de X — em construção.",',
  },
  {
    file: "docs/adding-a-tech.md",
    line: 47,
    snippet: '    description: "X interview prep track — coming soon.",',
  },
  {
    file: "specs/design-system.md",
    line: 68,
    snippet: "  --color-surface: #f1f5f9; /* slate-100 — blocos de código/callout */",
  },
  {
    file: "specs/architecture.md",
    line: 49,
    snippet: '# src/content/java/**, src/content/elastic/** ainda não existem — trilhas "em breve", sem arquivos.',
  },
  {
    file: "specs/architecture.md",
    line: 88,
    snippet: "├── app/            # rotas (App Router) — sem lógica de negócio, sem texto",
  },
  {
    file: "specs/architecture.md",
    line: 98,
    snippet: "│   ├── content/     # loaders (getAllChapters, getChapterBySlug, getAllQuestions, ...) — recebem (tech, locale)",
  },
  {
    file: "specs/architecture.md",
    line: 103,
    snippet: "├── types/           # tipos compartilhados (Chapter, Question, GlossaryTerm, CaseStudy) — sem campo tech,",
  },
  {
    file: "src/components/diagrams/OffsetCommitDiagram.tsx",
    line: 104,
    snippet: "        offsets 4–6: já processados, ainda não commitados; reprocessados se o consumer cair agora",
  },
];

function isAllowed(file: string, line: number, text: string): boolean {
  return ALLOWLIST.some(
    (entry) => entry.file === file && entry.line === line && entry.snippet === text,
  );
}

function walk(dir: string, files: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (TEXT_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

function main() {
  const files = walk(ROOT);
  const violations: { file: string; line: number; text: string }[] = [];

  for (const absolutePath of files) {
    const relativePath = path.relative(ROOT, absolutePath).split(path.sep).join("/");
    if (IGNORED_FILES.has(relativePath)) continue;
    const lines = fs.readFileSync(absolutePath, "utf-8").split("\n");
    lines.forEach((text, index) => {
      if (!DASH_PATTERN.test(text)) return;
      const line = index + 1;
      if (isAllowed(relativePath, line, text)) return;
      violations.push({ file: relativePath, line, text });
    });
  }

  if (violations.length > 0) {
    console.error(`Encontrado(s) ${violations.length} travessão(ões) (— ou –) fora da allowlist:\n`);
    for (const v of violations) {
      console.error(`  ${v.file}:${v.line}: ${v.text.trim()}`);
    }
    console.error(
      "\nRegra: CLAUDE.md \"Regras de ouro\" §1. Reescreva a frase (vírgula, dois-pontos, ponto-e-vírgula," +
        " parênteses, ponto final ou reestruturação) em vez de trocar o caractere. Se for uma exceção" +
        " técnica legítima (bloco de código, intervalo numérico), adicione a linha à ALLOWLIST em" +
        " scripts/check-no-dashes.ts com o trecho exato.",
    );
    process.exit(1);
  }

  console.log(`OK: nenhum travessão fora da allowlist (${ALLOWLIST.length} exceções conhecidas).`);
}

const isMainModule = process.argv[1] ? import.meta.url === pathToFileURL(process.argv[1]).href : false;
if (isMainModule) {
  main();
}
