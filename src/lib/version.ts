import fs from "node:fs";
import path from "node:path";

export type SiteVersion = { tag: string; url: string; publishedAt: string };

const VERSION_FILE = path.join(process.cwd(), "public", "version.json");

// Lê o artefato gerado por scripts/fetch-release-version.ts (prebuild). `null` quando o arquivo não
// existe ainda (clone novo, antes do primeiro `npm run build`) ou quando a busca na GitHub API falhou
// nessa build — nesses casos o rodapé simplesmente não mostra a versão, sem quebrar a página.
export function getSiteVersion(): SiteVersion | null {
  try {
    const raw = fs.readFileSync(VERSION_FILE, "utf-8");
    return JSON.parse(raw) as SiteVersion;
  } catch {
    return null;
  }
}
