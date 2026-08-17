import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { siteConfig } from "../src/config/site";

const ROOT = process.cwd();
const OUTPUT_PATH = path.join(ROOT, "public", "version.json");

function parseGithubRepo(githubUrl: string): { owner: string; repo: string } | null {
  const match = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/?$/.exec(githubUrl);
  if (!match) return null;
  return { owner: match[1]!, repo: match[2]! };
}

// Busca a release mais recente na GitHub API em vez de ler tags via `git` local: builds em provedores
// de hosting (Vercel/Cloudflare) costumam fazer clone raso sem tags, então `git describe` não é
// confiável ali. A API não depende da profundidade do clone. Falha "suave" de propósito — network
// indisponível, API fora do ar ou nenhuma release ainda não deve derrubar o build (mesmo espírito de
// scripts/generate-pdf.ts pulando o Chromium quando indisponível): o rodapé simplesmente não mostra a
// versão nessa build.
async function main() {
  const repo = parseGithubRepo(siteConfig.githubUrl);
  if (!repo) {
    console.warn(`Não foi possível extrair owner/repo de "${siteConfig.githubUrl}" — pulando versão.`);
    return;
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${repo.owner}/${repo.repo}/releases/latest`,
      { headers: { Accept: "application/vnd.github+json" }, signal: AbortSignal.timeout(10_000) },
    );
    if (!response.ok) {
      console.warn(`GitHub API respondeu ${response.status} — pulando versão no rodapé nesta build.`);
      return;
    }
    const data = (await response.json()) as {
      tag_name?: string;
      html_url?: string;
      published_at?: string;
    };
    if (!data.tag_name || !data.html_url || !data.published_at) {
      console.warn("Resposta da GitHub API sem os campos esperados — pulando versão no rodapé.");
      return;
    }

    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(
      OUTPUT_PATH,
      JSON.stringify({ tag: data.tag_name, url: data.html_url, publishedAt: data.published_at }),
    );
    console.log(`Versão do site: ${data.tag_name} (public/version.json).`);
  } catch (error) {
    console.warn("Falha ao buscar a última release no GitHub — pulando versão no rodapé nesta build.");
    console.warn(String(error));
  }
}

// Sem `process.exit()` de propósito — ao contrário de scripts/generate-pdf.ts (que precisa forçar saída
// pra matar o processo filho `serve`), este script não deixa nenhum handle pendente: o Node encerra
// sozinho assim que a Promise de `main()` resolve. Chamar `process.exit()` logo depois do `fetch` com
// `AbortSignal.timeout()` derruba o build inteiro no Windows (crash de libuv fechando o timer do
// AbortSignal no meio do shutdown forçado — confirmado empiricamente).
const isMainModule = process.argv[1] ? import.meta.url === pathToFileURL(process.argv[1]).href : false;
if (isMainModule) {
  void main();
}
