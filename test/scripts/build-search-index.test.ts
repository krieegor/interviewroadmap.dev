import { describe, it, expect } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { buildIndex, readFrontmatter } from "../../scripts/build-search-index";

describe("build-search-index", () => {
  it("readFrontmatter extrai o frontmatter de todo .mdx de um diretório", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "search-index-fixture-"));
    fs.writeFileSync(
      path.join(dir, "a.mdx"),
      "---\ntitle: Fixture A\nslug: fixture-a\n---\nConteúdo.",
    );
    fs.writeFileSync(path.join(dir, "nao-e-mdx.txt"), "ignorar");

    const result = readFrontmatter(dir);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ title: "Fixture A", slug: "fixture-a" });
  });

  it("readFrontmatter retorna array vazio pra diretório inexistente", () => {
    expect(readFrontmatter(path.join(os.tmpdir(), "nao-existe-" + Date.now()))).toEqual([]);
  });

  it("buildIndex gera entradas de busca válidas a partir do conteúdo real de kafka/pt", () => {
    const labels = { chapter: "Capítulo", question: "Pergunta", term: "Termo" };
    const index = buildIndex("kafka", "pt", labels);

    expect(index.length).toBeGreaterThan(0);
    for (const entry of index) {
      expect(entry.title.length).toBeGreaterThan(0);
      expect(entry.excerpt.length).toBeGreaterThan(0);
      expect(entry.href.startsWith("/pt/kafka/")).toBe(true);
      expect([labels.chapter, labels.question, labels.term]).toContain(entry.type);
    }
  });
});
